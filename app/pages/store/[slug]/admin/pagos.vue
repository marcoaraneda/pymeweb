<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Cuenta receptora de pagos</h1>
        <p class="text-sm text-slate-600">Configura donde llega el dinero de esta tienda.</p>
      </div>
      <button
        class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        :disabled="loading"
        @click="loadPayoutAccount"
      >
        {{ loading ? 'Actualizando...' : 'Actualizar' }}
      </button>
    </header>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="statusPillClass">{{ statusLabel }}</span>
        <span class="text-xs text-slate-500">Tienda: {{ slug }}</span>
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <label class="space-y-1 md:col-span-2">
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Método guardado en perfil (opcional)</span>
          <select v-model="selectedMethodId" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700" @change="onSelectSavedMethod">
            <option :value="0">Configurar manualmente</option>
            <option v-for="m in availableMethods" :key="m.id" :value="m.id">
              {{ m.label }} · {{ m.provider === 'paypal' ? `PayPal ${m.account_email || ''}` : `Tarjeta **** ${m.card_last4 || ''}` }}
            </option>
          </select>
        </label>

        <label class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Proveedor</span>
          <select v-model="form.provider" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700">
            <option value="paypal">PayPal</option>
            <option value="card">Tarjeta</option>
            <option value="bank_transfer">Transferencia bancaria</option>
          </select>
        </label>

        <label class="space-y-1" v-if="form.provider === 'paypal'">
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Correo PayPal</span>
          <input v-model="form.account_email" type="email" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="cobros@mitienda.com" />
        </label>

        <label class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Titular</span>
          <input v-model="form.account_holder_name" type="text" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Nombre del titular" />
        </label>

        <template v-if="form.provider === 'card'">
          <label class="space-y-1">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Ultimos 4 digitos de tarjeta</span>
            <input v-model="form.account_number_last4" type="text" maxlength="8" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="1234" />
          </label>
        </template>

        <template v-if="form.provider === 'bank_transfer'">
          <label class="space-y-1">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Banco</span>
            <input v-model="form.bank_name" type="text" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Banco" />
          </label>

          <label class="space-y-1">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Tipo de cuenta</span>
            <input v-model="form.account_type" type="text" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Corriente / Vista" />
          </label>

          <label class="space-y-1">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Ultimos 4 digitos</span>
            <input v-model="form.account_number_last4" type="text" maxlength="8" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="1234" />
          </label>
        </template>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          class="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          :style="{ backgroundColor: accentColor }"
          :disabled="saving"
          @click="savePayoutAccount"
        >
          {{ saving ? 'Guardando...' : 'Guardar cuenta receptora' }}
        </button>
        <button
          v-if="configured"
          class="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-60"
          :disabled="saving"
          @click="verifyPayoutAccount('verify')"
        >
          Marcar verificada
        </button>
        <button
          v-if="configured"
          class="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"
          :disabled="saving"
          @click="verifyPayoutAccount('reject')"
        >
          Rechazar
        </button>
        <p v-if="message" class="text-sm" :class="messageType === 'error' ? 'text-red-600' : 'text-emerald-700'">{{ message }}</p>
      </div>
    </section>

    <section v-if="events.length" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <h2 class="text-sm font-semibold text-slate-800">Historial de verificación y cambios</h2>
      <ul class="divide-y divide-slate-100">
        <li v-for="(event, idx) in events" :key="`${event.created_at}-${idx}`" class="py-2 text-sm">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="font-semibold text-slate-800">{{ eventActionLabel(event.action) }}</p>
            <span class="text-xs text-slate-500">{{ formatDate(event.created_at) }}</span>
          </div>
          <p class="text-xs text-slate-500">por {{ event.actor_username || 'sistema' }}</p>
          <p v-if="event.note" class="text-xs text-slate-600">{{ event.note }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true })

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()
const slug = route.params.slug as string

const loading = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'error'>('ok')
const configured = ref(false)
const verificationStatus = ref<'pending' | 'verified' | 'rejected' | ''>('')
const events = ref<any[]>([])
const availableMethods = ref<any[]>([])
const selectedMethodId = ref(0)

const form = reactive({
  provider: 'paypal',
  account_email: '',
  account_holder_name: '',
  bank_name: '',
  account_type: '',
  account_number_last4: '',
})

const accentColor = computed(() => theme.accent || '#2563eb')

const statusLabel = computed(() => {
  if (!configured.value) return 'Sin configurar'
  if (verificationStatus.value === 'verified') return 'Verificada'
  if (verificationStatus.value === 'rejected') return 'Rechazada'
  return 'Pendiente de verificacion'
})

const statusPillClass = computed(() => {
  if (!configured.value) return 'bg-slate-100 text-slate-700'
  if (verificationStatus.value === 'verified') return 'bg-emerald-100 text-emerald-700'
  if (verificationStatus.value === 'rejected') return 'bg-rose-100 text-rose-700'
  return 'bg-amber-100 text-amber-700'
})

