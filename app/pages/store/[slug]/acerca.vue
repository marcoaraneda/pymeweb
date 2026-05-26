<template>
  <div class="min-h-screen bg-slate-50">
    <section class="relative overflow-hidden text-white" :style="heroStyle">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_42%)]" aria-hidden="true" />
      <div class="absolute -right-16 top-8 h-52 w-52 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      <div class="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div class="grid gap-6 lg:grid-cols-[auto,1fr] lg:items-start">
          <div class="h-24 w-24 overflow-hidden rounded-2xl border border-white/30 bg-white/15 shadow-lg backdrop-blur">
            <img v-if="storeLogo" :src="storeLogo" :alt="`Logo ${storeName}`" class="h-full w-full object-cover" />
            <div v-else class="flex h-full w-full items-center justify-center text-3xl">🏪</div>
          </div>
          <div class="space-y-4">
            <p class="text-xs uppercase tracking-[0.24em] text-white/75">Acerca de la tienda</p>
            <div class="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-stretch">
              <article class="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-sm">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Nombre</p>
                <h1 class="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{{ storeName }}</h1>
              </article>
              <article class="rounded-2xl border border-white/20 bg-slate-950/25 px-4 py-4 backdrop-blur-sm">
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Descripción</p>
                <p class="mt-2 text-white/90">{{ storeDescription || 'Conoce la historia, ubicación y canales de contacto de esta tienda.' }}</p>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div class="grid gap-6 lg:grid-cols-2">
        <article class="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Identidad</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">Quiénes somos</h2>
          <p class="mt-3 whitespace-pre-line text-slate-700">{{ aboutSections.who || defaultAboutFallback }}</p>
          <div class="mt-5 grid gap-3">
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Nuestra historia</p>
              <p class="mt-2 text-sm text-slate-700">{{ aboutSections.history || 'Comparte cómo nació esta tienda y su evolución para conectar con tus clientes.' }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Misión y visión</p>
              <p class="mt-2 text-sm text-slate-700">{{ aboutSections.mission || 'Describe tu propósito, enfoque de servicio y visión de crecimiento.' }}</p>
            </div>
            <div v-if="aboutSections.extra" class="rounded-2xl border border-slate-200 bg-white p-4">
              <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Información adicional</p>
              <p class="mt-2 text-sm text-slate-700 whitespace-pre-line">{{ aboutSections.extra }}</p>
            </div>
          </div>
        </article>

        <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Contacto</p>
          <h2 class="mt-2 text-2xl font-bold text-slate-900">Hablemos</h2>
          <p class="mt-2 text-slate-600">¿Tienes dudas o necesitas soporte? Te respondemos lo antes posible.</p>
          <dl class="mt-4 space-y-2 text-sm text-slate-700">
            <div v-if="contactEmail" class="flex items-center justify-between gap-3">
              <dt class="text-slate-500">Correo</dt>
              <dd class="truncate font-semibold">{{ contactEmail }}</dd>
            </div>
            <div v-if="phone" class="flex items-center justify-between gap-3">
              <dt class="text-slate-500">Teléfono</dt>
              <dd class="font-semibold">{{ phone }}</dd>
            </div>
          </dl>
          <div class="mt-4 flex flex-wrap gap-2 text-sm font-semibold">
            <a v-if="contactEmail" :href="`mailto:${contactEmail}`" class="rounded-xl bg-blue-700 px-4 py-2 text-white shadow hover:bg-blue-800">Enviar correo</a>
            <a v-if="phone" :href="`tel:${phone}`" class="rounded-xl border border-blue-200 px-4 py-2 text-blue-700 hover:bg-blue-50">Llamar</a>
          </div>
          <div class="mt-5 border-t border-slate-200 pt-4">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Síguenos</p>
            <div v-if="socialLinks.length" class="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
              <a
                v-for="link in socialLinks"
                :key="link.key"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
              >
                {{ link.label }}
              </a>
            </div>
            <p v-else class="mt-3 text-sm text-slate-500">Esta tienda aún no configura redes sociales.</p>
          </div>
        </article>
      </div>

      <article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Ubicaciones</p>
            <h2 class="mt-1 text-2xl font-bold text-slate-900">Sucursales y direcciones</h2>
          </div>
          <span class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{{ branchLocations.length }} sucursal{{ branchLocations.length === 1 ? '' : 'es' }}</span>
        </div>

        <div v-if="branchLocations.length" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article v-for="(branch, index) in branchLocations" :key="`branch-${index}`" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{{ branch.label || `Sucursal ${index + 1}` }}</p>
            <p class="mt-2 font-semibold text-slate-900">{{ branch.address || 'Dirección por confirmar' }}</p>
            <p class="text-sm text-slate-600">{{ branch.zone || 'Zona por confirmar' }}</p>
          </article>
        </div>
        <p v-else class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Esta tienda aún no ha configurado sucursales. Se usará la dirección principal para el despacho.</p>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta } from '#imports'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ layout: 'store' })

