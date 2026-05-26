<template>
  <div class="premium-shell flex h-screen bg-slate-100">
    
    <!-- SIDEBAR -->
    <aside class="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6">
      <h2 class="font-bold text-2xl mb-10 tracking-wide">
        PymeAdmin
      </h2>

      <nav class="space-y-2">
        <NuxtLink :to="`/store/${slug}/admin/inventario`" class="nav-link flex items-center gap-2">
          <Package class="h-4 w-4" aria-hidden="true" />
          Inventario
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/productos`" class="nav-link flex items-center gap-2">
          <Tag class="h-4 w-4" aria-hidden="true" />
          Productos
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/admin/resenas`" class="nav-link flex items-center gap-2">
          <Star class="h-4 w-4" aria-hidden="true" />
          Reseñas
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/admin/cms`" class="nav-link flex items-center gap-2">
          <Palette class="h-4 w-4" aria-hidden="true" />
          Personalización
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/admin/faq`" class="nav-link flex items-center gap-2">
          <CircleHelp class="h-4 w-4" aria-hidden="true" />
          FAQ
        </NuxtLink>

        <NuxtLink :to="`/store/${slug}/admin/pagos`" class="nav-link flex items-center gap-2">
          <Wallet class="h-4 w-4" aria-hidden="true" />
          Pagos
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTenantStore } from '~/stores/tenant'
import { Package, Tag, Star, Palette, CircleHelp, Wallet } from 'lucide-vue-next'

const route = useRoute()
const tenant = useTenantStore()
const slug = computed(() => {
  const fromRoute = route.params.slug as string | undefined
  if (fromRoute && !tenant.slug) tenant.setSlug(fromRoute)
  return fromRoute || tenant.slug || ''
})
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
