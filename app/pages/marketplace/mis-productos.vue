<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <section class="border-b bg-white">
      <div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Marketplace</p>
          <h1 class="text-3xl font-bold text-slate-900">Mis publicaciones</h1>
          <p class="text-sm text-slate-600">Publica productos sin tienda y controla su estado (activo/vendido).</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <NuxtLink to="/marketplace" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 transition">
            Volver al marketplace
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 py-10 space-y-6">
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-slate-900">Publicar nuevo producto</h2>
        <p class="text-sm text-slate-600">Se crea en tu tienda oculta de marketplace. Puedes activarlo o desactivarlo cuando se venda.</p>
        <div class="mt-4 grid gap-4 md:grid-cols-2">
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Nombre</label>
            <input v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Precio</label>
            <input v-model.number="form.price" type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="hasOffer" type="checkbox" />
              Activar oferta
            </label>
          </div>
          <div v-if="hasOffer" class="space-y-2">
            <label class="text-sm text-slate-600">Precio oferta (opcional)</label>
            <input v-model.number="form.offer_price" type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div v-if="hasOffer" class="space-y-2">
            <label class="text-sm text-slate-600">Cantidad mínima para oferta</label>
            <input v-model.number="form.offer_min_qty" type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Categoría</label>
            <select v-model="form.category" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">Sin categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.free_shipping" type="checkbox" />
              Envío gratis
            </label>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Stock disponible</label>
            <input v-model.number="form.stock_available" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Stock mínimo</label>
            <input v-model.number="form.stock_minimum" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div v-if="supportsSizeStock" class="space-y-2 md:col-span-2">
            <label class="text-sm text-slate-600">Cantidad por talla</label>
            <div class="grid gap-2 sm:grid-cols-3">
              <div v-for="size in availableSizes" :key="`size-${size}`" class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <p class="text-xs font-semibold text-slate-700">{{ size }}</p>
                <input
                  :value="sizeStockMap[size] || 0"
                  type="number"
                  min="0"
                  step="1"
                  class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"
                  @input="updateSizeQty(size, $event)"
                />
              </div>
            </div>
            <p class="text-xs text-slate-500">Disponible para calzado, poleron y pantalon. El stock disponible se calcula automáticamente.</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Imagen (URL)</label>
            <input v-model="form.image_url" type="url" placeholder="https://..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <div class="flex items-center gap-3 text-xs text-slate-500">
              <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition">
                <input type="file" accept="image/*" class="hidden" @change="onFileSelect" />
                <span>{{ uploadingImage ? 'Subiendo...' : 'Subir archivo' }}</span>
              </label>
              <span>o pega un enlace</span>
            </div>
            <p class="text-xs text-slate-500">Opcional; se sube a Cloudinary.</p>
            <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
          </div>
          <div class="space-y-2 md:col-span-2">
            <label class="text-sm text-slate-600">Descripción</label>
            <textarea v-model="form.description" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-3">
          <button
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="accentStyle"
            :disabled="submitting || retryCooldown > 0 || !form.name || !form.price"
            @click="submit"
          >
            <Loader2 v-if="submitting" class="h-4 w-4 animate-spin" />
            {{ submitting ? 'Publicando...' : retryCooldown > 0 ? `Espera ${retryCooldown}s` : 'Publicar producto' }}
          </button>
          <p v-if="formMessage" class="text-sm" :class="formMessageType === 'error' ? 'text-red-600' : 'text-green-600'">{{ formMessage }}</p>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-semibold text-slate-900">Mis productos</h2>
            <p class="text-sm text-slate-600">Activa o desactiva cuando se venda.</p>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 transition"
            @click="fetchMySubmissions"
            :disabled="loading"
          >
            <Loader2 v-if="loading" class="h-4 w-4 animate-spin" />
            Recargar
          </button>
        </div>

        <div v-if="loading" class="mt-4 grid gap-4 md:grid-cols-2">
          <div v-for="i in 4" :key="`skeleton-${i}`" class="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="mb-3 h-4 w-40 rounded bg-slate-200" />
            <div class="mb-2 h-3 w-24 rounded bg-slate-200" />
            <div class="mb-2 h-3 w-full rounded bg-slate-200" />
            <div class="h-8 w-28 rounded bg-slate-200" />
          </div>
        </div>
        <div v-else-if="error" class="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 flex items-center justify-between gap-3">
          <div class="space-y-1">
            <span>{{ error }}</span>
            <p v-if="usingCachedSubmissions" class="text-xs text-red-600">
              Mostrando datos guardados temporalmente para que puedas seguir trabajando.
            </p>
            <p v-if="retryCooldown > 0" class="text-xs text-red-600">
              Puedes reintentar en {{ retryCooldown }}s.
            </p>
          </div>
          <button
            class="rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
            :disabled="loading || retryCooldown > 0"
            @click="fetchMySubmissions({ force: true })"
          >
            {{ retryCooldown > 0 ? `Reintentar (${retryCooldown}s)` : 'Reintentar' }}
          </button>
        </div>
        <div v-else-if="!submissions.length" class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600">
          Aún no publicas productos en marketplace.
        </div>
        <div v-else class="mt-4 grid gap-4 md:grid-cols-2">
          <div v-if="toggleError" class="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm">
            {{ toggleError }}
          </div>
          <article
            v-for="item in paginatedSubmissions"
            :key="item.id"
            class="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div class="flex items-center justify-between gap-2 relative">
              <p class="text-sm font-semibold text-slate-900 line-clamp-1">{{ item.name }}</p>
              <span
                class="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold"
                :class="item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'"
              >
                <CheckCircle2 v-if="item.is_active" class="h-4 w-4" />
                <XCircle v-else class="h-4 w-4" />
                {{ item.is_active ? 'Activo' : 'Inactivo' }}
              </span>
              <div class="relative">
                <button @click="openMenu(item.id)" class="ml-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                </button>
                <div v-if="openMenuId === item.id" class="absolute right-0 top-8 z-50 min-w-[160px] rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button @click="goToDetail(item)" class="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Ver detalle
                  </button>
                  <button @click="goToEdit(item)" class="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Editar
                  </button>
                  <button @click="deleteProduct(item)" class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
            <p class="text-sm text-slate-600 line-clamp-1">{{ item.description || 'Sin descripción' }}</p>
            <div class="flex flex-wrap items-center gap-2">
              <span v-if="item.offer_price" class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Oferta {{ discountBadge(item) }}</span>
              <span v-if="item.free_shipping" class="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-800">Envío gratis</span>
            </div>
            <p class="text-base font-bold" :class="item.offer_price ? 'text-red-600' : 'text-black'">
              <span v-if="item.offer_price" class="mr-1 text-slate-400 line-through">{{ formatClp(item.price) }}</span>
              {{ formatClp(displayPrice(item)) }}
            </p>
            <p v-if="item.offer_price && Number(item.offer_min_qty || 1) > 1" class="text-xs font-semibold text-rose-700">Oferta desde {{ Number(item.offer_min_qty) }} unidades</p>
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <span>Slug: {{ item.slug }}</span>
              <span>·</span>
              <span>ID: {{ item.id }}</span>
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 transition"
                :disabled="togglingId === item.id"
                @click="toggleActive(item)"
              >
                <Loader2 v-if="togglingId === item.id" class="h-4 w-4 animate-spin" />
                {{ item.is_active ? 'Marcar vendido (desactivar)' : 'Reactivar' }}
              </button>
            </div>
          </article>
        </div>

        <div v-if="submissions.length > perPage" class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
          <button
            class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"
            :disabled="page === 1"
            @click="page -= 1"
          >
            Anterior
          </button>
          <p>Mostrando {{ pageStart }}-{{ pageEnd }} de {{ submissions.length }}</p>
          <button
            class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"
            :disabled="page === totalPages"
            @click="page += 1"
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, computed, watch } from 'vue'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useMarketplaceRequests } from '~/composables/useMarketplaceRequests'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-vue-next'

