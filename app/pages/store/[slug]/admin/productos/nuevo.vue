<template>
  <div class="bg-slate-50 px-4 py-10 min-h-screen">
    <div class="mx-auto max-w-3xl space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Productos</p>
          <h1 class="text-2xl font-bold text-slate-900">Nuevo producto</h1>
        </div>
        <NuxtLink :to="`/store/${slug}/productos`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Volver</NuxtLink>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div class="grid gap-4">
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Nombre</label>
            <input v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Slug</label>
            <input v-model="form.slug" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-xs text-slate-500">Se usa en la URL. Usa letras, números y guiones.</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Descripción</label>
            <textarea v-model="form.description" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Precio</label>
              <input v-model.number="form.price" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Precio oferta por unidad (opcional)</label>
              <input v-model.number="form.offer_price" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <p class="text-xs text-slate-500">Ej: 1990 para mostrar un pack como 3x1990.</p>
            </div>
            <div class="space-y-2 sm:col-span-2">
              <label class="text-sm text-slate-600">Cantidad mínima para oferta</label>
              <input v-model.number="form.offer_min_qty" type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <p class="text-xs text-slate-500">Ej: 3 para activar la oferta desde 3 unidades.</p>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Categoría</label>
            <select v-model="form.category" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">Sin categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <p class="text-xs text-slate-500">Selecciona una categoría disponible.</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Marca (opcional)</label>
            <input v-model="form.brand" type="text" placeholder="Ej: Nike, Samsung, Oster" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-xs text-slate-500">Se usa para dividir vitrinas por marca dentro de cada categoría.</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Stock disponible</label>
              <input v-model.number="form.stock_available" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Stock mínimo</label>
              <input v-model.number="form.stock_minimum" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div v-if="requiresSizeQty" class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <p class="text-sm font-semibold text-slate-900">Cantidad por talla {{ isShoesCategory ? 'de zapatilla' : '' }}</p>
              <p class="text-xs text-slate-500">Define unidades por talla. El total se usa como stock disponible.</p>
            </div>
            <div class="grid gap-2 sm:grid-cols-3">
              <label v-for="size in activeSizeOptions" :key="size" class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                <span class="font-semibold text-slate-700">{{ size }}</span>
                <input v-model.number="sizeQty[size]" type="number" min="0" step="1" class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right" />
              </label>
            </div>
            <p class="text-xs text-slate-600">Total por talla: <span class="font-semibold">{{ sizeQtyTotal }}</span> unidades.</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Imagen (URL)</label>
            <input v-model="form.image_url" type="url" placeholder="https://..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-xs text-slate-500">Pegamos la URL y se sube a Cloudinary automáticamente.</p>
          </div>
          <div class="flex flex-wrap gap-4">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.is_featured" type="checkbox" />
              Oferta destacada (palomita)
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.product_of_week" type="checkbox" />
              Producto de la semana
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.is_active" type="checkbox" />
              Activo
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.is_marketplace" type="checkbox" />
              Publicar en marketplace
            </label>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="accentStyle"
            :disabled="saving"
            @click="save"
          >
            {{ saving ? 'Guardando...' : 'Guardar producto' }}
          </button>
          <p class="text-sm" v-if="message" :class="messageType === 'error' ? 'text-red-600' : 'text-green-600'">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useTenantStore } from '~/stores/tenant'
import { getCatalogCategorySeedsByStoreType } from '~/constants/catalogCategorySeeds'

definePageMeta({ layout: 'store', middleware: ['tenant', 'auth'], requiresAuth: true })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()
const tenantStore = useTenantStore()

const slug = route.params.slug as string
const storeType = computed(() => String((tenantStore.data as any)?.store_type || 'retail'))

const form = reactive({
  name: '',
  slug: '',
  brand: '',
  description: '',
  price: 0,
  offer_price: null as number | null,
  offer_min_qty: 1,
  stock_available: 0,
  stock_minimum: 0,
  category: '' as string | number,
  is_featured: false,
  product_of_week: false,
  is_active: true,
  image_url: '',
  is_marketplace: false,
})

const saving = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'error'>('ok')
const categories = ref<any[]>([])
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const sizeOptions = [...clothingSizes, ...shoeSizes]
const sizeQty = reactive<Record<string, number>>({})
sizeOptions.forEach((size) => {
  sizeQty[size] = 0
})

const selectedCategoryName = computed(() => {
  const selected = categories.value.find((cat: any) => String(cat.id) === String(form.category))
  return String(selected?.name || '').toLowerCase()
})
const defaultCategory = computed(() => {
  if (storeType.value !== 'fast_food') return null
  return categories.value.find((cat: any) => String(cat?.slug || '').toLowerCase() === 'agregados') || null
})
const isShoesCategory = computed(() => /calzado|zapat|shoe|sneaker/.test(selectedCategoryName.value))
const isClothingCategory = computed(() => /ropa|vest|camis|pantal|polera|poleron|polerón/.test(selectedCategoryName.value))
const requiresSizeQty = computed(() => isShoesCategory.value || isClothingCategory.value)
const activeSizeOptions = computed(() => (isShoesCategory.value ? shoeSizes : clothingSizes))
const sizeQtyTotal = computed(() => activeSizeOptions.value.reduce((acc, size) => acc + (Number(sizeQty[size]) || 0), 0))

