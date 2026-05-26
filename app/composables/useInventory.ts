import { useRuntimeConfig } from "nuxt/app"
import { useAuthStore } from "~/stores/auth"
import { useTenantStore } from "~/stores/tenant"

export const useInventory = () => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const tenant = useTenantStore()

  const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
    if (!auth.token) {
      throw new Error("No autenticado")
    }

    const doFetch = (token: string) =>
      $fetch<T>(url, {
        ...options,
        headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
      })

    try {
      return await doFetch(auth.token)
    } catch (error: any) {
      const code = error.response?._data?.code
      if (code === 'token_not_valid' && auth.refreshToken) {
        const refreshed = await auth.refreshTokens()
        if (refreshed) {
          return await doFetch(refreshed)
        }
      }
      throw error
    }
  }

  const getStock = async () => {
    if (!tenant.slug) {
      throw new Error("Tienda no cargada")
    }
    try {
      return await authedFetch(`${config.public.apiBase}/store/${tenant.slug}/admin/inventario/stocks/`)
    } catch (error) {
      console.error("Error al obtener inventario:", error)
      throw new Error("No se pudo cargar el stock. Intente más tarde.")
    }
  }

  const updateStock = async (payload: { variantId: number, quantity: number, type: string, reason?: string }) => {
    if (!tenant.slug) {
      throw new Error("Tienda no cargada")
    }
    try {
      return await authedFetch(`${config.public.apiBase}/store/${tenant.slug}/admin/inventario/movements/`, {
        method: 'POST',
        body: {
          variant: payload.variantId,
          quantity: payload.quantity,
          movement_type: payload.type,
          reason: payload.reason || '',
        }
      })
    } catch (error: any) {
      const errorMessage = error.response?._data?.detail || "Error al obtener inventario"
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  return { getStock, updateStock }
}