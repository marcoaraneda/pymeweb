import { navigateTo, useCookie, useRuntimeConfig } from 'nuxt/app'
import { defineStore } from 'pinia'

type Credentials = { username: string; password: string }
type SignupPayload = { username: string; email: string; password: string; first_name?: string; last_name?: string }
type StoreLite = { id: number; name: string; slug: string }
type UserProfile = {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string | null
  is_staff?: boolean
  memberships?: Array<{ store: StoreLite; roles: string[] }>
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    refreshToken: null as string | null,
    user: null as any | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },

  actions: {
    restoreFromCookies() {
      const tokenCookie = useCookie<string | null>('auth_token')
      const refreshCookie = useCookie<string | null>('refresh_token')
      this.token = tokenCookie.value || null
      this.refreshToken = refreshCookie.value || null
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

        useCookie('auth_token', { maxAge: 60 * 60 * 24, sameSite: 'lax' }).value = data.access
        useCookie('refresh_token', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' }).value = data.refresh

        await this.fetchProfile()
      } catch (error: any) {
        const detail = error?.response?._data?.detail || 'No pudimos iniciar sesión'
        this.error = detail
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

        useCookie('auth_token', { maxAge: 60 * 60 * 24, sameSite: 'lax' }).value = data.access
        useCookie('refresh_token', { maxAge: 60 * 60 * 24 * 7, sameSite: 'lax' }).value = data.refresh
      } catch (error: any) {
        const detail = error?.response?._data?.detail || error?.response?._data || 'No pudimos registrar tu cuenta'
        this.error = detail
        throw new Error(detail)
      } finally {
        this.loading = false
      }
    },

    async fetchProfile(): Promise<UserProfile | null> {
      if (!this.token) return null
      const config = useRuntimeConfig()

      try {
        const profile = await $fetch<UserProfile>(`${config.public.apiBase}/users/me/`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        this.user = profile
        return profile
      } catch (error: any) {
        const detail = error?.response?._data?.detail || 'No pudimos cargar tu perfil'
        this.error = detail
        return null
      }
    },

    async fetchMyStores(): Promise<StoreLite[]> {
      if (!this.token) return []
      const config = useRuntimeConfig()
      try {
        return await $fetch<StoreLite[]>(`${config.public.apiBase}/stores/mine/`, {
          headers: { Authorization: `Bearer ${this.token}` },
        })
      } catch (error) {
        console.error('No pudimos cargar tus tiendas', error)
        return []
      }
    },

    logout() {
      this.token = null
      this.refreshToken = null
      this.user = null
      useCookie('auth_token').value = null
      useCookie('refresh_token').value = null
      navigateTo('/')
    },
  },
})