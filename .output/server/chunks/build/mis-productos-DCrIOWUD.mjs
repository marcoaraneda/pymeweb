import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { Loader2, CheckCircle2, XCircle } from 'lucide-vue-next';
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
import 'vue-router';

const perPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "mis-productos",
  __ssrInlineRender: true,
  setup(__props) {
    const openMenuId = ref(null);
    const formatClp = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0);
    const displayPrice = (item) => {
      const minQty = Math.max(1, Number(item?.offer_min_qty || 1));
      if (item?.offer_price && minQty <= 1) return Number(item.offer_price);
      return Number(item?.price || 0);
    };
    const discountPercent = (item) => {
      const price = Number(item?.price || 0);
      const offer = Number(item?.offer_price || 0);
      if (!price || !offer || offer >= price) return 0;
      return Math.round((price - offer) / price * 100);
    };
    const discountBadge = (item) => {
      const pct = discountPercent(item);
      return pct > 0 ? `-${pct}%` : "";
    };
    const auth = useAuthStore();
    const theme = useThemeStore();
    const config = useRuntimeConfig();
    const submissions = ref([]);
    const page = ref(1);
    const loading = ref(false);
    const error = ref("");
    const submitting = ref(false);
    const togglingId = ref(null);
    const toggleError = ref("");
    const categories = ref([]);
    const sizeStockMap = reactive({});
    const uploadingImage = ref(false);
    const uploadError = ref("");
    const usingCachedSubmissions = ref(false);
    const retryCooldown = ref(0);
    const form = reactive({
      name: "",
      price: null,
      offer_price: null,
      offer_min_qty: 1,
      description: "",
      image_url: "",
      is_active: true,
      category: "",
      stock_available: 0,
      stock_minimum: 0,
      free_shipping: false
    });
    const hasOffer = ref(false);
    const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const shoeSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
    const selectedCategoryName = computed(() => {
      const selected = categories.value.find((cat) => String(cat.id) === String(form.category));
      return String(selected?.name || "").toLowerCase();
    });
    const supportsSizeStock = computed(() => /calzado|poleron|polerón|pantalon|pantalón/.test(selectedCategoryName.value));
    const availableSizes = computed(() => /calzado/.test(selectedCategoryName.value) ? shoeSizes : apparelSizes);
    const syncStockFromSizes = () => {
      if (!supportsSizeStock.value) return;
      form.stock_available = Object.values(sizeStockMap).reduce((acc, qty) => acc + (Number(qty) || 0), 0);
    };
    const formMessage = ref("");
    const formMessageType = ref("ok");
    const totalPages = computed(() => Math.max(1, Math.ceil(submissions.value.length / perPage)));
    const paginatedSubmissions = computed(() => {
      const start = (page.value - 1) * perPage;
      return submissions.value.slice(start, start + perPage);
    });
    const pageStart = computed(() => submissions.value.length ? (page.value - 1) * perPage + 1 : 0);
    const pageEnd = computed(() => Math.min(page.value * perPage, submissions.value.length));
    watch(submissions, () => {
      if (page.value > totalPages.value) page.value = totalPages.value;
    });
    const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: "#fff" }));
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    computed(() => ({ Authorization: `Bearer ${auth.token}` }));
    watch(
      () => form.offer_price,
      (value) => {
        if (value == null) return;
        hasOffer.value = true;
      }
    );
    watch(hasOffer, (enabled) => {
      if (!enabled) {
        form.offer_price = null;
        form.offer_min_qty = 1;
      }
    });
    watch([supportsSizeStock, availableSizes], () => {
      if (!supportsSizeStock.value) {
        Object.keys(sizeStockMap).forEach((key) => delete sizeStockMap[key]);
        return;
      }
      availableSizes.value.forEach((size) => {
        if (sizeStockMap[size] == null) sizeStockMap[size] = 0;
      });
      Object.keys(sizeStockMap).forEach((size) => {
        if (!availableSizes.value.includes(size)) delete sizeStockMap[size];
      });
      syncStockFromSizes();
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 text-slate-900" }, _attrs))}><section class="border-b bg-white"><div class="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between"><div class="space-y-2"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Marketplace</p><h1 class="text-3xl font-bold text-slate-900">Mis publicaciones</h1><p class="text-sm text-slate-600">Publica productos sin tienda y controla su estado (activo/vendido).</p></div><div class="flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/marketplace",
        class: "rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Volver al marketplace `);
          } else {
            return [
              createTextVNode(" Volver al marketplace ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><section class="mx-auto max-w-6xl px-6 py-10 space-y-6"><div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><h2 class="text-lg font-semibold text-slate-900">Publicar nuevo producto</h2><p class="text-sm text-slate-600">Se crea en tu tienda oculta de marketplace. Puedes activarlo o desactivarlo cuando se venda.</p><div class="mt-4 grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Nombre</label><input${ssrRenderAttr("value", form.name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Precio</label><input${ssrRenderAttr("value", form.price)} type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 md:col-span-2"><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(hasOffer.value) ? ssrLooseContain(hasOffer.value, null) : hasOffer.value) ? " checked" : ""} type="checkbox"> Activar oferta </label></div>`);
      if (hasOffer.value) {
        _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Precio oferta (opcional)</label><input${ssrRenderAttr("value", form.offer_price)} type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (hasOffer.value) {
        _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Cantidad mínima para oferta</label><input${ssrRenderAttr("value", form.offer_min_qty)} type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Categoría</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "") : ssrLooseEqual(form.category, "")) ? " selected" : ""}>Sin categoría</option><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, cat.id) : ssrLooseEqual(form.category, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select></div><div class="space-y-2"><label class="inline-flex items-center gap-2 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(form.free_shipping) ? ssrLooseContain(form.free_shipping, null) : form.free_shipping) ? " checked" : ""} type="checkbox"> Envío gratis </label></div><div class="space-y-2"><label class="text-sm text-slate-600">Stock disponible</label><input${ssrRenderAttr("value", form.stock_available)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Stock mínimo</label><input${ssrRenderAttr("value", form.stock_minimum)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div>`);
      if (supportsSizeStock.value) {
        _push(`<div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Cantidad por talla</label><div class="grid gap-2 sm:grid-cols-3"><!--[-->`);
        ssrRenderList(availableSizes.value, (size) => {
          _push(`<div class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"><p class="text-xs font-semibold text-slate-700">${ssrInterpolate(size)}</p><input${ssrRenderAttr("value", sizeStockMap[size] || 0)} type="number" min="0" step="1" class="mt-1 w-full rounded-lg border border-slate-200 px-2 py-1 text-sm"></div>`);
        });
        _push(`<!--]--></div><p class="text-xs text-slate-500">Disponible para calzado, poleron y pantalon. El stock disponible se calcula automáticamente.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Imagen (URL)</label><input${ssrRenderAttr("value", form.image_url)} type="url" placeholder="https://..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><div class="flex items-center gap-3 text-xs text-slate-500"><label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition"><input type="file" accept="image/*" class="hidden"><span>${ssrInterpolate(uploadingImage.value ? "Subiendo..." : "Subir archivo")}</span></label><span>o pega un enlace</span></div><p class="text-xs text-slate-500">Opcional; se sube a Cloudinary.</p>`);
      if (uploadError.value) {
        _push(`<p class="text-xs text-red-600">${ssrInterpolate(uploadError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Descripción</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(form.description)}</textarea></div></div><div class="mt-4 flex items-center gap-3"><button class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(submitting.value || retryCooldown.value > 0 || !form.name || !form.price) ? " disabled" : ""}>`);
      if (submitting.value) {
        _push(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` ${ssrInterpolate(submitting.value ? "Publicando..." : retryCooldown.value > 0 ? `Espera ${retryCooldown.value}s` : "Publicar producto")}</button>`);
      if (formMessage.value) {
        _push(`<p class="${ssrRenderClass([formMessageType.value === "error" ? "text-red-600" : "text-green-600", "text-sm"])}">${ssrInterpolate(formMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div class="flex items-center justify-between"><div><h2 class="text-lg font-semibold text-slate-900">Mis productos</h2><p class="text-sm text-slate-600">Activa o desactiva cuando se venda.</p></div><button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 transition"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>`);
      if (loading.value) {
        _push(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(` Recargar </button></div>`);
      if (loading.value) {
        _push(`<div class="mt-4 grid gap-4 md:grid-cols-2"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="mb-3 h-4 w-40 rounded bg-slate-200"></div><div class="mb-2 h-3 w-24 rounded bg-slate-200"></div><div class="mb-2 h-3 w-full rounded bg-slate-200"></div><div class="h-8 w-28 rounded bg-slate-200"></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (error.value) {
        _push(`<div class="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-red-700 flex items-center justify-between gap-3"><div class="space-y-1"><span>${ssrInterpolate(error.value)}</span>`);
        if (usingCachedSubmissions.value) {
          _push(`<p class="text-xs text-red-600"> Mostrando datos guardados temporalmente para que puedas seguir trabajando. </p>`);
        } else {
          _push(`<!---->`);
        }
        if (retryCooldown.value > 0) {
          _push(`<p class="text-xs text-red-600"> Puedes reintentar en ${ssrInterpolate(retryCooldown.value)}s. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button class="rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"${ssrIncludeBooleanAttr(loading.value || retryCooldown.value > 0) ? " disabled" : ""}>${ssrInterpolate(retryCooldown.value > 0 ? `Reintentar (${retryCooldown.value}s)` : "Reintentar")}</button></div>`);
      } else if (!submissions.value.length) {
        _push(`<div class="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-slate-600"> Aún no publicas productos en marketplace. </div>`);
      } else {
        _push(`<div class="mt-4 grid gap-4 md:grid-cols-2">`);
        if (toggleError.value) {
          _push(`<div class="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800 text-sm">${ssrInterpolate(toggleError.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(paginatedSubmissions.value, (item) => {
          _push(`<article class="flex flex-col gap-2.5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"><div class="flex items-center justify-between gap-2 relative"><p class="text-sm font-semibold text-slate-900 line-clamp-1">${ssrInterpolate(item.name)}</p><span class="${ssrRenderClass([item.is_active ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-700", "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold"])}">`);
          if (item.is_active) {
            _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-4 w-4" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(XCircle), { class: "h-4 w-4" }, null, _parent));
          }
          _push(` ${ssrInterpolate(item.is_active ? "Activo" : "Inactivo")}</span><div class="relative"><button class="ml-2 p-1 rounded-full hover:bg-slate-100 focus:outline-none"><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="5" cy="12" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="19" cy="12" r="1.5"></circle></svg></button>`);
          if (openMenuId.value === item.id) {
            _push(`<div class="absolute right-0 top-8 z-50 min-w-[160px] rounded-xl border border-slate-200 bg-white shadow-lg"><button class="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"> Ver detalle </button><button class="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"> Editar </button><button class="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"> Eliminar </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><p class="text-sm text-slate-600 line-clamp-1">${ssrInterpolate(item.description || "Sin descripción")}</p><div class="flex flex-wrap items-center gap-2">`);
          if (item.offer_price) {
            _push(`<span class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Oferta ${ssrInterpolate(discountBadge(item))}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (item.free_shipping) {
            _push(`<span class="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-800">Envío gratis</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="${ssrRenderClass([item.offer_price ? "text-red-600" : "text-black", "text-base font-bold"])}">`);
          if (item.offer_price) {
            _push(`<span class="mr-1 text-slate-400 line-through">${ssrInterpolate(formatClp(item.price))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(formatClp(displayPrice(item)))}</p>`);
          if (item.offer_price && Number(item.offer_min_qty || 1) > 1) {
            _push(`<p class="text-xs font-semibold text-rose-700">Oferta desde ${ssrInterpolate(Number(item.offer_min_qty))} unidades</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center gap-2 text-xs text-slate-500"><span>Slug: ${ssrInterpolate(item.slug)}</span><span>·</span><span>ID: ${ssrInterpolate(item.id)}</span></div><div class="flex flex-wrap gap-2"><button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:-translate-y-0.5 transition"${ssrIncludeBooleanAttr(togglingId.value === item.id) ? " disabled" : ""}>`);
          if (togglingId.value === item.id) {
            _push(ssrRenderComponent(unref(Loader2), { class: "h-4 w-4 animate-spin" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(item.is_active ? "Marcar vendido (desactivar)" : "Reactivar")}</button></div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      if (submissions.value.length > perPage) {
        _push(`<div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"><button class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(pageStart.value)}-${ssrInterpolate(pageEnd.value)} de ${ssrInterpolate(submissions.value.length)}</p><button class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace/mis-productos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=mis-productos-DCrIOWUD.mjs.map