const normalizedSizeStockMap = computed(() => {
  const map: Record<string, number> = {}
  activeSizeOptions.value.forEach((size) => {
    const qty = Math.max(0, Number(sizeQty[size]) || 0)
    if (qty > 0) map[size] = qty
  })
  return map
})

watch(
  () => [requiresSizeQty.value, sizeQtyTotal.value],
  () => {
    if (requiresSizeQty.value) {
      form.stock_available = sizeQtyTotal.value
    }
  }
)

const accentStyle = computed(() => ({ backgroundColor: theme.accent || 'var(--accent,#2563eb)', color: '#fff' }))

const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
  if (!auth.token) {
    await auth.initializeSession()
  }
  if (!auth.token && auth.refreshToken) {
    await auth.refreshTokens()
  }
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

const loadCategories = async () => {
  try {
    tenantStore.setSlug(slug)
    if (!tenantStore.data) {
      await tenantStore.fetchTienda()
    }

    const storeType = String((tenantStore.data as any)?.store_type || 'retail')
    const allowedSeeds = getCatalogCategorySeedsByStoreType(storeType)
    const allowedSlugs = new Set(allowedSeeds.map((seed) => seed.slug))

    let fetchedCategories = await authedFetch<any[]>(`${config.public.apiBase}/store/${slug}/catalogo/categories/`)
    const existingSlugs = new Set(fetchedCategories.map((cat: any) => String(cat?.slug || '').toLowerCase()))
    let createdAny = false

    for (const seed of allowedSeeds) {
      if (existingSlugs.has(seed.slug)) continue
      try {
        await authedFetch(`${config.public.apiBase}/store/${slug}/catalogo/categories/`, {
          method: 'POST',
          body: seed,
        })
        createdAny = true
      } catch {
        // Si no se puede crear por permisos o estado, mantenemos flujo sin bloquear.
      }
    }

    if (createdAny) {
      fetchedCategories = await authedFetch<any[]>(`${config.public.apiBase}/store/${slug}/catalogo/categories/`)
    }

    categories.value = fetchedCategories.filter((cat: any) => allowedSlugs.has(String(cat?.slug || '').toLowerCase()))
    if (!form.category && defaultCategory.value?.id != null) {
      form.category = defaultCategory.value.id
    }
  } catch (error) {
    categories.value = []
  }
}
const save = async () => {
  if (!auth.token) {
    message.value = 'Inicia sesión para crear productos'
    messageType.value = 'error'
    return
  }

  saving.value = true
  message.value = ''

  const slugValue = form.slug || form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
  const buildPayload = () => ({
    name: form.name,
    slug: slugValue,
    brand: String(form.brand || '').trim(),
    description: form.description,
    price: form.price,
    offer_price: form.offer_price,
    offer_min_qty: Math.max(1, Number(form.offer_min_qty) || 1),
    stock_available: Math.max(0, Number(form.stock_available) || 0),
    stock_minimum: Math.max(0, Number(form.stock_minimum) || 0),
    size_stock_map: requiresSizeQty.value ? normalizedSizeStockMap.value : {},
    is_featured: form.is_featured,
    product_of_week: form.product_of_week,
    is_active: form.is_active,
    is_marketplace: form.is_marketplace,
    ...(form.category ? { category: form.category } : {}),
    ...(form.image_url ? { image_url: form.image_url } : {}),
  })
  const doSave = (tokenOverride?: string) =>
    $fetch(`${config.public.apiBase}/store/${slug}/admin/catalogo/products/`, {
      method: 'POST',
      body: buildPayload(),
      headers: { Authorization: `Bearer ${tokenOverride || auth.token}` },
    })

  try {
    // Refresca el token antes de enviar para evitar expirados
    if (auth.refreshToken) {
      await auth.refreshTokens()
    }

    await doSave()
    message.value = 'Producto creado'
    messageType.value = 'ok'
    router.push(`/store/${slug}/productos`)
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) {
        try {
          await doSave(refreshed)
          message.value = 'Producto creado'
          messageType.value = 'ok'
          router.push(`/store/${slug}/productos`)
        } catch (e) {
          console.error('Retry after refresh failed', e)
        }
      }
    }
    const apiError = error?.response?._data
    if (apiError && typeof apiError === 'object') {
      const combined = Object.values(apiError).flat().join(' ')
      message.value = combined || 'No pudimos crear el producto'
    } else {
      message.value = apiError || 'No pudimos crear el producto'
    }
    messageType.value = 'error'
    console.error('Error al crear producto', error)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  await auth.initializeSession()
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  tenantStore.setSlug(slug)
  await loadCategories()
})
</script>
