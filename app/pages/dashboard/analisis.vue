<template>
  <ClientOnly>
    <div class="page-enter min-h-screen bg-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <nav class="flex flex-wrap items-center justify-center gap-2">
        <NuxtLink
          v-for="link in dashboardLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg"
          :class="route.path === link.to ? 'ring-2 ring-white/40' : ''"
          :style="{ background: link.color }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Dashboard</p>
          <h1 class="text-3xl font-extrabold">Analisis de datos</h1>
          <p class="text-white/70">Vista dedicada a analisis con datos reales y filtros por periodo.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/dashboard"
            class="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/40"
          >
            Volver
          </NuxtLink>
        </div>
      </header>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="space-y-1">
            <label class="text-xs text-white/60">Tienda</label>
            <select v-model="filters.store" class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
              <option disabled value="">Selecciona una tienda</option>
              <option v-for="s in storeOptions" :key="s.slug" :value="s.slug">{{ s.name }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-white/60">Granularidad</label>
            <select v-model="filters.granularity" class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
              <option value="day">Dia</option>
              <option value="month">Mes</option>
              <option value="quarter">Trimestre</option>
              <option value="year">Ano</option>
            </select>
          </div>
          <div class="space-y-1" v-if="filters.granularity === 'day'">
            <label class="text-xs text-white/60">Desde / Hasta</label>
            <div class="flex gap-2">
              <input v-model="filters.start" type="date" class="w-1/2 rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2" />
              <input v-model="filters.end" type="date" class="w-1/2 rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2" />
            </div>
          </div>
          <div class="space-y-1" v-else>
            <label class="text-xs text-white/60">Periodo</label>
            <div class="grid grid-cols-2 gap-2" v-if="filters.granularity === 'month'">
              <select v-model.number="filters.year" class="rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
              </select>
              <select v-model.number="filters.month" class="rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
                <option v-for="m in monthOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-2" v-else-if="filters.granularity === 'quarter'">
              <select v-model.number="filters.year" class="rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
              </select>
              <select v-model.number="filters.quarter" class="rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
                <option v-for="q in quarterOptions" :key="q" :value="q">Q{{ q }}</option>
              </select>
            </div>
            <div v-else>
              <select v-model.number="filters.year" class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
                <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-4 flex flex-wrap items-center gap-3">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5"
            :style="{ backgroundColor: theme.accent }"
            @click="loadAll"
            :disabled="loading"
          >
            {{ loading ? 'Actualizando...' : 'Aplicar filtros' }}
          </button>
          <span class="text-xs text-white/60">Rango efectivo: {{ rangeLabel }}</span>
        </div>
      </section>

      <div v-if="loadError" class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
        {{ loadError }}
      </div>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ card.label }}</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ card.value }}</p>
          <p class="text-xs text-white/60">{{ card.note }}</p>
        </div>
      </section>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="insight in insights" :key="insight.label" class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ insight.label }}</p>
          <p class="mt-2 text-xl font-semibold text-white">{{ insight.value }}</p>
          <p class="text-xs text-white/60">{{ insight.note }}</p>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Serie temporal</p>
              <h2 class="text-xl font-semibold">Ingresos por periodo</h2>
            </div>
            <span class="text-xs text-white/60">{{ periodSeries.length }} puntos</span>
          </div>
          <div v-if="!periodSeries.length" class="mt-4 text-white/70">Sin datos para este rango.</div>
          <div v-else>
            <div class="mt-4 space-y-2">
              <div
                v-for="point in periodSeries"
                :key="`period-row-${point.period}`"
                class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <div class="flex items-center justify-between text-xs text-white/70">
                  <span>{{ formatPeriod(point.period) }}</span>
                  <span>{{ point.orders_count }} pedidos</span>
                </div>
                <div class="mt-1 flex items-center justify-between text-sm">
                  <span class="font-semibold text-white">{{ money(point.revenue) }}</span>
                  <span class="text-white/60">{{ point.paid_orders }} pagados</span>
                </div>
                <div class="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div
                    class="h-2 rounded-full"
                    :style="{ width: `${Math.max(5, Math.round((Number(point.revenue || 0) / periodSeriesMaxRevenue) * 100))}%`, backgroundColor: theme.accent }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Metodos de pago</p>
          <h2 class="text-xl font-semibold">Resumen de intentos</h2>
          <div v-if="!paymentMethods.length" class="mt-4 text-white/70">Sin datos.</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="item in paymentMethods" :key="item.payment_type_code + '-' + item.response_code" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div class="flex items-center justify-between">
                <p class="font-semibold text-white">{{ formatPaymentMethodLabel(item.payment_type_code) }}</p>
                <span v-if="item.is_configured_method" class="text-xs text-white/60">{{ formatPayoutStatus(item.payout_verification_status) }}</span>
                <span v-else class="text-xs text-white/60">Resp {{ item.response_code ?? '—' }}</span>
              </div>
              <p v-if="item.is_configured_method" class="text-xs text-white/60">Cuenta receptora {{ item.payout_account_email || 'configurada sin correo' }}</p>
              <p class="text-xs text-white/60">Intentos {{ item.attempts }} • Aprobados {{ item.paid }}</p>
              <p class="text-sm font-semibold" :style="{ color: theme.accent }">{{ money(item.amount) }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Top productos</h2>
            <span class="text-xs text-white/60">Por ingresos</span>
          </div>
          <div v-if="!topProducts.length" class="mt-4 text-white/70">Sin datos.</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="prod in topProducts" :key="prod.product_id" class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div>
                <p class="font-semibold text-white">{{ prod.product_name }}</p>
                <p class="text-xs text-white/60">{{ prod.total_qty }} ventas</p>
              </div>
              <p class="font-semibold" :style="{ color: theme.accent }">{{ money(prod.total_revenue) }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">Top categorias</h2>
            <span class="text-xs text-white/60">Por ingresos</span>
          </div>
          <div v-if="!topCategories.length" class="mt-4 text-white/70">Sin datos.</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="cat in topCategories" :key="cat.category" class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div>
                <p class="font-semibold text-white">{{ cat.category }}</p>
                <p class="text-xs text-white/60">{{ cat.total_qty }} ventas</p>
              </div>
              <p class="font-semibold" :style="{ color: theme.accent }">{{ money(cat.total_revenue) }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Conversión</p>
              <h2 class="text-xl font-semibold">Pagadas por periodo</h2>
            </div>
            <span class="text-xs text-white/60">{{ conversionSeries.length }} puntos</span>
          </div>
          <div v-if="!conversionSeries.length" class="mt-4 text-white/70">Sin datos de conversión.</div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="point in conversionSeries" :key="`conv-analytics-${point.period}`" class="space-y-1">
              <div class="flex items-center justify-between text-xs text-white/70">
                <span>{{ point.label }}</span>
                <span>{{ point.rate }}%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-white/10">
                <div class="h-2 rounded-full" :style="{ width: `${Math.max(4, point.rate)}%`, backgroundColor: theme.accent }" />
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Participación</p>
              <h2 class="text-xl font-semibold">Ingresos por categoría</h2>
            </div>
            <span class="text-xs text-white/60">Top {{ categoryShare.length }}</span>
          </div>
          <div v-if="!categoryShare.length" class="mt-4 text-white/70">Sin categorías con ventas.</div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="cat in categoryShare" :key="`cat-share-${cat.category}`" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-white/80">{{ cat.category }}</span>
                <span class="text-white/60">{{ cat.percent }}%</span>
              </div>
              <div class="h-2 w-full rounded-full bg-white/10">
                <div class="h-2 rounded-full" :style="{ width: `${Math.max(4, cat.percent)}%`, backgroundColor: '#22c55e' }" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Power BI</p>
            <h2 class="text-xl font-semibold">Exportacion para analisis</h2>
            <p class="text-white/70">Descarga CSV o usa las consultas M para armar el .pbix en Power BI Desktop.</p>
          </div>
          <a
            href="/powerbi/pymeweb-queries.m"
            class="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/40"
            target="_blank"
            rel="noreferrer"
          >
            Descargar queries M
          </a>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <button class="rounded-xl border border-white/20 px-4 py-2 text-xs text-white/80" @click="downloadCsv('orders')">CSV ordenes</button>
          <button class="rounded-xl border border-white/20 px-4 py-2 text-xs text-white/80" @click="downloadCsv('order_items')">CSV items</button>
          <button class="rounded-xl border border-white/20 px-4 py-2 text-xs text-white/80" @click="downloadCsv('products')">CSV productos</button>
          <button class="rounded-xl border border-white/20 px-4 py-2 text-xs text-white/80" @click="downloadCsv('payments')">CSV pagos</button>
          <button class="rounded-xl border border-white/20 px-4 py-2 text-xs text-white/80" @click="downloadCsv('customers')">CSV clientes</button>
        </div>
      </section>
    </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useDashboardAccess } from '~/composables/useDashboardAccess'

definePageMeta({ middleware: ['auth'], requiresAuth: true, ssr: false })

const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()
const { dashboardLinks } = useDashboardAccess()
const config = useRuntimeConfig()
const apiBase = String(config.public.apiBase || '')

const loading = ref(false)
const loadError = ref('')
const stores = ref<{ id: number; name: string; slug: string }[]>([])

const today = new Date()
const yearOptions = Array.from({ length: 5 }).map((_, idx) => today.getFullYear() - idx)
const monthOptions = [
  { value: 1, label: 'Ene' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Abr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Ago' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dic' },
]
const quarterOptions = [1, 2, 3, 4]

const filters = ref({
  store: '',
  granularity: 'month',
  start: '',
  end: '',
  year: today.getFullYear(),
  month: today.getMonth() + 1,
  quarter: Math.floor(today.getMonth() / 3) + 1,
})

const summary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0, status_counts: {} as Record<string, number> })
const previousSummary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0 })
const periodSeries = ref<{ period: string; orders_count: number; paid_orders: number; revenue: number }[]>([])
const paymentMethods = ref<any[]>([])
const topProducts = ref<any[]>([])
const topCategories = ref<any[]>([])

