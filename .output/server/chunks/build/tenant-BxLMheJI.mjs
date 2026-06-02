import { g as defineStore, a as useRuntimeConfig } from './server.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';

const useTenantStore = defineStore("tenant", {
  state: () => ({
    data: null,
    productos: [],
    // Nueva variable para el catálogo
    loading: false,
    slug: "",
    categories: []
  }),
  actions: {
    resolveApiBase() {
      const config = useRuntimeConfig();
      const configured = String(config.public.apiBase || "").trim();
      if (!configured) return "http://127.0.0.1:8000/api";
      if (configured.startsWith("/api") && false) ;
      return configured;
    },
    async fetchWithApiFallback(path) {
      const config = useRuntimeConfig();
      const primaryBase = String(config.public.apiBase || "").trim() || this.resolveApiBase();
      const primaryUrl = `${primaryBase}${path}`;
      try {
        return await $fetch(primaryUrl);
      } catch (error) {
        const statusCode = Number(error?.statusCode || error?.response?.status || 0);
        const fallbackBase = this.resolveApiBase();
        const shouldRetry = statusCode === 404 && fallbackBase !== primaryBase;
        if (!shouldRetry) throw error;
        return await $fetch(`${fallbackBase}${path}`);
      }
    },
    setSlug(slug) {
      this.slug = slug;
    },
    async fetchTienda() {
      if (!this.slug) return;
      try {
        const response = await this.fetchWithApiFallback(`/stores/${this.slug}/`);
        this.data = response;
        const theme = useThemeStore();
        theme.loadFromStorage();
        const storeAny = response;
        if (storeAny?.accent_color || storeAny?.gradient_from || storeAny?.gradient_to) {
          theme.setStoreTheme(this.slug, {
            accent: storeAny?.accent_color || void 0,
            gradientFrom: storeAny?.gradient_from || void 0,
            gradientTo: storeAny?.gradient_to || void 0
          });
        }
        theme.applyStoreTheme(this.slug);
      } catch (error) {
        console.error("Error tienda:", error);
        this.data = null;
      }
    },
    async fetchProductos(params = {}) {
      if (!this.slug) return;
      this.loading = true;
      try {
        const search = new URLSearchParams(params).toString();
        const response = await this.fetchWithApiFallback(`/store/${this.slug}/catalogo/products/${search ? `?${search}` : ""}`);
        if (Array.isArray(response)) {
          this.productos = response;
        } else if (Array.isArray(response?.results)) {
          this.productos = response.results;
        } else if (response?.id) {
          this.productos = [response];
        } else {
          this.productos = [];
        }
        this.categories = Array.from(
          new Map(
            (this.productos || []).map((p) => p?.category).filter((c) => c && (c.slug || c.name)).map((c) => [c.slug || c.name, { name: c.name || c.slug, slug: c.slug || c.name }])
          ).values()
        );
      } catch (error) {
        console.error("Error catálogo:", error);
        this.productos = [];
        this.categories = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      if (!this.slug) return;
      try {
        const response = await this.fetchWithApiFallback(`/store/${this.slug}/catalogo/categories/`);
        this.categories = response;
      } catch (error) {
        console.error("Error categorías:", error);
      }
    }
  }
});

export { useTenantStore as u };
//# sourceMappingURL=tenant-BxLMheJI.mjs.map
