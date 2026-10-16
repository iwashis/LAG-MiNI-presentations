# Animated lectures

Web slide decks for the Linear Algebra book, authored in a **beamer-flavoured
LaTeX dialect** and compiled to [Slidev](https://sli.dev) presentations.

## Commands

```sh
npm run dev            # compile + watch src/, open dev server (default lecture)
node tools/dev.mjs 01-complex   # same, explicit lecture
npm run build          # static site → dist/01-complex/ (deployable anywhere)
npm run export         # PDF export
```

During `npm run dev`, edits to `src/*.tex` recompile and hot-reload in the
browser. Presenter mode: press `p` or open `/presenter`. Dark mode: press `d`.

## Authoring — the LaTeX dialect

One lecture = one file in `src/`. Math uses the book's macros (`\K`, `\R`,
`\C`, `\Span{...}`, …) via KaTeX.

```latex
\lecture{Title}{Kicker line}{Subtitle line}   % cover slide, once per file

\section{Polar form}                          % section divider slide

\begin{frame}{Frame title}
Text with inline $z = a+bi$ and display math:
\[ z^n = |z|^n(\cos n\varphi + i\sin n\varphi) \]

\pause                                        % reveal the rest on click

\begin{theorem}      % also: definition lemma corollary proposition fact
...                  %       observation example remark warning proof
\end{theorem}        % optional title: \begin{theorem}[De Moivre]

\begin{itemize}      % \pause between \item's = reveal item by item
\item first \pause
\item second
\end{itemize}

\begin{columns}      % two-column layout
\column left content
\column right content
\end{columns}

\begin{steps}                       % animated multi-step computation
\step[caption]{(2+3i)(1-2i) = 2-4i+3i-6i^2}   % TeX, no $...$ needed
\step{= 8 - i}
\end{steps}          % \begin{steps}[replace] shows one step at a time

\widget{CPlane}{re=2, im=1.5, showConj=true}  % interactive component
\note{Presenter notes, visible only in presenter mode.}
\end{frame}
```

Constraints (kept deliberately strict): `\pause` works at frame top level and
between list items; display math belongs at top level or in boxes, not inside
list items; `%` starts a comment (write `\%` for a percent sign).

## Widgets (`components/`)

| Widget | Props | Purpose |
|---|---|---|
| `CPlane` | `re, im, label, showConj, showPolar, circleRe/Im/R, size, range` | draggable point on the complex plane with live readouts |
| `ComplexMul` | `size, range` | drag $z$ and $w$, see $z\cdot w$: moduli multiply, arguments add |
| `RootsOfUnity` | `n, size` | $n$-th roots on the unit circle, rotate by $z_1$ |
| `StepThrough` | `steps, captions, mode` | generic step player (emitted by `steps` env) |

New widgets: drop a `.vue` file in `components/` (auto-registered), use TeX
via `lib/tex-macros.ts` + `katex`, palette via CSS vars (`--c-def`, `--c-thm`,
`--c-ex`, `--c-warn`, `--c-rem`, `--accent`, `--ink`, `--paper-soft`).

## Structure

```
src/*.tex               lecture sources (the only files you edit day-to-day)
tools/tex2slides.mjs    LaTeX → Slidev markdown compiler
tools/dev.mjs           compile + watch + dev server
components/             interactive widgets (Vue + SVG)
lib/                    complex arithmetic, shared KaTeX macros
setup/katex.ts          KaTeX config (book macros)
style.css               visual theme (matches the book's palette)
*.md                    generated — do not edit
```
