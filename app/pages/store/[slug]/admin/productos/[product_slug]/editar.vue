<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8">
    <div class="mx-auto max-w-4xl space-y-6">
      <!-- Header Section -->
      <div class="flex items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <p class="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-600">📦 Productos</p>
          </div>
          <h1 class="mt-2 text-4xl font-black text-slate-950">Editar producto</h1>
          <p class="mt-1 text-sm text-slate-600">Actualiza toda la información del producto</p>
        </div>
        <NuxtLink :to="backPath" class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50">
          ← Volver
        </NuxtLink>
      </div>

      <!-- Info Card -->
      <div class="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm">
        <div class="px-6 py-4">
          <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-900">Información actual</p>
          <div class="mt-3 space-y-2">
            <p class="text-sm"><span class="font-bold text-emerald-950">Tienda:</span> <span class="text-emerald-900">{{ slug }}</span></p>
            <p class="text-sm"><span class="font-bold text-emerald-950">Slug:</span> <span class="font-mono text-emerald-900">{{ productSlug }}</span></p>
            <p class="text-sm"><span class="font-bold text-emerald-950">Descripción:</span> <span class="text-emerald-900">{{ form.description || '(Sin descripción aún)' }}</span></p>
          </div>
        </div>
      </div>

      <div class="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">

        <div class="grid gap-6">
          <!-- Información básica -->
          <div class="space-y-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/50 p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-900">Información básica</p>
            
            <div class="space-y-3">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Nombre del producto</label>
                <input v-model="form.name" type="text" placeholder="Ej: Nike Air Max 90" class="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Slug (URL amigable)</label>
                <input v-model="form.slug" type="text" placeholder="ej-nike-air-max-90" class="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                <p class="text-xs text-slate-600">Se usa en la URL. Solo letras, números y guiones.</p>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Descripción</label>
                <textarea v-model="form.description" placeholder="Describe los detalles, características, especificaciones..." rows="4" class="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"></textarea>
              </div>
            </div>
          </div>

          <!-- Precios y ofertas -->
          <div class="space-y-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-orange-50/50 p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-900">Precios y ofertas</p>
            
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Precio regular</label>
                <div class="relative">
                  <span class="absolute left-4 top-3.5 text-sm font-bold text-slate-600">$</span>
                  <input v-model.number="form.price" type="number" min="0" step="1" class="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 pl-8 text-sm font-medium focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100" />
                </div>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Precio de oferta (opcional)</label>
                <div class="relative">
                  <span class="absolute left-4 top-3.5 text-sm font-bold text-slate-600">$</span>
                  <input v-model.number="form.offer_price" type="number" min="0" step="1" class="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 pl-8 text-sm font-medium focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100" />
                </div>
                <p class="text-xs text-slate-600">Ej: 1990 para mostrar "3x1990"</p>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Cantidad mínima para oferta</label>
                <input v-model.number="form.offer_min_qty" type="number" min="1" step="1" class="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-medium focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100" />
                <p class="text-xs text-slate-600">Ej: 3 unidades para activar la oferta</p>
              </div>
            </div>
          </div>

          <!-- Stock e inventario -->
          <div class="space-y-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-purple-50/50 p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-purple-900">Stock e inventario</p>
            
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Stock disponible</label>
                <input v-model.number="form.stock_available" type="number" min="0" step="1" class="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100" />
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Stock mínimo (alerta)</label>
                <input v-model.number="form.stock_minimum" type="number" min="0" step="1" class="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100" />
              </div>
            </div>
          </div>

          <!-- Categorización -->
          <div class="space-y-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-50/50 p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-900">Categorización</p>
            
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Categoría</label>
                <select v-model="form.category" class="w-full rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                  <option value="">Sin categoría</option>
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                </select>
                <p class="text-xs text-slate-600">Selecciona una categoría para clasificar el producto</p>
              </div>
              
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Marca (opcional)</label>
                <input v-model="form.brand" type="text" placeholder="Ej: Nike, Samsung, Oster" class="w-full rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
                <p class="text-xs text-slate-600">Se usa para agrupar productos por marca</p>
              </div>
            </div>
          </div>
          <!-- Tallas y variantes -->
          <div v-if="requiresSizeQty" class="space-y-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-cyan-50/50 p-6">
            <div>
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-900">Stock por talla</p>
              <p class="mt-1 text-sm text-cyan-800">Define unidades por talla {{ isShoesCategory ? 'de zapatilla' : '' }}. El total reemplaza el stock disponible.</p>
            </div>
            <div class="grid gap-2 sm:grid-cols-3 md:grid-cols-5">
              <label v-for="size in activeSizeOptions" :key="size" class="flex items-center justify-between rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:border-cyan-300">
                <span class="text-cyan-900">{{ size }}</span>
                <input v-model.number="sizeQty[size]" type="number" min="0" step="1" class="w-16 rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-right text-sm font-bold focus:outline-none" />
              </label>
            </div>
            <div class="rounded-xl border border-cyan-200 bg-cyan-100/30 p-3">
              <p class="text-sm font-semibold text-cyan-900">Total: <span class="font-black text-cyan-950">{{ sizeQtyTotal }}</span> unidades</p>
            </div>
          </div>

          <!-- Opciones y estado -->
          <div class="space-y-4 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-50/50 p-6">
            <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-900">Opciones y estado</p>
            
            <div class="grid gap-3 sm:grid-cols-2">
              <label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300">
                <input v-model="form.is_featured" type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer" />
                <span class="text-sm font-semibold text-slate-900">⭐ Oferta destacada</span>
              </label>
              
              <label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300">
                <input v-model="form.product_of_week" type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer" />
                <span class="text-sm font-semibold text-slate-900">🏆 Producto de la semana</span>
              </label>
              
              <label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300">
                <input v-model="form.is_active" type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer" />
                <span class="text-sm font-semibold text-slate-900">✓ Producto activo</span>
              </label>
              
              <label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300">
                <input v-model="form.is_marketplace" type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer" />
                <span class="text-sm font-semibold text-slate-900">🌐 Publicar en marketplace</span>
              </label>
            </div>
          </div>

          <!-- Inventario registrado -->
          <div class="space-y-4 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-teal-50/50 p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-900">📦 Inventario registrado</p>
                <p class="mt-3 text-3xl font-black text-teal-950">{{ totalStock }} <span class="text-lg text-teal-800">unidades</span></p>
                <p v-if="!variants.length" class="mt-1 text-sm text-teal-800">Stock base del producto (sin variantes).</p>
              </div>
              <NuxtLink
                :to="`/store/${slug}/admin/inventario`"
                class="inline-flex items-center gap-2 rounded-2xl border border-teal-300 bg-white px-4 py-2.5 text-sm font-bold text-teal-900 hover:bg-teal-50"
              >
                📊 Abrir inventario
              </NuxtLink>
            </div>
            <div v-if="variants.length" class="space-y-2">
              <div v-for="variant in variants" :key="variant.id" class="flex items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-white px-4 py-3">
                <div>
                  <p class="text-sm font-bold text-slate-900">{{ variant.name }}</p>
                  <p v-if="variant.sku" class="text-xs text-slate-600">SKU: <span class="font-mono">{{ variant.sku }}</span></p>
                </div>
                <p class="text-sm font-extrabold" :class="variantStockClass(variant.stock_available)">
                  {{ variantStockLabel(variant.stock_available) }}
                </p>
              </div>
            </div>
            <p v-else class="text-sm text-teal-800">Sin variantes; edita el stock disponible en la sección de arriba.</p>
          </div>

          <!-- Imágenes -->
          <div class="space-y-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-50/50 p-6">
            <div class="flex items-center justify-between">
              <p class="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-900">🖼️ Imágenes del producto</p>
              <span class="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">{{ galleryPreview.length }}/{{ MAX_GALLERY_IMAGES }}</span>
            </div>
            
            <div class="space-y-3">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-900">Imagen principal (URL)</label>
                <input v-model="form.image_url" type="url" placeholder="https://ejemplo.com/imagen.jpg" class="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100" />
                <p class="text-xs text-slate-600">Se guarda como imagen principal en Cloudinary</p>
              </div>

              <p class="text-xs text-slate-700 font-semibold">Agregar más imágenes a la galería (hasta {{ MAX_GALLERY_IMAGES }} total):</p>

              <div class="grid gap-3 sm:grid-cols-[1fr,auto]">
                <input
                v-model="galleryUrlInput"
                type="url"
                placeholder="https://ejemplo.com/imagen-producto.jpg"
                class="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                :disabled="!canAddMoreImages"
              />
              <button
                class="rounded-2xl border border-amber-300 bg-amber-500 px-4 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"
                :disabled="!canAddMoreImages"
                @click="addGalleryUrl"
              >
                + Agregar
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <label class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-50">
                <input type="file" accept="image/*" class="hidden" :disabled="!canAddMoreImages || uploadingGallery" @change="onGalleryFileSelect" />
                <span>📤 {{ uploadingGallery ? 'Subiendo...' : 'Subir imagen' }}</span>
              </label>
              <span v-if="!canAddMoreImages" class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">✓ Máximo alcanzado</span>
            </div>

            <div v-if="galleryPreview.length" class="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5">
              <div
                v-for="(image, index) in galleryPreview"
                :key="`${image}-${index}`"
                class="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-amber-50 aspect-square"
              >
                <img :src="image" :alt="`Imagen ${index + 1}`" class="h-full w-full object-cover group-hover:scale-110 transition duration-300" />
                <button
                  v-if="index >= existingImageUrls.length"
                  type="button"
                  class="absolute right-1 top-1 hidden h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white group-hover:inline-flex hover:bg-red-700 transition"
                  @click="removePendingImage(index - existingImageUrls.length)"
                >
                  ✕
                </button>
              </div>
            </div>

            <p v-if="galleryMessage" class="rounded-2xl px-4 py-3 text-sm font-semibold" :class="galleryStatus === 'error' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'">
              {{ galleryMessage }}
            </p>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-6">
          <button
            class="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-xl transition"
            :style="accentStyle"
            :disabled="saving"
            @click="save"
          >
            <span v-if="saving">⏳ Guardando...</span>
            <span v-else>✓ Guardar cambios</span>
          </button>
          
          <button
            class="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-red-700 hover:shadow-xl transition"
            :disabled="deleting"
            @click="removeProduct"
          >
            <span v-if="deleting">⏳ Eliminando...</span>
            <span v-else>🗑️ Eliminar producto</span>
          </button>
          
          <div v-if="message" class="rounded-2xl px-4 py-2" :class="messageType === 'error' ? 'bg-red-100 text-red-800 font-semibold' : 'bg-emerald-100 text-emerald-800 font-semibold'">
            <p class="text-sm">{{ message }}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useTenantStore } from '~/stores/tenant'
