<template>
  <div class="bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-6xl space-y-6">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Catálogo</p>
          <h1 class="text-3xl font-bold text-slate-900">Todos los productos</h1>
          <p class="text-slate-600">Explora y añade al carrito con un clic.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <NuxtLink :to="`/store/${slug}/carrito`" class="rounded-xl px-3 py-2 text-sm font-semibold text-white shadow" :style="accentStyle">
            🛒
          </NuxtLink>
          <NuxtLink
            v-if="auth.isAuthenticated"
            :to="`/store/${slug}/admin/productos/nuevo`"
            class="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
          >
            + Agregar producto
          </NuxtLink>
        </div>
      </div>

      <div v-if="tenantStore.loading" class="text-slate-500">Cargando productos...</div>
      <div v-else-if="!tenantStore.productos.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        No hay productos para esta tienda todavía.
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="product in tenantStore.productos"
          :key="product.id"
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="h-44 w-full overflow-hidden bg-slate-100">
            <img :src="getProductImage(product)" :alt="product.name" class="h-full w-full object-cover" />
          </div>
          <div class="p-4 space-y-2">
            <p class="text-xs uppercase text-slate-500">{{ product.category?.name || 'General' }}</p>
            <h2 class="text-lg font-semibold text-slate-900 group-hover:text-slate-700">{{ product.name }}</h2>
            <p class="text-sm text-slate-600 line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center justify-between pt-2">
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <p class="text-base font-bold" :style="{ color: accentColor }">
                    <span v-if="product.offer_price" class="mr-1 text-slate-400 line-through">${{ product.price }}</span>
                    ${{ product.offer_price || product.price }}
                  </p>
                  <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
                  <span v-else-if="product.offer_price" class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Oferta</span>
                  <span v-if="product.is_marketplace" class="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-800">Marketplace</span>
                </div>
              </div>
              <div class="flex gap-2">
                <NuxtLink
                  :to="`/store/${slug}/productos/${product.slug}`"
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  Ver
                </NuxtLink>
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-white shadow"
                  :style="accentStyle"
                  @click="cart.addProduct(product)"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta } from '#imports'
import { useTenantStore } from '~/stores/tenant'
import { useCartStore } from '~/stores/cart'
import { useImages } from '~/composables/useImages'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'store' })

const route = useRoute()
const slug = route.params.slug as string

const tenantStore = useTenantStore()
const cart = useCartStore()
const theme = useThemeStore()
const auth = useAuthStore()
const { getProductImage } = useImages()

const accentColor = computed(() => theme.accent || '#2563eb')
const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: '#fff' }))

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  tenantStore.setSlug(slug)
  await tenantStore.fetchProductos()
})
</script>
