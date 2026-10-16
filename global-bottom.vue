<script setup lang="ts">
import { useNav } from '@slidev/client'
import { computed } from 'vue'

const { currentPage, total, go, slides } = useNav()

const items = computed(() =>
  slides.value.map((s: any) => ({
    no: s.no,
    title: s.meta?.slide?.title ?? `Slide ${s.no}`,
    isSection:
      s.no === 1
      || /section-slide/.test(s.meta?.slide?.frontmatter?.class ?? ''),
  })),
)
</script>

<template>
  <nav class="progress-nav" aria-label="slide navigation">
    <div class="track">
      <button
        v-for="it in items"
        :key="it.no"
        class="seg"
        :class="{
          current: it.no === currentPage,
          done: it.no < currentPage,
          section: it.isSection,
        }"
        :aria-label="`${it.no}. ${it.title}`"
        @click="go(it.no)"
      >
        <span class="tip">{{ it.no }} — {{ it.title }}</span>
      </button>
    </div>
    <span class="count">{{ currentPage }} / {{ total }}</span>
  </nav>
</template>

<style scoped>
.progress-nav {
  position: fixed;
  inset: auto 0 0 0;
  z-index: 100;
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  padding: 0 0.75rem 0 0;
}

.track {
  display: flex;
  flex: 1;
  gap: 2px;
  height: 14px;
  align-items: flex-end;
}

.seg {
  position: relative;
  flex: 1;
  height: 4px;
  border: none;
  padding: 0;
  cursor: pointer;
  background: color-mix(in srgb, var(--ink-muted, #888) 28%, transparent);
  transition: height 0.18s cubic-bezier(0.22, 1, 0.36, 1), background 0.18s;
}
.seg.done { background: color-mix(in srgb, var(--accent, #1f4e79) 55%, transparent); }
.seg.current { background: var(--accent, #1f4e79); }
.seg.section {
  border-radius: 2px 2px 0 0;
  box-shadow: inset 0 2px 0 var(--accent, #1f4e79);
}

.track:hover .seg { height: 9px; }
.seg:hover { height: 14px !important; background: var(--accent, #1f4e79); }

/* tooltip */
.tip {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  white-space: nowrap;
  font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: var(--paper, #fff);
  background: var(--ink, #16181d);
  padding: 0.28rem 0.6rem;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, transform 0.15s;
}
.seg:first-child .tip { left: 0; transform: translateX(0) translateY(4px); }
.seg:last-child .tip { left: auto; right: 0; transform: translateX(0) translateY(4px); }
.seg:hover .tip { opacity: 1; transform: translateX(-50%) translateY(0); }
.seg:first-child:hover .tip,
.seg:last-child:hover .tip { transform: translateX(0) translateY(0); }

.count {
  font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  color: var(--ink-muted, #888);
  padding-bottom: 2px;
  user-select: none;
}

/* keep the bar out of print / PDF export */
@media print {
  .progress-nav { display: none; }
}
</style>
