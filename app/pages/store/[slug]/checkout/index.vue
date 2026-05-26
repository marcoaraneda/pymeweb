<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-6xl space-y-8">
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Checkout</p>
          <h1 class="text-3xl font-bold text-slate-900">Finaliza tu compra</h1>
          <p class="text-slate-600">Completa tus datos y revisa el resumen antes de pagar.</p>
        </div>
        <NuxtLink
          v-if="tenantStore.slug"
          :to="`/store/${tenantStore.slug}/carrito`"
          class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
        >
          ← Volver al carrito
        </NuxtLink>
      </div>

      <div v-if="loadingPage" class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">Cargando checkout...</div>

      <div v-else-if="cart.items.length === 0" class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
          Tu carrito está vacío.
        </div>
        <div class="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Método de pago disponible</p>
          <p class="mt-1 text-sm font-bold text-slate-900">{{ paymentMethodOptions[0]?.label || 'Pago manual' }}</p>
          <p class="mt-1 text-sm text-slate-600">{{ storePaymentNote || paymentMethodOptions[0]?.help }}</p>
        </div>
      </div>

      <div v-else class="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-slate-900">Datos del cliente</h2>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Entrega</span>
          </div>

          <div v-if="showWhatsAppCTA" class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            <p class="font-semibold text-emerald-900">¿Prefieres agendar por WhatsApp?</p>
            <p class="mt-1">Número de la tienda: {{ storeWhatsAppDisplay }}</p>
            <a
              v-if="hasStoreWhatsApp"
              :href="storeWhatsAppUrl"
              target="_blank"
              rel="noopener"
              class="mt-2 inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              Agendar pedido por WhatsApp
            </a>
            <p v-else class="mt-2 text-xs text-emerald-700/80">La tienda aún no configuró su número de WhatsApp en la sección de contacto.</p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Nombre completo</label>
              <input v-model="form.name" type="text" class="input" placeholder="Ej: Juan Pérez" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Correo electrónico</label>
              <input v-model="form.email" type="email" class="input" placeholder="tu@correo.com" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Teléfono</label>
              <input v-model="form.phone" type="text" class="input" placeholder="+56 9 1234 5678" />
            </div>
            <div v-if="deliveryMethod === 'delivery'" class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Dirección</label>
              <textarea v-model="form.address" rows="3" class="input" placeholder="Calle, número, comuna, ciudad"></textarea>
            </div>
            <div v-else class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Sucursal para consumo en local</label>
              <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                {{ tenantStore.data?.address || 'Dirección principal de la tienda' }}
              </div>
            </div>
            <p v-if="checkoutPaymentHint" class="text-xs text-emerald-700 md:col-span-2">{{ checkoutPaymentHint }}</p>
          </div>

          <div class="space-y-3">
            <label class="text-sm text-slate-600">Tipo de pedido</label>
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" value="pickup" v-model="deliveryMethod" />
                Comer en local (sin envío)
              </label>
              <label class="flex items-center gap-2 text-sm text-slate-700">
                <input type="radio" value="delivery" v-model="deliveryMethod" />
                Envío a domicilio (costo automático)
                <span v-if="deliveryMethod === 'delivery'" class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">{{ formatClp(shippingCost) }}</span>
              </label>
            </div>
            <p class="text-xs text-slate-500">{{ shippingDetail }}</p>
            <p v-if="isDispatchChargeMode && deliveryMethod === 'delivery'" class="text-xs text-amber-700">El envío se cobra al despacho. El total pagado ahora no incluye envío.</p>
            <label v-if="isDispatchChargeMode && deliveryMethod === 'delivery'" class="inline-flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              <input v-model="dispatchFeeAcknowledged" type="checkbox" class="mt-0.5" />
              Confirmo que pagaré el envío directamente al despacho.
            </label>
          </div>

          <div v-if="deliveryMethod === 'pickup'" class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Pedido para consumir en local. Dirección de referencia: {{ tenantStore.data?.address || 'Sucursal principal' }}.
          </div>

          <div class="space-y-3">
            <label class="text-sm text-slate-600">Método de pago</label>
            <div class="grid gap-2 sm:grid-cols-3">
              <button
                v-for="method in paymentMethodOptions"
                :key="method.value"
                type="button"
                class="rounded-xl border px-3 py-2 text-left text-sm transition"
                :class="selectedPaymentMode === method.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'"
                @click="selectedPaymentMode = method.value"
              >
                <p class="font-semibold">{{ method.label }}</p>
                <p class="text-xs opacity-80">{{ method.help }}</p>
              </button>
            </div>
          </div>
        </section>

        <aside class="space-y-4">
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-slate-900">Resumen del pedido</h3>
              <span class="text-sm text-slate-600">{{ cart.totalItems }} artículos</span>
            </div>

            <div class="divide-y divide-slate-100">
              <div
                v-for="item in cart.items"
                :key="item.id"
                class="flex items-center gap-3 py-3 text-sm text-slate-700"
              >
                <div class="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                  <img :src="item.image || placeholder" :alt="item.name" class="h-full w-full object-cover" />
                </div>
                <div class="flex-1">
                  <p class="font-semibold text-slate-900 line-clamp-1">{{ item.name }}</p>
                  <p class="text-xs text-slate-500">Cantidad: {{ item.quantity }}</p>
                  <p v-if="item.optionsSummary" class="text-xs text-slate-500">{{ item.optionsSummary }}</p>
                </div>
                <p class="font-semibold" :style="{ color: accentColor }">{{ formatClp(item.price * item.quantity) }}</p>
              </div>
            </div>

            <div class="space-y-2 text-sm text-slate-700">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ formatClp(cart.totalPrice) }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Envío</span>
                <span>
                  {{
                    deliveryMethod === 'delivery'
                      ? (isDispatchChargeMode ? `${formatClp(shippingCost || 0)} (al despacho)` : formatClp(shippingCost || 0))
                      : 'Retiro en tienda'
                  }}
                </span>
              </div>
            </div>

            <div class="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{{ formatClp(totalWithShipping) }}</span>
            </div>

            <button
              :disabled="loadingOrder"
              @click="submitOrder(selectedPaymentMode)"
              class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60"
              :style="accentStyle"
            >
              {{ loadingOrder ? loadingPaymentText : payButtonText }}
            </button>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm">
            <p class="font-semibold text-slate-800">Seguridad y soporte</p>
            <p>Pago procesado por pasarela segura (Webpay o PayPal). Ante dudas, contáctanos usando el correo de tu pedido.</p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useCartStore } from '~/stores/cart'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'store' })

