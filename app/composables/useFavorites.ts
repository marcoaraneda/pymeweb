import { computed, onMounted, watch } from 'vue'
import { useState } from '#app'

const STORE_STORAGE_KEY = 'pymeweb:favStores'
const PRODUCT_STORAGE_KEY = 'pymeweb:favProducts'

const safeParseArray = (raw: string | null): string[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch {
    return []
  }
}

const uniq = (items: string[]) => Array.from(new Set(items.filter(Boolean)))

export const makeProductFavoriteKey = (
  storeSlug: string | null | undefined,
  productIdOrSlug: string | number | null | undefined
) => {
  const store = (storeSlug || 'marketplace').toString()
  const prod = productIdOrSlug === null || productIdOrSlug === undefined ? '' : String(productIdOrSlug)
  return prod ? `${store}:${prod}` : ''
}

export const useFavorites = () => {
  const favoriteStoreSlugs = useState<string[]>('favoriteStoreSlugs', () => [])
  const favoriteProductKeys = useState<string[]>('favoriteProductKeys', () => [])

  const storeSet = computed(() => new Set(favoriteStoreSlugs.value))
  const productSet = computed(() => new Set(favoriteProductKeys.value))

  const loadFromStorage = () => {
    if (!process.client) return
    if (!favoriteStoreSlugs.value.length) {
      favoriteStoreSlugs.value = uniq(safeParseArray(localStorage.getItem(STORE_STORAGE_KEY)))
    }
    if (!favoriteProductKeys.value.length) {
      favoriteProductKeys.value = uniq(safeParseArray(localStorage.getItem(PRODUCT_STORAGE_KEY)))
    }
  }

  const persist = () => {
    if (!process.client) return
    localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(uniq(favoriteStoreSlugs.value)))
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(uniq(favoriteProductKeys.value)))
  }

  onMounted(loadFromStorage)
  watch([favoriteStoreSlugs, favoriteProductKeys], persist, { deep: true })

  const isStoreFavorite = (slug: string) => storeSet.value.has(slug)
  const toggleStoreFavorite = (slug: string) => {
    if (!slug) return
    const next = new Set(favoriteStoreSlugs.value)
    if (next.has(slug)) next.delete(slug)
    else next.add(slug)
    favoriteStoreSlugs.value = Array.from(next)
  }

  const isProductFavoriteKey = (key: string) => Boolean(key) && productSet.value.has(key)
  const toggleProductFavoriteKey = (key: string) => {
    if (!key) return
    const next = new Set(favoriteProductKeys.value)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    favoriteProductKeys.value = Array.from(next)
  }

  return {
    favoriteStoreSlugs,
    favoriteProductKeys,
    isStoreFavorite,
    toggleStoreFavorite,
    isProductFavoriteKey,
    toggleProductFavoriteKey,
  }
}
