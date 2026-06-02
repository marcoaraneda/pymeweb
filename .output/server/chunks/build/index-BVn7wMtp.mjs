import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useCartStore } from './cart-fX2c5KSU.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
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
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const placeholder = "https://via.placeholder.com/300x200.png?text=Producto";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const cart = useCartStore();
    const tenantStore = useTenantStore();
    const theme = useThemeStore();
    const route = useRoute();
    String(route.params.slug || "");
    const accentColor = computed(() => theme.accent || "#2563eb");
    const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: "#fff" }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 px-4 py-10" }, _attrs))}><div class="mx-auto max-w-6xl space-y-8"><div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Carrito</p><h1 class="text-3xl font-bold text-slate-900">Tus productos seleccionados</h1><p class="text-slate-600">Revisa cantidades y finaliza la compra en esta tienda.</p></div>`);
      if (unref(tenantStore).slug) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${unref(tenantStore).slug}/productos`,
          class: "inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← Seguir comprando `);
            } else {
              return [
                createTextVNode(" ← Seguir comprando ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(cart).items.length === 0) {
        _push(`<div class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600"> Tu carrito está vacío. Agrega productos del catálogo. </div>`);
      } else {
        _push(`<div class="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]"><div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(cart).items, (item) => {
          _push(`<article class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row"><div class="h-24 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-32"><img${ssrRenderAttr("src", item.image || placeholder)}${ssrRenderAttr("alt", item.name)} class="h-full w-full object-cover"></div><div class="flex flex-1 flex-col justify-between gap-3"><div><h2 class="text-lg font-semibold text-slate-900">${ssrInterpolate(item.name)}</h2><p class="text-sm text-slate-600">$${ssrInterpolate(item.price)} unidad</p>`);
          if (item.optionsSummary) {
            _push(`<p class="mt-1 text-xs text-slate-500">${ssrInterpolate(item.optionsSummary)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex flex-wrap items-center gap-3"><div class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"><button class="text-lg">−</button><input class="w-12 border-none bg-transparent text-center text-sm font-semibold text-slate-900 focus:outline-none" type="number"${ssrRenderAttr("value", item.quantity)} min="1"><button class="text-lg">+</button></div><p class="text-base font-bold" style="${ssrRenderStyle({ color: accentColor.value })}">$${ssrInterpolate(item.price * item.quantity)}</p></div></div><div class="flex flex-col justify-between text-right"><button class="text-sm font-semibold text-red-600 hover:text-red-700">Quitar</button></div></article>`);
        });
        _push(`<!--]--></div><aside class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"><div class="flex items-center justify-between"><h3 class="text-lg font-semibold text-slate-900">Resumen</h3><span class="text-sm text-slate-600">${ssrInterpolate(unref(cart).totalItems)} artículos</span></div><div class="space-y-2 text-sm text-slate-700"><div class="flex justify-between"><span>Subtotal</span><span>$${ssrInterpolate(unref(cart).totalPrice)}</span></div><div class="flex justify-between text-slate-500"><span>Envío</span><span>Se calcula en checkout</span></div></div><div class="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900"><span>Total</span><span>$${ssrInterpolate(unref(cart).totalPrice)}</span></div>`);
        if (unref(tenantStore).slug) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${unref(tenantStore).slug}/checkout`,
            class: "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow",
            style: accentStyle.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ir a pagar `);
              } else {
                return [
                  createTextVNode(" Ir a pagar ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</aside></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/carrito/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BVn7wMtp.mjs.map
