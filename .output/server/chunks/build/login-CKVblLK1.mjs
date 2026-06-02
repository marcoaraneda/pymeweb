import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import { b as useAuthStore } from './server.mjs';
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
    const auth = useAuthStore();
    const theme = useThemeStore();
    const loading = ref(false);
    const credentials = reactive({ username: "", password: "" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page-enter relative min-h-screen bg-slate-950 text-white" }, _attrs))}><div class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute -left-24 top-10 h-80 w-80 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-70"></div><div class="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-60"></div></div><div class="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16"><div class="hidden flex-1 lg:block"><div class="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur"><p class="text-sm uppercase tracking-[0.2em] text-white/70">Pymeweb</p><h1 class="mt-4 text-4xl font-extrabold leading-tight">Bienvenido de vuelta</h1><p class="mt-3 text-lg text-white/70">Gestiona tus tiendas, explora el marketplace y ajusta los colores a tu marca desde un solo lugar.</p><div class="mt-8 space-y-4"><div class="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-white/80"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">1</div><div><p class="text-sm font-semibold">Inicia sesión</p><p class="text-xs text-white/60">Usa tus credenciales de administrador o colaborador.</p></div></div><div class="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-white/80"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">2</div><div><p class="text-sm font-semibold">Personaliza</p><p class="text-xs text-white/60">Ajusta el color de acento y el fondo para tu marca.</p></div></div><div class="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3 text-white/80"><div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg">3</div><div><p class="text-sm font-semibold">Explora</p><p class="text-xs text-white/60">Entra a tus tiendas o visita todas las disponibles.</p></div></div></div></div></div><div class="flex-1"><div class="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur"><p class="text-sm uppercase tracking-[0.2em] text-white/70">Acceso</p><h2 class="mt-3 text-2xl font-bold">Inicia sesión</h2><p class="text-white/60">Usa tu usuario, email o RUT y tu contraseña.</p><form class="mt-6 space-y-4"><div class="space-y-2"><label class="text-sm text-white/80">Usuario, email o RUT</label><input${ssrRenderAttr("value", credentials.username)} type="text" required class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" placeholder="ej: admin o 12.345.678-5"></div><div class="space-y-2"><label class="text-sm text-white/80">Contraseña</label><input${ssrRenderAttr("value", credentials.password)} type="password" required class="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 outline-none transition focus:border-white/60" placeholder="••••••••"></div>`);
      if (unref(auth).error) {
        _push(`<div class="rounded-xl border border-red-400/30 bg-red-500/20 px-4 py-3 text-sm text-red-100">${ssrInterpolate(unref(auth).error)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white shadow-lg shadow-black/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" style="${ssrRenderStyle({ backgroundColor: unref(theme).accent })}"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      if (!loading.value) {
        _push(`<span>Entrar</span>`);
      } else {
        _push(`<span class="flex items-center gap-2"><span class="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"></span> Validando... </span>`);
      }
      _push(`</button><p class="text-xs text-white/60"> ¿No tienes cuenta? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Regístrate aquí`);
          } else {
            return [
              createTextVNode("Regístrate aquí")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></form></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-CKVblLK1.mjs.map
