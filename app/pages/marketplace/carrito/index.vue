<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-5xl space-y-6">
      <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-amber-600">Marketplace</p>
          <h1 class="text-3xl font-bold text-slate-900">Tu carrito</h1>
          <p class="text-slate-600">Productos agregados desde el marketplace (naranja).</p>
        </div>
        <NuxtLink
          to="/marketplace"
          class="rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50"
        >
          Seguir comprando
        </NuxtLink>
      </div>

      <div v-if="!cartReady" class="rounded-2xl border border-dashed border-amber-200 bg-white p-6 text-slate-600">
        Cargando carrito...
      </div>

      <div v-else-if="cart.items.length === 0" class="rounded-2xl border border-dashed border-amber-200 bg-white p-6 text-slate-600">
        Tu carrito está vacío. Agrega productos del marketplace.
      </div>

      <div v-else class="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div class="space-y-3">
          <article
            v-for="item in cart.items"
            :key="item.id"
            class="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm md:flex-row md:items-center"
          >
            <div class="h-24 w-full overflow-hidden rounded-xl bg-slate-100 md:h-24 md:w-28">
              <img :src="item.image || '/logoPW.png'" :alt="item.name" class="h-full w-full object-cover" @error="onImgError($event)" />
            </div>
            <div class="flex-1 space-y-1">
              <p class="text-sm font-semibold text-slate-900">{{ item.name }}</p>
              <p class="text-sm text-slate-600">ID: {{ item.id }}</p>
              <p class="text-base font-bold text-amber-700">${{ formatMoney(item.price) }}</p>
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <label class="text-sm text-slate-600">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  class="w-20 rounded-lg border border-amber-200 px-2 py-1 text-sm"
                  :value="item.quantity"
                  @input="(e) => updateQty(item.id, Number((e.target as HTMLInputElement).value))"
                />
                <button class="text-sm font-semibold text-red-600" @click="cart.removeProduct(item.id)">Eliminar</button>
              </div>
            </div>
          </article>
        </div>

        <aside class="space-y-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold text-slate-700">Productos</p>
            <span class="text-sm text-slate-600">{{ cart.totalItems }}</span>
          </div>
          <div class="flex items-center justify-between text-lg font-bold text-slate-900">
            <span>Total</span>
            <span class="text-amber-700">${{ cart.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="space-y-2 text-xs text-slate-500">
            <p>Este carrito es solo para compras del marketplace. Los carritos de cada tienda siguen separados.</p>
          </div>
          <div v-if="cartSyncNotice" class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {{ cartSyncNotice }}
          </div>
          <div v-if="checkoutError" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {{ checkoutError }}
          </div>
          <button
            class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow"
            :style="{ backgroundColor: '#f59e0b' }"
            @click="checkoutDisabled ? null : handleCheckout()"
            :disabled="checkoutDisabled"
          >
            {{
              loadingCheckout
                ? 'Procesando...'
                : checkoutRetryCooldown > 0
                  ? `Espera ${checkoutRetryCooldown}s`
                  : checkoutDisabled
                    ? 'Completa el carrito'
                    : 'Proceder al pago'
            }}
          </button>
          <button class="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50" @click="cart.clearCart()">
            Vaciar carrito
          </button>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useMarketplaceRequests } from '~/composables/useMarketplaceRequests'

const cart = useCartStore()
const auth = useAuthStore()
const config = useRuntimeConfig()
const { controlledGet, controlledMutation, getBackoffSeconds, getErrorRetryAfterSeconds } = useMarketplaceRequests()
const loadingCheckout = ref(false)
const checkoutError = ref('')
const checkoutRetryCooldown = ref(0)
const cartSyncNotice = ref('')
const cartReady = ref(false)
const defaultPaymentMethod = ref<any | null>(null)
let checkoutRetryTimer: ReturnType<typeof setInterval> | null = null

const stopCheckoutCooldown = () => {
  if (checkoutRetryTimer) {
    clearInterval(checkoutRetryTimer)
    checkoutRetryTimer = null
  }
}

const startCheckoutCooldown = (seconds: number) => {
  stopCheckoutCooldown()
  checkoutRetryCooldown.value = seconds
  checkoutRetryTimer = setInterval(() => {
    if (checkoutRetryCooldown.value <= 1) {
      checkoutRetryCooldown.value = 0
      stopCheckoutCooldown()
      return
    }
    checkoutRetryCooldown.value -= 1
  }, 1000)
}

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  target.onerror = null
  target.src = '/logoPW.png'
}

