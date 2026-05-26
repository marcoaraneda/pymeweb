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
          <h1 class="text-3xl font-extrabold">Análisis financiero</h1>
          <p class="text-white/70">Ingresos, aprobaciones y distribución por método de pago.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            class="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-50"
            @click="exportFinancialCsv"
            :disabled="!periodSeries.length"
          >
            Exportar CSV
          </button>
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
              <option :value="MARKETPLACE_SCOPE">Marketplace</option>
              <option v-for="s in storeOptions" :key="s.slug" :value="s.slug">{{ s.name }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-white/60">Granularidad</label>
            <select v-model="filters.granularity" class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
              <option value="day">Día</option>
              <option value="month">Mes</option>
              <option value="quarter">Trimestre</option>
              <option value="year">Año</option>
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

      <section class="grid gap-4 lg:grid-cols-4">
        <article v-for="item in kpiComparisons" :key="item.label" class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ item.label }}</p>
          <p class="mt-1 text-lg font-semibold text-white">{{ item.current }}</p>
          <p class="mt-1 text-xs text-white/60">Anterior: {{ item.previous }}</p>
          <p class="mt-1 text-xs font-semibold" :class="item.delta >= 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ item.delta >= 0 ? '+' : '' }}{{ item.delta }}% vs periodo anterior
          </p>
        </article>
      </section>

      <section class="grid gap-4 lg:grid-cols-3">
        <article class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ritmo</p>
          <h2 class="mt-1 text-lg font-semibold text-white">Run rate mensual</h2>
          <p class="mt-3 text-2xl font-bold" :style="{ color: theme.accent }">{{ money(projectedMonthlyRevenue) }}</p>
          <p class="mt-1 text-xs text-white/60">Promedio diario {{ money(averageDailyRevenue) }} en {{ rangeDays }} días.</p>
          <p class="mt-1 text-xs text-white/60">Anterior {{ money(previousProjectedMonthlyRevenue) }}</p>
          <p class="mt-1 text-xs font-semibold" :class="rhythmDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ rhythmDelta >= 0 ? '+' : '' }}{{ rhythmDelta }}% vs anterior
          </p>
        </article>

        <article class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Dependencia</p>
          <h2 class="mt-1 text-lg font-semibold text-white">Concentración de ingresos</h2>
          <p class="mt-3 text-2xl font-bold text-white">{{ revenueConcentration }}%</p>
          <p class="mt-1 text-xs text-white/60">Peso del periodo más fuerte sobre el total cobrado.</p>
          <p class="mt-1 text-xs text-white/60">Anterior {{ previousRevenueConcentration }}%</p>
          <p class="mt-1 text-xs font-semibold" :class="concentrationDelta <= 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ concentrationDelta >= 0 ? '+' : '' }}{{ concentrationDelta }}% vs anterior
          </p>
        </article>

        <article class="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Tendencia</p>
          <h2 class="mt-1 text-lg font-semibold text-white">Variación reciente</h2>
          <p class="mt-3 text-2xl font-bold" :class="revenueMomentum >= 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ revenueMomentum >= 0 ? '+' : '' }}{{ revenueMomentum }}%
          </p>
          <p class="mt-1 text-xs text-white/60">Cambio del último periodo frente al anterior.</p>
          <p class="mt-1 text-xs text-white/60">Anterior {{ previousRevenueMomentum >= 0 ? '+' : '' }}{{ previousRevenueMomentum }}%</p>
          <p class="mt-1 text-xs font-semibold" :class="momentumDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'">
            {{ momentumDelta >= 0 ? '+' : '' }}{{ momentumDelta }}% vs anterior
          </p>
        </article>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Simulación</p>
            <h2 class="text-xl font-semibold text-white">Escenario proyectado</h2>
          </div>
          <span class="text-xs text-white/60">Basado en pedidos actuales del rango</span>
        </div>
        <div class="mt-4 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div class="space-y-3">
            <label class="text-xs text-white/70">
              Aprobación esperada (%)
              <input v-model.number="simulator.approvalRate" type="range" min="0" max="100" class="mt-2 w-full" />
              <span class="text-sm text-white">{{ simulator.approvalRate }}%</span>
            </label>
            <label class="text-xs text-white/70">
              Ticket esperado (CLP)
              <input v-model.number="simulator.avgTicket" type="number" min="0" step="100" class="mt-1 w-full rounded-lg border border-white/20 bg-white px-3 py-2 text-sm text-slate-900" />
            </label>
          </div>
          <div class="grid gap-2 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Pagadas simuladas</p>
              <p class="mt-2 text-xl font-semibold text-white">{{ simulatedPaidOrders }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ingreso simulado</p>
              <p class="mt-2 text-xl font-semibold" :style="{ color: theme.accent }">{{ money(simulatedRevenue) }}</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4 sm:col-span-2">
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Impacto vs real</p>
              <p class="mt-2 text-xl font-semibold" :class="simulatedDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'">
                {{ simulatedDelta >= 0 ? '+' : '' }}{{ money(simulatedDelta) }}
              </p>
              <p class="text-xs text-white/60">Real actual: {{ money(summary.total_revenue) }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ranking</p>
              <h2 class="text-xl font-semibold">Periodos con mayor ingreso</h2>
            </div>
            <span class="text-xs text-white/60">Top {{ topRevenuePeriods.length }}</span>
          </div>
          <div v-if="!topRevenuePeriods.length" class="mt-4 text-white/70">Sin datos para el ranking.</div>
          <div v-else class="mt-4 space-y-3">
            <div
              v-for="item in topRevenuePeriods"
              :key="`top-period-${item.period}`"
              class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <div class="flex items-center justify-between text-sm">
                <p class="font-semibold text-white">{{ formatPeriod(item.period) }}</p>
                <p class="font-semibold" :style="{ color: theme.accent }">{{ money(item.revenue) }}</p>
              </div>
              <p class="mt-1 text-xs text-white/60">{{ item.orders_count }} pedidos • {{ item.paid_orders }} pagados</p>
              <div class="mt-2 h-2 w-full rounded-full bg-white/10">
                <div
                  class="h-2 rounded-full"
                  :style="{ width: `${Math.max(5, Math.round((Number(item.revenue || 0) / periodSeriesMaxRevenue) * 100))}%`, backgroundColor: theme.accent }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Cobranza</p>
              <h2 class="text-xl font-semibold">Calidad por método</h2>
            </div>
            <span class="text-xs text-white/60">{{ methodPerformance.length }} métodos</span>
          </div>
          <div v-if="!methodPerformance.length" class="mt-4 text-white/70">Sin métodos registrados.</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="item in methodPerformance" :key="`method-perf-${item.key}`" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <div class="flex items-center justify-between">
                <p class="font-semibold text-white">{{ item.label }}</p>
                <p class="text-xs text-white/60">Aprobación {{ item.successRate }}%</p>
              </div>
              <p class="text-xs text-white/60">Intentos {{ item.attempts }} • Pagados {{ item.paid }} • Rechazados {{ item.rejected }}</p>
              <div class="mt-2 h-2 w-full rounded-full bg-white/10">
                <div class="h-2 rounded-full" :style="{ width: `${Math.max(4, item.successRate)}%`, backgroundColor: theme.accent }" />
              </div>
            </div>
          </div>
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
                :key="`period-row-finance-${point.period}`"
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
          <h2 class="text-xl font-semibold">Rendimiento</h2>
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

      <section class="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Eficiencia</p>
              <h2 class="text-xl font-semibold">Conversión por periodo</h2>
            </div>
            <span class="text-xs text-white/60">{{ conversionSeries.length }} puntos</span>
          </div>
          <div v-if="!conversionSeries.length" class="mt-4 text-white/70">Sin datos para calcular conversión.</div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="point in conversionSeries" :key="`conv-${point.period}`" class="space-y-1">
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
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Estados</p>
              <h2 class="text-xl font-semibold">Distribución operativa</h2>
            </div>
            <span class="text-xs text-white/60">{{ statusDistribution.reduce((acc, s) => acc + s.count, 0) }} registros</span>
          </div>
          <div v-if="!statusDistribution.length" class="mt-4 text-white/70">Sin datos de estado para el rango.</div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="item in statusDistribution" :key="`status-dist-${item.value}`" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-white/80">{{ item.label }}</span>
                <span class="text-white/60">{{ item.count }} ({{ item.percent }}%)</span>
              </div>
              <div class="h-2 w-full rounded-full bg-white/10">
                <div class="h-2 rounded-full" :style="{ width: `${Math.max(5, item.percent)}%`, backgroundColor: item.color }" />
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Señales</p>
              <h2 class="text-xl font-semibold">Alertas y oportunidades</h2>
            </div>
            <span class="text-xs text-white/60">{{ financialSignals.length }} insights</span>
          </div>
          <div class="mt-4 grid gap-2 sm:grid-cols-3">
            <label class="text-xs text-white/70">
              Min aprobación (%)
              <input v-model.number="alertThresholds.approvalMin" type="number" min="0" max="100" class="mt-1 w-full rounded-lg border border-white/20 bg-white text-slate-900 px-2 py-1" />
            </label>
            <label class="text-xs text-white/70">
              Max concentración (%)
              <input v-model.number="alertThresholds.concentrationMax" type="number" min="0" max="100" class="mt-1 w-full rounded-lg border border-white/20 bg-white text-slate-900 px-2 py-1" />
            </label>
            <label class="text-xs text-white/70">
              Min tendencia (%)
              <input v-model.number="alertThresholds.momentumMin" type="number" min="-100" max="200" class="mt-1 w-full rounded-lg border border-white/20 bg-white text-slate-900 px-2 py-1" />
            </label>
          </div>
          <div class="mt-4 space-y-2">
            <div
              v-for="signal in financialSignals"
              :key="signal.title"
              class="rounded-2xl border px-4 py-3 text-sm"
              :class="signal.type === 'risk' ? 'border-rose-400/30 bg-rose-500/10 text-rose-100' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'"
            >
              <p class="font-semibold">{{ signal.title }}</p>
              <p class="mt-1 text-xs opacity-90">{{ signal.detail }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useDashboardAccess } from '~/composables/useDashboardAccess'

definePageMeta({ middleware: ['auth'], requiresAuth: true, ssr: false })

type StoreLite = { id: number; name: string; slug: string }
type MembershipLite = { store: StoreLite; roles: string[] }

const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()
const { dashboardLinks } = useDashboardAccess()
const config = useRuntimeConfig()
const apiBase = String(config.public.apiBase || '')
const MARKETPLACE_SCOPE = 'marketplace'

const loading = ref(false)
const loadError = ref('')
const stores = ref<StoreLite[]>([])

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

const summary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0 })
const previousSummary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0 })
const periodSeries = ref<{ period: string; orders_count: number; paid_orders: number; revenue: number }[]>([])
const previousPeriodSeries = ref<{ period: string; orders_count: number; paid_orders: number; revenue: number }[]>([])
const paymentMethods = ref<any[]>([])
const storeOrders = ref<any[]>([])
const marketplaceRows = ref<any[]>([])
const isMarketplaceSelected = computed(() => filters.value.store === MARKETPLACE_SCOPE)
const THRESHOLDS_STORAGE_KEY = 'finance-alert-thresholds-v1'
const alertThresholds = ref({
  approvalMin: 70,
  concentrationMax: 45,
  momentumMin: 0,
})
const simulator = ref({
  approvalRate: 85,
  avgTicket: 0,
})