const allowedStoreSlugs = computed(() => {
  const memberships = auth.user?.memberships || []
  const allowed = new Set(['ADMIN', 'REPORTS', 'DATA_ANALYST'])
  return new Set(memberships.filter((m) => m.roles?.some((r) => allowed.has(r))).map((m) => m.store.slug))
})

const storeOptions = computed(() => {
  if (!auth.user?.memberships?.length) return stores.value
  if (!allowedStoreSlugs.value.size) return []
  return stores.value.filter((s) => allowedStoreSlugs.value.has(s.slug))
})

const rangeLabel = computed(() => {
  const range = getRange()
  return `${range.start} a ${range.end}`
})

const summaryCards = computed(() => [
  { label: 'Ordenes', value: summary.value.total_orders, note: 'Total en rango' },
  { label: 'Pagadas/Finalizadas', value: summary.value.paid_orders, note: 'Estado final' },
  { label: 'Ingresos', value: money(summary.value.total_revenue), note: 'Recaudado' },
  { label: 'Ticket promedio', value: money(summary.value.avg_ticket), note: 'Promedio' },
])

const insights = computed(() => {
  const approvalRate = summary.value.total_orders
    ? Math.round((summary.value.paid_orders / summary.value.total_orders) * 100)
    : 0
  const deltaRevenue = Number(summary.value.total_revenue) - Number(previousSummary.value.total_revenue || 0)
  const deltaOrders = Number(summary.value.total_orders) - Number(previousSummary.value.total_orders || 0)

  const topProduct = topProducts.value[0]
  const topProductShare = topProduct && summary.value.total_revenue
    ? Math.round((Number(topProduct.total_revenue || 0) / Number(summary.value.total_revenue || 1)) * 100)
    : 0

  const bestPayment = paymentMethods.value
    .filter((p) => Number(p.attempts || 0) > 0)
    .map((p) => ({
      ...p,
      rate: Math.round((Number(p.paid || 0) / Number(p.attempts || 1)) * 100),
    }))
    .sort((a, b) => b.rate - a.rate)[0]

  return [
    {
      label: 'Tasa de aprobacion',
      value: `${approvalRate}%`,
      note: 'Pagadas vs ordenes totales',
    },
    {
      label: 'Cambio ingresos',
      value: formatDelta(deltaRevenue),
      note: 'Vs periodo anterior',
    },
    {
      label: 'Cambio ordenes',
      value: formatDelta(deltaOrders, true),
      note: 'Volumen vs periodo anterior',
    },
    {
      label: 'Producto estrella',
      value: topProduct ? topProduct.product_name : '—',
      note: topProduct ? `${topProductShare}% del ingreso` : 'Sin ventas',
    },
    {
      label: 'Mejor metodo pago',
      value: bestPayment ? formatPaymentMethodLabel(bestPayment.payment_type_code) : '—',
      note: bestPayment ? `${bestPayment.rate}% aprobacion` : 'Sin datos',
    },
    {
      label: 'Categoria top',
      value: topCategories.value[0]?.category || '—',
      note: topCategories.value[0] ? `${topCategories.value[0].total_qty} ventas` : 'Sin ventas',
    },
  ]
})

