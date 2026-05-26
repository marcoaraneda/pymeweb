import { computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export type DashboardSection = 'overview' | 'hr' | 'finance' | 'analytics'

type DashboardLink = {
  key: DashboardSection
  to: string
  label: string
  color: string
}

const DASHBOARD_LINKS: DashboardLink[] = [
  { key: 'overview', to: '/dashboard', label: 'Dashboard', color: '#1d4ed8' },
  { key: 'hr', to: '/dashboard/recursos-humanos', label: 'Recursos Humanos', color: '#b45309' },
  { key: 'finance', to: '/dashboard/analisis-financiero', label: 'Análisis financiero', color: '#0f172a' },
  { key: 'analytics', to: '/dashboard/analisis', label: 'Análisis de datos', color: '#0f766e' },
]

const SECTION_ROLES: Record<DashboardSection, string[]> = {
  overview: [],
  hr: ['ADMIN', 'HR'],
  finance: ['ADMIN', 'REPORTS', 'FINANCE'],
  analytics: ['ADMIN', 'REPORTS', 'DATA_ANALYST'],
}

export const useDashboardAccess = () => {
  const auth = useAuthStore()

  const memberships = computed(() => auth.user?.memberships || [])
  const roleSet = computed(() => {
    const roles = new Set<string>()
    for (const membership of memberships.value) {
      for (const role of membership.roles || []) {
        roles.add(role)
      }
    }
    if (auth.user?.is_staff) {
      roles.add('ADMIN')
    }
    return roles
  })

  const hasStores = computed(() => memberships.value.length > 0)

  const canAccessSection = (section: DashboardSection) => {
    if (section === 'overview') return true
    if (section === 'finance') return true
    if (!hasStores.value) return false
    return SECTION_ROLES[section].some((role) => roleSet.value.has(role))
  }

  const dashboardLinks = computed(() => DASHBOARD_LINKS.filter((link) => canAccessSection(link.key)))
  const defaultDashboardRoute = computed(() => dashboardLinks.value[0]?.to || '/dashboard')

  return {
    dashboardLinks,
    defaultDashboardRoute,
    canAccessSection,
    hasStores,
    roleSet,
  }
}