const rangeDays = computed(() => {
  const range = getRange()
  const start = new Date(range.start).getTime()
  const end = new Date(range.end).getTime()
  const diff = Math.floor((end - start) / 86400000) + 1
  return Math.max(diff, 1)
})

const averageDailyRevenue = computed(() => {
  return Number(summary.value.total_revenue || 0) / rangeDays.value
})

const projectedMonthlyRevenue = computed(() => {
  return Math.round(averageDailyRevenue.value * 30)
})

const previousRangeDays = computed(() => {
  const range = getPreviousRange()
  const start = new Date(range.start).getTime()
  const end = new Date(range.end).getTime()
  const diff = Math.floor((end - start) / 86400000) + 1
  return Math.max(diff, 1)
})

const previousAverageDailyRevenue = computed(() => {
  return Number(previousSummary.value.total_revenue || 0) / previousRangeDays.value
})

const previousProjectedMonthlyRevenue = computed(() => {
  return Math.round(previousAverageDailyRevenue.value * 30)
})

const allowedStoreSlugs = computed(() => {
  const memberships = (auth.user?.memberships || []) as MembershipLite[]
  const allowed = new Set(['ADMIN', 'REPORTS', 'FINANCE'])
  const slugs = new Set<string>()
  for (const membership of memberships) {
    if (membership.roles?.some((role) => allowed.has(role))) {
      slugs.add(membership.store.slug)
    }
  }
  return slugs
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

const summaryCards = computed(() => {
  const approvalRate = summary.value.total_orders
    ? Math.round((summary.value.paid_orders / summary.value.total_orders) * 100)
    : 0
  const totalAttempts = paymentMethods.value.reduce((acc, item) => acc + Number(item.attempts || 0), 0)
  const totalPaid = paymentMethods.value.reduce((acc, item) => acc + Number(item.paid || 0), 0)
  const rejectionRate = totalAttempts ? Math.round(((totalAttempts - totalPaid) / totalAttempts) * 100) : 0

  return [
    { label: 'Ingresos cobrados', value: money(summary.value.total_revenue), note: 'Total en el rango' },
    { label: 'Ordenes pagadas', value: summary.value.paid_orders, note: 'Transacciones exitosas' },
    { label: 'Ticket promedio', value: money(summary.value.avg_ticket), note: 'Valor medio por orden' },
    { label: 'Aprobacion pagos', value: `${approvalRate}%`, note: `Rechazo ${rejectionRate}%` },
  ]
})

const pctDelta = (current: number, previous: number) => {
  if (previous <= 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

const kpiComparisons = computed(() => {
  const currentApproval = summary.value.total_orders
    ? Math.round((summary.value.paid_orders / summary.value.total_orders) * 100)
    : 0
  const prevApproval = previousSummary.value.total_orders
    ? Math.round((previousSummary.value.paid_orders / previousSummary.value.total_orders) * 100)
    : 0

  return [
    {
      label: 'Ingreso',
      current: money(summary.value.total_revenue),
      previous: money(previousSummary.value.total_revenue),
      delta: pctDelta(Number(summary.value.total_revenue || 0), Number(previousSummary.value.total_revenue || 0)),
    },
    {
      label: 'Pagadas',
      current: String(summary.value.paid_orders),
      previous: String(previousSummary.value.paid_orders),
      delta: pctDelta(Number(summary.value.paid_orders || 0), Number(previousSummary.value.paid_orders || 0)),
    },
    {
      label: 'Ticket',
      current: money(summary.value.avg_ticket),
      previous: money(previousSummary.value.avg_ticket),
      delta: pctDelta(Number(summary.value.avg_ticket || 0), Number(previousSummary.value.avg_ticket || 0)),
    },
    {
      label: 'Aprobación',
      current: `${currentApproval}%`,
      previous: `${prevApproval}%`,
      delta: pctDelta(currentApproval, prevApproval),
    },
  ]
})

const topRevenuePeriods = computed(() => {
  return [...periodSeries.value]
    .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))
    .slice(0, 5)
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

const revenueMomentum = computed(() => {
  if (periodSeries.value.length < 2) return 0
  const sorted = [...periodSeries.value].sort((a, b) => (a.period > b.period ? 1 : -1))
  const prev = Number(sorted[sorted.length - 2]?.revenue || 0)
  const current = Number(sorted[sorted.length - 1]?.revenue || 0)
  if (prev <= 0) return current > 0 ? 100 : 0
  return Math.round(((current - prev) / prev) * 100)
})

const revenueConcentration = computed(() => {
  const total = Number(summary.value.total_revenue || 0)
  if (total <= 0) return 0
  const top = Math.max(...periodSeries.value.map((item) => Number(item.revenue || 0)), 0)
  return Math.round((top / total) * 100)
})

const previousRevenueConcentration = computed(() => {
  const total = Number(previousSummary.value.total_revenue || 0)
  if (total <= 0) return 0
  const top = Math.max(...previousPeriodSeries.value.map((item) => Number(item.revenue || 0)), 0)
  return Math.round((top / total) * 100)
})

const previousRevenueMomentum = computed(() => {
  if (previousPeriodSeries.value.length < 2) return 0
  const sorted = [...previousPeriodSeries.value].sort((a, b) => (a.period > b.period ? 1 : -1))
  const prev = Number(sorted[sorted.length - 2]?.revenue || 0)
  const current = Number(sorted[sorted.length - 1]?.revenue || 0)
  if (prev <= 0) return current > 0 ? 100 : 0
  return Math.round(((current - prev) / prev) * 100)
})

const rhythmDelta = computed(() => pctDelta(projectedMonthlyRevenue.value, previousProjectedMonthlyRevenue.value))
const concentrationDelta = computed(() => pctDelta(revenueConcentration.value, previousRevenueConcentration.value))
const momentumDelta = computed(() => pctDelta(revenueMomentum.value, previousRevenueMomentum.value))

const conversionSeries = computed(() =>
  periodSeries.value.map((point) => {
    const total = Number(point.orders_count || 0)
    const paid = Number(point.paid_orders || 0)
    const rate = total > 0 ? Math.round((paid / total) * 100) : 0
    return {
      period: point.period,
      label: formatPeriod(point.period),
      rate,
    }
  }),
)

const statusPalette: Record<string, string> = {
  pending: '#f59e0b',
  preparing: '#f97316',
  in_transit: '#0ea5e9',
  delivered: '#22c55e',
  completed: '#10b981',
  shipping: '#38bdf8',
}

const statusDistribution = computed(() => {
  const source = isMarketplaceSelected.value ? marketplaceRows.value : storeOrders.value
  const field = isMarketplaceSelected.value ? 'marketplace_status' : 'status'
  const labelMap: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'Preparando',
    in_transit: 'En tránsito',
    delivered: 'Entregado',
    completed: 'Finalizado',
    shipping: 'Enviándose',
  }
  const total = Math.max(source.length, 1)
  const counter = new Map<string, number>()
  source.forEach((item) => {
    const key = String(item?.[field] || (isMarketplaceSelected.value ? 'preparing' : 'pending'))
    counter.set(key, (counter.get(key) || 0) + 1)
  })
  return Array.from(counter.entries())
    .map(([value, count]) => ({
      value,
      label: labelMap[value] || value,
      count,
      percent: Math.round((count / total) * 100),
      color: statusPalette[value] || theme.accent,
    }))
    .sort((a, b) => b.count - a.count)
})

const methodPerformance = computed(() => {
  return paymentMethods.value.map((item, idx) => {
    const attempts = Number(item.attempts || 0)
    const paid = Number(item.paid || 0)
    const rejected = Math.max(attempts - paid, 0)
    const successRate = attempts > 0 ? Math.round((paid / attempts) * 100) : 0
    return {
      key: `${item.payment_type_code || 'na'}-${item.response_code || idx}`,
      label: formatPaymentMethodLabel(item.payment_type_code),
      attempts,
      paid,
      rejected,
      successRate,
    }
  })
})

const financialSignals = computed(() => {
  const signals: Array<{ title: string; detail: string; type: 'risk' | 'opportunity' }> = []
  const approvalRate = summary.value.total_orders
    ? Math.round((summary.value.paid_orders / summary.value.total_orders) * 100)
    : 0

  if (approvalRate < alertThresholds.value.approvalMin) {
    signals.push({
      title: 'Riesgo en aprobación de pagos',
      detail: `La aprobación está en ${approvalRate}% y bajo el mínimo (${alertThresholds.value.approvalMin}%). Revisa medios de pago y rechazos por código.`,
      type: 'risk',
    })
  } else {
    signals.push({
      title: 'Aprobación saludable',
      detail: `La aprobación llega a ${approvalRate}%, señal positiva para escalar campañas.`,
      type: 'opportunity',
    })
  }

  if (revenueConcentration.value >= alertThresholds.value.concentrationMax) {
    signals.push({
      title: 'Ingresos concentrados',
      detail: `El ${revenueConcentration.value}% del ingreso se concentra en un solo periodo (máximo sugerido ${alertThresholds.value.concentrationMax}%). Conviene suavizar demanda con promociones continuas.`,
      type: 'risk',
    })
  } else {
    signals.push({
      title: 'Ingresos diversificados',
      detail: `La concentración máxima es ${revenueConcentration.value}%, con comportamiento más estable entre periodos.`,
      type: 'opportunity',
    })
  }

  if (revenueMomentum.value < alertThresholds.value.momentumMin) {
    signals.push({
      title: 'Desaceleración reciente',
      detail: `El último periodo está en ${revenueMomentum.value}% vs anterior, bajo el mínimo (${alertThresholds.value.momentumMin}%). Activa campañas de recuperación y bundles.`,
      type: 'risk',
    })
  } else {
    signals.push({
      title: 'Tracción positiva',
      detail: `El último periodo creció ${revenueMomentum.value}% vs el anterior. Oportunidad para reforzar inversión.`,
      type: 'opportunity',
    })
  }

  return signals
})

const simulatedPaidOrders = computed(() => {
  const totalOrders = Number(summary.value.total_orders || 0)
  return Math.round(totalOrders * (Number(simulator.value.approvalRate || 0) / 100))
})

const simulatedRevenue = computed(() => {
  return Math.round(simulatedPaidOrders.value * Number(simulator.value.avgTicket || 0))
})

const simulatedDelta = computed(() => {
  return simulatedRevenue.value - Number(summary.value.total_revenue || 0)
})

watch(
  () => summary.value.avg_ticket,
  (ticket) => {
    if (!simulator.value.avgTicket && Number(ticket || 0) > 0) {
      simulator.value.avgTicket = Math.round(Number(ticket || 0))
    }
  },
  { immediate: true },
)

watch(
  alertThresholds,
  (value) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(THRESHOLDS_STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true },
)

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
    MARKETPLACE: 'Marketplace',
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

const getPreviousRange = () => {
  const { granularity, year, month, quarter, start, end } = filters.value
  if (granularity === 'day') {
    const current = getRange()
    const startDate = new Date(current.start)
    const endDate = new Date(current.end)
    const span = Math.max(Math.floor((endDate.getTime() - startDate.getTime()) / 86400000) + 1, 1)
    const prevEnd = new Date(startDate)
    prevEnd.setDate(prevEnd.getDate() - 1)
    const prevStart = new Date(prevEnd)
    prevStart.setDate(prevStart.getDate() - (span - 1))
    return { start: prevStart.toISOString().slice(0, 10), end: prevEnd.toISOString().slice(0, 10) }
  }

  if (granularity === 'month') {
    const currentMonthStart = new Date(year, month - 1, 1)
    const prevMonthStart = new Date(year, month - 2, 1)
    const prevMonthEnd = new Date(year, month - 1, 0)
    return { start: prevMonthStart.toISOString().slice(0, 10), end: prevMonthEnd.toISOString().slice(0, 10) }
  }

  if (granularity === 'quarter') {
    const startMonth = (quarter - 1) * 3
    const currentQuarterStart = new Date(year, startMonth, 1)
    const prevQuarterStart = new Date(year, startMonth - 3, 1)
    const prevQuarterEnd = new Date(year, startMonth, 0)
    return { start: prevQuarterStart.toISOString().slice(0, 10), end: prevQuarterEnd.toISOString().slice(0, 10) }
  }

  const prevYearStart = new Date(year - 1, 0, 1)
  const prevYearEnd = new Date(year - 1, 11, 31)
  return { start: prevYearStart.toISOString().slice(0, 10), end: prevYearEnd.toISOString().slice(0, 10) }
}

const csvEscape = (value: unknown) => {
  const text = String(value ?? '')
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

const exportFinancialCsv = () => {
  if (!periodSeries.value.length) return
  const rows: string[][] = [
    ['Metrica', 'Valor'],
    ['Scope', isMarketplaceSelected.value ? 'Marketplace' : filters.value.store],
    ['Rango', rangeLabel.value],
    ['Ingresos cobrados', String(summary.value.total_revenue)],
    ['Ordenes pagadas', String(summary.value.paid_orders)],
    ['Ticket promedio', String(summary.value.avg_ticket)],
    ['Aprobacion', String(summary.value.total_orders ? Math.round((summary.value.paid_orders / summary.value.total_orders) * 100) : 0)],
    [],
    ['Periodo', 'Pedidos', 'Pagados', 'Ingresos'],
    ...periodSeries.value.map((item) => [item.period, String(item.orders_count), String(item.paid_orders), String(item.revenue)]),
    [],
    ['Metodo', 'Intentos', 'Pagados', 'Rechazados', 'Aprobacion %'],
    ...methodPerformance.value.map((item) => [item.label, String(item.attempts), String(item.paid), String(item.rejected), String(item.successRate)]),
  ]

  const csv = rows.map((row) => row.map((cell) => csvEscape(cell)).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = `analisis-financiero-${filters.value.store || 'scope'}-${new Date().toISOString().slice(0, 10)}.csv`
  anchor.click()
  URL.revokeObjectURL(href)
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

const loadAll = async () => {
  loadError.value = ''
  loading.value = true
  const range = getRange()
  const previousRange = getPreviousRange()
  const params = { start_date: range.start, end_date: range.end }
  const previousParams = { start_date: previousRange.start, end_date: previousRange.end }
  try {
    if (isMarketplaceSelected.value) {
      const submissions = await authedFetch<any[]>(`${apiBase}/marketplace/submissions/`)
      const startTs = new Date(range.start).getTime()
      const endTs = new Date(range.end).getTime()
      const inRange = submissions.filter((item) => {
        const ts = new Date(item.created_at || item.updated_at || Date.now()).getTime()
        return ts >= startTs && ts <= endTs
      })
      marketplaceRows.value = inRange
      storeOrders.value = []

      const completedItems = inRange.filter((item) => String(item.marketplace_status || 'preparing') === 'completed')
      const totalRevenue = completedItems.reduce((acc, item) => acc + Number(item.offer_price || item.price || 0), 0)

      const prevStartTs = new Date(previousRange.start).getTime()
      const prevEndTs = new Date(previousRange.end).getTime()
      const prevRows = submissions.filter((item) => {
        const ts = new Date(item.created_at || item.updated_at || Date.now()).getTime()
        return ts >= prevStartTs && ts <= prevEndTs
      })
      const prevCompleted = prevRows.filter((item) => String(item.marketplace_status || 'preparing') === 'completed')
      const prevRevenue = prevCompleted.reduce((acc, item) => acc + Number(item.offer_price || item.price || 0), 0)

      summary.value = {
        total_orders: inRange.length,
        paid_orders: completedItems.length,
        total_revenue: totalRevenue,
        avg_ticket: completedItems.length ? totalRevenue / completedItems.length : 0,
      }

      previousSummary.value = {
        total_orders: prevRows.length,
        paid_orders: prevCompleted.length,
        total_revenue: prevRevenue,
        avg_ticket: prevCompleted.length ? prevRevenue / prevCompleted.length : 0,
      }

      const prevGrouped = new Map<string, { period: string; orders_count: number; paid_orders: number; revenue: number }>()
      prevRows.forEach((item) => {
        const rawDate = new Date(item.created_at || item.updated_at || Date.now())
        const period = rawDate.toISOString().slice(0, 10)
        if (!prevGrouped.has(period)) {
          prevGrouped.set(period, { period, orders_count: 0, paid_orders: 0, revenue: 0 })
        }
        const row = prevGrouped.get(period)!
        row.orders_count += 1
        if (String(item.marketplace_status || 'preparing') === 'completed') {
          row.paid_orders += 1
          row.revenue += Number(item.offer_price || item.price || 0)
        }
      })
      previousPeriodSeries.value = Array.from(prevGrouped.values()).sort((a, b) => (a.period > b.period ? 1 : -1))

      const grouped = new Map<string, { period: string; orders_count: number; paid_orders: number; revenue: number }>()
      inRange.forEach((item) => {
        const rawDate = new Date(item.created_at || item.updated_at || Date.now())
        const period = rawDate.toISOString().slice(0, 10)
        if (!grouped.has(period)) {
          grouped.set(period, { period, orders_count: 0, paid_orders: 0, revenue: 0 })
        }
        const row = grouped.get(period)!
        row.orders_count += 1
        if (String(item.marketplace_status || 'preparing') === 'completed') {
          row.paid_orders += 1
          row.revenue += Number(item.offer_price || item.price || 0)
        }
      })
      periodSeries.value = Array.from(grouped.values()).sort((a, b) => (a.period > b.period ? 1 : -1))

      paymentMethods.value = [
        {
          payment_type_code: 'MARKETPLACE',
          response_code: 'N/A',
          attempts: inRange.length,
          paid: completedItems.length,
          amount: totalRevenue,
        },
      ]
    } else {
      if (!filters.value.store) {
        loadError.value = 'Selecciona una tienda para ver el análisis financiero.'
        return
      }
      marketplaceRows.value = []
      summary.value = await authedFetch<any>(`${apiBase}/store/${filters.value.store}/admin/reportes/orders/summary/`, { params })
      previousSummary.value = await authedFetch<any>(`${apiBase}/store/${filters.value.store}/admin/reportes/orders/summary/`, {
        params: previousParams,
      }).catch(() => ({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0 }))
      periodSeries.value = await authedFetch<any[]>(`${apiBase}/store/${filters.value.store}/admin/reportes/orders/period/`, {
        params: { ...params, granularity: filters.value.granularity },
      })
      previousPeriodSeries.value = await authedFetch<any[]>(`${apiBase}/store/${filters.value.store}/admin/reportes/orders/period/`, {
        params: { ...previousParams, granularity: filters.value.granularity },
      }).catch(() => [])
      paymentMethods.value = await authedFetch<any[]>(`${apiBase}/store/${filters.value.store}/admin/reportes/payments/summary/methods/`, { params })
      const rawOrders = await authedFetch<any[]>(`${apiBase}/orders/`, { params: { store: filters.value.store } }).catch(() => [])
      const startTs = new Date(range.start).getTime()
      const endTs = new Date(range.end).getTime()
      storeOrders.value = rawOrders.filter((item) => {
        const ts = new Date(item.created_at || Date.now()).getTime()
        return ts >= startTs && ts <= endTs
      })
    }
  } catch (error: any) {
    const detail = error?.response?._data?.detail || 'No pudimos cargar el análisis financiero.'
    loadError.value = detail
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    const rawThresholds = window.localStorage.getItem(THRESHOLDS_STORAGE_KEY)
    if (rawThresholds) {
      try {
        const parsed = JSON.parse(rawThresholds)
        alertThresholds.value = {
          approvalMin: Number(parsed?.approvalMin ?? alertThresholds.value.approvalMin),
          concentrationMax: Number(parsed?.concentrationMax ?? alertThresholds.value.concentrationMax),
          momentumMin: Number(parsed?.momentumMin ?? alertThresholds.value.momentumMin),
        }
      } catch {
        // Keep defaults when local storage payload is invalid.
      }
    }
  }

  const ready = await ensureAuthReady()
  if (!ready) {
    await navigateTo('/login')
    return
  }
  stores.value = await auth.fetchMyStores()
  filters.value.store = storeOptions.value[0]?.slug || MARKETPLACE_SCOPE
  await loadAll()
  theme.applyTheme()
})
</script>