const chartBars = computed(() => {
  const values = periodSeries.value.map((p) => Number(p.revenue) || 0)
  const max = Math.max(...values, 1)
  return periodSeries.value.map((p) => ({
    label: formatPeriod(p.period),
    value: Number(p.revenue) || 0,
    height: 24 + Math.round(((Number(p.revenue) || 0) / max) * 120),
  }))
})

const periodSeriesMaxRevenue = computed(() => {
  if (!periodSeries.value.length) return 1
  return Math.max(...periodSeries.value.map((point) => Number(point.revenue || 0)), 1)
})

const conversionSeries = computed(() =>
  periodSeries.value.map((point) => {
    const total = Number(point.orders_count || 0)
    const paid = Number(point.paid_orders || 0)
    return {
      period: point.period,
      label: formatPeriod(point.period),
      rate: total > 0 ? Math.round((paid / total) * 100) : 0,
    }
  }),
)

const categoryShare = computed(() => {
  const totalRevenue = topCategories.value.reduce((acc, item) => acc + Number(item.total_revenue || 0), 0)
  if (!totalRevenue) return []
  return topCategories.value.slice(0, 6).map((item) => ({
    category: item.category,
    percent: Math.round((Number(item.total_revenue || 0) / totalRevenue) * 100),
  }))
})

