<template>
  <div class="bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Carrito</p>
          <h1 class="text-3xl font-bold text-slate-900">Tus productos seleccionados</h1>
        </div>
        <NuxtLink v-if="tenantStore.slug" :to="`/store/${tenantStore.slug}/productos`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Seguir comprando</NuxtLink>
      </div>

      <div v-if="cart.items.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        Tu carrito está vacío. Agrega productos del catálogo.
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div>
            <h2 class="text-lg font-semibold text-slate-900">{{ item.name }}</h2>
            <p class="text-sm text-slate-600">Cantidad: {{ item.quantity }}</p>
          </div>

          <div class="text-right">
            <p class="text-base font-bold" :style="{ color: accentColor }">${{ item.price * item.quantity }}</p>
            <button @click="cart.removeProduct(item.id)" class="text-sm font-semibold text-red-600 hover:text-red-700">Quitar</button>
          </div>
        </div>

        <div class="flex flex-col items-end gap-3 border-t border-slate-200 pt-4">
          <p class="text-2xl font-bold text-slate-900">Total: ${{ cart.totalPrice }}</p>
          <NuxtLink
            v-if="tenantStore.slug"
            :to="`/store/${tenantStore.slug}/checkout`"
            class="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white shadow"
            :style="accentStyle"
          >
            Ir a pagar
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { definePageMeta } from '#imports'
import { useCartStore } from '~/stores/cart'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ layout: 'store' })

const cart = useCartStore()
const tenantStore = useTenantStore()
const theme = useThemeStore()

const accentColor = computed(() => theme.accent || '#2563eb')
const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: '#fff' }))

onMounted(() => {
  theme.loadFromStorage()
  theme.applyStoreTheme(tenantStore.slug)
})
</script>
