<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <NuxtLink to="/" class="flex items-center gap-3 font-semibold tracking-tight text-white">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25">
            PW
          </span>
          <span class="flex flex-col leading-tight">
            <span class="text-base">Pymeweb</span>
            <span class="text-xs font-normal text-white/60">Gestión digital para PYMEs</span>
          </span>
        </NuxtLink>

        <nav class="hidden items-center gap-2 md:flex">
          <NuxtLink class="nav-link" to="/">Inicio</NuxtLink>
          <NuxtLink class="nav-link" to="/tiendas">Tiendas</NuxtLink>
          <NuxtLink class="nav-link" to="/marketplace">Marketplace</NuxtLink>
          <NuxtLink class="nav-link" to="/login">Ingresar</NuxtLink>
        </nav>

        <NuxtLink
          to="/tiendas"
          class="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/20"
        >
          Explorar
        </NuxtLink>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="border-t border-white/10 bg-slate-950">
      <div class="mx-auto max-w-6xl px-4 py-6 text-sm text-white/55 sm:px-6">
        © 2026 Pymeweb. Vende con tu propia vitrina digital.
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav-link {
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  transition: background-color 150ms ease, color 150ms ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: rgb(255, 255, 255);
}
</style>