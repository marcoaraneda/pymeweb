<template>
  <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur transition hover:-translate-y-1">
    <div class="absolute inset-0 opacity-0 transition group-hover:opacity-100" :style="glowStyle" aria-hidden="true" />
    <div class="relative flex items-start justify-between gap-3">
      <div>
        <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ title }}</p>
        <p class="mt-2 text-3xl font-extrabold">{{ value }}</p>
      </div>
      <div class="flex h-12 w-12 items-center justify-center rounded-xl text-white" :style="badgeStyle">
        <component v-if="iconComponent" :is="iconComponent" class="h-5 w-5" aria-hidden="true" />
        <span v-else class="text-lg">{{ iconText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

const props = defineProps<{ title: string; value: number | string; icon?: Component | string; accent?: string }>()

const accent = computed(() => props.accent || '#2563eb')
const badgeStyle = computed(() => ({ backgroundColor: accent.value }))
const glowStyle = computed(() => ({ background: `radial-gradient(circle at 20% 20%, ${accent.value}26, transparent 55%)` }))
const iconComponent = computed(() => (typeof props.icon === 'string' ? null : props.icon))
const iconText = computed(() => (typeof props.icon === 'string' ? props.icon : ''))
</script>
