<script setup lang="ts">
import { computed, ref } from 'vue'
import { fmtNum } from '../lib/complex'

/**
 * Drag e1' and e2' (the images of the standard basis vectors) and watch a
 * grid + a sample shape get carried along by the induced linear map.
 */
const props = withDefaults(defineProps<{
  size?: number
  range?: number
  e1x?: number
  e1y?: number
  e2x?: number
  e2y?: number
  showGrid?: boolean
}>(), {
  size: 380,
  range: 4,
  e1x: 1,
  e1y: 0,
  e2x: 0,
  e2y: 1,
  showGrid: true,
})

const e1 = ref({ x: props.e1x, y: props.e1y })
const e2 = ref({ x: props.e2x, y: props.e2y })
const svg = ref<SVGSVGElement | null>(null)
const dragging = ref<'e1' | 'e2' | null>(null)

const scale = computed(() => props.size / (2 * props.range))
const px = (p: { x: number, y: number }) => ({
  x: props.size / 2 + p.x * scale.value,
  y: props.size / 2 - p.y * scale.value,
})
function toPlane(ev: PointerEvent) {
  const r = svg.value!.getBoundingClientRect()
  const x = ((ev.clientX - r.left) / r.width * props.size - props.size / 2) / scale.value
  const y = -((ev.clientY - r.top) / r.height * props.size - props.size / 2) / scale.value
  const clamp = (t: number) => Math.max(-props.range + 0.15, Math.min(props.range - 0.15, t))
  return { x: clamp(x), y: clamp(y) }
}
function onMove(ev: PointerEvent) {
  if (dragging.value === 'e1') e1.value = toPlane(ev)
  else if (dragging.value === 'e2') e2.value = toPlane(ev)
}

const apply = (p: { x: number, y: number }) => ({
  x: p.x * e1.value.x + p.y * e2.value.x,
  y: p.x * e1.value.y + p.y * e2.value.y,
})

const det = computed(() => e1.value.x * e2.value.y - e1.value.y * e2.value.x)

const N = 3 // grid half-extent in transformed units
const gridLines = computed(() => {
  const lines: { p1: { x: number, y: number }, p2: { x: number, y: number } }[] = []
  for (let i = -N; i <= N; i++) {
    lines.push({ p1: apply({ x: i, y: -N }), p2: apply({ x: i, y: N }) })
    lines.push({ p1: apply({ x: -N, y: i }), p2: apply({ x: N, y: i }) })
  }
  return lines
})

const unitSquare = computed(() => {
  const o = apply({ x: 0, y: 0 })
  const a = apply({ x: 1, y: 0 })
  const ab = apply({ x: 1, y: 1 })
  const b = apply({ x: 0, y: 1 })
  return [o, a, ab, b].map(px).map(p => `${p.x},${p.y}`).join(' ')
})

const pE1 = computed(() => px(e1.value))
const pE2 = computed(() => px(e2.value))
const pO = computed(() => px({ x: 0, y: 0 }))

const ticks = computed(() => {
  const t: number[] = []
  for (let i = -Math.floor(props.range); i <= Math.floor(props.range); i++)
    if (i !== 0) t.push(i)
  return t
})
</script>

<template>
  <div class="mattransform">
    <svg
      ref="svg" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`"
      @pointermove="onMove" @pointerup="dragging = null" @pointerleave="dragging = null"
    >
      <g stroke="var(--ink-muted)" stroke-opacity="0.55" stroke-width="1.2">
        <line :x1="6" :y1="size/2" :x2="size-6" :y2="size/2" />
        <line :x1="size/2" :y1="size-6" :x2="size/2" :y2="6" />
      </g>

      <g v-if="showGrid" stroke="var(--accent)" stroke-opacity="0.28" stroke-width="1">
        <line
          v-for="(l, idx) in gridLines" :key="idx"
          :x1="px(l.p1).x" :y1="px(l.p1).y" :x2="px(l.p2).x" :y2="px(l.p2).y"
        />
      </g>

      <polygon :points="unitSquare" fill="color-mix(in srgb, var(--c-ex) 22%, transparent)" stroke="var(--c-ex)" stroke-width="1.6" />

      <line :x1="pO.x" :y1="pO.y" :x2="pE1.x" :y2="pE1.y" stroke="var(--c-def)" stroke-width="2.6" />
      <circle :cx="pE1.x" :cy="pE1.y" r="7" fill="var(--c-def)" class="handle" @pointerdown.prevent="dragging = 'e1'" />
      <text :x="pE1.x + 10" :y="pE1.y - 8" class="ptlabel" fill="var(--c-def)">e1'</text>

      <line :x1="pO.x" :y1="pO.y" :x2="pE2.x" :y2="pE2.y" stroke="var(--c-thm)" stroke-width="2.6" />
      <circle :cx="pE2.x" :cy="pE2.y" r="7" fill="var(--c-thm)" class="handle" @pointerdown.prevent="dragging = 'e2'" />
      <text :x="pE2.x + 10" :y="pE2.y - 8" class="ptlabel" fill="var(--c-thm)">e2'</text>
    </svg>

    <div class="readout">
      <span>A = [ ({{ fmtNum(e1.x,1) }}, {{ fmtNum(e1.y,1) }}) | ({{ fmtNum(e2.x,1) }}, {{ fmtNum(e2.y,1) }}) ]</span>
      <span>det(A) = {{ fmtNum(det, 2) }} (signed area scaling)</span>
    </div>
  </div>
</template>

<style scoped>
.mattransform { display: inline-flex; flex-direction: column; align-items: center; gap: 0.5rem; }
svg { touch-action: none; border-radius: 12px; background: var(--paper-soft); }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.ptlabel { font-size: 14px; font-style: italic; font-weight: 600; }
.readout {
  display: flex; gap: 1.4rem; flex-wrap: wrap; justify-content: center;
  font-size: 0.9rem; color: var(--ink-muted); font-variant-numeric: tabular-nums;
}
</style>
