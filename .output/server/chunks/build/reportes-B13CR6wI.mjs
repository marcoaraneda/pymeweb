import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, reactive, ref, h, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
import { b as useAuthStore, g as useRoute, a as useRuntimeConfig } from './server.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const useReports = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const tenant = useTenantStore();
  const downloadReport = async (reportType, opts = {}) => {
    if (!auth.token) throw new Error("No autenticado");
    if (!tenant.data?.slug && !opts.storeSlug) throw new Error("Tienda no definida");
    const doFetch = async (token) => {
      const params = {
        store_id: tenant.data?.id,
        store_slug: opts.storeSlug || tenant.data?.slug,
        type: reportType
      };
      if (opts.start) params.start = opts.start;
      if (opts.end) params.end = opts.end;
      const response = await $fetch(`${config.public.apiBase}/reports/export/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: "blob"
      });
      const url = (void 0).URL.createObjectURL(new Blob([response]));
      const link = (void 0).createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_${reportType}_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
      (void 0).body.appendChild(link);
      link.click();
      link.remove();
    };
    try {
      return await doFetch(auth.token);
    } catch (error) {
      const code = error.response?._data?.code;
      if (code === "token_not_valid" && auth.refreshToken) {
        const refreshed = await auth.refreshTokens();
        if (refreshed) return doFetch(refreshed);
      }
      const msg = error.response?._data?.detail || "Error al generar el reporte";
      throw new Error(msg);
    }
  };
  return { downloadReport };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "reportes",
  __ssrInlineRender: true,
  setup(__props) {
    const tenant = useTenantStore();
    const auth = useAuthStore();
    const theme = useThemeStore();
    useReports();
    const config = useRuntimeConfig();
    const route = useRoute();
    route.params.slug;
    String(config.public.apiBase || "");
    const accentColor = computed(() => theme.accent || "#2563eb");
    const filters = reactive({ store: "", range: "7d", start: "", end: "" });
    const summary = reactive({ sales: 0, orders: 0, avgTicket: 0, activeProducts: 0 });
    const chart = ref([]);
    const topCategories = ref([]);
    const topProducts = ref([]);
    const orders = ref([]);
    const storeOptions = computed(() => {
      const stores = auth.user?.memberships?.map((m) => m.store) || [];
      if (tenant.data) stores.unshift({ slug: tenant.data.slug, name: tenant.data.name });
      const seen = /* @__PURE__ */ new Set();
      return stores.filter((s) => {
        if (!s?.slug) return false;
        if (seen.has(s.slug)) return false;
        seen.add(s.slug);
        return true;
      });
    });
    const filteredOrders = computed(() => {
      return orders.value.filter((o) => {
        const matchStore = !filters.store || o.store === filters.store;
        const dateOk = true;
        return matchStore && dateOk;
      });
    });
    const pendingList = computed(
      () => filteredOrders.value.filter((o) => ["pending", "preparing", "in_transit", "pendiente", "preparando", "en_transito"].includes(o.status)).slice(0, 8)
    );
    const deliveredList = computed(
      () => filteredOrders.value.filter((o) => ["delivered", "completed", "finalizado", "entregado"].includes(o.status)).slice(0, 8)
    );
    const money = (n) => `$${(n || 0).toFixed(2)}`;
    const barColor = (idx) => idx === chart.value.length - 1 ? accentColor.value : "#cbd5e1";
    const statusClass = (status) => {
      if (status === "pagado") return "bg-emerald-100 text-emerald-700";
      if (status === "pendiente") return "bg-amber-100 text-amber-800";
      return "bg-slate-100 text-slate-700";
    };
    const Stat = defineComponent({
      props: { title: String, value: [String, Number], icon: String },
      setup(props) {
        return () => h("div", { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" }, [
          h("div", { class: "text-2xl" }, props.icon),
          h("p", { class: "text-sm text-slate-500" }, props.title),
          h("p", { class: "text-xl font-semibold text-slate-900" }, String(props.value ?? ""))
        ]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1><p class="text-gray-500">Filtra por tienda y rango de tiempo. Exporta cuando necesites.</p></div><div class="flex gap-3"><button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"> Actualizar </button><button class="rounded-lg px-3 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"> Exportar ventas </button></div></header><section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">`);
      _push(ssrRenderComponent(unref(Stat), {
        title: "Ventas",
        value: money(summary.sales),
        icon: "💰"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Stat), {
        title: "Órdenes",
        value: summary.orders,
        icon: "🧾"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Stat), {
        title: "Ticket promedio",
        value: money(summary.avgTicket),
        icon: "🎟️"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Stat), {
        title: "Productos activos",
        value: summary.activeProducts,
        icon: "📦"
      }, null, _parent));
      _push(`</section><section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"><div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div class="grid gap-3 md:grid-cols-3 md:w-2/3"><div class="space-y-1"><label class="text-sm text-slate-600">Tienda</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><!--[-->`);
      ssrRenderList(storeOptions.value, (s) => {
        _push(`<option${ssrRenderAttr("value", s.slug)}${ssrIncludeBooleanAttr(Array.isArray(filters.store) ? ssrLooseContain(filters.store, s.slug) : ssrLooseEqual(filters.store, s.slug)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="space-y-1"><label class="text-sm text-slate-600">Rango</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="7d"${ssrIncludeBooleanAttr(Array.isArray(filters.range) ? ssrLooseContain(filters.range, "7d") : ssrLooseEqual(filters.range, "7d")) ? " selected" : ""}>Últimos 7 días</option><option value="30d"${ssrIncludeBooleanAttr(Array.isArray(filters.range) ? ssrLooseContain(filters.range, "30d") : ssrLooseEqual(filters.range, "30d")) ? " selected" : ""}>Últimos 30 días</option><option value="90d"${ssrIncludeBooleanAttr(Array.isArray(filters.range) ? ssrLooseContain(filters.range, "90d") : ssrLooseEqual(filters.range, "90d")) ? " selected" : ""}>Últimos 90 días</option><option value="custom"${ssrIncludeBooleanAttr(Array.isArray(filters.range) ? ssrLooseContain(filters.range, "custom") : ssrLooseEqual(filters.range, "custom")) ? " selected" : ""}>Personalizado</option></select></div>`);
      if (filters.range === "custom") {
        _push(`<div class="space-y-1"><label class="text-sm text-slate-600">Desde / Hasta</label><div class="flex gap-2"><input${ssrRenderAttr("value", filters.start)} type="date" class="w-1/2 rounded-xl border border-slate-200 px-3 py-2 text-sm"><input${ssrRenderAttr("value", filters.end)} type="date" class="w-1/2 rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex gap-3"><button class="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"> Aplicar filtros </button><button class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"> Exportar stock </button></div></div><div class="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]"><div class="rounded-xl border border-slate-200 p-4"><h3 class="text-sm font-semibold text-slate-800">Tendencia de ventas</h3><div class="mt-4 flex items-end gap-2"><!--[-->`);
      ssrRenderList(chart.value, (p, idx) => {
        _push(`<div class="flex-1 rounded-t-lg bg-slate-200" style="${ssrRenderStyle({ height: `${p.value}px`, backgroundColor: barColor(idx) })}"${ssrRenderAttr("title", `${p.label}: ${money(p.value * 10)}`)}></div>`);
      });
      _push(`<!--]--></div></div><div class="rounded-xl border border-slate-200 p-4 space-y-3"><h3 class="text-sm font-semibold text-slate-800">Top categorías</h3>`);
      if (!topCategories.value.length) {
        _push(`<div class="text-slate-500 text-sm">Sin datos</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(topCategories.value, (cat) => {
        _push(`<div class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"><div><p class="text-sm font-semibold text-slate-800">${ssrInterpolate(cat.name)}</p><p class="text-xs text-slate-500">${ssrInterpolate(cat.count)} ventas</p></div><span class="text-sm font-semibold" style="${ssrRenderStyle({ color: accentColor.value })}">${ssrInterpolate(money(cat.revenue))}</span></div>`);
      });
      _push(`<!--]--></div></div><div class="grid gap-4 lg:grid-cols-2"><div class="rounded-xl border border-slate-200 p-4 space-y-3"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-800">Productos más vendidos</h3><span class="text-xs text-slate-500">Top 5</span></div>`);
      if (!topProducts.value.length) {
        _push(`<div class="text-slate-500 text-sm">Sin datos</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(topProducts.value, (prod) => {
        _push(`<div class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"><div><p class="font-semibold text-slate-900">${ssrInterpolate(prod.name)}</p><p class="text-xs text-slate-500">${ssrInterpolate(prod.sales)} ventas</p></div><span class="font-semibold" style="${ssrRenderStyle({ color: accentColor.value })}">${ssrInterpolate(money(prod.revenue))}</span></div>`);
      });
      _push(`<!--]--></div><div class="grid gap-4"><div class="rounded-xl border border-slate-200 p-4 space-y-3"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-800">Pedidos en proceso</h3><span class="text-xs text-slate-500">Pendiente / Preparando / En tránsito</span></div>`);
      if (!pendingList.value.length) {
        _push(`<div class="text-slate-500 text-sm">Sin pedidos en proceso.</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(pendingList.value, (order) => {
        _push(`<div class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"><div class="space-y-0.5"><p class="font-semibold text-slate-900">Pedido #${ssrInterpolate(order.id)} — ${ssrInterpolate(order.customer)}</p><p class="text-xs text-slate-500">${ssrInterpolate(order.date)}</p><p class="text-xs text-slate-500">Tracking ${ssrInterpolate(order.tracking || "—")}</p></div><div class="text-right"><p class="font-semibold text-slate-900">${ssrInterpolate(money(order.total))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${order.store}/admin/orders/${order.id}`,
          class: "text-xs text-blue-600 hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Ver`);
            } else {
              return [
                createTextVNode("Ver")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]--></div><div class="rounded-xl border border-slate-200 p-4 space-y-3"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-800">Entregados / Finalizados</h3><span class="text-xs text-slate-500">Llegó a destino</span></div>`);
      if (!deliveredList.value.length) {
        _push(`<div class="text-slate-500 text-sm">Sin entregas registradas.</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(deliveredList.value, (order) => {
        _push(`<div class="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm"><div class="space-y-0.5"><p class="font-semibold text-slate-900">Pedido #${ssrInterpolate(order.id)} — ${ssrInterpolate(order.customer)}</p><p class="text-xs text-slate-500">${ssrInterpolate(order.date)}</p><p class="text-xs text-slate-500">Tracking ${ssrInterpolate(order.tracking || "—")}</p></div><div class="text-right"><p class="font-semibold text-slate-900">${ssrInterpolate(money(order.total))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${order.store}/admin/orders/${order.id}`,
          class: "text-xs text-blue-600 hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Ver`);
            } else {
              return [
                createTextVNode("Ver")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div>`);
      });
      _push(`<!--]--></div></div></div><div class="rounded-xl border border-slate-200 p-4"><div class="flex items-center justify-between"><h3 class="text-sm font-semibold text-slate-800">Órdenes recientes</h3><span class="text-xs text-slate-500">Filtrado por tienda y rango</span></div><div class="mt-3 overflow-auto"><table class="min-w-full text-sm"><thead><tr class="text-left text-slate-500"><th class="py-2 pr-4">#</th><th class="py-2 pr-4">Cliente</th><th class="py-2 pr-4">Tienda</th><th class="py-2 pr-4">Fecha</th><th class="py-2 pr-4">Total</th><th class="py-2 pr-4">Estado</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(filteredOrders.value, (order) => {
        _push(`<tr class="border-t border-slate-100"><td class="py-2 pr-4">${ssrInterpolate(order.id)}</td><td class="py-2 pr-4">${ssrInterpolate(order.customer)}</td><td class="py-2 pr-4">${ssrInterpolate(order.store)}</td><td class="py-2 pr-4">${ssrInterpolate(order.date)}</td><td class="py-2 pr-4 font-semibold">${ssrInterpolate(money(order.total))}</td><td class="py-2 pr-4"><span class="${ssrRenderClass([statusClass(order.status), "rounded-full px-2 py-1 text-xs font-semibold"])}">${ssrInterpolate(order.status)}</span></td></tr>`);
      });
      _push(`<!--]-->`);
      if (!filteredOrders.value.length) {
        _push(`<tr><td colspan="6" class="py-4 text-center text-slate-500">Sin órdenes en este rango.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</tbody></table></div></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/reportes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=reportes-B13CR6wI.mjs.map
