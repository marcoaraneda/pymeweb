<template>
  <div class="space-y-6">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">FAQ de la tienda</h1>
        <p class="text-sm text-slate-600">Administra preguntas frecuentes visibles para clientes.</p>
      </div>
      <button
        class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        :disabled="loading"
        @click="loadFaqs"
      >
        {{ loading ? 'Actualizando...' : 'Actualizar' }}
      </button>
    </header>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
      <h2 class="text-sm font-semibold text-slate-800">Nueva pregunta</h2>
      <div class="grid gap-3">
        <input
          v-model="form.question"
          type="text"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Pregunta frecuente"
        />
        <textarea
          v-model="form.answer"
          rows="3"
          class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          placeholder="Respuesta"
        ></textarea>
      </div>
      <div class="flex items-center gap-2">
        <button
          class="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          :style="{ backgroundColor: accentColor }"
          :disabled="saving"
          @click="createFaq"
        >
          {{ saving ? 'Guardando...' : 'Guardar FAQ' }}
        </button>
        <p v-if="message" class="text-sm" :class="messageType === 'error' ? 'text-red-600' : 'text-emerald-700'">{{ message }}</p>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex items-center justify-between">
        <h2 class="text-sm font-semibold text-slate-800">Items</h2>
        <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{{ faqs.length }}</span>
      </div>

      <div v-if="loading" class="mt-4 text-sm text-slate-500">Cargando FAQ...</div>
      <div v-else-if="!faqs.length" class="mt-4 text-sm text-slate-500">No hay preguntas frecuentes configuradas.</div>

      <ul v-else class="mt-4 divide-y divide-slate-100">
        <li v-for="faq in pagedFaqs" :key="faq.id" class="py-3 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-sm font-semibold text-slate-900">{{ faq.question }}</p>
              <p class="text-sm text-slate-700 whitespace-pre-line">{{ faq.answer }}</p>
            </div>
            <button
              class="rounded-full px-3 py-1 text-xs font-semibold"
              :class="faq.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'"
              @click="toggleActive(faq)"
            >
              {{ faq.is_active ? 'Activo' : 'Inactivo' }}
            </button>
          </div>
        </li>
      </ul>
      <div v-if="faqTotalPages > 1" class="mt-4 flex items-center justify-between text-xs text-slate-600">
        <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="faqPage === 1" @click="faqPage -= 1">Anterior</button>
        <span>Página {{ faqPage }} / {{ faqTotalPages }}</span>
        <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="faqPage === faqTotalPages" @click="faqPage += 1">Siguiente</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true })

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()
const slug = route.params.slug as string

type FAQItem = {
  id: number
  question: string
  answer: string
  is_active: boolean
  order: number
}

const loading = ref(false)
const saving = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'error'>('ok')
const faqs = ref<FAQItem[]>([])
const faqPage = ref(1)
const faqPageSize = 10

const form = reactive({
  question: '',
  answer: '',
})

const accentColor = computed(() => theme.accent || '#2563eb')
const faqTotalPages = computed(() => Math.max(1, Math.ceil(faqs.value.length / faqPageSize)))
const pagedFaqs = computed(() => {
  const start = (faqPage.value - 1) * faqPageSize
  return faqs.value.slice(start, start + faqPageSize)
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

const loadFaqs = async () => {
  loading.value = true
  try {
    faqs.value = await authedFetch<FAQItem[]>(`${config.public.apiBase}/store/${slug}/admin/faq/faqs/`)
    faqPage.value = 1
  } catch (error) {
    faqs.value = []
  } finally {
    loading.value = false
  }
}

const createFaq = async () => {
  message.value = ''
  if (!form.question.trim() || !form.answer.trim()) {
    messageType.value = 'error'
    message.value = 'Completa pregunta y respuesta.'
    return
  }

  saving.value = true
  try {
    await authedFetch(`${config.public.apiBase}/store/${slug}/admin/faq/faqs/`, {
      method: 'POST',
      body: {
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: 'general',
        order: faqs.value.length + 1,
        is_active: true,
      },
    })
    form.question = ''
    form.answer = ''
    messageType.value = 'ok'
    message.value = 'FAQ guardada.'
    await loadFaqs()
  } catch {
    messageType.value = 'error'
    message.value = 'No se pudo guardar la FAQ.'
  } finally {
    saving.value = false
  }
}

const toggleActive = async (item: FAQItem) => {
  const nextValue = !item.is_active
  try {
    await authedFetch(`${config.public.apiBase}/store/${slug}/admin/faq/faqs/${item.id}/`, {
      method: 'PATCH',
      body: { is_active: nextValue },
    })
    item.is_active = nextValue
  } catch {
    // no-op visual rollback not needed since we patch only after success
  }
}

onMounted(async () => {
  auth.restoreFromCookies()
  if (auth.token && !auth.user) {
    await auth.fetchProfile().catch(() => null)
  }
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await loadFaqs()
})

watch(faqs, () => {
  if (faqPage.value > faqTotalPages.value) faqPage.value = faqTotalPages.value
})
</script>
