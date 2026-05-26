<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-6xl space-y-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Carrito</p>
          <h1 class="text-3xl font-bold text-slate-900">Tus productos seleccionados</h1>
          <p class="text-slate-600">Revisa cantidades y finaliza la compra en esta tienda.</p>
        </div>
        <NuxtLink
          v-if="tenantStore.slug"
          :to="`/store/${tenantStore.slug}/productos`"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
        >
          ← Seguir comprando
        </NuxtLink>
      </div>

      <div v-if="cart.items.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        Tu carrito está vacío. Agrega productos del catálogo.
      </div>

      <div v-else class="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div class="space-y-4">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"
          >
            <div class="h-24 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-32">
              <img :src="item.image || placeholder" :alt="item.name" class="h-full w-full object-cover" />
            </div>

            <div class="flex flex-1 flex-col justify-between gap-3">
              <div>
                <h2 class="text-lg font-semibold text-slate-900">{{ item.name }}</h2>
                <p class="text-sm text-slate-600">${{ item.price }} unidad</p>
                <p v-if="item.optionsSummary" class="mt-1 text-xs text-slate-500">{{ item.optionsSummary }}</p>
              </div>

              <div class="flex flex-wrap items-center gap-3">
                <div class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <button class="text-lg" @click="decrement(item)">−</button>
                  <input
                    class="w-12 border-none bg-transparent text-center text-sm font-semibold text-slate-900 focus:outline-none"
                    type="number"
                    :value="item.quantity"
                    min="1"
                    @input="onQtyInput($event, item)"
                  />
                  <button class="text-lg" @click="increment(item)">+</button>
                </div>

                <p class="text-base font-bold" :style="{ color: accentColor }">${{ item.price * item.quantity }}</p>
              </div>
            </div>

            <div class="flex flex-col justify-between text-right">
              <button class="text-sm font-semibold text-red-600 hover:text-red-700" @click="cart.removeProduct(item.id)">Quitar</button>
            </div>
          </article>
        </div>

        <aside class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Resumen</h3>
            <span class="text-sm text-slate-600">{{ cart.totalItems }} artículos</span>
          </div>
          <div class="space-y-2 text-sm text-slate-700">
            <div class="flex justify-between">
              <span>Subtotal</span>
              <span>${{ cart.totalPrice }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>Envío</span>
              <span>Se calcula en checkout</span>
            </div>
          </div>
          <div class="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
            <span>Total</span>
            <span>${{ cart.totalPrice }}</span>
          </div>

          <NuxtLink
            v-if="tenantStore.slug"
            :to="`/store/${tenantStore.slug}/checkout`"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow"
            :style="accentStyle"
          >
            Ir a pagar
          </NuxtLink>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta } from '#imports'
import { useCartStore } from '~/stores/cart'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ layout: 'store' })

const cart = useCartStore()
const tenantStore = useTenantStore()
const theme = useThemeStore()
const route = useRoute()
const slug = String(route.params.slug || '')

const accentColor = computed(() => theme.accent || '#2563eb')
const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: '#fff' }))
const placeholder = 'https://via.placeholder.com/300x200.png?text=Producto'

const increment = (item: any) => cart.updateQuantity(item.id, item.quantity + 1)
const decrement = (item: any) => cart.updateQuantity(item.id, item.quantity - 1)
const onQtyInput = (event: Event, item: any) => {
  const value = Number((event.target as HTMLInputElement).value)
  cart.updateQuantity(item.id, isNaN(value) ? item.quantity : value)
}

onMounted(() => {
  cart.setContext(slug)
  tenantStore.setSlug(slug)
  cart.loadFromStorage()
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
})
</script>
