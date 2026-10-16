// KaTeX macros mirroring the book's LaTeX preamble (LinearAlgebra.tex).
// Used both by Slidev's markdown math transform (setup/katex.ts) and by
// components that render TeX at runtime (StepThrough.vue).
export const texMacros: Record<string, string> = {
  '\\K': '\\mathbb{K}',
  '\\R': '\\mathbb{R}',
  '\\C': '\\mathbb{C}',
  '\\N': '\\mathbb{N}',
  '\\Q': '\\mathbb{Q}',
  '\\Z': '\\mathbb{Z}',
  '\\V': '\\mathbf{V}',
  '\\W': '\\mathbf{W}',
  '\\vv': '\\mathbf{v}',
  '\\uu': '\\mathbf{u}',
  '\\ww': '\\mathbf{w}',
  '\\0': '\\mathbf{0}',
  '\\Span': '\\operatorname{span}\\!\\left(#1\\right)',
  '\\rank': '\\operatorname{r}',
  '\\Re': '\\mathfrak{Re}',
  '\\Im': '\\mathfrak{Im}',
}
