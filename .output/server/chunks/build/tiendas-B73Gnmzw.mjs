import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tiendas",
  __ssrInlineRender: true,
  setup(__props) {
    const stores = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl px-4 py-8" }, _attrs))} data-v-d229f93f><div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl" data-v-d229f93f><h1 class="text-2xl font-semibold mb-2" data-v-d229f93f>Tiendas</h1><p class="text-sm text-white/70 mb-4" data-v-d229f93f>Explora las tiendas públicas registradas en Pymeweb</p>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-white/70" data-v-d229f93f>Cargando tiendas...</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-d229f93f><!--[-->`);
        ssrRenderList(unref(stores), (store) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: store.id,
            to: `/store/${store.slug}`,
            class: "block rounded-2xl border border-white/10 p-4 hover:bg-slate-900/50"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="font-semibold text-white" data-v-d229f93f${_scopeId}>${ssrInterpolate(store.name)}</div><div class="text-sm text-white/60" data-v-d229f93f${_scopeId}>${ssrInterpolate(store.description)}</div>`);
              } else {
                return [
                  createVNode("div", { class: "font-semibold text-white" }, toDisplayString(store.name), 1),
                  createVNode("div", { class: "text-sm text-white/60" }, toDisplayString(store.description), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (!unref(loading) && unref(stores).length === 0) {
        _push(`<div class="text-sm text-white/60 mt-4" data-v-d229f93f>No hay tiendas públicas aún.</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tiendas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const tiendas = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d229f93f"]]);

export { tiendas as default };
//# sourceMappingURL=tiendas-B73Gnmzw.mjs.map
