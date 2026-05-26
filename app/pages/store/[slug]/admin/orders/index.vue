<template>
  <div class="max-w-6xl mx-auto py-10 space-y-6">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Panel</p>
        <h1 class="text-3xl font-bold text-slate-900">Compras realizadas</h1>
        <p class="text-slate-600">Gestiona estados y comparte seguimiento.</p>
      </div>
      <NuxtLink
        :to="`/store/${slug}`"
        class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg"
        :style="{ backgroundColor: accentColor }"
      >
        Entrar a la tienda
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-gray-500">Cargando pedidos...</div>

    <div class="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]" v-else>
      <div class="rounded-xl bg-white shadow ring-1 ring-slate-100 p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Pendientes</p>
            <h3 class="text-lg font-semibold text-slate-900">Preparar y enviar</h3>
          </div>
          <span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{{ pendingList.length }}</span>
        </div>
        <div v-if="!pendingList.length" class="text-sm text-slate-500">Sin pedidos pendientes.</div>
        <div v-else>
          <div v-for="p in pendingPaginated" :key="p.id" class="rounded-lg border border-slate-100 px-3 py-2 text-sm">
            <div class="flex items-center justify-between">
              <p class="font-semibold text-slate-900">#{{ p.id }} — {{ p.name }}</p>
              <span class="text-xs text-slate-500">{{ formatDate(p.created_at) }}</span>
            </div>
            <p class="text-xs text-slate-500">Tracking {{ p.tracking_code || '—' }}</p>
            <div class="flex items-center justify-between pt-1">
              <span class="font-semibold text-slate-900">{{ currency(p.total) }}</span>
              <span :class="['rounded-full px-2 py-0.5 text-[11px] font-semibold', statusBadge(p.status).classes]">{{ statusBadge(p.status).label }}</span>
            </div>
            <div class="mt-2 flex justify-between text-xs text-slate-600">
              <NuxtLink :to="`/store/${slug}/admin/orders/${p.id}`" class="font-semibold text-blue-600 hover:underline">Ver y preparar</NuxtLink>
              <NuxtLink :to="`/store/${slug}/success?order=${p.id}`" class="hover:underline">Seguimiento</NuxtLink>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between text-xs text-slate-600" v-if="pendingTotalPages > 1">
            <button class="rounded-lg border px-2 py-1 hover:bg-slate-50 disabled:opacity-50" :disabled="pendingPage === 1" @click="pendingPage--">Anterior</button>
            <span>Página {{ pendingPage }} / {{ pendingTotalPages }}</span>
            <button class="rounded-lg border px-2 py-1 hover:bg-slate-50 disabled:opacity-50" :disabled="pendingPage === pendingTotalPages" @click="pendingPage++">Siguiente</button>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-xl bg-white shadow ring-1 ring-slate-100">
        <div class="space-y-3 p-4 md:hidden">
          <div
            v-for="order in paginatedOrders"
            :key="`mobile-${order.id}`"
            class="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="font-semibold text-slate-900">#{{ order.id }} · {{ order.name }}</p>
                <p class="mt-1 text-xs text-slate-500">{{ formatDate(order.created_at) }}</p>
              </div>
              <span :class="['rounded-full px-2 py-1 text-[11px] font-semibold', statusBadge(order.status).classes]">
                {{ statusBadge(order.status).label }}
              </span>
            </div>
            <div class="mt-3 grid gap-2 text-xs text-slate-600">
              <p><span class="font-semibold text-slate-700">Total:</span> {{ currency(order.total) }}</p>
              <p><span class="font-semibold text-slate-700">Tracking:</span> {{ order.tracking_code || '—' }}</p>
            </div>
            <div class="mt-3 flex flex-wrap gap-3 text-xs font-semibold">
              <NuxtLink :to="`/store/${slug}/admin/orders/${order.id}`" class="text-blue-600 hover:underline">Ver</NuxtLink>
              <NuxtLink :to="`/store/${slug}/success?order=${order.id}`" class="text-slate-600 hover:underline">Seguimiento</NuxtLink>
            </div>
          </div>
        </div>
        <div class="hidden overflow-x-auto md:block">
        <table class="min-w-[760px] w-full text-sm">
          <thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="p-3">ID</th>
              <th class="p-3">Cliente</th>
              <th class="p-3">Total</th>
              <th class="p-3">Estado</th>
              <th class="p-3">Seguimiento</th>
              <th class="p-3">Fecha</th>
              <th class="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id" class="border-t border-slate-100">
              <td class="p-3 font-semibold text-slate-900">#{{ order.id }}</td>
              <td class="p-3 text-slate-800">{{ order.name }}</td>
              <td class="p-3 font-semibold text-slate-900">{{ currency(order.total) }}</td>
              <td class="p-3">
                <span :class="['px-2 py-1 rounded text-xs font-semibold', statusBadge(order.status).classes]">
                  {{ statusBadge(order.status).label }}
                </span>
              </td>
              <td class="p-3 text-xs text-slate-600">{{ order.tracking_code }}</td>
              <td class="p-3 text-slate-600">{{ formatDate(order.created_at) }}</td>
              <td class="p-3 text-right space-x-2">
                <NuxtLink
                  :to="`/store/${slug}/admin/orders/${order.id}`"
                  class="text-blue-600 hover:underline"
                >
                  Ver
                </NuxtLink>
                <NuxtLink
                  :to="`/store/${slug}/success?order=${order.id}`"
                  class="text-slate-600 hover:underline"
                >
                  Seguimiento
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        <div class="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
          <span>Mostrando {{ paginatedOrders.length }} de {{ orders.length }} pedidos</span>
          <div class="flex items-center gap-2">
            <button class="rounded-lg border px-3 py-1 hover:bg-white disabled:opacity-50" :disabled="page === 1" @click="page--">Anterior</button>
            <span class="text-xs">Página {{ page }} / {{ totalPages }}</span>
            <button class="rounded-lg border px-3 py-1 hover:bg-white disabled:opacity-50" :disabled="page === totalPages" @click="page++">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useTenantStore } from '~/stores/tenant'

definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true })

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()
const tenantStore = useTenantStore()
const slug = route.params.slug as string

interface Order {
  id: number
  name: string
  total: number
  status: string
  tracking_code: string
  created_at: string
}

const orders = ref<Order[]>([])
const loading = ref(true)
const page = ref(1)
const pageSize = 10
const pendingPage = ref(1)
const pendingPageSize = 5
const accentColor = computed(() => theme.accent || '#2563eb')

const pendingList = computed(() =>
  orders.value.filter((o) => ['pending', 'preparing', 'in_transit'].includes(o.status))
)

const pendingPaginated = computed(() => {
  const start = (pendingPage.value - 1) * pendingPageSize
  return pendingList.value.slice(start, start + pendingPageSize)
})

const pendingTotalPages = computed(() => Math.max(1, Math.ceil(pendingList.value.length / pendingPageSize)) || 1)

const paginatedOrders = computed(() => {
  const start = (page.value - 1) * pageSize
  return orders.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.max(1, Math.ceil(orders.value.length / pageSize)))

const currency = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(Number(value) || 0)

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; classes: string }> = {
    pending: { label: 'Pendiente', classes: 'bg-amber-100 text-amber-700' },
    preparing: { label: 'Preparando', classes: 'bg-blue-100 text-blue-700' },
    in_transit: { label: 'En tránsito', classes: 'bg-indigo-100 text-indigo-700' },
    delivered: { label: 'Llegó a destino', classes: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Finalizado', classes: 'bg-slate-200 text-slate-800' },
    cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-700' },
  }
  return map[status] || { label: status, classes: 'bg-slate-100 text-slate-700' }
}

const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
  if (!auth.token) throw new Error('No autenticado')
  const doFetch = (token: string) =>
    $fetch<T>(url as any, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
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

const loadOrders = async () => {
  loading.value = true
  try {
    orders.value = await authedFetch(`${config.public.apiBase}/orders/`, {
      params: { store: slug },
    })
    page.value = 1
    pendingPage.value = 1
  } catch (e) {
    console.error('Error cargando pedidos', e)
    orders.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  auth.restoreFromCookies()
  if (auth.token && !auth.user) {
    await auth.fetchProfile()
  }
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  tenantStore.setSlug(slug)
  await loadOrders()
})

watch(
  () => pendingList.value.length,
  () => {
    pendingPage.value = 1
  }
)

const formatDate = (date: string) => new Date(date).toLocaleString('es-CL')
</script>
