<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  /** matrices as rows separated by ';', entries by spaces: "1 0 2; 2 1 3" */
  a?: string
  b?: string
}>(), {
  a: '1 0 2; 2 1 3',
  b: '1 2; 0 1; 1 0',
})

const parse = (s: string) => s.split(';').map(r => r.trim().split(/\s+/).map(Number))
const A = computed(() => parse(props.a))
const B = computed(() => parse(props.b))
const K = computed(() => A.value.length)
const M = computed(() => B.value.length)
const N = computed(() => B.value[0].length)

const t = ref(0) // current entry index, row-major over C
const total = computed(() => K.value * N.value)
const ci = computed(() => Math.floor(t.value / N.value))
const cj = computed(() => t.value % N.value)

const entry = (i: number, j: number) =>
  A.value[i].reduce((s, aik, k) => s + aik * B.value[k][j], 0)

const C = computed(() =>
  Array.from({ length: K.value }, (_, i) =>
    Array.from({ length: N.value }, (_, j) => entry(i, j))))

const expr = computed(() =>
  A.value[ci.value]
    .map((aik, k) => `${aik}·${B.value[k][cj.value]}`)
    .join(' + '))

const fmt = (x: number) => `${Math.round(x * 100) / 100}`.replace('-', '−')
</script>

<template>
  <div class="matmul">
    <div class="stage">
      <table class="m a">
        <tbody>
          <tr v-for="(row, i) in A" :key="i" :class="{ hl: i === ci }">
            <td v-for="(x, j) in row" :key="j">{{ fmt(x) }}</td>
          </tr>
        </tbody>
      </table>
      <span class="op">·</span>
      <table class="m b">
        <tbody>
          <tr v-for="(row, i) in B" :key="i">
            <td v-for="(x, j) in row" :key="j" :class="{ hl: j === cj }">{{ fmt(x) }}</td>
          </tr>
        </tbody>
      </table>
      <span class="op">=</span>
      <table class="m c">
        <tbody>
          <tr v-for="(row, i) in C" :key="i">
            <td
              v-for="(x, j) in row" :key="j"
              :class="{ done: i * N + j <= t, cur: i === ci && j === cj }"
            >{{ i * N + j <= t ? fmt(x) : '·' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="expr">
      row {{ ci + 1 }} of A · column {{ cj + 1 }} of B:&ensp;
      <b>{{ expr }} = {{ fmt(C[ci][cj]) }}</b>
    </div>

    <div class="bar">
      <button :disabled="t === 0" @click="t--">‹</button>
      <span class="count">{{ t + 1 }} / {{ total }}</span>
      <button :disabled="t === total - 1" @click="t++">›</button>
    </div>
  </div>
</template>

<style scoped>
.matmul { display: inline-flex; flex-direction: column; align-items: center; gap: 0.55rem; }
.stage { display: flex; align-items: center; gap: 0.7rem; }
.op { font-size: 1.4rem; color: var(--ink-muted); }
table.m { border-collapse: collapse; background: var(--paper-soft); border-radius: 10px; }
table.m td {
  min-width: 2.2rem; padding: 0.32rem 0.5rem;
  text-align: center; font-variant-numeric: tabular-nums;
  transition: background 0.25s, color 0.25s;
  border-radius: 6px;
}
.a tr.hl td { background: color-mix(in srgb, var(--c-def) 18%, transparent); color: var(--c-def); font-weight: 650; }
.b td.hl { background: color-mix(in srgb, var(--c-ex) 18%, transparent); color: var(--c-ex); font-weight: 650; }
.c td { color: var(--ink-muted); }
.c td.done { color: var(--ink); }
.c td.cur { background: color-mix(in srgb, var(--c-thm) 18%, transparent); color: var(--c-thm); font-weight: 700; }
.expr { font-size: 0.95rem; color: var(--ink-muted); font-variant-numeric: tabular-nums; }
.expr b { color: var(--ink); }
.bar { display: flex; align-items: center; gap: 0.7rem; color: var(--ink-muted); font-size: 0.9rem; }
button {
  border: 1px solid var(--accent); color: var(--accent); background: transparent;
  border-radius: 999px; width: 1.9rem; height: 1.9rem;
  font-size: 1.05rem; line-height: 1; cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover:not(:disabled) { background: var(--accent); color: var(--paper); }
button:disabled { opacity: 0.3; cursor: default; }
.count { font-variant-numeric: tabular-nums; }
</style>
