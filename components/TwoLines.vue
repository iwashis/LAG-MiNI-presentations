<script setup lang="ts">
import { computed, ref } from 'vue'
import { fmtNum } from '../lib/complex'

/**
 * Geometry of a 2×2 linear system:
 *   a1 x + b1 y = c1
 *   a2 x + b2 y = c2
 * Two lines: intersecting (unique), parallel (none), coincident (infinitely many).
 */
const props = withDefaults(defineProps<{
  size?: number
  range?: number
}>(), {
  size: 380,
  range: 4,
})

const co = ref({ a1: 1, b1: 1, c1: 1, a2: 1, b2: -1, c2: 0 })

const presets: Record<string, typeof co.value> = {
  'one solution': { a1: 1, b1: 1, c1: 1, a2: 1, b2: -1, c2: 0 },
  'no solutions': { a1: 1, b1: 2, c1: 0, a2: 1, b2: 2, c2: 2 },
  'infinitely many': { a1: 1, b1: 2, c1: 2, a2: 2, b2: 4, c2: 4 },
}
const active = ref('one solution')
function setPreset(name: string) {
  co.value = { ...presets[name] }
  active.value = name
}

const det = computed(() => co.value.a1 * co.value.b2 - co.value.b1 * co.value.a2)
const detAug1 = computed(() => co.value.a1 * co.value.c2 - co.value.c1 * co.value.a2)
const detAug2 = computed(() => co.value.b1 * co.value.c2 - co.value.c1 * co.value.b2)

const kind = computed(() => {
  if (Math.abs(det.value) > 1e-9) return 'unique'
  return (Math.abs(detAug1.value) < 1e-9 && Math.abs(detAug2.value) < 1e-9) ? 'many' : 'none'
})
const sol = computed(() => kind.value === 'unique'
  ? {
      x: (co.value.c1 * co.value.b2 - co.value.b1 * co.value.c2) / det.value,
      y: (co.value.a1 * co.value.c2 - co.value.c1 * co.value.a2) / det.value,
    }
  : null)

const scale = computed(() => props.size / (2 * props.range))
const px = (p: { x: number, y: number }) => ({
  x: props.size / 2 + p.x * scale.value,
  y: props.size / 2 - p.y * scale.value,
})

/** endpoints of a x + b y = c clipped far outside the viewport */
function linePts(a: number, b: number, c: number) {
  const R = props.range * 3
  if (Math.abs(b) > Math.abs(a)) {
    const y = (x: number) => (c - a * x) / b
    return { p1: px({ x: -R, y: y(-R) }), p2: px({ x: R, y: y(R) }) }
  }
  if (Math.abs(a) < 1e-12) return { p1: px({ x: 0, y: 0 }), p2: px({ x: 0, y: 0 }) }
  const x = (y: number) => (c - b * y) / a
  return { p1: px({ x: x(-R), y: -R }), p2: px({ x: x(R), y: R }) }
}
const l1 = computed(() => linePts(co.value.a1, co.value.b1, co.value.c1))
const l2 = computed(() => linePts(co.value.a2, co.value.b2, co.value.c2))
const psol = computed(() => sol.value ? px(sol.value) : null)

const ticks = computed(() => {
  const t: number[] = []
  for (let i = -Math.floor(props.range); i <= Math.floor(props.range); i++)
    if (i !== 0) t.push(i)
  return t
})
const term = (v: number, s: string) => `${fmtNum(v, 1)}${s}`
</script>

<template>
  <div class="twolines">
    <div class="presets">
      <button
        v-for="(_, name) in presets" :key="name"
        :class="{ on: active === name }" @click="setPreset(name as string)"
      >{{ name }}</button>
    </div>

    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <g stroke="var(--ink-muted)" stroke-opacity="0.16">
        <line v-for="t in ticks" :key="'v' + t" :x1="size/2 + t*scale" y1="0" :x2="size/2 + t*scale" :y2="size" />
        <line v-for="t in ticks" :key="'h' + t" x1="0" :y1="size/2 + t*scale" :x2="size" :y2="size/2 + t*scale" />
      </g>
      <g stroke="var(--ink-muted)" stroke-opacity="0.55" stroke-width="1.2">
        <line :x1="6" :y1="size/2" :x2="size-6" :y2="size/2" />
        <line :x1="size/2" :y1="size-6" :x2="size/2" :y2="6" />
      </g>

      <line :x1="l1.p1.x" :y1="l1.p1.y" :x2="l1.p2.x" :y2="l1.p2.y" stroke="var(--c-def)" stroke-width="2.6" />
      <line
        :x1="l2.p1.x" :y1="l2.p1.y" :x2="l2.p2.x" :y2="l2.p2.y" stroke="var(--c-ex)" stroke-width="2.6"
        :stroke-dasharray="kind === 'many' ? '7 7' : undefined"
      />

      <g v-if="psol">
        <circle :cx="psol.x" :cy="psol.y" r="6.5" fill="var(--c-thm)" />
      </g>
    </svg>

    <div class="eqs">
      <span class="e1">{{ term(co.a1, 'x') }} + {{ term(co.b1, 'y') }} = {{ fmtNum(co.c1, 1) }}</span>
      <span class="e2">{{ term(co.a2, 'x') }} + {{ term(co.b2, 'y') }} = {{ fmtNum(co.c2, 1) }}</span>
    </div>

    <div class="readout">
      <span v-if="kind === 'unique'">lines cross once — unique solution
        ({{ fmtNum(sol!.x, 2) }}, {{ fmtNum(sol!.y, 2) }})</span>
      <span v-else-if="kind === 'none'" class="warn">parallel lines — no solutions</span>
      <span v-else class="many">the same line twice — infinitely many solutions</span>
    </div>
  </div>
</template>

<style scoped>
.twolines { display: inline-flex; flex-direction: column; align-items: center; gap: 0.45rem; }
svg { border-radius: 12px; background: var(--paper-soft); }
.presets { display: flex; gap: 0.5rem; }
.presets button {
  border: 1px solid var(--accent); color: var(--accent); background: transparent;
  border-radius: 999px; padding: 0.18rem 0.75rem; font-size: 0.82rem; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.presets button.on, .presets button:hover { background: var(--accent); color: var(--paper); }
.eqs { display: flex; gap: 1.6rem; font-size: 0.95rem; font-variant-numeric: tabular-nums; }
.e1 { color: var(--c-def); font-weight: 600; }
.e2 { color: var(--c-ex); font-weight: 600; }
.readout { font-size: 0.92rem; color: var(--ink-muted); }
.warn { color: var(--c-warn); font-weight: 600; }
.many { color: var(--c-ex); font-weight: 600; }
</style>
