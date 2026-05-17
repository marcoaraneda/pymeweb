import { defineStore } from 'pinia';

const DEFAULT_ACCENT = "#2563eb";
const DEFAULT_GRADIENT_FROM = "#111827";
const DEFAULT_GRADIENT_TO = "#0b2358";
const useThemeStore = defineStore("theme", {
  state: () => ({
    baseAccent: DEFAULT_ACCENT,
    baseGradientFrom: DEFAULT_GRADIENT_FROM,
    baseGradientTo: DEFAULT_GRADIENT_TO,
    accent: DEFAULT_ACCENT,
    gradientFrom: DEFAULT_GRADIENT_FROM,
    gradientTo: DEFAULT_GRADIENT_TO,
    perStore: {},
    hydrated: false
  }),
  actions: {
    loadFromStorage() {
      return;
    },
    saveToStorage() {
      return;
    },
    resetToBase() {
      this.accent = this.baseAccent;
      this.gradientFrom = this.baseGradientFrom;
      this.gradientTo = this.baseGradientTo;
      this.applyTheme();
    },
    setAccent(color) {
      this.accent = color;
      this.applyTheme();
      this.saveToStorage();
    },
    setGradient(from, to) {
      this.gradientFrom = from;
      this.gradientTo = to;
      this.applyTheme();
      this.saveToStorage();
    },
    setStoreTheme(slug, values) {
      if (!slug) return;
      const current = this.perStore[slug] || {
        accent: this.accent,
        gradientFrom: this.gradientFrom,
        gradientTo: this.gradientTo
      };
      this.perStore[slug] = {
        accent: values.accent ?? current.accent,
        gradientFrom: values.gradientFrom ?? current.gradientFrom,
        gradientTo: values.gradientTo ?? current.gradientTo
      };
      this.applyTheme(this.perStore[slug]);
      this.saveToStorage();
    },
    renameStoreTheme(oldSlug, newSlug) {
      if (!oldSlug || !newSlug || oldSlug === newSlug) return;
      if (this.perStore[oldSlug]) {
        this.perStore[newSlug] = this.perStore[oldSlug];
        delete this.perStore[oldSlug];
        this.saveToStorage();
      }
    },
    applyStoreTheme(slug) {
      if (slug && this.perStore[slug]) {
        const values = this.perStore[slug];
        this.accent = values.accent || this.accent;
        this.gradientFrom = values.gradientFrom || this.gradientFrom;
        this.gradientTo = values.gradientTo || this.gradientTo;
        this.applyTheme(values);
        return;
      }
      this.resetToBase();
    },
    applyTheme(overrides) {
      return;
    }
  }
});

export { useThemeStore as u };
//# sourceMappingURL=theme-CB1SKex-.mjs.map
