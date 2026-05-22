<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="text-2xl font-semibold mb-6">Tiendas</h1>

    <div v-if="loading" class="text-sm text-white/70">Cargando tiendas...</div>
    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <NuxtLink v-for="store in stores" :key="store.id" :to="`/store/${store.slug}`" class="block rounded-md border p-4 hover:bg-slate-900/50">
        <div class="font-semibold text-white">{{ store.name }}</div>
        <div class="text-sm text-white/60">{{ store.description }}</div>
      </NuxtLink>
    </div>
    <div v-if="!loading && stores.length===0" class="text-sm text-white/60 mt-4">No hay tiendas públicas aún.</div>
  </div>
</template>

<script setup lang="ts">
import { useMarketplaceRequests } from '~/app/composables/useMarketplaceRequests'

const config = useRuntimeConfig()
const { controlledGet } = useMarketplaceRequests()

const stores = ref<any[]>([])
const loading = ref(true)

const load = async () => {
  loading.value = true
  try {
    const res = await controlledGet('stores_list', `${config.public.apiBase}/stores/`, { minIntervalMs: 30_000 })
    stores.value = res || []
  } catch (e) {
    stores.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => { load() })
</script>

<style scoped>
.store-card { }
</style>
