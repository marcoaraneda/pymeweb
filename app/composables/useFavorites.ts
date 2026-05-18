type FavoriteKey = string

const STORE_FAVORITES_KEY = 'pymeweb_favorite_stores'
const PRODUCT_FAVORITES_KEY = 'pymeweb_favorite_products'

const readJsonSet = (key: string) => {
  if (!process.client) return new Set<string>()

  try {
    const raw = localStorage.getItem(key)
    if (!raw) return new Set<string>()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed) ? parsed.map(String) : [])
  } catch {
    return new Set<string>()
  }
}

const writeJsonSet = (key: string, values: Set<string>) => {
  if (!process.client) return
  localStorage.setItem(key, JSON.stringify(Array.from(values)))
}

export const makeProductFavoriteKey = (storeSlug: string | number | null | undefined, productId: string | number | null | undefined) => {
  const storePart = String(storeSlug ?? '').trim()
  const productPart = String(productId ?? '').trim()
  return [storePart, productPart].filter(Boolean).join(':')
}

export const useFavorites = () => {
  const storeFavorites = ref<Set<string>>(new Set())
  const productFavorites = ref<Set<string>>(new Set())

  const hydrate = () => {
    if (!process.client) return
    storeFavorites.value = readJsonSet(STORE_FAVORITES_KEY)
    productFavorites.value = readJsonSet(PRODUCT_FAVORITES_KEY)
  }

  const persist = () => {
    writeJsonSet(STORE_FAVORITES_KEY, storeFavorites.value)
    writeJsonSet(PRODUCT_FAVORITES_KEY, productFavorites.value)
  }

  const isStoreFavorite = (storeSlug: string | number | null | undefined) =>
    storeFavorites.value.has(String(storeSlug ?? '').trim())

  const toggleStoreFavorite = (storeSlug: string | number | null | undefined) => {
    const key = String(storeSlug ?? '').trim()
    if (!key) return false

    if (storeFavorites.value.has(key)) {
      storeFavorites.value.delete(key)
    } else {
      storeFavorites.value.add(key)
    }
    persist()
    return storeFavorites.value.has(key)
  }

  const isProductFavoriteKey = (favoriteKey: FavoriteKey) => productFavorites.value.has(String(favoriteKey ?? '').trim())

  const toggleProductFavoriteKey = (favoriteKey: FavoriteKey) => {
    const key = String(favoriteKey ?? '').trim()
    if (!key) return false

    if (productFavorites.value.has(key)) {
      productFavorites.value.delete(key)
    } else {
      productFavorites.value.add(key)
    }
    persist()
    return productFavorites.value.has(key)
  }

  hydrate()

  return {
    isStoreFavorite,
    isProductFavoriteKey,
    toggleStoreFavorite,
    toggleProductFavoriteKey,
  }
}