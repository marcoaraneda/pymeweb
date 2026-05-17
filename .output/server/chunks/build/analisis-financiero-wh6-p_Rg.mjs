import { b as useAuthStore, a as useRuntimeConfig, c as __nuxt_component_1 } from './server.mjs';
import { defineComponent, ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
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
import 'pinia';

const MARKETPLACE_SCOPE = "marketplace";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "analisis-financiero",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const theme = useThemeStore();
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
    const summary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0 });
    const previousSummary = ref({ total_orders: 0, paid_orders: 0, total_revenue: 0, avg_ticket: 0 });
    const periodSeries = ref([]);
    const previousPeriodSeries = ref([]);
    const paymentMethods = ref([]);
    const storeOrders = ref([]);
    const marketplaceRows = ref([]);
    const isMarketplaceSelected = computed(() => filters.value.store === MARKETPLACE_SCOPE);
    const alertThresholds = ref({
      approvalMin: 70,
      concentrationMax: 45,
      momentumMin: 0
    });
    const simulator = ref({
      approvalRate: 85,
      avgTicket: 0
    });
    const rangeDays = computed(() => {
      const range = getRange();
      const start = new Date(range.start).getTime();
      const end = new Date(range.end).getTime();
      const diff = Math.floor((end - start) / 864e5) + 1;
      return Math.max(diff, 1);
    });
    const averageDailyRevenue = computed(() => {
      return Number(summary.value.total_revenue || 0) / rangeDays.value;
    });
    const projectedMonthlyRevenue = computed(() => {
      return Math.round(averageDailyRevenue.value * 30);
    });
    const previousRangeDays = computed(() => {
      const range = getPreviousRange();
      const start = new Date(range.start).getTime();
      const end = new Date(range.end).getTime();
      const diff = Math.floor((end - start) / 864e5) + 1;
      return Math.max(diff, 1);
    });
    const previousAverageDailyRevenue = computed(() => {
      return Number(previousSummary.value.total_revenue || 0) / previousRangeDays.value;
    });
    const previousProjectedMonthlyRevenue = computed(() => {
      return Math.round(previousAverageDailyRevenue.value * 30);
    });
    const allowedStoreSlugs = computed(() => {
      const memberships = auth.user?.memberships || [];
      const allowed = /* @__PURE__ */ new Set(["ADMIN", "REPORTS", "FINANCE"]);
      const slugs = /* @__PURE__ */ new Set();
      for (const membership of memberships) {
        if (membership.roles?.some((role) => allowed.has(role))) {
          slugs.add(membership.store.slug);
        }
      }
      return slugs;
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
    computed(() => {
      const approvalRate = summary.value.total_orders ? Math.round(summary.value.paid_orders / summary.value.total_orders * 100) : 0;
      const totalAttempts = paymentMethods.value.reduce((acc, item) => acc + Number(item.attempts || 0), 0);
      const totalPaid = paymentMethods.value.reduce((acc, item) => acc + Number(item.paid || 0), 0);
      const rejectionRate = totalAttempts ? Math.round((totalAttempts - totalPaid) / totalAttempts * 100) : 0;
      return [
        { label: "Ingresos cobrados", value: money(summary.value.total_revenue), note: "Total en el rango" },
        { label: "Ordenes pagadas", value: summary.value.paid_orders, note: "Transacciones exitosas" },
        { label: "Ticket promedio", value: money(summary.value.avg_ticket), note: "Valor medio por orden" },
        { label: "Aprobacion pagos", value: `${approvalRate}%`, note: `Rechazo ${rejectionRate}%` }
      ];
    });
    const pctDelta = (current, previous) => {
      if (previous <= 0) return current > 0 ? 100 : 0;
      return Math.round((current - previous) / previous * 100);
    };
    computed(() => {
      const currentApproval = summary.value.total_orders ? Math.round(summary.value.paid_orders / summary.value.total_orders * 100) : 0;
      const prevApproval = previousSummary.value.total_orders ? Math.round(previousSummary.value.paid_orders / previousSummary.value.total_orders * 100) : 0;
      return [
        {
          label: "Ingreso",
          current: money(summary.value.total_revenue),
          previous: money(previousSummary.value.total_revenue),
          delta: pctDelta(Number(summary.value.total_revenue || 0), Number(previousSummary.value.total_revenue || 0))
        },
        {
          label: "Pagadas",
          current: String(summary.value.paid_orders),
          previous: String(previousSummary.value.paid_orders),
          delta: pctDelta(Number(summary.value.paid_orders || 0), Number(previousSummary.value.paid_orders || 0))
        },
        {
          label: "Ticket",
          current: money(summary.value.avg_ticket),
          previous: money(previousSummary.value.avg_ticket),
          delta: pctDelta(Number(summary.value.avg_ticket || 0), Number(previousSummary.value.avg_ticket || 0))
        },
        {
          label: "Aprobación",
          current: `${currentApproval}%`,
          previous: `${prevApproval}%`,
          delta: pctDelta(currentApproval, prevApproval)
        }
      ];
    });
    computed(() => {
      return [...periodSeries.value].sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0)).slice(0, 5);
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
    const revenueMomentum = computed(() => {
      if (periodSeries.value.length < 2) return 0;
      const sorted = [...periodSeries.value].sort((a, b) => a.period > b.period ? 1 : -1);
      const prev = Number(sorted[sorted.length - 2]?.revenue || 0);
      const current = Number(sorted[sorted.length - 1]?.revenue || 0);
      if (prev <= 0) return current > 0 ? 100 : 0;
      return Math.round((current - prev) / prev * 100);
    });
    const revenueConcentration = computed(() => {
      const total = Number(summary.value.total_revenue || 0);
      if (total <= 0) return 0;
      const top = Math.max(...periodSeries.value.map((item) => Number(item.revenue || 0)), 0);
      return Math.round(top / total * 100);
    });
    const previousRevenueConcentration = computed(() => {
      const total = Number(previousSummary.value.total_revenue || 0);
      if (total <= 0) return 0;
      const top = Math.max(...previousPeriodSeries.value.map((item) => Number(item.revenue || 0)), 0);
      return Math.round(top / total * 100);
    });
    const previousRevenueMomentum = computed(() => {
      if (previousPeriodSeries.value.length < 2) return 0;
      const sorted = [...previousPeriodSeries.value].sort((a, b) => a.period > b.period ? 1 : -1);
      const prev = Number(sorted[sorted.length - 2]?.revenue || 0);
      const current = Number(sorted[sorted.length - 1]?.revenue || 0);
      if (prev <= 0) return current > 0 ? 100 : 0;
      return Math.round((current - prev) / prev * 100);
    });
    computed(() => pctDelta(projectedMonthlyRevenue.value, previousProjectedMonthlyRevenue.value));
    computed(() => pctDelta(revenueConcentration.value, previousRevenueConcentration.value));
    computed(() => pctDelta(revenueMomentum.value, previousRevenueMomentum.value));
    computed(
      () => periodSeries.value.map((point) => {
        const total = Number(point.orders_count || 0);
        const paid = Number(point.paid_orders || 0);
        const rate = total > 0 ? Math.round(paid / total * 100) : 0;
        return {
          period: point.period,
          label: formatPeriod(point.period),
          rate
        };
      })
    );
    const statusPalette = {
      pending: "#f59e0b",
      preparing: "#f97316",
      in_transit: "#0ea5e9",
      delivered: "#22c55e",
      completed: "#10b981",
      shipping: "#38bdf8"
    };
    computed(() => {
      const source = isMarketplaceSelected.value ? marketplaceRows.value : storeOrders.value;
      const field = isMarketplaceSelected.value ? "marketplace_status" : "status";
      const labelMap = {
        pending: "Pendiente",
        preparing: "Preparando",
        in_transit: "En tránsito",
        delivered: "Entregado",
        completed: "Finalizado",
        shipping: "Enviándose"
      };
      const total = Math.max(source.length, 1);
      const counter = /* @__PURE__ */ new Map();
      source.forEach((item) => {
        const key = String(item?.[field] || (isMarketplaceSelected.value ? "preparing" : "pending"));
        counter.set(key, (counter.get(key) || 0) + 1);
      });
      return Array.from(counter.entries()).map(([value, count]) => ({
        value,
        label: labelMap[value] || value,
        count,
        percent: Math.round(count / total * 100),
        color: statusPalette[value] || theme.accent
      })).sort((a, b) => b.count - a.count);
    });
    computed(() => {
      return paymentMethods.value.map((item, idx) => {
        const attempts = Number(item.attempts || 0);
        const paid = Number(item.paid || 0);
        const rejected = Math.max(attempts - paid, 0);
        const successRate = attempts > 0 ? Math.round(paid / attempts * 100) : 0;
        return {
          key: `${item.payment_type_code || "na"}-${item.response_code || idx}`,
          label: formatPaymentMethodLabel(item.payment_type_code),
          attempts,
          paid,
          rejected,
          successRate
        };
      });
    });
    computed(() => {
      const signals = [];
      const approvalRate = summary.value.total_orders ? Math.round(summary.value.paid_orders / summary.value.total_orders * 100) : 0;
      if (approvalRate < alertThresholds.value.approvalMin) {
        signals.push({
          title: "Riesgo en aprobación de pagos",
          detail: `La aprobación está en ${approvalRate}% y bajo el mínimo (${alertThresholds.value.approvalMin}%). Revisa medios de pago y rechazos por código.`,
          type: "risk"
        });
      } else {
        signals.push({
          title: "Aprobación saludable",
          detail: `La aprobación llega a ${approvalRate}%, señal positiva para escalar campañas.`,
          type: "opportunity"
        });
      }
      if (revenueConcentration.value >= alertThresholds.value.concentrationMax) {
        signals.push({
          title: "Ingresos concentrados",
          detail: `El ${revenueConcentration.value}% del ingreso se concentra en un solo periodo (máximo sugerido ${alertThresholds.value.concentrationMax}%). Conviene suavizar demanda con promociones continuas.`,
          type: "risk"
        });
      } else {
        signals.push({
          title: "Ingresos diversificados",
          detail: `La concentración máxima es ${revenueConcentration.value}%, con comportamiento más estable entre periodos.`,
          type: "opportunity"
        });
      }
      if (revenueMomentum.value < alertThresholds.value.momentumMin) {
        signals.push({
          title: "Desaceleración reciente",
          detail: `El último periodo está en ${revenueMomentum.value}% vs anterior, bajo el mínimo (${alertThresholds.value.momentumMin}%). Activa campañas de recuperación y bundles.`,
          type: "risk"
        });
      } else {
        signals.push({
          title: "Tracción positiva",
          detail: `El último periodo creció ${revenueMomentum.value}% vs el anterior. Oportunidad para reforzar inversión.`,
          type: "opportunity"
        });
      }
      return signals;
    });
    const simulatedPaidOrders = computed(() => {
      const totalOrders = Number(summary.value.total_orders || 0);
      return Math.round(totalOrders * (Number(simulator.value.approvalRate || 0) / 100));
    });
    const simulatedRevenue = computed(() => {
      return Math.round(simulatedPaidOrders.value * Number(simulator.value.avgTicket || 0));
    });
    computed(() => {
      return simulatedRevenue.value - Number(summary.value.total_revenue || 0);
    });
    watch(
      () => summary.value.avg_ticket,
      (ticket) => {
        if (!simulator.value.avgTicket && Number(ticket || 0) > 0) {
          simulator.value.avgTicket = Math.round(Number(ticket || 0));
        }
      },
      { immediate: true }
    );
    watch(
      alertThresholds,
      (value) => {
        return;
      },
      { deep: true }
    );
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
        NC: "N cuotas",
        MARKETPLACE: "Marketplace"
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
    const getPreviousRange = () => {
      const { granularity, year, month, quarter, start, end } = filters.value;
      if (granularity === "day") {
        const current = getRange();
        const startDate = new Date(current.start);
        const endDate = new Date(current.end);
        const span = Math.max(Math.floor((endDate.getTime() - startDate.getTime()) / 864e5) + 1, 1);
        const prevEnd = new Date(startDate);
        prevEnd.setDate(prevEnd.getDate() - 1);
        const prevStart = new Date(prevEnd);
        prevStart.setDate(prevStart.getDate() - (span - 1));
        return { start: prevStart.toISOString().slice(0, 10), end: prevEnd.toISOString().slice(0, 10) };
      }
      if (granularity === "month") {
        const prevMonthStart = new Date(year, month - 2, 1);
        const prevMonthEnd = new Date(year, month - 1, 0);
        return { start: prevMonthStart.toISOString().slice(0, 10), end: prevMonthEnd.toISOString().slice(0, 10) };
      }
      if (granularity === "quarter") {
        const startMonth = (quarter - 1) * 3;
        const prevQuarterStart = new Date(year, startMonth - 3, 1);
        const prevQuarterEnd = new Date(year, startMonth, 0);
        return { start: prevQuarterStart.toISOString().slice(0, 10), end: prevQuarterEnd.toISOString().slice(0, 10) };
      }
      const prevYearStart = new Date(year - 1, 0, 1);
      const prevYearEnd = new Date(year - 1, 11, 31);
      return { start: prevYearStart.toISOString().slice(0, 10), end: prevYearEnd.toISOString().slice(0, 10) };
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/analisis-financiero.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=analisis-financiero-wh6-p_Rg.mjs.map
