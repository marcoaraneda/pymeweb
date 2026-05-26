<template>
  <div class="bg-slate-50 min-h-screen px-4 py-10">
    <div class="mx-auto flex max-w-3xl flex-col gap-8">
      <!-- Header -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Perfil</p>
            <h1 class="text-2xl font-bold text-slate-900">Mi cuenta</h1>
            <div class="mt-1 flex items-center gap-2 text-sm text-slate-600">
              <span>{{ auth.user?.username || 'Perfil' }}</span>
              <BadgeCheck v-if="hasVerifiedBadge" class="h-5 w-5 text-emerald-600" aria-label="Verificado" />
            </div>
          </div>
          <button class="text-sm font-semibold text-red-600" @click="auth.logout()">Cerrar sesión</button>
        </div>

        <!-- Navigation Tabs -->
        <div class="mt-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <button
            v-for="section in sections"
            :key="section.id"
            type="button"
            class="px-4 py-2 text-sm font-semibold transition"
            :class="activeSection === section.id
              ? 'border-b-2 text-slate-900'
              : 'text-slate-600 hover:text-slate-900'"
            :style="activeSection === section.id ? { borderBottomColor: theme.accent } : {}"
            @click="activeSection = section.id"
          >
            {{ section.label }}
          </button>
        </div>
      </div>

      <!-- SECCIÓN: Editar perfil -->
      <div v-if="activeSection === 'perfil'" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mt-6 flex items-center gap-4">
          <div class="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <img v-if="avatarPreview" :key="avatarPreview" :src="avatarPreview" alt="Avatar" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
              {{ initials }}
            </div>
          </div>
          <div class="flex-1">
            <label class="text-sm text-slate-600">Foto de perfil</label>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition">
                <input type="file" accept="image/*" class="hidden" @change="onFileSelect" />
                <span>{{ uploadingAvatar ? 'Subiendo...' : 'Subir archivo' }}</span>
              </label>
              <span class="text-slate-500">Solo desde tu computadora o celular</span>
            </div>
            <p v-if="uploadError" class="text-xs text-red-600 mt-1">{{ uploadError }}</p>
            <p v-else-if="uploadingAvatar" class="text-xs text-slate-500 mt-1">Procesando imagen...</p>
            <p class="text-xs text-slate-500 mt-1">La foto se guarda en tu perfil cuando presionas Guardar cambios.</p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div class="space-y-2 sm:col-span-2">
            <label class="text-sm text-slate-600">Nombre de usuario</label>
            <input :value="auth.user?.username || ''" type="text" readonly class="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Nombre</label>
            <input v-model="form.first_name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Apellido</label>
            <input v-model="form.last_name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-sm text-slate-600">Email</label>
            <input v-model="form.email" type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">RUT</label>
            <input v-model="form.rut" type="text" placeholder="12.345.678-5" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Teléfono</label>
            <input v-model="form.phone" type="text" placeholder="+56 9 ..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2 sm:col-span-2">
            <label class="text-sm text-slate-600">Dirección</label>
            <input v-model="form.address" type="text" placeholder="Calle, comuna, ciudad" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div class="mt-6 flex items-center gap-3">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="accentStyle"
            :disabled="saving"
            @click="saveProfile"
          >
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <p class="text-sm" v-if="message" :class="messageType === 'error' ? 'text-red-600' : 'text-green-600'">{{ message }}</p>
        </div>

        <!-- Verificar Cuenta (solo si no está verificado) -->
        <div v-if="!hasVerifiedBadge" class="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-900">Verificar tu cuenta</p>
          <p class="text-xs text-slate-600">Para mayor seguridad, verifica tu cuenta mediante correo o SMS.</p>

          <!-- Email Verification -->
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900">Verificación por correo</p>
                <p class="text-xs text-slate-600" v-if="isEmailVerified">Verificado {{ verifiedAtLabel }}</p>
                <p class="text-xs text-slate-600" v-else>Recibe un código de verificación.</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="isEmailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ isEmailVerified ? 'Verificado' : 'Pendiente' }}
              </span>
            </div>
            <template v-if="!isEmailVerified">
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <button
                  class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                  :disabled="sendingVerificationCode"
                  @click="requestEmailVerificationCode"
                >
                  {{ sendingVerificationCode ? 'Enviando...' : 'Enviar código' }}
                </button>
                <input
                  v-model="verificationCode"
                  type="text"
                  maxlength="6"
                  placeholder="Código de 6 dígitos"
                  class="w-44 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
                  :style="accentStyle"
                  :disabled="confirmingVerificationCode || verificationCode.trim().length < 6"
                  @click="confirmEmailVerificationCode"
                >
                  {{ confirmingVerificationCode ? 'Verificando...' : 'Confirmar' }}
                </button>
                <p v-if="verificationMessage" class="text-sm" :class="verificationStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">{{ verificationMessage }}</p>
              </div>
            </template>
          </div>

          <!-- Google Verification -->
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900">Verificación con Google</p>
                <p class="text-xs text-slate-600" v-if="isGoogleVerified">Verificado {{ googleVerifiedAtLabel }}</p>
                <p class="text-xs text-slate-600" v-else>Vincula tu cuenta de Google.</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="isGoogleVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ isGoogleVerified ? 'Verificado' : 'Pendiente' }}
              </span>
            </div>
            <template v-if="!isGoogleVerified">
              <div class="mt-3">
                <div ref="googleVerifyButtonRef" class="min-h-[40px]" />
                <p v-if="googleVerificationMessage" class="mt-2 text-sm" :class="googleVerificationStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">{{ googleVerificationMessage }}</p>
              </div>
            </template>
          </div>

          <!-- SMS Verification -->
          <div class="rounded-xl border border-slate-200 bg-white p-4">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="text-sm font-semibold text-slate-900">Verificación por SMS</p>
                <p class="text-xs text-slate-600" v-if="isPhoneVerified">Verificado {{ phoneVerifiedAtLabel }}</p>
                <p class="text-xs text-slate-600" v-else>Recibe un código por SMS.</p>
              </div>
              <span
                class="rounded-full px-3 py-1 text-xs font-semibold"
                :class="isPhoneVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'"
              >
                {{ isPhoneVerified ? 'Verificado' : 'Pendiente' }}
              </span>
            </div>
            <template v-if="!isPhoneVerified">
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <button
                  class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
                  :disabled="sendingPhoneVerificationCode"
                  @click="requestPhoneVerificationCode"
                >
                  {{ sendingPhoneVerificationCode ? 'Enviando...' : 'Enviar código SMS' }}
                </button>
                <input
                  v-model="phoneVerificationCode"
                  type="text"
                  maxlength="6"
                  placeholder="Código SMS de 6 dígitos"
                  class="w-48 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-white"
                  :style="accentStyle"
                  :disabled="confirmingPhoneVerificationCode || phoneVerificationCode.trim().length < 6"
                  @click="confirmPhoneVerificationCode"
                >
                  {{ confirmingPhoneVerificationCode ? 'Verificando...' : 'Confirmar SMS' }}
                </button>
                <p v-if="phoneVerificationMessage" class="text-sm" :class="phoneVerificationStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">{{ phoneVerificationMessage }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- SECCIÓN: Cambiar contraseña -->
      <div v-if="activeSection === 'seguridad'" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Seguridad</p>
        <h2 class="text-xl font-semibold text-slate-900">Cambiar contraseña</h2>
        <p class="mt-2 text-sm text-slate-600">Solicita un código al correo y confirma con tu contraseña actual.</p>

        <div class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-slate-900">Cambio de contraseña con OTP</p>
              <p class="text-xs text-slate-600">Proceso seguro de verificación en dos pasos.</p>
            </div>
            <button
              class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
              :disabled="sendingPasswordOtpCode"
              @click="requestPasswordChangeOtp"
            >
              {{ sendingPasswordOtpCode ? 'Enviando...' : 'Enviar código OTP' }}
            </button>
          </div>

          <div class="mt-4 grid gap-3 md:grid-cols-3">
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Contraseña actual</label>
              <input v-model="passwordForm.current_password" type="password" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Nueva contraseña</label>
              <input v-model="passwordForm.new_password" type="password" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Código OTP</label>
              <input v-model="passwordOtpCode" type="text" maxlength="6" placeholder="000000" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
              :style="accentStyle"
              :disabled="changing || confirmingPasswordOtp || passwordOtpCode.trim().length < 6"
              @click="confirmPasswordChangeOtp"
            >
              {{ confirmingPasswordOtp ? 'Verificando...' : 'Confirmar y cambiar contraseña' }}
            </button>
            <p class="text-sm" v-if="passwordMessage" :class="passwordStatus === 'error' ? 'text-red-600' : 'text-green-600'">{{ passwordMessage }}</p>
          </div>
        </div>
      </div>

      <!-- SECCIÓN: Métodos de pago -->
      <div v-if="activeSection === 'pago'" class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Pagos</p>
        <h2 class="text-xl font-semibold text-slate-900">Mis métodos de pago</h2>
        <p class="mt-1 text-sm text-slate-600">Úsalos para autocompletar checkout y como cuenta receptora en tus tiendas.</p>

        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Tipo</label>
            <select v-model="paymentForm.provider" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="paypal">PayPal</option>
              <option value="card">Tarjeta</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Etiqueta</label>
            <input v-model="paymentForm.label" type="text" placeholder="Ej: PayPal negocio" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-sm text-slate-600">Titular</label>
            <input v-model="paymentForm.account_holder_name" type="text" placeholder="Nombre titular" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <div class="space-y-2" v-if="paymentForm.provider === 'paypal'">
            <label class="text-sm text-slate-600">Correo PayPal</label>
            <input v-model="paymentForm.account_email" type="email" placeholder="cobros@correo.com" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>

          <template v-else>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Marca tarjeta</label>
              <input v-model="paymentForm.card_brand" type="text" placeholder="Visa / Mastercard" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Últimos 4 dígitos</label>
              <input v-model="paymentForm.card_last4" type="text" maxlength="4" placeholder="1234" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </template>

          <div class="space-y-2 md:col-span-2">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="paymentForm.is_default" type="checkbox" class="h-4 w-4" />
              Usar como método predeterminado
            </label>
          </div>
        </div>

        <div class="mt-4 flex items-center gap-3">
          <button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" :style="accentStyle" :disabled="savingPaymentMethod" @click="savePaymentMethod">
            {{ savingPaymentMethod ? 'Guardando...' : (paymentForm.id ? 'Actualizar método' : 'Agregar método') }}
          </button>
          <button v-if="paymentForm.id" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700" @click="resetPaymentForm">Cancelar edición</button>
          <p v-if="paymentMethodMessage" class="text-sm" :class="paymentMethodStatus === 'error' ? 'text-red-600' : 'text-green-600'">{{ paymentMethodMessage }}</p>
        </div>

        <div class="mt-5 space-y-2">
          <article v-for="method in paymentMethods" :key="method.id" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-sm font-semibold text-slate-900">
                  {{ method.label }}
                  <span v-if="method.is_default" class="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Predeterminado</span>
                </p>
                <p class="text-xs text-slate-600">
                  <template v-if="method.provider === 'paypal'">PayPal · {{ method.account_email }}</template>
                  <template v-else>Tarjeta {{ method.card_brand || '—' }} · **** {{ method.card_last4 || '—' }}</template>
                </p>
              </div>
              <div class="flex items-center gap-2">
                <button class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700" @click="editPaymentMethod(method)">Editar</button>
                <button class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600" @click="deletePaymentMethod(method.id)">Eliminar</button>
              </div>
            </div>
          </article>
          <p v-if="!paymentMethods.length" class="text-sm text-slate-500">Aún no tienes métodos de pago guardados.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { BadgeCheck } from 'lucide-vue-next'

declare global {
  interface Window {
    google?: any
  }
}

definePageMeta({ middleware: ['auth'], requiresAuth: true })

const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()

const sections = [
  { id: 'perfil', label: 'Editar perfil' },
  { id: 'seguridad', label: 'Cambiar contraseña' },
  { id: 'pago', label: 'Métodos de pago' },
]
const activeSection = ref<'perfil' | 'seguridad' | 'pago'>('perfil')

const form = reactive({ first_name: '', last_name: '', email: '', rut: '', address: '', phone: '', upload_avatar: '' })
const avatarPreview = ref('')
const passwordForm = reactive({ current_password: '', new_password: '' })
const saving = ref(false)
const changing = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'error'>('ok')
const passwordMessage = ref('')
const passwordStatus = ref<'ok' | 'error'>('ok')
const uploadingAvatar = ref(false)
const uploadError = ref('')
const sendingPasswordOtpCode = ref(false)
const confirmingPasswordOtp = ref(false)
const passwordOtpCode = ref('')
const paymentMethods = ref<any[]>([])
const savingPaymentMethod = ref(false)
const paymentMethodMessage = ref('')
const paymentMethodStatus = ref<'ok' | 'error'>('ok')
const sendingVerificationCode = ref(false)
const confirmingVerificationCode = ref(false)
const verificationCode = ref('')
const verificationMessage = ref('')
const verificationStatus = ref<'ok' | 'error'>('ok')
const isEmailVerified = ref(false)
const emailVerifiedAt = ref('')
const isGoogleVerified = ref(false)
const googleVerifiedAt = ref('')
const googleVerificationMessage = ref('')
const googleVerificationStatus = ref<'ok' | 'error'>('ok')
const googleVerifyButtonRef = ref<HTMLElement | null>(null)
const sendingPhoneVerificationCode = ref(false)
const confirmingPhoneVerificationCode = ref(false)
const phoneVerificationCode = ref('')
const phoneVerificationMessage = ref('')
const phoneVerificationStatus = ref<'ok' | 'error'>('ok')
const isPhoneVerified = ref(false)
const phoneVerifiedAt = ref('')
const paymentForm = reactive({
  id: null as number | null,
  provider: 'paypal',
  label: '',
  account_holder_name: '',
  account_email: '',
  card_brand: '',
  card_last4: '',
  is_default: true,
})

const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: '#fff' }))
const initials = computed(() => (auth.user?.username || 'U').slice(0, 2).toUpperCase())
const hasVerifiedBadge = computed(() => isEmailVerified.value || isPhoneVerified.value || isGoogleVerified.value)
const verifiedAtLabel = computed(() => {
  if (!emailVerifiedAt.value) return ''
  try {
    return new Date(emailVerifiedAt.value).toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return ''
  }
})
const phoneVerifiedAtLabel = computed(() => {
  if (!phoneVerifiedAt.value) return ''
  try {
    return new Date(phoneVerifiedAt.value).toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return ''
  }
})
const googleVerifiedAtLabel = computed(() => {
  if (!googleVerifiedAt.value) return ''
  try {
    return new Date(googleVerifiedAt.value).toLocaleString('es-CL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return ''
  }
})
const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})
const getErrorMessage = (err: any) => {
  const detail = err?.response?._data?.detail || err?.response?._data
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.join(', ')
  if (detail && typeof detail === 'object') {
    const flatten = (value: any): string[] => {
      if (typeof value === 'string') return [value]
      if (Array.isArray(value)) return value.flatMap(flatten)
      if (value && typeof value === 'object') return Object.values(value).flatMap(flatten)
      return []
    }
    const parsed = flatten(detail).filter(Boolean)
    if (parsed.length) return parsed.join(', ')
  }
  return err?.message || 'Ocurrió un error'
}

