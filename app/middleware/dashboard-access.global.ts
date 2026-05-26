import { navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'

const sectionByPath = (path: string): 'overview' | 'hr' | 'finance' | 'analytics' | 'other' => {
  if (path === '/dashboard' || path.startsWith('/dashboard/tickets')) return 'overview'
  if (path.startsWith('/dashboard/recursos-humanos')) return 'hr'
  if (path.startsWith('/dashboard/analisis-financiero')) return 'finance'
  if (path.startsWith('/dashboard/analisis')) return 'analytics'
  return 'other'
}

const canAccessByRole = (section: ReturnType<typeof sectionByPath>, roleSet: Set<string>, hasStores: boolean) => {
  if (section === 'other') return hasStores
  if (section === 'overview') return hasStores
  if (section === 'hr') return roleSet.has('ADMIN') || roleSet.has('HR')
  if (section === 'finance') return roleSet.has('ADMIN') || roleSet.has('REPORTS') || roleSet.has('FINANCE')
  if (section === 'analytics') return roleSet.has('ADMIN') || roleSet.has('REPORTS') || roleSet.has('DATA_ANALYST')
  return false
}

const resolveDefaultDashboardRoute = (roleSet: Set<string>, hasStores: boolean) => {
  if (!hasStores) return '/'
  if (roleSet.has('ADMIN') || roleSet.has('HR')) return '/dashboard/recursos-humanos'
  if (roleSet.has('ADMIN') || roleSet.has('REPORTS') || roleSet.has('FINANCE')) return '/dashboard/analisis-financiero'
  if (roleSet.has('ADMIN') || roleSet.has('REPORTS') || roleSet.has('DATA_ANALYST')) return '/dashboard/analisis'
  return '/dashboard'
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (!to.path.startsWith('/dashboard')) return

  const auth = useAuthStore()
  const profile = await auth.initializeSession({ forceProfile: true })

  if (!profile) {
    return navigateTo('/login')
  }

  const memberships = Array.isArray(profile.memberships) ? profile.memberships : []
  const hasStores = memberships.length > 0 || Boolean(profile.is_staff)
  const roles = new Set<string>()

  memberships.forEach((membership) => {
    const roleList = Array.isArray(membership.roles) ? membership.roles : []
    roleList.forEach((role) => roles.add(String(role || '').toUpperCase()))
  })

  if (profile.is_staff) {
    roles.add('ADMIN')
  }

  const section = sectionByPath(to.path)
  if (canAccessByRole(section, roles, hasStores)) {
    return
  }

  return navigateTo(resolveDefaultDashboardRoute(roles, hasStores))
})
