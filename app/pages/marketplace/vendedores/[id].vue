<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 px-4 py-10">
    <div class="mx-auto max-w-6xl space-y-6">
      <NuxtLink to="/marketplace" class="text-sm font-semibold text-slate-700 hover:text-slate-900">← Volver al marketplace</NuxtLink>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div v-if="loading" class="text-slate-500">Cargando vendedor...</div>
        <div v-else-if="error" class="text-red-600">{{ error }}</div>
        <div v-else-if="!seller" class="text-slate-600">Vendedor no encontrado.</div>
        <div v-else class="space-y-4">
          <div class="flex flex-wrap items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-amber-100 text-lg font-semibold text-amber-900">
              <img v-if="seller.avatar_url" :src="seller.avatar_url" :alt="seller.username" class="h-full w-full object-cover" />
              <span v-else>{{ seller.username?.slice(0, 2)?.toUpperCase?.() }}</span>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Vendedor</p>
              <h1 class="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <span>{{ seller.username }}</span>
                <BadgeCheck v-if="seller.is_verified" class="h-5 w-5 text-red-600" aria-label="Verificado" />
              </h1>
              <p class="text-sm text-slate-600">{{ fullName }}</p>
              <div class="mt-1 flex flex-wrap items-center gap-2" aria-label="Calificación de vendedor">
                <button
                  v-for="star in [1, 2, 3, 4, 5]"
                  :key="`seller-star-${star}`"
                  type="button"
                  class="text-xl leading-none"
                  :class="star <= displayRating ? 'text-amber-500' : 'text-slate-300'"
                  :disabled="!canRateSeller || savingRating"
                  @click="rateSeller(star)"
                >
                  {{ star <= displayRating ? '★' : '☆' }}
                </button>
                <span class="text-xs text-slate-500">{{ ratingLabel }}</span>
              </div>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <article class="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-amber-800">Ventas cerradas</p>
              <p class="mt-2 text-2xl font-bold text-amber-950">{{ Number(salesSummary.total_orders || 0) }}</p>
              <p class="text-xs text-amber-800/80">Pedidos completados o entregados</p>
            </article>
            <article class="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-emerald-800">Unidades vendidas</p>
              <p class="mt-2 text-2xl font-bold text-emerald-950">{{ Number(salesSummary.total_units || 0) }}</p>
              <p class="text-xs text-emerald-800/80">Sumadas desde historial de ventas</p>
            </article>
            <article class="rounded-xl border border-sky-100 bg-sky-50 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-sky-800">Ingresos</p>
              <p class="mt-2 text-2xl font-bold text-sky-950">{{ formatClp(salesSummary.gross_sales || 0) }}</p>
              <p class="text-xs text-sky-800/80">Total vendido en marketplace</p>
            </article>
            <article class="rounded-xl border border-violet-100 bg-violet-50 p-4">
              <p class="text-xs uppercase tracking-[0.18em] text-violet-800">Ventas en proceso</p>
              <p class="mt-2 text-2xl font-bold text-violet-950">{{ Number(salesSummary.in_progress_orders || 0) }}</p>
              <p class="text-xs text-violet-800/80">Pedidos pendientes, preparando o en transito</p>
            </article>
          </div>

          <div class="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-xs uppercase tracking-[0.16em] text-rose-700">Seguridad marketplace</p>
                <h2 class="text-base font-semibold text-rose-900">Denunciar este perfil</h2>
                <p class="text-xs text-rose-800/80">Usa esta acción si detectas comportamiento sospechoso o incumplimiento de normas.</p>
              </div>
              <button
                class="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-900 hover:bg-rose-100 disabled:opacity-50"
                :disabled="!canReportSeller || savingReport"
                @click="showReportForm = !showReportForm"
              >
                {{ showReportForm ? 'Cancelar' : 'Denunciar' }}
              </button>
            </div>

            <div v-if="reportMessage" class="mt-3 rounded-lg border px-3 py-2 text-xs" :class="reportMessage.type === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-rose-200 bg-rose-100 text-rose-700'">
              {{ reportMessage.text }}
            </div>

            <form v-if="showReportForm" class="mt-3 space-y-2" @submit.prevent="submitSellerReport">
              <input
                v-model.trim="reportTitle"
                type="text"
                maxlength="140"
                placeholder="Título breve de la denuncia"
                class="h-10 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              />
              <textarea
                v-model.trim="reportDescription"
                rows="4"
                maxlength="1000"
                placeholder="Describe lo ocurrido con el mayor detalle posible"
                class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
              />
              <div class="flex items-center justify-end gap-2">
                <button type="button" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100" @click="showReportForm = false">Cerrar</button>
                <button
                  type="submit"
                  class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                  :disabled="savingReport"
                >
                  {{ savingReport ? 'Enviando...' : 'Enviar denuncia' }}
                </button>
              </div>
            </form>
          </div>

          <div class="filter-panel">
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-end">
              <label class="space-y-1">
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Categoría</span>
                <select v-model="categoryFilter" class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none">
                  <option value="">Todas las categorías</option>
                  <option v-for="cat in categories" :key="cat.slug || cat.id" :value="cat.slug || cat.id">{{ cat.name }}</option>
                </select>
              </label>
              <label class="space-y-1">
                <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Buscar</span>
                <input
                  v-model="searchTerm"
                  type="text"
                  placeholder="Buscar producto por nombre"
                  class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"
                />
              </label>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Productos activos</h2>
              <span class="text-sm text-slate-500">{{ filteredActive.length }} productos</span>
            </div>
            <div v-if="!filteredActive.length" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600">
              No hay productos activos.
            </div>
            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ProductCard
                v-for="product in pagedActive"
                :key="product.id"
                :product="product"
                :accent="marketplaceAccent"
                :isMarketplace="true"
                :isMine="isMine(product)"
              />
            </div>
            <div v-if="activeTotalPages > 1" class="flex items-center justify-between text-xs text-slate-600">
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="activePage === 1" @click="activePage -= 1">Anterior</button>
              <span>Página {{ activePage }} / {{ activeTotalPages }}</span>
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="activePage === activeTotalPages" @click="activePage += 1">Siguiente</button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Productos vendidos / inactivos</h2>
              <span class="text-sm text-slate-500">{{ filteredSold.length }} productos</span>
            </div>
            <div v-if="!filteredSold.length" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600">
              No hay productos marcados como vendidos.
            </div>
            <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <ProductCard
                v-for="product in pagedSold"
                :key="`sold-${product.id}`"
                :product="product"
                :accent="marketplaceAccent"
                :isMarketplace="true"
                :isMine="isMine(product)"
              />
            </div>
            <div v-if="soldTotalPages > 1" class="flex items-center justify-between text-xs text-slate-600">
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="soldPage === 1" @click="soldPage -= 1">Anterior</button>
              <span>Página {{ soldPage }} / {{ soldTotalPages }}</span>
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="soldPage === soldTotalPages" @click="soldPage += 1">Siguiente</button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Ventas en proceso</h2>
              <span class="text-sm text-slate-500">{{ salesInProgressHistory.length }} movimientos</span>
            </div>
            <div v-if="!salesInProgressHistory.length" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600">
              No hay ventas marketplace en proceso para este vendedor.
            </div>
            <div v-else class="space-y-2">
              <article
                v-for="item in pagedSalesInProgressHistory"
                :key="`inprogress-${item.order_id}-${item.product_id}`"
                class="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ item.product_name }}</p>
                    <p class="text-xs text-slate-500">Pedido #{{ item.order_id }} · Comprador: {{ item.buyer_name || 'Cliente' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-slate-900">{{ formatClp(item.subtotal || 0) }}</p>
                    <p class="text-xs text-slate-500">{{ formatOrderStatus(item.status) }}</p>
                  </div>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Cantidad: {{ item.quantity }}</span>
                  <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Unitario: {{ formatClp(item.unit_price || 0) }}</span>
                  <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">{{ formatDate(item.created_at) }}</span>
                </div>
              </article>
            </div>
            <div v-if="inProgressTotalPages > 1" class="flex items-center justify-between text-xs text-slate-600">
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="inProgressPage === 1" @click="inProgressPage -= 1">Anterior</button>
              <span>Página {{ inProgressPage }} / {{ inProgressTotalPages }}</span>
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="inProgressPage === inProgressTotalPages" @click="inProgressPage += 1">Siguiente</button>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Historial de ventas marketplace</h2>
              <span class="text-sm text-slate-500">{{ salesHistory.length }} ventas</span>
            </div>
            <div v-if="!salesHistory.length" class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600">
              Este vendedor todavia no registra ventas cerradas en marketplace.
            </div>
            <div v-else class="space-y-2">
              <article
                v-for="item in pagedSalesHistory"
                :key="`${item.order_id}-${item.product_id}`"
                class="rounded-xl border border-slate-200 bg-white p-4"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-slate-900">{{ item.product_name }}</p>
                    <p class="text-xs text-slate-500">Pedido #{{ item.order_id }} · Comprador: {{ item.buyer_name || 'Cliente' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-semibold text-slate-900">{{ formatClp(item.subtotal || 0) }}</p>
                    <p class="text-xs text-slate-500">{{ formatOrderStatus(item.status) }}</p>
                  </div>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Cantidad: {{ item.quantity }}</span>
                  <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Unitario: {{ formatClp(item.unit_price || 0) }}</span>
                  <span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">{{ formatDate(item.created_at) }}</span>
                </div>
              </article>
            </div>
            <div v-if="salesTotalPages > 1" class="flex items-center justify-between text-xs text-slate-600">
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="salesPage === 1" @click="salesPage -= 1">Anterior</button>
              <span>Página {{ salesPage }} / {{ salesTotalPages }}</span>
              <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="salesPage === salesTotalPages" @click="salesPage += 1">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import ProductCard from '~/components/ProductCard.vue'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'
