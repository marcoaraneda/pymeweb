<template>
  <div class="bg-slate-50 px-4 py-10 min-h-screen">
    <div class="mx-auto max-w-3xl space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Productos</p>
          <h1 class="text-2xl font-bold text-slate-900">Editar producto</h1>
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
              <input v-model.number="form.price" type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Precio oferta (opcional)</label>
              <input v-model.number="form.offer_price" type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Categoría</label>
            <select v-model="form.category" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">Sin categoría</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <p class="text-xs text-slate-500">Selecciona una categoría para este producto.</p>
          </div>

          <div class="flex flex-wrap gap-4">
            <label class="inline-flex items-center gap-2 text-sm text-slate-700">
              <input v-model="form.is_featured" type="checkbox" />
              Producto destacado
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
          <div class="space-y-2">
            <label class="text-sm text-slate-600">Imagen (URL)</label>
            <input v-model="form.image_url" type="url" placeholder="https://..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <p class="text-xs text-slate-500">Se envía a Cloudinary y se guarda como imagen principal.</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="accentStyle"
            :disabled="saving"
            @click="save"
          >
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
          <p class="text-sm" v-if="message" :class="messageType === 'error' ? 'text-red-600' : 'text-green-600'">{{ message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useTenantStore } from '~/stores/tenant'

definePageMeta({ layout: 'store' })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()
const tenantStore = useTenantStore()

const slug = route.params.slug as string
const productSlug = route.params.product_slug as string

const form = reactive({
  id: null as number | null,
  name: '',
  slug: '',
  description: '',
  price: 0,
  offer_price: null as number | null,
  is_featured: false,
  product_of_week: false,
  is_active: true,
  image_url: '',
  is_marketplace: false,
  category: '' as string | number,
})

const saving = ref(false)
const message = ref('')
const messageType = ref<'ok' | 'error'>('ok')

const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: '#fff' }))
const categories = ref<any[]>([])

const loadCategories = async () => {
  try {
    tenantStore.setSlug(slug)
    categories.value = await $fetch(`${config.public.apiBase}/store/${slug}/catalogo/categories/`)
  } catch (error) {
    categories.value = []
  }
}

const load = async () => {
  try {
    const data = await $fetch<any>(`${config.public.apiBase}/store/${slug}/catalogo/products/${productSlug}/`)
    form.id = data.id
    form.name = data.name
    form.slug = data.slug
    form.description = data.description
    form.price = data.price
    form.offer_price = data.offer_price
    form.is_featured = data.is_featured
    form.product_of_week = data.product_of_week
    form.is_active = data.is_active
    form.is_marketplace = data.is_marketplace
    form.image_url = data.images?.[0]?.image || ''
    form.category = data.category?.id || ''
  } catch (error) {
    message.value = 'No pudimos cargar el producto'
    messageType.value = 'error'
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
      description: form.description,
      price: form.price,
      offer_price: form.offer_price,
      is_featured: form.is_featured,
      product_of_week: form.product_of_week,
      is_active: form.is_active,
      is_marketplace: form.is_marketplace,
    }

    if (form.image_url) payload.image_url = form.image_url
    if (form.category) payload.category = form.category

    await $fetch(`${config.public.apiBase}/store/${slug}/admin/catalogo/products/${form.id}/`, {
      method: 'PATCH',
      body: payload,
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    message.value = 'Producto actualizado'
    messageType.value = 'ok'
    router.push(`/store/${slug}/productos`)
  } catch (error: any) {
    message.value = error?.response?._data || 'No pudimos actualizar el producto'
    messageType.value = 'error'
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await Promise.all([load(), loadCategories()])
})
</script>
