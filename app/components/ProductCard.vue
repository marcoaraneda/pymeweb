<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-br from-white via-slate-50 to-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.3)]"
    :class="[
      isMarketplace ? 'border-[#0f274f]/10' : 'border-slate-200',
      highlightBuy ? 'border-rose-300/70 shadow-[0_12px_30px_-16px_rgba(244,63,94,0.55)] hover:shadow-[0_20px_36px_-14px_rgba(244,63,94,0.7)]' : '',
    ]"
    :style="{ backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95)), radial-gradient(circle at top, ${accentColor}12, transparent 45%)` }"
  >
    <div class="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
      <div class="absolute -right-16 top-0 h-40 w-40 rounded-full blur-3xl" :style="{ background: `${accentColor}14` }" />
      <div class="absolute -left-12 bottom-0 h-28 w-28 rounded-full blur-3xl" :style="{ background: `${accentColor}10` }" />
    </div>

    <div
      v-if="!isMarketplace"
      class="absolute left-0 top-0 h-full w-2 rounded-r-full"
      :style="{ background: `linear-gradient(to bottom, ${accentColor}f0 0%, ${accentColor}cc 38%, ${accentColor}66 72%, transparent 100%)`, zIndex: 2 }"
      aria-hidden="true"
    />
    <div
      v-else
      class="absolute left-0 top-0 h-full w-2 rounded-r-full bg-gradient-to-b from-amber-300 via-amber-400 to-transparent"
      style="z-index:2;"
      aria-hidden="true"
    />

    <button
      v-if="canManage"
      type="button"
      class="absolute right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/95 text-lg font-semibold text-slate-700 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:bg-white"
      :class="hasDiscountRibbon ? 'top-12' : 'top-4'"
      @click.stop="toggleMenu"
      aria-label="Acciones"
    >
      ⋮
    </button>

    <button
      v-else
      type="button"
      class="absolute right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 text-sm font-semibold text-slate-500 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:text-rose-500"
      :class="[hasDiscountRibbon ? 'top-12' : 'top-4', isFavorite ? 'border-rose-200 text-rose-600' : 'border-slate-200']"
      @click.stop="toggleFavorite"
      :aria-pressed="isFavorite"
      aria-label="Marcar producto como favorito"
    >
      <Heart class="h-4 w-4" :class="isFavorite ? 'fill-current text-rose-600' : 'text-slate-500'" />
    </button>

    <div
      v-if="hasDiscountRibbon"
      class="pointer-events-none absolute right-0 top-0 z-20 rounded-bl-2xl bg-gradient-to-r from-rose-600 to-fuchsia-600 px-4 py-2.5 text-sm font-black tracking-tight text-white shadow-[0_14px_28px_-18px_rgba(190,24,93,0.75)]"
    >
      {{ discountPercent }}%
    </div>

    <NuxtLink
      v-if="isMarketplace"
      :to="`/marketplace/productos/${product.slug}`"
      class="relative block h-40 w-full overflow-hidden bg-slate-100"
      style="text-decoration:none"
    >
      <img :src="imageSrc || '/logoPW.png'" :alt="product.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" @error="onImgError($event)" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" aria-hidden="true" />
    </NuxtLink>

    <NuxtLink
      v-else
      :to="productDetailPath"
      class="relative block h-40 w-full overflow-hidden bg-slate-100"
      style="text-decoration:none"
    >
      <img :src="imageSrc || '/logoPW.png'" :alt="product.name" class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" @error="onImgError($event)" />
      <div class="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" aria-hidden="true" />
    </NuxtLink>

    <!-- El bloque <script setup> debe ir fuera del template -->

    <div class="relative flex flex-1 flex-col gap-3 p-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {{ product.category?.name || 'General' }}
        </p>
        <NuxtLink
          v-if="isMarketplace && marketplacePublisherPath"
          :to="marketplacePublisherPath"
          class="rounded-full border border-[#0f274f]/10 bg-[#0f274f]/5 px-2.5 py-1 text-[11px] font-semibold text-[#0f274f] shadow-sm transition hover:bg-[#0f274f]/10"
          @click.stop
        >
          {{ marketplacePublisherLabel }}
        </NuxtLink>
        <span
          v-else-if="isMarketplace"
          class="rounded-full border border-[#0f274f]/10 bg-[#0f274f]/5 px-2.5 py-1 text-[11px] font-semibold text-[#0f274f] shadow-sm"
        >
          {{ marketplacePublisherLabel }}
        </span>
        <span
          v-else
          class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm"
        >
          {{ storeDisplayName }}
        </span>
      </div>

      <h3
        class="line-clamp-1 text-[1.05rem] font-extrabold tracking-tight text-slate-900 transition group-hover:text-slate-700"
      >
        {{ product.name }}
      </h3>

      <div class="flex flex-wrap items-center gap-2">
        <span v-if="!hideStock" class="rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm" :class="stockDescriptor.pill">
          {{ stockDescriptor.label }}
        </span>
        <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
        <span v-if="product.free_shipping" class="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-800">Envío gratis</span>
        <span v-else-if="isMarketplace" class="rounded-full px-2 py-1 text-[11px] font-semibold" :class="marketBadgeClass">Marketplace</span>
      </div>

      <div class="rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              {{ product.offer_price ? 'Oferta' : 'Precio' }}
            </p>
            <div class="mt-1 flex items-end gap-2">
              <p v-if="product.offer_price && offerMinQty > 1" class="text-2xl font-black leading-none tracking-tight text-slate-950 sm:text-[1.9rem]">
                {{ offerMinQty }}x {{ formatClp(offerUnitPrice) }}
              </p>
              <p v-else class="text-2xl font-black leading-none tracking-tight text-slate-950 sm:text-[1.9rem]">
                {{ formatClp(effectivePrice) }}
              </p>
              <div v-if="product.offer_price" class="pb-0.5 text-right">
                <p class="text-[11px] font-semibold text-slate-500">{{ formatClp(offerUnitPrice) }} c/u</p>
                <p class="text-[11px] font-semibold text-slate-400 line-through">{{ formatClp(product.price) }} c/u</p>
              </div>
            </div>
            <p v-if="product.offer_price && offerMinQty > 1" class="mt-1 text-[11px] font-semibold text-slate-500">
              Total pack {{ formatClp(offerPackTotal) }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-auto grid grid-cols-2 gap-2 pt-1">
        <button
          class="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-16px_rgba(249,115,22,0.32)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          :class="highlightBuy ? 'ring-2 ring-rose-200' : ''"
          :style="{ backgroundImage: isMarketplace ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : `linear-gradient(135deg, ${accentColor}, ${accentColor})`, borderColor: isMarketplace ? 'rgba(180,83,9,0.12)' : `${accentColor}22` }"
          :disabled="!canAddToCart"
          @click="handleAddToCart"
        >
          <ShoppingCart class="h-4 w-4" aria-hidden="true" />
          {{ !storeCartEnabled ? 'Carrito deshabilitado' : (highlightBuy ? 'Comprar ya' : 'Agregar') }}
        </button>

        <NuxtLink
          :to="productDetailPath"
          class="inline-flex min-h-11 items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-16px_rgba(249,115,22,0.28)] transition duration-200 hover:-translate-y-0.5"
          :style="{ backgroundImage: isMarketplace ? 'linear-gradient(135deg, #fb923c, #f97316)' : `linear-gradient(135deg, ${accentColor}, ${accentColor})`, borderColor: isMarketplace ? 'rgba(180,83,9,0.12)' : `${accentColor}22` }"
        >
          {{ highlightBuy ? 'Ver oferta' : 'Ver producto' }}
        </NuxtLink>
      </div>
    </div>
    <div v-if="canManage && menuOpen" class="absolute right-4 top-14 z-10 w-40 rounded-2xl border border-slate-200 bg-white py-1 text-sm shadow-lg" @click.stop>
      <a v-if="editUrl" :href="editUrl" class="block px-3 py-2 text-slate-700 hover:bg-slate-50">Editar</a>
      <button class="block w-full px-3 py-2 text-left text-red-600 hover:bg-slate-50" @click="handleDelete">Eliminar</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Heart, ShoppingCart } from 'lucide-vue-next'
