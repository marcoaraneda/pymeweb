import { b as useAuthStore, a as useRuntimeConfig, c as __nuxt_component_1 } from './server.mjs';
import { defineComponent, computed, ref, watch, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import { u as useDashboardAccess } from './useDashboardAccess-C0pUNvlL.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const MARKETPLACE_SCOPE = "marketplace";
const pendingPageSize = 6;
const deliveredPageSize = 10;
const marketplaceSubmissionsPageSize = 8;
const reviewsPageSize = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const theme = useThemeStore();
    const route = useRoute();
    computed(() => route.path === "/dashboard");
    useDashboardAccess();
    const storesMine = ref([]);
    const selectedStore = ref("");
    ref(true);
    ref("");
    const toast = ref(null);
    let toastTimer = null;
    const topProducts = ref([]);
    const topLoading = ref(true);
    const orders = ref([]);
    const ordersLoading = ref(true);
    const pendingPage = ref(1);
    const deliveredPage = ref(1);
    const config = useRuntimeConfig();
    const apiBase = String(config.public.apiBase || "");
    ref(false);
    const marketplaceSubmissions = ref([]);
    const loadingMarketplaceSubmissions = ref(false);
    const marketplaceSellerProfile = ref(null);
    const loadingMarketplaceSellerProfile = ref(false);
    const marketplaceStatusFilter = ref("");
    const marketplaceSubmissionsPage = ref(1);
    const marketplaceStatusOptions = [
      { value: "preparing", label: "Preparando" },
      { value: "shipping", label: "Enviándose" },
      { value: "in_transit", label: "En tránsito" },
      { value: "completed", label: "Finalizado" }
    ];
    const statusOptions = [
      { value: "pending", label: "Pendiente" },
      { value: "preparing", label: "Preparando" },
      { value: "in_transit", label: "En tránsito" },
      { value: "delivered", label: "Listo / Entregado" },
      { value: "completed", label: "Finalizado" },
      { value: "cancelled", label: "Cancelado" }
    ];
    const authedFetch = async (url, options = {}) => {
      if (!auth.token) throw new Error("No autenticado");
      const doFetch = (token) => $fetch(url, {
        ...options,
        headers: {
          ...options.headers || {},
          Authorization: `Bearer ${token}`
        }
      });
      try {
        return await doFetch(auth.token);
      } catch (error) {
        const code = error?.response?._data?.code;
        if (code === "token_not_valid" && auth.refreshToken) {
          const refreshed = await auth.refreshTokens();
          if (refreshed) return doFetch(refreshed);
        }
        throw error;
      }
    };
    const analytics = ref({ totalOrders: 0, paidOrders: 0, revenue: 0, avgTicket: 0 });
    const statsLoading = ref(true);
    const dailyStats = ref([]);
    const dailyLoading = ref(true);
    computed(() => {
      const values = dailyStats.value.map((d) => Number(d.revenue) || Number(d.orders) || 0);
      if (!values.length) return [];
      const max = Math.max(...values, 1);
      return values.map((v) => 24 + Math.round(v / max * 120));
    });
    const showToast = (text, type = "success") => {
      toast.value = { text, type };
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.value = null, 3200);
    };
    const tickets = ref([]);
    const reportTickets = ref([]);
    const loadingTickets = ref(true);
    ref(null);
    ref(false);
    ref(null);
    ref(false);
    ref("open");
    ref("normal");
    ref("");
    ref(false);
    const recentReviews = ref([]);
    const loadingReviews = ref(false);
    const reviewsPage = ref(1);
    const isMarketplaceSelected = computed(() => selectedStore.value === MARKETPLACE_SCOPE);
    const hasPhysicalStoreSelected = computed(() => Boolean(selectedStore.value) && !isMarketplaceSelected.value);
    computed(() => {
      const items = marketplaceSubmissions.value || [];
      const completed = items.filter((item) => String(item.marketplace_status || "preparing") === "completed").length;
      const inProgress = items.filter((item) => ["preparing", "shipping", "in_transit"].includes(String(item.marketplace_status || "preparing"))).length;
      const estimatedValue = items.reduce((total, item) => {
        const unitPrice = Number(item.offer_price || item.price || 0);
        const stock = Math.max(1, Number(item.stock_available || 0));
        return total + unitPrice * stock;
      }, 0);
      return {
        total: items.length,
        completed,
        inProgress,
        estimatedValue
      };
    });
    computed(() => {
      const summary = marketplaceSellerProfile.value?.sales_summary || {};
      return {
        totalOrders: Number(summary.total_orders || 0),
        totalUnits: Number(summary.total_units || 0),
        grossSales: Number(summary.gross_sales || 0),
        inProgressOrders: Number(summary.in_progress_orders || 0)
      };
    });
    const storeTrendSeries = computed(() => dailyStats.value.slice(-10));
    computed(() => {
      if (!storeTrendSeries.value.length) return 1;
      return Math.max(...storeTrendSeries.value.map((item) => Number(item.revenue || 0)), 1);
    });
    const orderStatusPalette = {
      pending: "#f59e0b",
      preparing: "#f97316",
      in_transit: "#0ea5e9",
      delivered: "#22c55e",
      completed: "#10b981",
      paid: "#14b8a6",
      cancelled: "#ef4444"
    };
    computed(() => {
      const total = Math.max(orders.value.length, 1);
      const grouped = statusOptions.map((option) => {
        const count = orders.value.filter((order) => String(order.status) === option.value).length;
        const percent = Math.round(count / total * 100);
        return {
          value: option.value,
          label: option.label,
          count,
          percent,
          color: orderStatusPalette[option.value] || theme.accent
        };
      }).filter((item) => item.count > 0);
      return grouped;
    });
    const marketplaceStatusPalette = {
      preparing: "#f59e0b",
      shipping: "#0ea5e9",
      in_transit: "#3b82f6",
      completed: "#10b981"
    };
    computed(() => {
      const total = Math.max(marketplaceSubmissions.value.length, 1);
      return marketplaceStatusOptions.map((option) => {
        const count = marketplaceSubmissions.value.filter((item) => String(item.marketplace_status || "preparing") === option.value).length;
        return {
          value: option.value,
          label: option.label,
          count,
          percent: Math.round(count / total * 100),
          color: marketplaceStatusPalette[option.value] || "#f59e0b"
        };
      });
    });
    const marketplaceRecentSeries = computed(() => {
      const days = [];
      for (let offset = 6; offset >= 0; offset -= 1) {
        const date = /* @__PURE__ */ new Date();
        date.setDate(date.getDate() - offset);
        const day = date.toISOString().slice(0, 10);
        days.push({ day, count: 0 });
      }
      const byDay = new Map(days.map((row) => [row.day, row]));
      marketplaceSubmissions.value.forEach((item) => {
        const dateSource = item.created_at || item.updated_at;
        if (!dateSource) return;
        const day = String(dateSource).slice(0, 10);
        const row = byDay.get(day);
        if (row) row.count += 1;
      });
      return days;
    });
    computed(() => {
      if (!marketplaceRecentSeries.value.length) return 1;
      return Math.max(...marketplaceRecentSeries.value.map((row) => row.count), 1);
    });
    computed(() => {
      const last7 = dailyStats.value.slice(-7);
      const orders7d = last7.reduce((acc, day) => acc + Number(day.orders || 0), 0);
      const revenue7d = last7.reduce((acc, day) => acc + Number(day.revenue || 0), 0);
      const bestDay = [...last7].sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))[0];
      const conversionRate = analytics.value.totalOrders ? Math.round(Number(analytics.value.paidOrders || 0) / Number(analytics.value.totalOrders || 1) * 100) : 0;
      return {
        orders7d,
        revenue7d,
        conversionRate,
        avgTicket: Number(analytics.value.avgTicket || 0),
        bestDayLabel: bestDay ? `${formatShortDate(bestDay.day)} (${currency(bestDay.revenue)})` : "Sin datos",
        updatedAt: (/* @__PURE__ */ new Date()).toLocaleString()
      };
    });
    const pendingOrders = computed(() => orders.value.filter((o) => ["pending", "preparing", "in_transit"].includes(o.status)));
    const deliveredOrders = computed(() => orders.value.filter((o) => ["completed", "delivered", "paid"].includes(o.status)));
    computed(() => Math.max(1, Math.ceil(pendingOrders.value.length / pendingPageSize)));
    computed(() => Math.max(1, Math.ceil(deliveredOrders.value.length / deliveredPageSize)));
    const reviewsTotalPages = computed(() => Math.max(1, Math.ceil(recentReviews.value.length / reviewsPageSize)));
    computed(() => {
      const start = (pendingPage.value - 1) * pendingPageSize;
      return pendingOrders.value.slice(start, start + pendingPageSize);
    });
    computed(() => {
      const start = (deliveredPage.value - 1) * deliveredPageSize;
      return deliveredOrders.value.slice(start, start + deliveredPageSize);
    });
    computed(() => {
      const start = (reviewsPage.value - 1) * reviewsPageSize;
      return recentReviews.value.slice(start, start + reviewsPageSize);
    });
    computed(() => ({
      open: tickets.value.filter((ticket) => ticket.status === "open").length,
      inProgress: tickets.value.filter((ticket) => ticket.status === "in_progress").length,
      resolved: tickets.value.filter((ticket) => ticket.status === "resolved").length
    }));
    computed(() => ({
      open: reportTickets.value.filter((ticket) => ticket.status === "open").length,
      inProgress: reportTickets.value.filter((ticket) => ticket.status === "in_progress").length,
      done: reportTickets.value.filter((ticket) => ["resolved", "closed"].includes(ticket.status)).length
    }));
    const filteredMarketplaceSubmissions = computed(() => {
      if (!marketplaceStatusFilter.value) return marketplaceSubmissions.value;
      return marketplaceSubmissions.value.filter((item) => String(item.marketplace_status || "preparing") === marketplaceStatusFilter.value);
    });
    const marketplaceSubmissionsTotalPages = computed(
      () => Math.max(1, Math.ceil(filteredMarketplaceSubmissions.value.length / marketplaceSubmissionsPageSize))
    );
    computed(() => {
      const start = (marketplaceSubmissionsPage.value - 1) * marketplaceSubmissionsPageSize;
      return filteredMarketplaceSubmissions.value.slice(start, start + marketplaceSubmissionsPageSize);
    });
    const currency = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(Number(value) || 0);
    const formatShortDate = (value) => {
      if (!value) return "—";
      const date = new Date(value);
      return date.toLocaleDateString("es-CL", { day: "2-digit", month: "short" });
    };
    const loadMarketplaceSubmissions = async () => {
      if (!auth.token) {
        marketplaceSubmissions.value = [];
        return;
      }
      loadingMarketplaceSubmissions.value = true;
      try {
        marketplaceSubmissions.value = await authedFetch(`${apiBase}/marketplace/submissions/`);
        marketplaceSubmissionsPage.value = 1;
      } catch (error) {
        console.warn("No se pudieron cargar productos marketplace", error);
        marketplaceSubmissions.value = [];
      } finally {
        loadingMarketplaceSubmissions.value = false;
      }
    };
    const loadMarketplaceSellerProfile = async () => {
      const userId = auth.user?.id;
      if (!userId) {
        marketplaceSellerProfile.value = null;
        return;
      }
      loadingMarketplaceSellerProfile.value = true;
      try {
        marketplaceSellerProfile.value = await $fetch(`${apiBase}/marketplace/sellers/${userId}/`);
      } catch (error) {
        console.warn("No se pudo cargar perfil marketplace para dashboard", error);
        marketplaceSellerProfile.value = null;
      } finally {
        loadingMarketplaceSellerProfile.value = false;
      }
    };
    const rebuildTopProductsFromOrders = (ordersList) => {
      const aggregated = {};
      ordersList.forEach((order) => {
        const storeSlug = order.store_slug || order.store?.slug || "tienda";
        (order.items || []).forEach((item) => {
          const key = `${storeSlug}-${item.product}`;
          const qty = Number(item.quantity) || 0;
          const revenue = (Number(item.price) || 0) * qty;
          if (!aggregated[key]) {
            aggregated[key] = {
              id: item.product,
              name: item.product_name || `Producto ${item.product}`,
              store_slug: storeSlug,
              total_quantity: 0,
              revenue: 0
            };
          }
          aggregated[key].total_quantity += qty;
          aggregated[key].revenue = Number((aggregated[key].revenue || 0) + revenue);
        });
      });
      topProducts.value = Object.values(aggregated).sort((a, b) => (b.total_quantity || 0) - (a.total_quantity || 0)).slice(0, 10);
    };
    const loadOrders = async () => {
      ordersLoading.value = true;
      topLoading.value = true;
      orders.value = [];
      if (!auth.token || !storesMine.value.length || !hasPhysicalStoreSelected.value) {
        ordersLoading.value = false;
        return;
      }
      const targetSlugs = [selectedStore.value];
      try {
        const collected = [];
        for (const slug of targetSlugs) {
          const list = await authedFetch(`${apiBase}/orders/`, { params: { store: slug } }).catch(() => []);
          const detailedIds = list.slice(0, 12).map((o) => o.id);
          const details = await Promise.all(
            detailedIds.map((id) => authedFetch(`${apiBase}/orders/${id}/`).catch(() => null))
          );
          const detailMap = /* @__PURE__ */ new Map();
          details.forEach((d) => {
            if (d?.id) detailMap.set(d.id, d);
          });
          list.forEach((o) => {
            const enriched = detailMap.get(o.id);
            collected.push({ ...o, ...enriched || {}, store_slug: slug });
          });
        }
        orders.value = collected.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
        pendingPage.value = 1;
        deliveredPage.value = 1;
        rebuildTopProductsFromOrders(orders.value);
        topLoading.value = false;
      } catch (error) {
        console.warn("No se pudieron cargar pedidos");
      } finally {
        ordersLoading.value = false;
      }
    };
    const loadTickets = async () => {
      loadingTickets.value = true;
      tickets.value = [];
      if (!auth.token || !hasPhysicalStoreSelected.value) {
        loadingTickets.value = false;
        return;
      }
      const params = { status: "open", store: selectedStore.value, kind: "support" };
      try {
        tickets.value = await authedFetch(`${apiBase}/support/tickets/`, { params });
      } catch (error) {
        console.warn("No se pudieron cargar tickets", error);
        tickets.value = [];
      } finally {
        loadingTickets.value = false;
      }
    };
    const loadReportTickets = async () => {
      reportTickets.value = [];
      if (!auth.token || !hasPhysicalStoreSelected.value) return;
      const params = { kind: "report", store: selectedStore.value };
      try {
        reportTickets.value = await authedFetch(`${apiBase}/support/tickets/`, { params });
      } catch (error) {
        console.warn("No se pudieron cargar denuncias", error);
        reportTickets.value = [];
      }
    };
    const loadRecentReviews = async (notify = false) => {
      if (!auth.token) {
        recentReviews.value = [];
        return false;
      }
      loadingReviews.value = true;
      let success = false;
      try {
        if (isMarketplaceSelected.value) {
          const feed = await authedFetch(`${apiBase}/support/notifications/feed/`).catch(() => ({ results: [] }));
          const rows = Array.isArray(feed?.results) ? feed.results : [];
          recentReviews.value = rows.filter((item) => item?.type === "review_new").map((item, idx) => ({
            id: item.id || `review-marketplace-${idx}`,
            rating: Number(item?.meta?.rating || 0),
            comment: String(item?.message || "Comentario marketplace"),
            customer_name: "Cliente",
            created_at: String(item?.created_at || (/* @__PURE__ */ new Date()).toISOString()),
            store_slug: String(item?.store || "marketplace"),
            product: item?.meta?.product,
            status: item?.meta?.status
          }));
          success = true;
        } else {
          const targetSlugs = [selectedStore.value];
          const aggregated = [];
          for (const slug of targetSlugs) {
            const rows = await authedFetch(`${apiBase}/store/${slug}/admin/resenas/reviews/`, { params: {} }).catch(() => []);
            rows.forEach((r) => aggregated.push({ ...r, store_slug: slug }));
          }
          aggregated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          recentReviews.value = aggregated.slice(0, 12);
          success = true;
        }
      } catch (error) {
        console.warn("No se pudieron cargar reseñas", error);
        recentReviews.value = [];
      } finally {
        loadingReviews.value = false;
        if (notify) {
          showToast(success ? "Reseñas actualizadas" : "No se pudieron cargar reseñas", success ? "success" : "error");
        }
      }
      return success;
    };
    const loadSummary = async () => {
      if (!auth.token) return false;
      if (!hasPhysicalStoreSelected.value) return false;
      statsLoading.value = true;
      let success = false;
      try {
        const targetSlugs = [selectedStore.value];
        let totalOrders = 0;
        let paidOrders = 0;
        let revenue = 0;
        let avgTicketSum = 0;
        let avgCount = 0;
        for (const slug of targetSlugs) {
          const summary = await authedFetch(`${apiBase}/store/${slug}/admin/reportes/orders/summary/`, { params: {} }).catch(() => null);
          if (summary) {
            totalOrders += Number(summary.total_orders || 0);
            paidOrders += Number(summary.paid_orders || 0);
            revenue += Number(summary.total_revenue || 0);
            if (summary.avg_ticket) {
              avgTicketSum += Number(summary.avg_ticket);
              avgCount += 1;
            }
          }
        }
        analytics.value = {
          totalOrders,
          paidOrders,
          revenue,
          avgTicket: avgCount ? avgTicketSum / avgCount : 0
        };
        success = true;
      } catch (error) {
        console.warn("No se pudo cargar el resumen", error);
      } finally {
        statsLoading.value = false;
      }
      return success;
    };
    const loadDailyStats = async () => {
      if (!auth.token) return false;
      if (!hasPhysicalStoreSelected.value) return false;
      dailyLoading.value = true;
      const aggregated = {};
      try {
        const targetSlugs = [selectedStore.value];
        for (const slug of targetSlugs) {
          const rows = await authedFetch(`${apiBase}/store/${slug}/admin/reportes/orders/daily/`, { params: {} }).catch(() => []);
          rows.forEach((row) => {
            const day = row.day;
            if (!aggregated[day]) aggregated[day] = { orders: 0, revenue: 0 };
            aggregated[day].orders += Number(row.orders_count || 0);
            aggregated[day].revenue += Number(row.revenue || 0);
          });
        }
        dailyStats.value = Object.entries(aggregated).map(([day, vals]) => ({ day, orders: vals.orders, revenue: vals.revenue })).sort((a, b) => a.day > b.day ? 1 : -1);
      } catch (error) {
        console.warn("No se pudieron cargar métricas diarias", error);
      } finally {
        dailyLoading.value = false;
      }
      return Boolean(dailyStats.value.length);
    };
    watch(selectedStore, async () => {
      if (!selectedStore.value) return;
      pendingPage.value = 1;
      deliveredPage.value = 1;
      reviewsPage.value = 1;
      if (isMarketplaceSelected.value) {
        await Promise.all([loadMarketplaceSubmissions(), loadMarketplaceSellerProfile(), loadRecentReviews()]);
      } else {
        await Promise.all([loadOrders(), loadSummary(), loadDailyStats(), loadRecentReviews(), loadTickets(), loadReportTickets(), loadMarketplaceSubmissions(), loadMarketplaceSellerProfile()]);
      }
    });
    watch(marketplaceStatusFilter, () => {
      marketplaceSubmissionsPage.value = 1;
    });
    watch(filteredMarketplaceSubmissions, () => {
      if (marketplaceSubmissionsPage.value > marketplaceSubmissionsTotalPages.value) {
        marketplaceSubmissionsPage.value = marketplaceSubmissionsTotalPages.value;
      }
    });
    watch(recentReviews, () => {
      if (reviewsPage.value > reviewsTotalPages.value) reviewsPage.value = reviewsTotalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=dashboard-CpnXbQ5R.mjs.map
