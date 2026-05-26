import { defineStore } from 'pinia'
import { useRuntimeConfig } from 'nuxt/app'
import { useThemeStore } from './theme'

export const useTenantStore = defineStore('tenant', {
  state: () => ({
    data: null as any,
    productos: [] as any[], // Nueva variable para el catálogo
    loading: false,
    slug: '',
    categories: [] as { name: string; slug: string }[],
  }),
  actions: {
    resolveApiBase() {
      const config = useRuntimeConfig()
      const configured = String(config.public.apiBase || '').trim()
      if (!configured) return 'http://127.0.0.1:8000/api'
      if (configured.startsWith('/api') && import.meta.client && window?.location?.hostname) {
        const isLocalHost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
        if (isLocalHost) return 'http://127.0.0.1:8000/api'
      }
      return configured
    },

    async fetchWithApiFallback(path: string) {
      const config = useRuntimeConfig()
      const primaryBase = String(config.public.apiBase || '').trim() || this.resolveApiBase()
      const primaryUrl = `${primaryBase}${path}`
      try {
        return await $fetch(primaryUrl)
      } catch (error: any) {
        const statusCode = Number(error?.statusCode || error?.response?.status || 0)
        const fallbackBase = this.resolveApiBase()
        const shouldRetry = statusCode === 404 && fallbackBase !== primaryBase
        if (!shouldRetry) throw error
        return await $fetch(`${fallbackBase}${path}`)
      }
    },

    setSlug(slug: string) {
      this.slug = slug
    },
    async fetchTienda() {
      if (!this.slug) return
      try {
        const response = await this.fetchWithApiFallback(`/stores/${this.slug}/`)
        this.data = response
        // Aplica tema persistido en backend (fallback al tema local si ya existía).
        const theme = useThemeStore()
        theme.loadFromStorage()
        const storeAny = response as any
        if (storeAny?.accent_color || storeAny?.gradient_from || storeAny?.gradient_to) {
          theme.setStoreTheme(this.slug, {
            accent: storeAny?.accent_color || undefined,
            gradientFrom: storeAny?.gradient_from || undefined,
            gradientTo: storeAny?.gradient_to || undefined,
          })
        }
        theme.applyStoreTheme(this.slug)
      } catch (error) {
        console.error("Error tienda:", error)
        // No interrumpimos el flujo para permitir que otras vistas carguen
        // productos/categorias aunque falle metadata o tema de tienda.
        this.data = null
      }
    },
    async fetchProductos(params: Record<string, any> = {}) {
      if (!this.slug) return
      this.loading = true
      try {
        const search = new URLSearchParams(params as any).toString()
        const response = await this.fetchWithApiFallback(`/store/${this.slug}/catalogo/products/${search ? `?${search}` : ''}`)
        // Algunas respuestas vienen paginadas { results: [...], count, next, previous }
        if (Array.isArray(response)) {
          this.productos = response
        } else if (Array.isArray((response as any)?.results)) {
          this.productos = (response as any).results
        } else if ((response as any)?.id) {
          // Fallback defensivo: algunos entornos pueden entregar un solo objeto.
          this.productos = [response as any]
        } else {
          this.productos = []
        }
        this.categories = Array.from(
          new Map(
            (this.productos || [])
              .map((p: any) => p?.category)
              .filter((c: any) => c && (c.slug || c.name))
              .map((c: any) => [c.slug || c.name, { name: c.name || c.slug, slug: c.slug || c.name }])
          ).values()
        )
      } catch (error) {
        console.error("Error catálogo:", error)
        this.productos = []
        this.categories = []
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      if (!this.slug) return
      try {
        const response = await this.fetchWithApiFallback(`/store/${this.slug}/catalogo/categories/`) as { name: string; slug: string }[]
        this.categories = response
      } catch (error) {
        console.error('Error categorías:', error)
      }
    }
  }
})