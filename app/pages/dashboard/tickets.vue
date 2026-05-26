<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div class="mx-auto max-w-6xl px-6 py-10 space-y-8">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Soporte</p>
          <h1 class="text-3xl font-extrabold">Tickets</h1>
          <p class="text-white/70">Revisa y da seguimiento a tickets abiertos por las tiendas.</p>
        </div>
        <NuxtLink to="/dashboard" class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" :style="{ backgroundColor: theme.accent }">Regresar</NuxtLink>
      </header>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex flex-wrap items-center gap-3">
          <label class="text-sm text-white/70">Tipo</label>
          <select v-model="kind" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900">
            <option value="">Todos</option>
            <option value="support">Soporte</option>
            <option v-if="isPlatformAdmin" value="report">Denuncia</option>
          </select>
          <label class="text-sm text-white/70">Estado</label>
          <select v-model="status" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900">
            <option value="">Todos</option>
            <option value="open">Abierto</option>
            <option value="in_progress">En progreso</option>
            <option value="resolved">Resuelto</option>
            <option value="closed">Cerrado</option>
          </select>
          <label class="text-sm text-white/70">Prioridad</label>
          <select v-model="priority" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900">
            <option value="">Todas</option>
            <option value="high">Alta</option>
            <option value="normal">Normal</option>
            <option value="low">Baja</option>
          </select>
          <label class="text-sm text-white/70">Tienda</label>
          <select v-model="storeSlug" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900">
            <option value="">Todas</option>
            <option v-for="s in storesMine" :key="s.slug" :value="s.slug">{{ s.name }}</option>
          </select>
          <label class="text-sm text-white/70">Desde</label>
          <input v-model="dateFrom" type="date" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900" />
          <label class="text-sm text-white/70">Hasta</label>
          <input v-model="dateTo" type="date" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900" />
          <label class="text-sm text-white/70">Buscar</label>
          <input
            v-model.trim="searchTerm"
            type="text"
            placeholder="Titulo, descripcion, tienda o denunciante"
            class="min-w-[240px] rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"
          />
          <span class="ml-auto text-xs text-white/60">{{ activeTickets.length }} activos | {{ resolvedTickets.length }} resueltos</span>
        </div>

        <div v-if="loading" class="mt-4 text-white/70">Cargando...</div>
        <div v-else class="mt-4 space-y-6">
          <div v-if="!activeTickets.length" class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-white/70">No hay tickets activos para mostrar.</div>

          <div v-else class="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]">
            <article v-for="t in paginatedActiveTickets" :key="t.id" class="space-y-4 px-4 py-4">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-white">{{ t.title }}</p>
                  <p class="text-xs text-white/60">{{ t.store_slug || 'Sin tienda' }} • {{ formatStatus(t.status) }} • Prioridad {{ formatPriority(t.priority) }}</p>
                  <p class="text-xs text-white/50">
                    Creado por {{ t.created_by_name || 'Usuario' }} • {{ formatDate(t.created_at) }}
                  </p>
                </div>
                <span :class="['rounded-full px-3 py-1 text-[11px] font-semibold', badgeClass(t.status)]">{{ formatStatus(t.status) }}</span>
              </div>

              <p class="text-sm leading-relaxed text-white/85">{{ t.description }}</p>

              <div class="rounded-xl border border-white/10 bg-slate-900/40 p-3 space-y-3">
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Respuesta del equipo</p>
                <textarea
                  v-model="draftByTicket[t.id].response_message"
                  rows="4"
                  placeholder="Describe resolución, acciones aplicadas, próximos pasos y tiempo estimado."
                  class="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-white/35"
                />

                <div class="grid gap-3 sm:grid-cols-2">
                  <div class="space-y-1">
                    <label class="text-xs text-white/60">Estado</label>
                    <select v-model="draftByTicket[t.id].status" class="w-full rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900">
                      <option value="open">Abierto</option>
                      <option value="in_progress">En progreso</option>
                      <option value="resolved">Resuelto</option>
                      <option value="closed">Cerrado</option>
                    </select>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-white/60">Prioridad</label>
                    <select v-model="draftByTicket[t.id].priority" class="w-full rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900">
                      <option value="low">Baja</option>
                      <option value="normal">Normal</option>
                      <option value="high">Alta</option>
                    </select>
                  </div>
                </div>

                <div class="flex flex-wrap items-center gap-3">
                  <button
                    class="rounded-xl px-3 py-2 text-xs font-semibold text-white"
                    :style="{ backgroundColor: theme.accent }"
                    :disabled="savingTicketId === t.id"
                    @click="saveTicketResponse(t.id)"
                  >
                    {{ savingTicketId === t.id ? 'Guardando...' : 'Guardar respuesta' }}
                  </button>
                  <button
                    class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
                    :disabled="savingTicketId === t.id"
                    @click="setInProgress(t.id)"
                  >
                    Marcar en progreso
                  </button>
                  <span v-if="ticketMessageById[t.id]" class="text-xs" :class="ticketMessageById[t.id].type === 'error' ? 'text-red-300' : 'text-emerald-300'">
                    {{ ticketMessageById[t.id].message }}
                  </span>
                </div>

                <p v-if="t.responded_at" class="text-[11px] text-white/50">
                  Última respuesta: {{ formatDate(t.responded_at) }} por {{ t.responded_by_name || 'equipo de soporte' }}
                </p>
              </div>
            </article>
          </div>

          <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <p class="text-sm font-semibold text-emerald-100">Tickets resueltos y cerrados</p>
              <span class="text-xs text-emerald-200/80">{{ resolvedTickets.length }} registros</span>
            </div>
            <div v-if="!resolvedTickets.length" class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-100/80">
              Aún no hay tickets resueltos para el filtro actual.
            </div>
            <div v-else class="space-y-2">
              <article v-for="t in resolvedTickets" :key="`resolved-${t.id}`" class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-sm font-semibold text-emerald-50">{{ t.title }}</p>
                    <p class="text-xs text-emerald-100/80">{{ t.store_slug || 'Sin tienda' }} • {{ formatStatus(t.status) }} • {{ formatDate(t.updated_at) }}</p>
                  </div>
                  <span class="rounded-full bg-emerald-600/25 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">{{ formatStatus(t.status) }}</span>
                </div>
                <p v-if="t.response_message" class="mt-2 text-xs leading-relaxed text-emerald-50/90">{{ t.response_message }}</p>
              </article>
            </div>
          </div>
        </div>

        <div v-if="activeTickets.length > perPage" class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white/70">
          <button
            class="rounded-lg border border-white/20 px-3 py-1.5 font-semibold hover:bg-white/10 disabled:opacity-40"
            :disabled="page === 1"
            @click="page -= 1"
          >
            Anterior
          </button>
          <p>Mostrando {{ pageStart }}-{{ pageEnd }} de {{ activeTickets.length }}</p>
          <button
            class="rounded-lg border border-white/20 px-3 py-1.5 font-semibold hover:bg-white/10 disabled:opacity-40"
            :disabled="page === totalPages"
            @click="page += 1"
          >
            Siguiente
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { navigateTo, useRuntimeConfig } from 'nuxt/app'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

