<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <section class="relative overflow-hidden bg-gradient-to-br from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] text-white">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" aria-hidden="true" />
      <div class="absolute -left-10 top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" aria-hidden="true" />
      <div class="absolute -right-16 bottom-0 h-40 w-40 rounded-full bg-amber-400/10 blur-3xl" aria-hidden="true" />
      <div class="relative mx-auto max-w-6xl px-6 py-12 space-y-5">
        <p class="text-xs uppercase tracking-[0.25em] text-white/70">Explora</p>
        <div class="rounded-3xl border border-cyan-200/20 bg-gradient-to-br from-white/12 via-white/8 to-white/4 p-4 shadow-[0_20px_60px_rgba(8,24,56,0.35)] backdrop-blur sm:p-5">
          <div class="space-y-2">
            <h1 class="text-3xl font-bold leading-tight">Todas las tiendas</h1>
            <p class="text-white/80">Encuentra tu próxima tienda favorita. Filtra, navega y entra directo.</p>
            <div class="flex flex-wrap gap-2 text-xs text-white/70">
              <span class="rounded-full border border-white/15 px-3 py-1">Actualizado al momento</span>
              <span class="rounded-full border border-white/15 px-3 py-1">Ordena por nombre o busca</span>
            </div>
          </div>
          <div class="mt-4 rounded-2xl border border-cyan-200/25 bg-gradient-to-r from-white/15 to-white/10 p-3">
            <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-end">
              <input
                v-model="filterQuery"
                type="text"
                placeholder="Buscar tienda..."
                class="h-10 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/60 shadow-inner focus:border-white/40 focus:outline-none"
              />
              <div class="inline-flex h-10 items-center gap-2 rounded-xl border border-cyan-200/25 bg-white/12 px-2 shadow-inner">
                <button
                  class="rounded-lg px-3 py-1 text-sm font-semibold transition"
                  :class="sortMode === 'recent' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'"
                  @click="sortMode = 'recent'"
                >
                  Original
                </button>
                <button
                  class="rounded-lg px-3 py-1 text-sm font-semibold transition"
                  :class="sortMode === 'az' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'"
                  @click="sortMode = 'az'"
                >
                  A → Z
                </button>
                <button
                  class="rounded-lg px-3 py-1 text-sm font-semibold transition"
                  :class="sortMode === 'za' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/15'"
                  @click="sortMode = 'za'"
                >
                  Z → A
                </button>
              </div>
              <NuxtLink
                to="/"
                class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/10 transition"
              >
                Volver al inicio
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-sky-200/25 bg-gradient-to-br from-sky-400/20 to-white/5 p-4 backdrop-blur">
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Tiendas totales</p>
            <p class="text-2xl font-semibold">{{ stores.length }}</p>
            <p class="text-sm text-white/70">Cargadas desde el marketplace</p>
          </div>
          <div class="rounded-2xl border border-emerald-200/25 bg-gradient-to-br from-emerald-400/20 to-white/5 p-4 backdrop-blur">
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Coincidencias</p>
            <p class="text-2xl font-semibold">{{ filteredStores.length }}</p>
            <p class="text-sm text-white/70">Según tu búsqueda actual</p>
          </div>
          <div class="rounded-2xl border border-amber-200/25 bg-gradient-to-br from-amber-400/20 to-white/5 p-4 backdrop-blur">
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Categorías activas</p>
            <p class="text-2xl font-semibold">{{ groupedSections.length }}</p>
            <p class="text-sm text-white/70">Tipos de tienda disponibles</p>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-10 space-y-4">
      <div class="grid gap-3 md:grid-cols-3">
        <article class="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-[0.2em] text-[#0f274f]">Recomendado</p>
          <h2 class="mt-2 text-lg font-semibold text-slate-900">Descubre nuevas marcas locales</h2>
          <p class="mt-1 text-sm text-slate-600">Explora tiendas con catálogo activo y atención directa.</p>
        </article>
        <article class="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-[0.2em] text-[#0f274f]">Más rápido</p>
          <h2 class="mt-2 text-lg font-semibold text-slate-900">Filtra y encuentra en segundos</h2>
          <p class="mt-1 text-sm text-slate-600">Busca por nombre o slug y entra directo a comprar.</p>
        </article>
        <article class="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-[0.2em] text-[#0f274f]">Confiable</p>
          <h2 class="mt-2 text-lg font-semibold text-slate-900">Compra en tiendas verificadas</h2>
          <p class="mt-1 text-sm text-slate-600">Todas las tiendas visibles están activas en Pymeweb.</p>
        </article>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
        <span v-if="filterQuery">Mostrando resultados para "{{ filterQuery }}"</span>
        <button v-if="filterQuery" class="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-100" @click="filterQuery = ''">Limpiar búsqueda</button>
      </div>

      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div class="mb-4 flex items-center gap-3">
            <div class="h-12 w-12 rounded-xl bg-slate-200" />
            <div class="flex-1 space-y-2">
              <div class="h-3 w-24 rounded bg-slate-200" />
              <div class="h-4 w-32 rounded bg-slate-200" />
            </div>
          </div>
          <div class="h-9 w-32 rounded-lg bg-slate-200" />
        </div>
      </div>
      <div v-else-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-red-700 flex items-center justify-between gap-3">
        <span>{{ error }}</span>
        <button
          class="rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
          :disabled="loading"
          @click="fetchStores"
        >
          Reintentar
        </button>
      </div>
      <div
        v-else-if="filteredStores.length === 0"
        class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600 shadow-sm"
      >
        No hay tiendas que coincidan con tu búsqueda.
      </div>
      <div v-else class="space-y-5">
        <section
          v-for="section in groupedSections"
          :key="section.key"
          class="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/70 p-4 shadow-sm sm:p-5"
        >
          <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{{ section.badge }}</p>
              <h2 class="section-title text-2xl sm:text-3xl">{{ section.title }}</h2>
              <p class="text-slate-600">{{ section.subtitle }}</p>
            </div>
            <span class="inline-flex items-center rounded-full border border-[#0f274f]/20 bg-[#0f274f]/5 px-3 py-1 text-xs font-semibold text-[#0f274f]">{{ section.stores.length }} tiendas</span>
          </div>
          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StoreCard v-for="store in section.stores" :key="store.slug" :store="store" :accent="theme.accent" />
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import StoreCard from '~/components/StoreCard.vue'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'
import { getMostVisitedStoreSlug, loadStoreVisits } from '~/composables/useStoreVisits'