const cart = useCartStore()
const tenantStore = useTenantStore()
const theme = useThemeStore()
const auth = useAuthStore()
const config = useRuntimeConfig()
const router = useRouter()

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const loadingPage = ref(true)
const loadingOrder = ref(false)
const checkoutPaymentHint = ref('')
const dispatchFeeAcknowledged = ref(false)
const paymentProfiles = ref<any[]>([])
const paymentPolicyInterval = ref<ReturnType<typeof setInterval> | null>(null)
type PaymentMode = 'webpay' | 'paypal' | 'manual'
const selectedPaymentMode = ref<PaymentMode>('webpay')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
})

const deliveryMethod = ref<'pickup' | 'delivery'>('pickup')
const shippingCost = ref(0)
const shippingDetail = ref('El costo de envío se calcula automáticamente.')

const accentColor = computed(() => theme.accent || '#2563eb')
const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: '#fff' }))
const showWhatsAppCTA = computed(() => {
  const enabled = (tenantStore.data as any)?.whatsapp_sales_enabled
  const hasToggle = enabled === undefined || enabled === null ? true : Boolean(enabled)
  return hasToggle && hasStoreWhatsApp.value
})
const storeWhatsAppRaw = computed(() => String((tenantStore.data as any)?.whatsapp || (tenantStore.data as any)?.phone || '').trim())
const storeWhatsAppDigits = computed(() => storeWhatsAppRaw.value.replace(/[^\d]/g, ''))
const hasStoreWhatsApp = computed(() => storeWhatsAppDigits.value.length > 0)
const storeWhatsAppDisplay = computed(() => storeWhatsAppRaw.value || 'No configurado')
const storeWhatsAppUrl = computed(() => {
  if (!hasStoreWhatsApp.value) return '#'
  const storeName = String((tenantStore.data as any)?.name || 'la tienda')
  const orderLabel = deliveryMethod.value === 'delivery' ? 'delivery' : 'retiro en local'
  const shippingNote = deliveryMethod.value === 'delivery'
    ? `El envío estimado es ${formatClp(shippingCost.value || 0)}.`
    : 'Quiero retirar en local para saltarme la fila.'
  const msg = encodeURIComponent(
    `Hola, quiero agendar un pedido en ${storeName}.\nTipo de pedido: ${orderLabel}.\n${shippingNote}\nTotal estimado: ${formatClp(totalWithShipping.value)}.`
  )
  return `https://wa.me/${storeWhatsAppDigits.value}?text=${msg}`
})
const isDispatchChargeMode = computed(() => String((tenantStore.data as any)?.delivery_fee_mode || 'at_dispatch') === 'at_dispatch')
const shippingBaseFee = computed(() => Number((tenantStore.data as any)?.shipping_base_fee || 0))
const shippingPerItemFee = computed(() => Number((tenantStore.data as any)?.shipping_per_item_fee || 200))
const shippingFreeOver = computed(() => Number((tenantStore.data as any)?.shipping_free_over || 0))
const placeholder = 'https://via.placeholder.com/200x200.png?text=Producto'
const storePaymentMethod = computed<PaymentMode>(() => {
  const raw = String((tenantStore.data as any)?.payment_checkout_method || '').toLowerCase()
  if (raw === 'paypal') return 'paypal'
  if (raw === 'webpay') return 'webpay'
  return 'manual'
})
const storePaymentNote = computed(() =>
  String((tenantStore.data as any)?.payment_checkout_note || '').trim()
)
const paymentMethodOptions = computed(() => {
  if (storePaymentMethod.value === 'paypal') {
    return [{ value: 'paypal' as PaymentMode, label: 'PayPal', help: 'Método habilitado por la tienda.' }]
  }
  if (storePaymentMethod.value === 'webpay') {
    return [{ value: 'webpay' as PaymentMode, label: 'Webpay', help: 'Tarjeta crédito/débito habilitada por la tienda.' }]
  }
  return [{ value: 'manual' as PaymentMode, label: 'Pago manual', help: 'La tienda no tiene pasarela online habilitada.' }]
})

