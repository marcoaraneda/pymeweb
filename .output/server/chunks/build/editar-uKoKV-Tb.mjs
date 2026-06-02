import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, reactive, ref, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
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

const MAX_GALLERY_IMAGES = 5;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "editar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const params = route?.params || {};
    const config = useRuntimeConfig();
    useAuthStore();
    const theme = useThemeStore();
    useTenantStore();
    const slug = params.slug || "";
    const productSlug = params.product_slug || "";
    const backPath = computed(() => `/store/${slug}/productos`);
    const form = reactive({
      id: null,
      name: "",
      slug: "",
      brand: "",
      description: "",
      price: 0,
      offer_price: null,
      offer_min_qty: 1,
      is_featured: false,
      product_of_week: false,
      is_active: true,
      image_url: "",
      is_marketplace: false,
      category: "",
      stock_available: 0,
      stock_minimum: 0
    });
    const existingImageUrls = ref([]);
    const pendingExtraImages = ref([]);
    const galleryUrlInput = ref("");
    const uploadingGallery = ref(false);
    const galleryMessage = ref("");
    const galleryStatus = ref("ok");
    const saving = ref(false);
    const deleting = ref(false);
    const message = ref("");
    const messageType = ref("ok");
    const variants = ref([]);
    const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const shoeSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44"];
    const sizeOptions = [...clothingSizes, ...shoeSizes];
    const sizeQty = reactive({});
    sizeOptions.forEach((size) => {
      sizeQty[size] = 0;
    });
    const accentStyle = computed(() => ({ backgroundColor: theme.accent, color: "#fff" }));
    const categories = ref([]);
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    const galleryPreview = computed(() => [...existingImageUrls.value, ...pendingExtraImages.value].slice(0, MAX_GALLERY_IMAGES));
    const canAddMoreImages = computed(() => galleryPreview.value.length < MAX_GALLERY_IMAGES);
    const selectedCategoryName = computed(() => {
      const selected = categories.value.find((cat) => String(cat.id) === String(form.category));
      return String(selected?.name || "").toLowerCase();
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
    const normalizeStock = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const variantStockLabel = (value) => {
      const stock = normalizeStock(value);
      if (stock <= 0) return "Sin stock";
      if (stock <= 5) return `Stock bajo (${stock})`;
      return `${stock} en inventario`;
    };
    const variantStockClass = (value) => {
      const stock = normalizeStock(value);
      if (stock <= 0) return "text-red-600";
      if (stock <= 5) return "text-amber-600";
      return "text-emerald-600";
    };
    const totalStock = computed(() => {
      if (!variants.value.length) return normalizeStock(form.stock_available);
      return variants.value.reduce((acc, variant) => acc + normalizeStock(variant.stock_available), 0);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-8" }, _attrs))}><div class="mx-auto max-w-4xl space-y-6"><div class="flex items-start justify-between gap-4"><div><div class="flex items-center gap-2"><p class="text-xs font-extrabold uppercase tracking-[0.25em] text-slate-600">📦 Productos</p></div><h1 class="mt-2 text-4xl font-black text-slate-950">Editar producto</h1><p class="mt-1 text-sm text-slate-600">Actualiza toda la información del producto</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: backPath.value,
        class: "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` ← Volver `);
          } else {
            return [
              createTextVNode(" ← Volver ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-sm"><div class="px-6 py-4"><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-900">Información actual</p><div class="mt-3 space-y-2"><p class="text-sm"><span class="font-bold text-emerald-950">Tienda:</span> <span class="text-emerald-900">${ssrInterpolate(unref(slug))}</span></p><p class="text-sm"><span class="font-bold text-emerald-950">Slug:</span> <span class="font-mono text-emerald-900">${ssrInterpolate(unref(productSlug))}</span></p><p class="text-sm"><span class="font-bold text-emerald-950">Descripción:</span> <span class="text-emerald-900">${ssrInterpolate(form.description || "(Sin descripción aún)")}</span></p></div></div></div><div class="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-lg"><div class="grid gap-6"><div class="space-y-4 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-50/50 p-6"><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-900">Información básica</p><div class="space-y-3"><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Nombre del producto</label><input${ssrRenderAttr("value", form.name)} type="text" placeholder="Ej: Nike Air Max 90" class="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Slug (URL amigable)</label><input${ssrRenderAttr("value", form.slug)} type="text" placeholder="ej-nike-air-max-90" class="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"><p class="text-xs text-slate-600">Se usa en la URL. Solo letras, números y guiones.</p></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Descripción</label><textarea placeholder="Describe los detalles, características, especificaciones..." rows="4" class="w-full rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100">${ssrInterpolate(form.description)}</textarea></div></div></div><div class="space-y-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-orange-50/50 p-6"><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-orange-900">Precios y ofertas</p><div class="grid gap-3 sm:grid-cols-2"><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Precio regular</label><div class="relative"><span class="absolute left-4 top-3.5 text-sm font-bold text-slate-600">$</span><input${ssrRenderAttr("value", form.price)} type="number" min="0" step="1" class="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 pl-8 text-sm font-medium focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"></div></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Precio de oferta (opcional)</label><div class="relative"><span class="absolute left-4 top-3.5 text-sm font-bold text-slate-600">$</span><input${ssrRenderAttr("value", form.offer_price)} type="number" min="0" step="1" class="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 pl-8 text-sm font-medium focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"></div><p class="text-xs text-slate-600">Ej: 1990 para mostrar &quot;3x1990&quot;</p></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Cantidad mínima para oferta</label><input${ssrRenderAttr("value", form.offer_min_qty)} type="number" min="1" step="1" class="w-full rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-medium focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"><p class="text-xs text-slate-600">Ej: 3 unidades para activar la oferta</p></div></div></div><div class="space-y-4 rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-purple-50/50 p-6"><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-purple-900">Stock e inventario</p><div class="grid gap-3 sm:grid-cols-2"><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Stock disponible</label><input${ssrRenderAttr("value", form.stock_available)} type="number" min="0" step="1" class="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Stock mínimo (alerta)</label><input${ssrRenderAttr("value", form.stock_minimum)} type="number" min="0" step="1" class="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-sm font-medium focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-100"></div></div></div><div class="space-y-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-indigo-50/50 p-6"><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-indigo-900">Categorización</p><div class="grid gap-3 sm:grid-cols-2"><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Categoría</label><select class="w-full rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "") : ssrLooseEqual(form.category, "")) ? " selected" : ""}>Sin categoría</option><!--[-->`);
      ssrRenderList(categories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, cat.id) : ssrLooseEqual(form.category, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
      });
      _push(`<!--]--></select><p class="text-xs text-slate-600">Selecciona una categoría para clasificar el producto</p></div><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Marca (opcional)</label><input${ssrRenderAttr("value", form.brand)} type="text" placeholder="Ej: Nike, Samsung, Oster" class="w-full rounded-2xl border border-indigo-200 bg-white px-4 py-3 text-sm font-medium focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"><p class="text-xs text-slate-600">Se usa para agrupar productos por marca</p></div></div></div>`);
      if (requiresSizeQty.value) {
        _push(`<div class="space-y-4 rounded-2xl border border-cyan-100 bg-gradient-to-br from-cyan-50 to-cyan-50/50 p-6"><div><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-900">Stock por talla</p><p class="mt-1 text-sm text-cyan-800">Define unidades por talla ${ssrInterpolate(isShoesCategory.value ? "de zapatilla" : "")}. El total reemplaza el stock disponible.</p></div><div class="grid gap-2 sm:grid-cols-3 md:grid-cols-5"><!--[-->`);
        ssrRenderList(activeSizeOptions.value, (size) => {
          _push(`<label class="flex items-center justify-between rounded-2xl border border-cyan-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:border-cyan-300"><span class="text-cyan-900">${ssrInterpolate(size)}</span><input${ssrRenderAttr("value", sizeQty[size])} type="number" min="0" step="1" class="w-16 rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-right text-sm font-bold focus:outline-none"></label>`);
        });
        _push(`<!--]--></div><div class="rounded-xl border border-cyan-200 bg-cyan-100/30 p-3"><p class="text-sm font-semibold text-cyan-900">Total: <span class="font-black text-cyan-950">${ssrInterpolate(sizeQtyTotal.value)}</span> unidades</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-4 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-50/50 p-6"><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-rose-900">Opciones y estado</p><div class="grid gap-3 sm:grid-cols-2"><label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_featured) ? ssrLooseContain(form.is_featured, null) : form.is_featured) ? " checked" : ""} type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer"><span class="text-sm font-semibold text-slate-900">⭐ Oferta destacada</span></label><label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300"><input${ssrIncludeBooleanAttr(Array.isArray(form.product_of_week) ? ssrLooseContain(form.product_of_week, null) : form.product_of_week) ? " checked" : ""} type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer"><span class="text-sm font-semibold text-slate-900">🏆 Producto de la semana</span></label><label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_active) ? ssrLooseContain(form.is_active, null) : form.is_active) ? " checked" : ""} type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer"><span class="text-sm font-semibold text-slate-900">✓ Producto activo</span></label><label class="flex items-center gap-3 rounded-2xl border border-rose-200 bg-white px-4 py-3 cursor-pointer hover:border-rose-300"><input${ssrIncludeBooleanAttr(Array.isArray(form.is_marketplace) ? ssrLooseContain(form.is_marketplace, null) : form.is_marketplace) ? " checked" : ""} type="checkbox" class="h-5 w-5 rounded-lg border-rose-300 accent-rose-600 cursor-pointer"><span class="text-sm font-semibold text-slate-900">🌐 Publicar en marketplace</span></label></div></div><div class="space-y-4 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-teal-50/50 p-6"><div class="flex items-start justify-between gap-4"><div><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-teal-900">📦 Inventario registrado</p><p class="mt-3 text-3xl font-black text-teal-950">${ssrInterpolate(totalStock.value)} <span class="text-lg text-teal-800">unidades</span></p>`);
      if (!variants.value.length) {
        _push(`<p class="mt-1 text-sm text-teal-800">Stock base del producto (sin variantes).</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}/admin/inventario`,
        class: "inline-flex items-center gap-2 rounded-2xl border border-teal-300 bg-white px-4 py-2.5 text-sm font-bold text-teal-900 hover:bg-teal-50"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` 📊 Abrir inventario `);
          } else {
            return [
              createTextVNode(" 📊 Abrir inventario ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (variants.value.length) {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(variants.value, (variant) => {
          _push(`<div class="flex items-center justify-between gap-3 rounded-2xl border border-teal-200 bg-white px-4 py-3"><div><p class="text-sm font-bold text-slate-900">${ssrInterpolate(variant.name)}</p>`);
          if (variant.sku) {
            _push(`<p class="text-xs text-slate-600">SKU: <span class="font-mono">${ssrInterpolate(variant.sku)}</span></p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="${ssrRenderClass([variantStockClass(variant.stock_available), "text-sm font-extrabold"])}">${ssrInterpolate(variantStockLabel(variant.stock_available))}</p></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-sm text-teal-800">Sin variantes; edita el stock disponible en la sección de arriba.</p>`);
      }
      _push(`</div><div class="space-y-4 rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-amber-50/50 p-6"><div class="flex items-center justify-between"><p class="text-xs font-extrabold uppercase tracking-[0.18em] text-amber-900">🖼️ Imágenes del producto</p><span class="rounded-full bg-amber-200 px-3 py-1 text-xs font-bold text-amber-900">${ssrInterpolate(galleryPreview.value.length)}/${ssrInterpolate(MAX_GALLERY_IMAGES)}</span></div><div class="space-y-3"><div class="space-y-2"><label class="text-sm font-semibold text-slate-900">Imagen principal (URL)</label><input${ssrRenderAttr("value", form.image_url)} type="url" placeholder="https://ejemplo.com/imagen.jpg" class="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"><p class="text-xs text-slate-600">Se guarda como imagen principal en Cloudinary</p></div><p class="text-xs text-slate-700 font-semibold">Agregar más imágenes a la galería (hasta ${ssrInterpolate(MAX_GALLERY_IMAGES)} total):</p><div class="grid gap-3 sm:grid-cols-[1fr,auto]"><input${ssrRenderAttr("value", galleryUrlInput.value)} type="url" placeholder="https://ejemplo.com/imagen-producto.jpg" class="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"${ssrIncludeBooleanAttr(!canAddMoreImages.value) ? " disabled" : ""}><button class="rounded-2xl border border-amber-300 bg-amber-500 px-4 py-3 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-50"${ssrIncludeBooleanAttr(!canAddMoreImages.value) ? " disabled" : ""}> + Agregar </button></div><div class="flex flex-wrap items-center gap-3"><label class="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-amber-300 bg-white px-4 py-2.5 text-sm font-bold text-amber-900 hover:bg-amber-50"><input type="file" accept="image/*" class="hidden"${ssrIncludeBooleanAttr(!canAddMoreImages.value || uploadingGallery.value) ? " disabled" : ""}><span>📤 ${ssrInterpolate(uploadingGallery.value ? "Subiendo..." : "Subir imagen")}</span></label>`);
      if (!canAddMoreImages.value) {
        _push(`<span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">✓ Máximo alcanzado</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (galleryPreview.value.length) {
        _push(`<div class="grid gap-3 grid-cols-3 sm:grid-cols-4 md:grid-cols-5"><!--[-->`);
        ssrRenderList(galleryPreview.value, (image, index) => {
          _push(`<div class="group relative overflow-hidden rounded-2xl border-2 border-amber-200 bg-amber-50 aspect-square"><img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `Imagen ${index + 1}`)} class="h-full w-full object-cover group-hover:scale-110 transition duration-300">`);
          if (index >= existingImageUrls.value.length) {
            _push(`<button type="button" class="absolute right-1 top-1 hidden h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold text-white group-hover:inline-flex hover:bg-red-700 transition"> ✕ </button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      if (galleryMessage.value) {
        _push(`<p class="${ssrRenderClass([galleryStatus.value === "error" ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800", "rounded-2xl px-4 py-3 text-sm font-semibold"])}">${ssrInterpolate(galleryMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-6"><button class="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-white shadow-lg hover:shadow-xl transition" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>`);
      if (saving.value) {
        _push(`<span>⏳ Guardando...</span>`);
      } else {
        _push(`<span>✓ Guardar cambios</span>`);
      }
      _push(`</button><button class="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-3 text-base font-bold text-white shadow-lg hover:bg-red-700 hover:shadow-xl transition"${ssrIncludeBooleanAttr(deleting.value) ? " disabled" : ""}>`);
      if (deleting.value) {
        _push(`<span>⏳ Eliminando...</span>`);
      } else {
        _push(`<span>🗑️ Eliminar producto</span>`);
      }
      _push(`</button>`);
      if (message.value) {
        _push(`<div class="${ssrRenderClass([messageType.value === "error" ? "bg-red-100 text-red-800 font-semibold" : "bg-emerald-100 text-emerald-800 font-semibold", "rounded-2xl px-4 py-2"])}"><p class="text-sm">${ssrInterpolate(message.value)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/productos/[product_slug]/editar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=editar-uKoKV-Tb.mjs.map
