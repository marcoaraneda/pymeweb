import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useTenantStore } from "~/stores/tenant"
import { useAuthStore } from '~/stores/auth'
import { recordStoreVisit } from '~/composables/useStoreVisits'

export default defineNuxtRouteMiddleware(async (to) => {
  const slug = to.params.slug as string | undefined
  if (!slug) return

  const tenantStore = useTenantStore()
  const auth = useAuthStore()
  tenantStore.setSlug(slug)

  if (process.client) {
    recordStoreVisit(slug, (auth.user as any)?.id)
  }

  // Si no hay tienda cargada o es otra, intentamos cargarla; si falla, redirigimos
  if (!tenantStore.data || tenantStore.data.slug !== slug) {
    try {
      await tenantStore.fetchTienda()
    } catch (error) {
      return navigateTo('/')
    }
  }
})