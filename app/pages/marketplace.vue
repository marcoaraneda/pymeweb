<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <section class="relative overflow-hidden bg-gradient-to-br from-[var(--gradient-from,#0f172a)] to-[var(--gradient-to,#0b2358)] text-white">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" aria-hidden="true" />
      <div class="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 lg:flex-row lg:items-center lg:py-20">
        <div class="space-y-5 lg:w-1/2">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em]">Marketplace</p>
          <h1 class="text-4xl font-bold leading-tight md:text-5xl">Explora productos y tiendas en un solo lugar</h1>
          <p class="max-w-2xl text-lg text-white/80">
            Descubre artículos publicados para marketplace y entra directo a la tienda propietaria para finalizar tu compra.
          </p>
          <div class="flex flex-wrap gap-3">
            <a href="#productos" class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5" :style="{ backgroundColor: theme.accent, color: '#fff' }">
              Ver productos
              <span aria-hidden="true">→</span>
            </a>
            <a href="#tiendas" class="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition">
              Ver todas las tiendas
            </a>
          </div>
        </div>
        <div class="relative lg:w-1/2">
          <div class="absolute -inset-6 rounded-3xl bg-white/10 blur-2xl" />
          <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <p class="text-sm text-white/80">Productos destacados</p>
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div v-for="prod in productsPreview" :key="prod.id" class="rounded-2xl bg-white/10 p-4 text-sm shadow-inner">
                <p class="text-xs uppercase text-white/60">{{ prod.store?.slug || 'tienda' }}</p>
                <p class="text-base font-semibold">{{ prod.name }}</p>
                <p class="text-white/80">${{ prod.offer_price || prod.price }}</p>
              </div>
              <p v-if="!productsPreview.length" class="text-white/70">Aún no hay productos en marketplace.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="productos" class="mx-auto max-w-6xl px-6 py-10 space-y-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Marketplace</p>
          <h2 class="text-2xl font-semibold text-slate-900">Productos publicados</h2>
          <p class="text-slate-600">Compra directo en la tienda donde se publicó.</p>
        </div>
        <input
          v-model="productSearch"
          type="text"
          placeholder="Buscar producto..."
          class="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none md:w-72"
        />
      </div>

      <div v-if="loadingProducts" class="text-slate-500">Cargando productos...</div>
      <div v-else-if="productsError" class="text-red-600">{{ productsError }}</div>
      <div v-else-if="!filteredProducts.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        No hay productos publicados en marketplace.
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="product in filteredProducts"
          :key="product.id"
          class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div class="h-44 w-full overflow-hidden bg-slate-100">
            <img :src="productImage(product)" :alt="product.name" class="h-full w-full object-cover" />
          </div>
          <div class="p-4 space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-xs uppercase text-slate-500">{{ product.category?.name || 'General' }}</p>
              <span class="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{{ product.store?.slug || 'tienda' }}</span>
            </div>
            <h3 class="text-lg font-semibold text-slate-900 group-hover:text-slate-700 line-clamp-1">{{ product.name }}</h3>
            <p class="text-sm text-slate-600 line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center gap-2">
              <p class="text-base font-bold" :style="{ color: theme.accent }">
                <span v-if="product.offer_price" class="mr-1 text-slate-400 line-through">${{ product.price }}</span>
                ${{ product.offer_price || product.price }}
              </p>
              <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
              <span v-else-if="product.offer_price" class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Oferta</span>
              <span class="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-800">Marketplace</span>
            </div>
            <div class="flex items-center gap-2 pt-1">
              <NuxtLink
                :to="`/store/${product.store?.slug}/productos/${product.slug}`"
                class="rounded-lg px-3 py-2 text-sm font-semibold text-white shadow"
                :style="{ backgroundColor: theme.accent }"
              >
                Ver producto
              </NuxtLink>
              <NuxtLink
                :to="`/store/${product.store?.slug}`"
                class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
              >
                Ver tienda
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useThemeStore } from '~/stores/theme'

const theme = useThemeStore()
const config = useRuntimeConfig()

const products = ref<any[]>([])
const loadingProducts = ref(true)
const productsError = ref('')
const productSearch = ref('')

const filteredProducts = computed(() => {
  const term = productSearch.value.trim().toLowerCase()
  if (!term) return products.value
  return products.value.filter((p) => p.name.toLowerCase().includes(term) || p.store?.slug?.toLowerCase()?.includes(term))
})

const productsPreview = computed(() => filteredProducts.value.slice(0, 4))

const productImage = (product: any) => product?.images?.[0]?.image || 'https://via.placeholder.com/400x240?text=Producto'

const fetchProducts = async () => {
  loadingProducts.value = true
  productsError.value = ''
  try {
    products.value = await $fetch(`${config.public.apiBase}/marketplace/products/`)
  } catch (err) {
    productsError.value = 'Error al cargar productos'
  } finally {
    loadingProducts.value = false
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyTheme()
  await fetchProducts()
})
</script>
