<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ size?: number; n?: number }>(), {
  size: 380,
  n: 6,
})

const n = ref(props.n)
const k = ref(0) // highlighted power of the primitive root

const R = computed(() => props.size * 0.36)
const cx = computed(() => props.size / 2)

const roots = computed(() =>
  Array.from({ length: n.value }, (_, i) => {
    const phi = (2 * Math.PI * i) / n.value
    return {
      i,
      x: cx.value + R.value * Math.cos(phi),
      y: cx.value - R.value * Math.sin(phi),
    }
  }),
)
const polygon = computed(() => roots.value.map(r => `${r.x},${r.y}`).join(' '))

function setN(v: number) {
  n.value = v
  k.value = 0
}
function step() {
  k.value = (k.value + 1) % n.value
}
</script>

<template>
  <div class="roots">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <g stroke="var(--ink-muted)" stroke-opacity="0.5" stroke-width="1.1">
        <line :x1="10" :y1="cx" :x2="size-10" :y2="cx" />
        <line :x1="cx" :y1="size-10" :x2="cx" :y2="10" />
      </g>
      <circle :cx="cx" :cy="cx" :r="R" fill="none" stroke="var(--ink-muted)" stroke-opacity="0.35" />
      <polygon :points="polygon" fill="none" stroke="var(--c-def)" stroke-opacity="0.45" stroke-dasharray="5 4" />

      <g v-for="r in roots" :key="r.i">
        <line
          v-if="r.i === k" :x1="cx" :y1="cx" :x2="r.x" :y2="r.y"
          stroke="var(--c-warn)" stroke-width="2.2"
        />
        <circle
          :cx="r.x" :cy="r.y" :r="r.i === k ? 7 : 5"
          :fill="r.i === k ? 'var(--c-warn)' : 'var(--c-def)'"
          class="root-dot"
        />
        <text
          :x="cx + (r.x - cx) * 1.16" :y="cx - (cx - r.y) * 1.16 + 4"
          class="rlabel" text-anchor="middle"
          :fill="r.i === k ? 'var(--c-warn)' : 'var(--ink-muted)'"
        >z{{ r.i }}</text>
      </g>
    </svg>

    <div class="controls">
      <label>
        n = {{ n }}
        <input type="range" min="2" max="12" :value="n" @input="setN(+($event.target as HTMLInputElement).value)">
      </label>
      <button @click="step">× z₁ (rotate by 2π/{{ n }})</button>
      <span class="state">z₁<sup>{{ k }}</sup> = z{{ k }}</span>
    </div>
  </div>
</template>

<style scoped>
.roots { display: inline-flex; flex-direction: column; align-items: center; gap: 0.45rem; }
svg { border-radius: 12px; background: var(--paper-soft); }
.root-dot { transition: fill 0.25s, r 0.25s; }
.rlabel { font-size: 12.5px; font-style: italic; transition: fill 0.25s; }
.controls {
  display: flex; align-items: center; gap: 1.1rem;
  font-size: 0.92rem; color: var(--ink-muted);
}
.controls label { display: flex; align-items: center; gap: 0.5rem; }
input[type='range'] { accent-color: var(--accent); width: 120px; }
button {
  border: 1px solid var(--accent);
  color: var(--accent);
  background: transparent;
  border-radius: 999px;
  padding: 0.18rem 0.85rem;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover { background: var(--accent); color: var(--paper); }
.state { font-variant-numeric: tabular-nums; }
</style>
