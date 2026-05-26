type ControlledGetOptions = {
  headers?: Record<string, string>
  credentials?: RequestCredentials
  force?: boolean
  backoffMs?: number
  minIntervalMs?: number
}

type ControlledMutationOptions = {
  method: 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  credentials?: RequestCredentials
  body?: any
  force?: boolean
  backoffMs?: number
}

const inflightRequests = new Map<string, Promise<any>>()
const inflightMutations = new Map<string, Promise<any>>()
const backoffUntilByKey = new Map<string, number>()
const lastSuccessAtByKey = new Map<string, number>()

const parseRetryAfterHeader = (value: unknown): number | null => {
  if (typeof value !== 'string' || !value.trim()) return null
  const asSeconds = Number(value)
  if (Number.isFinite(asSeconds) && asSeconds > 0) {
    return Math.ceil(asSeconds)
  }
  const asDate = Date.parse(value)
  if (!Number.isNaN(asDate)) {
    const seconds = Math.ceil((asDate - Date.now()) / 1000)
    if (seconds > 0) return seconds
  }
  return null
}

const parseSecondsFromDetail = (detail: unknown): number | null => {
  if (typeof detail !== 'string') return null
  const match = detail.match(/(\d+)\s*seconds?/i)
  const parsed = Number(match?.[1] || 0)
  if (Number.isFinite(parsed) && parsed > 0) return Math.ceil(parsed)
  return null
}

const withJitterMs = (baseMs: number) => {
  // +/-20% jitter to avoid synchronized retries from multiple tabs/users.
  const factor = 0.8 + Math.random() * 0.4
  return Math.max(1_000, Math.ceil(baseMs * factor))
}

const getErrorRetryAfterSeconds = (err: any): number | null => {
  const retryAfter =
    err?.response?.headers?.get?.('retry-after') ??
    err?.response?.headers?.['retry-after'] ??
    err?.response?._data?.retry_after

  const fromHeader = parseRetryAfterHeader(retryAfter)
  if (fromHeader) return fromHeader

  const fromDetail = parseSecondsFromDetail(err?.response?._data?.detail || err?.message)
  if (fromDetail) return fromDetail

  return null
}

const applyBackoff = (key: string, err: any, fallbackMs: number) => {
  const retryAfterSeconds = getErrorRetryAfterSeconds(err)
  const baseMs = retryAfterSeconds ? retryAfterSeconds * 1000 : fallbackMs
  const backoffMs = withJitterMs(baseMs)
  backoffUntilByKey.set(key, Date.now() + backoffMs)
}

const getBackoffSeconds = (key: string) => {
  const until = Number(backoffUntilByKey.get(key) || 0)
  if (!until) return 0
  return Math.max(0, Math.ceil((until - Date.now()) / 1000))
}

const createRateLimitError = (key: string) => {
  const waitSeconds = getBackoffSeconds(key)
  const error: any = new Error(`Demasiadas solicitudes. Reintenta en ${waitSeconds}s.`)
  error.response = { status: 429 }
  error.retryAfterSeconds = waitSeconds
  return error
}

export const useMarketplaceRequests = () => {
  const controlledGet = async <T>(
    key: string,
    url: string,
    options?: ControlledGetOptions,
  ): Promise<T> => {
    const force = options?.force === true
    const backoffMs = Number(options?.backoffMs || 10_000)
    const minIntervalMs = Number(options?.minIntervalMs || 0)

    const now = Date.now()
    const backoffUntil = Number(backoffUntilByKey.get(key) || 0)
    if (!force && backoffUntil > now) {
      throw createRateLimitError(key)
    }

    const lastSuccessAt = Number(lastSuccessAtByKey.get(key) || 0)
    if (!force && minIntervalMs > 0 && lastSuccessAt && now - lastSuccessAt < minIntervalMs) {
      if (inflightRequests.has(key)) {
        return await inflightRequests.get(key) as T
      }
    }

    if (inflightRequests.has(key)) {
      return await inflightRequests.get(key) as T
    }

    const requestPromise = (async () => {
      try {
        const data = await $fetch<T>(url, {
          headers: options?.headers,
          credentials: options?.credentials,
        })
        backoffUntilByKey.set(key, 0)
        lastSuccessAtByKey.set(key, Date.now())
        return data
      } catch (err: any) {
        if (err?.response?.status === 429) {
          applyBackoff(key, err, backoffMs)
        }
        throw err
      } finally {
        inflightRequests.delete(key)
      }
    })()

    inflightRequests.set(key, requestPromise as Promise<any>)
    return await requestPromise
  }

  const controlledMutation = async <T>(
    key: string,
    url: string,
    options: ControlledMutationOptions,
  ): Promise<T> => {
    const force = options.force === true
    const backoffMs = Number(options.backoffMs || 10_000)

    const now = Date.now()
    const backoffUntil = Number(backoffUntilByKey.get(key) || 0)
    if (!force && backoffUntil > now) {
      throw createRateLimitError(key)
    }

    if (inflightMutations.has(key)) {
      return await inflightMutations.get(key) as T
    }

    const mutationPromise = (async () => {
      try {
        const data = await $fetch<T>(url, {
          method: options.method,
          headers: options.headers,
          credentials: options.credentials,
          body: options.body,
        })
        backoffUntilByKey.set(key, 0)
        lastSuccessAtByKey.set(key, Date.now())
        return data
      } catch (err: any) {
        if (err?.response?.status === 429) {
          applyBackoff(key, err, backoffMs)
        }
        throw err
      } finally {
        inflightMutations.delete(key)
      }
    })()

    inflightMutations.set(key, mutationPromise as Promise<any>)
    return await mutationPromise
  }

  return {
    controlledGet,
    controlledMutation,
    getBackoffSeconds,
    getErrorRetryAfterSeconds,
  }
}
