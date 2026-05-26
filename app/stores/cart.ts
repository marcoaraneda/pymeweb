import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[],
  }),

  getters: {
    totalItems: (state) =>
      state.items.reduce((acc, item) => acc + item.quantity, 0),

    totalPrice: (state) =>
      state.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
  },

  actions: {
    addProduct(product: any) {
      const existing = this.items.find(
        (item) => item.id === product.id
      )

      if (existing) {
        existing.quantity++
      } else {
        this.items.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          image: product.images?.[0]?.image || null,
          quantity: 1,
        })
      }

      this.saveToStorage()
    },

    removeProduct(productId: number) {
      this.items = this.items.filter(
        (item) => item.id !== productId
      )
      this.saveToStorage()
    },

    updateQuantity(productId: number, qty: number) {
      const item = this.items.find((i) => i.id === productId)
      if (!item) return

      item.quantity = qty <= 0 ? 1 : qty
      this.saveToStorage()
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem(
          'cart',
          JSON.stringify(this.items)
        )
      }
    },

    loadFromStorage() {
      if (process.client) {
        const stored = localStorage.getItem('cart')
        if (stored) {
          this.items = JSON.parse(stored)
        }
      }
    },
  },
})
