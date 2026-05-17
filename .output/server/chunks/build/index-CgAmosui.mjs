import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, createBlock, createVNode, openBlock, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { g as useRoute } from './server.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pinia';
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
    const theme = useThemeStore();
    const slug = computed(() => route.params.slug);
    const products = ref([]);
    const loading = ref(false);
    const loadProducts = async () => {
      loading.value = true;
      try {
        const data = await $fetch(`/api/catalogo/productos/?store=${slug.value}`);
        products.value = data.results || data || [];
      } catch (error) {
        console.error("Error cargando productos:", error);
        products.value = [];
      } finally {
        loading.value = false;
      }
    };
    watch(() => route.params.slug, () => {
      loadProducts();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-wrap items-center justify-between gap-4"><div><h2 class="text-2xl font-bold">Productos</h2><p class="text-white/70">Gestiona el catálogo de tu tienda</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "nuevo",
        class: "rounded-xl px-6 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5",
        style: { backgroundColor: unref(theme).accent }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` + Nuevo Producto `);
          } else {
            return [
              createTextVNode(" + Nuevo Producto ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"><div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white"></div><p class="mt-4 text-white/70">Cargando productos...</p></div>`);
      } else if (!unref(products).length) {
        _push(`<div class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur"><div class="text-4xl">📦</div><p class="mt-4 font-semibold">No hay productos</p><p class="text-white/70">Comienza creando tu primer producto</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "nuevo",
          class: "mt-4 inline-block rounded-xl px-6 py-2 font-semibold text-white",
          style: { backgroundColor: unref(theme).accent }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Crear Producto `);
            } else {
              return [
                createTextVNode(" Crear Producto ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: product.id,
            to: `${product.slug}`,
            class: "group rounded-2xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur transition hover:border-white/30 hover:bg-white/10"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (product.image_url) {
                  _push2(`<div class="aspect-square overflow-hidden bg-white/10"${_scopeId}><img${ssrRenderAttr("src", product.image_url)}${ssrRenderAttr("alt", product.name)} class="h-full w-full object-cover transition group-hover:scale-110"${_scopeId}></div>`);
                } else {
                  _push2(`<div class="aspect-square flex items-center justify-center bg-white/10"${_scopeId}><div class="text-4xl opacity-50"${_scopeId}>📷</div></div>`);
                }
                _push2(`<div class="p-4"${_scopeId}><h3 class="font-semibold truncate group-hover:text-white/80"${_scopeId}>${ssrInterpolate(product.name)}</h3><p class="text-sm text-white/60"${_scopeId}>${ssrInterpolate(product.category?.name || "Sin categoría")}</p><div class="mt-3 flex items-center justify-between"${_scopeId}><div${_scopeId}><p class="text-xs text-white/60"${_scopeId}>Precio</p><p class="font-bold"${_scopeId}>$${ssrInterpolate(product.price)}</p></div><div${_scopeId}><p class="text-xs text-white/60"${_scopeId}>Stock</p><p class="font-bold"${_scopeId}>${ssrInterpolate(product.stock || 0)}</p></div></div>`);
                if (product.is_active) {
                  _push2(`<div class="mt-3 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-100 text-center"${_scopeId}> Activo </div>`);
                } else {
                  _push2(`<div class="mt-3 rounded-full bg-slate-600/20 px-3 py-1 text-xs font-semibold text-slate-100 text-center"${_scopeId}> Inactivo </div>`);
                }
                _push2(`</div>`);
              } else {
                return [
                  product.image_url ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "aspect-square overflow-hidden bg-white/10"
                  }, [
                    createVNode("img", {
                      src: product.image_url,
                      alt: product.name,
                      class: "h-full w-full object-cover transition group-hover:scale-110"
                    }, null, 8, ["src", "alt"])
                  ])) : (openBlock(), createBlock("div", {
                    key: 1,
                    class: "aspect-square flex items-center justify-center bg-white/10"
                  }, [
                    createVNode("div", { class: "text-4xl opacity-50" }, "📷")
                  ])),
                  createVNode("div", { class: "p-4" }, [
                    createVNode("h3", { class: "font-semibold truncate group-hover:text-white/80" }, toDisplayString(product.name), 1),
                    createVNode("p", { class: "text-sm text-white/60" }, toDisplayString(product.category?.name || "Sin categoría"), 1),
                    createVNode("div", { class: "mt-3 flex items-center justify-between" }, [
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-white/60" }, "Precio"),
                        createVNode("p", { class: "font-bold" }, "$" + toDisplayString(product.price), 1)
                      ]),
                      createVNode("div", null, [
                        createVNode("p", { class: "text-xs text-white/60" }, "Stock"),
                        createVNode("p", { class: "font-bold" }, toDisplayString(product.stock || 0), 1)
                      ])
                    ]),
                    product.is_active ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "mt-3 rounded-full bg-green-600/20 px-3 py-1 text-xs font-semibold text-green-100 text-center"
                    }, " Activo ")) : (openBlock(), createBlock("div", {
                      key: 1,
                      class: "mt-3 rounded-full bg-slate-600/20 px-3 py-1 text-xs font-semibold text-slate-100 text-center"
                    }, " Inactivo "))
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/productos/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CgAmosui.mjs.map
