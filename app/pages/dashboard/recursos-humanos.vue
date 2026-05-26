<template>
  <ClientOnly>
    <div class="min-h-screen bg-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <nav class="flex flex-wrap items-center justify-center gap-2">
        <NuxtLink
          v-for="link in dashboardLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg"
          :class="route.path === link.to ? 'ring-2 ring-white/40' : ''"
          :style="{ background: link.color }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Dashboard</p>
          <h1 class="text-3xl font-extrabold">Recursos humanos</h1>
          <p class="text-white/70">Visibilidad del equipo activo, roles y movimientos recientes por tienda.</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <NuxtLink
            to="/dashboard"
            class="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:border-white/40"
          >
            Volver
          </NuxtLink>
        </div>
      </header>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="grid gap-4 md:grid-cols-4">
          <div class="space-y-1">
            <label class="text-xs text-white/60">Tienda</label>
            <select v-model="filters.store" class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
              <option disabled value="">Selecciona una tienda</option>
              <option v-for="s in storeOptions" :key="s.slug" :value="s.slug">{{ s.name }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-white/60">Rango</label>
            <p class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">Últimos 30 días</p>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-white/60">Actividad</label>
            <p class="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">Membresias activas</p>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-white/60">Accion</label>
            <button
              class="w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5"
              :style="{ backgroundColor: theme.accent }"
              @click="loadStaff"
              :disabled="loading"
            >
              {{ loading ? 'Actualizando...' : 'Actualizar' }}
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Gestión</p>
            <h2 class="text-xl font-semibold">Agregar usuario al equipo</h2>
            <p class="text-white/70">Usa usuario, email o RUT y asigna uno o más roles.</p>
          </div>
        </div>

        <div class="mt-4 grid gap-4 md:grid-cols-[1fr,2fr,auto]">
          <div class="space-y-1">
            <label class="text-xs text-white/60">Identificador</label>
            <input
              v-model="assignForm.identifier"
              type="text"
              class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2"
              placeholder="usuario, email o 12.345.678-5"
            />
          </div>

          <div class="space-y-1">
            <label class="text-xs text-white/60">Roles</label>
            <div class="grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-2 lg:grid-cols-3">
              <label v-for="role in availableRoles" :key="role.code" class="inline-flex items-center gap-2 text-sm text-white/90">
                <input
                  type="checkbox"
                  :value="role.code"
                  :checked="assignForm.roles.includes(role.code)"
                  @change="toggleRole(role.code)"
                />
                {{ role.label }}
              </label>
            </div>
          </div>

          <div class="space-y-1">
            <label class="text-xs text-white/60">Acción</label>
            <button
              class="w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5 disabled:opacity-60"
              :style="{ backgroundColor: theme.accent }"
              :disabled="assigning"
              @click="assignUser"
            >
              {{ assigning ? 'Guardando...' : 'Asignar roles' }}
            </button>
          </div>
        </div>

        <p v-if="assignMessage" class="mt-3 text-sm" :class="assignError ? 'text-rose-200' : 'text-emerald-200'">
          {{ assignMessage }}
        </p>
      </section>

      <div v-if="loadError" class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
        {{ loadError }}
      </div>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="card in summaryCards" :key="card.label" class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">{{ card.label }}</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ card.value }}</p>
          <p class="text-xs text-white/60">{{ card.note }}</p>
        </div>
      </section>

      <section class="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Roles</p>
              <h2 class="text-xl font-semibold">Distribución del equipo</h2>
            </div>
            <span class="text-xs text-white/60">{{ staff.length }} miembros</span>
          </div>
          <div v-if="!roleSummary.length" class="mt-4 text-white/70">Sin datos.</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="role in roleSummary" :key="role.label" class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p class="font-semibold text-white">{{ role.label }}</p>
              <span class="text-xs text-white/60">{{ role.count }} personas</span>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Movimientos</p>
              <h2 class="text-xl font-semibold">Ingresos recientes</h2>
            </div>
            <span class="text-xs text-white/60">30 días</span>
          </div>
          <div v-if="!recentHires.length" class="mt-4 text-white/70">Sin ingresos recientes.</div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="person in recentHires" :key="person.user.id" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
              <p class="font-semibold text-white">{{ fullName(person.user) }}</p>
              <p class="text-xs text-white/60">{{ person.user.email || 'Sin email' }}</p>
              <p class="text-xs text-white/60">Ingreso: {{ formatDate(person.created_at) }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Equipo</p>
            <h2 class="text-xl font-semibold">Listado de personal</h2>
          </div>
          <span class="text-xs text-white/60">Última actualización: {{ lastUpdatedLabel }}</span>
        </div>
        <div v-if="!staff.length" class="mt-4 text-white/70">Sin datos para esta tienda.</div>
        <div v-else class="mt-4 grid gap-4 lg:grid-cols-[1fr,0.92fr]">
          <div class="space-y-3">
            <button
              v-for="member in pagedStaff"
              :key="member.user.id"
              type="button"
              class="w-full rounded-2xl border px-4 py-3 text-left text-sm transition"
              :class="selectedMember?.user.id === member.user.id ? 'border-white/40 bg-white/10 shadow-lg' : 'border-white/10 bg-white/5 hover:bg-white/8'"
              @click="selectedMember = member"
            >
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p class="font-semibold text-white">{{ fullName(member.user) }}</p>
                  <p class="text-xs text-white/60">{{ member.user.email || 'Sin email' }}</p>
                </div>
                <span class="text-xs" :class="member.is_active ? 'text-emerald-200' : 'text-rose-200'">
                  {{ member.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span v-for="role in member.roles" :key="role" class="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-white/80">
                  {{ roleLabel(role) }}
                </span>
              </div>
              <div class="mt-2 text-xs text-white/60">
                Ingreso: {{ formatDate(member.created_at) }} • Antigüedad: {{ formatTenure(member.created_at) }}
              </div>
            </button>
            <div v-if="staffTotalPages > 1" class="flex items-center justify-between text-xs text-white/70">
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="staffPage === 1" @click="staffPage--">Anterior</button>
              <span>Página {{ staffPage }} / {{ staffTotalPages }}</span>
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="staffPage === staffTotalPages" @click="staffPage++">Siguiente</button>
            </div>
          </div>

          <aside class="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-inner">
            <template v-if="selectedMember">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ficha laboral</p>
                  <h3 class="mt-1 text-2xl font-semibold text-white">{{ fullName(selectedMember.user) }}</h3>
                  <p class="text-sm text-white/60">{{ selectedMember.user.username }}</p>
                </div>
                <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="selectedMember.is_active ? 'bg-emerald-500/15 text-emerald-200' : 'bg-rose-500/15 text-rose-200'">
                  {{ selectedMember.is_active ? 'Vigente' : 'Inactivo' }}
                </span>
              </div>

              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">RUT</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ selectedMember.user.rut || 'No registrado' }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Correo</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ selectedMember.user.email || 'No registrado' }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Teléfono</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ selectedMember.user.phone || 'No registrado' }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Último acceso</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ formatDate(selectedMember.user.last_login) }}</p>
                </div>
              </div>

              <div class="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Dirección</p>
                <p class="mt-1 text-sm font-semibold text-white">{{ selectedMember.user.address || 'No registrada' }}</p>
              </div>

              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Ingreso al cargo</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ formatDate(selectedMember.created_at) }}</p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Antigüedad</p>
                  <p class="mt-1 text-sm font-semibold text-white">{{ formatTenure(selectedMember.created_at) }}</p>
                </div>
              </div>

              <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Roles</p>
                <div class="mt-2 flex flex-wrap gap-2">
                  <span v-for="role in selectedMember.roles" :key="role" class="rounded-full border border-white/15 px-2 py-0.5 text-[11px] text-white/80">
                    {{ roleLabel(role) }}
                  </span>
                </div>
              </div>

              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Email verificado</p>
                  <p class="mt-1 text-sm font-semibold" :class="selectedMember.user.is_email_verified ? 'text-emerald-200' : 'text-amber-200'">
                    {{ selectedMember.user.is_email_verified ? 'Sí' : 'No' }}
                  </p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-[11px] uppercase tracking-[0.2em] text-white/50">Teléfono verificado</p>
                  <p class="mt-1 text-sm font-semibold" :class="selectedMember.user.is_phone_verified ? 'text-emerald-200' : 'text-amber-200'">
                    {{ selectedMember.user.is_phone_verified ? 'Sí' : 'No' }}
                  </p>
                </div>
              </div>
            </template>
            <div v-else class="flex h-full items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center text-sm text-white/60">
              Selecciona una persona para ver su ficha laboral.
            </div>
          </aside>
        </div>
      </section>
    </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useDashboardAccess } from '~/composables/useDashboardAccess'

definePageMeta({ middleware: ['auth'], requiresAuth: true, ssr: false })

type StoreLite = { id: number; name: string; slug: string }
type MembershipLite = { store: StoreLite; roles: string[] }

type StaffUser = {
  id: number
  username: string
  first_name?: string
  last_name?: string
  email?: string
  is_staff?: boolean
  last_login?: string | null
  rut?: string | null
  address?: string
  phone?: string
  avatar_url?: string | null
  profile_updated_at?: string | null
  is_email_verified?: boolean
  email_verified_at?: string | null
  is_phone_verified?: boolean
  phone_verified_at?: string | null
}

type StaffMember = {
  user: StaffUser
  roles: string[]
  is_active: boolean
  created_at: string
}

const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()
const { dashboardLinks } = useDashboardAccess()
const config = useRuntimeConfig()
const apiBase = String(config.public.apiBase || '')

const stores = ref<StoreLite[]>([])
const filters = ref({ store: '' })
const staff = ref<StaffMember[]>([])
const selectedMember = ref<StaffMember | null>(null)
const loading = ref(false)
const loadError = ref('')
const lastUpdated = ref<Date | null>(null)
const assigning = ref(false)
const assignMessage = ref('')
const assignError = ref(false)
const staffPage = ref(1)
const staffPageSize = 12

const availableRoles = [
  { code: 'ADMIN', label: 'Administrador' },
  { code: 'HR', label: 'Recursos Humanos' },
  { code: 'FINANCE', label: 'Finanzas' },
  { code: 'REPORTS', label: 'Reportes' },
  { code: 'DATA_ANALYST', label: 'Analista de datos' },
  { code: 'INVENTORY', label: 'Inventario' },
  { code: 'EDITOR', label: 'Editor' },
]

const assignForm = ref({ identifier: '', roles: ['FINANCE'] as string[] })

const allowedStoreSlugs = computed(() => {
  const memberships = (auth.user?.memberships || []) as MembershipLite[]
  const allowed = new Set(['ADMIN', 'HR'])
  const slugs = new Set<string>()
  for (const membership of memberships) {
    if (membership.roles?.some((role) => allowed.has(role))) {
      slugs.add(membership.store.slug)
    }
  }
  return slugs
})

const storeOptions = computed(() => {
  if (!auth.user?.memberships?.length) return stores.value
  if (!allowedStoreSlugs.value.size) return []
  return stores.value.filter((s) => allowedStoreSlugs.value.has(s.slug))
})

const summaryCards = computed(() => {
  const total = staff.value.length
  const active = staff.value.filter((m) => m.is_active).length
  const admins = staff.value.filter((m) => m.roles.includes('ADMIN')).length
  const avgTenure = averageTenureDays.value
  return [
    { label: 'Equipo total', value: total, note: 'Membresías registradas' },
    { label: 'Activos', value: active, note: 'Con acceso vigente' },
    { label: 'Admins', value: admins, note: 'Rol administrador' },
    { label: 'Antigüedad promedio', value: avgTenure ? `${avgTenure} días` : '—', note: 'Promedio del equipo' },
  ]
})

const roleSummary = computed(() => {
  const counter: Record<string, number> = { ADMIN: 0, EDITOR: 0, INVENTORY: 0, REPORTS: 0, HR: 0, FINANCE: 0, DATA_ANALYST: 0 }
  staff.value.forEach((member) => {
    member.roles.forEach((role) => {
      counter[role] = (counter[role] || 0) + 1
    })
  })
  return Object.entries(counter)
    .map(([label, count]) => ({ label: roleLabel(label), count }))
    .filter((row) => row.count > 0)
})

const recentHires = computed(() => {
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
  return staff.value.filter((m) => new Date(m.created_at).getTime() >= cutoff)
})

const staffTotalPages = computed(() => Math.max(1, Math.ceil(staff.value.length / staffPageSize)))

const pagedStaff = computed(() => {
  const start = (staffPage.value - 1) * staffPageSize
  return staff.value.slice(start, start + staffPageSize)
})

const averageTenureDays = computed(() => {
  if (!staff.value.length) return 0
  const now = Date.now()
  const sum = staff.value.reduce((acc, member) => acc + (now - new Date(member.created_at).getTime()), 0)
  return Math.round(sum / staff.value.length / (24 * 60 * 60 * 1000))
})

const lastUpdatedLabel = computed(() => (lastUpdated.value ? lastUpdated.value.toLocaleString() : '—'))

const fullName = (user: StaffUser) => {
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim()
  return name || user.username
}

const roleLabel = (role: string) => {
  const map: Record<string, string> = {
    ADMIN: 'Administrador',
    EDITOR: 'Editor',
    INVENTORY: 'Inventario',
    REPORTS: 'Reportes',
    HR: 'Recursos Humanos',
    FINANCE: 'Finanzas',
    DATA_ANALYST: 'Analista de datos',
  }
  return map[role] || role
}

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: '2-digit' })
}

