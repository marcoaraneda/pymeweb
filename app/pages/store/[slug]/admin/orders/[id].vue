<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div
      v-if="toastMessage"
      :class="[
        'fixed right-4 top-4 z-50 w-72 rounded-lg border px-4 py-3 text-sm shadow-lg shadow-slate-200/60 transition duration-300',
        toastType === 'success'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
          : 'border-red-200 bg-red-50 text-red-800'
      ]"
      role="status"
      aria-live="polite"
    >
      {{ toastMessage }}
    </div>

    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <NuxtLink :to="`/store/${slug}/admin/orders`" class="text-sm font-semibold text-slate-600 hover:text-slate-900">← Volver a pedidos</NuxtLink>
        <NuxtLink :to="`/store/${slug}/success?order=${id}`" class="text-sm text-blue-600 hover:underline">Ver boleta/seguimiento</NuxtLink>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white/80 shadow-lg ring-1 ring-slate-100">
        <div class="flex flex-col gap-4 border-b border-dashed border-slate-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Pedido</p>
            <h1 class="text-3xl font-bold text-slate-900">#{{ order?.id }}</h1>
            <p class="text-sm text-slate-500">{{ formatDate(order?.created_at) }}</p>
            <p class="text-xs text-slate-500">Tracking: {{ order?.tracking_code }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <span :class="['rounded-full px-3 py-1 text-xs font-semibold', statusBadge(order?.status).classes]">
              {{ statusBadge(order?.status).label }}
            </span>
            <select v-model="selectedStatus" class="rounded-lg border border-slate-200 px-3 py-2 text-sm" @change="updateStatus">
              <option v-for="status in statusOptions" :key="status.value" :value="status.value">{{ status.label }}</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="px-6 py-6 text-slate-500">Cargando pedido...</div>
        <div v-else-if="!order" class="px-6 py-6 text-red-500">Pedido no encontrado</div>

        <div v-else class="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr,0.9fr]">
          <section class="rounded-xl border border-slate-100 bg-slate-50/60 p-5 space-y-3">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Datos del cliente</h2>
              <p class="text-xs text-slate-500">{{ order.email }}</p>
            </div>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Nombre:</span> {{ order.name }}</p>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Teléfono:</span> {{ order.phone }}</p>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Dirección:</span> {{ order.address }}</p>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Estado actual:</span> {{ statusBadge(order.status).label }}</p>
          </section>

          <section class="rounded-xl border border-slate-100 bg-slate-50/60 p-5 space-y-4">
            <h2 class="text-lg font-semibold text-slate-900">Detalle</h2>
            <div class="divide-y divide-slate-100">
              <div v-for="item in order.items" :key="item.id" class="flex items-center justify-between py-3 text-sm text-slate-700">
                <div>
                  <p class="font-semibold text-slate-900">{{ item.product_name }}</p>
                  <p class="text-xs text-slate-500">Cant. {{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-slate-900">{{ currency(item.price * item.quantity) }}</p>
              </div>
            </div>
            <div class="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{{ currency(order.total) }}</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'

definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true })

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()
const tenantStore = useTenantStore()
const slug = route.params.slug as string
const id = route.params.id as string

const order = ref<any>(null)
const loading = ref(true)
const selectedStatus = ref('')
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
let toastTimeout: ReturnType<typeof setTimeout> | null = null

const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'delivered', label: 'Llegó a destino' },
  { value: 'completed', label: 'Finalizado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const currency = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(Number(value) || 0)

const statusBadge = (status?: string) => {
  const map: Record<string, { label: string; classes: string }> = {
    pending: { label: 'Pendiente', classes: 'bg-amber-100 text-amber-700' },
    preparing: { label: 'Preparando', classes: 'bg-blue-100 text-blue-700' },
    in_transit: { label: 'En tránsito', classes: 'bg-indigo-100 text-indigo-700' },
    delivered: { label: 'Llegó a destino', classes: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Finalizado', classes: 'bg-slate-200 text-slate-800' },
    cancelled: { label: 'Cancelado', classes: 'bg-red-100 text-red-700' },
  }
  return map[status || ''] || { label: status || '', classes: 'bg-slate-100 text-slate-700' }
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toastMessage.value = ''
  }, 2800)
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

const loadOrder = async () => {
  loading.value = true
  try {
    order.value = await authedFetch(`${config.public.apiBase}/orders/${id}/`)
    selectedStatus.value = order.value?.status || 'pending'
  } catch (e) {
    console.error('Error cargando pedido', e)
    order.value = null
  } finally {
    loading.value = false
  }
}

const updateStatus = async () => {
  if (!selectedStatus.value) return
  try {
    await authedFetch(`${config.public.apiBase}/orders/${id}/`, {
      method: 'PATCH',
      body: { status: selectedStatus.value },
    })
    if (order.value) {
      order.value.status = selectedStatus.value
    }
    showToast('Estado actualizado', 'success')
  } catch (e) {
    console.error('Error actualizando estado', e)
    showToast('No se pudo actualizar el estado', 'error')
  }
}

onMounted(async () => {
  auth.restoreFromCookies()
  if (auth.token && !auth.user) {
    await auth.fetchProfile()
  }
  tenantStore.setSlug(slug)
  await loadOrder()
})

watch(
  () => route.params.id,
  async () => {
    await loadOrder()
  }
)

const formatDate = (date?: string) => (date ? new Date(date).toLocaleString('es-CL') : '')

onBeforeUnmount(() => {
  if (toastTimeout) clearTimeout(toastTimeout)
})
</script>
