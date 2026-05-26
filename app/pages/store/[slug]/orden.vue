<template>
  <div class="min-h-screen bg-white px-4 py-10">
    <div class="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-8 shadow print:shadow-none print:border-0">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-amber-700">Boleta de Compra</h1>
        <button class="hidden print:block" @click="printBoleta">Imprimir</button>
      </div>
      <div v-if="loading" class="text-slate-500">Cargando orden...</div>
      <div v-else-if="error" class="text-red-600">{{ error }}</div>
      <div v-else>
        <div class="mb-4 space-y-1">
          <p class="text-sm text-slate-600 font-bold">Orden #{{ order.id }}</p>
          <p class="text-sm text-slate-600">Fecha: {{ formatDate(order.created_at) }}</p>
          <p class="text-sm text-slate-600">Estado: <span :class="statusClass(order.status)">{{ order.status }}</span></p>
          <p class="text-sm text-slate-600">Tracking: <span v-if="order.tracking_code">{{ order.tracking_code }}</span><span v-else>-</span></p>
        </div>
        <div class="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-700">
          <div>
            <span class="font-semibold">Cliente:</span> {{ order.name || order.customer_name || '-' }}
          </div>
          <div>
            <span class="font-semibold">Email:</span> {{ order.email || order.customer_email || '-' }}
          </div>
          <div>
            <span class="font-semibold">Teléfono:</span> {{ order.phone || '-' }}
          </div>
          <div>
            <span class="font-semibold">Dirección:</span> {{ order.address || '-' }}
          </div>
        </div>
        <table class="w-full mb-6 text-sm border">
          <thead>
            <tr class="bg-amber-50">
              <th class="p-2 text-left">Producto</th>
              <th class="p-2 text-right">Cantidad</th>
              <th class="p-2 text-right">Precio</th>
              <th class="p-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="item.id">
              <td class="p-2">{{ item.product_name }}</td>
              <td class="p-2 text-right">{{ item.quantity }}</td>
              <td class="p-2 text-right">${{ formatMoney(item.price) }}</td>
              <td class="p-2 text-right">${{ formatMoney(Number(item.price) * Number(item.quantity)) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end text-lg font-bold text-amber-700 mb-2">
          Total: ${{ formatMoney(order.total) }}
        </div>
        <div v-if="order.payments && order.payments.length" class="mb-4">
          <h2 class="text-base font-semibold text-slate-800 mb-1">Pago Webpay</h2>
          <div v-for="p in order.payments" :key="p.created_at" class="border rounded-lg p-3 mb-2 bg-slate-50">
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div><span class="font-semibold">Estado:</span> {{ p.status }}</div>
              <div><span class="font-semibold">Monto:</span> ${{ formatMoney(p.amount) }}</div>
              <div><span class="font-semibold">Tipo:</span> {{ p.payment_type_code || '-' }}</div>
              <div><span class="font-semibold">Autorización:</span> {{ p.authorization_code || '-' }}</div>
              <div><span class="font-semibold">Cuotas:</span> {{ p.installments_number || '-' }}</div>
              <div><span class="font-semibold">Tarjeta:</span> **** **** **** {{ p.card_last4 || '-' }}</div>
              <div><span class="font-semibold">Orden Webpay:</span> {{ p.buy_order || '-' }}</div>
              <div><span class="font-semibold">Fecha pago:</span> {{ formatDate(p.created_at) }}</div>
            </div>
          </div>
        </div>
        <div class="mt-8 flex justify-between">
          <button class="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 print:hidden" @click="printBoleta">Imprimir boleta</button>
          <NuxtLink :to="`/store/${slug}`" class="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 print:hidden">Volver a la tienda</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'


const route = useRoute()
const config = useRuntimeConfig()
const order = ref<any>(null)
const loading = ref(true)
const error = ref('')
const slug = route.params.slug

function printBoleta() {
  globalThis.print()
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

const formatMoney = (value: unknown) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

const statusClass = (status: string) => {
  if (status === 'paid') return 'text-green-600'
  if (status === 'pending') return 'text-yellow-600'
  return 'text-slate-600'
}

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    const id = route.query.id
    order.value = await $fetch(`${config.public.apiBase}/orders/${id}/`)
  } catch (e: any) {
    error.value = e?.data?.detail || e?.message || 'No se pudo cargar la orden.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
@media print {
  .print\:hidden { display: none !important; }
  .print\:block { display: block !important; }
  .print\:shadow-none { box-shadow: none !important; }
  .print\:border-0 { border: 0 !important; }
}
</style>