import { useCartStore } from '~/stores/cart'
import { useThemeStore } from '~/stores/theme'
import { useRouter } from 'vue-router'
import { makeProductFavoriteKey, useFavorites } from '~/composables/useFavorites'

const props = defineProps<{ product: any; isMarketplace?: boolean; accent?: string; canManage?: boolean; onDelete?: Function; editUrl?: string; isMine?: boolean; hideStock?: boolean; highlightBuy?: boolean; disableCart?: boolean }>()

const product = props.product
const isMarketplace = computed(() => Boolean(props.isMarketplace))
const highlightBuy = computed(() => Boolean(props.highlightBuy))
const cart = useCartStore()
const theme = useThemeStore()
const router = useRouter()

const MARKET_ACCENT = '#f59e0b'
const accentColor = computed(() => (isMarketplace.value ? MARKET_ACCENT : props.accent || theme.accent || '#2563eb'))
const glowStyle = computed(() => ({ background: `radial-gradient(circle at 30% 20%, ${accentColor.value}1a, transparent 40%)` }))
const marketBadgeClass = computed(() => (isMarketplace.value ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'))
const imageSrc = computed(() => product?.image_url || product?.images?.[0]?.image || product?.image || '/logoPW.png')
const sanitizePublisherLabel = (value: any) => {
  const candidate = String(value || '').trim()
  if (!candidate) return ''
  if (candidate.includes('@')) return ''
  return candidate
}
const marketplacePublisherLabel = computed(() => {
  if (!isMarketplace.value) return product?.store?.slug || 'tienda'
  return [
    product?.submitted_by_name,
    product?.submitted_by_username,
    product?.seller_name,
    product?.owner_name,
    product?.store?.name,
    product?.store?.slug,
  ].map(sanitizePublisherLabel).find(Boolean) || 'Vendedor'
})
const marketplacePublisherPath = computed(() => {
  if (!isMarketplace.value) return ''
  const sellerId = product?.submitted_by ?? product?.submitted_by_id ?? product?.seller_id ?? null
  if (sellerId === null || sellerId === undefined || sellerId === '') return ''
  return `/marketplace/vendedores/${sellerId}`
})
const storeDisplayName = computed(() => product?.store?.name || product?.store?.slug || 'Tienda')
const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  target.onerror = null
  target.src = '/logoPW.png'
}
const availableStock = computed(() => {
  const raw = Number(product?.stock_available ?? 0)
  return Number.isFinite(raw) ? raw : 0
})
const storeCartEnabled = computed(() => {
  const value = product?.store?.cart_enabled
  return value === undefined || value === null ? true : Boolean(value)
})
const canAddToCart = computed(() => availableStock.value > 0 && storeCartEnabled.value && !props.disableCart)
const describeStock = (value: number) => {
  if (value <= 0) return { label: 'Sin stock', tone: 'text-red-600', pill: 'bg-red-50 text-red-700' }
  if (value <= 5) return { label: `Últimas ${value}`, tone: 'text-amber-600', pill: 'bg-amber-50 text-amber-700' }
  return { label: `${value} disponibles`, tone: 'text-emerald-600', pill: 'bg-emerald-50 text-emerald-700' }
}
const stockDescriptor = computed(() => describeStock(availableStock.value))
const hideStock = computed(() => Boolean(props.hideStock))
const offerMinQty = computed(() => Math.max(1, Number(product?.offer_min_qty || 1)))
const offerUnitPrice = computed(() => Number(product?.offer_price || 0))
const offerPackTotal = computed(() => offerUnitPrice.value * offerMinQty.value)
const discountPercent = computed(() => {
  const price = Number(product?.price || 0)
  const offer = Number(product?.offer_price || 0)
  if (!price || !offer || offer >= price) return 0
  return Math.round(((price - offer) / price) * 100)
})
const discountBadge = computed(() => (discountPercent.value > 0 ? `${discountPercent.value}%` : ''))
const hasDiscountRibbon = computed(() => discountPercent.value > 0)
const effectivePrice = computed(() => {
  if (product?.offer_price && offerMinQty.value <= 1) {
    return Number(product.offer_price)
  }
  return Number(product?.price || 0)
})
const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0)

