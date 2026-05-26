<template>
  <NuxtPage v-if="!isMarketplaceRoot" />
  <div v-else class="min-h-screen bg-slate-50">
    <section class="relative overflow-hidden bg-slate-900 text-white" :style="heroStyle">
      <div
        class="absolute inset-0 opacity-80"
        style="background: radial-gradient(circle at 10% 20%, var(--gradient-from), transparent 35%), radial-gradient(circle at 80% 0%, var(--gradient-to), transparent 40%);"
      ></div>
      <div class="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between">
        <div class="space-y-5">
          <div class="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-amber-100/90 backdrop-blur">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
              <img src="/logoPW.png" alt="Pymeweb" class="h-5 w-5 object-contain" />
            </span>
            PW Marketplace
          </div>
          <h1 class="max-w-2xl text-3xl font-semibold leading-tight lg:text-4xl">Publica tus productos y véndelos en PW Marketplace</h1>
          <p class="max-w-2xl text-slate-100/80">Sube productos sin tener una tienda propia y controla qué está activo o vendido.</p>
          <div class="grid gap-3 sm:grid-cols-2 lg:max-w-xl">
            <NuxtLink
              :to="auth.isAuthenticated ? '/marketplace/mis-productos' : '/login'"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {{ auth.isAuthenticated ? 'Publicar producto' : 'Iniciar sesión para publicar' }}
            </NuxtLink>
            <NuxtLink
              to="/marketplace/mis-productos"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Gestionar mis productos
            </NuxtLink>
            <NuxtLink
              v-if="myMarketplaceProfilePath"
              :to="myMarketplaceProfilePath"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 sm:col-span-2"
            >
              Ver mi perfil
            </NuxtLink>
            <a
              href="#productos"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 sm:col-span-2"
            >
              Ver productos publicados
            </a>
          </div>
        </div>

        <div class="grid w-full max-w-xl grid-cols-2 gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur">
          <article v-for="product in filteredProducts.slice(0, 4)" :key="product.id" class="rounded-xl border border-white/10 bg-white/5 p-3">
            <img :src="product.image_url || product.images?.[0]?.image || product.image || '/logoPW.png'" :alt="product.name" class="mb-2 h-20 w-full rounded-lg object-cover" />
            <p class="text-xs uppercase text-amber-200/80">{{ product.category?.name || 'General' }}</p>
            <p class="text-sm font-semibold text-white line-clamp-1">{{ product.name }}</p>
            <p class="text-base font-bold text-red-200">
              <span v-if="product.offer_price" class="mr-1 text-slate-300 line-through">{{ formatClp(product.price) }}</span>
              {{ formatClp(displayPrice(product)) }}
            </p>
            <p v-if="product.offer_price && Number(product.offer_min_qty || 1) > 1" class="text-[11px] font-semibold text-rose-200">Oferta desde {{ Number(product.offer_min_qty) }} unidades</p>
          </article>
          <div v-if="!filteredProducts.length" class="col-span-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-amber-100">
            Sin productos cargados todavía.
          </div>
        </div>
      </div>
    </section>

    <section id="productos" class="mx-auto max-w-6xl space-y-5 px-6 py-8">
      <div class="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="rounded-[2rem] border border-[#0f274f]/15 bg-gradient-to-br from-white via-[#f8fafc] to-amber-50 p-5 shadow-sm sm:p-6">
          <p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#0f274f]/70">PW Marketplace</p>
          <h2 class="section-title section-title--marketplace mt-2 text-3xl">Productos destacados para comprar con confianza</h2>
          <p class="mt-3 max-w-2xl text-slate-600">Encuentra ofertas de distintas tiendas y compra directo desde su origen, en un solo lugar.</p>

          <div class="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span class="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">{{ filteredProducts.length }} resultados</span>
            <span class="rounded-full border border-[#0f274f]/20 bg-[#0f274f]/5 px-3 py-1 text-[#0f274f] shadow-sm">Página {{ page }} de {{ totalPages }}</span>
            <span v-for="item in activeFilters" :key="item" class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800 shadow-sm">{{ item }}</span>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <article class="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm backdrop-blur">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Descubre</p>
              <p class="mt-2 text-sm text-slate-700">Explora productos activos con un filtro rápido y visual.</p>
            </article>
            <article class="rounded-2xl border border-sky-100 bg-sky-50 p-4 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Compra seguro</p>
              <p class="mt-2 text-sm text-slate-700">Cada producto mantiene su origen y su contexto de tienda.</p>
            </article>
            <article class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Vende mejor</p>
              <p class="mt-2 text-sm text-slate-700">Publica desde tu perfil o centraliza tus productos aquí.</p>
            </article>
          </div>
        </div>

        <div class="rounded-[2rem] border border-[#0f274f]/15 bg-gradient-to-br from-slate-950 via-[#0f274f] to-[#173b6b] p-5 text-white shadow-2xl sm:p-6">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/90">Publica y destaca</p>
              <p class="mt-2 text-lg font-semibold">Activa tu vitrina en un espacio con más presencia.</p>
            </div>
            <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">Marketplace</span>
          </div>
          <p class="mt-3 text-sm text-slate-100/80">Sube productos sin tienda o gestiona los tuyos desde aquí, con el mismo lenguaje visual del marketplace.</p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink
              :to="auth.isAuthenticated ? '/marketplace/mis-productos' : '/login'"
              class="rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
            >
              {{ auth.isAuthenticated ? 'Publicar ahora' : 'Iniciar sesión para publicar' }}
            </NuxtLink>
            <NuxtLink
              v-if="auth.isAuthenticated"
              to="/marketplace/mis-productos"
              class="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
            >
              Gestionar mis productos
            </NuxtLink>
            <NuxtLink
              v-if="myMarketplaceProfilePath"
              :to="myMarketplaceProfilePath"
              class="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
            >
              Ver mi perfil
            </NuxtLink>
          </div>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <p class="text-xs uppercase tracking-[0.16em] text-amber-100/80">Acción</p>
              <p class="mt-1 text-sm font-semibold">Sube, organiza y vende.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <p class="text-xs uppercase tracking-[0.16em] text-cyan-100/80">Paleta</p>
              <p class="mt-1 text-sm font-semibold">Oscuro, ámbar y azul profundo.</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
              <p class="text-xs uppercase tracking-[0.16em] text-emerald-100/80">Flujo</p>
              <p class="mt-1 text-sm font-semibold">Rápido y claro en móvil.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="filter-panel w-full rounded-[2rem] border border-[#0f274f]/15 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,39,79,0.08)] sm:p-6">
        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-[210px_210px_auto_280px] xl:items-end">
          <label class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Categoría</span>
            <select
              v-model="categoryFilter"
              class="h-11 w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-3 py-2 text-sm text-slate-700 shadow-inner outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Orden</span>
            <select
              v-model="sortOrder"
              class="h-11 w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-3 py-2 text-sm text-slate-700 shadow-inner outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
            >
              <option value="">Ordenar por precio</option>
              <option value="price_asc">Menor a mayor</option>
              <option value="price_desc">Mayor a menor</option>
              <option value="name_asc">A → Z</option>
              <option value="name_desc">Z → A</option>
            </select>
          </label>
          <label v-if="auth.isAuthenticated" class="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-2 text-sm text-slate-700 shadow-inner">
            <input v-model="mineOnly" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
            Solo mis productos
          </label>
          <label class="flex flex-col gap-2">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Buscar</span>
            <input
              v-model="productSearch"
              type="text"
              placeholder="Buscar producto..."
              class="h-11 w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-2 text-sm text-slate-700 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-100"
            />
          </label>
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <button
            type="button"
            class="inline-flex h-9 items-center rounded-full border px-3 text-xs font-semibold transition"
            :class="offerOnly ? 'border-amber-300 bg-amber-100 text-amber-800 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
            @click="offerOnly = !offerOnly"
          >
            Solo ofertas
          </button>
          <button
            type="button"
            class="inline-flex h-9 items-center rounded-full border px-3 text-xs font-semibold transition"
            :class="inStockOnly ? 'border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'"
            @click="inStockOnly = !inStockOnly"
          >
            Solo con stock
          </button>
          <button
            v-if="activeFilters.length"
            type="button"
            class="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300"
            @click="clearFilters"
          >
            Limpiar todo
          </button>
          <span class="ml-auto rounded-full border border-[#0f274f]/15 bg-[#0f274f]/5 px-3 py-1 text-xs font-semibold text-[#0f274f]">{{ filteredProducts.length }} resultados</span>
        </div>
      </div>

      <div v-if="loadingProducts" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="`skeleton-${i}`" class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="mb-3 h-3 w-24 rounded bg-slate-200" />
          <div class="mb-2 h-4 w-32 rounded bg-slate-200" />
          <div class="mb-4 h-4 w-full rounded bg-slate-200" />
          <div class="h-8 w-28 rounded bg-slate-200" />
        </div>
      </div>
      <div v-else-if="productsError" class="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
        <div class="flex items-center justify-between gap-3">
          <span>{{ productsError }}</span>
          <button
            class="rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
            :disabled="loadingProducts"
            @click="fetchProducts"
          >
            Reintentar
          </button>
        </div>
      </div>
      <div v-else-if="!filteredProducts.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        <p class="font-semibold text-slate-800">No hay productos publicados en marketplace.</p>
        <p class="text-sm text-slate-600">Sé el primero en publicar un producto.</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <NuxtLink
            :to="auth.isAuthenticated ? '/marketplace/mis-productos' : '/login'"
            class="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-700"
          >
            {{ auth.isAuthenticated ? 'Publicar producto' : 'Iniciar sesión para publicar' }}
          </NuxtLink>
          <NuxtLink
            v-if="auth.isAuthenticated"
            to="/marketplace/mis-productos"
            class="rounded-xl border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
          >
            Gestionar mis productos
          </NuxtLink>
          <NuxtLink
            v-if="myMarketplaceProfilePath"
            :to="myMarketplaceProfilePath"
            class="rounded-xl border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
          >
            Ver mi perfil
          </NuxtLink>
        </div>
      </div>
      <div v-else class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          :accent="marketplaceAccent"
          :isMarketplace="true"
          :isMine="isMine(product)"
        />
      </div>

      <div v-if="filteredProducts.length > perPage" class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#0f274f]/20 bg-[#0f274f]/5 px-4 py-3 text-sm text-[#0f274f]">
        <button
          class="rounded-lg border border-[#0f274f]/20 bg-white px-3 py-1.5 font-semibold hover:bg-[#0f274f]/10 disabled:opacity-40"
          :disabled="page === 1"
          @click="page -= 1"
        >
          Anterior
        </button>
        <p>Mostrando {{ pageStart }}-{{ pageEnd }} de {{ filteredProducts.length }}</p>
        <button
          class="rounded-lg border border-[#0f274f]/20 bg-white px-3 py-1.5 font-semibold hover:bg-[#0f274f]/10 disabled:opacity-40"
          :disabled="page === totalPages"
          @click="page += 1"
        >
          Siguiente
        </button>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import ProductCard from '~/components/ProductCard.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useRoute } from 'vue-router'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useMarketplaceRequests } from '~/composables/useMarketplaceRequests'

const theme = useThemeStore()
const auth = useAuthStore()
const cart = useCartStore()
const config = useRuntimeConfig()
const route = useRoute()
const { controlledGet } = useMarketplaceRequests()
const isMarketplaceRoot = computed(() => route.path === '/marketplace')

const marketplaceAccent = '#f59e0b'
const heroStyle = computed(() => ({ '--gradient-from': '#92400e', '--gradient-to': marketplaceAccent }))

const products = ref<any[]>([])
const loadingProducts = ref(true)
const productsError = ref('')
const productSearch = ref('')
const categoryFilter = ref('')
const sortOrder = ref('')
const mineOnly = ref(false)
const offerOnly = ref(false)
const inStockOnly = ref(false)
const categories = ref<{ slug: string; name: string }[]>([])
const page = ref(1)
const perPage = 12
const myMarketplaceProfilePath = computed(() => {
  const id = (auth.user as any)?.id
  return id ? `/marketplace/vendedores/${id}` : ''
})

const activeFilters = computed(() => {
  const items: string[] = []
  if (productSearch.value.trim()) items.push(`Búsqueda: ${productSearch.value.trim()}`)
  if (categoryFilter.value) {
    const category = categories.value.find((item) => item.slug === categoryFilter.value)
    items.push(`Categoría: ${category?.name || categoryFilter.value}`)
  }
  if (sortOrder.value === 'price_asc') items.push('Precio: menor a mayor')
  if (sortOrder.value === 'price_desc') items.push('Precio: mayor a menor')
  if (sortOrder.value === 'name_asc') items.push('Nombre: A → Z')
  if (sortOrder.value === 'name_desc') items.push('Nombre: Z → A')
  if (mineOnly.value) items.push('Solo mis productos')
  if (offerOnly.value) items.push('Solo ofertas')
  if (inStockOnly.value) items.push('Solo con stock')
  return items
})
const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0)

