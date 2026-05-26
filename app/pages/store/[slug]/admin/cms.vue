<template>
  <div class="max-w-4xl mx-auto space-y-8">
    <h1 class="text-2xl font-bold">Personalización de la Tienda</h1>
    
    <div class="grid gap-4">
      <div v-for="section in sections" :key="section.id" 
           class="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm">
        <div>
          <h3 class="font-bold text-gray-800 uppercase text-sm">{{ section.type }}</h3>
          <p class="text-gray-500 text-sm">Controla la visibilidad de esta sección en tu página principal.</p>
        </div>
        
        <button @click="toggleSection(section)" 
                :class="section.enabled ? 'bg-green-500' : 'bg-gray-300'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
          <span :class="section.enabled ? 'translate-x-6' : 'translate-x-1'"
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' });
const { getSections, updateSectionStatus } = useCMS();
const sections = ref([]);

const loadSections = async () => {
  try {
    sections.value = await getSections();
  } catch (e) { console.error(e); }
};

const toggleSection = async (section) => {
  try {
    const newStatus = !section.enabled;
    await updateSectionStatus(section.id, newStatus);
    section.enabled = newStatus; // Actualización optimista en UI
  } catch (e) { alert("No se pudo cambiar el estado."); }
};

onMounted(loadSections);
</script>