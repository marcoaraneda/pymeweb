<template>
  <section class="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 py-12 sm:px-6">
    <div class="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8 lg:grid-cols-[1.2fr,0.8fr]">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">Ruta en desarrollo</p>
        <h1 class="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">
          Esta página todavía no tiene una vista dedicada.
        </h1>
        <p class="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
          La app ya carga con su layout compartido, y esta ruta evita el 404 mientras completamos las pantallas específicas.
        </p>

        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink to="/" class="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
            Volver al inicio
          </NuxtLink>
          <NuxtLink to="/tiendas" class="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
            Ver tiendas
          </NuxtLink>
        </div>

        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p class="text-xs uppercase tracking-[0.18em] text-white/45">Estado</p>
            <p class="mt-1 font-semibold text-white">200 OK</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p class="text-xs uppercase tracking-[0.18em] text-white/45">Ruta</p>
            <p class="mt-1 font-semibold text-white">{{ currentPath }}</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-black/15 p-4">
            <p class="text-xs uppercase tracking-[0.18em] text-white/45">Modo</p>
            <p class="mt-1 font-semibold text-white">Fallback SPA</p>
          </div>
        </div>
      </div>

      <aside class="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-white shadow-inner">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Navegación rápida</p>
        <div class="mt-4 space-y-3 text-sm">
          <NuxtLink class="quick-link" to="/login">Ingresar</NuxtLink>
          <NuxtLink class="quick-link" to="/register">Crear cuenta</NuxtLink>
          <NuxtLink class="quick-link" to="/marketplace">Marketplace</NuxtLink>
          <NuxtLink class="quick-link" to="/notificaciones">Notificaciones</NuxtLink>
          <NuxtLink class="quick-link" to="/dashboard">Dashboard</NuxtLink>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup lang="ts">
const route = useRoute()
const currentPath = computed(() => route.path)
</script>

<style scoped>
.quick-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.75rem 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
}

.quick-link:hover {
  border-color: rgba(34, 211, 238, 0.4);
  background: rgba(34, 211, 238, 0.1);
  color: rgb(255, 255, 255);
}
</style>