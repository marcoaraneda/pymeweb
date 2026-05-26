import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useAuthStore } from "~/stores/auth"
import { useTenantStore } from "~/stores/tenant"

export default defineNuxtRouteMiddleware(async (to) => {
  const slug = to.params.slug as string | undefined
  const needsAuth = Boolean(to.meta?.requiresAuth) || (to.path.includes('/admin') && !to.path.includes('/login'))
  if (!needsAuth) return

  const auth = useAuthStore()
  const tenant = useTenantStore()

  if (slug) tenant.setSlug(slug)

  const loginPath = '/login'

  auth.restoreFromCookies()
  if (!auth.token) {
    return navigateTo(loginPath)
  }

  const profile = await auth.initializeSession({ forceProfile: true })
  if (!profile && auth.token && auth.isProfileBackoffActive) {
    // Keep the session during short-lived profile rate-limit windows.
    return
  }
  if (!auth.token || !profile) {
    return navigateTo(loginPath)
  }
})