import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, reactive, computed, watch, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
import { u as useCartStore } from './cart-fX2c5KSU.mjs';
import { u as useImages } from './useImages-CVASCtOr.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import { P as ProductCard } from './ProductCard-Bc3E-sgC.mjs';
import { Pencil, Search, ShoppingCart, Star, X } from 'lucide-vue-next';
import { u as useNotificationStore } from './notifications-B61Sz08u.mjs';
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
import './useFavorites-BLT7MOEn.mjs';

const useProducts = () => {
  const config = useRuntimeConfig();
  const tenantStore = useTenantStore();
  const getProducts = async () => {
    if (!tenantStore.slug) {
      throw new Error("Tenant slug no definido");
    }
    return await $fetch(`${config.public.apiBase}/store/${tenantStore.slug}/catalogo/products/`);
  };
  const getProductBySlug = async (productSlug) => {
    if (!tenantStore.slug) {
      throw new Error("Tenant slug no definido");
    }
    return await $fetch(
      `${config.public.apiBase}/store/${tenantStore.slug}/catalogo/products/${productSlug}/`
    );
  };
  return {
    getProducts,
    getProductBySlug
  };
};
const placeholderImage = "https://via.placeholder.com/640x640.png?text=Producto";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[product_slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useCartStore();
    const theme = useThemeStore();
    const config = useRuntimeConfig();
    const auth = useAuthStore();
    const tenantStore = useTenantStore();
    const { getProducts } = useProducts();
    const { getProductImage, optimizeCloudinary } = useImages();
    useNotificationStore();
    const product = ref(null);
    const reviews = ref([]);
    const relatedProducts = ref([]);
    const sendingReview = ref(false);
    const reviewMessage = ref("");
    const reviewStatus = ref("ok");
    const reviewForm = ref({ rating: 0, comment: "", customer_name: "" });
    const reviewHover = ref(0);
    const savingWeekly = ref(false);
    ref("");
    ref(false);
    ref("");
    const categoryAttrs = reactive({
      size: "",
      shoeSizeUS: "",
      techSpecs: "",
      clothingType: "",
      brand: "",
      audience: "",
      homeSpace: "",
      foodType: "",
      foodSize: "",
      petType: "",
      petItemType: ""
    });
    const sizeStock = reactive({});
    const selectedSize = ref("");
    const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "34", "36", "38", "40", "42", "44"];
    const shoeSizesEU = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
    const shoeSizesUS = ["5", "6", "7", "8", "9", "10", "11", "12"];
    const categories = ref([]);
    const categoriesError = ref("");
    const loadingCategories = ref(false);
    const accentColor = computed(() => theme.accent || "#2563eb");
    const zoomed = ref(false);
    const zoomCoords = ref({ x: 50, y: 50 });
    const categoryPanelOpen = ref(false);
    const categoryDraft = ref("");
    const form = reactive({
      name: "",
      description: "",
      price: 0,
      offer_price: null,
      offer_min_qty: 1,
      image_url: "",
      stock_available: 0,
      stock_minimum: 0,
      tagsInput: "",
      product_of_week: false,
      extraImages: [],
      category: ""
    });
    const editing = reactive({ name: false, description: false, price: false, image: false, stock: false, tags: false, category: false });
    const savingField = ref(null);
    const updateMessage = ref("");
    const updateStatus = ref("ok");
    const uploadingImage = ref(false);
    const uploadError = ref("");
    const isStoreOwner = computed(() => {
      const memberships = auth.user?.memberships || [];
      const storeSlug = product.value?.store?.slug || route.params.slug;
      return memberships.some((m) => {
        const roles = (m?.roles || []).map((r) => r?.code || r)?.map((r) => r?.toLowerCase?.());
        return m?.store?.slug === storeSlug && roles.some((r) => ["admin", "owner", "manager"].includes(r));
      });
    });
    const showInlineOwnerControls = computed(() => false);
    const galleryImages = computed(() => {
      if (!product.value) return [placeholderImage];
      const raw = (product.value.images || []).map((img) => optimizeCloudinary(img?.image)).filter(Boolean);
      if (raw.length) return raw;
      if (product.value.image_url) return [optimizeCloudinary(product.value.image_url)];
      if (product.value.image) return [optimizeCloudinary(product.value.image)];
      return [getProductImage(product.value)];
    });
    ref(null);
    const activeImageIndex = ref(0);
    const activeImage = computed(() => galleryImages.value[activeImageIndex.value] || placeholderImage);
    const zoomOpen = ref(false);
    const averageRating = computed(() => {
      if (!reviews.value.length) return null;
      const avg = reviews.value.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.value.length;
      return avg.toFixed(1);
    });
    const canSubmitReview = computed(() => reviewForm.value.rating > 0 && reviewForm.value.comment.trim().length > 0);
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    const describeStock = (value) => {
      if (value <= 0) {
        return {
          label: "Sin stock disponible",
          tone: "text-red-600",
          pill: "bg-red-50 text-red-700"
        };
      }
      if (value <= 5) {
        return {
          label: `Últimas ${value} unidades`,
          tone: "text-amber-600",
          pill: "bg-amber-50 text-amber-700"
        };
      }
      return {
        label: `${value} unidades disponibles`,
        tone: "text-emerald-600",
        pill: "bg-emerald-50 text-emerald-700"
      };
    };
    const availableCategories = computed(() => categories.value || []);
    const resolvedCategoryValue = computed(() => {
      if (form.category) return form.category;
      const raw = product.value?.category;
      return raw?.id || raw?.slug || "";
    });
    const categoryLabel = computed(() => {
      const value = resolvedCategoryValue.value;
      const found = availableCategories.value.find((c) => c.id === value || c.slug === value);
      if (found?.name) return found.name;
      return product.value?.category?.name || product.value?.category || "General";
    });
    const categoryName = computed(() => categoryLabel.value?.toLowerCase?.() || "general");
    const isClothing = computed(() => /ropa|shirt|camisa|pantal|jean|blusa|dress|vestido/.test(categoryName.value));
    const isTech = computed(() => /tecno|electro|laptop|pc|notebook|tablet|phone|celu|smart/.test(categoryName.value));
    const isShoes = computed(() => /calzado|zapato|zapatilla|sneaker|bota|sandalia/.test(categoryName.value));
    const isHome = computed(() => /hogar|decor|casa|home/.test(categoryName.value));
    const isFood = computed(() => /alimento|comida|bebida|grocery/.test(categoryName.value));
    const isPet = computed(() => /mascota|pet/.test(categoryName.value));
    const availableSizes = computed(() => {
      const sizes = Object.entries(sizeStock).filter(([_, qty]) => Number(qty) > 0).map(([size]) => size);
      if (sizes.length) return sizes;
      if (categoryAttrs.size) return [categoryAttrs.size];
      if (isShoes.value) return shoeSizesEU.map((s) => `EU-${s}`);
      return sizeOptions;
    });
    const techSpecsList = computed(
      () => categoryAttrs.techSpecs ? categoryAttrs.techSpecs.split(",").map((item) => item.trim()).filter(Boolean) : []
    );
    const hasCategoryDetails = computed(
      () => Boolean(
        categoryAttrs.brand || categoryAttrs.clothingType || categoryAttrs.size || categoryAttrs.shoeSizeUS || categoryAttrs.audience || categoryAttrs.homeSpace || categoryAttrs.foodType || categoryAttrs.foodSize || categoryAttrs.petType || categoryAttrs.petItemType || techSpecsList.value.length
      )
    );
    const availableStock = computed(() => {
      if (isClothing.value && selectedSize.value && sizeStock[selectedSize.value] != null) {
        return Number(sizeStock[selectedSize.value] || 0);
      }
      const value = Number(product.value?.stock_available ?? 0);
      return Number.isFinite(value) ? value : 0;
    });
    const storeCartEnabled = computed(() => {
      const type = String(product.value?.store?.store_type || "retail");
      const cartAllowedByType = ["fast_food", "bakery"].includes(type);
      const value = product.value?.store?.cart_enabled;
      const hasToggle = value === void 0 || value === null ? true : Boolean(value);
      return cartAllowedByType && hasToggle;
    });
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
    const stockDescriptor = computed(() => describeStock(availableStock.value));
    const canAddToCart = computed(() => storeCartEnabled.value && availableStock.value > 0 && (!isClothing.value || Boolean(selectedSize.value)));
    const displayTags = computed(() => {
      const tags = (product.value?.tags || []).map((t) => typeof t === "string" ? t : t?.name || t?.label || "").map((t) => t.trim()).filter(
        (t) => Boolean(t) && !/^(talla:|talla_us:|specs:|size_stock:|tipo:|marca:|publico:|hogar:|alimento:|porcion:|mascota:|item_mascota:)/i.test(t)
      );
      if (tags.length) return tags;
      const fallback = [];
      if (product.value?.store?.slug) fallback.push(`Tienda: ${product.value.store.slug}`);
      return fallback;
    });
    watch(
      availableSizes,
      (sizes) => {
        if (!sizes.length) {
          selectedSize.value = "";
          return;
        }
        if (!selectedSize.value || !sizes.includes(selectedSize.value)) {
          selectedSize.value = sizes[0];
        }
      },
      { immediate: true }
    );
    watch(
      () => [route.params.slug, route.params.product_slug],
      () => {
        void ensureProductLoadedByRoute();
      },
      { immediate: true }
    );
    const hydrateForm = (data) => {
      form.name = data?.name || "";
      form.description = data?.description || "";
      form.price = Number(data?.price || 0);
      form.offer_price = data?.offer_price ?? null;
      form.offer_min_qty = Math.max(1, Number(data?.offer_min_qty || 1));
      form.image_url = data?.images?.[0]?.image || data?.image_url || data?.image || "";
      form.stock_available = Number(data?.stock_available ?? 0) || 0;
      form.stock_minimum = Number(data?.stock_minimum ?? 0) || 0;
      form.product_of_week = Boolean(data?.product_of_week);
      form.extraImages = (data?.images || []).map((img) => img?.image).filter(Boolean);
      form.category = data?.category?.id || "";
      const tags = (data?.tags || []).map((t) => typeof t === "string" ? t : t?.name || t?.label || "").map((t) => t.trim()).filter(Boolean);
      form.tagsInput = tags.join(", ");
      categoryAttrs.size = tags.find((t) => t.toLowerCase().startsWith("talla:"))?.split(":")[1] || "";
      categoryAttrs.shoeSizeUS = tags.find((t) => t.toLowerCase().startsWith("talla_us:"))?.split(":")[1] || "";
      categoryAttrs.techSpecs = tags.find((t) => t.toLowerCase().startsWith("specs:"))?.substring(6) || "";
      categoryAttrs.clothingType = tags.find((t) => t.toLowerCase().startsWith("tipo:"))?.split(":")[1] || "";
      categoryAttrs.brand = tags.find((t) => t.toLowerCase().startsWith("marca:"))?.split(":")[1] || "";
      categoryAttrs.audience = tags.find((t) => t.toLowerCase().startsWith("publico:"))?.split(":")[1] || "";
      categoryAttrs.homeSpace = tags.find((t) => t.toLowerCase().startsWith("hogar:"))?.split(":")[1] || "";
      categoryAttrs.foodType = tags.find((t) => t.toLowerCase().startsWith("alimento:"))?.split(":")[1] || "";
      categoryAttrs.foodSize = tags.find((t) => t.toLowerCase().startsWith("porcion:"))?.split(":")[1] || "";
      categoryAttrs.petType = tags.find((t) => t.toLowerCase().startsWith("mascota:"))?.split(":")[1] || "";
      categoryAttrs.petItemType = tags.find((t) => t.toLowerCase().startsWith("item_mascota:"))?.split(":")[1] || "";
      Object.keys(sizeStock).forEach((k) => delete sizeStock[k]);
      tags.forEach((t) => {
        const match = t.match(/^size_stock:([^:]+):(-?\d+)/i);
        if (match) {
          const qty = Number(match[2]) || 0;
          if (qty > 0) {
            sizeStock[match[1]] = qty;
          }
        }
      });
      const sizes = Object.keys(sizeStock);
      if (!selectedSize.value && sizes.length) {
        selectedSize.value = sizes[0];
      }
    };
    async function ensureProductLoadedByRoute() {
      if (product.value) return;
      const storeSlug = String(route.params.slug || tenantStore.slug || "");
      const productSlug = String(route.params.product_slug || "");
      if (!storeSlug || !productSlug) return;
      try {
        const data = await $fetch(`${config.public.apiBase}/store/${storeSlug}/catalogo/products/${productSlug}/`);
        product.value = data;
        hydrateForm(data);
        await fetchRelatedProducts();
      } catch (error) {
        console.error("No se pudo cargar el producto por ruta", error);
      }
    }
    const fetchRelatedProducts = async () => {
      if (!tenantStore.slug) return;
      try {
        const list = await getProducts();
        const currentSlug = product.value?.slug || route.params.product_slug;
        const currentCat = product.value?.category?.slug || product.value?.category?.name || product.value?.category;
        const currentTags = new Set(
          (product.value?.tags || []).map((t) => typeof t === "string" ? t : t?.name || t?.label || "").map((t) => t.trim().toLowerCase()).filter(Boolean)
        );
        const scored = (list || []).filter((item) => item?.slug !== currentSlug).map((item) => {
          let score = 0;
          const itemCat = item?.category?.slug || item?.category?.name || item?.category;
          if (itemCat && currentCat && itemCat === currentCat) score += 4;
          if (item?.product_of_week) score += 2;
          if (item?.is_featured) score += 1;
          const itemTags = (item?.tags || []).map((t) => typeof t === "string" ? t : t?.name || t?.label || "").map((t) => t.trim().toLowerCase()).filter(Boolean);
          const shared = itemTags.filter((t) => currentTags.has(t)).length;
          score += Math.min(shared, 3);
          const created = item?.created_at ? new Date(item.created_at).getTime() : 0;
          return { item, score, created };
        }).sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.created - a.created;
        }).slice(0, 6).map((entry) => entry.item);
        relatedProducts.value = scored;
      } catch (error) {
        relatedProducts.value = [];
      }
    };
    watch(
      galleryImages,
      (images) => {
        if (!images.length) {
          activeImageIndex.value = 0;
          return;
        }
        if (activeImageIndex.value > images.length - 1) {
          activeImageIndex.value = 0;
        }
        zoomed.value = false;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<!--[-->`);
      if (product.value) {
        _push(`<div class="relative mx-auto max-w-5xl space-y-10 px-4 py-10">`);
        if (isStoreOwner.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${unref(route).params.slug}/admin/productos/${unref(route).params.product_slug}/editar`,
            class: "absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
            "aria-label": "Editar producto"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Pencil), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(Pencil), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  })
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid gap-10 md:grid-cols-[1.05fr,0.95fr]"><div class="space-y-3"><div class="${ssrRenderClass([zoomed.value ? "cursor-zoom-out" : "cursor-zoom-in", "relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition"])}"><img${ssrRenderAttr("src", activeImage.value)}${ssrRenderAttr("alt", product.value.name)} class="${ssrRenderClass([zoomed.value ? "scale-150" : "scale-100", "h-full w-full object-cover transition duration-300"])}" style="${ssrRenderStyle(zoomed.value ? { transformOrigin: `${zoomCoords.value.x}% ${zoomCoords.value.y}%` } : void 0)}"><button type="button" class="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 shadow" aria-label="Ampliar imagen del producto">`);
        _push(ssrRenderComponent(unref(Search), {
          class: "h-4 w-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` Ver grande </button>`);
        if (showInlineOwnerControls.value) {
          _push(`<button type="button" class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 shadow" aria-label="Editar imagen principal">`);
          _push(ssrRenderComponent(unref(Pencil), {
            class: "h-4 w-4",
            "aria-hidden": "true"
          }, null, _parent));
          _push(` Editar imagen </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center gap-3 overflow-x-auto pb-2"><!--[-->`);
        ssrRenderList(galleryImages.value, (image, index) => {
          _push(`<button type="button" class="${ssrRenderClass([activeImageIndex.value === index ? "border-blue-600 ring-2 ring-blue-100" : "border-slate-200", "relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition"])}"><img${ssrRenderAttr("src", image)}${ssrRenderAttr("alt", `Miniatura ${index + 1}`)} class="h-full w-full object-cover"></button>`);
        });
        _push(`<!--]-->`);
        if (showInlineOwnerControls.value) {
          _push(`<button type="button" class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-700"><span class="text-xl font-bold">+</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<input type="file" accept="image/*" class="hidden"></div>`);
        if (showInlineOwnerControls.value && editing.image) {
          _push(`<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"><label class="text-sm font-semibold text-slate-700">URL de imagen principal</label><input${ssrRenderAttr("value", form.image_url)} type="url" placeholder="https://..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><div class="flex flex-wrap items-center gap-2 text-xs text-slate-600"><label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition"><input type="file" accept="image/*" class="hidden"><span>${ssrInterpolate(uploadingImage.value ? "Subiendo..." : "Subir archivo")}</span></label><span class="text-slate-500">o pega un enlace</span></div>`);
          if (uploadError.value) {
            _push(`<p class="text-xs text-red-600">${ssrInterpolate(uploadError.value)}</p>`);
          } else if (uploadingImage.value) {
            _push(`<p class="text-xs text-slate-500">Procesando imagen...</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex flex-wrap items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "image") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "image" ? "Guardando..." : "Guardar imagen")}</button><button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"> Cancelar </button>`);
          if (updateMessage.value && savingField.value === "image") {
            _push(`<p class="${ssrRenderClass([updateStatus.value === "error" ? "text-red-600" : "text-emerald-600", "text-sm"])}">${ssrInterpolate(updateMessage.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (showInlineOwnerControls.value) {
          _push(`<div class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm"><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-800"><input${ssrIncludeBooleanAttr(Array.isArray(form.product_of_week) ? ssrLooseContain(form.product_of_week, null) : form.product_of_week) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-amber-600"><span>Mostrar en Destacados de la semana</span></label><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingWeekly.value) ? " disabled" : ""}>${ssrInterpolate(savingWeekly.value ? "Guardando..." : "Guardar destacado")}</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (isTech.value && techSpecsList.value.length) {
          _push(`<div class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Especificaciones técnicas</p><div class="max-h-48 space-y-2 overflow-y-auto pr-1"><!--[-->`);
          ssrRenderList(techSpecsList.value, (spec) => {
            _push(`<div class="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"><span class="mt-1 h-2 w-2 rounded-full bg-slate-400"></span><span class="flex-1">${ssrInterpolate(spec)}</span></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-4"><div class="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500"><div class="flex items-center gap-2">`);
        if (!editing.category) {
          _push(`<span>${ssrInterpolate(categoryLabel.value)}</span>`);
        } else {
          _push(`<div class="flex flex-wrap items-center gap-2"><select${ssrIncludeBooleanAttr(loadingCategories.value) ? " disabled" : ""} class="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:bg-slate-100"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "") : ssrLooseEqual(form.category, "")) ? " selected" : ""}>Sin categoría</option><!--[-->`);
          ssrRenderList(availableCategories.value, (cat) => {
            _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, cat.id) : ssrLooseEqual(form.category, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
          });
          _push(`<!--]--></select>`);
          if (categoriesError.value) {
            _push(`<p class="text-[11px] text-red-600">${ssrInterpolate(categoriesError.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white shadow disabled:opacity-60"${ssrIncludeBooleanAttr(savingField.value === "category") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "category" ? "Guardando..." : "Guardar")}</button><button type="button" class="rounded-lg px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button></div>`);
        }
        _push(`</div>`);
        if (product.value.is_marketplace) {
          _push(`<span class="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-800">Marketplace</span>`);
        } else {
          _push(`<!---->`);
        }
        if (product.value.product_of_week) {
          _push(`<span class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>`);
        } else {
          _push(`<!---->`);
        }
        if (showInlineOwnerControls.value && !editing.category) {
          _push(`<button type="button" class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">`);
          _push(ssrRenderComponent(unref(Pencil), {
            class: "h-3.5 w-3.5",
            "aria-hidden": "true"
          }, null, _parent));
          _push(` Cambiar categoría </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-start gap-2"><div class="flex-1"><div class="flex items-start gap-2">`);
        if (!editing.name) {
          _push(`<h1 class="text-4xl font-bold text-slate-900">${ssrInterpolate(product.value.name)}</h1>`);
        } else {
          _push(`<div class="w-full max-w-xl space-y-2"><input${ssrRenderAttr("value", form.name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-lg font-semibold text-slate-900"><div class="flex flex-wrap items-center gap-2"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "name") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "name" ? "Guardando..." : "Guardar")}</button><button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button></div></div>`);
        }
        _push(`</div></div>`);
        if (showInlineOwnerControls.value && !editing.name) {
          _push(`<button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50" aria-label="Editar nombre">`);
          _push(ssrRenderComponent(unref(Pencil), {
            class: "h-4 w-4",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-3"><div class="flex items-start gap-2">`);
        if (!editing.description) {
          _push(`<p class="flex-1 text-slate-600">${ssrInterpolate(product.value.description)}</p>`);
        } else {
          _push(`<div class="w-full space-y-2"><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(form.description)}</textarea><div class="flex flex-wrap items-center gap-2"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "description") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "description" ? "Guardando..." : "Guardar")}</button><button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button></div></div>`);
        }
        if (showInlineOwnerControls.value && !editing.description) {
          _push(`<button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50" aria-label="Editar descripción">`);
          _push(ssrRenderComponent(unref(Pencil), {
            class: "h-4 w-4",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Categoría</p><p class="text-sm font-semibold text-slate-800">${ssrInterpolate(categoryLabel.value)}</p><p class="text-xs text-slate-500">Se guarda usando el ID numérico del catálogo.</p></div>`);
        if (showInlineOwnerControls.value) {
          _push(`<button type="button" class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100">`);
          _push(ssrRenderComponent(unref(Pencil), {
            class: "h-4 w-4",
            "aria-hidden": "true"
          }, null, _parent));
          _push(` Cambiar categoría </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (hasCategoryDetails.value) {
          _push(`<div class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Detalles del producto</p><div class="flex flex-wrap gap-2 text-sm text-slate-700">`);
          if (categoryAttrs.clothingType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Tipo: ${ssrInterpolate(categoryAttrs.clothingType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.audience) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Público: ${ssrInterpolate(categoryAttrs.audience)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.size) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Talla: ${ssrInterpolate(categoryAttrs.size)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.shoeSizeUS) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Talla US: ${ssrInterpolate(categoryAttrs.shoeSizeUS)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.brand) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Marca: ${ssrInterpolate(categoryAttrs.brand)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.homeSpace) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Espacio: ${ssrInterpolate(categoryAttrs.homeSpace)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.foodType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Alimento: ${ssrInterpolate(categoryAttrs.foodType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.foodSize) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Presentación: ${ssrInterpolate(categoryAttrs.foodSize)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.petType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Mascota: ${ssrInterpolate(categoryAttrs.petType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.petItemType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Artículo: ${ssrInterpolate(categoryAttrs.petItemType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-3">`);
        if (!editing.price) {
          _push(`<div class="flex items-center gap-3 text-2xl font-bold"><div class="grid flex-1 gap-3 sm:grid-cols-[1.15fr,0.85fr]"><div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.18em] text-slate-500">Oferta</p>`);
          if (product.value.offer_price) {
            _push(`<p class="mt-2 text-2xl font-semibold text-slate-900">${ssrInterpolate(offerPackLabel.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          if (product.value.offer_price && offerMinQty.value > 1) {
            _push(`<p class="mt-1 text-sm font-medium text-slate-600"> Total ${ssrInterpolate(formatClp(offerPackTotal.value))} para ${ssrInterpolate(offerMinQty.value)} unidades </p>`);
          } else if (product.value.offer_price) {
            _push(`<p class="mt-1 text-sm font-medium text-slate-600">Precio promocional por unidad</p>`);
          } else {
            _push(`<p class="mt-2 text-2xl font-semibold text-slate-900">${ssrInterpolate(formatClp(displayPrice.value))}</p>`);
          }
          _push(`</div><div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left"><p class="text-xs uppercase tracking-[0.18em] text-emerald-700">Descuento</p>`);
          if (product.value.offer_price) {
            _push(`<p class="mt-2 text-xl font-semibold text-emerald-900">${ssrInterpolate(formatClp(offerUnitPrice.value))} c/u</p>`);
          } else {
            _push(`<!---->`);
          }
          if (product.value.offer_price) {
            _push(`<p class="mt-1 text-sm text-emerald-800">Antes ${ssrInterpolate(formatClp(normalUnitPrice.value))} c/u</p>`);
          } else {
            _push(`<!---->`);
          }
          if (product.value.offer_price) {
            _push(`<p class="mt-1 text-xs font-semibold text-emerald-700">Ahorro ${ssrInterpolate(discountBadge.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><span class="inline-flex h-9 w-9" aria-hidden="true"></span></div>`);
        } else if (showInlineOwnerControls.value) {
          _push(`<div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="grid gap-3 sm:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</label><input${ssrRenderAttr("value", form.price)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio oferta</label><input${ssrRenderAttr("value", form.offer_price)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-1 sm:col-span-2"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Cantidad mínima para oferta</label><input${ssrRenderAttr("value", form.offer_min_qty)} type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div><div class="flex flex-wrap items-center gap-2"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "price") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "price" ? "Guardando..." : "Guardar precios")}</button><button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-start gap-2">`);
        if (!editing.stock) {
          _push(`<div class="${ssrRenderClass([stockDescriptor.value.tone, "flex flex-wrap items-center gap-2 text-sm font-semibold"])}"><span class="${ssrRenderClass([stockDescriptor.value.pill, "rounded-full px-3 py-1"])}">${ssrInterpolate(stockDescriptor.value.label)}</span>`);
          if (isStoreOwner.value) {
            _push(`<span class="text-slate-600">(Base: ${ssrInterpolate(availableStock.value)} | Mínimo: ${ssrInterpolate(form.stock_minimum)})</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (showInlineOwnerControls.value && !editing.stock) {
          _push(`<button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50" aria-label="Editar stock">`);
          _push(ssrRenderComponent(unref(Pencil), {
            class: "h-4 w-4",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (isClothing.value && availableSizes.value.length) {
          _push(`<div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="flex items-center justify-between"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Tallas</p><span class="text-xs text-slate-500">Stock para ${ssrInterpolate(selectedSize.value || "talla")}: ${ssrInterpolate(availableStock.value)}</span></div><div class="max-w-xs"><select class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"><!--[-->`);
          ssrRenderList(availableSizes.value, (size) => {
            _push(`<option${ssrRenderAttr("value", size)}${ssrIncludeBooleanAttr(Array.isArray(selectedSize.value) ? ssrLooseContain(selectedSize.value, size) : ssrLooseEqual(selectedSize.value, size)) ? " selected" : ""}>${ssrInterpolate(size)} (${ssrInterpolate(sizeStock[size] || 0)}) </option>`);
          });
          _push(`<!--]--></select></div><p class="text-xs text-slate-500">Solo se muestran tallas con stock.</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (showInlineOwnerControls.value && editing.stock) {
          _push(`<div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="grid gap-3 sm:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock base</label><input${ssrRenderAttr("value", form.stock_available)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock mínimo</label><input${ssrRenderAttr("value", form.stock_minimum)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div><div class="flex flex-wrap items-center gap-2"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "stock") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "stock" ? "Guardando..." : "Guardar stock")}</button><button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-2"><div class="flex items-center justify-between gap-2"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Etiquetas</p>`);
        if (showInlineOwnerControls.value && !editing.tags) {
          _push(`<button type="button" class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"> Editar </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (editing.tags) {
          _push(`<div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Escribe etiquetas separadas por coma</label><input${ssrRenderAttr("value", form.tagsInput)} type="text" placeholder="Ej: Envío gratis, Orgánico, Nuevo" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><div class="flex flex-wrap items-center gap-2"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "tags") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "tags" ? "Guardando..." : "Guardar etiquetas")}</button><button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button></div></div>`);
        } else {
          _push(`<div class="flex flex-wrap gap-2 text-sm text-slate-700"><!--[-->`);
          ssrRenderList(displayTags.value, (tag) => {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">${ssrInterpolate(tag)}</span>`);
          });
          _push(`<!--]-->`);
          if (!displayTags.value.length) {
            _push(`<span class="rounded-full border border-dashed border-slate-200 px-3 py-1 text-slate-500">Añade etiquetas para destacar este producto</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div>`);
        if (hasCategoryDetails.value) {
          _push(`<div class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Detalles del producto</p><div class="flex flex-wrap gap-2 text-sm text-slate-700">`);
          if (categoryAttrs.clothingType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Tipo: ${ssrInterpolate(categoryAttrs.clothingType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.audience) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Público: ${ssrInterpolate(categoryAttrs.audience)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.size) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Talla: ${ssrInterpolate(categoryAttrs.size)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.shoeSizeUS) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Talla US: ${ssrInterpolate(categoryAttrs.shoeSizeUS)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.brand) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Marca: ${ssrInterpolate(categoryAttrs.brand)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.homeSpace) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Espacio: ${ssrInterpolate(categoryAttrs.homeSpace)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.foodType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Alimento: ${ssrInterpolate(categoryAttrs.foodType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.foodSize) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Presentación: ${ssrInterpolate(categoryAttrs.foodSize)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.petType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Mascota: ${ssrInterpolate(categoryAttrs.petType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.petItemType) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1">Artículo: ${ssrInterpolate(categoryAttrs.petItemType)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (hasCategoryDetails.value) {
          _push(`<div class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Detalles del producto</p><div class="grid gap-3 sm:grid-cols-2">`);
          if (categoryAttrs.brand) {
            _push(`<div class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800"><p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Marca</p><p class="font-semibold">${ssrInterpolate(categoryAttrs.brand)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.clothingType) {
            _push(`<div class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800"><p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Tipo</p><p class="font-semibold">${ssrInterpolate(categoryAttrs.clothingType)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.size) {
            _push(`<div class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800"><p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Talla base</p><p class="font-semibold">${ssrInterpolate(categoryAttrs.size)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (categoryAttrs.shoeSizeUS) {
            _push(`<div class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800"><p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Talla US</p><p class="font-semibold">${ssrInterpolate(categoryAttrs.shoeSizeUS)}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          if (techSpecsList.value.length) {
            _push(`<div class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800 sm:col-span-2"><p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Especificaciones</p><p class="font-semibold">${ssrInterpolate(techSpecsList.value.join(", "))}</p></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (showInlineOwnerControls.value && (isClothing.value || isTech.value || isShoes.value)) {
          _push(`<div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Info adicional según categoría</p><h3 class="text-sm font-semibold text-slate-800">Completa detalles clave (se guardan como etiquetas internas)</h3></div><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "tags") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "tags" ? "Guardando..." : "Guardar detalles")}</button></div>`);
          if (isClothing.value) {
            _push(`<div class="space-y-4"><div class="grid gap-3 md:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla base</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, "") : ssrLooseEqual(categoryAttrs.size, "")) ? " selected" : ""}>Selecciona talla</option><!--[-->`);
            ssrRenderList(sizeOptions, (size) => {
              _push(`<option${ssrRenderAttr("value", size)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, size) : ssrLooseEqual(categoryAttrs.size, size)) ? " selected" : ""}>${ssrInterpolate(size)}</option>`);
            });
            _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de prenda</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.clothingType) ? ssrLooseContain(categoryAttrs.clothingType, "") : ssrLooseEqual(categoryAttrs.clothingType, "")) ? " selected" : ""}>Selecciona tipo</option><!--[-->`);
            ssrRenderList(["Camisa", "Pantalón", "Vestido", "Chaqueta", "Sudadera", "Short", "Falda", "Accesorio"], (type) => {
              _push(`<option${ssrRenderAttr("value", type)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.clothingType) ? ssrLooseContain(categoryAttrs.clothingType, type) : ssrLooseEqual(categoryAttrs.clothingType, type)) ? " selected" : ""}>${ssrInterpolate(type)}</option>`);
            });
            _push(`<!--]--></select></div></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, "") : ssrLooseEqual(categoryAttrs.audience, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
            ssrRenderList(["Niño", "Niña", "Mujer", "Hombre", "Unisex"], (aud) => {
              _push(`<option${ssrRenderAttr("value", aud)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, aud) : ssrLooseEqual(categoryAttrs.audience, aud)) ? " selected" : ""}>${ssrInterpolate(aud)}</option>`);
            });
            _push(`<!--]--></select></div><div class="space-y-2"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock por talla</p><div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3"><!--[-->`);
            ssrRenderList(sizeOptions, (size) => {
              _push(`<div class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"><label class="font-semibold text-slate-700">${ssrInterpolate(size)}</label><input type="number" min="0" class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right"${ssrRenderAttr("value", sizeStock[size])}></div>`);
            });
            _push(`<!--]--></div><p class="text-xs text-slate-500">Se mostrará disponibilidad según talla seleccionada.</p></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (isTech.value) {
            _push(`<div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Especificaciones técnicas</label><textarea rows="3" placeholder="Ej: 16GB RAM, 512GB SSD, Pantalla 144Hz" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(categoryAttrs.techSpecs)}</textarea><p class="text-xs text-slate-500">Se guardan como etiqueta interna &quot;specs:...&quot; para mostrar después en layout.</p><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label><input${ssrRenderAttr("value", categoryAttrs.brand)} type="text" placeholder="Ej: Samsung, Apple" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (isShoes.value) {
            _push(`<div class="space-y-4"><div class="grid gap-3 md:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (EU)</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, "") : ssrLooseEqual(categoryAttrs.size, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
            ssrRenderList(shoeSizesEU, (size) => {
              _push(`<option${ssrRenderAttr("value", `EU-${size}`)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, `EU-${size}`) : ssrLooseEqual(categoryAttrs.size, `EU-${size}`)) ? " selected" : ""}>EU ${ssrInterpolate(size)}</option>`);
            });
            _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (US)</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.shoeSizeUS) ? ssrLooseContain(categoryAttrs.shoeSizeUS, "") : ssrLooseEqual(categoryAttrs.shoeSizeUS, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
            ssrRenderList(shoeSizesUS, (size) => {
              _push(`<option${ssrRenderAttr("value", `US-${size}`)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.shoeSizeUS) ? ssrLooseContain(categoryAttrs.shoeSizeUS, `US-${size}`) : ssrLooseEqual(categoryAttrs.shoeSizeUS, `US-${size}`)) ? " selected" : ""}>US ${ssrInterpolate(size)}</option>`);
            });
            _push(`<!--]--></select></div></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, "") : ssrLooseEqual(categoryAttrs.audience, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
            ssrRenderList(["Niño", "Niña", "Mujer", "Hombre", "Unisex"], (aud) => {
              _push(`<option${ssrRenderAttr("value", aud)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, aud) : ssrLooseEqual(categoryAttrs.audience, aud)) ? " selected" : ""}>${ssrInterpolate(aud)}</option>`);
            });
            _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label><input${ssrRenderAttr("value", categoryAttrs.brand)} type="text" placeholder="Ej: Nike, Adidas" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (isHome.value) {
            _push(`<div class="space-y-2"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Espacio del hogar</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.homeSpace) ? ssrLooseContain(categoryAttrs.homeSpace, "") : ssrLooseEqual(categoryAttrs.homeSpace, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
            ssrRenderList(["Sala", "Cocina", "Habitación", "Baño", "Exterior", "Oficina"], (room) => {
              _push(`<option${ssrRenderAttr("value", room)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.homeSpace) ? ssrLooseContain(categoryAttrs.homeSpace, room) : ssrLooseEqual(categoryAttrs.homeSpace, room)) ? " selected" : ""}>${ssrInterpolate(room)}</option>`);
            });
            _push(`<!--]--></select></div>`);
          } else {
            _push(`<!---->`);
          }
          if (isFood.value) {
            _push(`<div class="space-y-3"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de alimento/bebida</label><input${ssrRenderAttr("value", categoryAttrs.foodType)} type="text" placeholder="Ej: Snacks, Granos, Bebida" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Peso/volumen</label><input${ssrRenderAttr("value", categoryAttrs.foodSize)} type="text" placeholder="Ej: 500g, 1L" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (isPet.value) {
            _push(`<div class="space-y-3"><div class="grid gap-3 md:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de mascota</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petType) ? ssrLooseContain(categoryAttrs.petType, "") : ssrLooseEqual(categoryAttrs.petType, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
            ssrRenderList(["Perro", "Gato", "Ave", "Pez", "Roedor"], (pet) => {
              _push(`<option${ssrRenderAttr("value", pet)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petType) ? ssrLooseContain(categoryAttrs.petType, pet) : ssrLooseEqual(categoryAttrs.petType, pet)) ? " selected" : ""}>${ssrInterpolate(pet)}</option>`);
            });
            _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Artículo</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petItemType) ? ssrLooseContain(categoryAttrs.petItemType, "") : ssrLooseEqual(categoryAttrs.petItemType, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
            ssrRenderList(["Accesorio", "Ropa", "Juguete", "Cama"], (item) => {
              _push(`<option${ssrRenderAttr("value", item)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petItemType) ? ssrLooseContain(categoryAttrs.petItemType, item) : ssrLooseEqual(categoryAttrs.petItemType, item)) ? " selected" : ""}>${ssrInterpolate(item)}</option>`);
            });
            _push(`<!--]--></select></div></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-wrap gap-3 pt-2"><button class="${ssrRenderClass([{ "cursor-not-allowed opacity-60": !canAddToCart.value }, "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow transition"])}"${ssrIncludeBooleanAttr(!canAddToCart.value) ? " disabled" : ""} style="${ssrRenderStyle({ backgroundColor: accentColor.value })}">`);
        _push(ssrRenderComponent(unref(ShoppingCart), {
          class: "h-4 w-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(` ${ssrInterpolate(storeCartEnabled.value ? canAddToCart.value ? "Agregar al carrito" : "Sin stock" : "Carrito deshabilitado")}</button>`);
        if (product.value.store?.slug) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${product.value.store.slug}`,
            class: "rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ir a la tienda `);
              } else {
                return [
                  createTextVNode(" Ir a la tienda ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (updateMessage.value) {
          _push(`<p class="${ssrRenderClass([updateStatus.value === "error" ? "text-red-600" : "text-emerald-600", "text-sm"])}">${ssrInterpolate(updateMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (relatedProducts.value.length) {
          _push(`<section class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Sugerencias</p><h2 class="text-lg font-semibold text-slate-900">Te puede interesar</h2><p class="text-sm text-slate-600">Elegimos por categoría, afinidad de etiquetas y lo más nuevo de esta tienda.</p></div>`);
          if (product.value.store?.slug) {
            _push(`<span class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">${ssrInterpolate(product.value.store.slug)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(relatedProducts.value, (item) => {
            _push(ssrRenderComponent(ProductCard, {
              key: item.id,
              product: item,
              accent: accentColor.value,
              "disable-cart": !storeCartEnabled.value,
              "hide-stock": true
            }, null, _parent));
          });
          _push(`<!--]--></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<section class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Reseñas</p><h2 class="text-lg font-semibold text-slate-900">Opiniones y valoración</h2></div>`);
        if (averageRating.value) {
          _push(`<span class="flex items-center gap-1 text-sm font-semibold text-amber-600">`);
          _push(ssrRenderComponent(unref(Star), {
            class: "h-4 w-4",
            "aria-hidden": "true"
          }, null, _parent));
          _push(` ${ssrInterpolate(averageRating.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3"><label class="text-sm font-semibold text-slate-700">Deja tu reseña</label><div class="grid gap-2 sm:grid-cols-2"><input${ssrRenderAttr("value", reviewForm.value.customer_name)} type="text" placeholder="Tu nombre" class="rounded-xl border border-slate-200 px-3 py-2 text-sm"><div class="flex flex-col gap-1"><span class="text-xs uppercase tracking-wide text-slate-500">Tu valoración</span><div class="flex items-center gap-1"><!--[-->`);
        ssrRenderList(5, (star) => {
          _push(`<button type="button" class="transition"${ssrRenderAttr("aria-label", `Asignar ${star} estrellas`)}>`);
          _push(ssrRenderComponent(unref(Star), {
            class: ["h-5 w-5 transition", star <= (reviewHover.value || reviewForm.value.rating) ? "text-amber-500 fill-amber-500 stroke-amber-500" : "text-slate-300 fill-transparent stroke-slate-300"]
          }, null, _parent));
          _push(`</button>`);
        });
        _push(`<!--]--><span class="text-xs text-slate-500">${ssrInterpolate(reviewHover.value || reviewForm.value.rating ? (reviewHover.value || reviewForm.value.rating) + " / 5" : "Selecciona una valoración")}</span></div></div></div><textarea rows="3" placeholder="Escribe tu comentario" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(reviewForm.value.comment)}</textarea><div class="flex flex-wrap items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(sendingReview.value || !canSubmitReview.value) ? " disabled" : ""}>${ssrInterpolate(sendingReview.value ? "Enviando…" : "Publicar reseña")}</button><span class="text-xs text-slate-500">Tu reseña se publica abajo de inmediato.</span>`);
        if (reviewMessage.value) {
          _push(`<p class="${ssrRenderClass([reviewStatus.value === "error" ? "text-red-600" : "text-green-600", "text-sm"])}">${ssrInterpolate(reviewMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="space-y-3"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Reseñas recientes</p>`);
        if (reviews.value.length) {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(reviews.value, (review) => {
            _push(`<article class="rounded-xl border border-slate-100 bg-white p-3 shadow-sm"><div class="flex flex-col gap-1 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between"><div class="flex items-center gap-2"><span class="font-semibold">${ssrInterpolate(review.customer_name || "Cliente")}</span>`);
            if (review.pending) {
              _push(`<span class="text-[11px] font-semibold uppercase tracking-widest text-amber-600">Pendiente</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="flex items-center gap-1 text-amber-500"><!--[-->`);
            ssrRenderList(5, (star) => {
              _push(ssrRenderComponent(unref(Star), {
                key: `${review.id}-star-${star}`,
                class: ["h-4 w-4", star <= Number(review.rating) ? "text-amber-500 fill-amber-500 stroke-amber-500" : "text-slate-300 fill-transparent stroke-slate-300"]
              }, null, _parent));
            });
            _push(`<!--]--></div></div><p class="mt-1 text-sm text-slate-600">${ssrInterpolate(review.comment)}</p><p class="text-xs text-slate-400">${ssrInterpolate(new Date(review.created_at).toLocaleDateString())}</p></article>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="text-sm text-slate-600">Aún no hay reseñas.</p>`);
        }
        _push(`</div></section></div>`);
      } else {
        _push(`<div class="text-gray-500 text-center py-20"> Producto no encontrado </div>`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (zoomOpen.value) {
          _push2(`<div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-label="Imagen ampliada del producto"><button type="button" class="absolute right-6 top-6 rounded-full bg-white/90 p-2 text-slate-800 shadow" aria-label="Cerrar zoom">`);
          _push2(ssrRenderComponent(unref(X), {
            class: "h-5 w-5",
            "aria-hidden": "true"
          }, null, _parent));
          _push2(`</button><img${ssrRenderAttr("src", activeImage.value)}${ssrRenderAttr("alt", product.value?.name)} class="max-h-[85vh] w-auto rounded-3xl border border-white/20 object-contain"></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (categoryPanelOpen.value) {
          _push2(`<div class="fixed inset-0 z-[9998] bg-black/40"><div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"><div class="flex items-center justify-between border-b border-slate-200 px-4 py-3"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Cambiar categoría</p><p class="text-sm font-semibold text-slate-800">Selecciona la categoría y guarda</p></div><button class="rounded-full p-2 text-slate-600 hover:bg-slate-100" aria-label="Cerrar panel">`);
          _push2(ssrRenderComponent(unref(X), {
            class: "h-5 w-5",
            "aria-hidden": "true"
          }, null, _parent));
          _push2(`</button></div><div class="space-y-4 overflow-y-auto p-4"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Categoría</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryDraft.value) ? ssrLooseContain(categoryDraft.value, "") : ssrLooseEqual(categoryDraft.value, "")) ? " selected" : ""}>Sin categoría</option><!--[-->`);
          ssrRenderList(availableCategories.value, (cat) => {
            _push2(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(categoryDraft.value) ? ssrLooseContain(categoryDraft.value, cat.id) : ssrLooseEqual(categoryDraft.value, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
          });
          _push2(`<!--]--></select></div><div class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"><p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Actual</p><p class="font-semibold">${ssrInterpolate(categoryLabel.value)}</p></div></div><div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cancelar</button><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(savingField.value === "category") ? " disabled" : ""}>${ssrInterpolate(savingField.value === "category" ? "Guardando..." : "Guardar categoría")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/productos/[product_slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_product_slug_-BAsZZ5rm.mjs.map
