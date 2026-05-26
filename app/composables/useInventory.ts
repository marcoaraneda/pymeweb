import { useRuntimeConfig } from "nuxt/app"
import { useAuthStore } from "~/stores/auth"
import { useTenantStore } from "~/stores/tenant"

export const useInventory = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const tenant = useTenantStore()

  const getStock = async () => {
    try {
      return await $fetch(`${config.public.apiBase}/inventory/stock/`, {
        headers: { Authorization: `Bearer ${auth.token}` },
        params: { store_id: tenant.data.id } // Filtrado multi-tenant [cite: 71, 72]
      })
    } catch (error) {
      console.error("Error al obtener inventario:", error)
      throw new Error("No se pudo cargar el stock. Intente más tarde.")
    }
  }

  const updateStock = async (payload: { variant_id: number, quantity: number, type: string }) => {
    try {
      return await $fetch(`${config.public.apiBase}/inventory/movements/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.token}` },
        body: { ...payload, store_id: tenant.data.id }
      })
    } catch (error: any) {
      const errorMessage = error.response?._data?.detail || "Error al obtener inventario"
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return { getStock, updateStock }
}