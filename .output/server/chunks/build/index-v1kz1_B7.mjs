import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { h as useRoute, b as useAuthStore } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useAuthStore();
    const store = ref(null);
    const stats = ref(null);
    computed(() => route.params.slug);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-screen bg-slate-950 text-white" }, _attrs))}><div class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute -left-10 top-10 h-60 w-60 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-70"></div><div class="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-60"></div></div><div class="relative z-10 mx-auto max-w-6xl px-6 py-10 space-y-10"><header class="flex flex-wrap items-center justify-between gap-4"><div><p class="text-xs uppercase tracking-[0.2em] text-white/60">Admin</p><h1 class="text-3xl font-extrabold">${ssrInterpolate(unref(store)?.name || "Tienda")}</h1><p class="text-white/70">Panel de administración de tu tienda</p></div><div class="flex flex-wrap items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(route).params.slug}`,
        class: "rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ver tienda `);
          } else {
            return [
              createTextVNode(" Ver tienda ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="rounded-xl bg-red-600/20 px-4 py-2 text-sm font-semibold text-red-100 transition hover:bg-red-600/30 border border-red-600/30"> Cerrar sesión </button></div></header><nav class="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "productos",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>📦</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>Productos</h3><p class="text-xs text-white/60"${_scopeId}>Inventario y catálogo</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "📦"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "Productos"),
              createVNode("p", { class: "text-xs text-white/60" }, "Inventario y catálogo")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "orders",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>🛒</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>Órdenes</h3><p class="text-xs text-white/60"${_scopeId}>Historial de ventas</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "🛒"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "Órdenes"),
              createVNode("p", { class: "text-xs text-white/60" }, "Historial de ventas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "inventario",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>📊</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>Inventario</h3><p class="text-xs text-white/60"${_scopeId}>Stock y movimientos</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "📊"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "Inventario"),
              createVNode("p", { class: "text-xs text-white/60" }, "Stock y movimientos")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "reportes",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>📈</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>Reportes</h3><p class="text-xs text-white/60"${_scopeId}>Análisis y métricas</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "📈"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "Reportes"),
              createVNode("p", { class: "text-xs text-white/60" }, "Análisis y métricas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "cms",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>✏️</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>CMS</h3><p class="text-xs text-white/60"${_scopeId}>Contenido y páginas</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "✏️"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "CMS"),
              createVNode("p", { class: "text-xs text-white/60" }, "Contenido y páginas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "resenas",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>⭐</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>Reseñas</h3><p class="text-xs text-white/60"${_scopeId}>Comentarios de clientes</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "⭐"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "Reseñas"),
              createVNode("p", { class: "text-xs text-white/60" }, "Comentarios de clientes")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "faq",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>❓</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>FAQ</h3><p class="text-xs text-white/60"${_scopeId}>Preguntas frecuentes</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "❓"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "FAQ"),
              createVNode("p", { class: "text-xs text-white/60" }, "Preguntas frecuentes")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "pagos",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>💳</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>Pagos</h3><p class="text-xs text-white/60"${_scopeId}>Métodos y payouts</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "💳"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "Pagos"),
              createVNode("p", { class: "text-xs text-white/60" }, "Métodos y payouts")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "settings",
        class: "group rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur transition hover:border-white/30 hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="mb-2 text-2xl"${_scopeId}>⚙️</div><h3 class="font-semibold group-hover:text-white/80"${_scopeId}>Configuración</h3><p class="text-xs text-white/60"${_scopeId}>Diseño y general</p>`);
          } else {
            return [
              createVNode("div", { class: "mb-2 text-2xl" }, "⚙️"),
              createVNode("h3", { class: "font-semibold group-hover:text-white/80" }, "Configuración"),
              createVNode("p", { class: "text-xs text-white/60" }, "Diseño y general")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav>`);
      if (unref(stats)) {
        _push(`<div class="grid grid-cols-2 gap-4 md:grid-cols-4"><div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Productos</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(stats).products || 0)}</p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Órdenes</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(stats).orders || 0)}</p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Total Ventas</p><p class="mt-2 text-2xl font-bold">$${ssrInterpolate(unref(stats).total_sales || 0)}</p></div><div class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><p class="text-xs uppercase tracking-[0.2em] text-white/60">Rating</p><p class="mt-2 text-2xl font-bold">${ssrInterpolate(unref(stats).rating || 0)}⭐</p></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-v1kz1_B7.mjs.map
