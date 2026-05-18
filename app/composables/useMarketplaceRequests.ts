type RequestOptions = {
  backoffMs?: number
  minIntervalMs?: number
}

type CacheEntry = {
  value: any
  timestamp: number
}

const requestCache = new Map<string, CacheEntry>()

export const useMarketplaceRequests = () => {
  const controlledGet = async <T>(cacheKey: string, url: string, options: RequestOptions = {}): Promise<T> => {
    const now = Date.now()
    const minIntervalMs = options.minIntervalMs ?? 0
    const backoffMs = options.backoffMs ?? 0
    const cached = requestCache.get(cacheKey)

    if (cached && now - cached.timestamp < Math.max(minIntervalMs, 0)) {
      return cached.value as T
    }

    if (cached && backoffMs > 0 && now - cached.timestamp < backoffMs) {
      return cached.value as T
    }

    const response = await $fetch<T>(url)
    requestCache.set(cacheKey, { value: response, timestamp: now })
    return response
  }

  return {
    controlledGet,
  }
}