import { BadgeCheck } from 'lucide-vue-next'

const route = useRoute()
const config = useRuntimeConfig()
const theme = useThemeStore()
const auth = useAuthStore()

const sellerId = route.params.id
const seller = ref<any | null>(null)
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const categoryFilter = ref('')
const categories = ref<any[]>([])
const marketplaceAccent = '#f59e0b'
const activePage = ref(1)
const soldPage = ref(1)
const perPage = 12
const salesPage = ref(1)
const salesPerPage = 8
const inProgressPage = ref(1)
const inProgressPerPage = 8
const savingRating = ref(false)
const showReportForm = ref(false)
const savingReport = ref(false)
const reportTitle = ref('')
const reportDescription = ref('')
const reportMessage = ref<{ type: 'ok' | 'error'; text: string } | null>(null)

const salesSummary = computed(() => seller.value?.sales_summary || {
  total_orders: 0,
  total_units: 0,
  gross_sales: 0,
  in_progress_orders: 0,
  in_progress_units: 0,
  in_progress_amount: 0,
})
const salesHistory = computed(() => seller.value?.sales_history || [])
const salesInProgressHistory = computed(() => seller.value?.sales_in_progress_history || [])
const ratingSummary = computed(() => seller.value?.rating_summary || { average: 0, count: 0 })
const myRating = computed(() => Number(seller.value?.my_rating || 0))
const averageRating = computed(() => Number(ratingSummary.value.average || 0))
const displayRating = computed(() => (myRating.value > 0 ? myRating.value : Math.round(averageRating.value)))
const sellerNumericId = computed(() => Number(seller.value?.id || sellerId || 0))
const currentUserId = computed(() => Number((auth.user as any)?.id || 0))
const canRateSeller = computed(() => Boolean(auth.isAuthenticated && currentUserId.value && sellerNumericId.value && currentUserId.value !== sellerNumericId.value))
const canReportSeller = computed(() => Boolean(auth.isAuthenticated && currentUserId.value && sellerNumericId.value && currentUserId.value !== sellerNumericId.value))
const ratingLabel = computed(() => {
  const count = Number(ratingSummary.value.count || 0)
  const avg = Number(averageRating.value || 0)
  if (!count) return 'Sin calificaciones todavía'
  return `${avg.toFixed(1)} (${count} calificaciones)`
})
const salesTotalPages = computed(() => Math.max(1, Math.ceil(salesHistory.value.length / salesPerPage)))
const pagedSalesHistory = computed(() => {
  const start = (salesPage.value - 1) * salesPerPage
  return salesHistory.value.slice(start, start + salesPerPage)
})
const inProgressTotalPages = computed(() => Math.max(1, Math.ceil(salesInProgressHistory.value.length / inProgressPerPage)))
const pagedSalesInProgressHistory = computed(() => {
  const start = (inProgressPage.value - 1) * inProgressPerPage
  return salesInProgressHistory.value.slice(start, start + inProgressPerPage)
})

