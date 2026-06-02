import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { _ as _export_sfc } from './server.mjs';
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
  __name: "orden",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const order = ref(null);
    const loading = ref(true);
    const error = ref("");
    const slug = route.params.slug;
    const formatDate = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleString();
    };
    const formatMoney = (value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00";
    };
    const statusClass = (status) => {
      if (status === "paid") return "text-green-600";
      if (status === "pending") return "text-yellow-600";
      return "text-slate-600";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white px-4 py-10" }, _attrs))} data-v-1e71f919><div class="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-8 shadow print:shadow-none print:border-0" data-v-1e71f919><div class="flex items-center justify-between mb-6" data-v-1e71f919><h1 class="text-2xl font-bold text-amber-700" data-v-1e71f919>Boleta de Compra</h1><button class="hidden print:block" data-v-1e71f919>Imprimir</button></div>`);
      if (loading.value) {
        _push(`<div class="text-slate-500" data-v-1e71f919>Cargando orden...</div>`);
      } else if (error.value) {
        _push(`<div class="text-red-600" data-v-1e71f919>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<div data-v-1e71f919><div class="mb-4 space-y-1" data-v-1e71f919><p class="text-sm text-slate-600 font-bold" data-v-1e71f919>Orden #${ssrInterpolate(order.value.id)}</p><p class="text-sm text-slate-600" data-v-1e71f919>Fecha: ${ssrInterpolate(formatDate(order.value.created_at))}</p><p class="text-sm text-slate-600" data-v-1e71f919>Estado: <span class="${ssrRenderClass(statusClass(order.value.status))}" data-v-1e71f919>${ssrInterpolate(order.value.status)}</span></p><p class="text-sm text-slate-600" data-v-1e71f919>Tracking: `);
        if (order.value.tracking_code) {
          _push(`<span data-v-1e71f919>${ssrInterpolate(order.value.tracking_code)}</span>`);
        } else {
          _push(`<span data-v-1e71f919>-</span>`);
        }
        _push(`</p></div><div class="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-700" data-v-1e71f919><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Cliente:</span> ${ssrInterpolate(order.value.name || order.value.customer_name || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Email:</span> ${ssrInterpolate(order.value.email || order.value.customer_email || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Teléfono:</span> ${ssrInterpolate(order.value.phone || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Dirección:</span> ${ssrInterpolate(order.value.address || "-")}</div></div><table class="w-full mb-6 text-sm border" data-v-1e71f919><thead data-v-1e71f919><tr class="bg-amber-50" data-v-1e71f919><th class="p-2 text-left" data-v-1e71f919>Producto</th><th class="p-2 text-right" data-v-1e71f919>Cantidad</th><th class="p-2 text-right" data-v-1e71f919>Precio</th><th class="p-2 text-right" data-v-1e71f919>Subtotal</th></tr></thead><tbody data-v-1e71f919><!--[-->`);
        ssrRenderList(order.value.items, (item) => {
          _push(`<tr data-v-1e71f919><td class="p-2" data-v-1e71f919>${ssrInterpolate(item.product_name)}</td><td class="p-2 text-right" data-v-1e71f919>${ssrInterpolate(item.quantity)}</td><td class="p-2 text-right" data-v-1e71f919>$${ssrInterpolate(formatMoney(item.price))}</td><td class="p-2 text-right" data-v-1e71f919>$${ssrInterpolate(formatMoney(Number(item.price) * Number(item.quantity)))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-end text-lg font-bold text-amber-700 mb-2" data-v-1e71f919> Total: $${ssrInterpolate(formatMoney(order.value.total))}</div>`);
        if (order.value.payments && order.value.payments.length) {
          _push(`<div class="mb-4" data-v-1e71f919><h2 class="text-base font-semibold text-slate-800 mb-1" data-v-1e71f919>Pago Webpay</h2><!--[-->`);
          ssrRenderList(order.value.payments, (p) => {
            _push(`<div class="border rounded-lg p-3 mb-2 bg-slate-50" data-v-1e71f919><div class="grid grid-cols-2 gap-2 text-xs" data-v-1e71f919><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Estado:</span> ${ssrInterpolate(p.status)}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Monto:</span> $${ssrInterpolate(formatMoney(p.amount))}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Tipo:</span> ${ssrInterpolate(p.payment_type_code || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Autorización:</span> ${ssrInterpolate(p.authorization_code || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Cuotas:</span> ${ssrInterpolate(p.installments_number || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Tarjeta:</span> **** **** **** ${ssrInterpolate(p.card_last4 || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Orden Webpay:</span> ${ssrInterpolate(p.buy_order || "-")}</div><div data-v-1e71f919><span class="font-semibold" data-v-1e71f919>Fecha pago:</span> ${ssrInterpolate(formatDate(p.created_at))}</div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-8 flex justify-between" data-v-1e71f919><button class="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 print:hidden" data-v-1e71f919>Imprimir boleta</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${unref(slug)}`,
          class: "rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 print:hidden"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Volver a la tienda`);
            } else {
              return [
                createTextVNode("Volver a la tienda")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/orden.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orden = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1e71f919"]]);

export { orden as default };
//# sourceMappingURL=orden-D7hXoO7S.mjs.map
