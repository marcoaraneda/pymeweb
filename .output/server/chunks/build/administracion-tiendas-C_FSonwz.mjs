import { defineComponent, ref, reactive, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { b as useAuthStore } from './server.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
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
import 'vue-router';

const reportedMarketplacePerPage = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "administracion-tiendas",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const theme = useThemeStore();
    const loading = ref(false);
    const error = ref("");
    const platformApiAvailable = ref(true);
    const stores = ref([]);
    const summary = reactive({
      stores_total: 0,
      stores_active: 0,
      stores_inactive: 0,
      reported_stores: 0,
      reports_total: 0,
      reports_open: 0,
      pending_orders: 0,
      new_orders_24h: 0,
      tickets_updated_24h: 0,
      pending_products: 0
    });
    const pagination = reactive({
      page: 1,
      page_size: 12,
      total: 0,
      total_pages: 1,
      state: "all",
      search: "",
      ordering: "created_at",
      ordering_dir: "desc"
    });
    const topStores = ref([]);
    const reportedStores = ref([]);
    const reportTickets = ref([]);
    const reportStatusFilter = ref("all");
    const reportSearch = ref("");
    const ticketDraftStatus = ref({});
    const ticketDraftResponse = ref({});
    const ticketUpdating = ref({});
    const stateLoading = ref({});
    const sellerStateLoading = ref({});
    const marketplaceSellers = ref([]);
    const reportedMarketplaceSearch = ref("");
    const reportedMarketplacePage = ref(1);
    const searchDraft = ref("");
    const showStoreDetail = ref(false);
    const selectedStore = ref(null);
    const showCreatorDetail = ref(false);
    const selectedCreator = ref(null);
    const showTicketDetail = ref(false);
    const selectedTicket = ref(null);
    const showSellerDetail = ref(false);
    const selectedSeller = ref(null);
    const selectedStoreReportVisible = ref(false);
    const selectedSellerReportVisible = ref(false);
    const stateOptions = [
      { value: "all", label: "Todas" },
      { value: "active", label: "Activas" },
      { value: "inactive", label: "Inactivas" }
    ];
    const reportStatusOptions = [
      { value: "all", label: "Todas" },
      { value: "open", label: "Abiertas" },
      { value: "in_progress", label: "En progreso" },
      { value: "resolved", label: "Resueltas" },
      { value: "closed", label: "Cerradas" }
    ];
    computed(() => auth.user?.username === "marko2blea");
    computed(() => auth.token ? { Authorization: `Bearer ${auth.token}` } : {});
    const filteredReportTickets = computed(() => {
      const statusFiltered = reportStatusFilter.value === "all" ? reportTickets.value : reportTickets.value.filter((ticket) => ticket.status === reportStatusFilter.value);
      const term = reportSearch.value.trim().toLowerCase();
      if (!term) return statusFiltered;
      return statusFiltered.filter(
        (ticket) => String(ticket.title || "").toLowerCase().includes(term) || String(ticket.description || "").toLowerCase().includes(term) || String(ticket.store_slug || "").toLowerCase().includes(term) || String(ticket.created_by_name || "").toLowerCase().includes(term)
      );
    });
    const formatDate = (value) => {
      if (!value) return "—";
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleString("es-CL");
    };
    const formatMoney = (value) => {
      const amount = Number(value || 0);
      return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(amount);
    };
    const sortIndicator = (field) => {
      if (pagination.ordering !== field) return "⇅";
      return pagination.ordering_dir === "asc" ? "↑" : "↓";
    };
    const selectedStoreReports = computed(() => {
      if (!selectedStore.value) return [];
      return reportTickets.value.filter((ticket) => ticket.store_slug === selectedStore.value?.slug);
    });
    const selectedSellerReports = computed(() => {
      if (!selectedSeller.value) return [];
      return reportTickets.value.filter((ticket) => ticket.store_slug === selectedSeller.value?.store_slug);
    });
    const reportedMarketplaceSellers = computed(() => marketplaceSellers.value.filter((seller) => seller.reports_total > 0));
    const filteredReportedMarketplaceSellers = computed(() => {
      const term = reportedMarketplaceSearch.value.trim().toLowerCase();
      const base = [...reportedMarketplaceSellers.value].sort((a, b) => {
        const diff = Number(b.reports_total || 0) - Number(a.reports_total || 0);
        if (diff !== 0) return diff;
        return String(a.username || "").localeCompare(String(b.username || ""));
      });
      if (!term) return base;
      return base.filter(
        (seller) => String(seller.username || "").toLowerCase().includes(term) || String(seller.email || "").toLowerCase().includes(term) || String(seller.store_slug || "").toLowerCase().includes(term)
      );
    });
    const reportedMarketplaceTotalPages = computed(() => Math.max(1, Math.ceil(filteredReportedMarketplaceSellers.value.length / reportedMarketplacePerPage)));
    const paginatedReportedMarketplaceSellers = computed(() => {
      const start = (reportedMarketplacePage.value - 1) * reportedMarketplacePerPage;
      return filteredReportedMarketplaceSellers.value.slice(start, start + reportedMarketplacePerPage);
    });
    watch(filteredReportedMarketplaceSellers, () => {
      if (reportedMarketplacePage.value > reportedMarketplaceTotalPages.value) {
        reportedMarketplacePage.value = reportedMarketplaceTotalPages.value;
      }
    });
    watch(reportedMarketplaceSearch, () => {
      reportedMarketplacePage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-950 text-white" }, _attrs))}><div class="mx-auto max-w-7xl space-y-8 px-6 py-10"><header class="flex flex-wrap items-end justify-between gap-4"><div><p class="text-xs uppercase tracking-[0.2em] text-white/60">Panel de administracion</p><h1 class="text-3xl font-extrabold">Supervision de tiendas y marketplace</h1><p class="text-sm text-white/70">Control operacional de tiendas, perfiles marketplace y denuncias.</p></div><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white" style="${ssrRenderStyle({ backgroundColor: unref(theme).accent })}"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(loading.value ? "Actualizando..." : "Actualizar")}</button></header>`);
      if (error.value) {
        _push(`<div class="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!platformApiAvailable.value) {
        _push(`<div class="rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100"> Modo compatibilidad activo: tu backend no expone endpoints platform de moderacion. El panel muestra datos disponibles y desactiva acciones no soportadas. </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Tiendas</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(summary.stores_total)}</p></article><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Activas</p><p class="mt-2 text-2xl font-bold text-emerald-200">${ssrInterpolate(summary.stores_active)}</p></article><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Inactivas</p><p class="mt-2 text-2xl font-bold text-amber-200">${ssrInterpolate(summary.stores_inactive)}</p></article><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Denuncias abiertas</p><p class="mt-2 text-2xl font-bold text-rose-200">${ssrInterpolate(summary.reports_open)}</p></article></section><section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Pedidos pendientes</p><p class="mt-2 text-2xl font-bold text-amber-200">${ssrInterpolate(summary.pending_orders)}</p></article><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Pedidos nuevos (24h)</p><p class="mt-2 text-2xl font-bold text-sky-200">${ssrInterpolate(summary.new_orders_24h)}</p></article><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Tickets actualizados (24h)</p><p class="mt-2 text-2xl font-bold text-indigo-200">${ssrInterpolate(summary.tickets_updated_24h)}</p></article><article class="rounded-2xl border border-white/10 bg-white/5 p-4"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Productos pendientes</p><p class="mt-2 text-2xl font-bold text-emerald-200">${ssrInterpolate(summary.pending_products)}</p></article></section><section class="grid gap-4 lg:grid-cols-2"><article class="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 class="text-lg font-semibold">Top tiendas</h2><p class="text-xs text-white/60">Ordenadas por ingresos y pedidos finalizados.</p><div class="mt-4 space-y-2"><!--[-->`);
      ssrRenderList(topStores.value, (store) => {
        _push(`<div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><button class="text-left font-semibold hover:underline">${ssrInterpolate(store.name)}</button><p class="text-xs text-white/70">Ingresos: ${ssrInterpolate(formatMoney(store.revenue_total))} · Finalizados: ${ssrInterpolate(store.completed_orders)}</p></div>`);
      });
      _push(`<!--]-->`);
      if (!topStores.value.length) {
        _push(`<p class="text-sm text-white/70">Sin datos todavia.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></article><article class="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 class="text-lg font-semibold">Tiendas denunciadas</h2><p class="text-xs text-white/60">Con al menos una denuncia registrada en soporte.</p><div class="mt-4 space-y-2"><!--[-->`);
      ssrRenderList(reportedStores.value, (store) => {
        _push(`<div class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"><button class="text-left font-semibold hover:underline">${ssrInterpolate(store.name)}</button><p class="text-xs text-white/70">Denuncias: ${ssrInterpolate(store.reports_total)} · Abiertas: ${ssrInterpolate(store.reports_open)}</p></div>`);
      });
      _push(`<!--]-->`);
      if (!reportedStores.value.length) {
        _push(`<p class="text-sm text-white/70">Sin denuncias por ahora.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></article></section><section class="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 class="text-lg font-semibold">Catastro completo de tiendas</h2><p class="text-xs text-white/60">Click en encabezados para ordenar, click en celdas para abrir detalle.</p><div class="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end"><label class="space-y-1"><span class="text-xs text-white/60">Buscar por nombre, slug o creador</span><input${ssrRenderAttr("value", searchDraft.value)} type="text" placeholder="Ej: lider, marketplace, marko2blea" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40"></label><div class="flex items-center gap-2"><button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10">Buscar</button><button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10">Limpiar</button></div></div><div class="mt-4 flex flex-wrap items-center gap-2"><!--[-->`);
      ssrRenderList(stateOptions, (option) => {
        _push(`<button class="${ssrRenderClass([pagination.state === option.value ? "bg-white text-slate-950" : "border border-white/15 bg-white/5 text-white/80 hover:border-white/30", "rounded-full px-3 py-1.5 text-xs font-semibold transition"])}">${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--><span class="ml-auto text-xs text-white/60">${ssrInterpolate(pagination.total)} tiendas · pagina ${ssrInterpolate(pagination.page)} de ${ssrInterpolate(pagination.total_pages)}</span></div><div class="mt-4 overflow-x-auto"><table class="min-w-full text-sm"><thead><tr class="border-b border-white/10 text-left text-white/60"><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Tienda <span>${ssrInterpolate(sortIndicator("name"))}</span></button></th><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Creador <span>${ssrInterpolate(sortIndicator("created_by_username"))}</span></button></th><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Creacion <span>${ssrInterpolate(sortIndicator("created_at"))}</span></button></th><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Tipo <span>${ssrInterpolate(sortIndicator("store_type"))}</span></button></th><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Contacto <span>${ssrInterpolate(sortIndicator("contact"))}</span></button></th><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Rendimiento <span>${ssrInterpolate(sortIndicator("revenue_total"))}</span></button></th><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Denuncias <span>${ssrInterpolate(sortIndicator("reports_total"))}</span></button></th><th class="px-3 py-2"><button class="inline-flex items-center gap-1 hover:text-white"> Estado <span>${ssrInterpolate(sortIndicator("is_active"))}</span></button></th><th class="px-3 py-2">Accion</th></tr></thead><tbody>`);
      if (!stores.value.length) {
        _push(`<tr><td colspan="9" class="px-3 py-6 text-center text-sm text-white/60">No hay tiendas para este filtro.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(stores.value, (store) => {
        _push(`<tr class="border-b border-white/5"><td class="px-3 py-3"><button class="text-left"><p class="font-semibold hover:underline">${ssrInterpolate(store.name)}</p><p class="text-xs text-white/60">/${ssrInterpolate(store.slug)}</p></button></td><td class="px-3 py-3 text-xs"><button class="hover:underline">${ssrInterpolate(store.created_by_username || "Sin registro")}</button></td><td class="px-3 py-3 text-xs"><button class="hover:underline">${ssrInterpolate(formatDate(store.created_at))}</button></td><td class="px-3 py-3 text-xs"><button class="hover:underline">${ssrInterpolate(store.store_type)}</button></td><td class="px-3 py-3 text-xs"><button class="text-left hover:underline"><p>${ssrInterpolate(store.contact_email || "Sin email")}</p><p>${ssrInterpolate(store.phone || store.whatsapp || "Sin telefono")}</p></button></td><td class="px-3 py-3 text-xs"><button class="text-left hover:underline"><p>${ssrInterpolate(formatMoney(store.revenue_total))}</p><p>Pedidos: ${ssrInterpolate(store.orders_total)}</p></button></td><td class="px-3 py-3 text-xs"><button class="hover:underline">${ssrInterpolate(store.reports_total)} (${ssrInterpolate(store.reports_open)} abiertas) </button></td><td class="px-3 py-3"><span class="${ssrRenderClass([store.is_active ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200", "rounded-full px-2 py-0.5 text-xs"])}">${ssrInterpolate(store.is_active ? "Activa" : "Inactiva")}</span></td><td class="px-3 py-3"><button class="rounded-lg border border-white/20 px-2 py-1 text-xs hover:border-white/50 disabled:opacity-50"${ssrIncludeBooleanAttr(!platformApiAvailable.value || Boolean(stateLoading.value[store.slug])) ? " disabled" : ""}>${ssrInterpolate(!platformApiAvailable.value ? "No disponible" : stateLoading.value[store.slug] ? "Guardando..." : store.is_active ? "Desactivar" : "Activar")}</button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div><div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70"><p>Mostrando ${ssrInterpolate(stores.value.length)} de ${ssrInterpolate(pagination.total)} tiendas filtradas.</p><div class="flex items-center gap-2"><button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"${ssrIncludeBooleanAttr(pagination.page <= 1 || loading.value) ? " disabled" : ""}> Anterior </button><span>Pagina ${ssrInterpolate(pagination.page)} / ${ssrInterpolate(pagination.total_pages)}</span><button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"${ssrIncludeBooleanAttr(pagination.page >= pagination.total_pages || loading.value) ? " disabled" : ""}> Siguiente </button></div></div></section><section class="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 class="text-lg font-semibold">Perfiles de Marketplace</h2><p class="text-xs text-white/60">Puedes revisar perfiles de vendedor y activar/desactivar su acceso.</p><div class="mt-4 overflow-x-auto"><table class="min-w-full text-sm"><thead><tr class="border-b border-white/10 text-left text-white/60"><th class="px-3 py-2">Perfil</th><th class="px-3 py-2">Email</th><th class="px-3 py-2">Productos</th><th class="px-3 py-2">Denuncias</th><th class="px-3 py-2">Estado</th><th class="px-3 py-2">Accion</th></tr></thead><tbody>`);
      if (!marketplaceSellers.value.length) {
        _push(`<tr><td colspan="6" class="px-3 py-6 text-center text-sm text-white/60">Sin perfiles marketplace registrados.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(marketplaceSellers.value, (seller) => {
        _push(`<tr class="border-b border-white/5"><td class="px-3 py-3"><button class="text-left hover:underline"><p class="font-semibold">${ssrInterpolate(seller.username)}</p><p class="text-xs text-white/60">${ssrInterpolate(seller.first_name)} ${ssrInterpolate(seller.last_name)}</p></button></td><td class="px-3 py-3 text-xs">${ssrInterpolate(seller.email || "Sin email")}</td><td class="px-3 py-3 text-xs">${ssrInterpolate(seller.products_active)} / ${ssrInterpolate(seller.products_total)} activos</td><td class="px-3 py-3 text-xs">${ssrInterpolate(seller.reports_total)} (${ssrInterpolate(seller.reports_open)} abiertas)</td><td class="px-3 py-3"><span class="${ssrRenderClass([seller.is_active ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200", "rounded-full px-2 py-0.5 text-xs"])}">${ssrInterpolate(seller.is_active ? "Activo" : "Inactivo")}</span></td><td class="px-3 py-3"><button class="rounded-lg border border-white/20 px-2 py-1 text-xs hover:border-white/50 disabled:opacity-50"${ssrIncludeBooleanAttr(!platformApiAvailable.value || Boolean(sellerStateLoading.value[seller.id])) ? " disabled" : ""}>${ssrInterpolate(!platformApiAvailable.value ? "No disponible" : sellerStateLoading.value[seller.id] ? "Guardando..." : seller.is_active ? "Desactivar" : "Activar")}</button></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section><section class="rounded-2xl border border-white/10 bg-white/5 p-5"><div class="flex flex-wrap items-center justify-between gap-2"><div><h2 class="text-lg font-semibold">Perfiles de Marketplace denunciados</h2><p class="text-xs text-white/60">Perfiles con reportes acumulados y acceso directo al detalle.</p></div><span class="text-xs text-white/60">${ssrInterpolate(paginatedReportedMarketplaceSellers.value.length)} de ${ssrInterpolate(filteredReportedMarketplaceSellers.value.length)} perfiles</span></div><div class="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end"><label class="space-y-1"><span class="text-xs text-white/60">Buscar perfil denunciado</span><input${ssrRenderAttr("value", reportedMarketplaceSearch.value)} type="text" placeholder="Usuario, email o tienda" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40"></label><div class="flex items-center gap-2"><button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10">Buscar</button><button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10">Limpiar</button></div></div><div class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
      ssrRenderList(paginatedReportedMarketplaceSellers.value, (seller) => {
        _push(`<button class="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-3 text-left transition hover:border-rose-300/40 hover:bg-rose-500/15"><p class="font-semibold text-rose-50">${ssrInterpolate(seller.username)}</p><p class="text-xs text-rose-100/80">Denuncias: ${ssrInterpolate(seller.reports_total)} · Abiertas: ${ssrInterpolate(seller.reports_open)}</p><p class="text-[11px] text-rose-100/60">${ssrInterpolate(seller.email || "Sin email")}</p></button>`);
      });
      _push(`<!--]-->`);
      if (!paginatedReportedMarketplaceSellers.value.length) {
        _push(`<p class="text-sm text-white/70">Sin perfiles marketplace denunciados.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (filteredReportedMarketplaceSellers.value.length > reportedMarketplacePerPage) {
        _push(`<div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70"><button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"${ssrIncludeBooleanAttr(reportedMarketplacePage.value <= 1) ? " disabled" : ""}> Anterior </button><span>Página ${ssrInterpolate(reportedMarketplacePage.value)} / ${ssrInterpolate(reportedMarketplaceTotalPages.value)}</span><button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"${ssrIncludeBooleanAttr(reportedMarketplacePage.value >= reportedMarketplaceTotalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 class="text-lg font-semibold">Denuncias de soporte</h2><p class="text-xs text-white/60">Filtro en tiempo real para revisar letra por letra y gestionar denuncias.</p><div class="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end"><label class="space-y-1"><span class="text-xs text-white/60">Buscar denuncias por titulo, tienda o denunciante</span><input${ssrRenderAttr("value", reportSearch.value)} type="text" placeholder="Ej: marketplace, lider, usuario" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40"></label><div class="flex flex-wrap items-center gap-2"><!--[-->`);
      ssrRenderList(reportStatusOptions, (option) => {
        _push(`<button class="${ssrRenderClass([reportStatusFilter.value === option.value ? "bg-white text-slate-950" : "border border-white/15 bg-white/5 text-white/80 hover:border-white/30", "rounded-full px-3 py-1.5 text-xs font-semibold transition"])}">${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div></div><div class="mt-4 space-y-2"><!--[-->`);
      ssrRenderList(filteredReportTickets.value, (ticket) => {
        _push(`<article class="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-3 hover:border-white/25"><div class="flex flex-wrap items-center justify-between gap-2"><p class="font-semibold">${ssrInterpolate(ticket.title)}</p><span class="text-xs text-white/60">${ssrInterpolate(formatDate(ticket.created_at))}</span></div><p class="text-xs text-white/70"> Tienda: ${ssrInterpolate(ticket.store_slug || "Sin tienda")} · Estado: ${ssrInterpolate(ticket.status)} · Denunciante: ${ssrInterpolate(ticket.created_by_name || "Sin registro")}</p><p class="text-xs text-white/60">${ssrInterpolate(ticket.description)}</p><div class="mt-3 grid gap-2 md:grid-cols-[180px,1fr,auto]"><select class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white"><option value="open"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[ticket.id]) ? ssrLooseContain(ticketDraftStatus.value[ticket.id], "open") : ssrLooseEqual(ticketDraftStatus.value[ticket.id], "open")) ? " selected" : ""}>Abierto</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[ticket.id]) ? ssrLooseContain(ticketDraftStatus.value[ticket.id], "in_progress") : ssrLooseEqual(ticketDraftStatus.value[ticket.id], "in_progress")) ? " selected" : ""}>En progreso</option><option value="resolved"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[ticket.id]) ? ssrLooseContain(ticketDraftStatus.value[ticket.id], "resolved") : ssrLooseEqual(ticketDraftStatus.value[ticket.id], "resolved")) ? " selected" : ""}>Resuelto</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[ticket.id]) ? ssrLooseContain(ticketDraftStatus.value[ticket.id], "closed") : ssrLooseEqual(ticketDraftStatus.value[ticket.id], "closed")) ? " selected" : ""}>Cerrado</option></select><input${ssrRenderAttr("value", ticketDraftResponse.value[ticket.id])} type="text" class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/50" placeholder="Respuesta administrativa"><button class="rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/40 disabled:opacity-50"${ssrIncludeBooleanAttr(Boolean(ticketUpdating.value[ticket.id])) ? " disabled" : ""}>${ssrInterpolate(ticketUpdating.value[ticket.id] ? "Guardando..." : "Guardar")}</button></div></article>`);
      });
      _push(`<!--]-->`);
      if (!filteredReportTickets.value.length) {
        _push(`<p class="text-sm text-white/70">No hay denuncias para este filtro.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
      if (showStoreDetail.value && selectedStore.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div class="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/15 bg-slate-900 p-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-xl font-semibold">Detalle de tienda: ${ssrInterpolate(selectedStore.value.name)}</h3><button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10">Cerrar</button></div><div class="grid gap-3 text-sm sm:grid-cols-2"><p><span class="text-white/60">Slug:</span> ${ssrInterpolate(selectedStore.value.slug)}</p><p><span class="text-white/60">Tipo:</span> ${ssrInterpolate(selectedStore.value.store_type)}</p><p><span class="text-white/60">Estado:</span> ${ssrInterpolate(selectedStore.value.is_active ? "Activa" : "Inactiva")}</p><p><span class="text-white/60">Creacion:</span> ${ssrInterpolate(formatDate(selectedStore.value.created_at))}</p><p><span class="text-white/60">Email:</span> ${ssrInterpolate(selectedStore.value.contact_email || "Sin email")}</p><p><span class="text-white/60">Telefono:</span> ${ssrInterpolate(selectedStore.value.phone || selectedStore.value.whatsapp || "Sin telefono")}</p><p><span class="text-white/60">Direccion:</span> ${ssrInterpolate(selectedStore.value.address || "Sin direccion")}</p><p><span class="text-white/60">Delivery:</span> ${ssrInterpolate(selectedStore.value.delivery_fee_mode || "Sin modo")}</p><p><span class="text-white/60">Pedidos:</span> ${ssrInterpolate(selectedStore.value.orders_total)}</p><p><span class="text-white/60">Ingresos:</span> ${ssrInterpolate(formatMoney(selectedStore.value.revenue_total))}</p><p><span class="text-white/60">Denuncias:</span> ${ssrInterpolate(selectedStore.value.reports_total)} (${ssrInterpolate(selectedStore.value.reports_open)} abiertas)</p><p><span class="text-white/60">Carrito:</span> ${ssrInterpolate(selectedStore.value.cart_enabled ? "Habilitado" : "Deshabilitado")}</p></div><div class="mt-4 space-y-2 text-sm"><p><span class="text-white/60">Descripcion:</span> ${ssrInterpolate(selectedStore.value.description || "Sin descripcion")}</p><p><span class="text-white/60">About:</span> ${ssrInterpolate(selectedStore.value.about || "Sin about")}</p><p><span class="text-white/60">Instagram:</span> ${ssrInterpolate(selectedStore.value.social_instagram || "No definido")}</p><p><span class="text-white/60">Facebook:</span> ${ssrInterpolate(selectedStore.value.social_facebook || "No definido")}</p><p><span class="text-white/60">TikTok:</span> ${ssrInterpolate(selectedStore.value.social_tiktok || "No definido")}</p><p><span class="text-white/60">YouTube:</span> ${ssrInterpolate(selectedStore.value.social_youtube || "No definido")}</p></div><div class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"><div class="flex flex-wrap items-center justify-between gap-2"><div><p class="text-xs uppercase tracking-[0.18em] text-white/50">Denuncia</p><p class="text-sm font-semibold">Motivo y datos relacionados</p></div><button class="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">${ssrInterpolate(selectedStoreReportVisible.value ? "Ocultar motivo" : "Ver motivo")}</button></div>`);
        if (selectedStoreReports.value.length) {
          _push(`<div class="mt-3 space-y-2"><p class="text-xs text-white/60">${ssrInterpolate(selectedStoreReports.value.length)} denuncias relacionadas.</p>`);
          if (selectedStoreReportVisible.value) {
            _push(`<div class="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm"><p class="font-semibold text-rose-50">${ssrInterpolate(selectedStoreReports.value[0].title)}</p><p class="mt-1 text-xs text-rose-100/80">Denunciante: ${ssrInterpolate(selectedStoreReports.value[0].created_by_name || "Sin registro")} · ${ssrInterpolate(formatDate(selectedStoreReports.value[0].created_at))}</p><p class="mt-2 whitespace-pre-line text-rose-50/90">${ssrInterpolate(selectedStoreReports.value[0].description)}</p>`);
            if (selectedStoreReports.value[0].response_message) {
              _push(`<p class="mt-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80"> Respuesta administrativa: ${ssrInterpolate(selectedStoreReports.value[0].response_message)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<p class="mt-3 text-xs text-white/60">Esta tienda aún no tiene denuncias asociadas.</p>`);
        }
        _push(`</div><div class="mt-4 flex flex-wrap items-center gap-3"><button class="rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-500/15"${ssrIncludeBooleanAttr(stateLoading.value[selectedStore.value.slug]) ? " disabled" : ""}>${ssrInterpolate(selectedStore.value.is_active ? "Inactivar tienda" : "Activar tienda")}</button>`);
        if (selectedStore.value.reports_open >= 2) {
          _push(`<span class="text-xs text-amber-200">Advertencia acumulada: esta tienda tiene ${ssrInterpolate(selectedStore.value.reports_open)} reportes abiertos.</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showCreatorDetail.value && selectedCreator.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div class="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-900 p-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-xl font-semibold">Detalle de creador</h3><button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10">Cerrar</button></div><div class="space-y-2 text-sm"><p><span class="text-white/60">Usuario:</span> ${ssrInterpolate(selectedCreator.value.username || "Sin dato")}</p><p><span class="text-white/60">Nombre:</span> ${ssrInterpolate(selectedCreator.value.first_name || "")} ${ssrInterpolate(selectedCreator.value.last_name || "")}</p><p><span class="text-white/60">Email:</span> ${ssrInterpolate(selectedCreator.value.email || "Sin email")}</p><p><span class="text-white/60">Estado:</span> ${ssrInterpolate(selectedCreator.value.is_active ? "Activo" : "Inactivo")}</p><p><span class="text-white/60">Registro:</span> ${ssrInterpolate(formatDate(selectedCreator.value.date_joined))}</p><p><span class="text-white/60">Ultimo login:</span> ${ssrInterpolate(formatDate(selectedCreator.value.last_login))}</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showTicketDetail.value && selectedTicket.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div class="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 p-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-xl font-semibold">Detalle de denuncia #${ssrInterpolate(selectedTicket.value.id)}</h3><button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10">Cerrar</button></div><div class="space-y-2 text-sm"><p><span class="text-white/60">Titulo:</span> ${ssrInterpolate(selectedTicket.value.title)}</p><p><span class="text-white/60">Tienda:</span> ${ssrInterpolate(selectedTicket.value.store_slug || "Sin tienda")}</p><p><span class="text-white/60">Estado:</span> ${ssrInterpolate(selectedTicket.value.status)}</p><p><span class="text-white/60">Denunciante:</span> ${ssrInterpolate(selectedTicket.value.created_by_name || "Sin registro")}</p><p><span class="text-white/60">Fecha:</span> ${ssrInterpolate(formatDate(selectedTicket.value.created_at))}</p><p><span class="text-white/60">Descripcion:</span> ${ssrInterpolate(selectedTicket.value.description)}</p></div><div class="mt-4 grid gap-2 md:grid-cols-[180px,1fr,auto]"><select class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white"><option value="open"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[selectedTicket.value.id]) ? ssrLooseContain(ticketDraftStatus.value[selectedTicket.value.id], "open") : ssrLooseEqual(ticketDraftStatus.value[selectedTicket.value.id], "open")) ? " selected" : ""}>Abierto</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[selectedTicket.value.id]) ? ssrLooseContain(ticketDraftStatus.value[selectedTicket.value.id], "in_progress") : ssrLooseEqual(ticketDraftStatus.value[selectedTicket.value.id], "in_progress")) ? " selected" : ""}>En progreso</option><option value="resolved"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[selectedTicket.value.id]) ? ssrLooseContain(ticketDraftStatus.value[selectedTicket.value.id], "resolved") : ssrLooseEqual(ticketDraftStatus.value[selectedTicket.value.id], "resolved")) ? " selected" : ""}>Resuelto</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(ticketDraftStatus.value[selectedTicket.value.id]) ? ssrLooseContain(ticketDraftStatus.value[selectedTicket.value.id], "closed") : ssrLooseEqual(ticketDraftStatus.value[selectedTicket.value.id], "closed")) ? " selected" : ""}>Cerrado</option></select><input${ssrRenderAttr("value", ticketDraftResponse.value[selectedTicket.value.id])} type="text" class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/50" placeholder="Respuesta administrativa"><button class="rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/40 disabled:opacity-50"${ssrIncludeBooleanAttr(Boolean(ticketUpdating.value[selectedTicket.value.id])) ? " disabled" : ""}>${ssrInterpolate(ticketUpdating.value[selectedTicket.value.id] ? "Guardando..." : "Guardar")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (showSellerDetail.value && selectedSeller.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"><div class="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-900 p-5"><div class="mb-4 flex items-center justify-between"><h3 class="text-xl font-semibold">Perfil marketplace: ${ssrInterpolate(selectedSeller.value.username)}</h3><button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10">Cerrar</button></div><div class="space-y-2 text-sm"><p><span class="text-white/60">Nombre:</span> ${ssrInterpolate(selectedSeller.value.first_name || "")} ${ssrInterpolate(selectedSeller.value.last_name || "")}</p><p><span class="text-white/60">Email:</span> ${ssrInterpolate(selectedSeller.value.email || "Sin email")}</p><p><span class="text-white/60">Store slug:</span> ${ssrInterpolate(selectedSeller.value.store_slug || "Sin tienda marketplace")}</p><p><span class="text-white/60">Productos:</span> ${ssrInterpolate(selectedSeller.value.products_active)} activos de ${ssrInterpolate(selectedSeller.value.products_total)}</p><p><span class="text-white/60">Denuncias:</span> ${ssrInterpolate(selectedSeller.value.reports_total)} (${ssrInterpolate(selectedSeller.value.reports_open)} abiertas)</p><p><span class="text-white/60">Registro:</span> ${ssrInterpolate(formatDate(selectedSeller.value.date_joined))}</p><p><span class="text-white/60">Ultimo login:</span> ${ssrInterpolate(formatDate(selectedSeller.value.last_login))}</p></div><div class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4"><div class="flex flex-wrap items-center justify-between gap-2"><div><p class="text-xs uppercase tracking-[0.18em] text-white/50">Denuncia</p><p class="text-sm font-semibold">Motivo y datos relacionados</p></div><button class="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10">${ssrInterpolate(selectedSellerReportVisible.value ? "Ocultar motivo" : "Ver motivo")}</button></div>`);
        if (selectedSellerReports.value.length) {
          _push(`<div class="mt-3 space-y-2"><p class="text-xs text-white/60">${ssrInterpolate(selectedSellerReports.value.length)} denuncias relacionadas.</p>`);
          if (selectedSellerReportVisible.value) {
            _push(`<div class="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm"><p class="font-semibold text-rose-50">${ssrInterpolate(selectedSellerReports.value[0].title)}</p><p class="mt-1 text-xs text-rose-100/80">Denunciante: ${ssrInterpolate(selectedSellerReports.value[0].created_by_name || "Sin registro")} · ${ssrInterpolate(formatDate(selectedSellerReports.value[0].created_at))}</p><p class="mt-2 whitespace-pre-line text-rose-50/90">${ssrInterpolate(selectedSellerReports.value[0].description)}</p>`);
            if (selectedSellerReports.value[0].response_message) {
              _push(`<p class="mt-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80"> Respuesta administrativa: ${ssrInterpolate(selectedSellerReports.value[0].response_message)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<p class="mt-3 text-xs text-white/60">Este perfil aún no tiene denuncias asociadas.</p>`);
        }
        _push(`</div><div class="mt-4 flex flex-wrap items-center gap-3"><button class="rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-500/15"${ssrIncludeBooleanAttr(sellerStateLoading.value[selectedSeller.value.id]) ? " disabled" : ""}>${ssrInterpolate(selectedSeller.value.is_active ? "Inactivar perfil" : "Activar perfil")}</button>`);
        if (selectedSeller.value.reports_open >= 2) {
          _push(`<span class="text-xs text-amber-200">Advertencia acumulada: este perfil tiene ${ssrInterpolate(selectedSeller.value.reports_open)} reportes abiertos.</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/administracion-tiendas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=administracion-tiendas-C_FSonwz.mjs.map
