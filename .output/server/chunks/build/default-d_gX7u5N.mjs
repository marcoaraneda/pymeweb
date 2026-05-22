import { _ as __nuxt_component_0 } from './nuxt-link-B3CXVFFV.mjs';
import { mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
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

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-950 text-slate-100" }, _attrs))} data-v-a2ea1716><header class="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur" data-v-a2ea1716><div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6" data-v-a2ea1716>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "flex items-center gap-3 font-semibold tracking-tight text-white"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<span class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25" data-v-a2ea1716${_scopeId}> PW </span><span class="flex flex-col leading-tight" data-v-a2ea1716${_scopeId}><span class="text-base" data-v-a2ea1716${_scopeId}>Pymeweb</span><span class="text-xs font-normal text-white/60" data-v-a2ea1716${_scopeId}>Gestión digital para PYMEs</span></span>`);
      } else {
        return [
          createVNode("span", { class: "inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-600 text-sm font-black text-white shadow-lg shadow-cyan-500/25" }, " PW "),
          createVNode("span", { class: "flex flex-col leading-tight" }, [
            createVNode("span", { class: "text-base" }, "Pymeweb"),
            createVNode("span", { class: "text-xs font-normal text-white/60" }, "Gestión digital para PYMEs")
          ])
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<nav class="hidden items-center gap-2 md:flex" data-v-a2ea1716>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "nav-link",
    to: "/"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Inicio`);
      } else {
        return [
          createTextVNode("Inicio")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "nav-link",
    to: "/tiendas"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Tiendas`);
      } else {
        return [
          createTextVNode("Tiendas")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "nav-link",
    to: "/marketplace"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Marketplace`);
      } else {
        return [
          createTextVNode("Marketplace")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "nav-link",
    to: "/login"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Ingresar`);
      } else {
        return [
          createTextVNode("Ingresar")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</nav>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/tiendas",
    class: "inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-400/20"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Explorar `);
      } else {
        return [
          createTextVNode(" Explorar ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></header><main data-v-a2ea1716>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main><footer class="border-t border-white/10 bg-slate-950" data-v-a2ea1716><div class="mx-auto max-w-6xl px-4 py-6 text-sm text-white/55 sm:px-6" data-v-a2ea1716> © 2026 Pymeweb. Vende con tu propia vitrina digital. </div></footer></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a2ea1716"]]);

export { _default as default };
//# sourceMappingURL=default-d_gX7u5N.mjs.map