definePageMeta({ middleware: ['auth'], requiresAuth: true })

const openMenuId = ref<number|null>(null)
const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0)
const displayPrice = (item: any) => {
  const minQty = Math.max(1, Number(item?.offer_min_qty || 1))
  if (item?.offer_price && minQty <= 1) return Number(item.offer_price)
  return Number(item?.price || 0)
}
const discountPercent = (item: any) => {
  const price = Number(item?.price || 0)
  const offer = Number(item?.offer_price || 0)
  if (!price || !offer || offer >= price) return 0
  return Math.round(((price - offer) / price) * 100)
}
const discountBadge = (item: any) => {
  const pct = discountPercent(item)
  return pct > 0 ? `-${pct}%` : ''
}
const openMenu = (id:number) => {
  openMenuId.value = openMenuId.value === id ? null : id
}
const goToDetail = (item:any) => {
  openMenuId.value = null
  navigateTo(`/marketplace/productos/${item.slug}`)
}
const goToEdit = (item:any) => {
  openMenuId.value = null
  navigateTo(`/marketplace/productos/${item.slug}?edit=1`)
}
const deleteProduct = async (item:any) => {
  openMenuId.value = null
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  if (!confirm(`¿Eliminar ${item.name}?`)) return
  toggleError.value = ''
  try {
    await controlledMutation(
      `marketplace:submissions:delete:${item.id}`,
      `${config.public.apiBase}/marketplace/submissions/${item.id}/`,
      {
        method: 'DELETE',
        headers: authHeader.value,
        backoffMs: 10_000,
      },
    )
    submissions.value = submissions.value.filter((submission) => submission.id !== item.id)
    formMessage.value = 'Producto eliminado.'
    formMessageType.value = 'ok'
  } catch (err: any) {
    if (err?.response?.status === 429) {
      const seconds = Math.max(
        10,
        Number(getErrorRetryAfterSeconds(err) || 0),
        getBackoffSeconds(`marketplace:submissions:delete:${item.id}`),
      )
      startRetryCooldown(seconds)
      toggleError.value = `Demasiadas solicitudes. Espera ${seconds}s antes de intentar eliminar nuevamente.`
      return
    }
    toggleError.value = getErrorMessage(err) || 'No pudimos eliminar el producto'
  }
}

