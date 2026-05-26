export default defineNuxtRouteMiddleware((to) => {
  const missingPrefixes = [
    '/login',
    '/register',
    '/dashboard',
    '/marketplace',
    '/tiendas',
    '/profile',
    '/notificaciones',
  ]

  const shouldRedirect = missingPrefixes.some((prefix) => to.path === prefix || to.path.startsWith(`${prefix}/`))

  if (shouldRedirect) {
    return navigateTo('/', { replace: true })
  }
})
