import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { b as useAuthStore } from './server.mjs';
import { Heart, ChevronRight } from 'lucide-vue-next';
import { u as useFavorites } from './useFavorites-BLT7MOEn.mjs';

const _imports_0 = publicAssetsURL("/tailwind-trash.svg");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "StoreCard",
  __ssrInlineRender: true,
  props: {
    store: {},
    accent: {},
    canDelete: { type: Boolean }
  },
  emits: ["delete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const accent = computed(() => props.accent || "#2563eb");
    const badgeStyle = computed(() => ({ backgroundColor: accent.value }));
    const buttonStyle = computed(() => ({ backgroundColor: accent.value }));
    const glowStyle = computed(() => ({ background: `radial-gradient(circle at 30% 30%, ${accent.value}1a, transparent 55%)` }));
    const logo = computed(() => props.store.logo_url || (typeof props.store.logo === "string" ? props.store.logo : props.store.logo?.url) || "");
    const canDelete = computed(() => Boolean(props.canDelete));
    const { isStoreFavorite } = useFavorites();
    useAuthStore();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "group relative cursor-pointer overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl",
        role: "link",
        tabindex: "0"
      }, _attrs))}><div class="absolute inset-0 opacity-0 transition group-hover:opacity-100" style="${ssrRenderStyle(glowStyle.value)}" aria-hidden="true"></div><div class="relative p-5 space-y-3"><button type="button" class="${ssrRenderClass([unref(isStoreFavorite)(__props.store.slug) ? "border-rose-200 text-rose-600" : "border-slate-200 text-slate-500", "absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white text-sm font-semibold shadow transition hover:text-rose-500"])}"${ssrRenderAttr("aria-pressed", unref(isStoreFavorite)(__props.store.slug))} aria-label="Marcar tienda como favorita">`);
      _push(ssrRenderComponent(unref(Heart), {
        class: ["h-4 w-4", unref(isStoreFavorite)(__props.store.slug) ? "fill-current text-rose-600" : "text-slate-500"]
      }, null, _parent));
      _push(`</button>`);
      if (canDelete.value) {
        _push(`<button class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 shadow-sm transition hover:-translate-y-0.5 hover:text-red-600" title="Eliminar tienda" aria-label="Eliminar tienda"><img${ssrRenderAttr("src", _imports_0)} alt="Eliminar" class="h-5 w-5 text-red-500" style="${ssrRenderStyle({ "filter": "invert(27%) sepia(99%) saturate(7492%) hue-rotate(357deg) brightness(97%) contrast(119%)" })}"></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex items-center gap-3"><div class="h-12 w-12 overflow-hidden rounded-xl bg-blue-100 shadow-inner ring-1 ring-blue-200">`);
      if (logo.value) {
        _push(`<img${ssrRenderAttr("src", logo.value)} alt="Logo" class="h-full w-full object-cover">`);
      } else {
        _push(`<div class="flex h-full w-full items-center justify-center text-xl" style="${ssrRenderStyle(badgeStyle.value)}">🏪</div>`);
      }
      _push(`</div><div class="min-w-0"><p class="text-xs uppercase tracking-[0.15em] text-slate-500">Tienda</p><p class="truncate text-lg font-semibold text-slate-900">${ssrInterpolate(__props.store.name)}</p></div></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: { path: "/store/" + __props.store.slug },
        class: "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
        style: buttonStyle.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Entrar a la tienda `);
            _push2(ssrRenderComponent(unref(ChevronRight), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Entrar a la tienda "),
              createVNode(unref(ChevronRight), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StoreCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const StoreCard = Object.assign(_sfc_main, { __name: "StoreCard" });

export { StoreCard as S };
//# sourceMappingURL=StoreCard-CecvbcL6.mjs.map
