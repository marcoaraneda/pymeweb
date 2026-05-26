import { useRuntimeConfig } from 'nuxt/app'
import { useTenantStore } from '~/stores/tenant'

export const useProducts = () => {
  const config = useRuntimeConfig()
  const tenantStore = useTenantStore()

  const getProducts = async () => {
    if (!tenantStore.slug) {
      throw new Error('Tenant slug no definido')
    }

    return await $fetch(
      `${config.public.apiBase}/store/${tenantStore.slug}/catalogo/products/`
    )
  }

  const getProductBySlug = async (productSlug: string) => {
    if (!tenantStore.slug) {
      throw new Error('Tenant slug no definido')
    }

    return await $fetch(
      `${config.public.apiBase}/store/${tenantStore.slug}/catalogo/products/${productSlug}/`
    )
  }

  return {
    getProducts,
    getProductBySlug
  }
}