const refreshStorePaymentPolicy = async () => {
  if (!slug.value) return
  try {
    await tenantStore.fetchTienda()
    selectedPaymentMode.value = storePaymentMethod.value
    if (storePaymentNote.value) {
      checkoutPaymentHint.value = storePaymentNote.value
    }
  } catch {
    // Evitamos bloquear checkout por errores transitorios de refresh.
  }
}

const onPaymentPolicyStorage = (event: StorageEvent) => {
  if (event.key !== 'store-payment-policy-updated' || !event.newValue) return
  try {
    const payload = JSON.parse(event.newValue)
    if (String(payload?.slug || '') === String(slug.value || '')) {
      refreshStorePaymentPolicy()
    }
  } catch {
    // Ignorar payload inválido.
  }
}

const startPaymentPolicySync = () => {
  if (!import.meta.client) return
  window.addEventListener('storage', onPaymentPolicyStorage)
  if (paymentPolicyInterval.value) clearInterval(paymentPolicyInterval.value)
  paymentPolicyInterval.value = setInterval(() => {
    refreshStorePaymentPolicy()
  }, 15000)
}

const stopPaymentPolicySync = () => {
  if (!import.meta.client) return
  window.removeEventListener('storage', onPaymentPolicyStorage)
  if (!paymentPolicyInterval.value) return
  clearInterval(paymentPolicyInterval.value)
  paymentPolicyInterval.value = null
}
watch(
  () => storePaymentMethod.value,
  (method) => {
    selectedPaymentMode.value = method
  },
  { immediate: true }
)
const payButtonText = computed(() => {
  if (selectedPaymentMode.value === 'webpay') return 'Pagar con Webpay'
  if (selectedPaymentMode.value === 'paypal') return 'Pagar con PayPal'
  return 'Completar pedido sin pasarela'
})
const loadingPaymentText = computed(() => {
  if (selectedPaymentMode.value === 'webpay') return 'Redirigiendo…'
  if (selectedPaymentMode.value === 'paypal') return 'Conectando PayPal…'
  return 'Procesando…'
})
const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0)

const inferZone = (text: string) => {
  const normalized = String(text || '').toLowerCase()
  const centerHints = ['santiago', 'providencia', 'nunoa', 'ñuñoa', 'las condes', 'vitacura', 'la reina', 'macul', 'estacion central']
  const northSouthHints = ['maipu', 'maipú', 'puente alto', 'la florida', 'san miguel', 'huechuraba', 'quilicura', 'la cisterna', 'independencia']
  if (centerHints.some((hint) => normalized.includes(hint))) return 'center'
  if (northSouthHints.some((hint) => normalized.includes(hint))) return 'metro'
  return 'outer'
}