const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
  if (!auth.token) throw new Error('No autenticado')
  const doFetch = (token: string) =>
    $fetch<T>(url as any, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    })

  try {
    return await doFetch(auth.token)
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) return doFetch(refreshed)
    }
    throw error
  }
}

const applyAccount = (account: any) => {
  selectedMethodId.value = Number(account?.payout_method?.id || 0)
  form.provider = account?.provider || 'paypal'
  form.account_email = account?.account_email || ''
  form.account_holder_name = account?.account_holder_name || ''
  form.bank_name = account?.bank_name || ''
  form.account_type = account?.account_type || ''
  form.account_number_last4 = account?.account_number_last4 || ''
  verificationStatus.value = account?.verification_status || ''
}

const onSelectSavedMethod = () => {
  const method = availableMethods.value.find((m) => Number(m.id) === Number(selectedMethodId.value))
  if (!method) return
  form.provider = method.provider || 'paypal'
  form.account_email = method.account_email || ''
  form.account_holder_name = method.account_holder_name || ''
  form.bank_name = ''
  form.account_type = ''
  form.account_number_last4 = method.card_last4 || ''
}

const loadPayoutAccount = async () => {
  loading.value = true
  message.value = ''
  try {
    const data = await authedFetch<any>(`${config.public.apiBase}/store/${slug}/admin/payments/payout-account/`)
    configured.value = Boolean(data?.configured)
    events.value = Array.isArray(data?.events) ? data.events : []
    availableMethods.value = Array.isArray(data?.available_methods) ? data.available_methods : []
    if (configured.value) {
      applyAccount(data?.account || {})
    } else {
      applyAccount({ provider: 'paypal' })
    }
  } catch {
    configured.value = false
    messageType.value = 'error'
    message.value = 'No se pudo cargar la cuenta receptora.'
  } finally {
    loading.value = false
  }
}

const verifyPayoutAccount = async (action: 'verify' | 'reject') => {
  message.value = ''
  let note = ''
  if (action === 'reject') {
    note = window.prompt('Motivo de rechazo (obligatorio):', '')?.trim() || ''
    if (!note) {
      messageType.value = 'error'
      message.value = 'Debes ingresar un motivo para rechazar.'
      return
    }
  } else {
    note = window.prompt('Nota opcional de verificación:', '')?.trim() || ''
  }

  saving.value = true
  try {
    const data = await authedFetch<any>(`${config.public.apiBase}/store/${slug}/admin/payments/payout-account/verify/`, {
      method: 'POST',
      body: { action, note },
    })

    configured.value = true
    applyAccount(data?.account || {})
    events.value = Array.isArray(data?.events) ? data.events : events.value
    messageType.value = 'ok'
    message.value = data?.message || 'Estado de verificación actualizado.'
  } catch (error: any) {
    messageType.value = 'error'
    message.value = error?.response?._data?.detail || 'No se pudo actualizar la verificación.'
  } finally {
    saving.value = false
  }
}

const eventActionLabel = (action: string) => {
  const map: Record<string, string> = {
    updated: 'Cuenta actualizada',
    verified: 'Cuenta verificada',
    rejected: 'Cuenta rechazada',
  }
  return map[String(action || '').toLowerCase()] || action || 'Evento'
}

const formatDate = (value: string) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

const readApiError = (error: any, fallback: string) => {
  const data = error?.response?._data
  if (!data) return fallback
  if (typeof data.detail === 'string' && data.detail) return data.detail
  if (typeof data === 'string' && data) return data
  const firstKey = Object.keys(data)[0]
  if (firstKey) {
    const raw = (data as any)[firstKey]
    if (Array.isArray(raw) && raw.length) return String(raw[0])
    if (typeof raw === 'string' && raw) return raw
  }
  return fallback
}

const savePayoutAccount = async () => {
  message.value = ''
  saving.value = true
  try {
    const payload = {
      payout_method_id: selectedMethodId.value || null,
      provider: form.provider,
      account_email: form.account_email,
      account_holder_name: form.account_holder_name,
      bank_name: form.bank_name,
      account_type: form.account_type,
      account_number_last4: form.account_number_last4,
    }

    const data = await authedFetch<any>(`${config.public.apiBase}/store/${slug}/admin/payments/payout-account/`, {
      method: 'PATCH',
      body: payload,
    })

    configured.value = true
    applyAccount(data?.account || payload)
    messageType.value = 'ok'
    message.value = data?.message || 'Cuenta receptora guardada.'
  } catch (error: any) {
    messageType.value = 'error'
    message.value = readApiError(error, 'No se pudo guardar la cuenta receptora.')
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  auth.restoreFromCookies()
  if (auth.token && !auth.user) {
    await auth.fetchProfile().catch(() => null)
  }
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await loadPayoutAccount()
})
</script>
