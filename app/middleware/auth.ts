import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app"
import { useAuthStore } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  if (!auth.token && to.path.includes('/admin') && !to.path.includes('/login')) {
    return navigateTo(`/store/${to.params.slug}/admin/login`)
  }
})