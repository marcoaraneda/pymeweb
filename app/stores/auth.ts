import { defineStore } from 'pinia'

type StoreListItem = Record<string, any>

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('pymeweb_token', {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })

  const user = ref<Record<string, any> | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value))

  const setToken = (value: string | null) => {
    token.value = value

    if (process.client) {
      if (value) {
        localStorage.setItem('pymeweb_token', value)
      } else {
        localStorage.removeItem('pymeweb_token')
      }
    }
  }

  const initializeSession = async () => {
    if (token.value) return token.value

    if (process.client) {
      const storedToken = localStorage.getItem('pymeweb_token')
      if (storedToken) {
        token.value = storedToken
      }
    }

    return token.value
  }

  const fetchMyStores = async (): Promise<StoreListItem[]> => {
    if (!token.value) return []

    const config = useRuntimeConfig()
    try {
      return await $fetch<StoreListItem[]>(`${config.public.apiBase}/stores/mine/`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })
    } catch {
      return []
    }
  }

  const logout = () => {
    setToken(null)
    user.value = null
  }

  return {
    token,
    user,
    isAuthenticated,
    initializeSession,
    fetchMyStores,
    logout,
    setToken,
  }
})