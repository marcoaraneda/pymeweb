<template>
  <div class="max-w-3xl mx-auto py-10">

    <h1 class="text-3xl font-bold text-green-600 mb-6">
      ¡Pedido confirmado! 🎉
    </h1>

    <div v-if="loading" class="text-gray-500">
      Cargando pedido...
    </div>

    <div v-else-if="!order" class="text-red-500">
      No se pudo cargar el pedido.
    </div>

    <div v-else class="bg-white rounded-xl shadow p-6 space-y-6">

      <div>
        <p><strong>Pedido Nº:</strong> {{ order.id }}</p>
        <p><strong>Fecha:</strong> {{ formatDate(order.created_at) }}</p>
      </div>

      <hr />

      <div>
        <h2 class="font-semibold text-lg mb-2">Datos del cliente</h2>
        <p>{{ order.name }}</p>
        <p>{{ order.email }}</p>
        <p>{{ order.phone }}</p>
        <p>{{ order.address }}</p>
      </div>

      <hr />

      <div>
        <h2 class="font-semibold text-lg mb-2">Productos</h2>

        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between text-sm py-1"
        >
          <span>
            {{ item.product_name }} x {{ item.quantity }}
          </span>
          <span>
            ${{ item.price * item.quantity }}
          </span>
        </div>
      </div>

      <hr />

      <div class="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>${{ order.total }}</span>
      </div>

      <NuxtLink
        :to="`/store/${slug}`"
        class="block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500"
      >
        Volver a la tienda
      </NuxtLink>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

interface OrderItem {
  id: number
  product: number
  product_name: string
  quantity: number
  price: number
}

interface Order {
  id: number
  name: string
  email: string
  phone: string
  address: string
  total: number
  status: string
  created_at: string
  items: OrderItem[]
}

const route = useRoute()
const slug = route.params.slug as string
const orderId = route.params.id as string | undefined

const order = ref<Order | null>(null)
const loading = ref(true)

onMounted(async () => {
  if (!orderId) {
    loading.value = false
    return
  }

  try {
    const response = await $fetch<Order>(
      `http://127.0.0.1:8000/api/orders/${orderId}/`
    )
    order.value = response
  } catch (e) {
    console.error('Error cargando pedido', e)
  } finally {
    loading.value = false
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleString()
}
</script>

