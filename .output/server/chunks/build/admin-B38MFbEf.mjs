import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
import { Package, Tag, Star, Palette, CircleHelp, Wallet } from 'lucide-vue-next';
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
import './theme-LeBKALXb.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const tenant = useTenantStore();
    const slug = computed(() => {
      const fromRoute = route.params.slug;
      if (fromRoute && !tenant.slug) tenant.setSlug(fromRoute);
      return fromRoute || tenant.slug || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "premium-shell flex h-screen bg-slate-100" }, _attrs))} data-v-7cc7f1fe><aside class="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6" data-v-7cc7f1fe><h2 class="font-bold text-2xl mb-10 tracking-wide" data-v-7cc7f1fe> PymeAdmin </h2><nav class="space-y-2" data-v-7cc7f1fe>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}/admin/inventario`,
        class: "nav-link flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Package), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Inventario `);
          } else {
            return [
              createVNode(unref(Package), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" Inventario ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}/productos`,
        class: "nav-link flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Tag), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Productos `);
          } else {
            return [
              createVNode(unref(Tag), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" Productos ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}/admin/resenas`,
        class: "nav-link flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Star), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Reseñas `);
          } else {
            return [
              createVNode(unref(Star), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" Reseñas ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}/admin/cms`,
        class: "nav-link flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Palette), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Personalización `);
          } else {
            return [
              createVNode(unref(Palette), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" Personalización ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}/admin/faq`,
        class: "nav-link flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(CircleHelp), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` FAQ `);
          } else {
            return [
              createVNode(unref(CircleHelp), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" FAQ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}/admin/pagos`,
        class: "nav-link flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Wallet), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Pagos `);
          } else {
            return [
              createVNode(unref(Wallet), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" Pagos ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></aside><main class="flex-1 overflow-y-auto p-10" data-v-7cc7f1fe>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7cc7f1fe"]]);

export { admin as default };
//# sourceMappingURL=admin-B38MFbEf.mjs.map
