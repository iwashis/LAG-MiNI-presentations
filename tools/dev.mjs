#!/usr/bin/env node
// dev runner: compile src/*.tex, watch for changes, launch the Slidev dev
// server for the given lecture (default: 01-complex).
//   node tools/dev.mjs [lecture-name]

import { spawn } from 'node:child_process'
import { watch } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const lecture = process.argv[2] ?? '01-complex'

function compile() {
  const r = spawn(process.execPath, [join(ROOT, 'tools/tex2slides.mjs')], { stdio: 'inherit' })
  return new Promise(res => r.on('exit', res))
}

await compile()

let timer = null
watch(join(ROOT, 'src'), () => {
  clearTimeout(timer)
  timer = setTimeout(compile, 150) // debounce editor write bursts
})

// Slidev hot-reloads the generated .md on change.
spawn('npx', ['slidev', `${lecture}.md`, '--open'], { cwd: ROOT, stdio: 'inherit' })
