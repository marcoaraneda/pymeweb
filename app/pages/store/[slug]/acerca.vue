<template>
  <div class="bg-slate-50 min-h-screen">
    <section class="relative overflow-hidden bg-gradient-to-br from-[var(--gradient-from,#0f172a)] to-[var(--gradient-to,#0b2358)] text-white">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" aria-hidden="true" />
      <div class="relative mx-auto max-w-5xl px-6 py-16 space-y-4">
        <p class="text-xs uppercase tracking-[0.25em] text-white/70">Acerca de la tienda</p>
        <h1 class="text-4xl font-bold leading-tight">{{ storeName }}</h1>
        <p class="text-white/80 max-w-3xl">{{ storeDescription }}</p>
      </div>
    </section>

    <section class="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <div class="grid gap-6 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900">Información</h2>
          <p class="mt-2 text-slate-600">{{ storeDescription }}</p>
          <dl class="mt-4 space-y-2 text-sm text-slate-700">
            <div v-if="storeData?.slug" class="flex justify-between">
              <dt class="text-slate-500">Slug</dt>
              <dd class="font-semibold">{{ storeData.slug }}</dd>
            </div>
            <div v-if="storeData?.email" class="flex justify-between">
              <dt class="text-slate-500">Contacto</dt>
              <dd class="font-semibold">{{ storeData.email }}</dd>
            </div>
            <div v-if="storeData?.phone" class="flex justify-between">
              <dt class="text-slate-500">Teléfono</dt>
              <dd class="font-semibold">{{ storeData.phone }}</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 class="text-xl font-semibold text-slate-900">Tema de la tienda</h2>
          <p class="mt-2 text-slate-600">Colores aplicados para esta tienda.</p>
          <div class="mt-4 flex flex-wrap gap-3 text-sm">
            <span class="rounded-full border border-slate-200 px-3 py-1" :style="{ backgroundColor: theme.accent, color: '#fff' }">Acento</span>
            <span class="rounded-full border border-slate-200 px-3 py-1" :style="{ backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom}, ${theme.gradientTo})`, color: '#0f172a' }">Degradado</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta } from '#imports'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ layout: 'store' })

const route = useRoute()
const slug = route.params.slug as string
const tenantStore = useTenantStore()
const theme = useThemeStore()

const storeData = computed(() => tenantStore.data)
const storeName = computed(() => tenantStore.data?.name || 'Tienda')
const storeDescription = computed(() => tenantStore.data?.description || 'Personaliza esta sección desde el panel de tu tienda.')

const loadData = async () => {
  tenantStore.setSlug(slug)
  await tenantStore.fetchTienda()
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await loadData()
})
</script>