const displayPrice = (product: any) => {
  const minQty = Math.max(1, Number(product?.offer_min_qty || 1))
  if (product?.offer_price && minQty <= 1) return Number(product.offer_price)
  return Number(product?.price || 0)
}

const filteredProducts = computed(() => {
  let data = [...products.value]
  if (mineOnly.value) {
    data = data.filter((product) => isMine(product))
  }
  if (offerOnly.value) {
    data = data.filter((product) => Number(product?.offer_price || 0) > 0)
  }
  if (inStockOnly.value) {
    data = data.filter((product) => Number(product?.stock_available || 0) > 0)
  }
  if (sortOrder.value === 'price_asc') {
    data.sort((a, b) => Number(a.offer_price || a.price || 0) - Number(b.offer_price || b.price || 0))
  }
  if (sortOrder.value === 'price_desc') {
    data.sort((a, b) => Number(b.offer_price || b.price || 0) - Number(a.offer_price || a.price || 0))
  }
  if (sortOrder.value === 'name_asc') {
    data.sort((a, b) => String(a?.name || '').localeCompare(String(b?.name || '')))
  }
  if (sortOrder.value === 'name_desc') {
    data.sort((a, b) => String(b?.name || '').localeCompare(String(a?.name || '')))
  }
  return data
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)))
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})
const pageStart = computed(() => (filteredProducts.value.length ? (page.value - 1) * perPage + 1 : 0))
const pageEnd = computed(() => Math.min(page.value * perPage, filteredProducts.value.length))

