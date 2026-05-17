import { defineStore } from 'pinia';

const stableNotificationId = (item, index) => {
  if (item?.id) return String(item.id);
  const type = String(item?.type || "notification").trim().toLowerCase();
  const message = String(item?.message || "").trim().toLowerCase();
  const store = String(item?.store || "global").trim().toLowerCase();
  return `summary-${type}-${store}-${message}-${index}`;
};
const useNotificationStore = defineStore("notifications", {
  state: () => ({
    feed: [],
    readIds: /* @__PURE__ */ new Set()
  }),
  getters: {
    unread: (state) => state.feed.filter((n) => !state.readIds.has(n.id)),
    history: (state) => state.feed.filter((n) => state.readIds.has(n.id)),
    totalUnread: (state) => state.feed.filter((n) => !state.readIds.has(n.id)).length,
    types: (state) => Array.from(new Set(state.feed.map((n) => n.type))).sort()
  },
  actions: {
    // Compat: antiguo loadHistory
    loadHistory() {
      this.loadReadIds();
    },
    loadReadIds() {
      return;
    },
    saveReadIds() {
      return;
    },
    // Compat: antiguo setUnread -> generar feed con IDs artificiales
    setUnread(items) {
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const normalized = (items || []).map((n, idx) => ({
        id: stableNotificationId(n, idx),
        type: n.type,
        message: n.message,
        created_at: now,
        store: n.store,
        meta: { count: n.count }
      }));
      this.setFeed(normalized);
    },
    // Compat: antiguo clearHistory
    clearHistory() {
      this.dismissAll();
    },
    setFeed(items) {
      this.feed = (items || []).map((item) => ({ ...item, read: this.readIds.has(item.id) }));
    },
    markRead(id) {
      if (!id) return;
      this.readIds.add(id);
      this.saveReadIds();
      this.feed = this.feed.map((n) => n.id === id ? { ...n, read: true } : n);
    },
    markAllRead() {
      this.feed.forEach((n) => this.readIds.add(n.id));
      this.saveReadIds();
      this.feed = this.feed.map((n) => ({ ...n, read: true }));
    },
    dismissAll() {
      this.markAllRead();
      this.feed = [];
    },
    clearAll() {
      this.dismissAll();
    }
  }
});

export { useNotificationStore as u };
//# sourceMappingURL=notifications-Bf4qERDu.mjs.map