const buildAvatarUrl = (avatarUrl?: string | null, updatedAt?: string | null) => {
  if (!avatarUrl) return ''
  if (!updatedAt) return avatarUrl
  const joiner = avatarUrl.includes('?') ? '&' : '?'
  return `${avatarUrl}${joiner}v=${encodeURIComponent(updatedAt)}`
}

const setPendingAvatarPreview = (avatarUrl: string) => {
  form.upload_avatar = avatarUrl
  avatarPreview.value = buildAvatarUrl(avatarUrl, new Date().toISOString())
  message.value = 'Imagen lista. Presiona Guardar cambios para aplicarla al layout.'
  messageType.value = 'ok'
}

const splitFullName = (value: string) => {
  const cleaned = String(value || '').trim().replace(/\s+/g, ' ')
  if (!cleaned) return { first: '', last: '' }
  const parts = cleaned.split(' ')
  if (parts.length === 1) return { first: parts[0], last: '' }
  return {
    first: parts[0],
    last: parts.slice(1).join(' '),
  }
}

const loadProfile = async () => {
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  const profile = await auth.fetchProfile()
  if (profile) {
    const firstNameRaw = String((profile as any).first_name || (profile as any).name || '').trim()
    const lastNameRaw = String((profile as any).last_name || (profile as any).surname || (profile as any).apellido || '').trim()
    const fullNameRaw = String((profile as any).full_name || '').trim()
    const split = splitFullName(fullNameRaw)
    form.first_name = firstNameRaw || split.first
    form.last_name = lastNameRaw || split.last
    form.email = profile.email || ''
    form.rut = profile.rut || ''
    form.address = profile.address || ''
    form.phone = profile.phone || ''
    isEmailVerified.value = Boolean((profile as any).is_email_verified)
    emailVerifiedAt.value = String((profile as any).email_verified_at || '')
    isGoogleVerified.value = Boolean((profile as any).is_google_verified)
    googleVerifiedAt.value = String((profile as any).google_verified_at || '')
    isPhoneVerified.value = Boolean((profile as any).is_phone_verified)
    phoneVerifiedAt.value = String((profile as any).phone_verified_at || '')
    form.upload_avatar = ''
    avatarPreview.value = buildAvatarUrl(profile.avatar_url || '', profile.avatar_updated_at || null)
  }
}

