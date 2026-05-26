<template>
  <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1">
    <div class="absolute inset-0 opacity-0 transition group-hover:opacity-100" :style="glowStyle" aria-hidden="true" />
    <div class="relative flex items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ title }}</p>
        <p class="mt-2 text-3xl font-extrabold">{{ value }}</p>
      </div>
      <div class="flex h-12 w-12 items-center justify-center rounded-xl text-lg text-white" :style="badgeStyle">
        {{ icon }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ title: string; value: number | string; icon: string; accent?: string }>()

const accent = computed(() => props.accent || '#2563eb')
const badgeStyle = computed(() => ({ backgroundColor: accent.value }))
const glowStyle = computed(() => ({ background: `radial-gradient(circle at 20% 20%, ${accent.value}26, transparent 55%)` }))
</script>
