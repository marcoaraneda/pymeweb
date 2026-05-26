<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold">Configuración de tienda</h2>
        <p class="text-white/70">Personaliza tu tienda, diseño y opciones</p>
      </div>
      <NuxtLink
        :to="`/store/${slug}`"
        class="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      >
        Ver tienda
      </NuxtLink>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex gap-2 border-b border-white/10">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="px-4 py-3 text-sm font-semibold transition"
        :class="activeTab === tab.id ? 'border-b-2 text-white' : 'text-white/60 hover:text-white'"
        :style="activeTab === tab.id ? { borderColor: theme.accent } : {}"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="space-y-6">
      <!-- GENERAL Tab -->
      <div v-if="activeTab === 'general'" class="space-y-6">
        <section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="mb-4 text-lg font-semibold">Información general</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-white/80">Nombre de tienda</label>
              <input v-model="form.name" type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-white/80">Tipo de tienda</label>
              <select v-model="form.store_type" disabled class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white opacity-60">
                <option value="retail">Retail</option>
                <option value="fast_food">Comida rápida</option>
                <option value="bakery">Pastelería</option>
                <option value="pharmacy">Farmacia</option>
                <option value="fashion">Moda</option>
                <option value="bookstore">Librería</option>
              </select>
              <p class="text-xs text-white/50">El tipo de tienda no puede cambiar después de crear la tienda.</p>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Descripción</label>
              <textarea v-model="form.description" rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Acerca de - Quiénes somos</label>
              <textarea v-model="form.about_who_we_are" rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Acerca de - Nuestra historia</label>
              <textarea v-model="form.about_history" rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Acerca de - Misión y visión</label>
              <textarea v-model="form.about_mission" rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Acerca de - Información adicional</label>
              <textarea v-model="form.about_extra" rows="2" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="mb-4 text-lg font-semibold">Contacto</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-white/80">Email</label>
              <input v-model="form.contact_email" type="email" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-white/80">Teléfono</label>
              <input v-model="form.phone" type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-white/80">WhatsApp</label>
              <input v-model="form.whatsapp" type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Dirección</label>
              <input v-model="form.address" type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
          </div>
        </section>

        <!-- Menu Section - Only for Specific Store Types -->
        <section v-if="hasMenuSupport" class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="mb-4 text-lg font-semibold">Carta o Menú</h3>
          <p class="mb-4 text-sm text-white/70">Sube tu carta o menú en PDF</p>
          <div class="grid gap-4">
            <div class="space-y-2">
              <label class="text-sm text-white/80">Archivo PDF o imagen</label>
              <input type="file" accept=".pdf,image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" @change="onMenuFileSelect" />
              <p class="text-xs text-white/50">{{ menuFileName || (form.menu_file_url ? 'Archivo listo para guardar' : 'Ningún archivo seleccionado') }}</p>
            </div>
            <div class="space-y-2">
              <label class="text-sm text-white/80">Imagen de portada del menú (opcional)</label>
              <input type="file" accept="image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" @change="onMenuCoverSelect" />
              <p class="text-xs text-white/50">{{ menuCoverFileName || (form.menu_cover_image_url ? 'Portada lista para guardar' : 'Sin portada') }}</p>
            </div>
          </div>
        </section>
      </div>

      <!-- DESIGN Tab -->
      <div v-if="activeTab === 'design'" class="space-y-6">
        <section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="mb-4 text-lg font-semibold">Identidad visual</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Logo</label>
              <div class="flex gap-3">
                <img v-if="form.logo_url" :src="form.logo_url" alt="Logo" class="h-20 w-20 rounded-lg object-cover" />
                <input type="file" accept="image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" @change="onLogoSelect" />
              </div>
              <p class="text-xs text-white/50">{{ logoFileName || (form.logo_url ? 'Logo listo para guardar' : 'Ningún archivo seleccionado') }}</p>
            </div>

            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-white/80">Banner principal</label>
              <div class="flex flex-col gap-3">
                <img v-if="form.banner_url" :src="form.banner_url" alt="Banner" class="h-32 w-full rounded-lg object-cover" />
                <input type="file" accept="image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" @change="onBannerSelect" />
              </div>
              <p class="text-xs text-white/50">{{ bannerFileName || (form.banner_url ? 'Banner listo para guardar' : 'Ningún archivo seleccionado') }}</p>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Color acento</label>
              <input v-model="form.accent_color" type="color" class="h-10 w-full rounded-xl border border-white/15 bg-white/5 px-2 py-1" />
            </div>

            <div class="space-y-2">
              <label class="text-sm text-white/80">Patrón</label>
              <select v-model="form.hero_pattern_style" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">
                <option value="type">Según tipo</option>
                <option value="diagonal">Diagonal</option>
                <option value="vertical">Vertical</option>
                <option value="circles">Círculos</option>
                <option value="waves">Ondas</option>
                <option value="fine_grid">Rejilla fina</option>
                <option value="small_dots">Puntos pequeños</option>
                <option value="zigzag">Zigzag</option>
                <option value="soft_noise">Noise suave</option>
                <option value="double_diagonal">Doble diagonal</option>
                <option value="none">Sin patrón</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="inline-flex items-center gap-2 text-sm text-white/80">
                <input v-model="form.hero_pattern_enabled" type="checkbox" class="rounded" />
                Habilitar patrón
              </label>
            </div>
          </div>
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="mb-4 text-lg font-semibold">Carrusel principal</h3>
          <p class="mb-4 text-sm text-white/70">Sube imágenes o videos para el carrusel (máximo 5)</p>

          <!-- Carousel Items -->
          <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div v-for="(item, idx) in form.quick_media" :key="idx" class="group relative carousel-item">
              <img v-if="item.type === 'image'" :src="item.url" :alt="`Carrusel ${idx + 1}`" class="h-40 w-full rounded-lg object-cover object-center" />
              <div v-else class="flex h-40 w-full items-center justify-center rounded-lg bg-white/10">
                <span class="text-sm text-white/60">Video</span>
              </div>

              <!-- Three-dots menu button -->
              <button
                class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition"
                @click.stop="openCarouselMenuIndex = openCarouselMenuIndex === idx ? -1 : idx"
                aria-label="Abrir opciones"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>

              <!-- Popover menu -->
              <div v-if="openCarouselMenuIndex === idx" class="absolute right-2 top-12 z-50 carousel-item-menu">
                <div class="rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-lg w-36">
                  <button class="w-full text-left px-3 py-2 text-red-600 font-semibold hover:bg-slate-50" @click="handleRemoveCarouselItem(idx)">Eliminar</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add More -->
          <div v-if="form.quick_media.length < 5" class="mt-4">
            <input type="file" multiple accept="image/*,video/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" @change="onCarouselSelect" />
            <p class="mt-2 text-xs text-white/50">{{ form.quick_media.length }}/5 elementos</p>
          </div>
        </section>

        <section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          <h3 class="mb-4 text-lg font-semibold">Redes sociales</h3>
          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-white/80">Instagram</label>
              <input v-model="form.social_instagram" type="url" placeholder="https://instagram.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-white/80">Facebook</label>
              <input v-model="form.social_facebook" type="url" placeholder="https://facebook.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-white/80">TikTok</label>
              <input v-model="form.social_tiktok" type="url" placeholder="https://tiktok.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-white/80">YouTube</label>
              <input v-model="form.social_youtube" type="url" placeholder="https://youtube.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white" />
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex flex-wrap items-center gap-3">
      <button
        class="rounded-xl px-6 py-2 font-semibold text-white"
        :style="{ backgroundColor: theme.accent }"
        :disabled="saving"
        @click="saveSettings"
      >
        {{ saving ? 'Guardando...' : 'Guardar cambios' }}
      </button>
      <p v-if="message" :class="messageType === 'error' ? 'text-red-400' : 'text-emerald-400'">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, onBeforeUnmount } from 'vue'
