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
                <input
                  v-model.trim="form.first_name"
                  type="text"
                  autocomplete="given-name"
                  class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60"
                  inputmode="text"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-white/80">Apellido</label>
                <input
                  v-model.trim="form.last_name"
                  type="text"
                  autocomplete="family-name"
                  class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60"
                  inputmode="text"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Usuario</label>
              <input
                v-model.trim="form.username"
                :class="inputClass('username')"
                type="text"
                required
                autocomplete="username"
                minlength="3"
                inputmode="text"
                :aria-invalid="Boolean(validation.username)"
              />
              <p v-if="validation.username" class="text-xs text-red-200">{{ validation.username }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Email</label>
              <input
                v-model.trim="form.email"
                :class="inputClass('email')"
                type="email"
                required
                autocomplete="email"
                inputmode="email"
                :aria-invalid="Boolean(validation.email)"
              />
              <p v-if="validation.email" class="text-xs text-red-200">{{ validation.email }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">RUT</label>
              <input
                v-model.trim="form.rut"
                :class="inputClass('rut')"
                type="text"
                required
                autocomplete="off"
                inputmode="text"
                placeholder="12.345.678-5"
                :aria-invalid="Boolean(validation.rut)"
                @blur="onRutBlur"
              />
              <p v-if="validation.rut" class="text-xs text-red-200">{{ validation.rut }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Dirección</label>
              <input
                v-model.trim="form.address"
                :class="inputClass('address')"
                type="text"
                required
                autocomplete="street-address"
                inputmode="text"
                :aria-invalid="Boolean(validation.address)"
              />
              <p v-if="validation.address" class="text-xs text-red-200">{{ validation.address }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Teléfono</label>
              <input
                v-model.trim="form.phone"
                :class="inputClass('phone')"
                type="tel"
                required
                autocomplete="tel"
                inputmode="tel"
                placeholder="+56 9 1234 5678"
                :aria-invalid="Boolean(validation.phone)"
              />
              <p v-if="validation.phone" class="text-xs text-red-200">{{ validation.phone }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Contraseña</label>
              <input
                v-model="form.password"
                :class="inputClass('password')"
                type="password"
                required
                autocomplete="new-password"
                minlength="8"
                pattern="(?=.*[A-Za-z])(?=.*\d).{8,}"
                :aria-invalid="Boolean(validation.password)"
              />
              <div class="flex items-center justify-between text-xs text-white/60">
                <span>Mínimo 8 caracteres, letras y números.</span>
                <span :class="passwordStrengthClass">{{ passwordLabel }}</span>
              </div>
              <p v-if="validation.password" class="text-xs text-red-200">{{ validation.password }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Confirmar contraseña</label>
              <input
                v-model="form.passwordConfirm"
                :class="inputClass('passwordConfirm')"
                type="password"
                required
                autocomplete="new-password"
                :aria-invalid="Boolean(validation.passwordConfirm)"
              />
              <p v-if="validation.passwordConfirm" class="text-xs text-red-200">{{ validation.passwordConfirm }}</p>
            </div>

            <div v-if="auth.error" class="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-100">
              {{ auth.error }}
            </div>

            <button
              type="submit"
              class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              :style="{ background: `linear-gradient(90deg, ${theme.accent}, ${theme.gradientTo})` }"
              :disabled="!canSubmit"
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
import { computed, reactive, ref, watch } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { formatRut, isValidRut, normalizeRut } from '~/utils/rut'

const auth = useAuthStore()
const theme = useThemeStore()
const loading = ref(false)
const form = reactive({
  username: '',
  email: '',
  rut: '',
  address: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  first_name: '',
  last_name: '',
})
type FieldKey = 'username' | 'email' | 'rut' | 'address' | 'phone' | 'password' | 'passwordConfirm'

const validation = computed(() => {
  const issues: Record<FieldKey, string | null> = {
    username: null,
    email: null,
    rut: null,
    address: null,
    phone: null,
    password: null,
    passwordConfirm: null,
  }

  const username = form.username.trim()
  const email = form.email.trim()
  const rut = form.rut.trim()
  const address = form.address.trim()
  const phone = form.phone.trim()
  const password = form.password
  const passwordConfirm = form.passwordConfirm

  if (username.length < 3) issues.username = 'Mínimo 3 caracteres.'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) issues.email = 'Ingresa un email válido.'
  if (!isValidRut(rut)) issues.rut = 'Ingresa un RUT válido (ej: 12.345.678-5).'
  if (address.length < 5) issues.address = 'Ingresa una dirección válida.'
  if (phone.length < 8) issues.phone = 'Ingresa un teléfono válido.'
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
  if (!passwordRegex.test(password)) issues.password = 'Debe incluir letras, números y al menos 8 caracteres.'
  if (password && passwordConfirm && password !== passwordConfirm) issues.passwordConfirm = 'Las contraseñas no coinciden.'

  return issues
})

const firstError = computed(() => Object.values(validation.value).find(Boolean) || null)
const canSubmit = computed(() => !loading.value && !auth.loading && !firstError.value)

const strength = computed(() => {
  const value = form.password
  if (!value) return 'empty'
  const long = value.length >= 10
  const hasUpper = /[A-Z]/.test(value)
  const hasSymbol = /[^A-Za-z0-9]/.test(value)
  return long && hasUpper && hasSymbol ? 'strong' : 'ok'
})

const passwordLabel = computed(() => {
  if (strength.value === 'strong') return 'Fuerte'
  if (strength.value === 'ok') return 'Aceptable'
  return 'Pendiente'
})

const passwordStrengthClass = computed(() => {
  if (strength.value === 'strong') return 'text-emerald-300'
  if (strength.value === 'ok') return 'text-amber-200'
  return 'text-white/50'
})

const inputClass = (field: FieldKey) => [
  'w-full rounded-xl border bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60',
  validation.value[field] ? 'border-red-400/60 focus:border-red-300' : 'border-white/20',
]

watch(
  () => [form.username, form.email, form.rut, form.address, form.phone, form.password, form.passwordConfirm],
  () => {
    if (auth.error) auth.error = null
  }
)

const onRutBlur = () => {
  if (!form.rut.trim()) return
  form.rut = formatRut(form.rut)
}

const submit = async () => {
  auth.error = null
  const errorMessage = firstError.value
  if (errorMessage) {
    auth.error = errorMessage
    return
  }

  loading.value = true
  try {
    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      rut: normalizeRut(form.rut),
      address: form.address.trim(),
      phone: form.phone.trim(),
      password: form.password,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
    }
    await auth.register(payload)
    await navigateTo('/dashboard')
  } catch (error) {
    /* error ya gestionado en store */
  } finally {
    loading.value = false
  }
}
</script>
