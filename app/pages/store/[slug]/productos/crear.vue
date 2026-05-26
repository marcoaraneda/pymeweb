<template>
  <div class="bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-5xl space-y-6">
      <NuxtLink :to="`/store/${slug}/productos`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">← Volver</NuxtLink>

      <div class="grid gap-8 md:grid-cols-[1.1fr,0.9fr] md:items-start">
        <div class="space-y-4">
          <div class="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <img :src="previewImage" alt="Imagen del producto" class="h-full w-full object-cover" />
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <label class="text-sm font-semibold text-slate-700">URL de imagen principal</label>
            <input
              v-model="form.image_url"
              type="url"
              placeholder="https://..."
              class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <p class="text-xs text-slate-500">Se usará como portada. Puedes cambiarla luego desde el detalle.</p>
            <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition">
                <input type="file" accept="image/*" class="hidden" @change="onFileSelect" />
                <span>{{ uploadingImage ? 'Subiendo...' : 'Subir archivo' }}</span>
              </label>
              <span class="text-slate-500">o pega un enlace</span>
            </div>
            <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
            <p v-else-if="uploadingImage" class="text-xs text-slate-500">Procesando imagen...</p>
          </div>
        </div>

        <div class="space-y-5">
          <div class="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
            <span>{{ selectedCategoryLabel }}</span>
            <span class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Nuevo</span>
          </div>

          <input
            v-model="form.name"
            type="text"
            placeholder="Nombre del producto"
            class="w-full rounded-xl border border-slate-200 px-3 py-3 text-2xl font-semibold text-slate-900"
            required
          />
          <p class="text-xs text-slate-500">Requerido: nombre visible para el cliente.</p>

          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Describe tu producto"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          ></textarea>

          <div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</label>
                <input v-model.number="form.price" type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required />
                <p class="text-xs text-slate-500">Requerido: mayor a 0.</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio oferta por unidad</label>
                <input v-model.number="form.offer_price" type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <p class="text-xs text-slate-500">Ej: 1990 para mostrar un pack como 3x1990.</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Cantidad mínima para oferta</label>
                <input v-model.number="form.offer_min_qty" type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <p class="text-xs text-slate-500">Ej: 3 para que la oferta aplique desde 3 unidades.</p>
              </div>
            </div>
            <div v-if="form.offer_price" class="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-sm text-emerald-900">
              <p class="text-xs uppercase tracking-[0.2em] text-emerald-700">Vista previa</p>
              <p class="font-semibold">{{ offerPackLabel }}</p>
              <p class="text-xs text-emerald-800">Total {{ formatClp(offerPackTotal) }} por pack de {{ offerMinQty }} unidades.</p>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock disponible</label>
                <input v-model.number="form.stock_available" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                <p class="text-xs text-slate-500">Se guarda directo en el producto (sin variantes).</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock mínimo</label>
                <input v-model.number="form.stock_minimum" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Categoría</label>
              <div v-if="loadingCategories" class="h-10 rounded-xl border border-slate-200 bg-slate-100 animate-pulse" />
              <select v-else v-model="form.category" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Sin categoría</option>
                <option v-for="cat in availableCategories" :key="cat.slug || cat.id" :value="cat.id || cat.slug">{{ cat.name }}</option>
              </select>
              <p v-if="categoriesError" class="text-xs text-red-600">{{ categoriesError }}</p>
            </div>
            <label class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
              <input v-model="form.product_of_week" type="checkbox" class="h-4 w-4 accent-emerald-600" />
              <span>Agregar a destacados de la semana</span>
            </label>
            <label class="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800">
              <input v-model="form.free_shipping" type="checkbox" class="h-4 w-4 accent-sky-600" />
              <span>Este producto tiene envío gratis</span>
            </label>
          </div>

          <div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Etiquetas y detalles</p>
                <h3 class="text-sm font-semibold text-slate-800">Ajusta etiquetas y atributos según la categoría</h3>
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Etiquetas (opcional)</label>
              <input
                v-model="form.tagsInput"
                type="text"
                placeholder="Ej: envío gratis, nuevo, eco"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <p class="text-xs text-slate-500">Se separan por coma y se guardan con los atributos internos.</p>
            </div>

            <div v-if="isClothing" class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Ropa</p>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-1">
                  <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla base</label>
                  <select v-model="categoryAttrs.size" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="">Selecciona talla</option>
                    <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de prenda</label>
                  <select v-model="categoryAttrs.clothingType" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="">Selecciona tipo</option>
                    <option v-for="type in ['Camisa','Pantalón','Vestido','Chaqueta','Sudadera','Short','Falda','Accesorio']" :key="type" :value="type">{{ type }}</option>
                  </select>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label>
                <select v-model="categoryAttrs.audience" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="">Selecciona</option>
                  <option v-for="aud in ['Niño','Niña','Mujer','Hombre','Unisex']" :key="aud" :value="aud">{{ aud }}</option>
                </select>
              </div>
              <div class="space-y-2">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock por talla</p>
                <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                  <div
                    v-for="size in sizeOptions"
                    :key="size"
                    class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    <label class="font-semibold text-slate-700">{{ size }}</label>
                    <input
                      type="number"
                      min="0"
                      class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right"
                      v-model.number="sizeStock[size]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isTech" class="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Tecnología</p>
              <textarea
                v-model="categoryAttrs.techSpecs"
                rows="3"
                placeholder="Ej: 16GB RAM, 512GB SSD, Pantalla 144Hz"
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              ></textarea>
              <p class="text-xs text-slate-500">Se guardan como etiqueta interna "specs:".</p>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label>
                <input v-model="categoryAttrs.brand" type="text" placeholder="Ej: Samsung, Apple" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
            </div>

            <div v-if="isShoes" class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Calzado</p>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-1">
                  <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (EU)</label>
                  <select v-model="categoryAttrs.size" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="">Selecciona</option>
                    <option v-for="size in shoeSizesEU" :key="`eu-${size}`" :value="`EU-${size}`">EU {{ size }}</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (US)</label>
                  <select v-model="categoryAttrs.shoeSizeUS" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="">Selecciona</option>
                    <option v-for="size in shoeSizesUS" :key="`us-${size}`" :value="`US-${size}`">US {{ size }}</option>
                  </select>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label>
                <select v-model="categoryAttrs.audience" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                  <option value="">Selecciona</option>
                  <option v-for="aud in ['Niño','Niña','Mujer','Hombre','Unisex']" :key="`aud-${aud}`" :value="aud">{{ aud }}</option>
                </select>
              </div>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label>
                <input v-model="categoryAttrs.brand" type="text" placeholder="Ej: Nike, Adidas" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
            </div>

            <div v-if="isHome" class="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Hogar y decoración</p>
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Espacio</label>
              <select v-model="categoryAttrs.homeSpace" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Selecciona</option>
                <option v-for="room in ['Sala','Cocina','Habitación','Baño','Exterior','Oficina']" :key="room" :value="room">{{ room }}</option>
              </select>
            </div>

            <div v-if="isFood" class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Alimentos y bebidas</p>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo</label>
                <input v-model="categoryAttrs.foodType" type="text" placeholder="Ej: Snacks, Granos, Bebida" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
              <div class="space-y-1">
                <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Peso/volumen</label>
                <input v-model="categoryAttrs.foodSize" type="text" placeholder="Ej: 500g, 1L" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              </div>
            </div>

            <div v-if="isPet" class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Mascotas (accesorios y ropa)</p>
              <div class="grid gap-3 md:grid-cols-2">
                <div class="space-y-1">
                  <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de mascota</label>
                  <select v-model="categoryAttrs.petType" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="">Selecciona</option>
                    <option v-for="pet in ['Perro','Gato','Ave','Pez','Roedor']" :key="pet" :value="pet">{{ pet }}</option>
                  </select>
                </div>
                <div class="space-y-1">
                  <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Artículo</label>
                  <select v-model="categoryAttrs.petItemType" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="">Selecciona</option>
                    <option v-for="item in ['Accesorio','Ropa','Juguete','Cama']" :key="item" :value="item">{{ item }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow"
              :style="{ backgroundColor: accentColor }"
              :disabled="!canSubmit"
              @click="createProduct"
            >
              {{ saving ? 'Guardando...' : 'Guardar producto' }}
            </button>
            <NuxtLink
              :to="`/store/${slug}/productos`"
              class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300"
            >
              Cancelar
            </NuxtLink>
          </div>

          <p v-if="message" class="text-sm" :class="messageStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">
            {{ message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { definePageMeta, useRuntimeConfig } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'
import { useImages } from '~/composables/useImages'

definePageMeta({ layout: 'store', middleware: ['tenant', 'auth'], requiresAuth: true })

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const tenantStore = useTenantStore()
const theme = useThemeStore()
const { getProductImage } = useImages()
const config = useRuntimeConfig()

const slug = route.params.slug as string

const form = reactive({
  name: '',
  description: '',
  price: 0,
  offer_price: null as number | null,
  offer_min_qty: 1,
  category: '' as string | number,
  image_url: '',
  stock_available: 0,
  stock_minimum: 0,
  product_of_week: false,
  free_shipping: false,
  tagsInput: '',
})

const saving = ref(false)
const loadingCategories = ref(false)
const message = ref('')
const messageStatus = ref<'ok' | 'error'>('ok')
const categories = ref<any[]>([])
const fallbackCategories: any[] = []
const categoriesError = ref('')
const uploadingImage = ref(false)
const uploadError = ref('')
const categoryAttrs = reactive({
  size: '',
  shoeSizeUS: '',
  techSpecs: '',
  clothingType: '',
  brand: '',
  audience: '',
  homeSpace: '',
  foodType: '',
  foodSize: '',
  petType: '',
  petItemType: '',
})
const sizeStock = reactive<Record<string, number>>({})
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', '44']
const shoeSizesEU = ['35','36','37','38','39','40','41','42','43','44','45']
const shoeSizesUS = ['5','6','7','8','9','10','11','12']

const accentColor = computed(() => theme.accent || '#2563eb')
const previewImage = computed(() => form.image_url || getProductImage({}) )
const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})
const getErrorMessage = (err: any) => {
  const detail = err?.response?._data?.detail || err?.response?._data
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
const isStoreOwner = computed(() => {
  const memberships = (auth.user as any)?.memberships || []
  return memberships.some((m: any) => {
    const roles = (m?.roles || []).map((r: any) => r?.code || r)?.map((r: string) => r?.toLowerCase?.())
    return m?.store?.slug === slug && roles.some((r: string) => ['admin', 'owner', 'manager'].includes(r))
  })
})
const availableCategories = computed(() => categories.value || [])
const storeType = computed(() => String((tenantStore.data as any)?.store_type || 'retail'))
const defaultCategory = computed(() => {
  if (storeType.value !== 'fast_food') return null
  return availableCategories.value.find((cat: any) => String(cat?.slug || '').toLowerCase() === 'agregados') || null
})

const selectedCategoryLabel = computed(() => {
  if (!form.category) return 'General'
  const catId = Number(form.category)
  const found = availableCategories.value.find((c: any) => Number(c.id) === catId)
  return found?.name || 'General'
})

const categoryName = computed(() => selectedCategoryLabel.value.toLowerCase())
const isClothing = computed(() => /ropa|shirt|camisa|pantal|jean|blusa|dress|vestido/.test(categoryName.value))
const isTech = computed(() => /tecno|electro|laptop|pc|notebook|tablet|phone|celu|smart/.test(categoryName.value))
const isShoes = computed(() => /calzado|zapato|zapatilla|sneaker|bota|sandalia/.test(categoryName.value))
const isHome = computed(() => /hogar|decor|casa|home/.test(categoryName.value))
const isFood = computed(() => /alimento|comida|bebida|grocery/.test(categoryName.value))
const isPet = computed(() => /mascota|pet/.test(categoryName.value))

const isValidForm = computed(() => {
  return Boolean(form.name.trim() && Number(form.price) > 0)
})

const offerMinQty = computed(() => Math.max(1, Number(form.offer_min_qty) || 1))
const offerPackTotal = computed(() => Number(form.offer_price || 0) * offerMinQty.value)
const offerPackLabel = computed(() => {
  const offerUnitPrice = Number(form.offer_price || 0)
  if (!offerUnitPrice || offerUnitPrice <= 0) return ''
  return offerMinQty.value > 1 ? `${offerMinQty.value}x ${offerUnitPrice}` : `${offerUnitPrice}`
})
const formatClp = (value: number) => new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0))