const requestEmailVerificationCode = async () => {
  if (!auth.token) return
  sendingVerificationCode.value = true
  verificationMessage.value = ''
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/users/email-verification/request/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    verificationStatus.value = 'ok'
    verificationMessage.value = response?.detail || 'Código enviado al correo.'
  } catch (error: any) {
    verificationStatus.value = 'error'
    verificationMessage.value = getErrorMessage(error) || 'No pudimos enviar el código.'
  } finally {
    sendingVerificationCode.value = false
  }
}

const confirmEmailVerificationCode = async () => {
  if (!auth.token) return
  confirmingVerificationCode.value = true
  verificationMessage.value = ''
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/users/email-verification/confirm/`, {
      method: 'POST',
      body: { code: verificationCode.value.trim() },
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    verificationStatus.value = 'ok'
    verificationMessage.value = response?.detail || 'Cuenta verificada correctamente.'
    verificationCode.value = ''
    await loadProfile()
  } catch (error: any) {
    verificationStatus.value = 'error'
    verificationMessage.value = getErrorMessage(error) || 'Código inválido.'
  } finally {
    confirmingVerificationCode.value = false
  }
}

const verifyWithGoogleToken = async (idToken: string) => {
  if (!auth.token) return
  googleVerificationMessage.value = ''
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/users/google-verification/confirm/`, {
      method: 'POST',
      body: { id_token: idToken },
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    googleVerificationStatus.value = 'ok'
    googleVerificationMessage.value = response?.detail || 'Cuenta verificada con Google.'
    await loadProfile()
  } catch (error: any) {
    googleVerificationStatus.value = 'error'
    googleVerificationMessage.value = getErrorMessage(error) || 'No pudimos validar Google.'
  }
}