const { isProductFavoriteKey, toggleProductFavoriteKey } = useFavorites()
const productFavoriteKey = (p: any) => makeProductFavoriteKey(p?.store?.slug, p?.slug || p?.id)
const isFavorite = computed(() => isProductFavoriteKey(productFavoriteKey(product)))
const toggleFavorite = () => toggleProductFavoriteKey(productFavoriteKey(product))

const menuOpen = ref(false)
const canManage = computed(() => Boolean(props.canManage))
const editUrl = computed(() => {
  if (props.editUrl) return props.editUrl
  if (product?.store?.slug && !isMarketplace.value) return `/store/${product.store.slug}/productos/${product.slug}`
  return product?.slug ? `/marketplace/productos/${product.slug}` : ''
})
const handleDelete = async () => {
  if (typeof props.onDelete === 'function') {
    await props.onDelete(product)
  } else if (confirm('¿Eliminar este producto?')) {
    // fallback: try to call an endpoint if no handler provided (best-effort)
    try {
      // no-op here; prefer parent to provide onDelete
    } catch (e) {
      console.error('delete fallback failed', e)
    }
  }
  menuOpen.value = false
}
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const handleAddToCart = async () => {
  if (!canAddToCart.value) return
  try {
    cart.setContext(isMarketplace.value ? 'marketplace' : product.store?.slug || 'marketplace')
    cart.addProduct(product)
    if (isMarketplace.value) await router.push('/marketplace/carrito')
  } catch (e) {
    console.error('addToCart error', e)
  }
}

const productDetailPath = computed(() => {
  const id = product?.slug || product?.id
  if (!id) return '/marketplace'
  if (product?.store?.slug && !product?.store_is_marketplace) return `/store/${product.store.slug}/productos/${id}`
  return `/marketplace/productos/${id}`
})

// script setup exposes bindings directly to the template

</script>
