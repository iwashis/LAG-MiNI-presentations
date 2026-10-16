<script setup lang="ts">
import katex from 'katex'
import { computed, ref } from 'vue'
import { texMacros } from '../lib/tex-macros'

const props = withDefaults(defineProps<{
  /** TeX strings, one per step (display mode) */
  steps: string[]
  /** optional caption per step */
  captions?: string[]
  /** 'stack': steps accumulate; 'replace': one at a time */
  mode?: 'stack' | 'replace'
}>(), {
  mode: 'stack',
})

const i = ref(0)
const total = computed(() => props.steps.length)

const rendered = computed(() =>
  props.steps.map(s =>
    katex.renderToString(s, {
      displayMode: true,
      throwOnError: false,
      strict: false,
      macros: { ...texMacros },
    }),
  ),
)
const visible = computed(() =>
  props.mode === 'stack'
    ? rendered.value.slice(0, i.value + 1).map((html, j) => ({ html, j }))
    : [{ html: rendered.value[i.value], j: i.value }],
)
</script>

<template>
  <div class="stepper">
    <div class="steps">
      <div
        v-for="v in visible" :key="v.j"
        class="step" :class="{ current: v.j === i }"
        v-html="v.html"
      />
    </div>
    <div class="bar">
      <button :disabled="i === 0" @click="i--">‹</button>
      <span class="count">{{ i + 1 }} / {{ total }}</span>
      <button :disabled="i === total - 1" @click="i++">›</button>
      <span v-if="captions?.[i]" class="caption">{{ captions[i] }}</span>
    </div>
  </div>
</template>

<style scoped>
.stepper { margin: 0.4rem 0; }
.steps { min-height: 3rem; }
.step {
  opacity: 0.38;
  transition: opacity 0.4s;
  animation: rise 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.step.current { opacity: 1; }
.step :deep(.katex-display) { margin: 0.45rem 0; }
@keyframes rise {
  from { opacity: 0; transform: translateY(10px); }
  to { transform: translateY(0); }
}
.bar {
  display: flex; align-items: center; gap: 0.7rem;
  margin-top: 0.3rem;
  color: var(--ink-muted); font-size: 0.9rem;
}
button {
  border: 1px solid var(--accent);
  color: var(--accent);
  background: transparent;
  border-radius: 999px;
  width: 1.9rem; height: 1.9rem;
  font-size: 1.05rem; line-height: 1;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
button:hover:not(:disabled) { background: var(--accent); color: var(--paper); }
button:disabled { opacity: 0.3; cursor: default; }
.count { font-variant-numeric: tabular-nums; }
.caption { font-style: italic; }
</style>