import { useRoute } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'

definePageMeta({
  layout: 'store',
  middleware: ['tenant', 'auth'],
  requiresAuth: true,
})

const route = useRoute()
const theme = useThemeStore()
const auth = useAuthStore()
const tenantStore = useTenantStore()
const config = useRuntimeConfig()

const slug = route.params.slug as string
const activeTab = ref('general')
const saving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'design', label: 'Diseño' },
]

const form = reactive({
  name: '',
  store_type: 'retail',
  description: '',
  about_who_we_are: '',
  about_history: '',
  about_mission: '',
  about_extra: '',
  contact_email: '',
  phone: '',
  whatsapp: '',
  address: '',
  menu_file_url: '',
  menu_file_kind: '',
  menu_cover_image_url: '',
  logo_url: '',
  banner_url: '',
  accent_color: '#2563eb',
  hero_pattern_enabled: true,
  hero_pattern_style: 'type',
  quick_media: [] as Array<{ type: 'image' | 'video'; url: string }>,
  social_instagram: '',
  social_facebook: '',
  social_tiktok: '',
  social_youtube: '',
})

// UI state: carousel item menu open index
const openCarouselMenuIndex = ref(-1)

// Selected file names to show under inputs (avoid native "No file chosen")
const logoFileName = ref('')
const bannerFileName = ref('')
const menuFileName = ref('')
const menuCoverFileName = ref('')

const handleDocClick = (e: Event) => {
  const target = e.target as HTMLElement
  if (!target.closest('.carousel-item') && !target.closest('.carousel-item-menu')) {
    openCarouselMenuIndex.value = -1
  }
}

