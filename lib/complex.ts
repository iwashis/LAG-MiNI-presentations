// Tiny complex-number helpers shared by the geometry widgets.
export interface C { re: number; im: number }

export const add = (z: C, w: C): C => ({ re: z.re + w.re, im: z.im + w.im })
export const mul = (z: C, w: C): C => ({
  re: z.re * w.re - z.im * w.im,
  im: z.re * w.im + z.im * w.re,
})
export const conj = (z: C): C => ({ re: z.re, im: -z.im })
export const mod = (z: C): number => Math.hypot(z.re, z.im)
export const arg = (z: C): number => Math.atan2(z.im, z.re)
export const fromPolar = (r: number, phi: number): C => ({
  re: r * Math.cos(phi),
  im: r * Math.sin(phi),
})

const round = (x: number, d = 2) => {
  const p = 10 ** d
  const r = Math.round(x * p) / p
  return Object.is(r, -0) ? 0 : r
}

/** "a + bi" with sensible rounding, for widget readouts. */
export function fmt(z: C, d = 2): string {
  const a = round(z.re, d)
  const b = round(z.im, d)
  if (b === 0) return `${a}`
  if (a === 0) return b === 1 ? 'i' : b === -1 ? '−i' : `${b}i`
  const sign = b < 0 ? '−' : '+'
  const babs = Math.abs(b)
  return `${a} ${sign} ${babs === 1 ? '' : babs}i`
}

export const fmtNum = (x: number, d = 2): string => `${round(x, d)}`.replace('-', '−')

/** Argument as a friendly string, in units of pi when close to a nice fraction. */
export function fmtArg(phi: number): string {
  const frac = phi / Math.PI
  for (const den of [1, 2, 3, 4, 6, 8, 12]) {
    const num = frac * den
    if (Math.abs(num - Math.round(num)) < 1e-9) {
      const n = Math.round(num)
      if (n === 0) return '0'
      const s = n < 0 ? '−' : ''
      const an = Math.abs(n)
      if (den === 1) return `${s}${an === 1 ? '' : an}π`
      return `${s}${an === 1 ? '' : an}π/${den}`
    }
  }
  return `${fmtNum(phi, 2)} rad`
}
