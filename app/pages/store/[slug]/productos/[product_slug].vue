<template>
  <div v-if="product" class="mx-auto max-w-5xl space-y-10 px-4 py-10 md:grid md:grid-cols-[1.1fr,0.9fr] md:gap-10 md:space-y-0">
    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <img :src="getProductImage(product)" :alt="product.name" class="h-full w-full object-cover" />
    </div>

    <div class="space-y-4">
      <div class="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
        <span>{{ product.category?.name || 'General' }}</span>
        <span v-if="product.is_marketplace" class="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-800">Marketplace</span>
        <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
      </div>

      <h1 class="text-4xl font-bold text-slate-900">{{ product.name }}</h1>
      <p class="text-slate-600">{{ product.description }}</p>

      <div class="flex items-center gap-3 text-2xl font-bold">
        <span v-if="product.offer_price" class="text-slate-400 line-through text-xl">${{ product.price }}</span>
        <span :style="{ color: accentColor }">${{ product.offer_price || product.price }}</span>
      </div>

      <div class="flex flex-wrap gap-3 text-sm text-slate-600">
        <span class="rounded-full border border-slate-200 px-3 py-1">Pago seguro</span>
        <span class="rounded-full border border-slate-200 px-3 py-1">Envío rápido</span>
        <span v-if="product.store?.slug" class="rounded-full border border-slate-200 px-3 py-1">Tienda: {{ product.store.slug }}</span>
      </div>

      <div class="flex flex-wrap gap-3 pt-2">
        <button
          @click="cart.addProduct(product)
            "
          class="rounded-xl px-5 py-3 text-sm font-semibold text-white shadow"
          :style="{ backgroundColor: accentColor }"
        >
          🛒 Agregar al carrito
        </button>
        <NuxtLink
          v-if="product.store?.slug"
          :to="`/store/${product.store.slug}`"
          class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300"
        >
          Ir a la tienda
        </NuxtLink>
      </div>

      <section class="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Reseñas</p>
            <h2 class="text-lg font-semibold text-slate-900">Opiniones y valoración</h2>
          </div>
          <span class="text-sm font-semibold text-amber-600" v-if="averageRating">{{ averageRating }} ★</span>
        </div>

        <div class="space-y-3" v-if="reviews.length">
          <article v-for="review in reviews" :key="review.id" class="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div class="flex items-center justify-between text-sm text-slate-700">
              <span class="font-semibold">{{ review.customer_name || 'Cliente' }}</span>
              <span class="text-amber-600">{{ review.rating }} ★</span>
            </div>
            <p class="mt-1 text-sm text-slate-600">{{ review.comment }}</p>
            <p class="text-xs text-slate-400">{{ new Date(review.created_at).toLocaleDateString() }}</p>
          </article>
        </div>
        <p v-else class="text-sm text-slate-600">Aún no hay reseñas.</p>

        <div class="mt-4 space-y-2">
          <label class="text-sm text-slate-700">Deja tu reseña</label>
          <div class="grid gap-2 sm:grid-cols-2">
            <input v-model="reviewForm.customer_name" type="text" placeholder="Tu nombre" class="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <select v-model.number="reviewForm.rating" class="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option :value="5">5 estrellas</option>
              <option :value="4">4 estrellas</option>
              <option :value="3">3 estrellas</option>
              <option :value="2">2 estrellas</option>
              <option :value="1">1 estrella</option>
            </select>
          </div>
          <textarea v-model="reviewForm.comment" rows="3" placeholder="Escribe tu comentario" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
          <div class="flex items-center gap-3">
            <button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" :style="{ backgroundColor: accentColor }" :disabled="sendingReview" @click="sendReview">
              {{ sendingReview ? 'Enviando…' : 'Publicar reseña' }}
            </button>
            <p v-if="reviewMessage" class="text-sm" :class="reviewStatus === 'error' ? 'text-red-600' : 'text-green-600'">{{ reviewMessage }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="text-gray-500 text-center py-20">
    Producto no encontrado
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProducts } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useImages } from '~/composables/useImages'
import { useThemeStore } from '~/stores/theme'
import { useRuntimeConfig } from 'nuxt/app'

const route = useRoute()
const cart = useCartStore()
const theme = useThemeStore()
const config = useRuntimeConfig()
const { getProductBySlug } = useProducts()
const { getProductImage } = useImages()

const product = ref<any>(null)
const reviews = ref<any[]>([])
const sendingReview = ref(false)
const reviewMessage = ref('')
const reviewStatus = ref<'ok' | 'error'>('ok')
const reviewForm = ref({ rating: 5, comment: '', customer_name: '' })
const accentColor = computed(() => theme.accent || '#2563eb')
const averageRating = computed(() => {
  if (!reviews.value.length) return null
  const avg = reviews.value.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.value.length
  return avg.toFixed(1)
})

const fetchReviews = async () => {
  if (!product.value) return
  try {
    reviews.value = await $fetch(`${config.public.apiBase}/store/${route.params.slug}/resenas/reviews/product/${product.value.slug}/`)
  } catch (error) {
    reviews.value = []
  }
}

const sendReview = async () => {
  if (!product.value) return
  sendingReview.value = true
  reviewMessage.value = ''
  try {
    await $fetch(`${config.public.apiBase}/store/${route.params.slug}/resenas/reviews/product/${product.value.slug}/create/`, {
      method: 'POST',
      body: {
        rating: reviewForm.value.rating,
        comment: reviewForm.value.comment,
        customer_name: reviewForm.value.customer_name,
        product_slug: product.value.slug,
      },
    })
    reviewMessage.value = 'Reseña enviada. Se mostrará al aprobarse.'
    reviewStatus.value = 'ok'
    reviewForm.value = { rating: 5, comment: '', customer_name: '' }
    await fetchReviews()
  } catch (error: any) {
    reviewMessage.value = error?.response?._data || 'No pudimos enviar la reseña'
    reviewStatus.value = 'error'
  } finally {
    sendingReview.value = false
  }
}

onMounted(async () => {
  try {
    product.value = await getProductBySlug(route.params.product_slug as string)
    await fetchReviews()
  } catch (e) {
    console.error('Error cargando producto', e)
  }
})
</script>