const initGoogleVerification = async () => {
  if (isGoogleVerified.value) return
  const clientId = String(config.public.googleClientId || '')
  if (!clientId || !googleVerifyButtonRef.value) return

  const ensureScript = () =>
    new Promise<void>((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve()
        return
      }
      const existing = document.querySelector('script[data-google-identity="true"]') as HTMLScriptElement | null
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(new Error('No se pudo cargar Google Identity')), { once: true })
        return
      }
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.dataset.googleIdentity = 'true'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('No se pudo cargar Google Identity'))
      document.head.appendChild(script)
    })

  try {
    await ensureScript()
    if (!window.google?.accounts?.id || !googleVerifyButtonRef.value) return
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        const token = String(response?.credential || '').trim()
        if (!token) return
        verifyWithGoogleToken(token)
      },
      ux_mode: 'popup',
      auto_select: false,
    })
    googleVerifyButtonRef.value.innerHTML = ''
    window.google.accounts.id.renderButton(googleVerifyButtonRef.value, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: 260,
    })
  } catch {
    googleVerificationStatus.value = 'error'
    googleVerificationMessage.value = 'No se pudo cargar el botón de Google.'
  }
}

const requestPhoneVerificationCode = async () => {
  if (!auth.token) return
  sendingPhoneVerificationCode.value = true
  phoneVerificationMessage.value = ''
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/users/sms-verification/request/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    phoneVerificationStatus.value = 'ok'
    phoneVerificationMessage.value = response?.detail || 'Código enviado por SMS.'
  } catch (error: any) {
    phoneVerificationStatus.value = 'error'
    phoneVerificationMessage.value = getErrorMessage(error) || 'No pudimos enviar el SMS.'
  } finally {
    sendingPhoneVerificationCode.value = false
  }
}