const fullName = computed(() => {
  if (!seller.value) return ''
  const parts = [seller.value.first_name, seller.value.last_name].filter(Boolean)
  return parts.join(' ')
})

const allProducts = computed(() => {
  if (!seller.value) return { active: [], sold: [] }
  return {
    active: seller.value.active_products || [],
    sold: seller.value.sold_products || [],
  }
})

const categoriesFromProducts = computed(() => {
  const map = new Map<string, { id: any; slug: any; name: string }>()
  allProducts.value.active.concat(allProducts.value.sold).forEach((p: any) => {
    if (p.category?.slug || p.category?.id) {
      const key = p.category.slug || p.category.id
      map.set(String(key), { id: p.category.id, slug: p.category.slug, name: p.category.name })
    }
  })
  return Array.from(map.values())
})

const filteredActive = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  const cat = categoryFilter.value
  return allProducts.value.active.filter((p: any) => {
    const matchesTerm = !term || p.name?.toLowerCase().includes(term)
    const matchesCat = !cat || p.category?.slug === cat || String(p.category?.id) === String(cat)
    return matchesTerm && matchesCat
  })
})

const filteredSold = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  const cat = categoryFilter.value
  return allProducts.value.sold.filter((p: any) => {
    const matchesTerm = !term || p.name?.toLowerCase().includes(term)
    const matchesCat = !cat || p.category?.slug === cat || String(p.category?.id) === String(cat)
    return matchesTerm && matchesCat
  })
})

