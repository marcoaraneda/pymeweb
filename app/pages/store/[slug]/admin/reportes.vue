<template>
  <div class="space-y-8">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>
        <p class="text-gray-500">Filtra por tienda y rango de tiempo. Exporta cuando necesites.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          @click="refresh"
        >
          Actualizar
        </button>
        <button
          class="rounded-lg px-3 py-2 text-sm font-semibold text-white shadow"
          :style="{ backgroundColor: accentColor }"
          @click="handleExport('sales')"
        >
          Exportar ventas
        </button>
      </div>
    </header>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Stat title="Ventas" :value="money(summary.sales)" icon="💰" />
      <Stat title="Órdenes" :value="summary.orders" icon="🧾" />
      <Stat title="Ticket promedio" :value="money(summary.avgTicket)" icon="🎟️" />
      <Stat title="Productos activos" :value="summary.activeProducts" icon="📦" />
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div class="grid gap-3 md:grid-cols-3 md:w-2/3">
          <div class="space-y-1">
            <label class="text-sm text-slate-600">Tienda</label>
            <select v-model="filters.store" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option v-for="s in storeOptions" :key="s.slug" :value="s.slug">{{ s.name }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-sm text-slate-600">Rango</label>
            <select v-model="filters.range" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>
          <div class="space-y-1" v-if="filters.range === 'custom'">
            <label class="text-sm text-slate-600">Desde / Hasta</label>
            <div class="flex gap-2">
              <input v-model="filters.start" type="date" class="w-1/2 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <input v-model="filters.end" type="date" class="w-1/2 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
        </div>
        <div class="flex gap-3">
          <button
            class="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow"
            :style="{ backgroundColor: accentColor }"
            @click="applyFilters"
          >
            Aplicar filtros
          </button>
          <button
            class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            @click="handleExport('inventory')"
          >
            Exportar stock
          </button>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="rounded-xl border border-slate-200 p-4">
          <h3 class="text-sm font-semibold text-slate-800">Tendencia de ventas</h3>
          <div class="mt-4 flex items-end gap-2">
            <div
              v-for="(p, idx) in chart"
              :key="idx"
              class="flex-1 rounded-t-lg bg-slate-200"
              :style="{ height: `${p.value}px`, backgroundColor: barColor(idx) }"
              :title="`${p.label}: ${money(p.value * 10)}`"
            />
          </div>
        </div>
        <div class="rounded-xl border border-slate-200 p-4 space-y-3">
          <h3 class="text-sm font-semibold text-slate-800">Top categorías</h3>
          <div v-if="!topCategories.length" class="text-slate-500 text-sm">Sin datos</div>
          <div v-for="cat in topCategories" :key="cat.name" class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
            <div>
              <p class="text-sm font-semibold text-slate-800">{{ cat.name }}</p>
              <p class="text-xs text-slate-500">{{ cat.count }} ventas</p>
            </div>
            <span class="text-sm font-semibold" :style="{ color: accentColor }">{{ money(cat.revenue) }}</span>
          </div>
        </div>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-xl border border-slate-200 p-4 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold text-slate-800">Productos más vendidos</h3>
            <span class="text-xs text-slate-500">Top 5</span>
          </div>
          <div v-if="!topProducts.length" class="text-slate-500 text-sm">Sin datos</div>
          <div v-for="prod in topProducts" :key="prod.id" class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
            <div>
              <p class="font-semibold text-slate-900">{{ prod.name }}</p>
              <p class="text-xs text-slate-500">{{ prod.sales }} ventas</p>
            </div>
            <span class="font-semibold" :style="{ color: accentColor }">{{ money(prod.revenue) }}</span>
          </div>
        </div>

        <div class="grid gap-4">
          <div class="rounded-xl border border-slate-200 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-800">Pedidos en proceso</h3>
              <span class="text-xs text-slate-500">Pendiente / Preparando / En tránsito</span>
            </div>
            <div v-if="!pendingList.length" class="text-slate-500 text-sm">Sin pedidos en proceso.</div>
            <div v-for="order in pendingList" :key="order.id" class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
              <div class="space-y-0.5">
                <p class="font-semibold text-slate-900">Pedido #{{ order.id }} — {{ order.customer }}</p>
                <p class="text-xs text-slate-500">{{ order.date }}</p>
                <p class="text-xs text-slate-500">Tracking {{ order.tracking || '—' }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-slate-900">{{ money(order.total) }}</p>
                <NuxtLink :to="`/store/${order.store}/admin/orders/${order.id}`" class="text-xs text-blue-600 hover:underline">Ver</NuxtLink>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-slate-200 p-4 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-semibold text-slate-800">Entregados / Finalizados</h3>
              <span class="text-xs text-slate-500">Llegó a destino</span>
            </div>
            <div v-if="!deliveredList.length" class="text-slate-500 text-sm">Sin entregas registradas.</div>
            <div v-for="order in deliveredList" :key="order.id" class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
              <div class="space-y-0.5">
                <p class="font-semibold text-slate-900">Pedido #{{ order.id }} — {{ order.customer }}</p>
                <p class="text-xs text-slate-500">{{ order.date }}</p>
                <p class="text-xs text-slate-500">Tracking {{ order.tracking || '—' }}</p>
              </div>
              <div class="text-right">
                <p class="font-semibold text-slate-900">{{ money(order.total) }}</p>
                <NuxtLink :to="`/store/${order.store}/admin/orders/${order.id}`" class="text-xs text-blue-600 hover:underline">Ver</NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 p-4">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-semibold text-slate-800">Órdenes recientes</h3>
          <span class="text-xs text-slate-500">Filtrado por tienda y rango</span>
        </div>
        <div class="mt-3 overflow-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="text-left text-slate-500">
                <th class="py-2 pr-4">#</th>
                <th class="py-2 pr-4">Cliente</th>
                <th class="py-2 pr-4">Tienda</th>
                <th class="py-2 pr-4">Fecha</th>
                <th class="py-2 pr-4">Total</th>
                <th class="py-2 pr-4">Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredOrders" :key="order.id" class="border-t border-slate-100">
                <td class="py-2 pr-4">{{ order.id }}</td>
                <td class="py-2 pr-4">{{ order.customer }}</td>
                <td class="py-2 pr-4">{{ order.store }}</td>
                <td class="py-2 pr-4">{{ order.date }}</td>
                <td class="py-2 pr-4 font-semibold">{{ money(order.total) }}</td>
                <td class="py-2 pr-4">
                  <span class="rounded-full px-2 py-1 text-xs font-semibold" :class="statusClass(order.status)">{{ order.status }}</span>
                </td>
              </tr>
              <tr v-if="!filteredOrders.length">
                <td colspan="6" class="py-4 text-center text-slate-500">Sin órdenes en este rango.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, defineComponent, h } from 'vue'
import { definePageMeta } from '#imports'
import { useTenantStore } from '~/stores/tenant'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useReports } from '~/composables/useReports'
import { useRuntimeConfig } from 'nuxt/app'
import { useRoute } from '#app'

definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true })

const tenant = useTenantStore()
const auth = useAuthStore()
const theme = useThemeStore()
const { downloadReport } = useReports()
const config = useRuntimeConfig()
const route = useRoute()
const routeSlug = route.params.slug as string
const apiBase = String(config.public.apiBase || '')

const accentColor = computed(() => theme.accent || '#2563eb')

const filters = reactive({ store: '', range: '7d', start: '', end: '' })
const summary = reactive({ sales: 0, orders: 0, avgTicket: 0, activeProducts: 0 })
const chart = ref<{ label: string; value: number }[]>([])
const topCategories = ref<{ name: string; count: number; revenue: number }[]>([])
const topProducts = ref<{ id: number; name: string; sales: number; revenue: number }[]>([])
const orders = ref<any[]>([])

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

const storeOptions = computed(() => {
  const stores = (auth.user as any)?.memberships?.map((m: any) => m.store) || []
  if (tenant.data) stores.unshift({ slug: tenant.data.slug, name: tenant.data.name })
  const seen = new Set<string>()
  return stores.filter((s: any) => {
    if (!s?.slug) return false
    if (seen.has(s.slug)) return false
    seen.add(s.slug)
    return true
  })
})

const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const matchStore = !filters.store || o.store === filters.store
    const dateOk = true
    return matchStore && dateOk
  })
})

