import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { S as StoreCard } from './StoreCard-CecvbcL6.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-D84iBmkp.mjs';
import { Star, ChevronRight, Heart } from 'lucide-vue-next';
import { P as ProductCard } from './ProductCard-Cqk6ehWP.mjs';
import { useRouter } from 'vue-router';
import { a as useRuntimeConfig, b as useAuthStore } from './server.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { u as useCartStore } from './cart-Dcn-8ZaM.mjs';
import { u as useFavorites, m as makeProductFavoriteKey } from './useFavorites-BLT7MOEn.mjs';
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

const storesPerPage = 9;
const marketplacePerPage = 6;
const MARKET_ACCENT = "#f59e0b";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    String(config.public.apiBase || "");
    useRouter();
    const auth = useAuthStore();
    const theme = useThemeStore();
    useCartStore();
    const { isStoreFavorite, isProductFavoriteKey } = useFavorites();
    const storesAll = ref([]);
    const storesMine = ref([]);
    const loadingAll = ref(true);
    const loadingMine = ref(false);
    const marketplaceProducts = ref([]);
    const loadingMarketplace = ref(true);
    const marketplaceError = ref("");
    const latestStoreProducts = ref([]);
    const shuffledStoreProducts = ref([]);
    const highlightedStoreProductId = ref(null);
    const loadingStoreProducts = ref(true);
    const storeProductsError = ref("");
    const error = ref("");
    ref("");
    const creating = ref(false);
    const createError = ref("");
    const createMessage = ref("");
    const showCreateStoreModal = ref(false);
    const createForm = ref({
      name: "",
      slug: "",
      store_type: "retail",
      description: "",
      about: "",
      about_who_we_are: "",
      about_history: "",
      about_mission: "",
      about_extra: "",
      contact_email: "",
      phone: "",
      whatsapp: "",
      address: "",
      logo_url: "",
      banner_url: "",
      accent_color: "#2563eb",
      gradient_from: "#111827",
      gradient_to: "#0b2358",
      hero_pattern_style: "type",
      quick_media: []
    });
    const filterQuery = ref("");
    const storesPage = ref(1);
    const showFavoriteStoresOnly = ref(false);
    const showFavoriteProductsOnly = ref(false);
    const marketplacePage = ref(1);
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    const heroStyle = computed(() => ({
      backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom}, ${theme.gradientTo})`
    }));
    const filteredStoresAll = computed(() => {
      const term = filterQuery.value.trim().toLowerCase();
      const base = !term ? storesAll.value : storesAll.value.filter((s) => s.name.toLowerCase().includes(term) || s.slug.toLowerCase().includes(term));
      const filtered = showFavoriteStoresOnly.value ? base.filter((s) => isStoreFavorite(s.slug)) : base;
      return [...filtered].sort((a, b) => {
        const favDiff = Number(isStoreFavorite(b.slug)) - Number(isStoreFavorite(a.slug));
        if (favDiff) return favDiff;
        return a.name.localeCompare(b.name);
      });
    });
    const emptyStoresMessage = computed(
      () => filterQuery.value.trim() ? "No hay tiendas que coincidan con tu búsqueda." : "No hay tiendas disponibles."
    );
    const storesTotalPages = computed(() => Math.max(1, Math.ceil(filteredStoresAll.value.length / storesPerPage)));
    const paginatedStores = computed(() => {
      const start = (storesPage.value - 1) * storesPerPage;
      return filteredStoresAll.value.slice(start, start + storesPerPage);
    });
    const storeAccent = (product) => product?.store?.color || product?.store?.brand_color || theme.accent;
    const shuffleArray = (items) => {
      const clone = [...items];
      for (let i = clone.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = clone[i];
        clone[i] = clone[j];
        clone[j] = temp;
      }
      return clone;
    };
    const shuffleFeaturedProducts = () => {
      const base = shuffleArray((latestStoreProducts.value || []).filter(Boolean));
      shuffledStoreProducts.value = base;
      if (!base.length) {
        highlightedStoreProductId.value = null;
        return;
      }
      if (!base.some((product) => String(product?.id) === String(highlightedStoreProductId.value))) {
        highlightedStoreProductId.value = base[0]?.id ?? null;
      }
    };
    const rotateHighlightedFeaturedProduct = () => {
      const source = shuffledStoreProducts.value.length ? shuffledStoreProducts.value : latestStoreProducts.value;
      if (!source.length) {
        highlightedStoreProductId.value = null;
        return;
      }
      const currentId = highlightedStoreProductId.value;
      const candidates = source.filter((product) => String(product?.id) !== String(currentId));
      const pool = candidates.length ? candidates : source;
      const randomIndex = Math.floor(Math.random() * pool.length);
      highlightedStoreProductId.value = pool[randomIndex]?.id ?? source[0]?.id ?? null;
    };
    const featuredStoreProducts = computed(() => latestStoreProducts.value || []);
    computed(() => featuredStoreProducts.value[0] || null);
    computed(() => featuredStoreProducts.value.slice(1));
    const productFavoriteKey = (product) => makeProductFavoriteKey(product?.store?.slug, product?.slug || product?.id);
    const isProductFavorite = (product) => isProductFavoriteKey(productFavoriteKey(product));
    const displayMarketplaceProducts = computed(() => {
      const base = marketplaceProducts.value || [];
      const filtered = showFavoriteProductsOnly.value ? base.filter((p) => isProductFavorite(p)) : base;
      return [...filtered].sort((a, b) => Number(isProductFavorite(b)) - Number(isProductFavorite(a)));
    });
    const marketplaceTotalPages = computed(() => Math.max(1, Math.ceil(displayMarketplaceProducts.value.length / marketplacePerPage)));
    const paginatedMarketplaceProducts = computed(() => {
      const start = (marketplacePage.value - 1) * marketplacePerPage;
      return displayMarketplaceProducts.value.slice(start, start + marketplacePerPage);
    });
    const marketplacePageStart = computed(() => displayMarketplaceProducts.value.length ? (marketplacePage.value - 1) * marketplacePerPage + 1 : 0);
    const marketplacePageEnd = computed(() => Math.min(marketplacePage.value * marketplacePerPage, displayMarketplaceProducts.value.length));
    const fetchMyStores = async () => {
      if (!auth.token) return;
      loadingMine.value = true;
      try {
        storesMine.value = await auth.fetchMyStores();
      } finally {
        loadingMine.value = false;
      }
    };
    computed(() => ({ background: `radial-gradient(circle at 30% 20%, ${MARKET_ACCENT}1a, transparent 40%)` }));
    computed(() => "bg-amber-100 text-amber-800");
    watch(latestStoreProducts, () => {
      shuffleFeaturedProducts();
      rotateHighlightedFeaturedProduct();
    });
    watch(
      () => auth.token,
      async (token) => {
        if (token) {
          await fetchMyStores();
        } else {
          storesMine.value = [];
        }
      }
    );
    watch(filterQuery, () => {
      storesPage.value = 1;
    });
    watch(displayMarketplaceProducts, () => {
      if (marketplacePage.value > marketplaceTotalPages.value) marketplacePage.value = marketplaceTotalPages.value;
    });
    watch(showFavoriteProductsOnly, () => {
      marketplacePage.value = 1;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_StoreCard = StoreCard;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative isolate overflow-hidden" }, _attrs))}><div class="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true"><div class="absolute -left-16 top-10 h-56 w-56 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl"></div><div class="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl"></div></div><section class="relative z-10 bg-slate-950 text-white reveal" style="${ssrRenderStyle(heroStyle.value)}"><div class="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-16 lg:py-24 grid lg:grid-cols-[1.1fr,0.9fr] gap-8 lg:gap-12 items-center"><div class="hidden md:block"><p class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em]"> Pymeweb impulsa tu negocio </p><h1 class="hero-title mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.03] tracking-tight"> Vende mas hoy: crea una tienda que destaque y convierta cada visita en compra </h1><p class="mt-5 text-lg text-white/85 max-w-2xl"> Diseña tu vitrina con estilo propio, publica en minutos y gestiona pedidos en un solo panel para crecer sin fricciones. </p><div class="mt-8 grid gap-3 sm:grid-cols-3">`);
      if (unref(auth).isAuthenticated) {
        _push(`<button type="button" class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5" style="${ssrRenderStyle({ backgroundColor: unref(theme).accent, color: "#fff" })}"> Crear mi tienda `);
        _push(ssrRenderComponent(unref(Star), {
          class: "h-4 w-4",
          "aria-hidden": "true"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5",
          style: { backgroundColor: unref(theme).accent, color: "#fff" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Iniciar sesión `);
              _push2(ssrRenderComponent(unref(ChevronRight), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createTextVNode(" Iniciar sesión "),
                createVNode(unref(ChevronRight), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<a href="#tiendas" class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:border-white/40 hover:bg-white/5 transition"> Ver tiendas `);
      _push(ssrRenderComponent(unref(ChevronRight), {
        class: "h-4 w-4",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</a></div></div><div class="relative"><div class="absolute -inset-8 rounded-3xl bg-white/5 blur-2xl"></div><div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"><div class="flex items-center justify-between text-sm text-white/80"><span>Tutorial Pymeweb</span><span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">3 pasos</span></div><div class="mt-4 overflow-hidden rounded-2xl border border-white/20 bg-white/5 md:hidden"><img${ssrRenderAttr("src", _imports_0)} alt="Pymeweb" class="h-40 w-full object-contain p-4"></div><div class="mt-4 space-y-3"><div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"><div><p class="text-xs uppercase text-white/60">Paso 1</p><p class="text-base font-semibold">Configura una tienda con identidad de marca</p></div><span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Inicio</span></div><div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"><div><p class="text-xs uppercase text-white/60">Paso 2</p><p class="text-base font-semibold">Publica productos y ofertas irresistibles</p></div><span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Catálogo</span></div><div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"><div><p class="text-xs uppercase text-white/60">Paso 3</p><p class="text-base font-semibold">Controla ventas y pedidos en tiempo real</p></div><span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Ventas</span></div><p class="text-xs text-white/60">Un flujo completo para atraer clientes, cerrar ventas y escalar tu pyme.</p></div><div class="mt-5 grid grid-cols-2 gap-2 md:hidden">`);
      if (unref(auth).isAuthenticated) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard",
          class: "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-white",
          style: { backgroundColor: unref(theme).accent }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Dashboard `);
            } else {
              return [
                createTextVNode(" Dashboard ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-white",
          style: { backgroundColor: unref(theme).accent }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Iniciar sesión `);
            } else {
              return [
                createTextVNode(" Iniciar sesión ")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/marketplace",
        class: "inline-flex items-center justify-center rounded-xl border border-white/30 px-3 py-2 text-xs font-semibold text-white"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ir al marketplace `);
          } else {
            return [
              createTextVNode(" Ir al marketplace ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="#tiendas" class="inline-flex items-center justify-center rounded-xl border border-white/30 px-3 py-2 text-xs font-semibold text-white"> Ver tiendas </a></div></div></div></div></section><section class="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 reveal" style="${ssrRenderStyle({ "animation-delay": "0.03s" })}"><div class="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-[#0f274f] to-[#164172] p-5 text-white shadow-xl sm:p-6"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Últimas novedades</p><h3 class="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">Lo nuevo para vender mejor hoy</h3></div></div>`);
      if (loadingStoreProducts.value) {
        _push(`<div class="mt-4 text-white/80">Cargando productos de tiendas...</div>`);
      } else if (storeProductsError.value) {
        _push(`<div class="mt-4 text-rose-200">${ssrInterpolate(storeProductsError.value)}</div>`);
      } else if (!featuredStoreProducts.value.length) {
        _push(`<div class="mt-4 text-white/85">Sin productos recientes publicados.</div>`);
      } else {
        _push(`<div class="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(featuredStoreProducts.value, (product) => {
          _push(ssrRenderComponent(ProductCard, {
            key: product.id,
            product,
            accent: storeAccent(product),
            hideStock: true
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section><section id="tiendas" class="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-9 reveal" style="${ssrRenderStyle({ "animation-delay": "0.05s" })}"><div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#081225] via-[#11284f] to-[#1d4ed8] p-5 text-white shadow-2xl sm:p-6"><div class="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true"><div class="absolute -left-10 top-0 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl"></div><div class="absolute right-10 top-6 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl"></div><div class="absolute -bottom-8 left-1/3 h-36 w-36 rounded-full bg-fuchsia-400/10 blur-3xl"></div></div><div class="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Todas las tiendas</p><h3 class="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">Descubre tiendas activas en Pymeweb</h3><p class="mt-2 max-w-2xl text-white/78">Filtra por nombre, guarda favoritas y entra directo a comprar desde cualquier dispositivo.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tiendas",
        class: "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/20"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ver todas las tiendas `);
            _push2(ssrRenderComponent(unref(ChevronRight), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Ver todas las tiendas "),
              createVNode(unref(ChevronRight), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_230px_230px] xl:items-end"><label class="space-y-1 md:col-span-2 xl:col-span-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/80">Buscar tienda</span><input${ssrRenderAttr("value", filterQuery.value)} type="text" placeholder="Buscar tienda..." class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 shadow-inner backdrop-blur focus:border-cyan-300 focus:outline-none"></label><button type="button" class="${ssrRenderClass([showFavoriteStoresOnly.value ? "border-fuchsia-200 bg-fuchsia-400/20 text-white shadow-inner" : "border-white/20 bg-white/10 text-white/85 hover:bg-white/15", "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition"])}">`);
      _push(ssrRenderComponent(unref(Heart), {
        class: ["h-4 w-4", showFavoriteStoresOnly.value ? "fill-current text-fuchsia-200" : "text-cyan-200"]
      }, null, _parent));
      _push(` ${ssrInterpolate(showFavoriteStoresOnly.value ? "Solo favoritos" : "Mostrar todos")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tiendas",
        class: "hidden h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 xl:inline-flex"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Explorar catálogo `);
          } else {
            return [
              createTextVNode(" Explorar catálogo ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      if (loadingAll.value) {
        _push(`<div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">Cargando tiendas...</div>`);
      } else if (error.value) {
        _push(`<div class="rounded-2xl border border-rose-200/50 bg-rose-500/10 px-4 py-3 text-rose-100">${ssrInterpolate(error.value)}</div>`);
      } else if (filteredStoresAll.value.length === 0) {
        _push(`<div class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-white/75">${ssrInterpolate(emptyStoresMessage.value)}</div>`);
      } else {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(paginatedStores.value, (store) => {
          _push(ssrRenderComponent(_component_StoreCard, {
            key: store.slug,
            store,
            accent: unref(theme).accent
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (storesTotalPages.value > 1) {
        _push(`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur"><button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40"${ssrIncludeBooleanAttr(storesPage.value === 1) ? " disabled" : ""}> Anterior </button><span>Página ${ssrInterpolate(storesPage.value)} / ${ssrInterpolate(storesTotalPages.value)}</span><button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40"${ssrIncludeBooleanAttr(storesPage.value === storesTotalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-9 reveal" style="${ssrRenderStyle({ "animation-delay": "0.08s" })}"><div class="rounded-[2rem] border border-[#0f274f]/20 bg-gradient-to-br from-slate-950 via-[#0f274f] to-amber-500 p-5 text-white shadow-2xl sm:p-6"><div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end"><div><p class="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/90">PW Marketplace</p><h3 class="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">Productos destacados para comprar con confianza</h3><p class="mt-2 max-w-2xl text-white/78">Encuentra ofertas de distintas tiendas y compra directo desde su origen, en un solo lugar.</p></div><div class="grid gap-3 sm:grid-cols-2 lg:min-w-[360px] lg:max-w-[420px] lg:flex-none lg:grid-cols-2 lg:justify-end"><button type="button" class="${ssrRenderClass([showFavoriteProductsOnly.value ? "border-amber-200 bg-amber-400/20 text-white shadow-inner" : "border-white/20 bg-white/10 text-white/85 hover:bg-white/20", "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition"])}">`);
      _push(ssrRenderComponent(unref(Heart), {
        class: ["h-4 w-4", showFavoriteProductsOnly.value ? "fill-current text-amber-200" : "text-amber-100"]
      }, null, _parent));
      _push(` ${ssrInterpolate(showFavoriteProductsOnly.value ? "Solo productos favoritos" : "Todos los productos")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/marketplace",
        class: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/20 sm:col-span-2 lg:col-span-1"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ir al PW Marketplace `);
            _push2(ssrRenderComponent(unref(ChevronRight), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createTextVNode(" Ir al PW Marketplace "),
              createVNode(unref(ChevronRight), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
      if (loadingMarketplace.value) {
        _push(`<div class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">Cargando marketplace...</div>`);
      } else if (marketplaceError.value) {
        _push(`<div class="rounded-2xl border border-rose-200/50 bg-rose-500/10 px-4 py-3 text-rose-100">${ssrInterpolate(marketplaceError.value)}</div>`);
      } else if (!marketplaceProducts.value.length) {
        _push(`<div class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-white/75"> No hay productos de marketplace publicados todavía. </div>`);
      } else {
        _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(paginatedMarketplaceProducts.value, (product) => {
          _push(ssrRenderComponent(ProductCard, {
            key: product.id,
            product,
            isMarketplace: true
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (displayMarketplaceProducts.value.length > marketplacePerPage) {
        _push(`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur"><button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40"${ssrIncludeBooleanAttr(marketplacePage.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(marketplacePageStart.value)}-${ssrInterpolate(marketplacePageEnd.value)} de ${ssrInterpolate(displayMarketplaceProducts.value.length)}</p><button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40"${ssrIncludeBooleanAttr(marketplacePage.value === marketplaceTotalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="relative z-10 mx-auto max-w-6xl px-4 pb-8 sm:px-6 reveal" style="${ssrRenderStyle({ "animation-delay": "0.1s" })}"><div class="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#eef6ff] p-6 shadow-sm sm:p-8"><div class="flex flex-wrap items-center gap-4"><div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm"><img${ssrRenderAttr("src", _imports_0)} alt="Pymeweb" class="h-10 w-10 object-contain"></div><div class="min-w-0 flex-1"><p class="section-kicker">Sobre Pymeweb</p><h3 class="section-title text-3xl sm:text-4xl">Impulsamos pymes con una vitrina digital simple y potente</h3></div></div><p class="mt-4 max-w-3xl text-slate-600"> Pymeweb nace para ayudar a emprendedores y pequeñas empresas a vender online con identidad propia, sin fricción técnica y con foco en resultados reales. </p><div class="mt-6 grid gap-4 md:grid-cols-3"><article class="rounded-xl border border-sky-100 bg-sky-50 p-4"><p class="text-xs uppercase tracking-[0.16em] text-sky-700">Misión</p><p class="mt-2 text-sm text-slate-700">Digitalizar ventas de pymes con herramientas prácticas y modernas.</p></article><article class="rounded-xl border border-violet-100 bg-violet-50 p-4"><p class="text-xs uppercase tracking-[0.16em] text-violet-700">Visión</p><p class="mt-2 text-sm text-slate-700">Ser la plataforma de comercio local más confiable para crecer en Latinoamérica.</p></article><article class="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p class="text-xs uppercase tracking-[0.16em] text-emerald-700">Compromiso</p><p class="mt-2 text-sm text-slate-700">Acompañar a cada negocio con soporte cercano, pagos seguros y evolución continua.</p></article></div></div></section>`);
      if (showCreateStoreModal.value) {
        _push(`<section class="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-10"><div class="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"><button class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100" aria-label="Cerrar creación"> × </button><div class="space-y-4"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Nueva tienda</p><h2 class="text-xl font-semibold text-slate-900">Crea tu tienda en Pymeweb</h2><p class="text-slate-600">Completa los datos principales. Puedes seguir editando dentro de tu tienda luego de crearla.</p></div><div class="space-y-5"><section class="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">General</p><div class="mt-3 grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Nombre</label><input${ssrRenderAttr("value", createForm.value.name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Slug (opcional)</label><input${ssrRenderAttr("value", createForm.value.slug)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Tipo de tienda</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="retail"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.store_type) ? ssrLooseContain(createForm.value.store_type, "retail") : ssrLooseEqual(createForm.value.store_type, "retail")) ? " selected" : ""}>Retail</option><option value="fast_food"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.store_type) ? ssrLooseContain(createForm.value.store_type, "fast_food") : ssrLooseEqual(createForm.value.store_type, "fast_food")) ? " selected" : ""}>Comida rápida</option><option value="bakery"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.store_type) ? ssrLooseContain(createForm.value.store_type, "bakery") : ssrLooseEqual(createForm.value.store_type, "bakery")) ? " selected" : ""}>Pastelería</option><option value="pharmacy"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.store_type) ? ssrLooseContain(createForm.value.store_type, "pharmacy") : ssrLooseEqual(createForm.value.store_type, "pharmacy")) ? " selected" : ""}>Farmacia</option><option value="fashion"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.store_type) ? ssrLooseContain(createForm.value.store_type, "fashion") : ssrLooseEqual(createForm.value.store_type, "fashion")) ? " selected" : ""}>Moda</option><option value="bookstore"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.store_type) ? ssrLooseContain(createForm.value.store_type, "bookstore") : ssrLooseEqual(createForm.value.store_type, "bookstore")) ? " selected" : ""}>Librería</option></select></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Descripción</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(createForm.value.description)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Quiénes somos</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="¿Quiénes son y qué ofrecen?">${ssrInterpolate(createForm.value.about_who_we_are)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Nuestra historia</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="¿Cómo nació la tienda y su evolución?">${ssrInterpolate(createForm.value.about_history)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Misión y visión</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="¿Cuál es su propósito y visión?">${ssrInterpolate(createForm.value.about_mission)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Información adicional (opcional)</label><textarea rows="2" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Valores, equipo, certificaciones, etc.">${ssrInterpolate(createForm.value.about_extra)}</textarea></div></div></section><section class="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Diseño</p><div class="mt-3 grid gap-4 md:grid-cols-2"><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Logo</label><input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Banner principal (opcional)</label><input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Color acento</label><input${ssrRenderAttr("value", createForm.value.accent_color)} type="color" class="h-10 w-full rounded-xl border border-slate-200 bg-white px-2 py-1"></div><div class="space-y-2"><label class="text-sm text-slate-600">Patrón</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="type"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.hero_pattern_style) ? ssrLooseContain(createForm.value.hero_pattern_style, "type") : ssrLooseEqual(createForm.value.hero_pattern_style, "type")) ? " selected" : ""}>Según tipo</option><option value="diagonal"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.hero_pattern_style) ? ssrLooseContain(createForm.value.hero_pattern_style, "diagonal") : ssrLooseEqual(createForm.value.hero_pattern_style, "diagonal")) ? " selected" : ""}>Diagonal</option><option value="vertical"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.hero_pattern_style) ? ssrLooseContain(createForm.value.hero_pattern_style, "vertical") : ssrLooseEqual(createForm.value.hero_pattern_style, "vertical")) ? " selected" : ""}>Vertical</option><option value="circles"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.hero_pattern_style) ? ssrLooseContain(createForm.value.hero_pattern_style, "circles") : ssrLooseEqual(createForm.value.hero_pattern_style, "circles")) ? " selected" : ""}>Círculos</option><option value="none"${ssrIncludeBooleanAttr(Array.isArray(createForm.value.hero_pattern_style) ? ssrLooseContain(createForm.value.hero_pattern_style, "none") : ssrLooseEqual(createForm.value.hero_pattern_style, "none")) ? " selected" : ""}>Sin patrón</option></select></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Galería rápida (máximo 5: imagen/video)</label><input type="file" multiple accept="image/*,video/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><p class="text-xs text-slate-500">${ssrInterpolate(createForm.value.quick_media.length)}/5 elementos listos.</p></div></div></section><section class="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Contacto</p><div class="mt-3 grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Email de contacto</label><input${ssrRenderAttr("value", createForm.value.contact_email)} type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Teléfono</label><input${ssrRenderAttr("value", createForm.value.phone)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">WhatsApp</label><input${ssrRenderAttr("value", createForm.value.whatsapp)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Dirección</label><input${ssrRenderAttr("value", createForm.value.address)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div></section></div><div class="flex flex-wrap items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: unref(theme).accent })}"${ssrIncludeBooleanAttr(creating.value || !createForm.value.name.trim()) ? " disabled" : ""}>${ssrInterpolate(creating.value ? "Creando..." : "Crear tienda")}</button>`);
        if (createError.value) {
          _push(`<p class="text-sm text-red-600">${ssrInterpolate(createError.value)}</p>`);
        } else if (createMessage.value) {
          _push(`<p class="text-sm text-emerald-600">${ssrInterpolate(createMessage.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<footer class="relative z-10 border-t bg-white/80 backdrop-blur"><div class="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-slate-500"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Pymeweb — Gestiona y personaliza tus tiendas </div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dd-8yBII.mjs.map
