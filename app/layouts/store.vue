<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="relative overflow-hidden border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div class="absolute -left-12 top-6 h-40 w-40 rounded-full" :style="gradientStyle" />
        <div class="absolute -right-10 -bottom-6 h-48 w-48 rounded-full" :style="gradientStyle" />
      </div>
      <div class="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div class="flex items-center gap-3">
          <button
            class="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow ring-1 ring-slate-200"
            :aria-label="canEditBrand ? 'Cambiar imagen de la tienda' : 'Logo de la tienda'"
            :class="canEditBrand ? 'hover:ring-2 hover:ring-slate-300' : ''"
          >
            <img v-if="brandLogo" :src="brandLogo" alt="Logo tienda" class="h-full w-full object-cover" />
            <span v-else class="text-lg font-bold" :style="{ color: accentColor }">{{ brandInitials }}</span>
            <span v-if="canEditBrand" class="absolute inset-0 flex items-center justify-center bg-black/40 text-[11px] font-semibold text-white opacity-0 transition hover:opacity-100">Cambiar</span>
          </button>
          <div>
            <NuxtLink :to="`/store/${slug}`" class="text-xl font-semibold leading-tight text-slate-900 hover:underline">
              {{ brandName }}
            </NuxtLink>
            <p class="text-xs text-slate-600">Catálogo en vivo</p>
          </div>
        </div>

        <nav class="hidden items-center gap-4 md:flex">
          <NuxtLink :to="`/store/${slug}`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Inicio</NuxtLink>
          <NuxtLink :to="`/store/${slug}/productos`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Catálogo</NuxtLink>
          <NuxtLink :to="`/store/${slug}/acerca`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Acerca de</NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <NuxtLink
            :to="`/store/${slug}/carrito`"
            class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow ring-1 ring-slate-200 text-slate-800"
            aria-label="Carrito"
          >
            🛒
            <span
              v-if="cart.totalItems > 0"
              class="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white"
            >
              {{ cart.totalItems }}
            </span>
          </NuxtLink>

          <NuxtLink
            v-if="!auth.isAuthenticated"
            to="/login"
            class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
          >
            Iniciar sesión
          </NuxtLink>
          <NuxtLink
            v-else
            to="/dashboard"
            class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="{ backgroundColor: accentColor }"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs uppercase">{{ userInitials }}</span>
            <span>{{ auth.user?.username || 'Perfil' }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div v-if="canEditBrand" class="mx-auto mt-2 max-w-6xl px-6 pb-4">
      <div class="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div class="flex-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Logo de la tienda</label>
            <input
              v-model="logoInput"
              type="url"
              placeholder="https://..."
              class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <button
            class="mt-2 w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow sm:mt-6 sm:w-auto"
            :style="{ backgroundColor: accentColor }"
            :disabled="logoSaving"
            @click="saveLogo"
          >
            {{ logoSaving ? 'Subiendo...' : 'Subir imagen de logo' }}
          </button>
        </div>
        <p v-if="logoMessage" class="text-sm" :class="logoStatus === 'error' ? 'text-red-600' : 'text-green-600'">{{ logoMessage }}</p>
      </div>
    </div>

    <main class="pb-12">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { useTenantStore } from '~/stores/tenant'
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

const route = useRoute()
const slug = route.params.slug as string

const tenantStore = useTenantStore()
const cart = useCartStore()
const auth = useAuthStore()
const theme = useThemeStore()
const config = useRuntimeConfig()

const brandName = computed(() => tenantStore.data?.name || 'Tu tienda')
const brandInitials = computed(() => (brandName.value || 'T')[0]?.toUpperCase?.() || 'T')
const brandLogo = computed(() => tenantStore.data?.logo_url || '')
const userInitials = computed(() => (auth.user?.username || 'U').slice(0, 2).toUpperCase())
const accentColor = computed(() => theme.accent || '#2563eb')
const gradientStyle = computed(() => ({ backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom}, ${theme.gradientTo})`, opacity: 0.18 }))

const canEditBrand = computed(() => {
  const membership = (auth.user as any)?.memberships || []
  return membership.some((m: any) => m?.store?.slug === slug && (m.roles || []).includes('ADMIN'))
})

const logoInput = ref('')
const logoMessage = ref('')
const logoStatus = ref<'ok' | 'error'>('ok')
const logoSaving = ref(false)

const applyThemeForSlug = () => {
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
}

const ensureStoreData = async () => {
  tenantStore.setSlug(slug)
  if (!tenantStore.data || tenantStore.data.slug !== slug) {
    await tenantStore.fetchTienda()
  }
}

const saveLogo = async () => {
  if (!canEditBrand.value) return
  const url = logoInput.value.trim()
  if (!url) return
  logoSaving.value = true
  logoMessage.value = ''
  try {
    await $fetch(`${config.public.apiBase}/stores/${slug}/`, {
      method: 'PATCH',
      body: { logo_url: url },
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
    })
    logoMessage.value = 'Logo actualizado'
    logoStatus.value = 'ok'
    await tenantStore.fetchTienda()
  } catch (error: any) {
    logoMessage.value = error?.response?._data?.detail || 'No pudimos actualizar el logo'
    logoStatus.value = 'error'
  } finally {
    logoSaving.value = false
  }
}

onMounted(async () => {
  applyThemeForSlug()
  cart.loadFromStorage()
  await ensureStoreData()
})

watch(
  () => route.params.slug,
  async () => {
    await ensureStoreData()
    applyThemeForSlug()
  }
)
</script>
