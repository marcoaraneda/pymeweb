import { defineStore } from 'pinia'

type CartContext = string

export const useCartStore = defineStore('cart', () => {
  const context = ref<CartContext>('marketplace')
  const items = ref<Record<string, any>[]>([])

  const setContext = (value: CartContext) => {
    context.value = value || 'marketplace'
  }

  const addProduct = (product: Record<string, any>) => {
    if (!product) return

    const productId = product.id ?? product.slug
    if (productId === undefined || productId === null) return

    const existing = items.value.find((item) => (item.id ?? item.slug) === productId)
    if (existing) {
      existing.quantity = Number(existing.quantity || 1) + 1
      return
    }

    items.value.push({
      ...product,
      quantity: 1,
      context: context.value,
    })
  }

  return {
    context,
    items,
    setContext,
    addProduct,
  }
})