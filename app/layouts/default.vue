<template>
  <div
    class="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900"
    :class="{ 'premium-shell': !isDashboardRoute }"
  >
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-5 sm:py-4">
        <NuxtLink to="/" class="flex items-center gap-3 font-semibold text-slate-900">
          <img src="/logoPW.png" alt="Pymeweb" class="h-9 w-9 rounded-full object-contain" />
          <div class="hidden lg:block">
            <p class="layout-brand-title leading-none">Pymeweb</p>
            <p class="layout-brand-subtitle text-xs text-slate-500">Marketplace multi-tienda</p>
          </div>
        </NuxtLink>

        <nav class="hidden items-center gap-2 xl:gap-3 md:flex">
          <NuxtLink
            to="/"
            :class="mainNavClassFor('/', true)"
          >
            <House class="h-4 w-4" aria-hidden="true" />
            Inicio
          </NuxtLink>
          <NuxtLink
            to="/tiendas"
            :class="mainNavClassFor('/tiendas')"
          >
            <ShoppingBag class="h-4 w-4" aria-hidden="true" />
            Ver tiendas
          </NuxtLink>
          <NuxtLink
            v-if="isHydrated && auth.isAuthenticated && hasDashboardAccess"
            :to="defaultDashboardRoute"
            :class="mainNavClassFor(defaultDashboardRoute)"
            @click.prevent="goDashboard"
          >
            <LayoutDashboard class="h-4 w-4" aria-hidden="true" />
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/marketplace"
            :class="mainNavClassFor('/marketplace')"
          >
            <StoreIcon class="h-4 w-4" aria-hidden="true" />
            Marketplace
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-2 lg:gap-3">
          <NuxtLink
            v-if="isMarketplaceRoute"
            to="/marketplace/carrito"
            class="relative hidden h-11 w-11 items-center justify-center rounded-xl text-white shadow md:inline-flex"
            :style="{ backgroundColor: '#f59e0b' }"
            aria-label="Carrito marketplace"
            @click="handleMarketplaceCartClick"
          >
            <ShoppingCart class="h-5 w-5" aria-hidden="true" />
            <span
              v-if="isHydrated && cart.totalItems > 0"
              class="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-900 px-1 text-xs font-semibold text-white"
            >
              {{ cart.totalItems }}
            </span>
          </NuxtLink>
          <button
            class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-800 glass-btn"
            aria-label="Abrir menu"
            @click.stop="showMenuMobile = !showMenuMobile"
          >
            <span class="flex flex-col items-center justify-center gap-1" aria-hidden="true">
              <span class="h-[2px] w-5 rounded bg-slate-800" />
              <span class="h-[2px] w-5 rounded bg-slate-800" />
              <span class="h-[2px] w-5 rounded bg-slate-800" />
            </span>
          </button>
          

          <NuxtLink
            v-if="!isHydrated || !auth.isAuthenticated"
            to="/login"
            class="layout-main-nav-btn hidden h-10 min-w-[120px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#0f274f]/20 bg-[#0f274f]/5 px-3 text-xs font-semibold text-[#0f274f] transition hover:bg-[#0f274f]/10 md:inline-flex lg:h-11 lg:min-w-[144px] lg:px-4 lg:text-sm"
          >
            <LogIn class="h-4 w-4" aria-hidden="true" />
            Iniciar sesión
          </NuxtLink>

          <div v-else-if="isHydrated" class="relative flex items-center gap-2 lg:gap-3" ref="menuRef">
            <div class="relative inline-flex items-center">
              <button
                class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm glass-btn"
                ref="notifBtnRef"
                @click.stop="showNotifications = !showNotifications"
              >
                <Bell class="h-5 w-5" aria-hidden="true" />
                <span
                  v-if="notificationsCount > 0"
                  class="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white"
                >
                  {{ notificationsCount }}
                </span>
              </button>
              <teleport to="body">
                <div v-if="showNotifications">
                  <div class="fixed inset-0 z-[99999]" @click="showNotifications = false"></div>
                  <div
                    class="fixed z-[100000] w-[min(20rem,calc(100vw-1rem))] rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-lg max-h-[min(26rem,calc(100vh-6rem))] overflow-hidden"
                    :style="notifMenuStyle"
                  >
                    <div class="flex items-center justify-between">
                      <p class="font-semibold text-slate-800">Notificaciones</p>
                    </div>
                    <div class="mt-2 space-y-2 max-h-60 overflow-y-auto">
                      <p v-if="!unreadNotifications.length" class="text-slate-500">Sin notificaciones.</p>
                      <div
                        v-else
                        v-for="(n, idx) in unreadNotifications"
                        :key="idx"
                        class="w-full rounded-lg border border-slate-100 px-2 py-1 text-slate-700"
                      >
                        {{ n.message }}
                      </div>
                    </div>
                    <div class="mt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 hover:border-slate-300"
                        @click="clearNotifications"
                      >
                        Borrar notificaciones
                      </button>
                      <button
                        type="button"
                        class="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                        @click="goNotifications"
                      >
                        Ver notificaciones
                      </button>
                    </div>
                  </div>
                </div>
              </teleport>
            </div>
            <button
              class="layout-main-nav-btn hidden h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-2 text-sm font-semibold text-slate-800 glass-btn md:flex lg:w-40 lg:px-4"
              @click.stop="showMenu = !showMenu"
            >
              <span
                v-if="avatarUrl"
                class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/15"
              >
                <img :key="avatarUrl" :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
              </span>
              <span
                v-else
                class="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs uppercase"
              >
                {{ initials }}
              </span>
              <span class="hidden min-w-0 flex-1 truncate lg:block">{{ auth.user?.username || 'Perfil' }}</span>
            </button>
            <div
              v-if="showMenu"
              class="absolute right-0 top-full z-[100001] mt-2 w-[min(18rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] rounded-xl border border-slate-200 bg-white py-2 text-sm shadow-lg max-h-[calc(100vh-7rem)] overflow-y-auto"
            >
              <NuxtLink to="/seguimiento" class="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition">
                <Eye class="h-4 w-4 flex-shrink-0" />
                <span>Seguimiento</span>
              </NuxtLink>
              <NuxtLink v-if="myMarketplaceProfilePath" :to="myMarketplaceProfilePath" class="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition">
                <StoreIcon class="h-4 w-4 flex-shrink-0" />
                <span>Perfil Marketplace</span>
              </NuxtLink>
              <NuxtLink to="/profile" class="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition">
                <User class="h-4 w-4 flex-shrink-0" />
                <span>Editar perfil</span>
              </NuxtLink>
              <NuxtLink v-if="isPlatformAdmin" to="/administracion-tiendas" class="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition">
                <ShieldCheck class="h-4 w-4 flex-shrink-0" />
                <span>Administración</span>
              </NuxtLink>
              <button class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition" @click="auth.logout()">
                <LogOut class="h-4 w-4 flex-shrink-0" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showMenuMobile" class="border-t border-slate-200 bg-white/95 px-4 py-4 text-sm md:hidden">
        <div class="mx-auto flex max-w-2xl flex-col gap-3">
          <div v-if="isHydrated && auth.isAuthenticated" class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <div class="flex items-center gap-3">
              <span v-if="avatarUrl" class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white">
                <img :key="avatarUrl" :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
              </span>
              <span v-else class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold uppercase text-white">
                {{ initials }}
              </span>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-slate-900">{{ auth.user?.username || 'Perfil' }}</p>
                <p class="truncate text-xs text-slate-500">{{ myMarketplaceProfilePath ? 'Perfil marketplace activo' : 'Sesión iniciada' }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
          <NuxtLink to="/" class="rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10">Inicio</NuxtLink>
          <NuxtLink to="/tiendas" class="rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10">Ver tiendas</NuxtLink>
          <NuxtLink v-if="isHydrated && auth.isAuthenticated && hasDashboardAccess" :to="defaultDashboardRoute" class="rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10" @click.prevent="goDashboard">Dashboard</NuxtLink>
          <NuxtLink to="/marketplace" class="rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10">Marketplace</NuxtLink>
          <NuxtLink
            v-if="isMarketplaceRoute"
            to="/marketplace/carrito"
            class="rounded-lg px-3 py-2 hover:bg-slate-100 text-amber-700"
            @click="handleMarketplaceCartClick"
          >
            Carrito marketplace
          </NuxtLink>
          <div class="my-2 border-t border-slate-200" />
          <NuxtLink v-if="isHydrated && auth.isAuthenticated" to="/seguimiento" class="rounded-lg px-3 py-2 hover:bg-slate-100">Ver seguimiento</NuxtLink>
          <NuxtLink v-if="isHydrated && auth.isAuthenticated && myMarketplaceProfilePath" :to="myMarketplaceProfilePath" class="rounded-lg px-3 py-2 hover:bg-slate-100">Ver perfil marketplace</NuxtLink>
          <NuxtLink v-if="isHydrated && auth.isAuthenticated" to="/profile" class="rounded-lg px-3 py-2 hover:bg-slate-100">Editar perfil</NuxtLink>
          <NuxtLink v-if="isHydrated && auth.isAuthenticated && isPlatformAdmin" to="/administracion-tiendas" class="rounded-lg px-3 py-2 hover:bg-slate-100">Administración</NuxtLink>
          <button v-if="isHydrated && auth.isAuthenticated" class="rounded-lg px-3 py-2 text-left text-red-600 hover:bg-slate-100" @click="handleLogout">Cerrar sesión</button>
          <NuxtLink v-if="!isHydrated || !auth.isAuthenticated" to="/login" class="rounded-lg px-3 py-2 hover:bg-slate-100">Iniciar sesión</NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <main class="reveal" style="animation-delay: 0.04s;">
      <slot />
    </main>

    <ClientOnly>
      <ChatBot />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useCartStore } from '~/stores/cart'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { Bell, ShoppingCart, LayoutDashboard, LogIn, Store as StoreIcon, ShoppingBag, House, Eye, User, LogOut, ShieldCheck } from 'lucide-vue-next'
