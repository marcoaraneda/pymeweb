<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="text-2xl font-semibold mb-6">Marketplace</h1>

    <div v-if="loading" class="text-sm text-white/70">Cargando productos...</div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>

    <div v-if="!loading && products.length===0" class="text-sm text-white/60 mt-4">No hay productos publicados aún.</div>
  </div>
</template>

<script setup lang="ts">
import { useMarketplaceRequests } from '~/composables/useMarketplaceRequests'

const config = useRuntimeConfig()
const { controlledGet } = useMarketplaceRequests()

const products = ref<any[]>([])
const loading = ref(true)

const load = async () => {
  loading.value = true
  try {
    const res = await controlledGet('marketplace_products', `${config.public.apiBase}/marketplace/products/?limit=24`, { minIntervalMs: 20_000 })
    products.value = res || []
  } catch (e) {
    products.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => { load() })
</script>

<style scoped>
/* small tweaks */
</style>