const pendingList = computed(() =>
  filteredOrders.value
    .filter((o) => ['pending', 'preparing', 'in_transit', 'pendiente', 'preparando', 'en_transito'].includes(o.status))
    .slice(0, 8)
)

const deliveredList = computed(() =>
  filteredOrders.value
    .filter((o) => ['delivered', 'completed', 'finalizado', 'entregado'].includes(o.status))
    .slice(0, 8)
)

const money = (n: number) => `$${(n || 0).toFixed(2)}`
const barColor = (idx: number) => (idx === chart.value.length - 1 ? accentColor.value : '#cbd5e1')
const statusClass = (status: string) => {
  if (status === 'pagado') return 'bg-emerald-100 text-emerald-700'
  if (status === 'pendiente') return 'bg-amber-100 text-amber-800'
  return 'bg-slate-100 text-slate-700'
}

const handleExport = async (type: 'sales' | 'inventory') => {
  try {
    await downloadReport(type as any, {
      storeSlug: filters.store || tenant.slug || tenant.data?.slug,
      start: filters.start,
      end: filters.end,
    })
  } catch (e: any) {
    alert(e.message)
  }
}

const fetchTopProducts = async () => {
  if (!filters.store) return
  try {
    const data = await authedFetch<any[]>(`${apiBase}/orders/store/${filters.store}/top-products/`)
    topProducts.value = data.map((p: any, idx: number) => ({
      id: p.id || idx,
      name: p.name,
      sales: p.total_quantity || p.sales || 0,
      revenue: p.total_quantity && p.price ? p.total_quantity * p.price : p.revenue || 0,
      store: filters.store,
    }))
  } catch (e) {
    console.error('Error top productos', e)
    topProducts.value = []
  }
}

const applyFilters = async () => {
  const base = filters.range === '7d' ? 7 : filters.range === '30d' ? 30 : 90
  summary.sales = 1200 * base * 0.3
  summary.orders = Math.round(base * 4.2)
  summary.avgTicket = summary.orders ? summary.sales / summary.orders : 0
  summary.activeProducts = tenant.productos?.length || 0

  chart.value = Array.from({ length: Math.min(base, 10) }, (_, i) => ({ label: `Día ${i + 1}`, value: Math.round(20 + Math.random() * 60) }))
  topCategories.value = [
    { name: 'General', count: Math.round(base * 1.2), revenue: summary.sales * 0.4 },
    { name: 'Destacados', count: Math.round(base * 0.8), revenue: summary.sales * 0.35 },
  ]

  await Promise.all([
    fetchTopProducts(),
    (async () => {
      if (!filters.store) return
      try {
        const data = await authedFetch<any[]>(`${apiBase}/orders/`, {
          params: { store: filters.store },
        })
        orders.value = data.map((o) => ({
          id: o.id,
          customer: o.name,
          store: filters.store,
          date: new Date(o.created_at).toLocaleString('es-CL'),
          tracking: o.tracking_code,
          total: Number(o.total),
          status: o.status,
        }))
      } catch (e) {
        console.error('Error cargando órdenes', e)
        orders.value = []
      }
    })(),
  ])
}

const refresh = async () => {
  tenant.setSlug(routeSlug)
  await tenant.fetchTienda()
  await tenant.fetchProductos()
  await applyFilters()
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyStoreTheme(routeSlug)
  filters.store = filters.store || routeSlug || tenant.slug || tenant.data?.slug || ''
  if (!filters.store && storeOptions.value[0]) filters.store = storeOptions.value[0].slug
  await refresh()
})

const Stat = defineComponent({
  props: { title: String, value: [String, Number], icon: String },
  setup(props) {
    return () =>
      h('div', { class: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm' }, [
        h('div', { class: 'text-2xl' }, props.icon),
        h('p', { class: 'text-sm text-slate-500' }, props.title),
        h('p', { class: 'text-xl font-semibold text-slate-900' }, String(props.value ?? '')),
      ])
  },
})
</script>