const auth = useAuthStore()
const theme = useThemeStore()
const config = useRuntimeConfig()
const { controlledGet, controlledMutation, getBackoffSeconds, getErrorRetryAfterSeconds } = useMarketplaceRequests()

const submissions = ref<any[]>([])
const page = ref(1)
const perPage = 12
const loading = ref(false)
const error = ref('')
const submitting = ref(false)
const togglingId = ref<number | null>(null)
const toggleError = ref('')
const categories = ref<any[]>([])
const sizeStockMap = reactive<Record<string, number>>({})
const uploadingImage = ref(false)
const uploadError = ref('')
const SUBMISSIONS_CACHE_KEY = 'marketplace_submissions_cache_v1'
const SUBMISSIONS_CACHE_TTL = 1000 * 15
const usingCachedSubmissions = ref(false)
const retryCooldown = ref(0)
let retryCooldownTimer: ReturnType<typeof setInterval> | null = null

const form = reactive({
  name: '',
  price: null as number | null,
  offer_price: null as number | null,
  offer_min_qty: 1,
  description: '',
  image_url: '',
  is_active: true,
  category: '' as string | number,
  stock_available: 0,
  stock_minimum: 0,
  free_shipping: false,
})
const hasOffer = ref(false)
const apparelSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

const selectedCategoryName = computed(() => {
  const selected = categories.value.find((cat: any) => String(cat.id) === String(form.category))
  return String(selected?.name || '').toLowerCase()
})