const zoneCost = (fromZone: string, toZone: string) => {
  const matrix: Record<string, Record<string, number>> = {
    center: { center: 1800, metro: 2800, outer: 4200 },
    metro: { center: 2600, metro: 3200, outer: 4700 },
    outer: { center: 3800, metro: 4300, outer: 5600 },
  }
  return matrix[fromZone]?.[toZone] ?? 4800
}

const resolveBranches = () => {
  const data: any = tenantStore.data || {}
  const branches = Array.isArray(data.branch_locations) ? data.branch_locations : []
  const normalized = branches
    .map((branch: any) => {
      const zone = inferZone(branch?.zone || branch?.address || '')
      return {
        label: branch?.label || 'Sucursal',
        zone,
        address: branch?.address || '',
      }
    })
    .filter((branch: any) => branch.address || branch.zone)
  if (normalized.length) return normalized
  return [
    {
      label: 'Casa matriz',
      zone: inferZone(data?.address || ''),
      address: data?.address || '',
    },
  ]
}

const computeShipping = () => {
  if (deliveryMethod.value === 'pickup') return 0
  const customerZone = inferZone(form.address)
  const branches = resolveBranches()
  const best = branches
    .map((branch: any) => ({
      ...branch,
      cost: zoneCost(branch.zone, customerZone),
    }))
    .sort((a: any, b: any) => a.cost - b.cost)[0]

  const perItem = Math.min(cart.totalItems * Math.max(0, shippingPerItemFee.value || 0), 2200)
  const bulkyFee = cart.totalPrice >= 120000 ? 800 : 0
  const subtotalDiscount = shippingFreeOver.value > 0 && cart.totalPrice >= shippingFreeOver.value ? 999999 : 0
  const base = Math.max(0, shippingBaseFee.value || Number(best?.cost || 3200))
  const estimated = Math.max(0, base + perItem + bulkyFee - subtotalDiscount)
  shippingDetail.value = `Estimado desde ${best?.label || 'sucursal'} (${best?.address || 'dirección principal'}) hacia tu zona.`
  return estimated
}
const totalWithShipping = computed(() => {
  const extra = deliveryMethod.value === 'delivery' && !isDispatchChargeMode.value ? computeShipping() : 0
  return Math.max(0, cart.totalPrice + extra)
})