const formatTenure = (createdAt: string) => {
  const now = Date.now()
  const start = new Date(createdAt).getTime()
  if (!start) return '—'
  const days = Math.max(0, Math.floor((now - start) / (24 * 60 * 60 * 1000)))
  return `${days} días`
}

const ensureAuthReady = async () => {
  return Boolean(await auth.initializeSession({ forceProfile: true }))
}

const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
  if (!auth.token) throw new Error('No autenticado')
  const doFetch = (token: string) =>
    $fetch<T>(url as any, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
    })

  try {
    return await doFetch(auth.token)
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) return doFetch(refreshed)
    }
    throw error
  }
}

const loadStaff = async () => {
  loadError.value = ''
  if (!filters.value.store) {
    loadError.value = 'Selecciona una tienda para ver recursos humanos.'
    return
  }
  loading.value = true
  try {
    const payload = await authedFetch<StaffMember[]>(`${apiBase}/stores/${filters.value.store}/staff/`)
    staff.value = [...(payload || [])].sort((a, b) => {
      const aAdmin = a.roles.includes('ADMIN') ? 1 : 0
      const bAdmin = b.roles.includes('ADMIN') ? 1 : 0
      if (aAdmin !== bAdmin) return bAdmin - aAdmin
      const aName = fullName(a.user).toLowerCase()
      const bName = fullName(b.user).toLowerCase()
      return aName.localeCompare(bName)
    })
    staffPage.value = 1
    selectedMember.value = staff.value[0] || null
    lastUpdated.value = new Date()
  } catch (error: any) {
    const detail = error?.response?._data?.detail || 'No pudimos cargar recursos humanos.'
    loadError.value = detail
    staff.value = []
  } finally {
    loading.value = false
  }
}

