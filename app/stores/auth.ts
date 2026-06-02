import { navigateTo, useCookie, useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'

type Credentials = { username: string; password: string }
type SignupPayload = {
  username: string
  email: string
  password: string
  rut: string
  address: string
  phone: string
  first_name?: string
  last_name?: string
}
type StoreLite = { id: number; name: string; slug: string }
type UserProfile = {
  id: number
  username: string
  email: string
  rut?: string | null
  address?: string | null
  phone?: string | null
  first_name?: string
  last_name?: string
  avatar_url?: string | null
  avatar_updated_at?: string | null
  is_email_verified?: boolean
  email_verified_at?: string | null
  is_phone_verified?: boolean
  phone_verified_at?: string | null
  is_google_verified?: boolean
  google_verified_at?: string | null
  is_staff?: boolean
  memberships?: Array<{ store: StoreLite; roles: string[] }>
}

let sessionBootstrapPromise: Promise<UserProfile | null> | null = null
let profileFetchPromise: Promise<UserProfile | null> | null = null

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

const parseDetailSeconds = (value: unknown): number | null => {
  if (typeof value !== 'string') return null
  const match = value.match(/(\d+)\s*seconds?/i)
  const parsed = Number(match?.[1] || 0)
  if (Number.isFinite(parsed) && parsed > 0) return Math.ceil(parsed)
  return null
}

const withJitterMs = (baseMs: number) => {
  const factor = 0.8 + Math.random() * 0.4
  return Math.max(1_000, Math.ceil(baseMs * factor))
}

const getProfileBackoffMsFromError = (error: any, fallbackMs = 10_000) => {
  const retryAfter =
    error?.response?.headers?.get?.('retry-after') ??
    error?.response?.headers?.['retry-after'] ??
    error?.response?._data?.retry_after
  const headerSeconds = parseRetryAfterHeader(retryAfter)
  if (headerSeconds) return withJitterMs(headerSeconds * 1000)

  const detailSeconds = parseDetailSeconds(error?.response?._data?.detail || error?.message)
  if (detailSeconds) return withJitterMs(detailSeconds * 1000)

  return withJitterMs(fallbackMs)
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    refreshToken: null as string | null,
    user: null as any | null,
    loading: false,
    error: null as string | null,
    initialized: false,
    profileBackoffUntil: 0,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    hasStores: (state) => Boolean(state.user?.memberships?.length || state.user?.is_staff),
    isProfileBackoffActive: (state) => Date.now() < Number(state.profileBackoffUntil || 0),
  },

  actions: {
    restoreFromCookies() {
      const secure = process.env.NODE_ENV === 'production'
      const tokenCookie = useCookie<string | null>('auth_token', { secure, path: '/' })
      const refreshCookie = useCookie<string | null>('refresh_token', { secure, path: '/' })
      this.token = tokenCookie.value || null
      this.refreshToken = refreshCookie.value || null
      try {
        console.debug('[auth] restoreFromCookies token present:', Boolean(this.token), 'refresh present:', Boolean(this.refreshToken))
      } catch (e) {
        /* ignore */
      }
    },

    async initializeSession(options?: { forceProfile?: boolean }): Promise<UserProfile | null> {
      if (sessionBootstrapPromise) {
        return sessionBootstrapPromise
      }

      sessionBootstrapPromise = (async () => {
        console.debug('[auth] initializeSession start', { hasToken: Boolean(this.token), hasRefresh: Boolean(this.refreshToken), forceProfile: options?.forceProfile })
        if (!this.token || !this.refreshToken) {
          this.restoreFromCookies()
        }

        if (!this.token && this.refreshToken) {
          await this.refreshTokens()
        }

        if (!this.token) {
          this.user = null
          return null
        }

        if (options?.forceProfile || !this.user) {
          return await this.fetchProfile()
        }

        return this.user
      })()

      try {
        return await sessionBootstrapPromise
      } finally {
        this.initialized = true
        sessionBootstrapPromise = null
        console.debug('[auth] initializeSession finished, initialized flag set')
      }
    },

    async login(credentials: Credentials) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      try {
        const data = await $fetch<{ access: string; refresh: string }>(`${config.public.apiBase}/token/`, {
          method: 'POST',
          body: credentials,
        })

        this.token = data.access
        this.refreshToken = data.refresh
        console.debug('[auth] login success, stored access and refresh tokens')

        const secure = process.env.NODE_ENV === 'production'
        useCookie('auth_token', { maxAge: 60 * 60 * 24, sameSite: 'lax', secure, path: '/' }).value = data.access
        useCookie('refresh_token', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure, path: '/' }).value = data.refresh

        await this.fetchProfile()
      } catch (error: any) {
        const detail = error?.response?._data?.detail || 'No pudimos iniciar sesión'
        this.error = detail
        console.debug('[auth] login error', { detail })
        throw new Error(detail)
      } finally {
        this.loading = false
      }
    },

    async register(payload: SignupPayload) {
      this.loading = true
      this.error = null
      const config = useRuntimeConfig()

      try {
        const data = await $fetch<{ access: string; refresh: string; user: UserProfile }>(`${config.public.apiBase}/users/signup/`, {
          method: 'POST',
          body: payload,
        })

        this.token = data.access
        this.refreshToken = data.refresh
        this.user = data.user

        const secure = process.env.NODE_ENV === 'production'
        useCookie('auth_token', { maxAge: 60 * 60 * 24, sameSite: 'lax', secure, path: '/' }).value = data.access
        useCookie('refresh_token', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax', secure, path: '/' }).value = data.refresh
      } catch (error: any) {
        const detail = error?.response?._data?.detail || error?.response?._data || 'No pudimos registrar tu cuenta'
        this.error = detail
        throw new Error(detail)
      } finally {
        this.loading = false
      }
    },

    async fetchProfile(): Promise<UserProfile | null> {
      if (!this.token) {
        this.restoreFromCookies()
      }
      if (!this.token) return null

      if (profileFetchPromise) {
        return profileFetchPromise
      }

      if (Date.now() < Number(this.profileBackoffUntil || 0)) {
        // During 429 cooldown we reuse last known profile to avoid request storms.
        return this.user
      }

      const config = useRuntimeConfig()

      profileFetchPromise = (async () => {
        try {
          const profile = await $fetch<UserProfile>(`${config.public.apiBase}/users/me/`, {
            headers: { Authorization: `Bearer ${this.token}` },
          })
          this.profileBackoffUntil = 0
          this.user = profile
          try {
            console.debug('[auth] fetchProfile success', { userId: profile?.id, username: profile?.username })
          } catch (e) {}
          return profile
        } catch (error: any) {
          if (error?.response?.status === 429) {
            this.profileBackoffUntil = Date.now() + getProfileBackoffMsFromError(error)
            this.error = 'Demasiadas solicitudes al servidor. Reintentaremos en unos segundos.'
            return this.user
          }

          const code = error?.response?._data?.code
          try {
            console.debug('[auth] fetchProfile error code', { code, status: error?.response?.status, detail: error?.response?._data?.detail })
          } catch (e) {}
          if (code === 'token_not_valid' && this.refreshToken) {
            const refreshed = await this.refreshTokens()
            if (refreshed) {
              try {
                const profile = await $fetch<UserProfile>(`${config.public.apiBase}/users/me/`, {
                  headers: { Authorization: `Bearer ${refreshed}` },
                })
                this.profileBackoffUntil = 0
                this.user = profile
                try { console.debug('[auth] fetchProfile success after refresh') } catch (e) {}
                return profile
              } catch {
                // Fall through to generic error.
              }
            }
          }
          const detail = error?.response?._data?.detail || 'No pudimos cargar tu perfil'
          this.error = detail
          try { console.debug('[auth] fetchProfile final error detail', { detail }) } catch (e) {}
          return null
        } finally {
          profileFetchPromise = null
        }
      })()

      return profileFetchPromise
    },

    async refreshTokens(): Promise<string | null> {
      if (!this.refreshToken) {
        this.restoreFromCookies()
      }
      if (!this.refreshToken) return null
      const config = useRuntimeConfig()
      console.debug('[auth] refreshTokens starting, hasRefresh:', Boolean(this.refreshToken))
      try {
        const data = await $fetch<{ access: string }>(`${config.public.apiBase}/token/refresh/`, {
          method: 'POST',
          body: { refresh: this.refreshToken },
        })

        this.token = data.access
        const secure = process.env.NODE_ENV === 'production'
        useCookie('auth_token', { maxAge: 60 * 60 * 24, sameSite: 'lax', secure, path: '/' }).value = data.access
        console.debug('[auth] refreshTokens success, new access stored')
        return data.access
      } catch (error) {
        try { console.debug('[auth] refreshTokens failed, logging out', { error: String(error) }) } catch (e) {}
        this.logout()
        return null
      }
    },

    async fetchMyStores(): Promise<StoreLite[]> {
      if (!this.token) {
        this.restoreFromCookies()
      }
      if (!this.token) return []
      const config = useRuntimeConfig()
      try {
        return await $fetch<StoreLite[]>(`${config.public.apiBase}/stores/mine/`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
      } catch (error: any) {
        const code = error?.response?._data?.code
        if (code === 'token_not_valid' && this.refreshToken) {
          const refreshed = await this.refreshTokens()
          if (refreshed) {
            try {
              return await $fetch<StoreLite[]>(`${config.public.apiBase}/stores/mine/`, {
                headers: { Authorization: `Bearer ${refreshed}` },
              })
            } catch (e) {
              console.error('Reintento falló al cargar tus tiendas', e)
            }
          }
        }
        console.error('No pudimos cargar tus tiendas', error)
        return []
      }
    },

    logout(options?: { redirectTo?: string }) {
      // Decide destino antes de limpiar el estado para no perder el slug
      const fallbackSlug = this.user?.memberships?.[0]?.store?.slug
      const redirect = options?.redirectTo
        ? options.redirectTo
        : fallbackSlug
          ? `/store/${fallbackSlug}/admin/login`
          : '/'

      this.token = null
      this.refreshToken = null
      this.user = null
      this.initialized = true
      const secure = process.env.NODE_ENV === 'production'
      useCookie('auth_token', { secure, path: '/' }).value = null
      useCookie('refresh_token', { secure, path: '/' }).value = null

      navigateTo(redirect)
    },
  },
})