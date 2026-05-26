<template>
  <div class="max-w-4xl mx-auto px-4 py-10">

    <!-- TÍTULO -->
    <h1 class="text-3xl font-bold text-blue-700 mb-8">
      Checkout
    </h1>

    <!-- CARGANDO -->
    <div v-if="loadingPage" class="text-gray-500">
      Cargando checkout...
    </div>

    <!-- CARRITO VACÍO -->
    <div v-else-if="cart.items.length === 0" class="text-gray-500">
      Tu carrito está vacío.
    </div>

    <!-- CHECKOUT -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">

      <!-- DATOS CLIENTE -->
      <div class="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 class="text-xl font-semibold text-blue-600">
          Datos del cliente
        </h2>

        <input v-model="form.name" type="text" placeholder="Nombre completo" class="input" />
        <input v-model="form.email" type="email" placeholder="Correo electrónico" class="input" />
        <input v-model="form.phone" type="text" placeholder="Teléfono" class="input" />
        <textarea v-model="form.address" placeholder="Dirección" rows="3" class="input" />
      </div>

      <!-- RESUMEN -->
      <div class="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 class="text-xl font-semibold text-blue-600">
          Resumen del pedido
        </h2>

        <div
          v-for="item in cart.items"
          :key="item.id"
          class="flex justify-between text-sm"
        >
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>${{ item.price * item.quantity }}</span>
        </div>

        <hr />

        <div class="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${{ cart.totalPrice }}</span>
        </div>

        <button
          :disabled="loadingOrder"
          @click="confirmOrder"
          class="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500 disabled:opacity-50"
        >
          {{ loadingOrder ? 'Redirigiendo a Webpay...' : 'Pagar con Webpay' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '~/stores/cart'
import { useTenantStore } from '~/stores/tenant'

/* STORES */
const cart = useCartStore()
const tenantStore = useTenantStore()

/* ROUTE */
const route = useRoute()
const slug = computed(() => route.params.slug as string)

/* STATE */
const loadingPage = ref(true)
const loadingOrder = ref(false)

/* FORM */
const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: ''
})

/* LOAD STORE */
onMounted(async () => {
  try {
    tenantStore.setSlug(slug.value)
    if (!tenantStore.data) {
      await tenantStore.fetchTienda()
    }
  } catch (e) {
    console.error('Error cargando tienda', e)
  } finally {
    loadingPage.value = false
  }
})

/* CONFIRMAR + WEBPAY */
const confirmOrder = async () => {
  if (!tenantStore.data || cart.items.length === 0) return

  loadingOrder.value = true

  try {
    /* 1️⃣ CREAR PEDIDO */
    const order = await $fetch<{ id: number }>(
      'http://127.0.0.1:8000/api/orders/',
      {
        method: 'POST',
        body: {
          store: tenantStore.data.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          total: cart.totalPrice,
          items: cart.items.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    )

    /* 2️⃣ INICIAR WEBPAY */
    const payment = await $fetch<{ url: string; token: string }>(
      'http://127.0.0.1:8000/api/payments/webpay/init/',
      {
        method: 'POST',
        body: {
          order_id: order.id
        }
      }
    )

    /* 3️⃣ FORM POST REAL (OBLIGATORIO) */
    const formWebpay = document.createElement('form')
    formWebpay.method = 'POST'
    formWebpay.action = payment.url

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'token_ws'
    input.value = payment.token

    formWebpay.appendChild(input)
    document.body.appendChild(formWebpay)

    formWebpay.submit()

  } catch (e) {
    console.error('Error en checkout', e)
    alert('Error al iniciar el pago')
    loadingOrder.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.6rem 1rem;
}
.input:focus {
  border-color: #3b82f6;
  outline: none;
}
</style>