import { getCatalogCategorySeedsByStoreType } from '~/constants/catalogCategorySeeds'

definePageMeta({ layout: 'store', middleware: ['tenant', 'auth'], requiresAuth: true })
const route = useRoute() as any
const params = (route?.params || {}) as Record<string, string>
const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()
const tenantStore = useTenantStore()

// Force params to plain strings to avoid deep conditional route types
const slug = params.slug || ''
const productSlug = params.product_slug || ''
const backPath = computed(() => `/store/${slug}/productos`)

const form = reactive({
  id: null as number | null,
  name: '',
  slug: '',
  brand: '',
  description: '',
  price: 0,
  offer_price: null as number | null,
  offer_min_qty: 1,
  is_featured: false,
  product_of_week: false,
  is_active: true,
  image_url: '',
  is_marketplace: false,
  category: '' as string | number,
  stock_available: 0,
  stock_minimum: 0,
})
const MAX_GALLERY_IMAGES = 5
const existingImageUrls = ref<string[]>([])
const pendingExtraImages = ref<string[]>([])
const galleryUrlInput = ref('')
const uploadingGallery = ref(false)
const galleryMessage = ref('')
const galleryStatus = ref<'ok' | 'error'>('ok')

const saving = ref(false)
const deleting = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'error'>('ok')
const variants = ref<any[]>([])
const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44']
const sizeOptions = [...clothingSizes, ...shoeSizes]
const sizeQty = reactive<Record<string, number>>({})
sizeOptions.forEach((size) => {
  sizeQty[size] = 0
})

