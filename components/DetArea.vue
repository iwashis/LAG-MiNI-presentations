<script setup lang="ts">
import { computed, ref } from 'vue'
import { fmtNum } from '../lib/complex'

const props = withDefaults(defineProps<{
  size?: number
  range?: number
  ax?: number
  ay?: number
  bx?: number
  by?: number
}>(), {
  size: 380,
  range: 4,
  ax: 3,
  ay: 0.5,
  bx: 0.5,
  by: 2,
})

const a = ref({ x: props.ax, y: props.ay })
const b = ref({ x: props.bx, y: props.by })
const svg = ref<SVGSVGElement | null>(null)
const dragging = ref<'a' | 'b' | null>(null)

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
  if (dragging.value === 'a') a.value = toPlane(ev)
  else if (dragging.value === 'b') b.value = toPlane(ev)
}

const det = computed(() => a.value.x * b.value.y - a.value.y * b.value.x)
const area = computed(() => Math.abs(det.value))
const orientation = computed(() => det.value > 0.01 ? 'counter-clockwise (positive)' : det.value < -0.01 ? 'clockwise (negative)' : 'flattened (zero)')

const pO = computed(() => px({ x: 0, y: 0 }))
const pA = computed(() => px(a.value))
const pB = computed(() => px(b.value))
const pAB = computed(() => px({ x: a.value.x + b.value.x, y: a.value.y + b.value.y }))
const poly = computed(() => `${pO.value.x},${pO.value.y} ${pA.value.x},${pA.value.y} ${pAB.value.x},${pAB.value.y} ${pB.value.x},${pB.value.y}`)

const ticks = computed(() => {
  const t: number[] = []
  for (let i = -Math.floor(props.range); i <= Math.floor(props.range); i++)
    if (i !== 0) t.push(i)
  return t
})
</script>

<template>
  <div class="detarea">
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

      <polygon
        :points="poly"
        :fill="det > 0 ? 'color-mix(in srgb, var(--c-ex) 30%, transparent)' : 'color-mix(in srgb, var(--c-warn) 30%, transparent)'"
        :stroke="det > 0 ? 'var(--c-ex)' : 'var(--c-warn)'" stroke-width="1.6"
      />

      <line :x1="pO.x" :y1="pO.y" :x2="pA.x" :y2="pA.y" stroke="var(--c-def)" stroke-width="2.4" />
      <circle :cx="pA.x" :cy="pA.y" r="7" fill="var(--c-def)" class="handle" @pointerdown.prevent="dragging = 'a'" />
      <text :x="pA.x + 10" :y="pA.y - 8" class="ptlabel" fill="var(--c-def)">a</text>

      <line :x1="pO.x" :y1="pO.y" :x2="pB.x" :y2="pB.y" stroke="var(--c-thm)" stroke-width="2.4" />
      <circle :cx="pB.x" :cy="pB.y" r="7" fill="var(--c-thm)" class="handle" @pointerdown.prevent="dragging = 'b'" />
      <text :x="pB.x + 10" :y="pB.y - 8" class="ptlabel" fill="var(--c-thm)">b</text>
    </svg>

    <div class="readout">
      <span>det = {{ fmtNum(det, 2) }}</span>
      <span>area = {{ fmtNum(area, 2) }}</span>
      <span>orientation: {{ orientation }}</span>
    </div>
  </div>
</template>

<style scoped>
.detarea { display: inline-flex; flex-direction: column; align-items: center; gap: 0.5rem; }
svg { touch-action: none; border-radius: 12px; background: var(--paper-soft); }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.ptlabel { font-size: 15px; font-style: italic; font-weight: 600; }
.readout {
  display: flex; gap: 1.4rem; flex-wrap: wrap; justify-content: center;
  font-size: 0.92rem; color: var(--ink-muted); font-variant-numeric: tabular-nums;
}
</style>
