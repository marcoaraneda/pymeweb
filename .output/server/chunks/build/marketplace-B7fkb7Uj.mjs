import { _ as __nuxt_component_0 } from './ProductCard-DBFbyG2m.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import './nuxt-link-D_lROxzU.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'lucide-vue-next';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "marketplace",
  __ssrInlineRender: true,
  setup(__props) {
    const products = ref([]);
    const loading = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ProductCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-6xl px-4 py-8" }, _attrs))} data-v-9e1911cf><div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl" data-v-9e1911cf><div class="flex items-center justify-between mb-4" data-v-9e1911cf><div data-v-9e1911cf><h1 class="text-2xl font-semibold" data-v-9e1911cf>Marketplace</h1><p class="text-sm text-white/70" data-v-9e1911cf>Productos destacados y ofertas de tiendas</p></div></div>`);
      if (unref(loading)) {
        _push(`<div class="text-sm text-white/70" data-v-9e1911cf>Cargando productos...</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-v-9e1911cf><!--[-->`);
        ssrRenderList(unref(products), (p) => {
          _push(ssrRenderComponent(_component_ProductCard, {
            key: p.id,
            product: p
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (!unref(loading) && unref(products).length === 0) {
        _push(`<div class="text-sm text-white/60 mt-4" data-v-9e1911cf>No hay productos publicados aún.</div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const marketplace = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9e1911cf"]]);

export { marketplace as default };
//# sourceMappingURL=marketplace-B7fkb7Uj.mjs.map