onMounted(async () => {
  try {
    cart.setContext(slug.value)
    cart.loadFromStorage()
    tenantStore.setSlug(slug.value)
    if (!tenantStore.data) {
      await tenantStore.fetchTienda()
    }
    startPaymentPolicySync()
    theme.loadFromStorage()
    theme.applyStoreTheme(slug.value)

    selectedPaymentMode.value = storePaymentMethod.value
    if (storePaymentNote.value) {
      checkoutPaymentHint.value = storePaymentNote.value
    }

    try {
      if (auth.token) {
        const methods = await $fetch<any[]>(`${config.public.apiBase}/payments/profile-methods/`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        paymentProfiles.value = methods || []
        const preferred = (methods || []).find((m) => m.is_default) || (methods || [])[0]
        if (preferred) {
          if (!form.email && preferred.account_email) form.email = preferred.account_email
          if (!form.name && preferred.account_holder_name) form.name = preferred.account_holder_name
          const provider = String(preferred.provider || '').toLowerCase()
          const preferredMode: PaymentMode = provider === 'paypal' ? 'paypal' : (provider === 'webpay' || provider === 'transbank' || provider === 'card' ? 'webpay' : 'manual')
          if (preferredMode === storePaymentMethod.value) {
            selectedPaymentMode.value = preferredMode
            checkoutPaymentHint.value = preferred.provider === 'paypal'
              ? `Autocompletado con ${preferred.label || 'PayPal'} (${preferred.account_email || ''}).`
              : `Autocompletado con ${preferred.label || 'tarjeta'} (**** ${preferred.card_last4 || '----'}).`
          }
        }
      }
    } catch {
      if (!storePaymentNote.value) checkoutPaymentHint.value = ''
    }

    shippingCost.value = computeShipping()
  } catch (e) {
    console.error('Error cargando tienda', e)
  } finally {
    loadingPage.value = false
  }
})

onBeforeUnmount(() => {
  stopPaymentPolicySync()
})

watch(deliveryMethod, (val) => {
  if (val === 'pickup') {
    shippingCost.value = 0
    shippingDetail.value = 'Retiro en tienda seleccionado. No se cobra envío.'
    dispatchFeeAcknowledged.value = false
  } else {
    shippingCost.value = computeShipping()
  }
})

watch(
  () => [form.address, cart.totalItems, cart.totalPrice, tenantStore.data?.branch_locations, tenantStore.data?.address],
  () => {
    if (deliveryMethod.value === 'delivery') {
      shippingCost.value = computeShipping()
    }
  },
  { deep: true }
)

const validateForm = () => {
  if (!form.name || !form.email || !form.phone) {
    window.alert('Completa nombre, correo y teléfono para continuar.')
    return false
  }
  if (deliveryMethod.value === 'delivery' && !form.address) {
    window.alert('Agrega dirección para envío a domicilio.')
    return false
  }
  if (deliveryMethod.value === 'delivery' && isDispatchChargeMode.value && !dispatchFeeAcknowledged.value) {
    window.alert('Debes confirmar que pagarás el envío al despacho para continuar.')
    return false
  }
  return true
}

const buildOrderPayload = () => ({
  store: tenantStore.data?.id,
  name: form.name,
  email: form.email,
  phone: form.phone,
  address:
    deliveryMethod.value === 'delivery'
      ? `${form.address} [ENVIO_${isDispatchChargeMode.value ? 'COBRO_AL_DESPACHO' : 'COBRO_EN_CHECKOUT'} ESTIMADO:${shippingCost.value}]`
      : `[CONSUMO_EN_LOCAL] ${tenantStore.data?.address || 'Sucursal principal'}`,
  total: totalWithShipping.value,
  items: cart.items.map((item) => ({
    product: item.productId || item.id,
    quantity: item.quantity,
    price: item.price,
    options_summary: item.optionsSummary || '',
    combo_config: item.comboConfig || {},
    addons: item.addons || [],
  })),
})

const submitOrder = async (mode: 'webpay' | 'paypal' | 'manual') => {
  if (!tenantStore.data || cart.items.length === 0 || loadingOrder.value) return
  if (!paymentMethodOptions.value.some((opt) => opt.value === mode)) {
    window.alert('El método de pago seleccionado no está habilitado para esta tienda.')
    return
  }
  if (!validateForm()) return

  loadingOrder.value = true

  try {
    const order = await $fetch<{ id: number }>(`${config.public.apiBase}/orders/`, {
      method: 'POST',
      params: { store: tenantStore.slug },
      body: buildOrderPayload(),
    })

    if (mode === 'manual') {
      cart.clearCart()
      router.push(`/store/${tenantStore.slug}/success?order=${order.id}`)
      return
    }

    if (mode === 'webpay') {
      const payment = await $fetch<{ url?: string; token?: string; enabled?: boolean; detail?: string }>(
        `${config.public.apiBase}/orders/${order.id}/webpay/init/`,
        { method: 'POST' }
      )

      if (payment && payment.url && payment.token) {
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
        return
      }

      if (payment?.detail) {
        window.alert(payment.detail)
      }
      cart.clearCart()
      router.push(`/store/${tenantStore.slug}/success?order=${order.id}`)
      return
    }

    if (mode === 'paypal') {
      const payment = await $fetch<{ approve_url?: string; order_id?: string; enabled?: boolean; detail?: string }>(
        `${config.public.apiBase}/orders/${order.id}/paypal/init/`,
        {
          method: 'POST',
          body: {
            return_url: `${window.location.origin}/store/${tenantStore.slug}/success?order=${order.id}`,
            cancel_url: `${window.location.origin}/store/${tenantStore.slug}/checkout`,
          },
        }
      )

      if (payment?.approve_url) {
        window.location.href = payment.approve_url
        return
      }

      if (payment?.detail) {
        window.alert(payment.detail)
      }
      cart.clearCart()
      router.push(`/store/${tenantStore.slug}/success?order=${order.id}`)
    }
  } catch (e: any) {
    const detail = e?.response?._data || 'Error al procesar el pedido'
    console.error('Error en checkout', detail)
    alert(typeof detail === 'string' ? detail : JSON.stringify(detail))
  } finally {
    loadingOrder.value = false
  }
}
</script>

<style scoped>
.input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.85rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  transition: all 0.15s ease;
}
.input:focus {
  border-color: var(--accent, #2563eb);
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
</style>