const confirmPhoneVerificationCode = async () => {
  if (!auth.token) return
  confirmingPhoneVerificationCode.value = true
  phoneVerificationMessage.value = ''
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/users/sms-verification/confirm/`, {
      method: 'POST',
      body: { code: phoneVerificationCode.value.trim() },
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    phoneVerificationStatus.value = 'ok'
    phoneVerificationMessage.value = response?.detail || 'Teléfono verificado correctamente.'
    phoneVerificationCode.value = ''
    await loadProfile()
  } catch (error: any) {
    phoneVerificationStatus.value = 'error'
    phoneVerificationMessage.value = getErrorMessage(error) || 'Código SMS inválido.'
  } finally {
    confirmingPhoneVerificationCode.value = false
  }
}

const requestPasswordChangeOtp = async () => {
  if (!auth.token) return
  sendingPasswordOtpCode.value = true
  passwordMessage.value = ''
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/users/change-password/request-otp/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    passwordStatus.value = 'ok'
    passwordMessage.value = response?.detail || 'Te enviamos un código OTP al correo.'
  } catch (error: any) {
    passwordStatus.value = 'error'
    passwordMessage.value = getErrorMessage(error) || 'No pudimos enviar el código OTP.'
  } finally {
    sendingPasswordOtpCode.value = false
  }
}

const confirmPasswordChangeOtp = async () => {
  if (!auth.token) return
  confirmingPasswordOtp.value = true
  passwordMessage.value = ''
  try {
    const response = await $fetch<any>(`${config.public.apiBase}/users/change-password/confirm-otp/`, {
      method: 'POST',
      body: {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        otp_code: passwordOtpCode.value.trim(),
      },
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    passwordStatus.value = 'ok'
    passwordMessage.value = response?.detail || 'Contraseña actualizada con OTP.'
    passwordForm.current_password = ''
    passwordForm.new_password = ''
    passwordOtpCode.value = ''
  } catch (error: any) {
    passwordStatus.value = 'error'
    passwordMessage.value = getErrorMessage(error) || 'No pudimos cambiar la contraseña.'
  } finally {
    confirmingPasswordOtp.value = false
  }
}

const resetPaymentForm = () => {
  paymentForm.id = null
  paymentForm.provider = 'paypal'
  paymentForm.label = ''
  paymentForm.account_holder_name = ''
  paymentForm.account_email = ''
  paymentForm.card_brand = ''
  paymentForm.card_last4 = ''
  paymentForm.is_default = true
}

const loadPaymentMethods = async () => {
  if (!auth.token) return
  try {
    paymentMethods.value = await $fetch<any[]>(`${config.public.apiBase}/payments/profile-methods/`, {
      headers: { Authorization: `Bearer ${auth.token}` },
    })
  } catch {
    paymentMethods.value = []
  }
}

const editPaymentMethod = (method: any) => {
  paymentForm.id = method.id
  paymentForm.provider = method.provider || 'paypal'
  paymentForm.label = method.label || ''
  paymentForm.account_holder_name = method.account_holder_name || ''
  paymentForm.account_email = method.account_email || ''
  paymentForm.card_brand = method.card_brand || ''
  paymentForm.card_last4 = method.card_last4 || ''
  paymentForm.is_default = Boolean(method.is_default)
}

const savePaymentMethod = async () => {
  if (!auth.token) return
  savingPaymentMethod.value = true
  paymentMethodMessage.value = ''
  try {
    const payload: any = {
      provider: paymentForm.provider,
      label: paymentForm.label,
      account_holder_name: paymentForm.account_holder_name,
      account_email: paymentForm.provider === 'paypal' ? paymentForm.account_email : '',
      card_brand: paymentForm.provider === 'card' ? paymentForm.card_brand : '',
      card_last4: paymentForm.provider === 'card' ? paymentForm.card_last4 : '',
      is_default: paymentForm.is_default,
      is_active: true,
    }

    if (paymentForm.id) {
      await $fetch(`${config.public.apiBase}/payments/profile-methods/${paymentForm.id}/`, {
        method: 'PATCH',
        body: payload,
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      paymentMethodMessage.value = 'Método actualizado.'
    } else {
      await $fetch(`${config.public.apiBase}/payments/profile-methods/`, {
        method: 'POST',
        body: payload,
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      paymentMethodMessage.value = 'Método agregado.'
    }
    paymentMethodStatus.value = 'ok'
    resetPaymentForm()
    await loadPaymentMethods()
  } catch (error: any) {
    paymentMethodStatus.value = 'error'
    paymentMethodMessage.value = getErrorMessage(error) || 'No se pudo guardar el método.'
  } finally {
    savingPaymentMethod.value = false
  }
}

const deletePaymentMethod = async (methodId: number) => {
  if (!auth.token) return
  if (!window.confirm('¿Eliminar este método de pago?')) return
  try {
    await $fetch(`${config.public.apiBase}/payments/profile-methods/${methodId}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    if (paymentForm.id === methodId) resetPaymentForm()
    await loadPaymentMethods()
  } catch {
    paymentMethodStatus.value = 'error'
    paymentMethodMessage.value = 'No se pudo eliminar el método.'
  }
}

