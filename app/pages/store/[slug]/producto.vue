<template>
  <div class="min-h-screen bg-slate-50 px-4 py-10">
    <div class="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
      <p class="text-sm font-semibold text-slate-800">Redirigiendo al detalle del producto...</p>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <NuxtLink :to="`/store/${slug}/productos`" class="text-sm font-semibold text-slate-700 hover:text-slate-900">Ir al catálogo</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { navigateTo } from '#imports'

const route = useRoute()
const slug = route.params.slug as string
const error = ref('')

const getLegacyIdentifier = () => {
  const slugQuery = route.query.slug
  const idQuery = route.query.id
  const slugValue = Array.isArray(slugQuery) ? slugQuery[0] : slugQuery
  const idValue = Array.isArray(idQuery) ? idQuery[0] : idQuery
  return (slugValue || idValue || '').toString().trim()
}

onMounted(async () => {
  const identifier = getLegacyIdentifier()
  const target = identifier ? `/store/${slug}/productos/${identifier}` : `/store/${slug}/productos`
  try {
    await navigateTo(target, { replace: true })
  } catch {
    error.value = 'No se pudo redirigir al detalle del producto.'
  }
})
</script>