const route = useRoute()
const slug = route.params.slug as string
const tenantStore = useTenantStore()
const theme = useThemeStore()

const storeData = computed(() => tenantStore.data)
const storeName = computed(() => tenantStore.data?.name || 'Tienda')
const storeDescription = computed(() => tenantStore.data?.description || '')
const storeLogo = computed(() => tenantStore.data?.logo_url || tenantStore.data?.logo || '')
const aboutMessage = computed(() =>
  tenantStore.data?.about ||
  tenantStore.data?.about_us ||
  tenantStore.data?.about_text ||
  ''
)
const defaultAboutFallback = 'Agrega un mensaje de “Acerca de nosotros” desde el editor de la tienda.'
const aboutSections = computed(() => {
  const raw = String(aboutMessage.value || '').trim()
  if (!raw) {
    return {
      who: '',
      history: '',
      mission: '',
      extra: '',
    }
  }

  const normalized = raw
    .replace(/\r\n/g, '\n')
    .replace(/^##\s*Quiénes\s+somos\s*$/im, '##QUIENES')
    .replace(/^##\s*Nuestra\s+historia\s*$/im, '##HISTORIA')
    .replace(/^##\s*Misión\s+y\s+visión\s*$/im, '##MISION')
  const chunks = normalized.split(/##(QUIENES|HISTORIA|MISION)\n?/)

  if (chunks.length === 1) {
    return {
      who: raw,
      history: '',
      mission: '',
      extra: '',
    }
  }

  const sections = {
    who: '',
    history: '',
    mission: '',
    extra: '',
  }
  for (let i = 1; i < chunks.length; i += 2) {
    const key = chunks[i]
    const value = String(chunks[i + 1] || '').trim()
    if (key === 'QUIENES') sections.who = value
    if (key === 'HISTORIA') sections.history = value
    if (key === 'MISION') sections.mission = value
  }

  return sections
})
const contactEmail = computed(() => tenantStore.data?.contact_email || tenantStore.data?.email || '')
const phone = computed(() => tenantStore.data?.phone || '')
const socialLinks = computed(() => {
  const data = tenantStore.data as any
  const links = [
    { key: 'instagram', label: 'Instagram', url: String(data?.social_instagram || '').trim() },
    { key: 'facebook', label: 'Facebook', url: String(data?.social_facebook || '').trim() },
    { key: 'tiktok', label: 'TikTok', url: String(data?.social_tiktok || '').trim() },
    { key: 'youtube', label: 'YouTube', url: String(data?.social_youtube || '').trim() },
  ]
  return links.filter((link) => link.url)
})
const branchLocations = computed(() => {
  const data = tenantStore.data as any
  const locations = Array.isArray(data?.branch_locations) ? data.branch_locations : []
  if (locations.length) return locations
  if (data?.address) {
    return [{
      label: 'Casa matriz',
      zone: '',
      address: String(data.address),
    }]
  }
  return []
})
const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom || '#0f172a'}, ${theme.gradientTo || '#0b2358'})`,
}))

const loadData = async () => {
  tenantStore.setSlug(slug)
  await tenantStore.fetchTienda()
}

onMounted(async () => {
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  await loadData()
})
</script>
