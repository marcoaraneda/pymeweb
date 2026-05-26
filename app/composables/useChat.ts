import { useRuntimeConfig } from "nuxt/app"
import { useTenantStore } from "~/stores/tenant"

export const useChat = () => {
  const config = useRuntimeConfig()
  const tenantStore = useTenantStore()

  const sendMessage = async (message: string) => {
    return await $fetch(`${config.public.apiBase}/ai/chat/`, {
      method: 'POST',
      body: { 
        message, 
        store_slug: tenantStore.slug // Filtra por tienda 
      }
    })
  }
  return { sendMessage }
}