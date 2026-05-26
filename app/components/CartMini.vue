<template>
  <div class="relative inline-flex flex-col gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow min-w-[140px]">
    <div class="flex items-center justify-between gap-2">
      <div class="inline-flex items-center gap-2">
        <ShoppingCart class="h-4 w-4" aria-hidden="true" />
        <span>{{ cart.totalItems }} items</span>
      </div>
      <span class="text-xs font-semibold text-slate-500">{{ formattedTotal }}</span>
    </div>
    <p v-if="cart.lastNotice" class="text-[11px] font-normal text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2 py-1">
      {{ cart.lastNotice }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()

const formattedTotal = computed(() => {
  const value = Number(cart.totalPrice || 0)
  if (!Number.isFinite(value)) return '$0'
  return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 })
})
</script>
