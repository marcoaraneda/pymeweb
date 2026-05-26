<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold">Personalización de la Tienda</h1>
        <p class="text-sm text-gray-500">Activa o desactiva secciones de la página principal.</p>
      </div>
      <button @click="loadSections" class="text-sm bg-gray-200 px-4 py-2 rounded-lg">Actualizar</button>
    </div>

    <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
      {{ successMessage }}
    </div>

    <div v-if="loading" class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
      Cargando secciones...
    </div>

    <div v-else-if="!sections.length" class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 space-y-3">
      <p>No hay secciones configuradas para esta tienda.</p>
      <button
        class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        :disabled="initializing"
        @click="initializeSections"
      >
        {{ initializing ? 'Inicializando...' : 'Inicializar secciones por defecto' }}
      </button>
    </div>
    
    <div v-else class="grid gap-4">
      <div v-for="section in sections" :key="section.id" 
           class="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm">
        <div>
          <h3 class="font-bold text-gray-800 uppercase text-sm">{{ section.section_type }}</h3>
          <p class="text-gray-500 text-sm">Controla la visibilidad de esta sección en tu página principal.</p>
        </div>
        
        <button @click="toggleSection(section)" 
                :class="section.enabled ? 'bg-green-500' : 'bg-gray-300'"
                :disabled="savingId === section.id"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
          <span :class="section.enabled ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CMSSection } from '~/composables/useCMS'

definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true });
const { getSections, updateSectionStatus, createSection } = useCMS();

const DEFAULT_SECTION_TYPES = [
  'HERO',
  'CATEGORIES',
  'FEATURED_PRODUCTS',
  'ABOUT_SNIPPET',
  'FACILITIES_SNIPPET',
  'FAQ_SNIPPET',
  'CONTACT_SNIPPET',
] as const

const sections = ref<CMSSection[]>([]);
const loading = ref(false)
const initializing = ref(false)
const savingId = ref<number | null>(null)
const errorMessage = ref('')
const successMessage = ref('')

const loadSections = async () => {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    sections.value = await getSections();
  } catch (e: any) {
    errorMessage.value = e?.message || 'No se pudieron cargar las secciones.'
  } finally {
    loading.value = false
  }
};

const initializeSections = async () => {
  initializing.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    for (let index = 0; index < DEFAULT_SECTION_TYPES.length; index += 1) {
      const sectionType = DEFAULT_SECTION_TYPES[index]
      try {
        await createSection({ section_type: sectionType, enabled: true, order: index + 1 })
      } catch {
        // Ignora duplicados para permitir reinicialización segura.
      }
    }
    await loadSections()
    successMessage.value = 'Secciones por defecto inicializadas.'
  } catch (e: any) {
    errorMessage.value = e?.message || 'No se pudieron inicializar las secciones.'
  } finally {
    initializing.value = false
  }
}

const toggleSection = async (section: CMSSection) => {
  const previous = section.enabled
  section.enabled = !section.enabled
  savingId.value = section.id
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const updated = await updateSectionStatus(section.id, section.enabled)
    section.enabled = updated.enabled
    successMessage.value = `Sección ${section.section_type} ${updated.enabled ? 'activada' : 'desactivada'}.`
  } catch (e: any) {
    section.enabled = previous
    errorMessage.value = e?.message || 'No se pudo cambiar el estado.'
  } finally {
    savingId.value = null
  }
};

onMounted(loadSections);
</script>