const toggleRole = (roleCode: string) => {
  const current = new Set(assignForm.value.roles)
  if (current.has(roleCode)) {
    current.delete(roleCode)
  } else {
    current.add(roleCode)
  }
  assignForm.value.roles = Array.from(current)
}

const assignUser = async () => {
  assignMessage.value = ''
  assignError.value = false
  const identifier = assignForm.value.identifier.trim()
  if (!filters.value.store) {
    assignMessage.value = 'Selecciona una tienda antes de asignar roles.'
    assignError.value = true
    return
  }
  if (!identifier) {
    assignMessage.value = 'Debes ingresar usuario, email o RUT.'
    assignError.value = true
    return
  }
  if (!assignForm.value.roles.length) {
    assignMessage.value = 'Debes seleccionar al menos un rol.'
    assignError.value = true
    return
  }

  assigning.value = true
  try {
    await authedFetch(`${apiBase}/stores/${filters.value.store}/staff/`, {
      method: 'POST',
      body: { identifier, roles: assignForm.value.roles, is_active: true },
    })
    assignMessage.value = 'Roles actualizados correctamente.'
    assignForm.value.identifier = ''
    await loadStaff()
  } catch (error: any) {
    assignError.value = true
    const detail = error?.response?._data
    if (detail && typeof detail === 'object') {
      assignMessage.value = Object.values(detail).flat().join(' ') || 'No pudimos asignar los roles.'
    } else {
      assignMessage.value = detail || 'No pudimos asignar los roles.'
    }
  } finally {
    assigning.value = false
  }
}

onMounted(async () => {
  const ready = await ensureAuthReady()
  if (!ready) {
    await navigateTo('/login')
    return
  }
  stores.value = await auth.fetchMyStores()
  if (!storeOptions.value.length) {
    loadError.value = 'No tienes permisos de recursos humanos para ninguna tienda.'
    theme.applyTheme()
    return
  }
  const firstStore = stores.value[0]
  if (firstStore?.slug) {
    filters.value.store = storeOptions.value[0]?.slug || firstStore.slug
    await loadStaff()
  } else {
    loadError.value = 'No tienes tiendas asignadas. Debes tener al menos una para ver recursos humanos.'
  }
  theme.applyTheme()
})

watch(staff, () => {
  if (staffPage.value > staffTotalPages.value) staffPage.value = staffTotalPages.value
  if (selectedMember.value && !staff.value.some((member) => member.user.id === selectedMember.value?.user.id)) {
    selectedMember.value = staff.value[0] || null
  }
})

watch(pagedStaff, () => {
  if (!selectedMember.value && pagedStaff.value.length) {
    selectedMember.value = pagedStaff.value[0]
  }
})
</script>
