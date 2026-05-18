import { defineStore } from 'pinia'

export type NotificationFeedItem = {
  id: string | number
  title?: string
  message?: string
  read?: boolean
  created_at?: string
  [key: string]: any
}

export const useNotificationStore = defineStore('notifications', () => {
  const items = ref<NotificationFeedItem[]>([])

  const unreadCount = computed(() => items.value.filter((item) => !item.read).length)

  const setItems = (nextItems: NotificationFeedItem[]) => {
    items.value = Array.isArray(nextItems) ? nextItems : []
  }

  const markAllAsRead = () => {
    items.value = items.value.map((item) => ({ ...item, read: true }))
  }

  const addNotification = (notification: NotificationFeedItem) => {
    items.value = [notification, ...items.value]
  }

  return {
    items,
    unreadCount,
    setItems,
    markAllAsRead,
    addNotification,
  }
})