const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: '#fff' }))
const categories = ref<any[]>([])
const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})
const galleryPreview = computed(() => [...existingImageUrls.value, ...pendingExtraImages.value].slice(0, MAX_GALLERY_IMAGES))
const canAddMoreImages = computed(() => galleryPreview.value.length < MAX_GALLERY_IMAGES)
const selectedCategoryName = computed(() => {
  const selected = categories.value.find((cat: any) => String(cat.id) === String(form.category))
  return String(selected?.name || '').toLowerCase()
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

const normalizeStock = (value: any) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const variantStockLabel = (value: any) => {
  const stock = normalizeStock(value)
  if (stock <= 0) return 'Sin stock'
  if (stock <= 5) return `Stock bajo (${stock})`
  return `${stock} en inventario`
}

const variantStockClass = (value: any) => {
  const stock = normalizeStock(value)
  if (stock <= 0) return 'text-red-600'
  if (stock <= 5) return 'text-amber-600'
  return 'text-emerald-600'
}

const totalStock = computed(() => {
  // Si no hay variantes, usar el stock base del producto editable arriba.
  if (!variants.value.length) return normalizeStock(form.stock_available)
  return variants.value.reduce((acc, variant) => acc + normalizeStock(variant.stock_available), 0)
})

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
  } catch (error) {
    categories.value = []
  }
}