const canSubmit = computed(() => isValidForm.value && isStoreOwner.value && !saving.value && !uploadingImage.value)

const parseTagsInput = (value: string) =>
  value
    .split(',')
    .map((tag: string) => tag.trim())
    .filter(Boolean)

const loadCategories = async () => {
  try {
    loadingCategories.value = true
    tenantStore.setSlug(slug)
    categoriesError.value = ''
    categories.value = await $fetch(`${config.public.apiBase}/store/${slug}/catalogo/categories/`)
    if (!form.category && defaultCategory.value?.id != null) {
      form.category = defaultCategory.value.id
    }
  } catch (error) {
    categoriesError.value = getErrorMessage(error) || 'No pudimos cargar categorías'
    categories.value = []
  } finally {
    loadingCategories.value = false
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
  uploadingImage.value = true
  try {
    const result = await uploadToCloudinary(file)
    if (!result?.secure_url) throw new Error('No pudimos obtener la URL de la imagen')
    form.image_url = result.secure_url
    message.value = 'Imagen subida, guarda para aplicar'
    messageStatus.value = 'ok'
  } catch (error) {
    uploadError.value = getErrorMessage(error) || 'No pudimos subir la imagen'
  } finally {
    uploadingImage.value = false
    if (target) target.value = ''
  }
}

const ensureCloudinaryUrl = async (currentUrl?: string) => {
  if (!currentUrl) return ''
  // Si ya es de Cloudinary, no reprocesar
  if (currentUrl.includes('res.cloudinary.com')) return currentUrl
  const result = await uploadToCloudinary(currentUrl, 'upload/product')
  if (!result?.secure_url) throw new Error('No pudimos subir la imagen a Cloudinary')
  return result.secure_url
}

const ensureOwnership = () => {
  if (!isStoreOwner.value) {
    message.value = 'Solo el dueño puede crear productos en esta tienda'
    messageStatus.value = 'error'
  }
}

const createProduct = async () => {
  if (!isStoreOwner.value) {
    ensureOwnership()
    return
  }
  if (uploadingImage.value) {
    message.value = 'Espera a que termine la subida de imagen'
    messageStatus.value = 'error'
    return
  }
  const name = form.name.trim()
  if (!name || name.length < 3) {
    message.value = 'Ingresa un nombre de al menos 3 caracteres'
    messageStatus.value = 'error'
    return
  }
  if (!form.price || Number(form.price) <= 0) {
    message.value = 'Ingresa un precio mayor a 0'
    messageStatus.value = 'error'
    return
  }
  if (form.offer_price != null) {
    const offer = Number(form.offer_price)
    if (offer <= 0) {
      message.value = 'La oferta debe ser mayor a 0'
      messageStatus.value = 'error'
      return
    }
    if (offer >= Number(form.price)) {
      message.value = 'La oferta debe ser menor al precio'
      messageStatus.value = 'error'
      return
    }
  }
  if (form.offer_min_qty != null && Number(form.offer_min_qty) < 1) {
    message.value = 'La cantidad mínima de oferta debe ser al menos 1'
    messageStatus.value = 'error'
    return
  }
  if (form.stock_available != null && Number(form.stock_available) < 0) {
    message.value = 'El stock no puede ser negativo'
    messageStatus.value = 'error'
    return
  }
  if (form.stock_minimum != null && Number(form.stock_minimum) < 0) {
    message.value = 'El stock mínimo no puede ser negativo'
    messageStatus.value = 'error'
    return
  }
  if (form.image_url && !isHttpsUrl(form.image_url)) {
    message.value = 'La imagen debe ser un enlace válido con https'
    messageStatus.value = 'error'
    return
  }
  if (!auth.token) {
    message.value = 'Inicia sesión para crear productos'
    messageStatus.value = 'error'
    return
  }

  saving.value = true
  message.value = ''
  const slugValue = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const baseTags = parseTagsInput(form.tagsInput)
  const extraTags: string[] = []
  if (categoryAttrs.size) extraTags.push(`talla:${categoryAttrs.size}`)
  if (categoryAttrs.shoeSizeUS) extraTags.push(`talla_us:${categoryAttrs.shoeSizeUS}`)
  if (categoryAttrs.clothingType) extraTags.push(`tipo:${categoryAttrs.clothingType}`)
  if (categoryAttrs.techSpecs) extraTags.push(`specs:${categoryAttrs.techSpecs}`)
  if (categoryAttrs.brand) extraTags.push(`marca:${categoryAttrs.brand}`)
  if (categoryAttrs.audience) extraTags.push(`publico:${categoryAttrs.audience}`)
  if (categoryAttrs.homeSpace) extraTags.push(`hogar:${categoryAttrs.homeSpace}`)
  if (categoryAttrs.foodType) extraTags.push(`alimento:${categoryAttrs.foodType}`)
  if (categoryAttrs.foodSize) extraTags.push(`porcion:${categoryAttrs.foodSize}`)
  if (categoryAttrs.petType) extraTags.push(`mascota:${categoryAttrs.petType}`)
  if (categoryAttrs.petItemType) extraTags.push(`item_mascota:${categoryAttrs.petItemType}`)
  Object.entries(sizeStock).forEach(([size, qty]) => {
    if (size && qty != null && Number(qty) > 0) extraTags.push(`size_stock:${size}:${Number(qty) || 0}`)
  })
  const mergedTags = [...baseTags, ...extraTags]
  const payload: any = {
    name,
    slug: slugValue,
    description: form.description?.trim?.() || '',
    price: Number(form.price),
    offer_price: form.offer_price != null ? Number(form.offer_price) : null,
    offer_min_qty: Math.max(1, Number(form.offer_min_qty) || 1),
    is_active: true,
    is_marketplace: false,
    stock_available: Number(form.stock_available) || 0,
    stock_minimum: Number(form.stock_minimum) || 0,
    product_of_week: Boolean(form.product_of_week),
      free_shipping: Boolean(form.free_shipping),
    ...(Number.isFinite(Number(form.category)) ? { category: Number(form.category) } : {}),
    ...(mergedTags.length ? { tags: mergedTags } : {}),
  }

  if (form.image_url) {
    const cloudUrl = await ensureCloudinaryUrl(form.image_url)
    payload.image_url = cloudUrl
  }

  const doCreate = (tokenOverride?: string) =>
    $fetch(`${config.public.apiBase}/store/${slug}/admin/catalogo/products/`, {
      method: 'POST',
      body: payload,
      headers: { Authorization: `Bearer ${tokenOverride || auth.token}` },
    })

  try {
    if (auth.refreshToken) {
      await auth.refreshTokens()
    }
    const created = (await doCreate()) as { slug?: string }
    message.value = 'Producto creado'
    messageStatus.value = 'ok'
    const targetSlug = created?.slug || slugValue
    await router.push(`/store/${slug}/productos/${targetSlug}`)
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) {
        try {
          const created = (await doCreate(refreshed)) as { slug?: string }
          message.value = 'Producto creado'
          messageStatus.value = 'ok'
          const targetSlug = created?.slug || slugValue
          await router.push(`/store/${slug}/productos/${targetSlug}`)
          return
        } catch (retryErr) {
          console.error('Retry create failed', retryErr)
        }
      }
    }
    message.value = getErrorMessage(error) || 'No pudimos crear el producto'
    messageStatus.value = 'error'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  auth.restoreFromCookies()
  if (auth.token && !auth.user) {
    await auth.fetchProfile()
  }
  tenantStore.setSlug(slug)
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await tenantStore.fetchTienda()
  await loadCategories()
  ensureOwnership()
  if (!isStoreOwner.value) {
    await router.replace(`/store/${slug}/productos`)
  }
})
</script>
