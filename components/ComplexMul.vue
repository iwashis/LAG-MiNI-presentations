<script setup lang="ts">
import { computed, ref } from 'vue'
import { arg, fmt, fmtArg, fmtNum, mod, mul, type C } from '../lib/complex'

const props = withDefaults(defineProps<{ size?: number; range?: number }>(), {
  size: 420,
  range: 4,
})

const z = ref<C>({ re: 1.5, im: 0.9 })
const w = ref<C>({ re: 0.4, im: 1.2 })
const p = computed(() => mul(z.value, w.value))

const svg = ref<SVGSVGElement | null>(null)
const dragging = ref<'z' | 'w' | null>(null)

const scale = computed(() => props.size / (2 * props.range))
const px = (c: C) => ({
  x: props.size / 2 + c.re * scale.value,
  y: props.size / 2 - c.im * scale.value,
})

function toPlane(ev: PointerEvent): C {
  const r = svg.value!.getBoundingClientRect()
  const re = ((ev.clientX - r.left) / r.width * props.size - props.size / 2) / scale.value
  const im = -((ev.clientY - r.top) / r.height * props.size - props.size / 2) / scale.value
  const clamp = (v: number) => Math.max(-props.range + 0.15, Math.min(props.range - 0.15, v))
  return { re: clamp(re), im: clamp(im) }
}
function onMove(ev: PointerEvent) {
  if (dragging.value === 'z') z.value = toPlane(ev)
  if (dragging.value === 'w') w.value = toPlane(ev)
}

function arc(c: C, r: number): string {
  const phi = arg(c)
  const cx = props.size / 2
  const sweep = phi > 0 ? 0 : 1
  return `M ${cx + r} ${cx} A ${r} ${r} 0 ${Math.abs(phi) > Math.PI ? 1 : 0} ${sweep} ${cx + r * Math.cos(phi)} ${cx - r * Math.sin(phi)}`
}

const vectors = computed(() => [
  { c: z.value, color: 'var(--c-def)', label: 'z', drag: 'z' as const, r: 24 },
  { c: w.value, color: 'var(--c-ex)', label: 'w', drag: 'w' as const, r: 34 },
  { c: p.value, color: 'var(--c-thm)', label: 'z·w', drag: null, r: 46 },
])
</script>

<template>
  <div class="cmul">
    <svg
      ref="svg" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`"
      @pointermove="onMove" @pointerup="dragging = null" @pointerleave="dragging = null"
    >
      <!-- axes + unit circle -->
      <g stroke="var(--ink-muted)" stroke-opacity="0.55" stroke-width="1.2">
        <line :x1="6" :y1="size/2" :x2="size-6" :y2="size/2" />
        <line :x1="size/2" :y1="size-6" :x2="size/2" :y2="6" />
      </g>
      <circle
        :cx="size/2" :cy="size/2" :r="scale" fill="none"
        stroke="var(--ink-muted)" stroke-opacity="0.3" stroke-dasharray="4 4"
      />
      <text :x="size-16" :y="size/2 - 8" class="axis">Re</text>
      <text :x="size/2 + 8" :y="16" class="axis">Im</text>

      <g v-for="v in vectors" :key="v.label">
        <path :d="arc(v.c, v.r)" fill="none" :stroke="v.color" stroke-width="1.6" stroke-opacity="0.75" />
        <line
          :x1="size/2" :y1="size/2" :x2="px(v.c).x" :y2="px(v.c).y"
          :stroke="v.color" :stroke-width="v.drag ? 2.2 : 2.8"
        />
        <circle
          :cx="px(v.c).x" :cy="px(v.c).y" :r="v.drag ? 7 : 5.5" :fill="v.color"
          :class="{ handle: !!v.drag }"
          @pointerdown.prevent="v.drag && (dragging = v.drag)"
        />
        <text :x="px(v.c).x + 10" :y="px(v.c).y - 8" class="ptlabel" :fill="v.color">{{ v.label }}</text>
      </g>
    </svg>

    <div class="readout">
      <span class="row">
        <b style="color: var(--c-def)">z</b> = {{ fmt(z) }} ·
        <b style="color: var(--c-ex)">w</b> = {{ fmt(w) }} →
        <b style="color: var(--c-thm)">z·w</b> = {{ fmt(p) }}
      </span>
      <span class="row">
        |z|·|w| = {{ fmtNum(mod(z)) }} × {{ fmtNum(mod(w)) }} = {{ fmtNum(mod(z) * mod(w)) }} = |z·w|
      </span>
      <span class="row">
        arg z + arg w = {{ fmtArg(arg(z)) }} + {{ fmtArg(arg(w)) }} — moduli multiply, arguments add
      </span>
    </div>
  </div>
</template>

<style scoped>
.cmul { display: inline-flex; flex-direction: column; align-items: center; gap: 0.5rem; }
svg { touch-action: none; border-radius: 12px; background: var(--paper-soft); }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.axis { font-size: 12px; fill: var(--ink-muted); font-style: italic; }
.ptlabel { font-size: 15px; font-style: italic; font-weight: 600; }
.readout {
  display: flex; flex-direction: column; align-items: center; gap: 0.15rem;
  font-size: 0.92rem; color: var(--ink-muted); font-variant-numeric: tabular-nums;
}
</style>