const load = async () => {
  try {
    const data = await authedFetch<any>(`${config.public.apiBase}/store/${slug}/catalogo/products/${productSlug}/`)
    form.id = data.id
    form.name = data.name
    form.slug = data.slug
    form.brand = data.brand || ''
    form.description = data.description
    form.price = data.price
    form.offer_price = data.offer_price
    form.offer_min_qty = Number(data.offer_min_qty || 1)
    form.is_featured = data.is_featured
    form.product_of_week = data.product_of_week
    form.is_active = data.is_active
    form.is_marketplace = data.is_marketplace
    existingImageUrls.value = (data?.images || []).map((img: any) => img?.image).filter(Boolean).slice(0, MAX_GALLERY_IMAGES)
    pendingExtraImages.value = []
    form.image_url = existingImageUrls.value[0] || data.image_url || ''
    form.category = data.category?.id || ''
    form.stock_available = data.stock_available ?? 0
    form.stock_minimum = data.stock_minimum ?? 0
    variants.value = data.variants || []
    sizeOptions.forEach((size) => {
      sizeQty[size] = 0
    })
    const incomingMap = (data?.size_stock_map && typeof data.size_stock_map === 'object') ? data.size_stock_map : {}
    Object.entries(incomingMap).forEach(([size, qty]) => {
      if (Object.prototype.hasOwnProperty.call(sizeQty, size)) {
        sizeQty[size] = Math.max(0, Number(qty) || 0)
      }
    })
  } catch (error) {
    message.value = 'No pudimos cargar el producto'
    messageType.value = 'error'
  }
}

const removeProduct = async () => {
  if (!auth.token || !form.id) {
    message.value = 'Inicia sesión para eliminar'
    messageType.value = 'error'
    return
  }
  if (!confirm('¿Eliminar este producto?')) return
  deleting.value = true
  message.value = ''
  try {
    await authedFetch(`${config.public.apiBase}/store/${slug}/admin/catalogo/products/${form.id}/`, {
      method: 'DELETE',
    })
    await navigateTo({ path: backPath.value })
  } catch (error: any) {
    message.value = error?.response?._data || 'No pudimos eliminar el producto'
    messageType.value = 'error'
  } finally {
    deleting.value = false
  }
}

