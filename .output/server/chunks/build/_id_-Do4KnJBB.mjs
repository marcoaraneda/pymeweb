import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = route.params.slug;
    route.params.id;
    const order = ref(null);
    const loading = ref(true);
    const formatDate = (date) => {
      return new Date(date).toLocaleString();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-3xl mx-auto py-10" }, _attrs))}><h1 class="text-3xl font-bold text-green-600 mb-6"> ¡Pedido confirmado! 🎉 </h1>`);
      if (loading.value) {
        _push(`<div class="text-gray-500"> Cargando pedido... </div>`);
      } else if (!order.value) {
        _push(`<div class="text-red-500"> No se pudo cargar el pedido. </div>`);
      } else {
        _push(`<div class="bg-white rounded-xl shadow p-6 space-y-6"><div><p><strong>Pedido Nº:</strong> ${ssrInterpolate(order.value.id)}</p><p><strong>Fecha:</strong> ${ssrInterpolate(formatDate(order.value.created_at))}</p></div><hr><div><h2 class="font-semibold text-lg mb-2">Datos del cliente</h2><p>${ssrInterpolate(order.value.name)}</p><p>${ssrInterpolate(order.value.email)}</p><p>${ssrInterpolate(order.value.phone)}</p><p>${ssrInterpolate(order.value.address)}</p></div><hr><div><h2 class="font-semibold text-lg mb-2">Productos</h2><!--[-->`);
        ssrRenderList(order.value.items, (item) => {
          _push(`<div class="flex justify-between text-sm py-1"><span>${ssrInterpolate(item.product_name)} x ${ssrInterpolate(item.quantity)}</span><span> $${ssrInterpolate(item.price * item.quantity)}</span></div>`);
        });
        _push(`<!--]--></div><hr><div class="flex justify-between text-xl font-bold"><span>Total</span><span>$${ssrInterpolate(order.value.total)}</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${unref(slug)}`,
          class: "block text-center bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-500"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Volver a la tienda `);
            } else {
              return [
                createTextVNode(" Volver a la tienda ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/success/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Do4KnJBB.mjs.map
