import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
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
import 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "orden",
  __ssrInlineRender: true,
  setup(__props, { expose: __expose }) {
    useRoute();
    const order = ref(null);
    const loading = ref(true);
    const error = ref("");
    const paymentNotice = ref("");
    function printBoleta() {
      globalThis.print();
    }
    __expose({ printBoleta });
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white px-4 py-10" }, _attrs))} data-v-a758498f><div class="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-white p-8 shadow print:shadow-none print:border-0" data-v-a758498f><div class="flex items-center justify-between mb-6" data-v-a758498f><h1 class="text-2xl font-bold text-amber-700" data-v-a758498f>Boleta de Compra</h1><button class="hidden print:block" data-v-a758498f>Imprimir</button></div>`);
      if (loading.value) {
        _push(`<div class="text-slate-500" data-v-a758498f>Cargando orden...</div>`);
      } else if (error.value) {
        _push(`<div class="text-red-600" data-v-a758498f>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<div data-v-a758498f>`);
        if (paymentNotice.value) {
          _push(`<div class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" data-v-a758498f>${ssrInterpolate(paymentNotice.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mb-4 space-y-1" data-v-a758498f><p class="text-sm text-slate-600 font-bold" data-v-a758498f>Orden #${ssrInterpolate(order.value.id)}</p><p class="text-sm text-slate-600" data-v-a758498f>Fecha: ${ssrInterpolate(formatDate(order.value.created_at))}</p><p class="text-sm text-slate-600" data-v-a758498f>Estado: <span class="${ssrRenderClass(statusClass(order.value.status))}" data-v-a758498f>${ssrInterpolate(order.value.status)}</span></p><p class="text-sm text-slate-600" data-v-a758498f>Tracking: `);
        if (order.value.tracking_code) {
          _push(`<span data-v-a758498f>${ssrInterpolate(order.value.tracking_code)}</span>`);
        } else {
          _push(`<span data-v-a758498f>-</span>`);
        }
        _push(`</p></div><div class="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-700" data-v-a758498f><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Cliente:</span> ${ssrInterpolate(order.value.name || order.value.customer_name || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Email:</span> ${ssrInterpolate(order.value.email || order.value.customer_email || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Teléfono:</span> ${ssrInterpolate(order.value.phone || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Dirección:</span> ${ssrInterpolate(order.value.address || "-")}</div></div><table class="w-full mb-6 text-sm border" data-v-a758498f><thead data-v-a758498f><tr class="bg-amber-50" data-v-a758498f><th class="p-2 text-left" data-v-a758498f>Producto</th><th class="p-2 text-right" data-v-a758498f>Cantidad</th><th class="p-2 text-right" data-v-a758498f>Precio</th><th class="p-2 text-right" data-v-a758498f>Subtotal</th></tr></thead><tbody data-v-a758498f><!--[-->`);
        ssrRenderList(order.value.items, (item) => {
          _push(`<tr data-v-a758498f><td class="p-2" data-v-a758498f>${ssrInterpolate(item.product_name)}</td><td class="p-2 text-right" data-v-a758498f>${ssrInterpolate(item.quantity)}</td><td class="p-2 text-right" data-v-a758498f>$${ssrInterpolate(formatMoney(item.price))}</td><td class="p-2 text-right" data-v-a758498f>$${ssrInterpolate(formatMoney(Number(item.price) * Number(item.quantity)))}</td></tr>`);
        });
        _push(`<!--]--></tbody></table><div class="flex justify-end text-lg font-bold text-amber-700 mb-2" data-v-a758498f> Total: $${ssrInterpolate(formatMoney(order.value.total))}</div>`);
        if (order.value.payments && order.value.payments.length) {
          _push(`<div class="mb-4" data-v-a758498f><h2 class="text-base font-semibold text-slate-800 mb-1" data-v-a758498f>Pago Webpay</h2><!--[-->`);
          ssrRenderList(order.value.payments, (p) => {
            _push(`<div class="border rounded-lg p-3 mb-2 bg-slate-50" data-v-a758498f><div class="grid grid-cols-2 gap-2 text-xs" data-v-a758498f><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Estado:</span> ${ssrInterpolate(p.status)}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Monto:</span> $${ssrInterpolate(formatMoney(p.amount))}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Tipo:</span> ${ssrInterpolate(p.payment_type_code || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Autorización:</span> ${ssrInterpolate(p.authorization_code || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Cuotas:</span> ${ssrInterpolate(p.installments_number || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Tarjeta:</span> **** **** **** ${ssrInterpolate(p.card_last4 || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Orden Webpay:</span> ${ssrInterpolate(p.buy_order || "-")}</div><div data-v-a758498f><span class="font-semibold" data-v-a758498f>Fecha pago:</span> ${ssrInterpolate(formatDate(p.created_at))}</div></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-8 flex justify-between" data-v-a758498f><button class="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 print:hidden" data-v-a758498f>Imprimir boleta</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/marketplace",
          class: "rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50 print:hidden"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Volver al marketplace`);
            } else {
              return [
                createTextVNode("Volver al marketplace")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace/orden.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const orden = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a758498f"]]);

export { orden as default };
//# sourceMappingURL=orden-HcQuWHWD.mjs.map