const clearFilters = () => {
  productSearch.value = ''
  categoryFilter.value = ''
  sortOrder.value = ''
  mineOnly.value = false
  offerOnly.value = false
  inStockOnly.value = false
  page.value = 1
}

const isMine = (product: any) => {
  const userId = (auth.user as any)?.id
  return Boolean(userId && product?.submitted_by === userId)
}

const fetchProducts = async () => {
  loadingProducts.value = true
  productsError.value = ''
  try {
    const params = new URLSearchParams()
    if (productSearch.value.trim()) params.append('search', productSearch.value.trim())
    if (categoryFilter.value) params.append('category', categoryFilter.value)
    if (sortOrder.value === 'price_asc' || sortOrder.value === 'price_desc') params.append('order', sortOrder.value)
    const query = params.toString()
    products.value = await controlledGet<any[]>(
      `marketplace:products:${query}`,
      `${config.public.apiBase}/marketplace/products/?${query}`,
      { backoffMs: 8_000, minIntervalMs: 500 },
    )
  } catch (err: any) {
    if (err?.response?.status === 429) {
      productsError.value = 'Demasiadas solicitudes. Espera unos segundos para volver a consultar productos.'
    } else {
      productsError.value = 'Error al cargar productos'
    }
  } finally {
    loadingProducts.value = false
  }
}

const fetchCategories = async () => {
  try {
    categories.value = await $fetch(`${config.public.apiBase}/marketplace/categories/`)
  } catch {
    categories.value = []
  }
}

let fetchTimer: any = null
const scheduleFetch = () => {
  if (fetchTimer) clearTimeout(fetchTimer)
  fetchTimer = setTimeout(fetchProducts, 250)
}

watch([productSearch, categoryFilter, sortOrder], () => {
  page.value = 1
  scheduleFetch()
})

watch(mineOnly, () => {
  page.value = 1
})

watch([offerOnly, inStockOnly], () => {
  page.value = 1
})

watch(filteredProducts, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyTheme()
  await auth.initializeSession().catch(() => null)
  cart.loadFromStorage()
  cart.setContext('marketplace')
  await Promise.all([fetchProducts(), fetchCategories()])
})
</script>
