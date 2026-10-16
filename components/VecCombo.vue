<script setup lang="ts">
import { computed, ref } from 'vue'
import { fmtNum } from '../lib/complex'

const props = withDefaults(defineProps<{
  size?: number
  range?: number
  /** initial vectors u and v (draggable) */
  ux?: number
  uy?: number
  vx?: number
  vy?: number
  /** show the span lines of u and v */
  showSpan?: boolean
}>(), {
  size: 380,
  range: 4,
  ux: 2,
  uy: 0.5,
  vx: 0.5,
  vy: 1.5,
  showSpan: true,
})

const u = ref({ x: props.ux, y: props.uy })
const v = ref({ x: props.vx, y: props.vy })
const a = ref(1)
const b = ref(1)
const svg = ref<SVGSVGElement | null>(null)
const dragging = ref<'u' | 'v' | null>(null)

const scale = computed(() => props.size / (2 * props.range))
const px = (w: { x: number, y: number }) => ({
  x: props.size / 2 + w.x * scale.value,
  y: props.size / 2 - w.y * scale.value,
})

function toPlane(ev: PointerEvent) {
  const r = svg.value!.getBoundingClientRect()
  const x = ((ev.clientX - r.left) / r.width * props.size - props.size / 2) / scale.value
  const y = -((ev.clientY - r.top) / r.height * props.size - props.size / 2) / scale.value
  const clamp = (t: number) => Math.max(-props.range + 0.15, Math.min(props.range - 0.15, t))
  return { x: clamp(x), y: clamp(y) }
}
function onMove(ev: PointerEvent) {
  if (dragging.value === 'u') u.value = toPlane(ev)
  else if (dragging.value === 'v') v.value = toPlane(ev)
}

const w = computed(() => ({
  x: a.value * u.value.x + b.value * v.value.x,
  y: a.value * u.value.y + b.value * v.value.y,
}))
const au = computed(() => ({ x: a.value * u.value.x, y: a.value * u.value.y }))
const det = computed(() => u.value.x * v.value.y - u.value.y * v.value.x)
const dependent = computed(() => Math.abs(det.value) < 0.08)

const pu = computed(() => px(u.value))
const pv = computed(() => px(v.value))
const pw = computed(() => px(w.value))
const pau = computed(() => px(au.value))

/** span line of a vector, clipped generously to the viewport */
function spanLine(d: { x: number, y: number }) {
  const n = Math.hypot(d.x, d.y) || 1
  const t = props.range * 3 / n
  return { p1: px({ x: -d.x * t, y: -d.y * t }), p2: px({ x: d.x * t, y: d.y * t }) }
}
const spanU = computed(() => spanLine(u.value))
const spanV = computed(() => spanLine(v.value))

const ticks = computed(() => {
  const t: number[] = []
  for (let i = -Math.floor(props.range); i <= Math.floor(props.range); i++)
    if (i !== 0) t.push(i)
  return t
})
</script>

<template>
  <div class="veccombo">
    <svg
      ref="svg" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`"
      @pointermove="onMove" @pointerup="dragging = null" @pointerleave="dragging = null"
    >
      <g stroke="var(--ink-muted)" stroke-opacity="0.16">
        <line v-for="t in ticks" :key="'v' + t" :x1="size/2 + t*scale" y1="0" :x2="size/2 + t*scale" :y2="size" />
        <line v-for="t in ticks" :key="'h' + t" x1="0" :y1="size/2 + t*scale" :x2="size" :y2="size/2 + t*scale" />
      </g>
      <g stroke="var(--ink-muted)" stroke-opacity="0.55" stroke-width="1.2">
        <line :x1="6" :y1="size/2" :x2="size-6" :y2="size/2" />
        <line :x1="size/2" :y1="size-6" :x2="size/2" :y2="6" />
      </g>

      <!-- span lines -->
      <g v-if="showSpan" stroke-width="1.3" stroke-dasharray="5 5" stroke-opacity="0.35">
        <line :x1="spanU.p1.x" :y1="spanU.p1.y" :x2="spanU.p2.x" :y2="spanU.p2.y" stroke="var(--c-def)" />
        <line :x1="spanV.p1.x" :y1="spanV.p1.y" :x2="spanV.p2.x" :y2="spanV.p2.y" stroke="var(--c-ex)" />
      </g>

      <!-- parallelogram path 0 → au → au+bv -->
      <g stroke="var(--ink-muted)" stroke-dasharray="4 4" stroke-opacity="0.7" fill="none">
        <line :x1="size/2" :y1="size/2" :x2="pau.x" :y2="pau.y" />
        <line :x1="pau.x" :y1="pau.y" :x2="pw.x" :y2="pw.y" />
      </g>

      <!-- u and v vectors + handles -->
      <line :x1="size/2" :y1="size/2" :x2="pu.x" :y2="pu.y" stroke="var(--c-def)" stroke-width="2.4" />
      <circle :cx="pu.x" :cy="pu.y" r="7" fill="var(--c-def)" class="handle" @pointerdown.prevent="dragging = 'u'" />
      <text :x="pu.x + 10" :y="pu.y - 8" class="ptlabel" fill="var(--c-def)">u</text>

      <line :x1="size/2" :y1="size/2" :x2="pv.x" :y2="pv.y" stroke="var(--c-ex)" stroke-width="2.4" />
      <circle :cx="pv.x" :cy="pv.y" r="7" fill="var(--c-ex)" class="handle" @pointerdown.prevent="dragging = 'v'" />
      <text :x="pv.x + 10" :y="pv.y - 8" class="ptlabel" fill="var(--c-ex)">v</text>

      <!-- the combination -->
      <line :x1="size/2" :y1="size/2" :x2="pw.x" :y2="pw.y" stroke="var(--c-thm)" stroke-width="3" />
      <circle :cx="pw.x" :cy="pw.y" r="5.5" fill="var(--c-thm)" />
      <text :x="pw.x + 10" :y="pw.y + 14" class="ptlabel" fill="var(--c-thm)">au+bv</text>
    </svg>

    <div class="sliders">
      <label>a = <b>{{ fmtNum(a, 1) }}</b>
        <input v-model.number="a" type="range" min="-2" max="2" step="0.1">
      </label>
      <label>b = <b>{{ fmtNum(b, 1) }}</b>
        <input v-model.number="b" type="range" min="-2" max="2" step="0.1">
      </label>
    </div>

    <div class="readout">
      <span>au + bv = ({{ fmtNum(w.x, 1) }}, {{ fmtNum(w.y, 1) }})</span>
      <span v-if="dependent" class="dep">u, v nearly dependent — the span collapses to a line</span>
      <span v-else>u, v independent — combinations fill the plane</span>
    </div>
  </div>
</template>

<style scoped>
.veccombo { display: inline-flex; flex-direction: column; align-items: center; gap: 0.4rem; }
svg { touch-action: none; border-radius: 12px; background: var(--paper-soft); }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.ptlabel { font-size: 14px; font-style: italic; font-weight: 600; }
.sliders { display: flex; gap: 1.6rem; font-size: 0.92rem; color: var(--ink-muted); }
.sliders label { display: flex; align-items: center; gap: 0.5rem; font-variant-numeric: tabular-nums; }
.sliders b { min-width: 2.2rem; text-align: right; color: var(--ink); }
.sliders input { accent-color: var(--accent); width: 130px; }
.readout {
  display: flex; gap: 1.4rem; flex-wrap: wrap; justify-content: center;
  font-size: 0.92rem; color: var(--ink-muted); font-variant-numeric: tabular-nums;
}
.dep { color: var(--c-warn); font-weight: 600; }
</style>
