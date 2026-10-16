#!/usr/bin/env node
// tex2slides — compiles the beamer-flavoured LaTeX dialect in src/*.tex
// into Slidev markdown decks at the project root.
//
// Supported dialect (see README.md):
//   \lecture{Title}{Kicker}{Subtitle}          cover slide + deck metadata
//   \section{Name}                             section divider slide
//   \begin{frame}{Title} ... \end{frame}       one slide
//   \pause                                     incremental reveal
//   \begin{definition}[opt] ... \end{...}      theorem-style boxes; also:
//     theorem lemma corollary proposition fact observation example remark
//     warning proof
//   \begin{itemize}/\begin{enumerate} + \item  lists
//   \begin{columns} ... \column ... \end{columns}
//   \begin{steps}[stack|replace] \step[caption]{TeX} ... \end{steps}
//   \widget{Component}{key=value, ...}         interactive component
//   \note{...}                                 presenter notes
//   $...$ and \[...\]                           math (KaTeX, book macros)

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'src')

const THM = {
  definition: ['def', 'Definition'],
  theorem: ['theo', 'Theorem'],
  lemma: ['theo', 'Lemma'],
  corollary: ['theo', 'Corollary'],
  proposition: ['theo', 'Proposition'],
  example: ['ex', 'Example'],
  fact: ['rem', 'Fact'],
  observation: ['rem', 'Observation'],
  remark: ['rem', 'Remark'],
  warning: ['warn', 'Warning'],
  proof: ['rem', 'Proof'],
}

// ---------------------------------------------------------------- utilities

/** Balanced-brace argument starting at s[i] === '{'. Returns [content, nextIndex]. */
function braceArg(s, i) {
  if (s[i] !== '{') throw new Error(`expected '{' at index ${i}: ...${s.slice(Math.max(0, i - 30), i + 10)}`)
  let depth = 0
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{' && s[j - 1] !== '\\') depth++
    else if (s[j] === '}' && s[j - 1] !== '\\') {
      depth--
      if (depth === 0) return [s.slice(i + 1, j), j + 1]
    }
  }
  throw new Error('unbalanced braces')
}

/** Replace every \cmd{a}{b}... occurrence using a brace-aware scanner. */
function replaceCommand(text, cmd, argCount, fn) {
  let out = ''
  let i = 0
  const needle = `\\${cmd}`
  while (true) {
    const at = text.indexOf(needle, i)
    if (at === -1) {
      out += text.slice(i)
      break
    }
    // make sure it is not a longer command name
    const after = text[at + needle.length]
    if (after && /[a-zA-Z]/.test(after)) {
      out += text.slice(i, at + needle.length)
      i = at + needle.length
      continue
    }
    out += text.slice(i, at)
    let j = at + needle.length
    const args = []
    for (let k = 0; k < argCount; k++) {
      while (/\s/.test(text[j])) j++
      const [content, nj] = braceArg(text, j)
      args.push(content)
      j = nj
    }
    out += fn(...args)
    i = j
  }
  return out
}

/** Translate every \begin{name}[opt]...\end{name} (same-name envs must not nest). */
function translateEnv(text, name, fn) {
  const re = new RegExp(
    `\\\\begin\\{${name}\\}(?:\\[([^\\]]*)\\])?([\\s\\S]*?)\\\\end\\{${name}\\}`,
  )
  let out = text
  for (let guard = 0; guard < 500; guard++) {
    const m = out.match(re)
    if (!m) break
    out = out.slice(0, m.index) + fn(m[2], m[1]) + out.slice(m.index + m[0].length)
  }
  return out
}

const escJs = s =>
  s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\s+/g, ' ').trim()

// ------------------------------------------------------------ math shelter

function shelterMath(tex, store) {
  const stash = md => {
    store.push(md)
    return `❢M${store.length - 1}❢`
  }
  tex = tex.replace(/\\\[([\s\S]*?)\\\]/g, (_, m) => stash(`\n\n$$\n${m.trim()}\n$$\n\n`))
  tex = tex.replace(/\$([^$]+?)\$/g, (_, m) => stash(`$${m}$`))
  return tex
}
const restoreMath = (text, store) =>
  text.replace(/❢M(\d+)❢/g, (_, i) => store[+i])

