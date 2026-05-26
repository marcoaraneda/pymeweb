<template>
  <div class="relative min-h-screen bg-slate-950 text-white">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute -left-24 top-10 h-80 w-80 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-70" />
      <div class="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-60" />
    </div>

    <div class="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <div class="hidden flex-1 lg:block">
        <div class="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur">
          <p class="text-sm uppercase tracking-[0.2em] text-white/70">Pymeweb</p>
          <h1 class="mt-4 text-4xl font-extrabold leading-tight">Crea tu cuenta</h1>
          <p class="mt-3 text-lg text-white/70">Regístrate para gestionar tu tienda y publicar en el marketplace.</p>
        </div>
      </div>

      <div class="flex-1">
        <div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <p class="text-sm uppercase tracking-[0.2em] text-white/70">Registro</p>
          <h2 class="mt-3 text-2xl font-bold">Crea tu cuenta</h2>
          <p class="text-white/60">Completa tus datos para iniciar sesión de inmediato.</p>

          <form class="mt-6 space-y-4" @submit.prevent="submit">
            <div class="grid gap-4 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm text-white/80">Nombre</label>
                <input v-model="form.first_name" type="text" class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-white/80">Apellido</label>
                <input v-model="form.last_name" type="text" class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Usuario</label>
              <input v-model="form.username" type="text" required class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" />
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Email</label>
              <input v-model="form.email" type="email" required class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" />
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Contraseña</label>
              <input v-model="form.password" type="password" required class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" />
            </div>

            <div v-if="auth.error" class="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-100">
              {{ auth.error }}
            </div>

            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="loading"
            >
              <span v-if="!loading">Registrarme</span>
              <span v-else class="flex items-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                Creando cuenta...
              </span>
            </button>

            <p class="text-xs text-white/60">Ya tienes cuenta? <NuxtLink to="/login" class="underline">Inicia sesión</NuxtLink></p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const loading = ref(false)
const form = reactive({ username: '', email: '', password: '', first_name: '', last_name: '' })

const submit = async () => {
  loading.value = true
  try {
    await auth.register(form)
    await navigateTo('/')
  } catch (error) {
    /* error ya gestionado en store */
  } finally {
    loading.value = false
  }
}
</script>
