import { useCartStore } from '~/stores/cart'
import { defineNuxtPlugin, useRouter } from '#app'

export default defineNuxtPlugin(() => {
  if (!process.client) return

  const cart = useCartStore()
  const router = useRouter()

  // Load once on boot
  cart.loadFromStorage()

  const ensureMarketplaceContext = () => {
    cart.setContext('marketplace')
  }

  // On initial load, if already on marketplace routes, set context
  if (router.currentRoute.value.path.startsWith('/marketplace')) {
    ensureMarketplaceContext()
  }

  router.afterEach((to) => {
    if (to.path.startsWith('/marketplace')) {
      cart.loadFromStorage()
      ensureMarketplaceContext()
    }
  })
})