const save = async () => {
  if (!auth.token || !form.id) {
    message.value = 'Inicia sesión para editar'
    messageType.value = 'error'
    return
  }
  saving.value = true
  message.value = ''
  try {
    const payload: any = {
      name: form.name,
      slug: form.slug,
      brand: String(form.brand || '').trim(),
      description: form.description,
      price: form.price,
      offer_price: form.offer_price,
      offer_min_qty: Math.max(1, Number(form.offer_min_qty) || 1),
      is_featured: form.is_featured,
      product_of_week: form.product_of_week,
      is_active: form.is_active,
      is_marketplace: form.is_marketplace,
      stock_available: Number(form.stock_available) || 0,
      stock_minimum: Number(form.stock_minimum) || 0,
      size_stock_map: requiresSizeQty.value ? normalizedSizeStockMap.value : {},
    }

    if (form.image_url) payload.image_url = form.image_url
    if (pendingExtraImages.value.length) {
      payload.extra_images = pendingExtraImages.value.slice(0, Math.max(0, MAX_GALLERY_IMAGES - existingImageUrls.value.length))
    }
    if (form.category) payload.category = form.category

    await authedFetch(`${config.public.apiBase}/store/${slug}/admin/catalogo/products/${form.id}/`, {
      method: 'PATCH',
      body: payload,
    })
    message.value = 'Producto actualizado'
    messageType.value = 'ok'
    await navigateTo({ path: backPath.value })
  } catch (error: any) {
    message.value = getErrorMessage(error)
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

const getErrorMessage = (error: any) => {
  const payload = error?.response?._data
  if (typeof payload === 'string') return payload
  if (Array.isArray(payload)) return payload.join(', ')
  if (payload && typeof payload === 'object') return Object.values(payload).flat().join(', ')
  return error?.message || 'No se pudo completar la acción'
}

const isValidUrl = (value: string) => {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const addGalleryUrl = () => {
  galleryMessage.value = ''
  const url = galleryUrlInput.value.trim()
  if (!url) return
  if (!isValidUrl(url)) {
    galleryStatus.value = 'error'
    galleryMessage.value = 'Ingresa una URL válida para la imagen.'
    return
  }
  if (!canAddMoreImages.value) {
    galleryStatus.value = 'error'
    galleryMessage.value = `Máximo ${MAX_GALLERY_IMAGES} imágenes por producto.`
    return
  }
  pendingExtraImages.value.push(url)
  galleryUrlInput.value = ''
  galleryStatus.value = 'ok'
  galleryMessage.value = 'Imagen agregada. Guarda cambios para aplicar.'
}

const removePendingImage = (index: number) => {
  if (index < 0 || index >= pendingExtraImages.value.length) return
  pendingExtraImages.value.splice(index, 1)
}

const uploadToCloudinary = async (file: File) => {
  if (!cloudinaryUploadUrl.value || !config.public.cloudinaryUploadPreset) {
    throw new Error('Configura Cloudinary para subir imágenes')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.cloudinaryUploadPreset)
  formData.append('folder', 'upload/product')
  return await $fetch<any>(cloudinaryUploadUrl.value, { method: 'POST', body: formData })
}

const onGalleryFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return
  if (!canAddMoreImages.value) {
    galleryStatus.value = 'error'
    galleryMessage.value = `Máximo ${MAX_GALLERY_IMAGES} imágenes por producto.`
    target.value = ''
    return
  }
  uploadingGallery.value = true
  galleryMessage.value = ''
  try {
    const uploaded = await uploadToCloudinary(file)
    if (!uploaded?.secure_url) throw new Error('No se pudo obtener URL de la imagen')
    pendingExtraImages.value.push(uploaded.secure_url)
    galleryStatus.value = 'ok'
    galleryMessage.value = 'Imagen subida. Guarda cambios para aplicar.'
  } catch (error: any) {
    galleryStatus.value = 'error'
    galleryMessage.value = getErrorMessage(error)
  } finally {
    uploadingGallery.value = false
    if (target) target.value = ''
  }
}

onMounted(async () => {
  await auth.initializeSession()
  tenantStore.setSlug(slug)
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await Promise.all([load(), loadCategories()])
})
</script>
