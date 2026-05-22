import { _ as __nuxt_component_0 } from './nuxt-link-B3CXVFFV.mjs';
import { defineComponent, computed, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, c as useRoute } from './server.mjs';
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
  __name: "[...slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const currentPath = computed(() => route.path);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 py-12 sm:px-6" }, _attrs))} data-v-26a55871><div class="grid gap-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8 lg:grid-cols-[1.2fr,0.8fr]" data-v-26a55871><div data-v-26a55871><p class="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80" data-v-26a55871>Ruta en desarrollo</p><h1 class="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl" data-v-26a55871> Esta página todavía no tiene una vista dedicada. </h1><p class="mt-4 max-w-2xl text-base leading-7 text-white/75 sm:text-lg" data-v-26a55871> La app ya carga con su layout compartido, y esta ruta evita el 404 mientras completamos las pantallas específicas. </p><div class="mt-6 flex flex-wrap gap-3" data-v-26a55871>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Volver al inicio `);
          } else {
            return [
              createTextVNode(" Volver al inicio ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tiendas",
        class: "rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ver tiendas `);
          } else {
            return [
              createTextVNode(" Ver tiendas ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-8 grid gap-3 sm:grid-cols-3" data-v-26a55871><div class="rounded-2xl border border-white/10 bg-black/15 p-4" data-v-26a55871><p class="text-xs uppercase tracking-[0.18em] text-white/45" data-v-26a55871>Estado</p><p class="mt-1 font-semibold text-white" data-v-26a55871>200 OK</p></div><div class="rounded-2xl border border-white/10 bg-black/15 p-4" data-v-26a55871><p class="text-xs uppercase tracking-[0.18em] text-white/45" data-v-26a55871>Ruta</p><p class="mt-1 font-semibold text-white" data-v-26a55871>${ssrInterpolate(unref(currentPath))}</p></div><div class="rounded-2xl border border-white/10 bg-black/15 p-4" data-v-26a55871><p class="text-xs uppercase tracking-[0.18em] text-white/45" data-v-26a55871>Modo</p><p class="mt-1 font-semibold text-white" data-v-26a55871>Fallback SPA</p></div></div></div><aside class="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-5 text-white shadow-inner" data-v-26a55871><p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80" data-v-26a55871>Navegación rápida</p><div class="mt-4 space-y-3 text-sm" data-v-26a55871>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "quick-link",
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
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "quick-link",
        to: "/register"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Crear cuenta`);
          } else {
            return [
              createTextVNode("Crear cuenta")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "quick-link",
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
        class: "quick-link",
        to: "/notificaciones"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Notificaciones`);
          } else {
            return [
              createTextVNode("Notificaciones")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "quick-link",
        to: "/dashboard"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dashboard`);
          } else {
            return [
              createTextVNode("Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></aside></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[...slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ____slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-26a55871"]]);

export { ____slug_ as default };
//# sourceMappingURL=_...slug_--GTaSfyj.mjs.map
