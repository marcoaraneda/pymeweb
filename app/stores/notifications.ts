import { defineStore } from 'pinia'

export type NotificationFeedItem = {
  id: string
  type: string
  message: string
  created_at: string | Date
  store?: string | null
  meta?: Record<string, any>
  read?: boolean
}

const READ_KEY = 'notification-read-ids'

const stableNotificationId = (item: { id?: string; type?: string; message?: string; store?: string | null }, index: number) => {
  if (item?.id) return String(item.id)
  const type = String(item?.type || 'notification').trim().toLowerCase()
  const message = String(item?.message || '').trim().toLowerCase()
  const store = String(item?.store || 'global').trim().toLowerCase()
  return `summary-${type}-${store}-${message}-${index}`
}

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    feed: [] as NotificationFeedItem[],
    readIds: new Set<string>(),
  }),
  getters: {
    unread: (state) => state.feed.filter((n) => !state.readIds.has(n.id)),
    history: (state) => state.feed.filter((n) => state.readIds.has(n.id)),
    totalUnread: (state) => state.feed.filter((n) => !state.readIds.has(n.id)).length,
    types: (state) => Array.from(new Set(state.feed.map((n) => n.type))).sort(),
  },
  actions: {
    // Compat: antiguo loadHistory
    loadHistory() {
      this.loadReadIds()
    },
    loadReadIds() {
      if (!process.client) return
      try {
        const raw = localStorage.getItem(READ_KEY)
        if (raw) {
          this.readIds = new Set<string>(JSON.parse(raw))
        }
      } catch (error) {
        console.warn('No se pudieron cargar notificaciones leídas', error)
        this.readIds = new Set()
      }
    },
    saveReadIds() {
      if (!process.client) return
      localStorage.setItem(READ_KEY, JSON.stringify(Array.from(this.readIds)))
    },
    // Compat: antiguo setUnread -> generar feed con IDs artificiales
    setUnread(items: NotificationFeedItem[] | { type: string; message: string; count?: number }[]) {
      const now = new Date().toISOString()
      const normalized: NotificationFeedItem[] = (items || []).map((n, idx) => ({
        id: stableNotificationId(n as any, idx),
        type: (n as any).type,
        message: (n as any).message,
        created_at: now,
        store: (n as any).store,
        meta: { count: (n as any).count },
      }))
      this.setFeed(normalized)
    },
    // Compat: antiguo clearHistory
    clearHistory() {
      this.dismissAll()
    },
    setFeed(items: NotificationFeedItem[]) {
      this.feed = (items || []).map((item) => ({ ...item, read: this.readIds.has(item.id) }))
    },
    markRead(id: string) {
      if (!id) return
      this.readIds.add(id)
      this.saveReadIds()
      this.feed = this.feed.map((n) => (n.id === id ? { ...n, read: true } : n))
    },
    markAllRead() {
      this.feed.forEach((n) => this.readIds.add(n.id))
      this.saveReadIds()
      this.feed = this.feed.map((n) => ({ ...n, read: true }))
    },
    dismissAll() {
      this.markAllRead()
      this.feed = []
    },
    clearAll() {
      this.dismissAll()
    },
  },
})
