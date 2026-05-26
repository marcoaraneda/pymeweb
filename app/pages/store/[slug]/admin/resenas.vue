<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Reseñas de la tienda</h1>
        <p class="text-sm text-gray-500">Listado de reseñas públicas registradas en la tienda (sin opción de desactivación manual).</p>
      </div>
      <button @click="loadReviews" class="text-sm bg-gray-200 px-4 py-2 rounded-lg">Actualizar</button>
    </div>

    <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      {{ successMessage }}
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="option in statusOptions"
        :key="option.value"
        class="rounded-full border px-3 py-1 text-xs font-semibold"
        :class="selectedStatus === option.value ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-200 bg-white text-slate-600'"
        @click="selectedStatus = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="loading" class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
      Cargando reseñas...
    </div>

    <div v-else class="space-y-3">
      <div v-if="!filteredReviews.length" class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
        No hay reseñas registradas.
      </div>

      <article v-for="review in paginatedReviews" :key="review.id" class="rounded-xl border bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="font-semibold text-slate-900">{{ review.product_name || `Producto #${review.product}` }}</p>
            <p class="text-xs text-slate-500">{{ review.customer_name || 'Cliente sin nombre' }} • {{ formatDate(review.created_at) }}</p>
            <p class="mt-2 text-sm text-slate-700">{{ review.comment || 'Sin comentario.' }}</p>
          </div>
          <div class="flex flex-col items-start gap-2 sm:items-end">
            <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusClasses(review.status)">
              {{ review.status }}
            </span>
            <span class="text-sm text-amber-600">{{ '★'.repeat(review.rating) }}</span>
          </div>
        </div>
      </article>

      <div v-if="filteredReviews.length > perPage" class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
        <button
          class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"
          :disabled="page === 1"
          @click="page -= 1"
        >
          Anterior
        </button>
        <p>Mostrando {{ pageStart }}-{{ pageEnd }} de {{ filteredReviews.length }}</p>
        <button
          class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"
          :disabled="page === totalPages"
          @click="page += 1"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true })

type ReviewRow = {
  id: number
  product: number
  product_name?: string
  rating: number
  comment: string
  customer_name: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  created_at: string
}

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()
const slug = route.params.slug as string

const reviews = ref<ReviewRow[]>([])
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const selectedStatus = ref<'ALL' | ReviewRow['status']>('ALL')
const page = ref(1)
const perPage = 10
const statusOptions = [
  { value: 'ALL' as const, label: 'Todas' },
  { value: 'PENDING' as const, label: 'Pendientes' },
  { value: 'APPROVED' as const, label: 'Aprobadas' },
  { value: 'REJECTED' as const, label: 'Rechazadas' },
]
const filteredReviews = computed(() => {
  if (selectedStatus.value === 'ALL') return reviews.value
  return reviews.value.filter((review) => review.status === selectedStatus.value)
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredReviews.value.length / perPage)))
const paginatedReviews = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredReviews.value.slice(start, start + perPage)
})
const pageStart = computed(() => (filteredReviews.value.length ? (page.value - 1) * perPage + 1 : 0))
const pageEnd = computed(() => Math.min(page.value * perPage, filteredReviews.value.length))

const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
  if (!auth.token) throw new Error('No autenticado')
  const doFetch = (token: string) =>
    $fetch<T>(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
    })

  try {
    return await doFetch(auth.token)
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) return doFetch(refreshed)
    }
    throw error
  }
}

const loadReviews = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    reviews.value = await authedFetch<ReviewRow[]>(`${config.public.apiBase}/store/${slug}/admin/resenas/reviews/`)
  } catch (error: any) {
    errorMessage.value = error?.response?._data?.detail || 'No se pudieron cargar las reseñas.'
    reviews.value = []
  } finally {
    loading.value = false
  }
}

const statusClasses = (status: ReviewRow['status']) => {
  if (status === 'APPROVED') return 'bg-emerald-100 text-emerald-700'
  if (status === 'REJECTED') return 'bg-rose-100 text-rose-700'
  return 'bg-amber-100 text-amber-700'
}

const formatDate = (value: string) => new Date(value).toLocaleString('es-CL')

onMounted(loadReviews)

watch(selectedStatus, () => {
  page.value = 1
})

watch(filteredReviews, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})
</script>