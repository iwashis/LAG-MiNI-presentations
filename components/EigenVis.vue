<script setup lang="ts">
import { computed, ref } from 'vue'
import { fmtNum } from '../lib/complex'

/**
 * Fixed 2x2 matrix A (given as props); drag v around the unit-ish circle and
 * watch Av. When v lines up with an eigenvector, Av snaps onto the same line
 * through the origin — visualising "Av = lambda v".
 */
const props = withDefaults(defineProps<{
  size?: number
  range?: number
  a11?: number
  a12?: number
  a21?: number
  a22?: number
  vx?: number
  vy?: number
}>(), {
  size: 380,
  range: 4,
  a11: 2,
  a12: 1,
  a21: 1,
  a22: 2,
  vx: 1,
  vy: 0.3,
})

const v = ref({ x: props.vx, y: props.vy })
const svg = ref<SVGSVGElement | null>(null)
const dragging = ref(false)

const A = computed(() => [[props.a11, props.a12], [props.a21, props.a22]])
const Av = computed(() => ({
  x: A.value[0][0] * v.value.x + A.value[0][1] * v.value.y,
  y: A.value[1][0] * v.value.x + A.value[1][1] * v.value.y,
}))

/** angle between v and Av, to detect eigen-alignment (0 or pi mod pi) */
const angleDeg = computed(() => {
  const dot = v.value.x * Av.value.x + v.value.y * Av.value.y
  const nv = Math.hypot(v.value.x, v.value.y)
  const nAv = Math.hypot(Av.value.x, Av.value.y)
  if (nv < 1e-9 || nAv < 1e-9) return 90
  const c = Math.max(-1, Math.min(1, dot / (nv * nAv)))
  return Math.acos(c) * 180 / Math.PI
})
const aligned = computed(() => angleDeg.value < 4 || angleDeg.value > 176)
const lambda = computed(() => {
  const nv2 = v.value.x ** 2 + v.value.y ** 2
  return (v.value.x * Av.value.x + v.value.y * Av.value.y) / nv2
})

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
  if (dragging.value) v.value = toPlane(ev)
}

const pO = computed(() => px({ x: 0, y: 0 }))
const pV = computed(() => px(v.value))
const pAv = computed(() => px(Av.value))

const ticks = computed(() => {
  const t: number[] = []
  for (let i = -Math.floor(props.range); i <= Math.floor(props.range); i++)
    if (i !== 0) t.push(i)
  return t
})
</script>

<template>
  <div class="eigenvis">
    <svg
      ref="svg" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`"
      @pointermove="onMove" @pointerup="dragging = false" @pointerleave="dragging = false"
    >
      <g stroke="var(--ink-muted)" stroke-opacity="0.16">
        <line v-for="t in ticks" :key="'v' + t" :x1="size/2 + t*scale" y1="0" :x2="size/2 + t*scale" :y2="size" />
        <line v-for="t in ticks" :key="'h' + t" x1="0" :y1="size/2 + t*scale" :x2="size" :y2="size/2 + t*scale" />
      </g>
      <g stroke="var(--ink-muted)" stroke-opacity="0.55" stroke-width="1.2">
        <line :x1="6" :y1="size/2" :x2="size-6" :y2="size/2" />
        <line :x1="size/2" :y1="size-6" :x2="size/2" :y2="6" />
      </g>

      <!-- Av first (behind), so v's handle stays on top -->
      <line
        :x1="pO.x" :y1="pO.y" :x2="pAv.x" :y2="pAv.y"
        :stroke="aligned ? 'var(--c-ex)' : 'var(--c-thm)'" stroke-width="2.6"
      />
      <circle :cx="pAv.x" :cy="pAv.y" r="5.5" :fill="aligned ? 'var(--c-ex)' : 'var(--c-thm)'" />
      <text :x="pAv.x + 10" :y="pAv.y + 14" class="ptlabel" :fill="aligned ? 'var(--c-ex)' : 'var(--c-thm)'">Av</text>

      <line :x1="pO.x" :y1="pO.y" :x2="pV.x" :y2="pV.y" stroke="var(--c-def)" stroke-width="2.6" />
      <circle :cx="pV.x" :cy="pV.y" r="7" fill="var(--c-def)" class="handle" @pointerdown.prevent="dragging = true" />
      <text :x="pV.x + 10" :y="pV.y - 8" class="ptlabel" fill="var(--c-def)">v</text>
    </svg>

    <div class="readout">
      <span>v = ({{ fmtNum(v.x,2) }}, {{ fmtNum(v.y,2) }})</span>
      <span>Av = ({{ fmtNum(Av.x,2) }}, {{ fmtNum(Av.y,2) }})</span>
      <span v-if="aligned" class="hit">eigenvector! λ ≈ {{ fmtNum(lambda, 2) }}</span>
      <span v-else>angle(v, Av) = {{ fmtNum(angleDeg, 0) }}°</span>
    </div>
  </div>
</template>

<style scoped>
.eigenvis { display: inline-flex; flex-direction: column; align-items: center; gap: 0.5rem; }
svg { touch-action: none; border-radius: 12px; background: var(--paper-soft); }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.ptlabel { font-size: 15px; font-style: italic; font-weight: 600; }
.readout {
  display: flex; gap: 1.4rem; flex-wrap: wrap; justify-content: center;
  font-size: 0.92rem; color: var(--ink-muted); font-variant-numeric: tabular-nums;
}
.hit { color: var(--c-ex); font-weight: 700; }
</style>
