import { defineStore } from 'pinia'

const DEFAULT_ACCENT = '#2563eb'
const DEFAULT_GRADIENT_FROM = '#111827'
const DEFAULT_GRADIENT_TO = '#0b2358'

export const useThemeStore = defineStore('theme', () => {
  const accent = ref(DEFAULT_ACCENT)
  const gradientFrom = ref(DEFAULT_GRADIENT_FROM)
  const gradientTo = ref(DEFAULT_GRADIENT_TO)

  const loadFromStorage = () => {
    if (!process.client) return

    const storedAccent = localStorage.getItem('pymeweb_theme_accent')
    const storedFrom = localStorage.getItem('pymeweb_theme_gradient_from')
    const storedTo = localStorage.getItem('pymeweb_theme_gradient_to')

    if (storedAccent) accent.value = storedAccent
    if (storedFrom) gradientFrom.value = storedFrom
    if (storedTo) gradientTo.value = storedTo
  }

  const applyTheme = () => {
    if (!process.client) return

    const root = document.documentElement
    root.style.setProperty('--theme-accent', accent.value)
    root.style.setProperty('--theme-gradient-from', gradientFrom.value)
    root.style.setProperty('--theme-gradient-to', gradientTo.value)
  }

  const setTheme = (nextTheme: Partial<{ accent: string; gradientFrom: string; gradientTo: string }>) => {
    if (nextTheme.accent) accent.value = nextTheme.accent
    if (nextTheme.gradientFrom) gradientFrom.value = nextTheme.gradientFrom
    if (nextTheme.gradientTo) gradientTo.value = nextTheme.gradientTo

    if (process.client) {
      localStorage.setItem('pymeweb_theme_accent', accent.value)
      localStorage.setItem('pymeweb_theme_gradient_from', gradientFrom.value)
      localStorage.setItem('pymeweb_theme_gradient_to', gradientTo.value)
      applyTheme()
    }
  }

  return {
    accent,
    gradientFrom,
    gradientTo,
    loadFromStorage,
    applyTheme,
    setTheme,
  }
})