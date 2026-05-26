const STORE_VISITS_KEY_PREFIX = 'pymeweb:store-visits'

type VisitMap = Record<string, number>

const resolveActor = (userId?: string | number | null) => {
  const raw = String(userId ?? '').trim()
  return raw || 'guest'
}

const keyForActor = (userId?: string | number | null) => `${STORE_VISITS_KEY_PREFIX}:${resolveActor(userId)}`

const parseVisitMap = (raw: string | null): VisitMap => {
  if (!raw) return {}
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return {}
    return Object.entries(parsed).reduce<VisitMap>((acc, [slug, count]) => {
      const value = Number(count)
      if (!slug || !Number.isFinite(value) || value <= 0) return acc
      acc[slug] = Math.floor(value)
      return acc
    }, {})
  } catch {
    return {}
  }
}

export const loadStoreVisits = (userId?: string | number | null): VisitMap => {
  if (!process.client) return {}
  return parseVisitMap(localStorage.getItem(keyForActor(userId)))
}

export const recordStoreVisit = (slug?: string | null, userId?: string | number | null) => {
  const safeSlug = String(slug || '').trim()
  if (!process.client || !safeSlug) return
  const key = keyForActor(userId)
  const map = parseVisitMap(localStorage.getItem(key))
  map[safeSlug] = Number(map[safeSlug] || 0) + 1
  localStorage.setItem(key, JSON.stringify(map))
}

export const getMostVisitedStoreSlug = (stores: Array<{ slug?: string }>, userId?: string | number | null): string => {
  const visitMap = loadStoreVisits(userId)
  if (!stores.length) return ''
  let winner = ''
  let best = 0
  stores.forEach((store) => {
    const slug = String(store?.slug || '').trim()
    if (!slug) return
    const count = Number(visitMap[slug] || 0)
    if (count > best) {
      best = count
      winner = slug
    }
  })
  return winner
}