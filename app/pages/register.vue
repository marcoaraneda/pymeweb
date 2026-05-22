<template>
  <div class="mx-auto max-w-md px-4 py-8">
    <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
      <h1 class="text-2xl font-semibold mb-4">Crear cuenta</h1>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <label class="block text-sm text-white/80 mb-1">Nombre</label>
          <input v-model="name" type="text" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div>
          <label class="block text-sm text-white/80 mb-1">Email</label>
          <input v-model="email" type="email" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div>
          <label class="block text-sm text-white/80 mb-1">Contraseña</label>
          <input v-model="password" type="password" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" />
        </div>

        <div class="flex items-center justify-between">
          <button class="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white">Crear cuenta</button>
          <NuxtLink to="/login" class="text-sm text-cyan-200">Ya tengo cuenta</NuxtLink>
        </div>

        <div v-if="message" class="text-sm text-green-400">{{ message }}</div>
        <div v-if="error" class="text-sm text-rose-400">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const config = useRuntimeConfig()
const auth = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const message = ref<string | null>(null)
const error = ref<string | null>(null)

const onSubmit = async () => {
  message.value = null
  error.value = null
  try {
    // Attempt signup
    await $fetch(`${config.public.apiBase}/users/signup/`, {
      method: 'POST',
      body: { username: email.value, email: email.value, password: password.value, first_name: name.value },
    })

    // Try to log in automatically
    try {
      const tokenRes = await $fetch(`${config.public.apiBase}/token/`, {
        method: 'POST',
        body: { username: email.value, password: password.value },
      })
      const token = (tokenRes as any).access || (tokenRes as any).token || (tokenRes as any).access_token
      if (token) {
        auth.setToken(token)
        try {
          const me = await $fetch(`${config.public.apiBase}/users/me/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          ;(auth as any).user = me
        } catch {}
        navigateTo('/')
        return
      }
    } catch {
      // ignore token obtain failure, fallthrough to message
    }

    message.value = 'Cuenta creada. Revisa tu correo o ingresa.'
  } catch (err: any) {
    error.value = err?.data?.detail || err?.message || 'Error al crear cuenta.'
  }
}
</script>

<style scoped>
input { outline: none; }
</style>
