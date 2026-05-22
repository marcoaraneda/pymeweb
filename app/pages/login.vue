<template>
  <div class="mx-auto max-w-md px-4 py-8">
    <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
      <h1 class="text-2xl font-semibold mb-4">Ingresar</h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-white/80 mb-1">Email</label>
          <input v-model="email" type="email" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div>
          <label class="block text-sm text-white/80 mb-1">Contraseña</label>
          <input v-model="password" type="password" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div class="flex items-center justify-between">
          <button class="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white">Ingresar</button>
          <NuxtLink to="/register" class="text-sm text-cyan-200">Crear cuenta</NuxtLink>
        </div>

        <div v-if="error" class="text-sm text-rose-400">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)

const onSubmit = async () => {
  error.value = null
  try {
    // Token obtain endpoint (JWT pair)
    const res = await $fetch(`${config.public.apiBase}/token/`, {
      method: 'POST',
      body: { username: email.value, password: password.value },
    })

    const token = (res as any).access || (res as any).token || (res as any).access_token
    if (token) {
      auth.setToken(token)
      try {
        const me = await $fetch(`${config.public.apiBase}/users/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        // populate store user
        ;(auth as any).user = me
      } catch {
        // ignore user fetch failure
      }
      navigateTo('/')
    } else {
      error.value = 'No se obtuvo token desde el servidor.'
    }
  } catch (err: any) {
    error.value = err?.data?.detail || err?.message || 'Error al iniciar sesión.'
  }
}
</script>

<style scoped>
input { outline: none; }
</style>