onMounted(async () => {
  auth.restoreFromCookies()
  await auth.initializeSession().catch(() => null)
  cart.loadFromStorage()
  cart.setContext('marketplace')
  try {
    if (auth.token) {
      const methods = await $fetch<any[]>(`${config.public.apiBase}/payments/profile-methods/`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      defaultPaymentMethod.value = (methods || []).find((m) => m.is_default) || (methods || [])[0] || null
    }
  } catch {
    defaultPaymentMethod.value = null
  }
  await syncCartPrices()
  cartReady.value = true
})

const checkoutDisabled = computed(() => !cartReady.value || cart.items.length === 0 || loadingCheckout.value || checkoutRetryCooldown.value > 0)

const updateQty = (id: number | string, qty: number) => {
  cart.updateQuantity(id, qty)
}

const formatMoney = (value: unknown) => {
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toFixed(2) : '0.00'
}

const syncCartPrices = async () => {
  if (!cart.items.length) return
  let changedPrices = 0

  await Promise.all(
    cart.items.map(async (item) => {
      try {
        const fresh = await controlledGet<any>(
          `marketplace:product:${encodeURIComponent(String(item.id))}`,
          `${config.public.apiBase}/marketplace/products/${encodeURIComponent(String(item.id))}/`,
          { backoffMs: 8_000, minIntervalMs: 300 },
        )

        const nextPrice = Number(fresh?.offer_price || fresh?.price || 0)
        if (Number.isFinite(nextPrice) && nextPrice >= 0 && item.price !== nextPrice) {
          item.price = nextPrice
          changedPrices += 1
        }

        const nextMax = Number(fresh?.stock_available)
        if (Number.isFinite(nextMax)) {
          item.max = nextMax
          if (item.quantity > nextMax) {
            item.quantity = Math.max(1, nextMax)
          }
        }
      } catch {
        // Si no se puede refrescar un item, mantenemos el valor local para no bloquear la compra.
      }
    }),
  )

  cart.saveToStorage()
  cartSyncNotice.value = changedPrices > 0
    ? `Actualizamos ${changedPrices} precio(s) con el valor vigente de la tienda.`
    : ''
}

const handleCheckout = async () => {
  if (cart.items.length === 0) return
  checkoutError.value = ''
  cartSyncNotice.value = ''

  await syncCartPrices()

  const storeSlugs = Array.from(new Set(cart.items.map((item: any) => item.storeSlug || 'marketplace')))
  if (storeSlugs.length > 1) {
    checkoutError.value = 'No puedes pagar productos de distintas tiendas en una sola orden. Separa tu compra por tienda.'
    return
  }
  const targetStoreSlug = storeSlugs[0] || 'marketplace'

  loadingCheckout.value = true
  try {
    // Armar payload para la orden
    const items = cart.items.map(item => ({
      product: item.id,
      quantity: item.quantity
    }))
    // Datos mínimos de cliente (puedes expandir esto si hay formulario)
    const customer = auth.user ? {
      name: defaultPaymentMethod.value?.account_holder_name || auth.user.first_name || auth.user.username || 'Cliente',
      email: defaultPaymentMethod.value?.account_email || auth.user.email || 'cliente@pymeweb.local',
      phone: '000000000',
      address: 'Marketplace',
    } : {
      name: 'Invitado',
      email: 'invitado@pymeweb.local',
      phone: '000000000',
      address: 'Marketplace',
    }
    const payload = {
      items,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    }
    // POST a la API de órdenes del marketplace
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (auth.token) headers.Authorization = `Bearer ${auth.token}`

    const order = await controlledMutation<any>(
      'marketplace:checkout:create-order',
      `${config.public.apiBase}/orders/?store=${encodeURIComponent(targetStoreSlug)}`,
      {
        method: 'POST',
        body: payload,
        headers,
        credentials: 'include',
        backoffMs: 10_000,
      },
    )
    // Si la orden requiere pago, intentar PayPal y usar Webpay como fallback.
    if (order && order.id) {
      try {
        const paypal = await $fetch<{ approve_url?: string; detail?: string }>(
          `${config.public.apiBase}/orders/${order.id}/paypal/init/`,
          {
            method: 'POST',
            credentials: 'include',
            body: {
              return_url: `${window.location.origin}/marketplace/orden?id=${order.id}`,
              cancel_url: `${window.location.origin}/marketplace/carrito`,
            },
            timeout: 6000,
          },
        )

        if (paypal?.approve_url) {
          window.location.href = paypal.approve_url
          return
        }

        const payment = await $fetch<{ url?: string; token?: string }>(`${config.public.apiBase}/orders/${order.id}/webpay/init/`, {
          method: 'POST',
          credentials: 'include',
          timeout: 5000,
        })
        if (payment?.url && payment?.token) {
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
        } else {
          cart.clearCart()
          window.location.href = `/marketplace/orden?id=${order.id}`
        }
      } catch {
        cart.clearCart()
        window.location.href = `/marketplace/orden?id=${order.id}`
      }
    } else {
      alert('No se pudo crear la orden. Intenta nuevamente.')
    }
  } catch (err: any) {
    if (err?.response?.status === 429) {
      const seconds = Math.max(
        10,
        Number(getErrorRetryAfterSeconds(err) || 0),
        getBackoffSeconds('marketplace:checkout:create-order'),
      )
      startCheckoutCooldown(seconds)
      checkoutError.value = `Checkout temporalmente limitado. Espera ${seconds}s e intenta nuevamente.`
    } else {
      const detail = err?.response?._data?.detail || err?.response?._data?.error || err?.message
      checkoutError.value = typeof detail === 'string'
        ? `Error al procesar el checkout: ${detail}`
        : 'Error al procesar el checkout. Intenta nuevamente.'
    }
  } finally {
    loadingCheckout.value = false
  }
}

onBeforeUnmount(() => {
  stopCheckoutCooldown()
})
</script>
