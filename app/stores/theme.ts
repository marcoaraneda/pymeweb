import { defineStore } from 'pinia'

type ThemeValues = { accent: string; gradientFrom: string; gradientTo: string }

const STORAGE_KEY = 'theme-preferences-v1'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    baseAccent: '#2563eb',
    baseGradientFrom: '#111827',
    baseGradientTo: '#0b2358',
    accent: '#2563eb',
    gradientFrom: '#111827',
    gradientTo: '#0b2358',
    perStore: {} as Record<string, ThemeValues>,
    hydrated: false,
  }),
  actions: {
    loadFromStorage() {
      if (!process.client || this.hydrated) return
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          this.baseAccent = parsed.accent || this.baseAccent
          this.baseGradientFrom = parsed.gradientFrom || this.baseGradientFrom
          this.baseGradientTo = parsed.gradientTo || this.baseGradientTo
          this.accent = this.baseAccent
          this.gradientFrom = this.baseGradientFrom
          this.gradientTo = this.baseGradientTo
          this.perStore = parsed.perStore || {}
        } catch (error) {
          console.warn('No se pudo leer el tema guardado', error)
        }
      }
      this.hydrated = true
      this.applyTheme()
    },

    saveToStorage() {
      if (!process.client) return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          accent: this.accent,
          gradientFrom: this.gradientFrom,
          gradientTo: this.gradientTo,
          perStore: this.perStore,
        })
      )
    },

    resetToBase() {
      this.accent = this.baseAccent
      this.gradientFrom = this.baseGradientFrom
      this.gradientTo = this.baseGradientTo
      this.applyTheme()
    },

    setAccent(color: string) {
      this.accent = color
      this.applyTheme()
      this.saveToStorage()
    },
    setGradient(from: string, to: string) {
      this.gradientFrom = from
      this.gradientTo = to
      this.applyTheme()
      this.saveToStorage()
    },

    setStoreTheme(slug: string, values: Partial<ThemeValues>) {
      if (!slug) return
      const current = this.perStore[slug] || {
        accent: this.accent,
        gradientFrom: this.gradientFrom,
        gradientTo: this.gradientTo,
      }
      this.perStore[slug] = {
        accent: values.accent || current.accent,
        gradientFrom: values.gradientFrom || current.gradientFrom,
        gradientTo: values.gradientTo || current.gradientTo,
      }
      this.applyTheme(this.perStore[slug])
      this.saveToStorage()
    },

    applyStoreTheme(slug: string) {
      if (slug && this.perStore[slug]) {
        const values = this.perStore[slug]
        // Sincroniza el estado para que los bindings reactivos (botones, textos) usen el color del tema
        this.accent = values.accent || this.accent
        this.gradientFrom = values.gradientFrom || this.gradientFrom
        this.gradientTo = values.gradientTo || this.gradientTo
        this.applyTheme(values)
        return
      }
      this.resetToBase()
    },

    applyTheme(overrides?: ThemeValues) {
      if (!process.client) return
      const root = document.documentElement
      const accent = overrides?.accent || this.accent
      const from = overrides?.gradientFrom || this.gradientFrom
      const to = overrides?.gradientTo || this.gradientTo

      root.style.setProperty('--accent', accent)
      root.style.setProperty('--gradient-from', from)
      root.style.setProperty('--gradient-to', to)
    },
  },
})
