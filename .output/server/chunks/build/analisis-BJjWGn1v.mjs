import { b as useAuthStore, a as useRuntimeConfig, c as __nuxt_component_1 } from './server.mjs';
import { defineComponent, ref, computed, useSSRContext } from 'vue';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analisis",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    useThemeStore();
    useRoute();
    useDashboardAccess();
    const config = useRuntimeConfig();
    String(config.public.apiBase || "");
    ref(false);
    ref("");
    const stores = ref([]);
    const today = /* @__PURE__ */ new Date();
    Array.from({ length: 5 }).map((_, idx) => today.getFullYear() - idx);
    const filters = ref({
      store: "",
      granularity: "month",
      start: "",
      end: "",
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      quarter: Math.floor(today.getMonth() / 3) + 1
    });
    const summary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0, status_counts: {} });
    const previousSummary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0 });
    const periodSeries = ref([]);
    const paymentMethods = ref([]);
    const topProducts = ref([]);
    const topCategories = ref([]);
    const allowedStoreSlugs = computed(() => {
      const memberships = auth.user?.memberships || [];
      const allowed = /* @__PURE__ */ new Set(["ADMIN", "REPORTS", "DATA_ANALYST"]);
      return new Set(memberships.filter((m) => m.roles?.some((r) => allowed.has(r))).map((m) => m.store.slug));
    });
    computed(() => {
      if (!auth.user?.memberships?.length) return stores.value;
      if (!allowedStoreSlugs.value.size) return [];
      return stores.value.filter((s) => allowedStoreSlugs.value.has(s.slug));
    });
    computed(() => {
      const range = getRange();
      return `${range.start} a ${range.end}`;
    });
    computed(() => [
      { label: "Ordenes", value: summary.value.total_orders, note: "Total en rango" },
      { label: "Pagadas/Finalizadas", value: summary.value.paid_orders, note: "Estado final" },
      { label: "Ingresos", value: money(summary.value.total_revenue), note: "Recaudado" },
      { label: "Ticket promedio", value: money(summary.value.avg_ticket), note: "Promedio" }
    ]);
    computed(() => {
      const approvalRate = summary.value.total_orders ? Math.round(summary.value.paid_orders / summary.value.total_orders * 100) : 0;
      const deltaRevenue = Number(summary.value.total_revenue) - Number(previousSummary.value.total_revenue || 0);
      const deltaOrders = Number(summary.value.total_orders) - Number(previousSummary.value.total_orders || 0);
      const topProduct = topProducts.value[0];
      const topProductShare = topProduct && summary.value.total_revenue ? Math.round(Number(topProduct.total_revenue || 0) / Number(summary.value.total_revenue || 1) * 100) : 0;
      const bestPayment = paymentMethods.value.filter((p) => Number(p.attempts || 0) > 0).map((p) => ({
        ...p,
        rate: Math.round(Number(p.paid || 0) / Number(p.attempts || 1) * 100)
      })).sort((a, b) => b.rate - a.rate)[0];
      return [
        {
          label: "Tasa de aprobacion",
          value: `${approvalRate}%`,
          note: "Pagadas vs ordenes totales"
        },
        {
          label: "Cambio ingresos",
          value: formatDelta(deltaRevenue),
          note: "Vs periodo anterior"
        },
        {
          label: "Cambio ordenes",
          value: formatDelta(deltaOrders, true),
          note: "Volumen vs periodo anterior"
        },
        {
          label: "Producto estrella",
          value: topProduct ? topProduct.product_name : "—",
          note: topProduct ? `${topProductShare}% del ingreso` : "Sin ventas"
        },
        {
          label: "Mejor metodo pago",
          value: bestPayment ? formatPaymentMethodLabel(bestPayment.payment_type_code) : "—",
          note: bestPayment ? `${bestPayment.rate}% aprobacion` : "Sin datos"
        },
        {
          label: "Categoria top",
          value: topCategories.value[0]?.category || "—",
          note: topCategories.value[0] ? `${topCategories.value[0].total_qty} ventas` : "Sin ventas"
        }
      ];
    });
    computed(() => {
      const values = periodSeries.value.map((p) => Number(p.revenue) || 0);
      const max = Math.max(...values, 1);
      return periodSeries.value.map((p) => ({
        label: formatPeriod(p.period),
        value: Number(p.revenue) || 0,
        height: 24 + Math.round((Number(p.revenue) || 0) / max * 120)
      }));
    });
    computed(() => {
      if (!periodSeries.value.length) return 1;
      return Math.max(...periodSeries.value.map((point) => Number(point.revenue || 0)), 1);
    });
    computed(
      () => periodSeries.value.map((point) => {
        const total = Number(point.orders_count || 0);
        const paid = Number(point.paid_orders || 0);
        return {
          period: point.period,
          label: formatPeriod(point.period),
          rate: total > 0 ? Math.round(paid / total * 100) : 0
        };
      })
    );
    computed(() => {
      const totalRevenue = topCategories.value.reduce((acc, item) => acc + Number(item.total_revenue || 0), 0);
      if (!totalRevenue) return [];
      return topCategories.value.slice(0, 6).map((item) => ({
        category: item.category,
        percent: Math.round(Number(item.total_revenue || 0) / totalRevenue * 100)
      }));
    });
    const money = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(Number(value) || 0);
    const formatPaymentMethodLabel = (value) => {
      const raw = String(value || "").toUpperCase();
      if (!raw) return "N/A";
      if (raw.startsWith("PAYOUT_PAYPAL")) return "Cuenta receptora PayPal";
      if (raw.startsWith("PAYOUT_BANK_TRANSFER")) return "Cuenta receptora Transferencia";
      const map = {
        VDC: "Tarjeta debito",
        VN: "Tarjeta credito",
        SI: "Cuotas sin interes",
        S2: "Cuotas comercio",
        NC: "N cuotas"
      };
      return map[raw] || raw;
    };
    const formatPeriod = (value) => {
      if (!value) return "—";
      const date = new Date(value);
      if (filters.value.granularity === "year") return String(date.getFullYear());
      if (filters.value.granularity === "month") return `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (filters.value.granularity === "quarter") return `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
      return date.toLocaleDateString("es-CL");
    };
    const formatDelta = (value, isCount = false) => {
      const numeric = Number(value) || 0;
      const sign = numeric > 0 ? "+" : "";
      return isCount ? `${sign}${numeric}` : `${sign}${money(numeric)}`;
    };
    const getRange = () => {
      const { granularity, year, month, quarter, start, end } = filters.value;
      if (granularity === "day") {
        const fallback = /* @__PURE__ */ new Date();
        const startDate2 = start || new Date(fallback.getFullYear(), fallback.getMonth(), 1).toISOString().slice(0, 10);
        const endDate2 = end || fallback.toISOString().slice(0, 10);
        return { start: startDate2, end: endDate2 };
      }
      if (granularity === "month") {
        const startDate2 = new Date(year, month - 1, 1);
        const endDate2 = new Date(year, month, 0);
        return { start: startDate2.toISOString().slice(0, 10), end: endDate2.toISOString().slice(0, 10) };
      }
      if (granularity === "quarter") {
        const startMonth = (quarter - 1) * 3;
        const startDate2 = new Date(year, startMonth, 1);
        const endDate2 = new Date(year, startMonth + 3, 0);
        return { start: startDate2.toISOString().slice(0, 10), end: endDate2.toISOString().slice(0, 10) };
      }
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      return { start: startDate.toISOString().slice(0, 10), end: endDate.toISOString().slice(0, 10) };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/analisis.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=analisis-BJjWGn1v.mjs.map