// -------------------------------------------------------------- translation

function widgetTag(name, propStr) {
  const props = propStr
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map((kv) => {
      const eq = kv.indexOf('=')
      const k = kv.slice(0, eq).trim()
      const v = kv.slice(eq + 1).trim()
      if (/^-?\d+(\.\d+)?$/.test(v) || v === 'true' || v === 'false') return `:${k}="${v}"`
      return `${k}="${v}"`
    })
    .join(' ')
  return `\n\n<div class="widget"><${name} ${props} /></div>\n\n`
}

function stepsEnv(body, mode) {
  const steps = []
  const captions = []
  let i = 0
  while (true) {
    const at = body.indexOf('\\step', i)
    if (at === -1) break
    let j = at + 5
    while (/\s/.test(body[j])) j++
    let cap = ''
    if (body[j] === '[') {
      const end = body.indexOf(']', j)
      cap = body.slice(j + 1, end)
      j = end + 1
      while (/\s/.test(body[j])) j++
    }
    const [content, nj] = braceArg(body, j)
    steps.push(escJs(content))
    captions.push(escJs(cap))
    i = nj
  }
  const modeAttr = mode === 'replace' ? ' mode="replace"' : ''
  const stepsAttr = `[${steps.map(s => `'${s}'`).join(', ')}]`
  const capsAttr = `[${captions.map(s => `'${s}'`).join(', ')}]`
  return `\n\n<StepThrough${modeAttr} :steps="${stepsAttr}" :captions="${capsAttr}" />\n\n`
}

function mdList(body, ordered) {
  // \pause between items → Slidev <v-clicks> (item-by-item reveal)
  const hasPause = /\\pause\b/.test(body)
  body = body.replace(/\\pause\b/g, '')
  const items = body.split(/\\item\b/).map(s => s.trim()).filter(Boolean)
  const lines = items.map((it, idx) => {
    const bullet = ordered ? `${idx + 1}. ` : '- '
    return bullet + it.replace(/\n{2,}/g, '\n').replace(/\n/g, '\n  ')
  })
  const list = lines.join('\n')
  return hasPause
    ? `\n\n<v-clicks>\n\n${list}\n\n</v-clicks>\n\n`
    : `\n\n${list}\n\n`
}

function thmBox(env, body, title) {
  const [cls, label] = THM[env]
  const heading = title ? `${label} — ${title}` : label
  const tail = env === 'proof' ? ' ∎' : ''
  body = body.replace(/\\pause\b/g, '') // boxes reveal as one unit
  return `\n\n<div class="thm ${cls}">\n\n<span class="lbl">${heading}</span>\n\n${body.trim()}${tail}\n\n</div>\n\n`
}

/** Translate frame/box body text (math already sheltered). */
function translateBody(tex) {
  // structural environments (innermost lists first)
  tex = translateEnv(tex, 'itemize', b => mdList(b, false))
  tex = translateEnv(tex, 'enumerate', b => mdList(b, true))
  tex = translateEnv(tex, 'steps', (b, opt) => stepsEnv(b, opt))
  for (const env of Object.keys(THM))
    tex = translateEnv(tex, env, (b, opt) => thmBox(env, translateBody0(b), opt))
  tex = translateEnv(tex, 'columns', (b) => {
    b = b.replace(/\\pause\b/g, '') // a split inside the grid would break the layout
    const cols = b.split(/\\column\b/).map(s => s.trim()).filter(Boolean)
    const cells = cols.map(c => `<div>\n\n${translateBody0(c)}\n\n</div>`).join('\n\n')
    return `\n\n<div class="cols">\n\n${cells}\n\n</div>\n\n`
  })
  return translateBody0(tex)
}