const supportsSizeStock = computed(() => /calzado|poleron|polerón|pantalon|pantalón/.test(selectedCategoryName.value))
const availableSizes = computed(() => (/calzado/.test(selectedCategoryName.value) ? shoeSizes : apparelSizes))

const syncStockFromSizes = () => {
  if (!supportsSizeStock.value) return
  form.stock_available = Object.values(sizeStockMap).reduce((acc, qty) => acc + (Number(qty) || 0), 0)
}

const updateSizeQty = (size: string, event: Event) => {
  const target = event.target as HTMLInputElement | null
  const qty = Math.max(0, Number(target?.value || 0))
  sizeStockMap[size] = qty
  syncStockFromSizes()
}

const formMessage = ref('')
const formMessageType = ref<'ok' | 'error'>('ok')

const totalPages = computed(() => Math.max(1, Math.ceil(submissions.value.length / perPage)))
const paginatedSubmissions = computed(() => {
  const start = (page.value - 1) * perPage
  return submissions.value.slice(start, start + perPage)
})
const pageStart = computed(() => (submissions.value.length ? (page.value - 1) * perPage + 1 : 0))
const pageEnd = computed(() => Math.min(page.value * perPage, submissions.value.length))

watch(submissions, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: '#fff' }))

const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})

const authHeader = computed(() => ({ Authorization: `Bearer ${auth.token}` }))

const getErrorMessage = (err: any) => {
  const detail = err?.response?._data?.detail
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.join(', ')
  if (detail && typeof detail === 'object') return Object.values(detail).flat().join(', ')
  return err?.message || 'Ocurrió un error'
}

