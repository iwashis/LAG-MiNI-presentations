<script setup lang="ts">
import { computed, ref } from 'vue'
import { arg, conj, fmt, fmtArg, fmtNum, mod, type C } from '../lib/complex'

const props = withDefaults(defineProps<{
  size?: number
  range?: number
  re?: number
  im?: number
  label?: string
  showConj?: boolean
  showPolar?: boolean
  /** optional locus circle {re, im, r} drawn in the background */
  circleRe?: number
  circleIm?: number
  circleR?: number
}>(), {
  size: 380,
  range: 3,
  re: 2,
  im: 1.5,
  label: 'z',
  showConj: false,
  showPolar: true,
})

const z = ref<C>({ re: props.re, im: props.im })
const svg = ref<SVGSVGElement | null>(null)
const dragging = ref(false)

const scale = computed(() => props.size / (2 * props.range))
const px = (w: C) => ({
  x: props.size / 2 + w.re * scale.value,
  y: props.size / 2 - w.im * scale.value,
})

function toPlane(ev: PointerEvent): C {
  const r = svg.value!.getBoundingClientRect()
  const re = ((ev.clientX - r.left) / r.width * props.size - props.size / 2) / scale.value
  const im = -((ev.clientY - r.top) / r.height * props.size - props.size / 2) / scale.value
  const clamp = (v: number) => Math.max(-props.range + 0.15, Math.min(props.range - 0.15, v))
  return { re: clamp(re), im: clamp(im) }
}
function onMove(ev: PointerEvent) {
  if (dragging.value) z.value = toPlane(ev)
}

const p = computed(() => px(z.value))
const pc = computed(() => px(conj(z.value)))
const ticks = computed(() => {
  const t: number[] = []
  for (let i = -Math.floor(props.range); i <= Math.floor(props.range); i++)
    if (i !== 0) t.push(i)
  return t
})
const argArc = computed(() => {
  const phi = arg(z.value)
  const r = 26
  const c = props.size / 2
  const large = Math.abs(phi) > Math.PI ? 1 : 0
  const sweep = phi > 0 ? 0 : 1
  return `M ${c + r} ${c} A ${r} ${r} 0 ${large} ${sweep} ${c + r * Math.cos(phi)} ${c - r * Math.sin(phi)}`
})
const hasCircle = computed(() => props.circleR !== undefined)
</script>

<template>
  <div class="cplane">
    <svg
      ref="svg" :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`"
      @pointermove="onMove" @pointerup="dragging = false" @pointerleave="dragging = false"
    >
      <!-- grid -->
      <g stroke="var(--ink-muted)" stroke-opacity="0.16">
        <line v-for="t in ticks" :key="'v' + t" :x1="size/2 + t*scale" y1="0" :x2="size/2 + t*scale" :y2="size" />
        <line v-for="t in ticks" :key="'h' + t" x1="0" :y1="size/2 + t*scale" :x2="size" :y2="size/2 + t*scale" />
      </g>
      <!-- axes -->
      <g stroke="var(--ink-muted)" stroke-opacity="0.55" stroke-width="1.2">
        <line :x1="6" :y1="size/2" :x2="size-6" :y2="size/2" />
        <line :x1="size/2" :y1="size-6" :x2="size/2" :y2="6" />
      </g>
      <text :x="size-16" :y="size/2 - 8" class="axis">Re</text>
      <text :x="size/2 + 8" :y="16" class="axis">Im</text>

      <!-- optional locus circle, its centre z0, and the distance segment z0–z -->
      <g v-if="hasCircle">
        <circle
          :cx="size/2 + (circleRe ?? 0) * scale" :cy="size/2 - (circleIm ?? 0) * scale"
          :r="(circleR ?? 1) * scale"
          fill="none" stroke="var(--c-ex)" stroke-width="1.6" stroke-dasharray="5 4"
        />
        <line
          :x1="size/2 + (circleRe ?? 0) * scale" :y1="size/2 - (circleIm ?? 0) * scale"
          :x2="p.x" :y2="p.y"
          stroke="var(--c-ex)" stroke-width="1.6" stroke-dasharray="2 3"
        />
        <circle
          :cx="size/2 + (circleRe ?? 0) * scale" :cy="size/2 - (circleIm ?? 0) * scale"
          r="4" fill="var(--c-ex)"
        />
        <text
          :x="size/2 + (circleRe ?? 0) * scale + 9" :y="size/2 - (circleIm ?? 0) * scale + 14"
          class="ptlabel" fill="var(--c-ex)"
        >z₀</text>
      </g>

      <!-- argument arc -->
      <path v-if="showPolar" :d="argArc" fill="none" stroke="var(--c-ex)" stroke-width="1.8" />

      <!-- projections -->
      <g stroke="var(--ink-muted)" stroke-dasharray="4 4" stroke-opacity="0.6">
        <line :x1="p.x" :y1="p.y" :x2="p.x" :y2="size/2" />
        <line :x1="p.x" :y1="p.y" :x2="size/2" :y2="p.y" />
      </g>

      <!-- conjugate -->
      <g v-if="showConj">
        <line :x1="size/2" :y1="size/2" :x2="pc.x" :y2="pc.y" stroke="var(--c-rem)" stroke-width="1.8" stroke-dasharray="6 4" />
        <circle :cx="pc.x" :cy="pc.y" r="5" fill="var(--c-rem)" />
        <text :x="pc.x + 10" :y="pc.y + 4" class="ptlabel" fill="var(--c-rem)">z̄</text>
      </g>

      <!-- z vector + handle -->
      <line :x1="size/2" :y1="size/2" :x2="p.x" :y2="p.y" stroke="var(--c-def)" stroke-width="2.4" />
      <circle
        :cx="p.x" :cy="p.y" r="7" fill="var(--c-def)" class="handle"
        @pointerdown.prevent="dragging = true"
      />
      <text :x="p.x + 11" :y="p.y - 8" class="ptlabel" fill="var(--c-def)">{{ label }}</text>
    </svg>

    <div class="readout">
      <span><i>{{ label }}</i> = {{ fmt(z) }}</span>
      <span>|{{ label }}| = {{ fmtNum(mod(z)) }}</span>
      <span v-if="showPolar">arg {{ label }} = {{ fmtArg(arg(z)) }}</span>
      <span v-if="showConj">z̄ = {{ fmt(conj(z)) }}</span>
      <span v-if="hasCircle" class="dist">
        |{{ label }} − z₀| = {{ fmtNum(mod({ re: z.re - (circleRe ?? 0), im: z.im - (circleIm ?? 0) })) }}
        (circle: {{ fmtNum(circleR ?? 1) }})
      </span>
    </div>
  </div>
</template>

<style scoped>
.cplane { display: inline-flex; flex-direction: column; align-items: center; gap: 0.5rem; }
svg { touch-action: none; border-radius: 12px; background: var(--paper-soft); }
.handle { cursor: grab; }
.handle:active { cursor: grabbing; }
.axis { font-size: 12px; fill: var(--ink-muted); font-style: italic; }
.ptlabel { font-size: 15px; font-style: italic; font-weight: 600; }
.readout {
  display: flex; gap: 1.4rem; flex-wrap: wrap; justify-content: center;
  font-size: 0.92rem; color: var(--ink-muted);
  font-variant-numeric: tabular-nums;
}
.readout span { white-space: nowrap; }
</style>
