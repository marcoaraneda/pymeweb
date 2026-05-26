import { defineNuxtRouteMiddleware } from "nuxt/app"
import { useTenantStore } from "~/stores/tenant"
import type { Pinia } from 'pinia' // Importa el tipo

export default defineNuxtRouteMiddleware((to) => {
  // Solo ejecutamos si hay slug y estamos en el cliente/servidor con contexto listo
  const slug = to.params.slug as string
  if (slug) {
    const tenantStore = useTenantStore() 
    tenantStore.setSlug(slug)
  }
})