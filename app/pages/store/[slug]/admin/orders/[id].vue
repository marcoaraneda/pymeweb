<template>
  <div class="max-w-4xl mx-auto py-10">
    <NuxtLink
      :to="`/store/${slug}/admin/orders`"
      class="text-blue-600 hover:underline mb-6 inline-block"
    >
      ← Volver
    </NuxtLink>

    <h1 class="text-3xl font-bold mb-6">
      Pedido #{{ order?.id }}
    </h1>

    <div v-if="loading" class="text-gray-500">
      Cargando pedido...
    </div>

    <div v-else-if="!order" class="text-red-500">
      Pedido no encontrado
    </div>

    <div v-else class="bg-white p-6 rounded-xl shadow space-y-6">

      <div>
        <p><strong>Cliente:</strong> {{ order.name }}</p>
        <p><strong>Email:</strong> {{ order.email }}</p>
        <p><strong>Teléfono:</strong> {{ order.phone }}</p>
        <p><strong>Dirección:</strong> {{ order.address }}</p>
      </div>

      <hr />

      <div>
        <h2 class="font-semibold mb-2">Productos</h2>

        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between text-sm py-1"
        >
          <span>{{ item.product_name }} x {{ item.quantity }}</span>
          <span>${{ item.price * item.quantity }}</span>
        </div>
      </div>

      <hr />

      <div class="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>${{ order.total }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from '#app'

const route = useRoute()
const slug = route.params.slug as string
const id = route.params.id as string

const order = ref<any>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    order.value = await $fetch(
      `http://127.0.0.1:8000/api/orders/${id}/`
    )
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>
