<script setup lang="ts">
import { computed, ref } from 'vue'
import { fmtNum } from '../lib/complex'

/**
 * Power-iteration visualiser for PageRank: click "step" to apply S^T (or the
 * damped Google matrix) to the current probability vector and watch the bars
 * converge to the stationary distribution.
 */
const props = withDefaults(defineProps<{
  /** stochastic matrix S, rows separated by ';', entries by spaces (row-stochastic) */
  s?: string
  labels?: string
  damping?: number
}>(), {
  s: '0 0.5 0.5; 0 0 1; 1 0 0',
  labels: '1,2,3',
  damping: 0,
})

const parse = (s: string) => s.split(';').map(r => r.trim().split(/\s+/).map(Number))
const S = computed(() => parse(props.s))
const n = computed(() => S.value.length)
const names = computed(() => props.labels.split(',').map(s => s.trim()))

const w = ref(Array.from({ length: n.value }, (_, i) => (i === 0 ? 1 : 0)))
const k = ref(0)
const history = ref<number[][]>([w.value.slice()])

function step() {
  const alpha = props.damping
  const teleport = alpha > 0 ? (1 - alpha) / n.value : 0
  const next = Array.from({ length: n.value }, (_, j) => {
    let acc = teleport
    for (let i = 0; i < n.value; i++) acc += alpha > 0 ? alpha * S.value[i][j] * w.value[i] : S.value[i][j] * w.value[i]
    return acc
  })
  w.value = next
  k.value++
  history.value.push(next.slice())
  if (history.value.length > 40) history.value.shift()
}
function reset() {
  w.value = Array.from({ length: n.value }, (_, i) => (i === 0 ? 1 : 0))
  k.value = 0
  history.value = [w.value.slice()]
}

const delta = computed(() => {
  if (history.value.length < 2) return null
  const prev = history.value[history.value.length - 2]
  const cur = history.value[history.value.length - 1]
  return Math.max(...cur.map((v, i) => Math.abs(v - prev[i])))
})
const converged = computed(() => delta.value !== null && delta.value < 0.001)
</script>

<template>
  <div class="poweriter">
    <div class="bars">
      <div v-for="(x, i) in w" :key="i" class="bar-row">
        <span class="lbl">{{ names[i] ?? i + 1 }}</span>
        <div class="track">
          <div class="fill" :style="{ width: `${Math.max(0, Math.min(1, x)) * 100}%` }" />
        </div>
        <span class="val">{{ fmtNum(x, 3) }}</span>
      </div>
    </div>

    <div class="bar">
      <button @click="reset">reset</button>
      <button @click="step">step ›</button>
      <span class="count">k = {{ k }}</span>
      <span v-if="converged" class="hit">converged</span>
      <span v-else-if="delta !== null">Δ = {{ fmtNum(delta, 4) }}</span>
    </div>
  </div>
</template>

<style scoped>
.poweriter { display: inline-flex; flex-direction: column; gap: 0.7rem; min-width: 300px; }
.bars { display: flex; flex-direction: column; gap: 0.45rem; }
.bar-row { display: grid; grid-template-columns: 2.5rem 1fr 3.5rem; align-items: center; gap: 0.6rem; }
.lbl { font-style: italic; color: var(--ink-muted); text-align: right; }
.track {
  height: 0.85rem; border-radius: 999px; background: var(--paper-soft);
  overflow: hidden;
}
.fill {
  height: 100%; border-radius: 999px; background: var(--accent);
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.val { font-variant-numeric: tabular-nums; color: var(--ink-muted); font-size: 0.88rem; }
.bar { display: flex; align-items: center; gap: 0.8rem; color: var(--ink-muted); font-size: 0.9rem; }
button {
  border: 1px solid var(--accent); color: var(--accent); background: transparent;
  border-radius: 999px; padding: 0.2rem 0.85rem;
  font-size: 0.88rem; cursor: pointer; transition: background 0.2s, color 0.2s;
}
button:hover { background: var(--accent); color: var(--paper); }
.count { font-variant-numeric: tabular-nums; }
.hit { color: var(--c-ex); font-weight: 700; }
</style>