const auth = useAuthStore()
const theme = useThemeStore()
const config = useRuntimeConfig()
const route = useRoute()

type TicketItem = {
  id: number
  title: string
  description: string
  store_slug?: string
  status: string
  priority: string
  response_message?: string
  created_at?: string
  updated_at?: string
  responded_at?: string
  created_by_name?: string
  responded_by_name?: string
}

const tickets = ref<TicketItem[]>([])
const loading = ref(true)
const kind = ref('')
const status = ref('')
const priority = ref('')
const storeSlug = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const storesMine = ref<{ name: string; slug: string }[]>([])
const page = ref(1)
const searchTerm = ref('')
const savingTicketId = ref<number | null>(null)
const draftByTicket = ref<Record<number, { response_message: string; status: string; priority: string }>>({})
const ticketMessageById = ref<Record<number, { type: 'ok' | 'error'; message: string }>>({})
const perPage = 10
const isPlatformAdmin = computed(() => auth.user?.username === 'marko2blea')

const formatStatus = (value: string) => {
  const map: Record<string, string> = {
    open: 'Abierto',
    in_progress: 'En progreso',
    resolved: 'Resuelto',
    closed: 'Cerrado',
  }
  return map[value] || value
}

const badgeClass = (value: string) => {
  const map: Record<string, string> = {
    open: 'bg-amber-500/20 text-amber-100',
    in_progress: 'bg-sky-500/20 text-sky-100',
    resolved: 'bg-emerald-500/20 text-emerald-100',
    closed: 'bg-slate-500/20 text-slate-100',
  }
  return map[value] || 'bg-white/10 text-white'
}

const formatPriority = (value: string) => {
  const map: Record<string, string> = {
    low: 'Baja',
    normal: 'Normal',
    high: 'Alta',
  }
  return map[value] || value
}