const saveProfile = async () => {
  if (!auth.token) return
  saving.value = true
  message.value = ''
  try {
    let avatarUrl = form.upload_avatar?.trim() || ''
    const hasAvatarChange = Boolean(avatarUrl)
    const body: any = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      rut: form.rut,
      address: form.address,
      phone: form.phone,
    }
    if (avatarUrl) {
      body.upload_avatar = avatarUrl
    }

    const updated = await $fetch<{
      first_name?: string
      last_name?: string
      email?: string
      rut?: string | null
      address?: string | null
      phone?: string | null
      avatar_url?: string | null
      avatar_updated_at?: string | null
      is_email_verified?: boolean
      email_verified_at?: string | null
    }>(`${config.public.apiBase}/users/me/`, {
      method: 'PATCH',
      body,
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    message.value = 'Perfil actualizado'
    messageType.value = 'ok'
    const localAvatarUpdatedAt = new Date().toISOString()
    auth.user = {
      ...(auth.user || {}),
      ...updated,
      ...(hasAvatarChange
        ? {
            avatar_url: avatarUrl,
            avatar_updated_at: updated.avatar_updated_at || localAvatarUpdatedAt,
          }
        : {}),
    }
    if (hasAvatarChange) {
      avatarPreview.value = buildAvatarUrl(avatarUrl, updated.avatar_updated_at || localAvatarUpdatedAt)
    } else {
      await auth.fetchProfile()
      if (updated?.avatar_url) {
        avatarPreview.value = buildAvatarUrl(updated.avatar_url, updated.avatar_updated_at || null)
      }
    }
    isEmailVerified.value = Boolean(updated?.is_email_verified)
    emailVerifiedAt.value = String(updated?.email_verified_at || '')
    isGoogleVerified.value = Boolean((updated as any)?.is_google_verified)
    googleVerifiedAt.value = String((updated as any)?.google_verified_at || '')
    isPhoneVerified.value = Boolean((updated as any)?.is_phone_verified)
    phoneVerifiedAt.value = String((updated as any)?.phone_verified_at || '')
    form.upload_avatar = ''
  } catch (error: any) {
    message.value = getErrorMessage(error) || 'No pudimos actualizar'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

const uploadToCloudinary = async (fileOrUrl: File | string, folder = 'upload/profile') => {
  if (!cloudinaryUploadUrl.value || !config.public.cloudinaryUploadPreset) {
    throw new Error('Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET')
  }
  const formData = new FormData()
  formData.append('file', fileOrUrl)
  formData.append('upload_preset', config.public.cloudinaryUploadPreset)
  formData.append('folder', folder)
  return $fetch<any>(cloudinaryUploadUrl.value, {
    method: 'POST',
    body: formData,
  })
}

const onFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return
  uploadError.value = ''
  uploadingAvatar.value = true
  try {
    const result = await uploadToCloudinary(file)
    if (!result?.secure_url) throw new Error('No pudimos obtener la URL de la imagen')
    setPendingAvatarPreview(result.secure_url)
  } catch (error) {
    uploadError.value = getErrorMessage(error) || 'No pudimos subir la imagen'
  } finally {
    uploadingAvatar.value = false
    if (target) target.value = ''
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyTheme()
  await loadProfile()
  await initGoogleVerification()
  await loadPaymentMethods()
})
</script>
