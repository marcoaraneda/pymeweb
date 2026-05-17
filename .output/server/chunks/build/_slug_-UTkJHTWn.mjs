import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, reactive, computed, watch, mergeProps, withCtx, createTextVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useCartStore } from './cart-Dcn-8ZaM.mjs';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { u as useImages } from './useImages-CVASCtOr.mjs';
import { ShoppingCart } from 'lucide-vue-next';
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
  __name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.slug;
    const config = useRuntimeConfig();
    useCartStore();
    useTenantStore();
    const theme = useThemeStore();
    const auth = useAuthStore();
    const { getProductImage } = useImages();
    const product = ref(null);
    const loading = ref(true);
    const error = ref("");
    const saving = ref(false);
    const saveMessage = ref("");
    const saveError = ref("");
    const editForm = ref({ name: "", description: "", price: 0, offer_price: null, offer_min_qty: 1, category: "", stock_available: 0, stock_minimum: 0, image_url: "", free_shipping: false });
    const categories = ref([]);
    const sizeStockMap = reactive({});
    const uploadingImage = ref(false);
    const uploadError = ref("");
    ref(null);
    const galleryUploading = ref(false);
    const galleryUploadError = ref("");
    const newGalleryUrl = ref("");
    const hasOffer = ref(false);
    const activeGalleryIndex = ref(0);
    const apparelSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const shoeSizes = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
    const selectedCategoryName = computed(() => {
      const selected = categories.value.find((cat) => String(cat.id) === String(editForm.value.category));
      return String(selected?.name || product.value?.category?.name || "").toLowerCase();
    });
    const supportsSizeStock = computed(() => /calzado|poleron|polerón|pantalon|pantalón/.test(selectedCategoryName.value));
    const availableSizes = computed(() => /calzado/.test(selectedCategoryName.value) ? shoeSizes : apparelSizes);
    const syncStockFromSizes = () => {
      if (!supportsSizeStock.value) return;
      editForm.value.stock_available = Object.values(sizeStockMap).reduce((acc, qty) => acc + (Number(qty) || 0), 0);
    };
    const accentStyle = computed(() => ({ backgroundColor: theme.accent || "#2563eb", color: "#fff" }));
    const galleryImages = computed(() => {
      const images = (product.value?.images || []).map((img) => img?.image || "").filter(Boolean);
      const primary = editForm.value.image_url || product.value?.image_url || product.value?.image || getProductImage(product.value);
      if (primary && !images.includes(primary)) {
        images.unshift(primary);
      }
      return images.length ? images : ["/logoPW.png"];
    });
    const productImage = computed(() => galleryImages.value[activeGalleryIndex.value] || galleryImages.value[0] || "/logoPW.png");
    const displayPrice = computed(() => {
      if (product.value?.offer_price != null) {
        return Number(product.value.offer_price);
      }
      return Number(product.value?.price || 0);
    });
    const normalUnitPrice = computed(() => Number(product.value?.price || 0));
    const offerMinQty = computed(() => Math.max(1, Number(product.value?.offer_min_qty || 1)));
    const offerUnitPrice = computed(() => Number(product.value?.offer_price || 0));
    const offerPackTotal = computed(() => offerUnitPrice.value * offerMinQty.value);
    const offerPackLabel = computed(() => {
      if (!product.value?.offer_price) return "";
      return offerMinQty.value > 1 ? `${offerMinQty.value}x ${formatClp(offerUnitPrice.value)}` : formatClp(offerUnitPrice.value);
    });
    const discountPercent = computed(() => {
      const price = Number(product.value?.price || 0);
      const offer = Number(product.value?.offer_price || 0);
      if (!price || !offer || offer >= price) return 0;
      return Math.round((price - offer) / price * 100);
    });
    const discountBadge = computed(() => discountPercent.value > 0 ? `${discountPercent.value}%` : "");
    const formatClp = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0);
    const canEdit = computed(() => {
      const userId = String(auth.user?.id ?? "");
      const username = String(auth.user?.username ?? "").trim().toLowerCase();
      const candidateOwnerId = product.value?.submitted_by ?? product.value?.submitted_by_id ?? product.value?.owner_id ?? product.value?.user_id ?? product.value?.owner?.id ?? product.value?.user?.id ?? "";
      const submittedBy = String(
        typeof candidateOwnerId === "object" && candidateOwnerId !== null ? candidateOwnerId.id ?? "" : candidateOwnerId
      );
      const submittedByName = String(
        product.value?.submitted_by_name ?? product.value?.owner_name ?? product.value?.user_name ?? ""
      ).trim().toLowerCase();
      const byId = Boolean(userId && submittedBy && userId === submittedBy);
      const byName = Boolean(username && submittedByName && username === submittedByName);
      const byFlag = Boolean(product.value?.is_owner === true);
      return byId || byName || byFlag;
    });
    const showEditForm = ref(false);
    const wantsEditFromQuery = computed(() => String(route.query.edit || "") === "1");
    watch(
      galleryImages,
      (images) => {
        if (!images.length) {
          activeGalleryIndex.value = 0;
          return;
        }
        if (activeGalleryIndex.value > images.length - 1) {
          activeGalleryIndex.value = 0;
        }
      },
      { immediate: true }
    );
    watch([canEdit, wantsEditFromQuery], ([editable, wantsEdit]) => {
      if (wantsEdit) {
        showEditForm.value = true;
        return;
      }
      if (!editable && showEditForm.value) {
        showEditForm.value = false;
      }
    }, { immediate: true });
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    watch(
      () => editForm.value.offer_price,
      (value) => {
        if (value == null) return;
        hasOffer.value = true;
      }
    );
    watch(hasOffer, (enabled) => {
      if (!enabled) {
        editForm.value.offer_price = null;
        editForm.value.offer_min_qty = 1;
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#fff7ed_100%)] px-4 py-8 sm:px-6 lg:px-8" }, _attrs))}><div class="mx-auto max-w-7xl space-y-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/marketplace#productos",
        class: "inline-flex items-center text-sm font-semibold text-slate-700 transition hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Volver`);
          } else {
            return [
              createTextVNode("← Volver")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (loading.value) {
        _push(`<div class="rounded-[28px] border border-slate-200 bg-white/90 p-8 text-slate-500 shadow-sm">Cargando producto...</div>`);
      } else if (error.value) {
        _push(`<div class="rounded-[28px] border border-rose-200 bg-white/90 p-8 text-rose-700 shadow-sm">${ssrInterpolate(error.value)}</div>`);
      } else if (!product.value) {
        _push(`<div class="rounded-[28px] border border-slate-200 bg-white/90 p-8 text-slate-600 shadow-sm">Producto no encontrado.</div>`);
      } else {
        _push(`<!--[--><section class="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]"><div class="space-y-6"><div class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)]"><div class="grid gap-4 p-4 md:p-5 xl:grid-cols-[1fr,96px] xl:items-start"><div class="space-y-4"><div class="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50"><div class="absolute left-4 top-4 z-10 flex flex-wrap gap-2"><span class="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm">Marketplace</span>`);
        if (product.value.product_of_week) {
          _push(`<span class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900 shadow-sm">Producto de la semana</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (canEdit.value) {
          _push(`<button type="button" class="absolute right-4 top-4 z-10 rounded-full border border-amber-200 bg-white/95 px-4 py-2 text-xs font-semibold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50">${ssrInterpolate(showEditForm.value ? "Cerrar editor" : "Editar publicación")}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="aspect-square overflow-hidden bg-slate-100"><img${ssrRenderAttr("src", productImage.value || "/logoPW.png")}${ssrRenderAttr("alt", product.value.name)} class="h-full w-full object-cover"></div></div><div class="flex gap-3 overflow-x-auto pb-1 xl:grid xl:grid-cols-4 xl:gap-3 xl:overflow-visible"><!--[-->`);
        ssrRenderList(galleryImages.value, (image, index) => {
          _push(`<button type="button" class="${ssrRenderClass([activeGalleryIndex.value === index ? "border-amber-400 ring-2 ring-amber-200" : "border-slate-200 hover:border-slate-300", "group relative h-20 w-20 flex-none overflow-hidden rounded-2xl border transition sm:h-24 sm:w-24 xl:h-auto xl:w-full xl:aspect-square"])}"><img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `${product.value.name} foto ${index + 1}`)} class="h-full w-full object-cover transition duration-300 group-hover:scale-105">`);
          if (activeGalleryIndex.value === index) {
            _push(`<span class="absolute inset-x-2 bottom-2 rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"> Principal </span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div><aside class="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 xl:p-4"><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Resumen</p><h1 class="text-2xl font-semibold leading-tight text-slate-900 xl:text-3xl">${ssrInterpolate(product.value.name)}</h1><div class="flex flex-wrap gap-2 text-xs font-semibold text-slate-600"><span class="rounded-full bg-white px-3 py-1 shadow-sm">${ssrInterpolate(product.value.category?.name || "General")}</span>`);
        if (product.value.free_shipping) {
          _push(`<span class="rounded-full bg-sky-100 px-3 py-1 text-sky-800">Envío gratis</span>`);
        } else {
          _push(`<!---->`);
        }
        if (product.value.offer_price && Number(product.value.offer_min_qty || 1) > 1) {
          _push(`<span class="rounded-full bg-rose-100 px-3 py-1 text-rose-700">Desde ${ssrInterpolate(Number(product.value.offer_min_qty))} unidades</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-[20px] bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</p><div class="mt-3 grid gap-3 sm:grid-cols-[1.15fr,0.85fr]"><div class="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-slate-500">Oferta</p>`);
        if (product.value.offer_price) {
          _push(`<p class="mt-2 text-2xl font-semibold text-slate-900">${ssrInterpolate(offerPackLabel.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (product.value.offer_price && offerMinQty.value > 1) {
          _push(`<p class="mt-1 text-sm text-slate-600"> Total ${ssrInterpolate(formatClp(offerPackTotal.value))} para ${ssrInterpolate(offerMinQty.value)} unidades </p>`);
        } else if (product.value.offer_price) {
          _push(`<p class="mt-1 text-sm text-slate-600"> Precio promocional por unidad </p>`);
        } else {
          _push(`<p class="mt-2 text-2xl font-semibold text-slate-900">${ssrInterpolate(formatClp(normalUnitPrice.value))}</p>`);
        }
        _push(`</div><div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-emerald-700">Descuento</p>`);
        if (product.value.offer_price) {
          _push(`<p class="mt-2 text-xl font-semibold text-emerald-900">${ssrInterpolate(formatClp(offerUnitPrice.value))} c/u </p>`);
        } else {
          _push(`<!---->`);
        }
        if (product.value.offer_price) {
          _push(`<p class="mt-1 text-sm text-emerald-800"> Antes ${ssrInterpolate(formatClp(normalUnitPrice.value))} c/u </p>`);
        } else {
          _push(`<!---->`);
        }
        if (product.value.offer_price) {
          _push(`<p class="mt-1 text-xs font-semibold text-emerald-700">Ahorro ${ssrInterpolate(discountBadge.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div><div class="rounded-[20px] bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Vendedor</p><p class="mt-2 text-sm font-semibold text-slate-900">`);
        if (product.value.submitted_by) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/marketplace/vendedores/${product.value.submitted_by}`,
            class: "hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(product.value.submitted_by_name || "Marketplace")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(product.value.submitted_by_name || "Marketplace"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<span>${ssrInterpolate(product.value.submitted_by_name || "Marketplace")}</span>`);
        }
        _push(`</p><p class="mt-1 text-xs text-slate-500">ID ${ssrInterpolate(product.value.id)}</p></div><div class="grid gap-2">`);
        if (product.value.store?.slug && !product.value.store_is_marketplace) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${product.value.store.slug}/productos/${product.value.slug}`,
            class: "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5",
            style: accentStyle.value
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ver en tienda `);
              } else {
                return [
                  createTextVNode(" Ver en tienda ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5" style="${ssrRenderStyle(accentStyle.value)}">`);
        _push(ssrRenderComponent(unref(ShoppingCart), {
          class: "h-4 w-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Agregar al carrito </button>`);
        if (canEdit.value) {
          _push(`<button type="button" class="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-50"> Abrir editor </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></aside></div></div><div class="grid gap-4 md:grid-cols-[1.1fr,0.9fr]"><article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><p class="text-xs uppercase tracking-[0.22em] text-slate-500">Descripción</p><p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">${ssrInterpolate(product.value.description || "Sin descripción disponible.")}</p></article><article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><p class="text-xs uppercase tracking-[0.22em] text-slate-500">Estado</p><div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold">`);
        if (product.value.product_of_week) {
          _push(`<span class="rounded-full bg-amber-100 px-3 py-1 text-amber-800">Destacado</span>`);
        } else {
          _push(`<!---->`);
        }
        if (product.value.offer_price) {
          _push(`<span class="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Oferta activa</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Stock ${ssrInterpolate(product.value.stock_available ?? 0)}</span></div><p class="mt-3 text-sm text-slate-600">${ssrInterpolate(product.value.free_shipping ? "Este producto tiene envío gratis." : "El envío se calcula según la tienda.")}</p></article></div></div><aside class="space-y-4"><article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><p class="text-xs uppercase tracking-[0.22em] text-slate-500">Resumen comercial</p><div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"><div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-slate-500">Precio actual</p><p class="mt-2 text-2xl font-semibold text-slate-900">${ssrInterpolate(formatClp(displayPrice.value))}</p></div><div class="rounded-2xl bg-slate-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-slate-500">Visibilidad</p><p class="mt-2 text-sm font-semibold text-slate-900">Marketplace</p><p class="text-xs text-slate-500">La publicación es visible para todos los usuarios.</p></div></div></article><article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"><p class="text-xs uppercase tracking-[0.22em] text-slate-500">Acciones</p><div class="mt-4 space-y-3"><button class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">${ssrInterpolate(canEdit.value ? "Editar publicación" : "Ver editor")}</button>`);
        if (product.value.store?.slug && !product.value.store_is_marketplace) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${product.value.store.slug}`,
            class: "block rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ver tienda origen `);
              } else {
                return [
                  createTextVNode(" Ver tienda origen ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></article></aside></section>`);
        if (showEditForm.value) {
          _push(`<section class="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.4)]"><div class="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Editor premium</p><h2 class="mt-1 text-2xl font-semibold text-slate-900">Editar publicación</h2><p class="mt-1 text-sm text-slate-500">Ajusta el contenido, la imagen principal y la galería adicional.</p></div><span class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Solo visible para quien la subió</span></div>`);
          if (!canEdit.value) {
            _push(`<div class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"> Verificando permisos de edición... </div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="mt-5 grid gap-6 xl:grid-cols-[1.05fr,0.95fr]"><div class="space-y-5"><div class="grid gap-4 md:grid-cols-2"><div class="space-y-2 md:col-span-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nombre</label><input${ssrRenderAttr("value", editForm.value.name)} type="text" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Precio</label><input${ssrRenderAttr("value", editForm.value.price)} type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Categoría</label><select class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"><option value=""${ssrIncludeBooleanAttr(Array.isArray(editForm.value.category) ? ssrLooseContain(editForm.value.category, "") : ssrLooseEqual(editForm.value.category, "")) ? " selected" : ""}>Sin categoría</option><!--[-->`);
          ssrRenderList(categories.value, (cat) => {
            _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(editForm.value.category) ? ssrLooseContain(editForm.value.category, cat.id) : ssrLooseEqual(editForm.value.category, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
          });
          _push(`<!--]--></select></div><div class="space-y-2 md:col-span-2"><label class="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(hasOffer.value) ? ssrLooseContain(hasOffer.value, null) : hasOffer.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300"> Activar oferta </label></div>`);
          if (hasOffer.value) {
            _push(`<div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Precio oferta</label><input${ssrRenderAttr("value", editForm.value.offer_price)} type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></div>`);
          } else {
            _push(`<!---->`);
          }
          if (hasOffer.value) {
            _push(`<div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cantidad mínima</label><input${ssrRenderAttr("value", editForm.value.offer_min_qty)} type="number" min="1" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stock disponible</label><input${ssrRenderAttr("value", editForm.value.stock_available)} type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></div><div class="space-y-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stock mínimo</label><input${ssrRenderAttr("value", editForm.value.stock_minimum)} type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></div>`);
          if (supportsSizeStock.value) {
            _push(`<div class="space-y-3 md:col-span-2"><div class="flex items-center justify-between gap-3"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cantidad por talla</label><span class="text-xs text-slate-400">Se suma automáticamente al stock</span></div><div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
            ssrRenderList(availableSizes.value, (size) => {
              _push(`<div class="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">${ssrInterpolate(size)}</p><input${ssrRenderAttr("value", sizeStockMap[size] || 0)} type="number" min="0" step="1" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="space-y-2 md:col-span-2"><label class="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(editForm.value.free_shipping) ? ssrLooseContain(editForm.value.free_shipping, null) : editForm.value.free_shipping) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300"> Envío gratis </label></div><div class="space-y-2 md:col-span-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Imagen principal</label><input${ssrRenderAttr("value", editForm.value.image_url)} type="url" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" placeholder="https://..."><div class="flex flex-wrap items-center gap-3 text-xs text-slate-500"><label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><input type="file" accept="image/*" class="hidden"><span>${ssrInterpolate(uploadingImage.value ? "Subiendo..." : "Subir archivo")}</span></label><button type="button" class="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Usar foto actual</button></div>`);
          if (uploadError.value) {
            _push(`<p class="text-xs text-rose-600">${ssrInterpolate(uploadError.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="space-y-2 md:col-span-2"><label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Descripción</label><textarea rows="4" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100">${ssrInterpolate(editForm.value.description)}</textarea></div></div><div class="rounded-[24px] border border-slate-200 bg-slate-50 p-4"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Galería</p><p class="text-sm text-slate-600">Agrega más fotos para mostrar el producto desde distintos ángulos.</p></div><button type="button" class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"> Subir archivo </button></div><input type="file" accept="image/*" class="hidden"><div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3"><!--[-->`);
          ssrRenderList(galleryImages.value, (image, index) => {
            _push(`<button type="button" class="${ssrRenderClass([activeGalleryIndex.value === index ? "border-amber-300 ring-2 ring-amber-100" : "border-slate-200", "relative overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-0.5"])}"><div class="aspect-square"><img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `Foto ${index + 1}`)} class="h-full w-full object-cover"></div><div class="flex items-center justify-between gap-2 px-3 py-2 text-xs"><span class="font-semibold text-slate-700">Foto ${ssrInterpolate(index + 1)}</span>`);
            if (activeGalleryIndex.value === index) {
              _push(`<span class="rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-800">Activa</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></button>`);
          });
          _push(`<!--]--></div><div class="mt-4 grid gap-3 md:grid-cols-[1fr_auto]"><input${ssrRenderAttr("value", newGalleryUrl.value)} type="url" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" placeholder="Pega un enlace de imagen o sube un archivo"><button type="button" class="rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(galleryUploading.value) ? " disabled" : ""}>${ssrInterpolate(galleryUploading.value ? "Agregando..." : "Agregar foto")}</button></div>`);
          if (galleryUploadError.value) {
            _push(`<p class="mt-2 text-xs text-rose-600">${ssrInterpolate(galleryUploadError.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><aside class="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4"><div class="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"><div class="aspect-square bg-slate-100"><img${ssrRenderAttr("src", productImage.value || "/logoPW.png")}${ssrRenderAttr("alt", product.value.name)} class="h-full w-full object-cover"></div><div class="space-y-2 p-4"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Vista previa</p><h3 class="text-lg font-semibold text-slate-900">${ssrInterpolate(editForm.value.name || product.value.name)}</h3><p class="text-sm text-slate-600 line-clamp-3">${ssrInterpolate(editForm.value.description || product.value.description || "Sin descripción disponible.")}</p><div class="flex items-center justify-between gap-2"><span class="text-sm font-semibold text-slate-900">${ssrInterpolate(formatClp(editForm.value.price || product.value.price))}</span><span class="text-xs text-slate-500">${ssrInterpolate(galleryImages.value.length)} foto(s)</span></div></div></div><div class="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Consejo</p><p class="mt-2 text-sm leading-6 text-slate-600">Usa una portada clara y al menos dos fotos extra para que la publicación se vea más confiable y profesional.</p></div></aside></div><div class="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4"><button class="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Guardando..." : "Guardar cambios")}</button>`);
          if (saveMessage.value) {
            _push(`<p class="text-sm font-medium text-emerald-700">${ssrInterpolate(saveMessage.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (saveError.value) {
            _push(`<p class="text-sm font-medium text-rose-600">${ssrInterpolate(saveError.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace/productos/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-UTkJHTWn.mjs.map
