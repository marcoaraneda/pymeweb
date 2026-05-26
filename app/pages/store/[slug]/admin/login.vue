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
          <h1 class="mt-4 text-4xl font-extrabold leading-tight">Bienvenido de vuelta</h1>
          <p class="mt-3 text-lg text-white/70">Gestiona tus tiendas, explora el marketplace y ajusta los colores a tu marca desde un solo lugar.</p>

          <div class="mt-8 space-y-4">
            <div class="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-white/80">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">1</div>
              <div>
                <p class="text-sm font-semibold">Inicia sesión</p>
                <p class="text-xs text-white/60">Usa tus credenciales de administrador o colaborador.</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-white/80">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">2</div>
              <div>
                <p class="text-sm font-semibold">Personaliza</p>
                <p class="text-xs text-white/60">Ajusta el color de acento y el fondo para tu marca.</p>
              </div>
            </div>
            <div class="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-white/80">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">3</div>
              <div>
                <p class="text-sm font-semibold">Explora</p>
                <p class="text-xs text-white/60">Entra a tus tiendas o visita todas las disponibles.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1">
        <div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <p class="text-sm uppercase tracking-[0.2em] text-white/70">Acceso</p>
          <h2 class="mt-3 text-2xl font-bold">Inicia sesión</h2>
          <p class="text-white/60">Usa tu usuario o email y contraseña registrados.</p>

          <form class="mt-6 space-y-4" @submit.prevent="submit">
            <div class="space-y-2">
              <label class="text-sm text-white/80">Usuario o email</label>
              <input
                v-model.trim="credentials.username"
                :class="inputClass('username')"
                type="text"
                required
                autocomplete="username"
                inputmode="text"
                placeholder="ej: admin"
                :aria-invalid="Boolean(validation.username)"
              />
              <p v-if="validation.username" class="text-xs text-red-200">{{ validation.username }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Contraseña</label>
              <input
                v-model="credentials.password"
                :class="inputClass('password')"
                type="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                :aria-invalid="Boolean(validation.password)"
              />
              <p v-if="validation.password" class="text-xs text-red-200">{{ validation.password }}</p>
            </div>

            <div v-if="auth.error" class="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-100">
              {{ auth.error }}
            </div>

            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              :style="{ backgroundColor: theme.accent }"
              :disabled="!canSubmit"
            >
              <span v-if="!loading">Entrar</span>
              <span v-else class="flex items-center gap-2">
                <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span>
                Validando...
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo, useRoute } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

type FieldKey = 'username' | 'password'

const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()
const loading = ref(false)
const credentials = reactive({ username: '', password: '' })

const validation = computed(() => {
  const issues: Record<FieldKey, string | null> = { username: null, password: null }
  if (!credentials.username.trim()) issues.username = 'Requerido.'
  if (!credentials.password.trim()) issues.password = 'Ingresa tu contraseña.'
  return issues
})

const firstError = computed(() => Object.values(validation.value).find(Boolean) || null)
const canSubmit = computed(() => !loading.value && !auth.loading && !firstError.value)

const inputClass = (field: FieldKey) => [
  'w-full rounded-xl border bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60',
  validation.value[field] ? 'border-red-400/60 focus:border-red-300' : 'border-white/20',
]

watch(
  () => [credentials.username, credentials.password],
  () => {
    if (auth.error) auth.error = null
  }
)

const submit = async () => {
  auth.error = null
  const errorMessage = firstError.value
  if (errorMessage) {
    auth.error = errorMessage
    return
  }

  loading.value = true
  try {
    await auth.login({ username: credentials.username, password: credentials.password })
    const slug = route.params.slug as string
    await navigateTo(`/store/${slug}/admin`)
  } catch (error) {
    /* store gestiona mensaje */
  } finally {
    loading.value = false
  }
}
</script>