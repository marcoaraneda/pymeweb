<template>
  <div class="min-h-screen bg-slate-50 px-4 py-12">
    <div class="mx-auto max-w-3xl">
      <div v-if="loading" class="text-center text-slate-500">Cargando pedido...</div>

      <div v-else-if="order" class="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100">
        <div class="flex items-start justify-between border-b border-dashed border-slate-200 px-8 py-6">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Boleta electrónica</p>
            <h1 class="text-2xl font-bold text-slate-900">Pedido #{{ order.id }}</h1>
            <p class="text-sm text-slate-500">{{ orderDate }}</p>
            <p class="text-xs text-slate-500">Tracking: {{ order.tracking_code }}</p>
          </div>
          <span :class="['rounded-full px-4 py-1 text-xs font-semibold', statusBadge(order.status).classes]">
            {{ statusBadge(order.status).label }}
          </span>
        </div>

        <div v-if="paymentNotice" class="mx-8 mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {{ paymentNotice }}
        </div>

        <div class="grid gap-6 px-8 py-6 md:grid-cols-2">
          <div class="space-y-3">
            <h2 class="text-sm font-semibold text-slate-700">Datos del comprador</h2>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Nombre:</span> {{ order.name }}</p>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Email:</span> {{ order.email }}</p>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Teléfono:</span> {{ order.phone }}</p>
            <p class="text-sm text-slate-700"><span class="text-slate-500">Dirección:</span> {{ order.address }}</p>
          </div>

          <div class="space-y-3">
            <h2 class="text-sm font-semibold text-slate-700">Tienda</h2>
            <p class="text-sm text-slate-700">{{ tenantStore.data?.name || 'Tu tienda' }}</p>
            <p class="text-xs text-slate-500">{{ tenantStore.data?.email }}</p>
            <p class="text-xs text-slate-500">{{ tenantStore.data?.address }}</p>
          </div>
        </div>

        <div class="border-y border-dashed border-slate-200 bg-slate-50/70 px-8 py-6">
          <h3 class="mb-4 text-sm font-semibold text-slate-700">Detalle de productos</h3>
          <div class="divide-y divide-slate-200">
            <div v-for="item in order.items" :key="item.id" class="grid grid-cols-[1fr,80px,80px] items-center gap-3 py-3 text-sm text-slate-700">
              <div>
                <p class="font-semibold text-slate-900">{{ item.product_name }}</p>
                <p class="text-xs text-slate-500">Cant. {{ item.quantity }}</p>
                <p v-if="item.options_summary" class="text-xs text-slate-500">{{ item.options_summary }}</p>
                <p v-else-if="item.addons?.length" class="text-xs text-slate-500">Agregados: {{ item.addons.map((a: any) => a?.name).filter(Boolean).join(', ') }}</p>
              </div>
              <p class="text-right text-slate-600">{{ currency(item.price) }}</p>
              <p class="text-right font-semibold text-slate-900">{{ currency(item.price * item.quantity) }}</p>
            </div>
          </div>
        </div>

        <div class="px-8 py-6 space-y-3">
          <div class="flex justify-between text-sm text-slate-700">
            <span>Subtotal</span>
            <span>{{ currency(subtotal) }}</span>
          </div>
          <div class="flex justify-between text-sm text-slate-500">
            <span>Impuestos / envío</span>
            <span>Incluidos en total</span>
          </div>
          <div class="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
            <span>Total pagado</span>
            <span>{{ currency(order.total) }}</span>
          </div>
        </div>

        <div class="flex items-center justify-between border-t border-dashed border-slate-200 bg-slate-50 px-8 py-5">
          <div class="text-xs text-slate-500">Gracias por tu compra. Recibirás un correo con el detalle.</div>
          <NuxtLink :to="`/store/${slug}`" class="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow" :style="accentStyle">
            Volver a la tienda
          </NuxtLink>
        </div>
      </div>

      <div v-else class="text-center text-red-500">Pedido no encontrado</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'

const route = useRoute()
const config = useRuntimeConfig()
const tenantStore = useTenantStore()
const theme = useThemeStore()

const slug = computed(() => route.params.slug as string)
const orderId = computed(() => route.query.order as string | undefined)
const paypalToken = computed(() => route.query.token as string | undefined)

const order = ref<any>(null)
const loading = ref(true)
const paymentNotice = ref('')

const currency = (value: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(Number(value) || 0)

const orderDate = computed(() => {
  if (!order.value?.created_at) return ''
  return new Date(order.value.created_at).toLocaleString('es-CL')
})

const subtotal = computed(() => {
  if (!order.value?.items) return 0
  return order.value.items.reduce(
    (acc: number, item: any) => acc + Number(item.price || 0) * Number(item.quantity || 0),
    0
  )
})

const accentStyle = computed(() => ({ backgroundColor: theme.accent || '#2563eb', color: '#fff' }))

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

onMounted(async () => {
  try {
    tenantStore.setSlug(slug.value)
    theme.loadFromStorage()
    theme.applyStoreTheme(slug.value)
    if (!orderId.value) return

    if (paypalToken.value) {
      try {
        const capture = await $fetch<any>(`${config.public.apiBase}/orders/${orderId.value}/paypal/capture/`, {
          method: 'POST',
          body: { paypal_order_id: paypalToken.value },
          credentials: 'include',
        })
        if (capture?.ok) {
          paymentNotice.value = capture?.already_captured
            ? 'Pago PayPal confirmado anteriormente.'
            : 'Pago PayPal confirmado correctamente.'
        } else {
          paymentNotice.value = 'No se pudo confirmar el pago PayPal. Revisa el estado de tu pedido.'
        }
      } catch {
        paymentNotice.value = 'No se pudo confirmar el pago PayPal. Revisa el estado de tu pedido.'
      }
    }

    order.value = await $fetch(`${config.public.apiBase}/orders/${orderId.value}/`)
  } catch (e) {
    order.value = null
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.dash-border {
  border-style: dashed;
}
</style>