import ChatBot from '~/components/ChatBot.vue'
import { useNotificationStore } from '~/stores/notifications'
import { useDashboardAccess } from '~/composables/useDashboardAccess'

const auth = useAuthStore()
const theme = useThemeStore()
const cart = useCartStore()
const { defaultDashboardRoute, hasStores: hasDashboardAccess } = useDashboardAccess()
// Corrige warning: handleMarketplaceCartClick no estaba definido
const handleMarketplaceCartClick = () => {
  try {
    console.debug('[UI] handleMarketplaceCartClick invoked')
    cart.setContext('marketplace')
  } catch (e) {
    console.warn('[UI] handleMarketplaceCartClick error', e)
  }
}
const config = useRuntimeConfig()
const route = useRoute()
const router = useRouter()
const isDashboardRoute = computed(() => route.path === '/dashboard' || route.path.startsWith('/dashboard/'))
const showMenu = ref(false)
const showMenuMobile = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const avatarUrl = computed(() => {
  const base = auth.user?.avatar_url
  if (!base) return null
  const version = auth.user?.avatar_updated_at
  if (!version) return base
  const joiner = base.includes('?') ? '&' : '?'
  return `${base}${joiner}v=${encodeURIComponent(version)}`
})
const myMarketplaceProfilePath = computed(() => {
  const id = (auth.user as any)?.id
  return id ? `/marketplace/vendedores/${id}` : ''
})
const isPlatformAdmin = computed(() => auth.user?.username === 'marko2blea')
const initials = computed(() => (auth.user?.username || 'U').slice(0, 2).toUpperCase())
const accentColor = computed(() => theme.accent || '#2563eb')
const isMarketplaceRoute = computed(() => route.path.startsWith('/marketplace'))
const mainNavBaseClass = 'layout-main-nav-btn inline-flex h-10 min-w-[112px] shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 lg:h-11 lg:min-w-[136px] lg:px-4 lg:text-sm'
const mainNavClassFor = (targetPath: string, exact = false) => {
  const isActive = exact ? route.path === targetPath : route.path === targetPath || route.path.startsWith(`${targetPath}/`)
  return isActive
    ? `${mainNavBaseClass} border-[#0f274f] bg-[#0f274f] text-white hover:bg-[#103264]`
    : `${mainNavBaseClass} border-[#0f274f]/20 bg-white text-[#0f274f] hover:bg-[#0f274f]/5`
}
type NotificationItem = { type: string; message: string; count: number; store?: string }
type DashboardSummary = { notifications?: NotificationItem[] }
const notificationStore = useNotificationStore()
const notifBtnRef = ref<HTMLElement | null>(null)
const notifMenuStyle = ref('')
const unreadNotifications = computed(() => notificationStore.unread)
const notificationsCount = computed(() => notificationStore.totalUnread)
const showNotifications = ref(false)
const isHydrated = ref(false)
let notificationsPoller: ReturnType<typeof setInterval> | null = null

