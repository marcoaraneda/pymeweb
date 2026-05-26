<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">Productos</h2>
        <p class="text-white/70">Gestiona el catálogo de tu tienda</p>
      </div>
      <NuxtLink
        to="nuevo"
        class="rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
        :style="{ backgroundColor: theme.accent }"
      >
        + Nuevo Producto
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
      <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
      <p class="mt-4 text-white/70">Cargando productos...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!products.length" class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
      <div class="text-4xl">📦</div>
      <p class="mt-4 font-semibold">No hay productos</p>
      <p class="text-white/70">Comienza creando tu primer producto</p>
      <NuxtLink
        to="nuevo"
        class="mt-4 inline-block rounded-xl px-6 py-2 font-semibold text-white"
        :style="{ backgroundColor: theme.accent }"
      >
        Crear Producto
      </NuxtLink>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <NuxtLink
        v-for="product in products"
        :key="product.id"
        :to="`${product.slug}`"
        class="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      >
        <div v-if="product.image_url" class="aspect-square overflow-hidden bg-white/10">
          <img
            :src="product.image_url"
            :alt="product.name"
            class="h-full w-full object-cover transition group-hover:scale-110"
          />
        </div>
        <div v-else class="aspect-square flex items-center justify-center bg-white/10">
          <div class="text-4xl opacity-50">📷</div>
        </div>

        <div class="p-4">
          <h3 class="font-semibold truncate group-hover:text-white/80">{{ product.name }}</h3>
          <p class="text-sm text-white/60">{{ product.category?.name || 'Sin categoría' }}</p>
          
          <div class="mt-3 flex items-center justify-between">
            <div>
              <p class="text-xs text-white/60">Precio</p>
              <p class="font-bold">${{ product.price }}</p>
            </div>
            <div>
              <p class="text-xs text-white/60">Stock</p>
              <p class="font-bold">{{ product.stock || 0 }}</p>
            </div>
          </div>

          <div v-if="product.is_active" class="mt-3 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-100 text-center">
            Activo
          </div>
          <div v-else class="mt-3 rounded-full bg-slate-600/20 px-3 py-1 text-xs font-semibold text-slate-100 text-center">
            Inactivo
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/stores/theme'
import { useRoute } from 'nuxt/app'

const route = useRoute()
const theme = useThemeStore()

const slug = computed(() => route.params.slug as string)
const products = ref<any[]>([])
const loading = ref(false)

const loadProducts = async () => {
  loading.value = true
  try {
    const data = await $fetch(`/api/catalogo/productos/?store=${slug.value}`)
    products.value = data.results || data || []
  } catch (error) {
    console.error('Error cargando productos:', error)
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProducts()
})

watch(() => route.params.slug, () => {
  loadProducts()
})
</script>
