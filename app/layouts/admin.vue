<template>
  <div class="flex h-screen bg-slate-100">
    
    <!-- SIDEBAR -->
    <aside class="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6">
      <h2 class="font-bold text-2xl mb-10 tracking-wide">
        PymeAdmin
      </h2>

      <nav class="space-y-2">
        <NuxtLink :to="`/store/${slug}/admin/inventario`" class="nav-link">
          📦 Inventario
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/admin/catalog`" class="nav-link">
          🏷️ Productos
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/admin/reviews`" class="nav-link">
          ⭐ Reseñas
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/admin/cms`" class="nav-link">
          🎨 Personalización
        </NuxtLink>
      </nav>
    </aside>

    <!-- CONTENIDO -->
    <main class="flex-1 overflow-y-auto p-10">
      <slot />
    </main>

  </div>
</template>

<script setup lang="ts">
import { useTenantStore } from '~/stores/tenant'
const slug = useTenantStore().slug
</script>

<style scoped>
.nav-link {
  display: block;
  padding: 0.6rem 0.75rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
}
</style>