const activeTotalPages = computed(() => Math.max(1, Math.ceil(filteredActive.value.length / perPage)))
const soldTotalPages = computed(() => Math.max(1, Math.ceil(filteredSold.value.length / perPage)))

const pagedActive = computed(() => {
  const start = (activePage.value - 1) * perPage
  return filteredActive.value.slice(start, start + perPage)
})

const pagedSold = computed(() => {
  const start = (soldPage.value - 1) * perPage
  return filteredSold.value.slice(start, start + perPage)
})

const isMine = (product: any) => {
  const userId = (auth.user as any)?.id
  return Boolean(userId && product?.submitted_by === userId)
}

const rateSeller = async (rating: number) => {
  if (!canRateSeller.value || savingRating.value) return
  if (rating < 1 || rating > 5) return
  savingRating.value = true
  try {
    const token = auth.token
    if (!token) return
    const response = await $fetch<any>(`${config.public.apiBase}/marketplace/sellers/${sellerId}/rating/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { rating },
    })
    if (!seller.value) return
    seller.value = {
      ...seller.value,
      my_rating: response?.my_rating || rating,
      rating_summary: response?.rating_summary || seller.value.rating_summary,
    }
  } catch (err) {
    console.warn('No se pudo guardar calificación de vendedor', err)
  } finally {
    savingRating.value = false
  }
}

const submitSellerReport = async () => {
  if (!canReportSeller.value || savingReport.value) return
  if (!reportDescription.value.trim()) {
    reportMessage.value = { type: 'error', text: 'Describe el motivo de la denuncia.' }
    return
  }
  const token = auth.token
  if (!token) {
    reportMessage.value = { type: 'error', text: 'Debes iniciar sesión para denunciar.' }
    return
  }

  savingReport.value = true
  reportMessage.value = null
  try {
    await $fetch(`${config.public.apiBase}/marketplace/sellers/${sellerId}/report/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        reason: reportTitle.value.trim() || `Denuncia a vendedor ${seller.value?.username || sellerId}`,
        details: reportDescription.value.trim(),
      },
    })
    reportMessage.value = { type: 'ok', text: 'Denuncia enviada correctamente. El equipo de soporte la revisará.' }
    reportTitle.value = ''
    reportDescription.value = ''
    showReportForm.value = false
  } catch (err: any) {
    const detail = err?.response?._data?.detail
    reportMessage.value = { type: 'error', text: typeof detail === 'string' ? detail : 'No se pudo enviar la denuncia.' }
  } finally {
    savingReport.value = false
  }
}

const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const formatDate = (value: string) => {
  if (!value) return ''
  try {
    return new Date(value).toLocaleString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return value
  }
}

const formatOrderStatus = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'Preparando',
    in_transit: 'En transito',
    delivered: 'Entregado',
    completed: 'Completado',
    cancelled: 'Cancelado',
  }
  return labels[status] || status
}

const fetchSeller = async () => {
  loading.value = true
  error.value = ''
  try {
    seller.value = await $fetch(`${config.public.apiBase}/marketplace/sellers/${sellerId}/`)
    categories.value = categoriesFromProducts.value
  } catch (err: any) {
    const detail = err?.response?._data?.detail || err?.response?._data
    error.value = typeof detail === 'string' ? detail : 'No pudimos cargar el vendedor'
    seller.value = null
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyTheme()
  await auth.initializeSession().catch(() => null)
  await fetchSeller()
})

watch([searchTerm, categoryFilter], () => {
  activePage.value = 1
  soldPage.value = 1
})

watch(salesHistory, () => {
  if (salesPage.value > salesTotalPages.value) salesPage.value = salesTotalPages.value
})

watch(salesInProgressHistory, () => {
  if (inProgressPage.value > inProgressTotalPages.value) inProgressPage.value = inProgressTotalPages.value
})

watch(filteredActive, () => {
  if (activePage.value > activeTotalPages.value) activePage.value = activeTotalPages.value
})

watch(filteredSold, () => {
  if (soldPage.value > soldTotalPages.value) soldPage.value = soldTotalPages.value
})
</script>
