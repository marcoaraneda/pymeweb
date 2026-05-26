<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <section class="relative overflow-hidden bg-gradient-to-br from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] text-white">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" aria-hidden="true" />
      <div class="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:py-20">
        <div class="space-y-5 lg:w-1/2">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em]">Tienda oficial</p>
          <h1 class="text-4xl font-bold leading-tight md:text-5xl">{{ tenantStore.data?.name || 'Tu tienda online' }}</h1>
          <p class="max-w-2xl text-lg text-white/80">
            Explora un catálogo curado con envíos rápidos y una experiencia pensada para conversión. Personaliza el acento visual para alinear la tienda a tu marca.
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              :to="`/store/${slug}/productos`"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              :style="accentStyle"
            >
              Ver catálogo
              <span aria-hidden="true">→</span>
            </NuxtLink>
            <a href="#destacados" class="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition">
              Ofertas y destacados
            </a>
          </div>
          <div class="flex flex-wrap gap-2 text-sm text-white/75">
            <span class="rounded-full border border-white/15 px-3 py-1">Pago seguro</span>
            <span class="rounded-full border border-white/15 px-3 py-1">Envíos rápidos</span>
            <span v-if="tenantStore.categories.length" class="rounded-full border border-white/15 px-3 py-1">{{ tenantStore.categories.length }} categorías</span>
          </div>
        </div>

        <div class="relative lg:w-1/2">
          <div class="absolute -inset-6 rounded-3xl bg-white/10 blur-2xl" />
          <div class="relative rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur">
            <p class="text-sm text-white/80">Vista rápida</p>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <div v-for="product in previewProducts" :key="product.id" class="rounded-2xl bg-white/10 p-4 shadow-inner">
                <p class="text-xs uppercase text-white/60">{{ product.category?.name || 'General' }}</p>
                <p class="text-lg font-semibold">{{ product.name }}</p>
                <p class="text-sm text-white/80">${{ product.price }}</p>
              </div>
            </div>
            <p v-if="!previewProducts.length" class="text-white/70">Aún no hay productos cargados.</p>
          </div>
        </div>
      </div>
    </section>

    <section v-if="canEditTheme" class="mx-auto max-w-6xl px-6 py-10" id="personaliza">
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Tema de esta tienda</p>
            <h2 class="text-xl font-semibold text-slate-900">Personaliza colores de acento y fondo</h2>
            <p class="text-slate-600">Se guarda localmente por tienda.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-2">
              <span class="text-sm text-slate-600">Acento</span>
              <button
                v-for="c in palette"
                :key="c"
                class="h-8 w-8 rounded-full border border-slate-200 shadow-inner transition hover:-translate-y-0.5"
                :style="{ backgroundColor: c }"
                @click="setAccent(c)"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-slate-600">Degradado</span>
              <button
                v-for="g in gradients"
                :key="g.from"
                class="h-10 w-14 rounded-xl border border-slate-200 shadow-inner transition hover:-translate-y-0.5"
                :style="{ backgroundImage: `linear-gradient(120deg, ${g.from}, ${g.to})` }"
                @click="setGradient(g.from, g.to)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-4" id="destacados">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Ofertas</p>
          <h2 class="text-2xl font-semibold">Destacados de la semana</h2>
        </div>
        <NuxtLink :to="`/store/${slug}/productos`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Ver todo</NuxtLink>
      </div>
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="product in featuredProducts"
          :key="product.id"
          class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="h-40 bg-slate-100" />
          <div class="p-4 space-y-2">
            <p class="text-xs uppercase text-slate-500">{{ product.category?.name || 'General' }}</p>
            <h3 class="text-lg font-semibold text-slate-900 group-hover:text-slate-700">{{ product.name }}</h3>
            <div class="flex items-center gap-2">
              <p class="text-base font-bold" :style="{ color: accentColor }">
                <span v-if="product.offer_price" class="mr-1 text-slate-400 line-through">${{ product.price }}</span>
                ${{ product.offer_price || product.price }}
              </p>
              <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
              <span v-else-if="product.offer_price" class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Oferta</span>
              <span v-if="product.is_marketplace" class="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-800">Marketplace</span>
            </div>
            <div class="flex gap-2">
              <NuxtLink :to="`/store/${slug}/productos/${product.slug}`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Ver detalle</NuxtLink>
              <button class="text-sm font-semibold text-slate-700 hover:text-slate-900" @click="cart.addProduct(product)">Agregar</button>
            </div>
          </div>
        </article>
        <p v-if="!featuredProducts.length" class="text-slate-600">No hay productos destacados todavía.</p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-10" id="catalogo">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Catálogo completo</p>
          <h2 class="text-2xl font-semibold text-slate-900">Explora todos los productos</h2>
        </div>
        <div v-if="tenantStore.categories.length" class="flex flex-wrap gap-2 text-sm">
          <span v-for="cat in tenantStore.categories" :key="cat" class="rounded-full border border-slate-200 px-3 py-1 text-slate-700">{{ cat }}</span>
        </div>
      </div>

      <div v-if="tenantStore.loading" class="mt-6 text-slate-500">Cargando productos...</div>
      <div v-else-if="!tenantStore.productos.length" class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        Aún no hay productos cargados en esta tienda.
      </div>
      <div v-else class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="product in tenantStore.productos"
          :key="product.id"
          class="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="h-44 w-full overflow-hidden rounded-t-2xl bg-slate-100">
            <img :src="getProductImage(product)" :alt="product.name" class="h-full w-full object-cover" />
          </div>
          <div class="p-4 space-y-2">
            <p class="text-xs uppercase text-slate-500">{{ product.category?.name || 'General' }}</p>
            <h3 class="text-lg font-semibold text-slate-900 group-hover:text-slate-700">{{ product.name }}</h3>
            <p class="text-sm text-slate-600 line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center justify-between pt-2">
              <div class="flex items-center gap-2">
                <p class="text-base font-bold" :style="{ color: accentColor }">
                  <span v-if="product.offer_price" class="mr-1 text-slate-400 line-through">${{ product.price }}</span>
                  ${{ product.offer_price || product.price }}
                </p>
                <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
                <span v-else-if="product.offer_price" class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Oferta</span>
                  <span v-if="product.is_marketplace" class="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-800">Marketplace</span>
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
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta } from '#imports'
import { useTenantStore } from '~/stores/tenant'
import { useCartStore } from '~/stores/cart'
import { useThemeStore } from '~/stores/theme'
import { useImages } from '~/composables/useImages'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'store' })

