<template>
  <div class="relative min-h-screen bg-slate-950 text-white">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute -left-10 top-10 h-60 w-60 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-70" />
      <div class="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-60" />
    </div>

    <div class="relative z-10 mx-auto max-w-6xl px-6 py-10 space-y-10">
      <!-- Header -->
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Admin</p>
          <h1 class="text-3xl font-extrabold">{{ store?.name || 'Tienda' }}</h1>
          <p class="text-white/70">Panel de administración de tu tienda</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink
            :to="`/store/${route.params.slug}`"
            class="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Ver tienda
          </NuxtLink>
          <button
            @click="logout"
            class="rounded-xl bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-600/30 border border-red-600/30"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <NuxtLink
          to="productos"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">📦</div>
          <h3 class="font-semibold group-hover:text-white/80">Productos</h3>
          <p class="text-xs text-white/60">Inventario y catálogo</p>
        </NuxtLink>

        <NuxtLink
          to="orders"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">🛒</div>
          <h3 class="font-semibold group-hover:text-white/80">Órdenes</h3>
          <p class="text-xs text-white/60">Historial de ventas</p>
        </NuxtLink>

        <NuxtLink
          to="inventario"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">📊</div>
          <h3 class="font-semibold group-hover:text-white/80">Inventario</h3>
          <p class="text-xs text-white/60">Stock y movimientos</p>
        </NuxtLink>

        <NuxtLink
          to="reportes"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">📈</div>
          <h3 class="font-semibold group-hover:text-white/80">Reportes</h3>
          <p class="text-xs text-white/60">Análisis y métricas</p>
        </NuxtLink>

        <NuxtLink
          to="cms"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">✏️</div>
          <h3 class="font-semibold group-hover:text-white/80">CMS</h3>
          <p class="text-xs text-white/60">Contenido y páginas</p>
        </NuxtLink>

        <NuxtLink
          to="resenas"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">⭐</div>
          <h3 class="font-semibold group-hover:text-white/80">Reseñas</h3>
          <p class="text-xs text-white/60">Comentarios de clientes</p>
        </NuxtLink>

        <NuxtLink
          to="faq"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">❓</div>
          <h3 class="font-semibold group-hover:text-white/80">FAQ</h3>
          <p class="text-xs text-white/60">Preguntas frecuentes</p>
        </NuxtLink>

        <NuxtLink
          to="pagos"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">💳</div>
          <h3 class="font-semibold group-hover:text-white/80">Pagos</h3>
          <p class="text-xs text-white/60">Métodos y payouts</p>
        </NuxtLink>
        <NuxtLink
          to="settings"
          class="group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
        >
          <div class="mb-2 text-2xl">⚙️</div>
          <h3 class="font-semibold group-hover:text-white/80">Configuración</h3>
          <p class="text-xs text-white/60">Diseño y general</p>
        </NuxtLink>      </nav>

      <!-- Quick Stats (si hay datos) -->
      <div v-if="stats" class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Productos</p>
          <p class="mt-2 text-2xl font-bold">{{ stats.products || 0 }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Órdenes</p>
          <p class="mt-2 text-2xl font-bold">{{ stats.orders || 0 }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Total Ventas</p>
          <p class="mt-2 text-2xl font-bold">${{ stats.total_sales || 0 }}</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Rating</p>
          <p class="mt-2 text-2xl font-bold">{{ stats.rating || 0 }}⭐</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, navigateTo } from 'nuxt/app'

const route = useRoute()
const auth = useAuthStore()

const store = ref<any>(null)
const stats = ref<any>(null)

const slug = computed(() => route.params.slug as string)

onMounted(async () => {
  try {
    // Cargar datos de la tienda
    const response = await $fetch(`/api/stores/${slug.value}/`)
    store.value = response
    
    // Cargar estadísticas (si existe endpoint)
    try {
      const statsData = await $fetch(`/api/stores/${slug.value}/stats/`)
      stats.value = statsData
    } catch {
      // Si no existe, continuar sin estadísticas
    }
  } catch (error) {
    console.error('Error cargando tienda:', error)
    await navigateTo('/')
  }
})

const logout = async () => {
  await auth.logout({ redirectTo: '/' })
}
</script>
