import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAuthStore } from './auth-8-vC_PDE.mjs';
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
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const email = ref("");
    const password = ref("");
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mx-auto max-w-md px-4 py-8" }, _attrs))} data-v-e5af7d3a><div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur" data-v-e5af7d3a><h1 class="text-2xl font-semibold mb-4" data-v-e5af7d3a>Ingresar</h1><form class="space-y-4" data-v-e5af7d3a><div data-v-e5af7d3a><label class="block text-sm text-white/80 mb-1" data-v-e5af7d3a>Email</label><input${ssrRenderAttr("value", unref(email))} type="email" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" data-v-e5af7d3a></div><div data-v-e5af7d3a><label class="block text-sm text-white/80 mb-1" data-v-e5af7d3a>Contraseña</label><input${ssrRenderAttr("value", unref(password))} type="password" required class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm" data-v-e5af7d3a></div><div class="flex items-center justify-between" data-v-e5af7d3a><button class="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white" data-v-e5af7d3a>Ingresar</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "text-sm text-cyan-200"
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
      _push(`</div>`);
      if (unref(error)) {
        _push(`<div class="text-sm text-rose-400" data-v-e5af7d3a>${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const login = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e5af7d3a"]]);

export { login as default };
//# sourceMappingURL=login-D3mThyp3.mjs.map