const handleOutside = (event: MouseEvent) => {
  if (!menuRef.value) return
  if (!menuRef.value.contains(event.target as Node)) {
    showMenu.value = false
    showNotifications.value = false
  }
}

const loadNotifications = async () => {
  if (!auth.token) {
    notificationStore.setUnread([])
    return
  }
  try {
    const data = await $fetch<DashboardSummary>(`${config.public.apiBase}/support/dashboard/summary/`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    notificationStore.setUnread(data?.notifications || [])
  } catch (error) {
    console.warn('No se pudieron cargar notificaciones', error)
    notificationStore.setUnread([])
  }
}

const positionNotifMenu = async () => {
  if (!showNotifications.value) return
  await nextTick()
  if (notifBtnRef.value) {
    const rect = notifBtnRef.value.getBoundingClientRect()
    if (window.innerWidth < 640) {
      const menuWidth = Math.max(260, window.innerWidth - 16)
      notifMenuStyle.value = `top: ${Math.max(12, rect.bottom + 8)}px; left: 8px; width: ${menuWidth}px;`
      return
    }
    const menuWidth = Math.min(320, window.innerWidth - 16)
    const maxLeft = Math.max(8, window.innerWidth - menuWidth - 8)
    const left = Math.min(Math.max(8, rect.left), maxLeft)
    notifMenuStyle.value = `top: ${rect.bottom + 8}px; left: ${left}px; width: ${menuWidth}px;`
  }
}

const clearNotifications = () => {
  notificationStore.dismissAll()
  showNotifications.value = false
}

const goDashboard = async () => {
  showMenu.value = false
  showMenuMobile.value = false
  showNotifications.value = false
  await navigateTo(defaultDashboardRoute.value)
}

const goNotifications = async () => {
  showNotifications.value = false
  await nextTick()
  await navigateTo('/notificaciones')
}

const handleLogout = () => {
  showMenu.value = false
  showMenuMobile.value = false
  auth.logout()
}

onMounted(async () => {
  await auth.initializeSession()
  notificationStore.loadHistory()
  cart.loadFromStorage()
  cart.setContext('marketplace')
  theme.loadFromStorage()
  theme.resetToBase()
  await loadNotifications()
  if (import.meta.client) {
    notificationsPoller = setInterval(() => {
      loadNotifications()
    }, 30000)
  }
  isHydrated.value = true
  document.addEventListener('click', handleOutside)
  window.addEventListener('resize', positionNotifMenu)
  // debug: log navigations
  try {
    router.afterEach((to, from) => {
      // eslint-disable-next-line no-console
      console.debug('[router] afterEach', { to: to.fullPath, from: from.fullPath })
    })
  } catch (e) {
    /* ignore */
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutside)
  window.removeEventListener('resize', positionNotifMenu)
  if (notificationsPoller) {
    clearInterval(notificationsPoller)
    notificationsPoller = null
  }
})

watch(
  () => route.fullPath,
  () => {
    showMenu.value = false
    showMenuMobile.value = false
    showNotifications.value = false
  }
)

watch(
  () => showNotifications.value,
  (isOpen) => {
    if (isOpen) positionNotifMenu()
  }
)

</script>
