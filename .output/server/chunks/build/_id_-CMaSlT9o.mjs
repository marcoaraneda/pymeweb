import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { g as useRoute, b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
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
import 'vue-router';
import './theme-CB1SKex-.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    useTenantStore();
    const slug = route.params.slug;
    const id = route.params.id;
    const order = ref(null);
    const loading = ref(true);
    const selectedStatus = ref("");
    const toastMessage = ref("");
    const toastType = ref("success");
    const statusOptions = [
      { value: "pending", label: "Pendiente" },
      { value: "preparing", label: "Preparando" },
      { value: "in_transit", label: "En tránsito" },
      { value: "delivered", label: "Llegó a destino" },
      { value: "completed", label: "Finalizado" },
      { value: "cancelled", label: "Cancelado" }
    ];
    const currency = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(Number(value) || 0);
    const statusBadge = (status) => {
      const map = {
        pending: { label: "Pendiente", classes: "bg-amber-100 text-amber-700" },
        preparing: { label: "Preparando", classes: "bg-blue-100 text-blue-700" },
        in_transit: { label: "En tránsito", classes: "bg-indigo-100 text-indigo-700" },
        delivered: { label: "Llegó a destino", classes: "bg-emerald-100 text-emerald-700" },
        completed: { label: "Finalizado", classes: "bg-slate-200 text-slate-800" },
        cancelled: { label: "Cancelado", classes: "bg-red-100 text-red-700" }
      };
      return map[status || ""] || { label: status || "", classes: "bg-slate-100 text-slate-700" };
    };
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
    const loadOrder = async () => {
      loading.value = true;
      try {
        order.value = await authedFetch(`${config.public.apiBase}/orders/${id}/`);
        selectedStatus.value = order.value?.status || "pending";
      } catch (e) {
        console.error("Error cargando pedido", e);
        order.value = null;
      } finally {
        loading.value = false;
      }
    };
    watch(
      () => route.params.id,
      async () => {
        await loadOrder();
      }
    );
    const formatDate = (date) => date ? new Date(date).toLocaleString("es-CL") : "";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 px-4 py-10" }, _attrs))}>`);
      if (toastMessage.value) {
        _push(`<div class="${ssrRenderClass([
          "fixed right-4 top-4 z-50 w-72 rounded-lg border px-4 py-3 text-sm shadow-lg shadow-slate-200/60 transition duration-300",
          toastType.value === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
        ])}" role="status" aria-live="polite">${ssrInterpolate(toastMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mx-auto max-w-5xl space-y-6"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}/admin/orders`,
        class: "text-sm font-semibold text-slate-600 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Volver a pedidos`);
          } else {
            return [
              createTextVNode("← Volver a pedidos")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}/success?order=${unref(id)}`,
        class: "text-sm text-blue-600 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Ver boleta/seguimiento`);
          } else {
            return [
              createTextVNode("Ver boleta/seguimiento")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="rounded-2xl border border-slate-200 bg-white/80 shadow-lg ring-1 ring-slate-100"><div class="flex flex-col gap-4 border-b border-dashed border-slate-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Pedido</p><h1 class="text-3xl font-bold text-slate-900">#${ssrInterpolate(order.value?.id)}</h1><p class="text-sm text-slate-500">${ssrInterpolate(formatDate(order.value?.created_at))}</p><p class="text-xs text-slate-500">Tracking: ${ssrInterpolate(order.value?.tracking_code)}</p></div><div class="flex flex-wrap items-center gap-3"><span class="${ssrRenderClass(["rounded-full px-3 py-1 text-xs font-semibold", statusBadge(order.value?.status).classes])}">${ssrInterpolate(statusBadge(order.value?.status).label)}</span><select class="rounded-lg border border-slate-200 px-3 py-2 text-sm"><!--[-->`);
      ssrRenderList(statusOptions, (status) => {
        _push(`<option${ssrRenderAttr("value", status.value)}${ssrIncludeBooleanAttr(Array.isArray(selectedStatus.value) ? ssrLooseContain(selectedStatus.value, status.value) : ssrLooseEqual(selectedStatus.value, status.value)) ? " selected" : ""}>${ssrInterpolate(status.label)}</option>`);
      });
      _push(`<!--]--></select></div></div>`);
      if (loading.value) {
        _push(`<div class="px-6 py-6 text-slate-500">Cargando pedido...</div>`);
      } else if (!order.value) {
        _push(`<div class="px-6 py-6 text-red-500">Pedido no encontrado</div>`);
      } else {
        _push(`<div class="grid gap-6 px-6 py-6 md:grid-cols-[1.1fr,0.9fr]"><section class="rounded-xl border border-slate-100 bg-slate-50/60 p-5 space-y-3"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold text-slate-900">Datos del cliente</h2><p class="text-xs text-slate-500">${ssrInterpolate(order.value.email)}</p></div><p class="text-sm text-slate-700"><span class="text-slate-500">Nombre:</span> ${ssrInterpolate(order.value.name)}</p><p class="text-sm text-slate-700"><span class="text-slate-500">Teléfono:</span> ${ssrInterpolate(order.value.phone)}</p><p class="text-sm text-slate-700"><span class="text-slate-500">Dirección:</span> ${ssrInterpolate(order.value.address)}</p><p class="text-sm text-slate-700"><span class="text-slate-500">Estado actual:</span> ${ssrInterpolate(statusBadge(order.value.status).label)}</p></section><section class="rounded-xl border border-slate-100 bg-slate-50/60 p-5 space-y-4"><h2 class="text-lg font-semibold text-slate-900">Detalle</h2><div class="divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(order.value.items, (item) => {
          _push(`<div class="flex items-center justify-between py-3 text-sm text-slate-700"><div><p class="font-semibold text-slate-900">${ssrInterpolate(item.product_name)}</p><p class="text-xs text-slate-500">Cant. ${ssrInterpolate(item.quantity)}</p></div><p class="font-semibold text-slate-900">${ssrInterpolate(currency(item.price * item.quantity))}</p></div>`);
        });
        _push(`<!--]--></div><div class="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900"><span>Total</span><span>${ssrInterpolate(currency(order.value.total))}</span></div></section></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/orders/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-CMaSlT9o.mjs.map
