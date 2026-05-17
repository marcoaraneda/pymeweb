import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, reactive, ref, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { b as useAuthStore } from './server.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
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
import 'pinia';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "nuevo",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useAuthStore();
    const theme = useThemeStore();
    const tenantStore = useTenantStore();
    const slug = route.params.slug;
    const storeType = computed(() => String(tenantStore.data?.store_type || "retail"));
    const form = reactive({
      name: "",
      slug: "",
      brand: "",
      description: "",
      price: 0,
      offer_price: null,
      offer_min_qty: 1,
      stock_available: 0,
      stock_minimum: 0,
      category: "",
      is_featured: false,
      product_of_week: false,
      is_active: true,
      image_url: "",
      is_marketplace: false
    });
    const saving = ref(false);
    const message = ref("");
    const messageType = ref("ok");
    const categories = ref([]);
    const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const shoeSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];
    const sizeOptions = [...clothingSizes, ...shoeSizes];
    const sizeQty = reactive({});
    sizeOptions.forEach((size) => {
      sizeQty[size] = 0;
    });
    const selectedCategoryName = computed(() => {
      const selected = categories.value.find((cat) => String(cat.id) === String(form.category));
      return String(selected?.name || "").toLowerCase();
    });
    computed(() => {
      if (storeType.value !== "fast_food") return null;
      return categories.value.find((cat) => String(cat?.slug || "").toLowerCase() === "agregados") || null;
    });
    const isShoesCategory = computed(() => /calzado|zapat|shoe|sneaker/.test(selectedCategoryName.value));
    const isClothingCategory = computed(() => /ropa|vest|camis|pantal|polera|poleron|polerón/.test(selectedCategoryName.value));
    const requiresSizeQty = computed(() => isShoesCategory.value || isClothingCategory.value);
    const activeSizeOptions = computed(() => isShoesCategory.value ? shoeSizes : clothingSizes);
    const sizeQtyTotal = computed(() => activeSizeOptions.value.reduce((acc, size) => acc + (Number(sizeQty[size]) || 0), 0));
    computed(() => {
      const map = {};
      activeSizeOptions.value.forEach((size) => {
        const qty = Math.max(0, Number(sizeQty[size]) || 0);
        if (qty > 0) map[size] = qty;
      });
      return map;
    });
    watch(
      () => [requiresSizeQty.value, sizeQtyTotal.value],
      () => {
        if (requiresSizeQty.value) {
          form.stock_available = sizeQtyTotal.value;
        }
      }
    );
    const accentStyle = computed(() => ({ backgroundColor: theme.accent || "var(--accent,#2563eb)", color: "#fff" }));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-50 px-4 py-10 min-h-screen" }, _attrs))}><div class="mx-auto max-w-3xl space-y-6"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Productos</p><h1 class="text-2xl font-bold text-slate-900">Nuevo producto</h1></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}/productos`,
        class: "text-sm font-semibold text-slate-700 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Volver`);
          } else {
            return [
              createTextVNode("Volver")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"><div class="grid gap-4"><div class="space-y-2"><label class="text-sm text-slate-600">Nombre</label><input${ssrRenderAttr("value", form.name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Slug</label><input${ssrRenderAttr("value", form.slug)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Se usa en la URL. Usa letras, números y guiones.</p></div><div class="space-y-2"><label class="text-sm text-slate-600">Descripción</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(form.description)}</textarea></div><div class="grid gap-4 sm:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Precio</label><input${ssrRenderAttr("value", form.price)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Precio oferta por unidad (opcional)</label><input${ssrRenderAttr("value", form.offer_price)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Ej: 1990 para mostrar un pack como 3x1990.</p></div><div class="space-y-2 sm:col-span-2"><label class="text-sm text-slate-600">Cantidad mínima para oferta</label><input${ssrRenderAttr("value", form.offer_min_qty)} type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Ej: 3 para activar la oferta desde 3 unidades.</p></div></div><div class="space-y-2"><label class="text-sm text-slate-600">Categoría</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "") : ssrLooseEqual(form.category, "")) ? " selected" : ""}>Sin categoría</option><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, cat.id) : ssrLooseEqual(form.category, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><p class="text-xs text-slate-500">Selecciona una categoría disponible.</p></div><div class="space-y-2"><label class="text-sm text-slate-600">Marca (opcional)</label><input${ssrRenderAttr("value", form.brand)} type="text" placeholder="Ej: Nike, Samsung, Oster" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Se usa para dividir vitrinas por marca dentro de cada categoría.</p></div><div class="grid gap-4 sm:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Stock disponible</label><input${ssrRenderAttr("value", form.stock_available)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Stock mínimo</label><input${ssrRenderAttr("value", form.stock_minimum)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
      if (requiresSizeQty.value) {
        _push(`<div class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4"><div><p class="text-sm font-semibold text-slate-900">Cantidad por talla ${ssrInterpolate(isShoesCategory.value ? "de zapatilla" : "")}</p><p class="text-xs text-slate-500">Define unidades por talla. El total se usa como stock disponible.</p></div><div class="grid gap-2 sm:grid-cols-3"><!--[-->`);
        ssrRenderList(activeSizeOptions.value, (size) => {
          _push(`<label class="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"><span class="font-semibold text-slate-700">${ssrInterpolate(size)}</span><input${ssrRenderAttr("value", sizeQty[size])} type="number" min="0" step="1" class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right"></label>`);
        });
        _push(`<!--]--></div><p class="text-xs text-slate-600">Total por talla: <span class="font-semibold">${ssrInterpolate(sizeQtyTotal.value)}</span> unidades.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Imagen (URL)</label><input${ssrRenderAttr("value", form.image_url)} type="url" placeholder="https://..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Pegamos la URL y se sube a Cloudinary automáticamente.</p></div><div class="flex flex-wrap gap-4"><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_featured) ? ssrLooseContain(form.is_featured, null) : form.is_featured) ? " checked" : ""} type="checkbox"> Oferta destacada (palomita) </label><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.product_of_week) ? ssrLooseContain(form.product_of_week, null) : form.product_of_week) ? " checked" : ""} type="checkbox"> Producto de la semana </label><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_active) ? ssrLooseContain(form.is_active, null) : form.is_active) ? " checked" : ""} type="checkbox"> Activo </label><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_marketplace) ? ssrLooseContain(form.is_marketplace, null) : form.is_marketplace) ? " checked" : ""} type="checkbox"> Publicar en marketplace </label></div></div><div class="flex items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Guardando..." : "Guardar producto")}</button>`);
      if (message.value) {
        _push(`<p class="${ssrRenderClass([messageType.value === "error" ? "text-red-600" : "text-green-600", "text-sm"])}">${ssrInterpolate(message.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/productos/nuevo.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=nuevo-C2d5baFH.mjs.map
