<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{ n?: number; op?: 'add' | 'mul' }>(), {
  n: 5,
  op: 'mul',
})

const n = ref(props.n)
const op = ref<'add' | 'mul'>(props.op)
const hover = ref<{ a: number; b: number } | null>(null)

const val = (a: number, b: number) =>
  op.value === 'add' ? (a + b) % n.value : (a * b) % n.value

// a cell "witnesses" an inverse: a∘b = 1 for ·, a∘b = 0 for +
const isWitness = (a: number, b: number) =>
  op.value === 'mul' ? a !== 0 && b !== 0 && val(a, b) === 1 : val(a, b) === 0

const range = computed(() => Array.from({ length: n.value }, (_, i) => i))

const rowsWithoutInverse = computed(() => {
  if (op.value === 'add') return []
  const bad: number[] = []
  for (let a = 1; a < n.value; a++) {
    let ok = false
    for (let b = 1; b < n.value; b++) if ((a * b) % n.value === 1) ok = true
    if (!ok) bad.push(a)
  }
  return bad
})

const status = computed(() => {
  if (op.value === 'add')
    return `every row contains a 0 — every element has an additive inverse: (ℤ${n.value}, +) is a group`
  return rowsWithoutInverse.value.length === 0
    ? `every non-zero row contains a 1 — every non-zero element is invertible: ℤ${n.value} is a FIELD`
    : `no 1 in the row(s) of ${rowsWithoutInverse.value.join(', ')} — no inverse: ℤ${n.value} is NOT a field`
})

const opSym = computed(() => (op.value === 'add' ? '+' : '·'))
const cellPx = computed(() => Math.min(36, Math.floor(330 / (n.value + 1))))
</script>

<template>
  <div class="modtable">
    <div class="controls">
      <button :class="{ on: op === 'add' }" @click="op = 'add'; hover = null">+</button>
      <button :class="{ on: op === 'mul' }" @click="op = 'mul'; hover = null">×</button>
      <label>
        n = {{ n }}
        <input type="range" min="2" max="12" :value="n" @input="n = +($event.target as HTMLInputElement).value; hover = null">
      </label>
    </div>

    <div
      class="grid"
      :style="{ gridTemplateColumns: `repeat(${n + 1}, ${cellPx}px)`, '--cell': `${cellPx}px` }"
      @pointerleave="hover = null"
    >
      <div class="cell corner">{{ opSym }}</div>
      <div v-for="b in range" :key="'h' + b" class="cell head">{{ b }}</div>
      <template v-for="a in range" :key="'r' + a">
        <div class="cell head">{{ a }}</div>
        <div
          v-for="b in range"
          :key="a + '-' + b"
          class="cell"
          :class="{
            witness: isWitness(a, b),
            cross: hover && (hover.a === a || hover.b === b),
            zero: op === 'mul' && (a === 0 || b === 0),
          }"
          @pointerenter="hover = { a, b }"
        >{{ val(a, b) }}</div>
      </template>
    </div>

    <div class="readout">
      <template v-if="hover">
        {{ hover.a }} {{ opSym }} {{ hover.b }} ≡ {{ val(hover.a, hover.b) }} (mod {{ n }})
      </template>
      <template v-else>{{ status }}</template>
    </div>
  </div>
</template>

<style scoped>
.modtable {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  font-variant-numeric: tabular-nums;
}
.controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.92rem;
  color: var(--ink-muted);
}
.controls label { display: flex; align-items: center; gap: 0.5rem; }
input[type='range'] { accent-color: var(--accent); width: 120px; }
button {
  border: 1px solid var(--accent);
  color: var(--accent);
  background: transparent;
  border-radius: 999px;
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover, button.on { background: var(--accent); color: var(--paper); }

.grid {
  display: grid;
  gap: 2px;
  padding: 8px;
  border-radius: 12px;
  background: var(--paper-soft);
}
.cell {
  width: var(--cell);
  height: var(--cell);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--cell) * 0.42);
  border-radius: 6px;
  background: color-mix(in srgb, var(--ink) 4%, transparent);
  transition: background 0.15s, color 0.15s;
}
.cell.head, .cell.corner {
  background: transparent;
  color: var(--accent);
  font-weight: 650;
}
.cell.zero { color: var(--ink-muted); opacity: 0.55; }
.cell.cross { background: color-mix(in srgb, var(--accent) 14%, transparent); }
.cell.witness {
  background: var(--accent);
  color: var(--paper);
  font-weight: 650;
}
.readout {
  min-height: 1.3em;
  max-width: 26rem;
  text-align: center;
  font-size: 0.88rem;
  color: var(--ink-muted);
  line-height: 1.35;
}
</style>