// Listado de tiendas debe ser público
definePageMeta({})

const config = useRuntimeConfig()
const theme = useThemeStore()
const auth = useAuthStore()

const stores = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const filterQuery = ref('')
const sortMode = ref<'recent' | 'az' | 'za'>('recent')
const visitMap = ref<Record<string, number>>({})

const filteredStores = computed(() => {
  const term = filterQuery.value.trim().toLowerCase()
  if (!term) return stores.value
  return stores.value.filter((s) => s.name?.toLowerCase().includes(term) || s.slug?.toLowerCase().includes(term))
})

const sortedStores = computed(() => {
  const byVisitsDesc = (a: any, b: any) => {
    const aVisits = Number(visitMap.value[String(a?.slug || '')] || 0)
    const bVisits = Number(visitMap.value[String(b?.slug || '')] || 0)
    if (bVisits !== aVisits) return bVisits - aVisits
    return String(a?.name || '').localeCompare(String(b?.name || ''))
  }

  const data = [...filteredStores.value]
  if (sortMode.value === 'az') {
    return data.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
  }
  if (sortMode.value === 'za') {
    return data.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
  }
  return data.sort(byVisitsDesc)
})

const topVisitedStoreSlug = computed(() => getMostVisitedStoreSlug(sortedStores.value, (auth.user as any)?.id))

const typeMarketing: Record<string, { badge: string; title: string; subtitle: string }> = {
  fast_food: {
    badge: 'Comida rápida',
    title: 'Si tienes un bajon, estas tiendas te salvan el dia',
    subtitle: 'Pide en minutos, disfruta combos irresistibles y come rico sin esperar.',
  },
  bakery: {
    badge: 'Panadería y pastelería',
    title: 'Dulces y horneados que se venden solos',
    subtitle: 'Encuentra vitrinas con sabor casero, frescura y antojos para compartir.',
  },
  pharmacy: {
    badge: 'Farmacia',
    title: 'Cuida tu bienestar con tiendas confiables',
    subtitle: 'Compra productos esenciales con una experiencia clara y segura.',
  },
  fashion: {
    badge: 'Moda',
    title: 'Eleva tu estilo con colecciones que marcan tendencia',
    subtitle: 'Descubre marcas con personalidad y looks listos para destacar.',
  },
  bookstore: {
    badge: 'Librería',
    title: 'Historias que te atrapan desde la primera página',
    subtitle: 'Explora catálogos editoriales y encuentra tu próxima lectura favorita.',
  },
  retail: {
    badge: 'Retail',
    title: 'Todo lo que buscas en tiendas activas y competitivas',
    subtitle: 'Compara, descubre novedades y compra en negocios que están vendiendo hoy.',
  },
  other: {
    badge: 'Otras categorías',
    title: 'Más tiendas para descubrir en Pymeweb',
    subtitle: 'Nuevos rubros, nuevas oportunidades y más opciones para comprar.',
  },
}

const typeOrder = ['fast_food', 'bakery', 'pharmacy', 'fashion', 'bookstore', 'retail', 'other']

const groupedSections = computed(() => {
  const grouped = new Map<string, any[]>()
  sortedStores.value.forEach((store) => {
    const rawType = String(store?.store_type || 'retail')
    const key = rawType in typeMarketing ? rawType : 'other'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(store)
  })

  const sections = typeOrder
    .filter((key) => grouped.has(key))
    .map((key) => ({
      key,
      ...typeMarketing[key],
      stores: grouped.get(key) || [],
    }))

  const topSlug = topVisitedStoreSlug.value
  if (!topSlug) return sections

  const sectionIndex = sections.findIndex((section) => section.stores.some((store: any) => store.slug === topSlug))
  if (sectionIndex === -1) return sections

  const section = sections[sectionIndex]
  section.stores = [...section.stores].sort((a: any, b: any) => {
    if (a.slug === topSlug) return -1
    if (b.slug === topSlug) return 1
    return 0
  })

  if (sectionIndex > 0) {
    sections.splice(sectionIndex, 1)
    sections.unshift(section)
  }
  return sections
})

const refreshVisitMap = () => {
  visitMap.value = loadStoreVisits((auth.user as any)?.id)
}

const fetchStores = async () => {
  loading.value = true
  error.value = ''
  try {
    stores.value = await $fetch(`${config.public.apiBase}/stores/`)
  } catch (err) {
    console.error(err)
    error.value = 'No pudimos cargar las tiendas'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  await auth.initializeSession().catch(() => null)
  refreshVisitMap()
  await fetchStores()
})

watch(filterQuery, () => {
  // no-op: all matching stores are displayed by grouped sections
})

watch(sortMode, () => {
  // no-op: sorting is applied directly to grouped sections
})

watch(
  () => (auth.user as any)?.id,
  () => {
    refreshVisitMap()
  },
)
</script>
