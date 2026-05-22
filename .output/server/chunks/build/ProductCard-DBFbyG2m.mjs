import { _ as __nuxt_component_0$1 } from './nuxt-link-D_lROxzU.mjs';
import { ref, defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderClass, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { Heart, ShoppingCart } from 'lucide-vue-next';
import { d as defineStore } from './server.mjs';
import { useRouter } from 'vue-router';

const useCartStore = defineStore("cart", () => {
  const context = ref("marketplace");
  const items = ref([]);
  const setContext = (value) => {
    context.value = value || "marketplace";
  };
  const addProduct = (product) => {
    if (!product) return;
    const productId = product.id ?? product.slug;
    if (productId === void 0 || productId === null) return;
    const existing = items.value.find((item) => (item.id ?? item.slug) === productId);
    if (existing) {
      existing.quantity = Number(existing.quantity || 1) + 1;
      return;
    }
    items.value.push({
      ...product,
      quantity: 1,
      context: context.value
    });
  };
  return {
    context,
    items,
    setContext,
    addProduct
  };
});
const DEFAULT_ACCENT = "#2563eb";
const DEFAULT_GRADIENT_FROM = "#111827";
const DEFAULT_GRADIENT_TO = "#0b2358";
const useThemeStore = defineStore("theme", () => {
  const accent = ref(DEFAULT_ACCENT);
  const gradientFrom = ref(DEFAULT_GRADIENT_FROM);
  const gradientTo = ref(DEFAULT_GRADIENT_TO);
  const loadFromStorage = () => {
    return;
  };
  const applyTheme = () => {
    return;
  };
  const setTheme = (nextTheme) => {
    if (nextTheme.accent) accent.value = nextTheme.accent;
    if (nextTheme.gradientFrom) gradientFrom.value = nextTheme.gradientFrom;
    if (nextTheme.gradientTo) gradientTo.value = nextTheme.gradientTo;
  };
  return {
    accent,
    gradientFrom,
    gradientTo,
    loadFromStorage,
    applyTheme,
    setTheme
  };
});
const STORE_FAVORITES_KEY = "pymeweb_favorite_stores";
const PRODUCT_FAVORITES_KEY = "pymeweb_favorite_products";
const writeJsonSet = (key, values) => {
  return;
};
const makeProductFavoriteKey = (storeSlug, productId) => {
  const storePart = String(storeSlug ?? "").trim();
  const productPart = String(productId ?? "").trim();
  return [storePart, productPart].filter(Boolean).join(":");
};
const useFavorites = () => {
  const storeFavorites = ref(/* @__PURE__ */ new Set());
  const productFavorites = ref(/* @__PURE__ */ new Set());
  const persist = () => {
    writeJsonSet(STORE_FAVORITES_KEY, storeFavorites.value);
    writeJsonSet(PRODUCT_FAVORITES_KEY, productFavorites.value);
  };
  const isStoreFavorite = (storeSlug) => storeFavorites.value.has(String(storeSlug ?? "").trim());
  const toggleStoreFavorite = (storeSlug) => {
    const key = String(storeSlug ?? "").trim();
    if (!key) return false;
    if (storeFavorites.value.has(key)) {
      storeFavorites.value.delete(key);
    } else {
      storeFavorites.value.add(key);
    }
    persist();
    return storeFavorites.value.has(key);
  };
  const isProductFavoriteKey = (favoriteKey) => productFavorites.value.has(String(favoriteKey ?? "").trim());
  const toggleProductFavoriteKey = (favoriteKey) => {
    const key = String(favoriteKey ?? "").trim();
    if (!key) return false;
    if (productFavorites.value.has(key)) {
      productFavorites.value.delete(key);
    } else {
      productFavorites.value.add(key);
    }
    persist();
    return productFavorites.value.has(key);
  };
  return {
    isStoreFavorite,
    isProductFavoriteKey,
    toggleStoreFavorite,
    toggleProductFavoriteKey
  };
};
const MARKET_ACCENT = "#f59e0b";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {},
    isMarketplace: { type: Boolean },
    accent: {},
    canManage: { type: Boolean },
    onDelete: {},
    editUrl: {},
    isMine: { type: Boolean },
    hideStock: { type: Boolean },
    highlightBuy: { type: Boolean },
    disableCart: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const product = props.product;
    const isMarketplace = computed(() => Boolean(props.isMarketplace));
    const highlightBuy = computed(() => Boolean(props.highlightBuy));
    useCartStore();
    const theme = useThemeStore();
    useRouter();
    const accentColor = computed(() => isMarketplace.value ? MARKET_ACCENT : props.accent || theme.accent || "#2563eb");
    computed(() => ({ background: `radial-gradient(circle at 30% 20%, ${accentColor.value}1a, transparent 40%)` }));
    const marketBadgeClass = computed(() => isMarketplace.value ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700");
    const imageSrc = computed(() => product?.image_url || product?.images?.[0]?.image || product?.image || "/logoPW.png");
    const sanitizePublisherLabel = (value) => {
      const candidate = String(value || "").trim();
      if (!candidate) return "";
      if (candidate.includes("@")) return "";
      return candidate;
    };
    const marketplacePublisherLabel = computed(() => {
      if (!isMarketplace.value) return product?.store?.slug || "tienda";
      return [
        product?.submitted_by_name,
        product?.submitted_by_username,
        product?.seller_name,
        product?.owner_name,
        product?.store?.name,
        product?.store?.slug
      ].map(sanitizePublisherLabel).find(Boolean) || "Vendedor";
    });
    const marketplacePublisherPath = computed(() => {
      if (!isMarketplace.value) return "";
      const sellerId = product?.submitted_by ?? product?.submitted_by_id ?? product?.seller_id ?? null;
      if (sellerId === null || sellerId === void 0 || sellerId === "") return "";
      return `/marketplace/vendedores/${sellerId}`;
    });
    const storeDisplayName = computed(() => product?.store?.name || product?.store?.slug || "Tienda");
    const onImgError = (event) => {
      const target = event.target;
      if (!target) return;
      target.onerror = null;
      target.src = "/logoPW.png";
    };
    const availableStock = computed(() => {
      const raw = Number(product?.stock_available ?? 0);
      return Number.isFinite(raw) ? raw : 0;
    });
    const storeCartEnabled = computed(() => {
      const value = product?.store?.cart_enabled;
      return value === void 0 || value === null ? true : Boolean(value);
    });
    const canAddToCart = computed(() => availableStock.value > 0 && storeCartEnabled.value && !props.disableCart);
    const describeStock = (value) => {
      if (value <= 0) return { label: "Sin stock", tone: "text-red-600", pill: "bg-red-50 text-red-700" };
      if (value <= 5) return { label: `Últimas ${value}`, tone: "text-amber-600", pill: "bg-amber-50 text-amber-700" };
      return { label: `${value} disponibles`, tone: "text-emerald-600", pill: "bg-emerald-50 text-emerald-700" };
    };
    const stockDescriptor = computed(() => describeStock(availableStock.value));
    const hideStock = computed(() => Boolean(props.hideStock));
    const offerMinQty = computed(() => Math.max(1, Number(product?.offer_min_qty || 1)));
    const offerUnitPrice = computed(() => Number(product?.offer_price || 0));
    const offerPackTotal = computed(() => offerUnitPrice.value * offerMinQty.value);
    const discountPercent = computed(() => {
      const price = Number(product?.price || 0);
      const offer = Number(product?.offer_price || 0);
      if (!price || !offer || offer >= price) return 0;
      return Math.round((price - offer) / price * 100);
    });
    computed(() => discountPercent.value > 0 ? `${discountPercent.value}%` : "");
    const hasDiscountRibbon = computed(() => discountPercent.value > 0);
    const effectivePrice = computed(() => {
      if (product?.offer_price && offerMinQty.value <= 1) {
        return Number(product.offer_price);
      }
      return Number(product?.price || 0);
    });
    const formatClp = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0);
    const { isProductFavoriteKey } = useFavorites();
    const productFavoriteKey = (p) => makeProductFavoriteKey(p?.store?.slug, p?.slug || p?.id);
    const isFavorite = computed(() => isProductFavoriteKey(productFavoriteKey(product)));
    const menuOpen = ref(false);
    const canManage = computed(() => Boolean(props.canManage));
    const editUrl = computed(() => {
      if (props.editUrl) return props.editUrl;
      if (product?.store?.slug && !isMarketplace.value) return `/store/${product.store.slug}/productos/${product.slug}`;
      return product?.slug ? `/marketplace/productos/${product.slug}` : "";
    });
    const productDetailPath = computed(() => {
      const id = product?.slug || product?.id;
      if (!id) return "/marketplace";
      if (product?.store?.slug && !product?.store_is_marketplace) return `/store/${product.store.slug}/productos/${id}`;
      return `/marketplace/productos/${id}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: ["group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-gradient-to-br from-white via-slate-50 to-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(15,23,42,0.3)]", [
          isMarketplace.value ? "border-[#0f274f]/10" : "border-slate-200",
          highlightBuy.value ? "border-rose-300/70 shadow-[0_12px_30px_-16px_rgba(244,63,94,0.55)] hover:shadow-[0_20px_36px_-14px_rgba(244,63,94,0.7)]" : ""
        ]],
        style: { backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,252,0.95)), radial-gradient(circle at top, ${accentColor.value}12, transparent 45%)` }
      }, _attrs))}><div class="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true"><div class="absolute -right-16 top-0 h-40 w-40 rounded-full blur-3xl" style="${ssrRenderStyle({ background: `${accentColor.value}14` })}"></div><div class="absolute -left-12 bottom-0 h-28 w-28 rounded-full blur-3xl" style="${ssrRenderStyle({ background: `${accentColor.value}10` })}"></div></div>`);
      if (!isMarketplace.value) {
        _push(`<div class="absolute left-0 top-0 h-full w-2 rounded-r-full" style="${ssrRenderStyle({ background: `linear-gradient(to bottom, ${accentColor.value}f0 0%, ${accentColor.value}cc 38%, ${accentColor.value}66 72%, transparent 100%)`, zIndex: 2 })}" aria-hidden="true"></div>`);
      } else {
        _push(`<div class="absolute left-0 top-0 h-full w-2 rounded-r-full bg-gradient-to-b from-amber-300 via-amber-400 to-transparent" style="${ssrRenderStyle({ "z-index": "2" })}" aria-hidden="true"></div>`);
      }
      if (canManage.value) {
        _push(`<button type="button" class="${ssrRenderClass([hasDiscountRibbon.value ? "top-12" : "top-4", "absolute right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/80 bg-white/95 text-lg font-semibold text-slate-700 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:bg-white"])}" aria-label="Acciones"> ⋮ </button>`);
      } else {
        _push(`<button type="button" class="${ssrRenderClass([[hasDiscountRibbon.value ? "top-12" : "top-4", isFavorite.value ? "border-rose-200 text-rose-600" : "border-slate-200"], "absolute right-4 inline-flex h-9 w-9 items-center justify-center rounded-full border bg-white/95 text-sm font-semibold text-slate-500 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:text-rose-500"])}"${ssrRenderAttr("aria-pressed", isFavorite.value)} aria-label="Marcar producto como favorito">`);
        _push(ssrRenderComponent(unref(Heart), {
          class: ["h-4 w-4", isFavorite.value ? "fill-current text-rose-600" : "text-slate-500"]
        }, null, _parent));
        _push(`</button>`);
      }
      if (hasDiscountRibbon.value) {
        _push(`<div class="pointer-events-none absolute right-0 top-0 z-20 rounded-bl-2xl bg-gradient-to-r from-rose-600 to-fuchsia-600 px-4 py-2.5 text-sm font-black tracking-tight text-white shadow-[0_14px_28px_-18px_rgba(190,24,93,0.75)]">${ssrInterpolate(discountPercent.value)}% </div>`);
      } else {
        _push(`<!---->`);
      }
      if (isMarketplace.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/marketplace/productos/${unref(product).slug}`,
          class: "relative block h-40 w-full overflow-hidden bg-slate-100",
          style: { "text-decoration": "none" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", imageSrc.value || "/logoPW.png")}${ssrRenderAttr("alt", unref(product).name)} class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" aria-hidden="true"${_scopeId}></div>`);
            } else {
              return [
                createVNode("img", {
                  src: imageSrc.value || "/logoPW.png",
                  alt: unref(product).name,
                  class: "h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]",
                  onError: ($event) => onImgError($event)
                }, null, 40, ["src", "alt", "onError"]),
                createVNode("div", {
                  class: "absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent",
                  "aria-hidden": "true"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: productDetailPath.value,
          class: "relative block h-40 w-full overflow-hidden bg-slate-100",
          style: { "text-decoration": "none" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", imageSrc.value || "/logoPW.png")}${ssrRenderAttr("alt", unref(product).name)} class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" aria-hidden="true"${_scopeId}></div>`);
            } else {
              return [
                createVNode("img", {
                  src: imageSrc.value || "/logoPW.png",
                  alt: unref(product).name,
                  class: "h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]",
                  onError: ($event) => onImgError($event)
                }, null, 40, ["src", "alt", "onError"]),
                createVNode("div", {
                  class: "absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent",
                  "aria-hidden": "true"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<div class="relative flex flex-1 flex-col gap-3 p-4"><div class="flex items-center justify-between gap-3"><p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">${ssrInterpolate(unref(product).category?.name || "General")}</p>`);
      if (isMarketplace.value && marketplacePublisherPath.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: marketplacePublisherPath.value,
          class: "rounded-full border border-[#0f274f]/10 bg-[#0f274f]/5 px-2.5 py-1 text-[11px] font-semibold text-[#0f274f] shadow-sm transition hover:bg-[#0f274f]/10",
          onClick: () => {
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(marketplacePublisherLabel.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(marketplacePublisherLabel.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (isMarketplace.value) {
        _push(`<span class="rounded-full border border-[#0f274f]/10 bg-[#0f274f]/5 px-2.5 py-1 text-[11px] font-semibold text-[#0f274f] shadow-sm">${ssrInterpolate(marketplacePublisherLabel.value)}</span>`);
      } else {
        _push(`<span class="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">${ssrInterpolate(storeDisplayName.value)}</span>`);
      }
      _push(`</div><h3 class="line-clamp-1 text-[1.05rem] font-extrabold tracking-tight text-slate-900 transition group-hover:text-slate-700">${ssrInterpolate(unref(product).name)}</h3><div class="flex flex-wrap items-center gap-2">`);
      if (!hideStock.value) {
        _push(`<span class="${ssrRenderClass([stockDescriptor.value.pill, "rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm"])}">${ssrInterpolate(stockDescriptor.value.label)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(product).product_of_week) {
        _push(`<span class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(product).free_shipping) {
        _push(`<span class="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold text-sky-800">Envío gratis</span>`);
      } else if (isMarketplace.value) {
        _push(`<span class="${ssrRenderClass([marketBadgeClass.value, "rounded-full px-2 py-1 text-[11px] font-semibold"])}">Marketplace</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="rounded-2xl border border-slate-200/80 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur"><div class="flex items-start justify-between gap-3"><div class="min-w-0"><p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">${ssrInterpolate(unref(product).offer_price ? "Oferta" : "Precio")}</p><div class="mt-1 flex items-end gap-2">`);
      if (unref(product).offer_price && offerMinQty.value > 1) {
        _push(`<p class="text-2xl font-black leading-none tracking-tight text-slate-950 sm:text-[1.9rem]">${ssrInterpolate(offerMinQty.value)}x ${ssrInterpolate(formatClp(offerUnitPrice.value))}</p>`);
      } else {
        _push(`<p class="text-2xl font-black leading-none tracking-tight text-slate-950 sm:text-[1.9rem]">${ssrInterpolate(formatClp(effectivePrice.value))}</p>`);
      }
      if (unref(product).offer_price) {
        _push(`<div class="pb-0.5 text-right"><p class="text-[11px] font-semibold text-slate-500">${ssrInterpolate(formatClp(offerUnitPrice.value))} c/u</p><p class="text-[11px] font-semibold text-slate-400 line-through">${ssrInterpolate(formatClp(unref(product).price))} c/u</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(product).offer_price && offerMinQty.value > 1) {
        _push(`<p class="mt-1 text-[11px] font-semibold text-slate-500"> Total pack ${ssrInterpolate(formatClp(offerPackTotal.value))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><div class="mt-auto grid grid-cols-2 gap-2 pt-1"><button class="${ssrRenderClass([highlightBuy.value ? "ring-2 ring-rose-200" : "", "inline-flex min-h-11 items-center justify-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-16px_rgba(249,115,22,0.32)] transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"])}" style="${ssrRenderStyle({ backgroundImage: isMarketplace.value ? "linear-gradient(135deg, #f59e0b, #ea580c)" : `linear-gradient(135deg, ${accentColor.value}, ${accentColor.value})`, borderColor: isMarketplace.value ? "rgba(180,83,9,0.12)" : `${accentColor.value}22` })}"${ssrIncludeBooleanAttr(!canAddToCart.value) ? " disabled" : ""}>`);
      _push(ssrRenderComponent(unref(ShoppingCart), {
        class: "h-4 w-4",
        "aria-hidden": "true"
      }, null, _parent));
      _push(` ${ssrInterpolate(!storeCartEnabled.value ? "Carrito deshabilitado" : highlightBuy.value ? "Comprar ya" : "Agregar")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: productDetailPath.value,
        class: "inline-flex min-h-11 items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_20px_-16px_rgba(249,115,22,0.28)] transition duration-200 hover:-translate-y-0.5",
        style: { backgroundImage: isMarketplace.value ? "linear-gradient(135deg, #fb923c, #f97316)" : `linear-gradient(135deg, ${accentColor.value}, ${accentColor.value})`, borderColor: isMarketplace.value ? "rgba(180,83,9,0.12)" : `${accentColor.value}22` }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(highlightBuy.value ? "Ver oferta" : "Ver producto")}`);
          } else {
            return [
              createTextVNode(toDisplayString(highlightBuy.value ? "Ver oferta" : "Ver producto"), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (canManage.value && menuOpen.value) {
        _push(`<div class="absolute right-4 top-14 z-10 w-40 rounded-2xl border border-slate-200 bg-white py-1 text-sm shadow-lg">`);
        if (editUrl.value) {
          _push(`<a${ssrRenderAttr("href", editUrl.value)} class="block px-3 py-2 text-slate-700 hover:bg-slate-50">Editar</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="block w-full px-3 py-2 text-left text-red-600 hover:bg-slate-50">Eliminar</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main, { __name: "ProductCard" });

export { __nuxt_component_0 as _, useCartStore as a, useFavorites as b, makeProductFavoriteKey as m, useThemeStore as u };
//# sourceMappingURL=ProductCard-DBFbyG2m.mjs.map