const formatDate = (value?: string) => {
  if (!value) return 'Sin fecha'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString('es-CL', { dateStyle: 'medium', timeStyle: 'short' })
}

const filteredTickets = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return tickets.value
  return tickets.value.filter((ticket) =>
    String(ticket.title || '').toLowerCase().includes(term)
    || String(ticket.description || '').toLowerCase().includes(term)
    || String(ticket.store_slug || '').toLowerCase().includes(term)
    || String(ticket.created_by_name || '').toLowerCase().includes(term)
  )
})

const activeTickets = computed(() => filteredTickets.value.filter((t) => !['resolved', 'closed'].includes(t.status)))
const resolvedTickets = computed(() => filteredTickets.value.filter((t) => ['resolved', 'closed'].includes(t.status)))

const totalPages = computed(() => Math.max(1, Math.ceil(activeTickets.value.length / perPage)))
const paginatedActiveTickets = computed(() => {
  const start = (page.value - 1) * perPage
  return activeTickets.value.slice(start, start + perPage)
})
const pageStart = computed(() => (activeTickets.value.length ? (page.value - 1) * perPage + 1 : 0))
const pageEnd = computed(() => Math.min(page.value * perPage, activeTickets.value.length))

const hydrateDrafts = () => {
  const drafts: Record<number, { response_message: string; status: string; priority: string }> = {}
  tickets.value.forEach((ticket) => {
    drafts[ticket.id] = {
      response_message: String(ticket.response_message || ''),
      status: String(ticket.status || 'open'),
      priority: String(ticket.priority || 'normal'),
    }
  })
  draftByTicket.value = drafts
}

const loadTickets = async () => {
  if (!auth.token) return
  loading.value = true
  try {
    const params: Record<string, string> = {}
    if (kind.value) params.kind = kind.value
    if (status.value) params.status = status.value
    if (priority.value) params.priority = priority.value
    if (storeSlug.value) params.store = storeSlug.value
    if (dateFrom.value) params.date_from = dateFrom.value
    if (dateTo.value) params.date_to = dateTo.value
    tickets.value = await $fetch<TicketItem[]>(`${config.public.apiBase}/support/tickets/`, {
      headers: { Authorization: `Bearer ${auth.token}` },
      params,
    })
    hydrateDrafts()
  } catch (error) {
    console.warn('No se pudieron cargar tickets', error)
    tickets.value = []
    draftByTicket.value = {}
  } finally {
    loading.value = false
  }
}

const saveTicketResponse = async (ticketId: number) => {
  if (!auth.token || !draftByTicket.value[ticketId]) return
  savingTicketId.value = ticketId
  ticketMessageById.value[ticketId] = { type: 'ok', message: '' }
  try {
    const draft = draftByTicket.value[ticketId]
    await $fetch(`${config.public.apiBase}/support/tickets/${ticketId}/`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.token}` },
      body: {
        response_message: draft.response_message,
        status: draft.status,
        priority: draft.priority,
      },
    })
    ticketMessageById.value[ticketId] = { type: 'ok', message: 'Respuesta guardada correctamente.' }
    await loadTickets()
  } catch (error: any) {
    const detail = error?.response?._data
    const message = typeof detail === 'string' ? detail : 'No se pudo guardar la respuesta del ticket.'
    ticketMessageById.value[ticketId] = { type: 'error', message }
  } finally {
    savingTicketId.value = null
  }
}

const setInProgress = async (ticketId: number) => {
  if (!draftByTicket.value[ticketId]) return
  draftByTicket.value[ticketId].status = 'in_progress'
  await saveTicketResponse(ticketId)
}

onMounted(async () => {
  if (!auth.token) {
    auth.restoreFromCookies()
  }
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  await auth.initializeSession().catch(() => null)
  const routeStatus = String(route.query.status || '').trim()
  const routeKind = String(route.query.kind || '').trim()
  const routeStore = String(route.query.store || '').trim()
  if (routeKind) {
    kind.value = routeKind
  } else if (!isPlatformAdmin.value) {
    kind.value = 'support'
  }
  if (routeStatus) status.value = routeStatus
  if (routeStore) storeSlug.value = routeStore
  storesMine.value = await auth.fetchMyStores()
  await loadTickets()
})

watch([kind, status, priority, storeSlug, dateFrom, dateTo], () => loadTickets())

watch([kind, status, priority, storeSlug, dateFrom, dateTo], () => {
  page.value = 1
})

watch(searchTerm, () => {
  page.value = 1
})

watch(tickets, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})
</script>