/** Inline-level commands only (no environments). */
function translateBody0(tex) {
  tex = replaceCommand(tex, 'widget', 2, (name, props) => widgetTag(name, props))
  tex = replaceCommand(tex, 'emph', 1, s => `*${s}*`)
  tex = replaceCommand(tex, 'textit', 1, s => `*${s}*`)
  tex = replaceCommand(tex, 'textbf', 1, s => `**${s}**`)
  tex = tex
    .replace(/\\ldots|\\dots/g, '…')
    .replace(/\\noindent|\\medskip|\\smallskip|\\bigskip/g, '')
    // text-mode spacing commands become a plain space
    .replace(/\\(?:hfill|quad|qquad)\b/g, ' ')
    .replace(/\\ /g, ' ')
    .replace(/(?<!\\)~/g, ' ')
    .replace(/\\%/g, '%')
  return tex
}

// ------------------------------------------------------------------ frames

function compileLecture(tex, name) {
  const mathStore = []
  // strip comments (line-wise, respecting \%), then shelter math
  tex = tex.split('\n').map(l => l.replace(/(?<!\\)%.*$/, '')).join('\n')
  tex = shelterMath(tex, mathStore)

  let title = name
  let kicker = ''
  let subtitle = ''
  tex = replaceCommand(tex, 'lecture', 3, (t, k, s) => {
    title = t
    kicker = k
    subtitle = s
    return ''
  })

  const slides = []

  // cover
  slides.push({
    front: null,
    body: `<div class="kicker">${kicker}</div>\n\n# ${title}\n\n<div class="subtitle">${subtitle}</div>`,
  })

  // walk top level: sections and frames, in document order
  let sectionNo = 0
  const tokenRe = /\\section\{([^}]*)\}|\\begin\{frame\}\{([^}]*)\}([\s\S]*?)\\end\{frame\}/g
  let m
  while ((m = tokenRe.exec(tex)) !== null) {
    if (m[1] !== undefined) {
      sectionNo++
      const nn = String(sectionNo).padStart(2, '0')
      slides.push({
        front: 'class: section-slide\ntransition: fade',
        body: `<div class="sec-num">${nn}</div>\n\n<div class="kicker">Section ${nn}</div>\n\n# ${m[1]}`,
      })
    }
    else {
      const frameTitle = m[2]
      let body = m[3]
      // presenter notes
      let note = ''
      body = replaceCommand(body, 'note', 1, (n) => {
        note = n.trim()
        return ''
      })
      // translate first (envs may consume their own \pause markers),
      // then split the remaining top-level \pause into v-click chunks
      const translated = translateBody(body)
      const chunks = translated.split(/\\pause\b/)
      const parts = chunks.map((c, i) => {
        const t = c.trim()
        if (!t) return ''
        return i === 0 ? t : `<v-click>\n\n${t}\n\n</v-click>`
      }).filter(Boolean)
      let slide = `# ${frameTitle}\n\n${parts.join('\n\n')}`
      if (note) slide += `\n\n<!--\n${note}\n-->`
      slides.push({ front: null, body: slide })
    }
  }

  // assemble
  const head = [
    '---',
    'theme: default',
    `title: ${title}`,
    'transition: slide-left',
    'class: cover',
    'fonts:',
    '  provider: none',
    '---',
  ].join('\n')

  const out = [head]
  slides.forEach((s, i) => {
    if (i === 0) {
      out.push(s.body)
      return
    }
    out.push(s.front ? `---\n${s.front}\n---` : '---')
    out.push(s.body)
  })

  let md = out.join('\n\n') + '\n'
  md = restoreMath(md, mathStore)
  // collapse excessive blank lines
  md = md.replace(/\n{3,}/g, '\n\n')
  return md
}

// -------------------------------------------------------------------- main

const files = readdirSync(SRC).filter(f => f.endsWith('.tex'))
if (files.length === 0) {
  console.error('no .tex files in src/')
  process.exit(1)
}
for (const f of files) {
  const name = basename(f, '.tex')
  const tex = readFileSync(join(SRC, f), 'utf8')
  try {
    const md = compileLecture(tex, name)
    writeFileSync(join(ROOT, `${name}.md`), md)
    console.log(`✓ ${f} → ${name}.md`)
  }
  catch (err) {
    console.error(`✗ ${f}: ${err.message}`)
    process.exitCode = 1
  }
}
