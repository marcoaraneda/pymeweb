<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-3xl space-y-6">
      <header>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Pedidos</p>
        <h1 class="text-3xl font-bold text-slate-900">Ver seguimiento</h1>
        <p class="text-slate-600">Ingresa tu codigo de seguimiento para ver el estado del pedido.</p>
      </header>

      <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div class="grid gap-3 sm:grid-cols-[1fr,auto]">
          <input
            v-model="trackingCode"
            type="text"
            class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            placeholder="Ej: AB12CD34EF"
            @keyup.enter="searchTracking"
          />
          <button
            class="rounded-xl px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60"
            :style="{ backgroundColor: theme.accent || '#2563eb' }"
            :disabled="loading"
            @click="searchTracking"
          >
            {{ loading ? 'Consultando...' : 'Buscar' }}
          </button>
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      </section>

      <section v-if="order" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-slate-500">Codigo: <span class="font-semibold text-slate-800">{{ order.tracking_code }}</span></p>
          <span :class="['rounded-full px-3 py-1 text-xs font-semibold', statusBadge(order.status)]">{{ statusLabel(order.status) }}</span>
        </div>
        <div class="grid gap-3 sm:grid-cols-2 text-sm">
          <p class="text-slate-700"><span class="text-slate-500">Cliente:</span> {{ order.masked_name }}</p>
          <p class="text-slate-700"><span class="text-slate-500">Email:</span> {{ order.masked_email }}</p>
          <p class="text-slate-700"><span class="text-slate-500">Telefono:</span> {{ order.masked_phone }}</p>
          <p class="text-slate-700"><span class="text-slate-500">Direccion:</span> {{ order.masked_address }}</p>
          <p class="text-slate-700"><span class="text-slate-500">Total:</span> {{ formatClp(order.total) }}</p>
          <p class="text-slate-700"><span class="text-slate-500">Fecha:</span> {{ formatDate(order.created_at) }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { useThemeStore } from '~/stores/theme'

const config = useRuntimeConfig()
const theme = useThemeStore()
const route = useRoute()

const trackingCode = ref('')
const loading = ref(false)
const error = ref('')
const order = ref<any | null>(null)

const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0)

const formatDate = (value: string) => new Date(value).toLocaleString('es-CL')

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'Preparando',
    in_transit: 'En transito',
    delivered: 'Entregado',
    completed: 'Finalizado',
    cancelled: 'Cancelado',
  }
  return map[status] || status
}

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    preparing: 'bg-amber-100 text-amber-800',
    in_transit: 'bg-sky-100 text-sky-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    completed: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-rose-100 text-rose-800',
  }
  return map[status] || 'bg-slate-100 text-slate-700'
}

const searchTracking = async () => {
  if (!trackingCode.value.trim()) {
    error.value = 'Ingresa un codigo de seguimiento.'
    return
  }
  loading.value = true
  error.value = ''
  order.value = null
  try {
    order.value = await $fetch(`${config.public.apiBase}/orders/track/`, {
      params: { code: trackingCode.value.trim() },
    })
  } catch (err: any) {
    error.value = err?.response?._data?.detail || 'No encontramos ese codigo.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  const prefilled = String(route.query.code || '').trim()
  if (!prefilled) return
  trackingCode.value = prefilled
  await searchTracking()
})
</script>
