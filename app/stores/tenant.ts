import { defineStore } from 'pinia'
import { useRuntimeConfig } from 'nuxt/app'
import { useThemeStore } from './theme'

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    data: null as any,
    productos: [] as any[], // Nueva variable para el catálogo
    loading: false,
    slug: '',
    categories: [] as string[],
  }),
  actions: {
    setSlug(slug: string) {
      this.slug = slug
    },
    async fetchTienda() {
      if (!this.slug) return
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.apiBase}/stores/${this.slug}/`)
        this.data = response
        // Aplica el tema guardado para esta tienda si existe
        const theme = useThemeStore()
        theme.loadFromStorage()
        theme.applyStoreTheme(this.slug)
      } catch (error) { console.error("Error tienda:", error) }
    },
    async fetchProductos(params: Record<string, any> = {}) {
      if (!this.slug) return
      this.loading = true
      try {
        const config = useRuntimeConfig()
        const search = new URLSearchParams(params as any).toString()
        const url = `${config.public.apiBase}/store/${this.slug}/catalogo/products/${search ? `?${search}` : ''}`
        const response = await $fetch(url)
        this.productos = response as any[]
        this.categories = Array.from(new Set((this.productos || []).map((p: any) => p?.category?.name).filter(Boolean)))
      } catch (error) {
        console.error("Error catálogo:", error)
        this.productos = []
        this.categories = []
      } finally {
        this.loading = false
      }
    }
  }
})