const barColor = (idx: number) => (idx === chartBars.value.length - 1 ? theme.accent : 'rgba(255,255,255,0.25)')

const money = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(Number(value) || 0)

const formatPaymentMethodLabel = (value: string) => {
  const raw = String(value || '').toUpperCase()
  if (!raw) return 'N/A'
  if (raw.startsWith('PAYOUT_PAYPAL')) return 'Cuenta receptora PayPal'
  if (raw.startsWith('PAYOUT_BANK_TRANSFER')) return 'Cuenta receptora Transferencia'
  const map: Record<string, string> = {
    VDC: 'Tarjeta debito',
    VN: 'Tarjeta credito',
    SI: 'Cuotas sin interes',
    S2: 'Cuotas comercio',
    NC: 'N cuotas',
  }
  return map[raw] || raw
}

const formatPayoutStatus = (statusCode: string) => {
  const map: Record<string, string> = {
    verified: 'Cuenta verificada',
    pending: 'Pendiente de verificacion',
    rejected: 'Verificacion rechazada',
  }
  return map[String(statusCode || '').toLowerCase()] || 'Cuenta receptora'
}

const formatPeriod = (value: string) => {
  if (!value) return '—'
  const date = new Date(value)
  if (filters.value.granularity === 'year') return String(date.getFullYear())
  if (filters.value.granularity === 'month') return `${date.getMonth() + 1}/${date.getFullYear()}`
  if (filters.value.granularity === 'quarter') return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`
  return date.toLocaleDateString('es-CL')
}

const formatDelta = (value: number, isCount = false) => {
  const numeric = Number(value) || 0
  const sign = numeric > 0 ? '+' : ''
  return isCount ? `${sign}${numeric}` : `${sign}${money(numeric)}`
}

const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
  if (!auth.token) throw new Error('No autenticado')
  const doFetch = (token: string) =>
    $fetch<T>(url as any, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
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

const ensureAuthReady = async () => {
  return Boolean(await auth.initializeSession({ forceProfile: true }))
}

const getRange = () => {
  const { granularity, year, month, quarter, start, end } = filters.value
  if (granularity === 'day') {
    const fallback = new Date()
    const startDate = start || new Date(fallback.getFullYear(), fallback.getMonth(), 1).toISOString().slice(0, 10)
    const endDate = end || fallback.toISOString().slice(0, 10)
    return { start: startDate, end: endDate }
  }
  if (granularity === 'month') {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)
    return { start: startDate.toISOString().slice(0, 10), end: endDate.toISOString().slice(0, 10) }
  }
  if (granularity === 'quarter') {
    const startMonth = (quarter - 1) * 3
    const startDate = new Date(year, startMonth, 1)
    const endDate = new Date(year, startMonth + 3, 0)
    return { start: startDate.toISOString().slice(0, 10), end: endDate.toISOString().slice(0, 10) }
  }
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  return { start: startDate.toISOString().slice(0, 10), end: endDate.toISOString().slice(0, 10) }
}

const getPreviousRange = (range: { start: string; end: string }) => {
  const start = new Date(range.start)
  const end = new Date(range.end)
  const dayMs = 24 * 60 * 60 * 1000
  const spanDays = Math.round((end.getTime() - start.getTime()) / dayMs) + 1
  const prevEnd = new Date(start.getTime() - dayMs)
  const prevStart = new Date(prevEnd.getTime() - (spanDays - 1) * dayMs)
  return { start: prevStart.toISOString().slice(0, 10), end: prevEnd.toISOString().slice(0, 10) }
}

const loadAll = async () => {
  loadError.value = ''
  if (!filters.value.store) {
    loadError.value = 'Necesitas seleccionar una tienda para ver analisis.'
    return
  }
  loading.value = true
  const range = getRange()
  const params = { start_date: range.start, end_date: range.end }
  try {
    summary.value = await authedFetch<any>(`${apiBase}/store/${filters.value.store}/admin/reportes/orders/summary/`, { params })
    const prevRange = getPreviousRange(range)
    previousSummary.value = await authedFetch<any>(
      `${apiBase}/store/${filters.value.store}/admin/reportes/orders/summary/`,
      { params: { start_date: prevRange.start, end_date: prevRange.end } }
    )
    periodSeries.value = await authedFetch<any[]>(`${apiBase}/store/${filters.value.store}/admin/reportes/orders/period/`, {
      params: { ...params, granularity: filters.value.granularity },
    })
    paymentMethods.value = await authedFetch<any[]>(`${apiBase}/store/${filters.value.store}/admin/reportes/payments/summary/methods/`, { params })
    topProducts.value = await authedFetch<any[]>(`${apiBase}/store/${filters.value.store}/admin/reportes/products/summary/`, {
      params: { ...params, limit: 10 },
    })
    topCategories.value = await authedFetch<any[]>(`${apiBase}/store/${filters.value.store}/admin/reportes/categories/summary/`, {
      params: { ...params, limit: 10 },
    })
  } catch (error: any) {
    const detail = error?.response?._data?.detail || 'No pudimos cargar los datos de analisis.'
    loadError.value = detail
  } finally {
    loading.value = false
  }
}

const downloadCsv = async (type: string) => {
  if (!filters.value.store || !auth.token) return
  const range = getRange()
  const params = new URLSearchParams({ start_date: range.start, end_date: range.end })
  const map: Record<string, string> = {
    orders: `orders/export/`,
    order_items: `orders/items/export/`,
    products: `products/export/`,
    payments: `payments/export/`,
    customers: `customers/export/`,
  }
  const endpoint = map[type]
  if (!endpoint) return
  const url = `${apiBase}/store/${filters.value.store}/admin/reportes/${endpoint}?${params.toString()}`
  const response = await fetch(url, { headers: { Authorization: `Bearer ${auth.token}` } })
  const blob = await response.blob()
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `reporte_${type}_${range.start}_${range.end}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

onMounted(async () => {
  const ready = await ensureAuthReady()
  if (!ready) {
    await navigateTo('/login')
    return
  }
  stores.value = await auth.fetchMyStores()
  if (!storeOptions.value.length) {
    loadError.value = 'No tienes permisos de analisis de datos para ninguna tienda.'
    theme.applyTheme()
    return
  }
  const firstStore = stores.value[0]
  if (firstStore?.slug) {
    filters.value.store = storeOptions.value[0]?.slug || firstStore.slug
  } else {
    loadError.value = 'No tienes tiendas asignadas. Debes tener al menos una para ver analisis.'
  }
  await loadAll()
  theme.applyTheme()
})
</script>
