import { defineStore } from 'pinia'

export const useTenantStore = defineStore('tenant', () => {
  const tenant = ref<Record<string, any> | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchTenant = async (slug?: string) => {
    const config = useRuntimeConfig()
    loading.value = true
    error.value = null

    try {
      if (!slug) {
        tenant.value = null
        return null
      }

      tenant.value = await $fetch<Record<string, any>>(`${config.public.apiBase}/stores/${slug}/`)
      return tenant.value
    } catch (fetchError: any) {
      error.value = fetchError?.message || 'No se pudo cargar la tienda'
      tenant.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  return {
    tenant,
    loading,
    error,
    fetchTenant,
  }
})