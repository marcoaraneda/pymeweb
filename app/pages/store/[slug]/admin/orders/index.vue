<template>
  <div class="max-w-6xl mx-auto py-10">
    <h1 class="text-3xl font-bold text-blue-700 mb-8">
      Pedidos
    </h1>

    <div v-if="loading" class="text-gray-500">
      Cargando pedidos...
    </div>

    <div v-else-if="orders.length === 0" class="text-gray-500">
      No hay pedidos aún.
    </div>

    <table
      v-else
      class="w-full bg-white rounded-xl shadow overflow-hidden"
    >
      <thead class="bg-slate-100 text-left text-sm">
        <tr>
          <th class="p-4">ID</th>
          <th class="p-4">Cliente</th>
          <th class="p-4">Total</th>
          <th class="p-4">Estado</th>
          <th class="p-4">Fecha</th>
          <th class="p-4"></th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="order in orders"
          :key="order.id"
          class="border-t text-sm"
        >
          <td class="p-4 font-medium">#{{ order.id }}</td>
          <td class="p-4">{{ order.name }}</td>
          <td class="p-4">${{ order.total }}</td>
          <td class="p-4">
            <span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700">
              {{ order.status }}
            </span>
          </td>
          <td class="p-4">{{ formatDate(order.created_at) }}</td>
          <td class="p-4 text-right">
            <NuxtLink
              :to="`/store/${slug}/admin/orders/${order.id}`"
              class="text-blue-600 hover:underline"
            >
              Ver
            </NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from '#app'

interface Order {
  id: number
  name: string
  total: number
  status: string
  created_at: string
}

const route = useRoute()
const slug = route.params.slug as string

const orders = ref<Order[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    orders.value = await $fetch(
      'http://127.0.0.1:8000/api/orders/',
      { params: { store: slug } }
    )
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString()
</script>
