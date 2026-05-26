<template>
  <div class="bg-slate-50 min-h-screen px-4 py-10">
    <div class="mx-auto max-w-3xl space-y-8">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Perfil</p>
            <h1 class="text-2xl font-bold text-slate-900">Editar perfil</h1>
          </div>
          <button class="text-sm font-semibold text-red-600" @click="auth.logout()">Cerrar sesión</button>
        </div>

        <div class="mt-6 flex items-center gap-4">
          <div class="h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-500">
              {{ initials }}
            </div>
          </div>
          <div class="flex-1">
            <label class="text-sm text-slate-600">URL de avatar (Cloudinary u otra)</label>
            <div class="mt-1 flex gap-2">
              <input v-model="form.upload_avatar" type="url" placeholder="https://..." class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <button
                class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
                :style="accentStyle"
                :disabled="saving"
                @click="saveProfile"
              >
                Subir avatar
              </button>
            </div>
            <p class="text-xs text-slate-500 mt-1">Pega una URL de imagen. Se subirá a tu perfil.</p>
          </div>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
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
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Seguridad</p>
        <h2 class="text-xl font-semibold text-slate-900">Cambiar contraseña</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Contraseña actual</label>
            <input v-model="passwordForm.current_password" type="password" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Nueva contraseña</label>
            <input v-model="passwordForm.new_password" type="password" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-3">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="accentStyle"
            :disabled="changing"
            @click="changePassword"
          >
            {{ changing ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
          <p class="text-sm" v-if="passwordMessage" :class="passwordStatus === 'error' ? 'text-red-600' : 'text-green-600'">{{ passwordMessage }}</p>
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

const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()

const form = reactive({ first_name: '', last_name: '', email: '', upload_avatar: '' })
const avatarPreview = ref('')
const passwordForm = reactive({ current_password: '', new_password: '' })
const saving = ref(false)
const changing = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'error'>('ok')
const passwordMessage = ref('')
const passwordStatus = ref<'ok' | 'error'>('ok')

const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: '#fff' }))
const initials = computed(() => (auth.user?.username || 'U').slice(0, 2).toUpperCase())

const loadProfile = async () => {
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  const profile = await auth.fetchProfile()
  if (profile) {
    form.first_name = profile.first_name || ''
    form.last_name = profile.last_name || ''
    form.email = profile.email || ''
    avatarPreview.value = (profile as any).avatar_url || ''
  }
}

const saveProfile = async () => {
  if (!auth.token) return
  saving.value = true
  message.value = ''
  try {
    const body: any = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
    }
    if (form.upload_avatar?.trim()) {
      body.upload_avatar = form.upload_avatar.trim()
    }

    const updated = await $fetch(`${config.public.apiBase}/users/me/`, {
      method: 'PUT',
      body,
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    message.value = 'Perfil actualizado'
    messageType.value = 'ok'
    await auth.fetchProfile()
    if ((updated as any).avatar_url) {
      avatarPreview.value = (updated as any).avatar_url
    }
    form.upload_avatar = ''
  } catch (error: any) {
    message.value = error?.response?._data?.detail || 'No pudimos actualizar'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (!auth.token) return
  changing.value = true
  passwordMessage.value = ''
  try {
    await $fetch(`${config.public.apiBase}/users/change-password/`, {
      method: 'POST',
      body: passwordForm,
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    passwordMessage.value = 'Contraseña actualizada'
    passwordStatus.value = 'ok'
    passwordForm.current_password = ''
    passwordForm.new_password = ''
  } catch (error: any) {
    passwordMessage.value = error?.response?._data?.detail || 'No pudimos actualizar la contraseña'
    passwordStatus.value = 'error'
  } finally {
    changing.value = false
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyTheme()
  await loadProfile()
})
</script>