const route = useRoute()
const slug = route.params.slug as string

const tenantStore = useTenantStore()
const cart = useCartStore()
const theme = useThemeStore()
const auth = useAuthStore()
const { getProductImage } = useImages()

const palette = ['#2563eb', '#16a34a', '#f59e0b', '#e11d48', '#7c3aed']
const gradients = [
  { from: '#0f172a', to: '#0b2358' },
  { from: '#0b3b2e', to: '#0f766e' },
  { from: '#2b0b3f', to: '#7c3aed' },
  { from: '#3b0a1a', to: '#e11d48' },
]

const accentColor = computed(() => theme.accent || '#2563eb')
const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: '#fff' }))
const canEditTheme = computed(() => {
  const membership = (auth.user as any)?.memberships || []
  const ownsStore = membership.some((m: any) => m?.store?.slug === slug && (m.roles || []).some((r: string) => ['admin', 'owner', 'manager'].includes(r?.toLowerCase?.())))
  return Boolean((auth.user as any)?.is_staff || ownsStore)
})
const featuredProducts = computed(() => {
  const all = tenantStore.productos || []
  const weekly = all.filter((p: any) => p.product_of_week)
  if (weekly.length) return weekly
  const highlighted = all.filter((p: any) => p.is_featured)
  if (highlighted.length) return highlighted
  return all.slice(0, 3)
})
const previewProducts = computed(() => (tenantStore.productos || []).slice(0, 4))

const setAccent = (color: string) => theme.setStoreTheme(slug, { accent: color })
const setGradient = (from: string, to: string) => theme.setStoreTheme(slug, { gradientFrom: from, gradientTo: to })

const loadData = async () => {
  tenantStore.setSlug(slug)
  await Promise.all([tenantStore.fetchTienda(), tenantStore.fetchProductos()])
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await loadData()
})
</script>