const isHttpsUrl = (value?: string) => {
  if (!value) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const stopRetryCooldown = () => {
  if (retryCooldownTimer) {
    clearInterval(retryCooldownTimer)
    retryCooldownTimer = null
  }
}

const startRetryCooldown = (seconds = 10) => {
  stopRetryCooldown()
  retryCooldown.value = seconds
  retryCooldownTimer = setInterval(() => {
    if (retryCooldown.value <= 1) {
      retryCooldown.value = 0
      stopRetryCooldown()
      return
    }
    retryCooldown.value -= 1
  }, 1000)
}

const fetchMySubmissions = async (options?: { force?: boolean }) => {
  if (!auth.token) return
  const force = options?.force === true

  if (!force && retryCooldown.value > 0) {
    return
  }

  if (process.client) {
    try {
      const raw = localStorage.getItem(SUBMISSIONS_CACHE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as { ts: number; data: any[] }
        if (Array.isArray(parsed?.data) && Date.now() - Number(parsed?.ts || 0) < SUBMISSIONS_CACHE_TTL) {
          submissions.value = parsed.data
          return
        }
      }
    } catch {
      // Ignorar cache inválida.
    }
  }

  loading.value = true
  error.value = ''
  try {
    const data = await controlledGet<any[]>(
      'marketplace:submissions:list',
      `${config.public.apiBase}/marketplace/submissions/`,
      {
        headers: authHeader.value,
        force,
        backoffMs: 10_000,
        minIntervalMs: 1200,
      },
    )
    submissions.value = data
    usingCachedSubmissions.value = false
    retryCooldown.value = 0
    stopRetryCooldown()
    if (process.client) {
      localStorage.setItem(
        SUBMISSIONS_CACHE_KEY,
        JSON.stringify({ ts: Date.now(), data }),
      )
    }
  } catch (err: any) {
    if (err?.response?.status === 429) {
      const waitSeconds = Math.max(
        10,
        Number(getErrorRetryAfterSeconds(err) || 0),
        getBackoffSeconds('marketplace:submissions:list'),
      )
      error.value = 'Demasiadas solicitudes al servidor. Espera unos segundos y vuelve a intentar.'
      startRetryCooldown(waitSeconds)
      usingCachedSubmissions.value = false
      if (process.client) {
        try {
          const raw = localStorage.getItem(SUBMISSIONS_CACHE_KEY)
          if (raw) {
            const parsed = JSON.parse(raw) as { data: any[] }
            if (Array.isArray(parsed?.data)) {
              submissions.value = parsed.data
              usingCachedSubmissions.value = true
            }
          }
        } catch {
          // Ignorar fallback de cache.
        }
      }
      return
    }
    error.value = getErrorMessage(err) || 'No pudimos cargar tus productos'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  form.name = ''
  form.price = null
  form.offer_price = null
  form.offer_min_qty = 1
  form.description = ''
  form.image_url = ''
  form.is_active = true
  form.category = ''
  form.stock_available = 0
  form.stock_minimum = 0
  form.free_shipping = false
  Object.keys(sizeStockMap).forEach((key) => delete sizeStockMap[key])
  hasOffer.value = false
}

const fetchCategories = async () => {
  try {
    categories.value = await $fetch(`${config.public.apiBase}/marketplace/categories/`)
  } catch {
    categories.value = []
  }
}

const uploadToCloudinary = async (fileOrUrl: File | string, folder = 'upload/product') => {
  if (!cloudinaryUploadUrl.value || !config.public.cloudinaryUploadPreset) {
    throw new Error('Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET')
  }
  const formData = new FormData()
  formData.append('file', fileOrUrl)
  formData.append('upload_preset', config.public.cloudinaryUploadPreset)
  formData.append('folder', folder)
  return $fetch<any>(cloudinaryUploadUrl.value, { method: 'POST', body: formData })
}

const onFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return
  uploadError.value = ''
  uploadingImage.value = true
  try {
    const result = await uploadToCloudinary(file)
    if (!result?.secure_url) throw new Error('No pudimos obtener la URL de la imagen')
    form.image_url = result.secure_url
  } catch (err: any) {
    uploadError.value = getErrorMessage(err) || 'No pudimos subir la imagen'
  } finally {
    uploadingImage.value = false
    if (target) target.value = ''
  }
}

const submit = async () => {
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  const name = form.name?.trim()
  if (!name || name.length < 3) {
    formMessage.value = 'Ingresa un nombre de al menos 3 caracteres'
    formMessageType.value = 'error'
    return
  }
  if (!form.price || form.price <= 0) {
    formMessage.value = 'Ingresa un precio mayor a 0'
    formMessageType.value = 'error'
    return
  }
  if (hasOffer.value) {
    if (form.offer_price == null || form.offer_price <= 0) {
      formMessage.value = 'La oferta debe ser mayor a 0'
      formMessageType.value = 'error'
      return
    }
    if (Number(form.offer_price) >= Number(form.price)) {
      formMessage.value = 'La oferta debe ser menor al precio'
      formMessageType.value = 'error'
      return
    }
    if (form.offer_min_qty < 1) {
      formMessage.value = 'La cantidad mínima de oferta debe ser al menos 1'
      formMessageType.value = 'error'
      return
    }
  }
  if (form.stock_available != null && form.stock_available < 0) {
    formMessage.value = 'El stock no puede ser negativo'
    formMessageType.value = 'error'
    return
  }
  if (form.stock_minimum != null && form.stock_minimum < 0) {
    formMessage.value = 'El stock mínimo no puede ser negativo'
    formMessageType.value = 'error'
    return
  }
  if (uploadingImage.value) {
    formMessage.value = 'Espera a que termine la subida de imagen'
    formMessageType.value = 'error'
    return
  }
  if (form.image_url && !isHttpsUrl(form.image_url)) {
    formMessage.value = 'La imagen debe ser un enlace válido con https'
    formMessageType.value = 'error'
    return
  }
  submitting.value = true
  formMessage.value = ''
  try {
    const payload: any = {
      name,
      price: form.price,
      description: form.description,
      is_active: form.is_active,
      stock_available: form.stock_available,
      stock_minimum: form.stock_minimum,
      size_stock_map: supportsSizeStock.value ? Object.fromEntries(Object.entries(sizeStockMap).filter(([_, qty]) => Number(qty) > 0)) : {},
      free_shipping: form.free_shipping,
    }
    if (hasOffer.value) {
      payload.offer_price = form.offer_price
      payload.offer_min_qty = Math.max(1, Number(form.offer_min_qty) || 1)
    }
    if (form.image_url) payload.image_url = form.image_url
    if (form.category) payload.category = form.category

    const created = await controlledMutation<any>(
      'marketplace:submissions:create',
      `${config.public.apiBase}/marketplace/submissions/`,
      {
        method: 'POST',
        body: payload,
        headers: authHeader.value,
        backoffMs: 10_000,
      },
    )
    submissions.value = [created, ...submissions.value]
    formMessage.value = 'Producto publicado. Puedes activarlo o desactivarlo cuando se venda.'
    formMessageType.value = 'ok'
    resetForm()
  } catch (err: any) {
    if (err?.response?.status === 429) {
      const seconds = Math.max(
        10,
        Number(getErrorRetryAfterSeconds(err) || 0),
        getBackoffSeconds('marketplace:submissions:create'),
      )
      startRetryCooldown(seconds)
      formMessage.value = `Demasiadas solicitudes. Espera ${seconds}s para volver a publicar.`
      formMessageType.value = 'error'
      return
    }
    formMessage.value = getErrorMessage(err) || 'No pudimos publicar el producto'
    formMessageType.value = 'error'
  } finally {
    submitting.value = false
  }
}

const toggleActive = async (item: any) => {
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  togglingId.value = item.id
  toggleError.value = ''
  try {
    const updated = await controlledMutation<any>(
      `marketplace:submissions:toggle:${item.id}`,
      `${config.public.apiBase}/marketplace/submissions/${item.id}/`,
      {
        method: 'PATCH',
        body: { is_active: !item.is_active },
        headers: authHeader.value,
        backoffMs: 10_000,
      },
    )
    submissions.value = submissions.value.map((s) => (s.id === item.id ? updated : s))
  } catch (err: any) {
    if (err?.response?.status === 429) {
      const seconds = Math.max(
        10,
        Number(getErrorRetryAfterSeconds(err) || 0),
        getBackoffSeconds(`marketplace:submissions:toggle:${item.id}`),
      )
      startRetryCooldown(seconds)
      toggleError.value = `Demasiadas solicitudes. Espera ${seconds}s para volver a cambiar el estado.`
      return
    }
    toggleError.value = getErrorMessage(err) || 'No pudimos actualizar el estado'
  } finally {
    togglingId.value = null
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyTheme()
  auth.restoreFromCookies()
  await auth.initializeSession().catch(() => null)
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  await fetchCategories()
  await fetchMySubmissions()
})

onBeforeUnmount(() => {
  stopRetryCooldown()
})

watch(
  () => form.offer_price,
  (value) => {
    if (value == null) return
    hasOffer.value = true
  },
)

watch(hasOffer, (enabled) => {
  if (!enabled) {
    form.offer_price = null
    form.offer_min_qty = 1
  }
})

watch([supportsSizeStock, availableSizes], () => {
  if (!supportsSizeStock.value) {
    Object.keys(sizeStockMap).forEach((key) => delete sizeStockMap[key])
    return
  }
  availableSizes.value.forEach((size) => {
    if (sizeStockMap[size] == null) sizeStockMap[size] = 0
  })
  Object.keys(sizeStockMap).forEach((size) => {
    if (!availableSizes.value.includes(size)) delete sizeStockMap[size]
  })
  syncStockFromSizes()
}, { immediate: true })
</script>
