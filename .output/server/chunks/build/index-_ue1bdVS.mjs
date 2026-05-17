import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { b as useAuthStore } from './server.mjs';
import { u as useCartStore } from './cart-Dcn-8ZaM.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const cart = useCartStore();
    useAuthStore();
    const loadingCheckout = ref(false);
    const checkoutError = ref("");
    const checkoutRetryCooldown = ref(0);
    const cartSyncNotice = ref("");
    const cartReady = ref(false);
    ref(null);
    const checkoutDisabled = computed(() => !cartReady.value || cart.items.length === 0 || loadingCheckout.value || checkoutRetryCooldown.value > 0);
    const formatMoney = (value) => {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 px-4 py-10" }, _attrs))}><div class="mx-auto max-w-5xl space-y-6"><div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-amber-600">Marketplace</p><h1 class="text-3xl font-bold text-slate-900">Tu carrito</h1><p class="text-slate-600">Productos agregados desde el marketplace (naranja).</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/marketplace",
        class: "rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Seguir comprando `);
          } else {
            return [
              createTextVNode(" Seguir comprando ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (!cartReady.value) {
        _push(`<div class="rounded-2xl border border-dashed border-amber-200 bg-white p-6 text-slate-600"> Cargando carrito... </div>`);
      } else if (unref(cart).items.length === 0) {
        _push(`<div class="rounded-2xl border border-dashed border-amber-200 bg-white p-6 text-slate-600"> Tu carrito está vacío. Agrega productos del marketplace. </div>`);
      } else {
        _push(`<div class="grid gap-6 md:grid-cols-[2fr,1fr]"><div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(cart).items, (item) => {
          _push(`<article class="flex flex-col gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm md:flex-row md:items-center"><div class="h-24 w-full overflow-hidden rounded-xl bg-slate-100 md:h-24 md:w-28"><img${ssrRenderAttr("src", item.image || "/logoPW.png")}${ssrRenderAttr("alt", item.name)} class="h-full w-full object-cover"></div><div class="flex-1 space-y-1"><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(item.name)}</p><p class="text-sm text-slate-600">ID: ${ssrInterpolate(item.id)}</p><p class="text-base font-bold text-amber-700">$${ssrInterpolate(formatMoney(item.price))}</p><div class="flex flex-wrap items-center gap-3 pt-1"><label class="text-sm text-slate-600">Cantidad</label><input type="number" min="1" class="w-20 rounded-lg border border-amber-200 px-2 py-1 text-sm"${ssrRenderAttr("value", item.quantity)}><button class="text-sm font-semibold text-red-600">Eliminar</button></div></div></article>`);
        });
        _push(`<!--]--></div><aside class="space-y-4 rounded-2xl border border-amber-200 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><p class="text-sm font-semibold text-slate-700">Productos</p><span class="text-sm text-slate-600">${ssrInterpolate(unref(cart).totalItems)}</span></div><div class="flex items-center justify-between text-lg font-bold text-slate-900"><span>Total</span><span class="text-amber-700">$${ssrInterpolate(unref(cart).totalPrice.toFixed(2))}</span></div><div class="space-y-2 text-xs text-slate-500"><p>Este carrito es solo para compras del marketplace. Los carritos de cada tienda siguen separados.</p></div>`);
        if (cartSyncNotice.value) {
          _push(`<div class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">${ssrInterpolate(cartSyncNotice.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (checkoutError.value) {
          _push(`<div class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">${ssrInterpolate(checkoutError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: "#f59e0b" })}"${ssrIncludeBooleanAttr(checkoutDisabled.value) ? " disabled" : ""}>${ssrInterpolate(loadingCheckout.value ? "Procesando..." : checkoutRetryCooldown.value > 0 ? `Espera ${checkoutRetryCooldown.value}s` : checkoutDisabled.value ? "Completa el carrito" : "Proceder al pago")}</button><button class="w-full rounded-xl border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-800 hover:bg-amber-50"> Vaciar carrito </button></aside></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace/carrito/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-_ue1bdVS.mjs.map
