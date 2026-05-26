<template>
  <div class="max-w-3xl mx-auto py-16">

    <div v-if="loading" class="text-center text-gray-500">
      Cargando pedido...
    </div>

    <div v-else-if="order" class="bg-white shadow rounded-2xl p-8">

      <h1 class="text-3xl font-bold text-green-600 mb-2">
        ¡Compra realizada con éxito! 🎉
      </h1>

      <p class="text-gray-600 mb-6">
        Pedido #{{ order.id }}
      </p>

      <!-- DATOS CLIENTE -->
      <div class="border rounded-xl p-4 mb-6">
        <h2 class="font-semibold mb-2">Datos del cliente</h2>
        <p><strong>Nombre:</strong> {{ order.name }}</p>
        <p><strong>Email:</strong> {{ order.email }}</p>
        <p><strong>Teléfono:</strong> {{ order.phone }}</p>
        <p><strong>Dirección:</strong> {{ order.address }}</p>
      </div>

      <!-- ITEMS -->
      <div class="border rounded-xl p-4 mb-6">
        <h2 class="font-semibold mb-4">Productos</h2>

        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between border-b py-2 last:border-none"
        >
          <div>
            <p class="font-medium">{{ item.product_name }}</p>
            <p class="text-sm text-gray-500">
              Cantidad: {{ item.quantity }}
            </p>
          </div>

          <p class="font-semibold">
            ${{ item.price }}
          </p>
        </div>
      </div>

      <!-- TOTAL -->
      <div class="flex justify-between text-xl font-bold mb-6">
        <span>Total</span>
        <span>${{ order.total }}</span>
      </div>

      <NuxtLink
        :to="`/store/${slug}`"
        class="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500"
      >
        Volver a la tienda
      </NuxtLink>

    </div>

    <div v-else class="text-center text-red-500">
      Pedido no encontrado
    </div>

  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const slug = route.params.slug as string
const orderId = route.query.order

const order = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    order.value = await $fetch(
      `http://127.0.0.1:8000/api/orders/${orderId}/`
    )
  } catch (e) {
    order.value = null
  } finally {
    loading.value = false
  }
})
</script>
