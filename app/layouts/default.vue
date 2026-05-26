<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold text-slate-900">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">PW</span>
          <div>
            <p class="leading-none">Pymeweb</p>
            <p class="text-xs text-slate-500">Marketplace multi-tienda</p>
          </div>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <NuxtLink
            v-if="!auth.isAuthenticated"
            to="/login"
            class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
          >
            Iniciar sesión
          </NuxtLink>

          <div v-else class="relative" ref="menuRef">
            <button
              class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm"
              :style="{ backgroundColor: accentColor }"
              @click.stop="showMenu = !showMenu"
            >
              <span
                v-if="avatarUrl"
                class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/15"
              >
                <img :src="avatarUrl" alt="Avatar" class="h-full w-full object-cover" />
              </span>
              <span
                v-else
                class="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs uppercase"
              >
                {{ initials }}
              </span>
              <span>{{ auth.user?.username || 'Perfil' }}</span>
            </button>
            <div
              v-if="showMenu"
              class="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white py-2 text-sm shadow-lg"
            >
              <NuxtLink to="/dashboard" class="block px-3 py-2 text-slate-700 hover:bg-slate-50">Dashboard</NuxtLink>
              <NuxtLink to="/profile" class="block px-3 py-2 text-slate-700 hover:bg-slate-50">Editar perfil</NuxtLink>
              <button class="block w-full px-3 py-2 text-left text-red-600 hover:bg-slate-50" @click="auth.logout()">Cerrar sesión</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

const auth = useAuthStore()
const theme = useThemeStore()
const showMenu = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const avatarUrl = computed(() => auth.user?.avatar_url || null)
const initials = computed(() => (auth.user?.username || 'U').slice(0, 2).toUpperCase())
const accentColor = '#2563eb'

const handleOutside = (event: MouseEvent) => {
  if (!menuRef.value) return
  if (!menuRef.value.contains(event.target as Node)) {
    showMenu.value = false
  }
}

onMounted(() => {
  theme.loadFromStorage()
  theme.resetToBase()
  document.addEventListener('click', handleOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleOutside)
})
</script>
