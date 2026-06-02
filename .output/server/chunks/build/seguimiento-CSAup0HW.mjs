import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderClass } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import './server.mjs';
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
  __name: "seguimiento",
  __ssrInlineRender: true,
  setup(__props) {
    const theme = useThemeStore();
    useRoute();
    const trackingCode = ref("");
    const loading = ref(false);
    const error = ref("");
    const order = ref(null);
    const formatClp = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0);
    const formatDate = (value) => new Date(value).toLocaleString("es-CL");
    const statusLabel = (status) => {
      const map = {
        pending: "Pendiente",
        preparing: "Preparando",
        in_transit: "En transito",
        delivered: "Entregado",
        completed: "Finalizado",
        cancelled: "Cancelado"
      };
      return map[status] || status;
    };
    const statusBadge = (status) => {
      const map = {
        pending: "bg-amber-100 text-amber-800",
        preparing: "bg-amber-100 text-amber-800",
        in_transit: "bg-sky-100 text-sky-800",
        delivered: "bg-emerald-100 text-emerald-800",
        completed: "bg-emerald-100 text-emerald-800",
        cancelled: "bg-rose-100 text-rose-800"
      };
      return map[status] || "bg-slate-100 text-slate-700";
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 px-4 py-10" }, _attrs))}><div class="mx-auto max-w-3xl space-y-6"><header><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Pedidos</p><h1 class="text-3xl font-bold text-slate-900">Ver seguimiento</h1><p class="text-slate-600">Ingresa tu codigo de seguimiento para ver el estado del pedido.</p></header><section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"><div class="grid gap-3 sm:grid-cols-[1fr,auto]"><input${ssrRenderAttr("value", trackingCode.value)} type="text" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" placeholder="Ej: AB12CD34EF"><button class="rounded-xl px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60" style="${ssrRenderStyle({ backgroundColor: unref(theme).accent || "#2563eb" })}"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(loading.value ? "Consultando..." : "Buscar")}</button></div>`);
      if (error.value) {
        _push(`<p class="text-sm text-red-600">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
      if (order.value) {
        _push(`<section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"><div class="flex items-center justify-between gap-3"><p class="text-sm text-slate-500">Codigo: <span class="font-semibold text-slate-800">${ssrInterpolate(order.value.tracking_code)}</span></p><span class="${ssrRenderClass(["rounded-full px-3 py-1 text-xs font-semibold", statusBadge(order.value.status)])}">${ssrInterpolate(statusLabel(order.value.status))}</span></div><div class="grid gap-3 sm:grid-cols-2 text-sm"><p class="text-slate-700"><span class="text-slate-500">Cliente:</span> ${ssrInterpolate(order.value.masked_name)}</p><p class="text-slate-700"><span class="text-slate-500">Email:</span> ${ssrInterpolate(order.value.masked_email)}</p><p class="text-slate-700"><span class="text-slate-500">Telefono:</span> ${ssrInterpolate(order.value.masked_phone)}</p><p class="text-slate-700"><span class="text-slate-500">Direccion:</span> ${ssrInterpolate(order.value.masked_address)}</p><p class="text-slate-700"><span class="text-slate-500">Total:</span> ${ssrInterpolate(formatClp(order.value.total))}</p><p class="text-slate-700"><span class="text-slate-500">Fecha:</span> ${ssrInterpolate(formatDate(order.value.created_at))}</p></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/seguimiento.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=seguimiento-CSAup0HW.mjs.map