const hasMenuSupport = computed(() => {
  return ['fast_food', 'bakery'].includes(form.store_type)
})

onMounted(async () => {
  try {
    const storeData = await $fetch(`/api/stores/${slug}/`)
    Object.assign(form, storeData)
    
    // Desanida el campo about si es un JSON string
    if (typeof storeData.about === 'string') {
      try {
        const aboutData = JSON.parse(storeData.about)
        form.about_who_we_are = aboutData.who_we_are || ''
        form.about_history = aboutData.history || ''
        form.about_mission = aboutData.mission || ''
        form.about_extra = aboutData.extra || ''
      } catch {
        // Si no es JSON válido, dejarlo como vacío
      }
    } else if (typeof storeData.about === 'object' && storeData.about) {
      form.about_who_we_are = storeData.about.who_we_are || ''
      form.about_history = storeData.about.history || ''
      form.about_mission = storeData.about.mission || ''
      form.about_extra = storeData.about.extra || ''
    }
    
    if (storeData.quick_media) {
      form.quick_media = storeData.quick_media
    }
  } catch (error) {
    console.error('Error cargando tienda:', error)
    message.value = 'Error al cargar la tienda'
    messageType.value = 'error'
  }
  // close carousel menus when clicking outside
  document.addEventListener('click', handleDocClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocClick)
})

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'pymeweb')
  formData.append('cloud_name', 'dvjttkbbl')

  const result = await $fetch('https://api.cloudinary.com/v1_1/dvjttkbbl/upload', {
    method: 'POST',
    body: formData,
  } as any)

  return (result as any).secure_url
}

const onLogoSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.logo_url = await uploadToCloudinary(file)
    logoFileName.value = file.name
  } catch (error) {
    message.value = 'Error al subir logo'
    messageType.value = 'error'
  }
}

const onBannerSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.banner_url = await uploadToCloudinary(file)
    bannerFileName.value = file.name
  } catch (error) {
    message.value = 'Error al subir banner'
    messageType.value = 'error'
  }
}

const onMenuFileSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const url = await uploadToCloudinary(file)
    form.menu_file_url = url
    form.menu_file_kind = file.type.includes('pdf') ? 'pdf' : 'image'
    menuFileName.value = file.name
  } catch (error) {
    message.value = 'Error al subir menú'
    messageType.value = 'error'
  }
}

const onMenuCoverSelect = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    form.menu_cover_image_url = await uploadToCloudinary(file)
    menuCoverFileName.value = file.name
  } catch (error) {
    message.value = 'Error al subir portada'
    messageType.value = 'error'
  }
}

const onCarouselSelect = async (event: Event) => {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  const toAdd = Math.min(files.length, 5 - form.quick_media.length)
  for (let i = 0; i < toAdd; i++) {
    const file = files[i]
    try {
      const url = await uploadToCloudinary(file)
      form.quick_media.push({
        type: file.type.startsWith('image') ? 'image' : 'video',
        url,
      })
    } catch (error) {
      console.error('Error subiendo archivo:', error)
    }
  }
}

const removeCarouselItem = (idx: number) => {
  form.quick_media.splice(idx, 1)
}

const handleRemoveCarouselItem = (idx: number) => {
  removeCarouselItem(idx)
  openCarouselMenuIndex.value = -1
}

const saveSettings = async () => {
  if (!auth.token) {
    message.value = 'No autenticado'
    messageType.value = 'error'
    return
  }

  saving.value = true
  message.value = ''

  try {
    await $fetch(`/api/stores/${slug}/`, {
      method: 'PATCH',
      body: {
        name: form.name,
        description: form.description,
        about: JSON.stringify({
          who_we_are: form.about_who_we_are,
          history: form.about_history,
          mission: form.about_mission,
          extra: form.about_extra,
        }),
        contact_email: form.contact_email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        address: form.address,
        menu_file_url: form.menu_file_url,
        menu_file_kind: form.menu_file_kind,
        menu_cover_image_url: form.menu_cover_image_url,
        logo_url: form.logo_url,
        banner_url: form.banner_url,
        accent_color: form.accent_color,
        hero_pattern_enabled: form.hero_pattern_enabled,
        hero_pattern_style: form.hero_pattern_style,
        quick_media: form.quick_media,
        social_instagram: form.social_instagram,
        social_facebook: form.social_facebook,
        social_tiktok: form.social_tiktok,
        social_youtube: form.social_youtube,
      },
      headers: { Authorization: `Bearer ${auth.token}` },
    })

    message.value = 'Cambios guardados correctamente'
    messageType.value = 'success'
    try {
      await tenantStore.fetchTienda()
    } catch (e) {
      // ignore fetch errors here
    }
  } catch (error: any) {
    message.value = error?.data?.detail || 'Error al guardar cambios'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}
</script>
