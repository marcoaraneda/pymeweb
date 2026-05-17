import { b as useAuthStore, d as __nuxt_component_0, a as useRuntimeConfig } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, ref, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-D84iBmkp.mjs';
import { P as ProductCard } from './ProductCard-Cqk6ehWP.mjs';
import { useRoute } from 'vue-router';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { u as useCartStore } from './cart-Dcn-8ZaM.mjs';
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
import 'lucide-vue-next';
import './useFavorites-BLT7MOEn.mjs';

const inflightRequests = /* @__PURE__ */ new Map();
const inflightMutations = /* @__PURE__ */ new Map();
const backoffUntilByKey = /* @__PURE__ */ new Map();
const lastSuccessAtByKey = /* @__PURE__ */ new Map();
const parseRetryAfterHeader = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  const asSeconds = Number(value);
  if (Number.isFinite(asSeconds) && asSeconds > 0) {
    return Math.ceil(asSeconds);
  }
  const asDate = Date.parse(value);
  if (!Number.isNaN(asDate)) {
    const seconds = Math.ceil((asDate - Date.now()) / 1e3);
    if (seconds > 0) return seconds;
  }
  return null;
};
const parseSecondsFromDetail = (detail) => {
  if (typeof detail !== "string") return null;
  const match = detail.match(/(\d+)\s*seconds?/i);
  const parsed = Number(match?.[1] || 0);
  if (Number.isFinite(parsed) && parsed > 0) return Math.ceil(parsed);
  return null;
};
const withJitterMs = (baseMs) => {
  const factor = 0.8 + Math.random() * 0.4;
  return Math.max(1e3, Math.ceil(baseMs * factor));
};
const getErrorRetryAfterSeconds = (err) => {
  const retryAfter = err?.response?.headers?.get?.("retry-after") ?? err?.response?.headers?.["retry-after"] ?? err?.response?._data?.retry_after;
  const fromHeader = parseRetryAfterHeader(retryAfter);
  if (fromHeader) return fromHeader;
  const fromDetail = parseSecondsFromDetail(err?.response?._data?.detail || err?.message);
  if (fromDetail) return fromDetail;
  return null;
};
const applyBackoff = (key, err, fallbackMs) => {
  const retryAfterSeconds = getErrorRetryAfterSeconds(err);
  const baseMs = retryAfterSeconds ? retryAfterSeconds * 1e3 : fallbackMs;
  const backoffMs = withJitterMs(baseMs);
  backoffUntilByKey.set(key, Date.now() + backoffMs);
};
const getBackoffSeconds = (key) => {
  const until = Number(backoffUntilByKey.get(key) || 0);
  if (!until) return 0;
  return Math.max(0, Math.ceil((until - Date.now()) / 1e3));
};
const createRateLimitError = (key) => {
  const waitSeconds = getBackoffSeconds(key);
  const error = new Error(`Demasiadas solicitudes. Reintenta en ${waitSeconds}s.`);
  error.response = { status: 429 };
  error.retryAfterSeconds = waitSeconds;
  return error;
};
const useMarketplaceRequests = () => {
  const controlledGet = async (key, url, options) => {
    const force = options?.force === true;
    const backoffMs = Number(options?.backoffMs || 1e4);
    const minIntervalMs = Number(options?.minIntervalMs || 0);
    const now = Date.now();
    const backoffUntil = Number(backoffUntilByKey.get(key) || 0);
    if (!force && backoffUntil > now) {
      throw createRateLimitError(key);
    }
    const lastSuccessAt = Number(lastSuccessAtByKey.get(key) || 0);
    if (!force && minIntervalMs > 0 && lastSuccessAt && now - lastSuccessAt < minIntervalMs) {
      if (inflightRequests.has(key)) {
        return await inflightRequests.get(key);
      }
    }
    if (inflightRequests.has(key)) {
      return await inflightRequests.get(key);
    }
    const requestPromise = (async () => {
      try {
        const data = await $fetch(url, {
          headers: options?.headers,
          credentials: options?.credentials
        });
        backoffUntilByKey.set(key, 0);
        lastSuccessAtByKey.set(key, Date.now());
        return data;
      } catch (err) {
        if (err?.response?.status === 429) {
          applyBackoff(key, err, backoffMs);
        }
        throw err;
      } finally {
        inflightRequests.delete(key);
      }
    })();
    inflightRequests.set(key, requestPromise);
    return await requestPromise;
  };
  const controlledMutation = async (key, url, options) => {
    const force = options.force === true;
    const backoffMs = Number(options.backoffMs || 1e4);
    const now = Date.now();
    const backoffUntil = Number(backoffUntilByKey.get(key) || 0);
    if (!force && backoffUntil > now) {
      throw createRateLimitError(key);
    }
    if (inflightMutations.has(key)) {
      return await inflightMutations.get(key);
    }
    const mutationPromise = (async () => {
      try {
        const data = await $fetch(url, {
          method: options.method,
          headers: options.headers,
          credentials: options.credentials,
          body: options.body
        });
        backoffUntilByKey.set(key, 0);
        lastSuccessAtByKey.set(key, Date.now());
        return data;
      } catch (err) {
        if (err?.response?.status === 429) {
          applyBackoff(key, err, backoffMs);
        }
        throw err;
      } finally {
        inflightMutations.delete(key);
      }
    })();
    inflightMutations.set(key, mutationPromise);
    return await mutationPromise;
  };
  return {
    controlledGet,
    controlledMutation,
    getBackoffSeconds,
    getErrorRetryAfterSeconds
  };
};
const marketplaceAccent = "#f59e0b";
const perPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "marketplace",
  __ssrInlineRender: true,
  setup(__props) {
    useThemeStore();
    const auth = useAuthStore();
    useCartStore();
    const config = useRuntimeConfig();
    const route = useRoute();
    const { controlledGet } = useMarketplaceRequests();
    const isMarketplaceRoot = computed(() => route.path === "/marketplace");
    const heroStyle = computed(() => ({ "--gradient-from": "#92400e", "--gradient-to": marketplaceAccent }));
    const products = ref([]);
    const loadingProducts = ref(true);
    const productsError = ref("");
    const productSearch = ref("");
    const categoryFilter = ref("");
    const sortOrder = ref("");
    const mineOnly = ref(false);
    const offerOnly = ref(false);
    const inStockOnly = ref(false);
    const categories = ref([]);
    const page = ref(1);
    const myMarketplaceProfilePath = computed(() => {
      const id = auth.user?.id;
      return id ? `/marketplace/vendedores/${id}` : "";
    });
    const activeFilters = computed(() => {
      const items = [];
      if (productSearch.value.trim()) items.push(`Búsqueda: ${productSearch.value.trim()}`);
      if (categoryFilter.value) {
        const category = categories.value.find((item) => item.slug === categoryFilter.value);
        items.push(`Categoría: ${category?.name || categoryFilter.value}`);
      }
      if (sortOrder.value === "price_asc") items.push("Precio: menor a mayor");
      if (sortOrder.value === "price_desc") items.push("Precio: mayor a menor");
      if (sortOrder.value === "name_asc") items.push("Nombre: A → Z");
      if (sortOrder.value === "name_desc") items.push("Nombre: Z → A");
      if (mineOnly.value) items.push("Solo mis productos");
      if (offerOnly.value) items.push("Solo ofertas");
      if (inStockOnly.value) items.push("Solo con stock");
      return items;
    });
    const formatClp = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0);
    const displayPrice = (product) => {
      const minQty = Math.max(1, Number(product?.offer_min_qty || 1));
      if (product?.offer_price && minQty <= 1) return Number(product.offer_price);
      return Number(product?.price || 0);
    };
    const filteredProducts = computed(() => {
      let data = [...products.value];
      if (mineOnly.value) {
        data = data.filter((product) => isMine(product));
      }
      if (offerOnly.value) {
        data = data.filter((product) => Number(product?.offer_price || 0) > 0);
      }
      if (inStockOnly.value) {
        data = data.filter((product) => Number(product?.stock_available || 0) > 0);
      }
      if (sortOrder.value === "price_asc") {
        data.sort((a, b) => Number(a.offer_price || a.price || 0) - Number(b.offer_price || b.price || 0));
      }
      if (sortOrder.value === "price_desc") {
        data.sort((a, b) => Number(b.offer_price || b.price || 0) - Number(a.offer_price || a.price || 0));
      }
      if (sortOrder.value === "name_asc") {
        data.sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));
      }
      if (sortOrder.value === "name_desc") {
        data.sort((a, b) => String(b?.name || "").localeCompare(String(a?.name || "")));
      }
      return data;
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)));
    const paginatedProducts = computed(() => {
      const start = (page.value - 1) * perPage;
      return filteredProducts.value.slice(start, start + perPage);
    });
    const pageStart = computed(() => filteredProducts.value.length ? (page.value - 1) * perPage + 1 : 0);
    const pageEnd = computed(() => Math.min(page.value * perPage, filteredProducts.value.length));
    const isMine = (product) => {
      const userId = auth.user?.id;
      return Boolean(userId && product?.submitted_by === userId);
    };
    const fetchProducts = async () => {
      loadingProducts.value = true;
      productsError.value = "";
      try {
        const params = new URLSearchParams();
        if (productSearch.value.trim()) params.append("search", productSearch.value.trim());
        if (categoryFilter.value) params.append("category", categoryFilter.value);
        if (sortOrder.value === "price_asc" || sortOrder.value === "price_desc") params.append("order", sortOrder.value);
        const query = params.toString();
        products.value = await controlledGet(
          `marketplace:products:${query}`,
          `${config.public.apiBase}/marketplace/products/?${query}`,
          { backoffMs: 8e3, minIntervalMs: 500 }
        );
      } catch (err) {
        if (err?.response?.status === 429) {
          productsError.value = "Demasiadas solicitudes. Espera unos segundos para volver a consultar productos.";
        } else {
          productsError.value = "Error al cargar productos";
        }
      } finally {
        loadingProducts.value = false;
      }
    };
    let fetchTimer = null;
    const scheduleFetch = () => {
      if (fetchTimer) clearTimeout(fetchTimer);
      fetchTimer = setTimeout(fetchProducts, 250);
    };
    watch([productSearch, categoryFilter, sortOrder], () => {
      page.value = 1;
      scheduleFetch();
    });
    watch(mineOnly, () => {
      page.value = 1;
    });
    watch([offerOnly, inStockOnly], () => {
      page.value = 1;
    });
    watch(filteredProducts, () => {
      if (page.value > totalPages.value) page.value = totalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      if (!isMarketplaceRoot.value) {
        _push(ssrRenderComponent(_component_NuxtPage, _attrs, null, _parent));
      } else {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50" }, _attrs))}><section class="relative overflow-hidden bg-slate-900 text-white" style="${ssrRenderStyle(heroStyle.value)}"><div class="absolute inset-0 opacity-80" style="${ssrRenderStyle({ "background": "radial-gradient(circle at 10% 20%, var(--gradient-from), transparent 35%), radial-gradient(circle at 80% 0%, var(--gradient-to), transparent 40%)" })}"></div><div class="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between"><div class="space-y-5"><div class="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-amber-100/90 backdrop-blur"><span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/10"><img${ssrRenderAttr("src", _imports_0)} alt="Pymeweb" class="h-5 w-5 object-contain"></span> PW Marketplace </div><h1 class="max-w-2xl text-3xl font-semibold leading-tight lg:text-4xl">Publica tus productos y véndelos en PW Marketplace</h1><p class="max-w-2xl text-slate-100/80">Sube productos sin tener una tienda propia y controla qué está activo o vendido.</p><div class="grid gap-3 sm:grid-cols-2 lg:max-w-xl">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(auth).isAuthenticated ? "/marketplace/mis-productos" : "/login",
          class: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(auth).isAuthenticated ? "Publicar producto" : "Iniciar sesión para publicar")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(auth).isAuthenticated ? "Publicar producto" : "Iniciar sesión para publicar"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/marketplace/mis-productos",
          class: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Gestionar mis productos `);
            } else {
              return [
                createTextVNode(" Gestionar mis productos ")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (myMarketplaceProfilePath.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: myMarketplaceProfilePath.value,
            class: "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 sm:col-span-2"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ver mi perfil `);
              } else {
                return [
                  createTextVNode(" Ver mi perfil ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<a href="#productos" class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 sm:col-span-2"> Ver productos publicados </a></div></div><div class="grid w-full max-w-xl grid-cols-2 gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur"><!--[-->`);
        ssrRenderList(filteredProducts.value.slice(0, 4), (product) => {
          _push(`<article class="rounded-xl border border-white/10 bg-white/5 p-3"><img${ssrRenderAttr("src", product.image_url || product.images?.[0]?.image || product.image || "/logoPW.png")}${ssrRenderAttr("alt", product.name)} class="mb-2 h-20 w-full rounded-lg object-cover"><p class="text-xs uppercase text-amber-200/80">${ssrInterpolate(product.category?.name || "General")}</p><p class="text-sm font-semibold text-white line-clamp-1">${ssrInterpolate(product.name)}</p><p class="text-base font-bold text-red-200">`);
          if (product.offer_price) {
            _push(`<span class="mr-1 text-slate-300 line-through">${ssrInterpolate(formatClp(product.price))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(formatClp(displayPrice(product)))}</p>`);
          if (product.offer_price && Number(product.offer_min_qty || 1) > 1) {
            _push(`<p class="text-[11px] font-semibold text-rose-200">Oferta desde ${ssrInterpolate(Number(product.offer_min_qty))} unidades</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]-->`);
        if (!filteredProducts.value.length) {
          _push(`<div class="col-span-2 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-amber-100"> Sin productos cargados todavía. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></section><section id="productos" class="mx-auto max-w-6xl space-y-5 px-6 py-8"><div class="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]"><div class="rounded-[2rem] border border-[#0f274f]/15 bg-gradient-to-br from-white via-[#f8fafc] to-amber-50 p-5 shadow-sm sm:p-6"><p class="text-xs font-semibold uppercase tracking-[0.22em] text-[#0f274f]/70">PW Marketplace</p><h2 class="section-title section-title--marketplace mt-2 text-3xl">Productos destacados para comprar con confianza</h2><p class="mt-3 max-w-2xl text-slate-600">Encuentra ofertas de distintas tiendas y compra directo desde su origen, en un solo lugar.</p><div class="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-600"><span class="rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">${ssrInterpolate(filteredProducts.value.length)} resultados</span><span class="rounded-full border border-[#0f274f]/20 bg-[#0f274f]/5 px-3 py-1 text-[#0f274f] shadow-sm">Página ${ssrInterpolate(page.value)} de ${ssrInterpolate(totalPages.value)}</span><!--[-->`);
        ssrRenderList(activeFilters.value, (item) => {
          _push(`<span class="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-800 shadow-sm">${ssrInterpolate(item)}</span>`);
        });
        _push(`<!--]--></div><div class="mt-5 grid gap-3 sm:grid-cols-3"><article class="rounded-2xl border border-amber-100 bg-white/80 p-4 shadow-sm backdrop-blur"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Descubre</p><p class="mt-2 text-sm text-slate-700">Explora productos activos con un filtro rápido y visual.</p></article><article class="rounded-2xl border border-sky-100 bg-sky-50 p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Compra seguro</p><p class="mt-2 text-sm text-slate-700">Cada producto mantiene su origen y su contexto de tienda.</p></article><article class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Vende mejor</p><p class="mt-2 text-sm text-slate-700">Publica desde tu perfil o centraliza tus productos aquí.</p></article></div></div><div class="rounded-[2rem] border border-[#0f274f]/15 bg-gradient-to-br from-slate-950 via-[#0f274f] to-[#173b6b] p-5 text-white shadow-2xl sm:p-6"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/90">Publica y destaca</p><p class="mt-2 text-lg font-semibold">Activa tu vitrina en un espacio con más presencia.</p></div><span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">Marketplace</span></div><p class="mt-3 text-sm text-slate-100/80">Sube productos sin tienda o gestiona los tuyos desde aquí, con el mismo lenguaje visual del marketplace.</p><div class="mt-5 flex flex-wrap gap-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(auth).isAuthenticated ? "/marketplace/mis-productos" : "/login",
          class: "rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(auth).isAuthenticated ? "Publicar ahora" : "Iniciar sesión para publicar")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(auth).isAuthenticated ? "Publicar ahora" : "Iniciar sesión para publicar"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(auth).isAuthenticated) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/marketplace/mis-productos",
            class: "rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Gestionar mis productos `);
              } else {
                return [
                  createTextVNode(" Gestionar mis productos ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (myMarketplaceProfilePath.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: myMarketplaceProfilePath.value,
            class: "rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ver mi perfil `);
              } else {
                return [
                  createTextVNode(" Ver mi perfil ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-5 grid gap-3 sm:grid-cols-3"><div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><p class="text-xs uppercase tracking-[0.16em] text-amber-100/80">Acción</p><p class="mt-1 text-sm font-semibold">Sube, organiza y vende.</p></div><div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><p class="text-xs uppercase tracking-[0.16em] text-cyan-100/80">Paleta</p><p class="mt-1 text-sm font-semibold">Oscuro, ámbar y azul profundo.</p></div><div class="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"><p class="text-xs uppercase tracking-[0.16em] text-emerald-100/80">Flujo</p><p class="mt-1 text-sm font-semibold">Rápido y claro en móvil.</p></div></div></div></div><div class="filter-panel w-full rounded-[2rem] border border-[#0f274f]/15 bg-white/95 p-5 shadow-[0_20px_60px_rgba(15,39,79,0.08)] sm:p-6"><div class="grid gap-4 md:grid-cols-2 xl:grid-cols-[210px_210px_auto_280px] xl:items-end"><label class="flex flex-col gap-2"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Categoría</span><select class="h-11 w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-3 py-2 text-sm text-slate-700 shadow-inner outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, "") : ssrLooseEqual(categoryFilter.value, "")) ? " selected" : ""}>Todas las categorías</option><!--[-->`);
        ssrRenderList(categories.value, (cat) => {
          _push(`<option${ssrRenderAttr("value", cat.slug)}${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, cat.slug) : ssrLooseEqual(categoryFilter.value, cat.slug)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
        });
        _push(`<!--]--></select></label><label class="flex flex-col gap-2"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Orden</span><select class="h-11 w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-3 py-2 text-sm text-slate-700 shadow-inner outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-100"><option value=""${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "") : ssrLooseEqual(sortOrder.value, "")) ? " selected" : ""}>Ordenar por precio</option><option value="price_asc"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "price_asc") : ssrLooseEqual(sortOrder.value, "price_asc")) ? " selected" : ""}>Menor a mayor</option><option value="price_desc"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "price_desc") : ssrLooseEqual(sortOrder.value, "price_desc")) ? " selected" : ""}>Mayor a menor</option><option value="name_asc"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "name_asc") : ssrLooseEqual(sortOrder.value, "name_asc")) ? " selected" : ""}>A → Z</option><option value="name_desc"${ssrIncludeBooleanAttr(Array.isArray(sortOrder.value) ? ssrLooseContain(sortOrder.value, "name_desc") : ssrLooseEqual(sortOrder.value, "name_desc")) ? " selected" : ""}>Z → A</option></select></label>`);
        if (unref(auth).isAuthenticated) {
          _push(`<label class="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-2 text-sm text-slate-700 shadow-inner"><input${ssrIncludeBooleanAttr(Array.isArray(mineOnly.value) ? ssrLooseContain(mineOnly.value, null) : mineOnly.value) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"> Solo mis productos </label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<label class="flex flex-col gap-2"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Buscar</span><input${ssrRenderAttr("value", productSearch.value)} type="text" placeholder="Buscar producto..." class="h-11 w-full rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-2 text-sm text-slate-700 shadow-inner outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:ring-2 focus:ring-amber-100"></label></div><div class="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4"><button type="button" class="${ssrRenderClass([offerOnly.value ? "border-amber-300 bg-amber-100 text-amber-800 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300", "inline-flex h-9 items-center rounded-full border px-3 text-xs font-semibold transition"])}"> Solo ofertas </button><button type="button" class="${ssrRenderClass([inStockOnly.value ? "border-emerald-300 bg-emerald-100 text-emerald-800 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300", "inline-flex h-9 items-center rounded-full border px-3 text-xs font-semibold transition"])}"> Solo con stock </button>`);
        if (activeFilters.value.length) {
          _push(`<button type="button" class="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm hover:border-slate-300"> Limpiar todo </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="ml-auto rounded-full border border-[#0f274f]/15 bg-[#0f274f]/5 px-3 py-1 text-xs font-semibold text-[#0f274f]">${ssrInterpolate(filteredProducts.value.length)} resultados</span></div></div>`);
        if (loadingProducts.value) {
          _push(`<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(6, (i) => {
            _push(`<div class="animate-pulse rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div class="mb-3 h-3 w-24 rounded bg-slate-200"></div><div class="mb-2 h-4 w-32 rounded bg-slate-200"></div><div class="mb-4 h-4 w-full rounded bg-slate-200"></div><div class="h-8 w-28 rounded bg-slate-200"></div></div>`);
          });
          _push(`<!--]--></div>`);
        } else if (productsError.value) {
          _push(`<div class="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700"><div class="flex items-center justify-between gap-3"><span>${ssrInterpolate(productsError.value)}</span><button class="rounded-lg border border-red-200 px-3 py-1 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"${ssrIncludeBooleanAttr(loadingProducts.value) ? " disabled" : ""}> Reintentar </button></div></div>`);
        } else if (!filteredProducts.value.length) {
          _push(`<div class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600"><p class="font-semibold text-slate-800">No hay productos publicados en marketplace.</p><p class="text-sm text-slate-600">Sé el primero en publicar un producto.</p><div class="mt-3 flex flex-wrap gap-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(auth).isAuthenticated ? "/marketplace/mis-productos" : "/login",
            class: "rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-amber-700"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(auth).isAuthenticated ? "Publicar producto" : "Iniciar sesión para publicar")}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(auth).isAuthenticated ? "Publicar producto" : "Iniciar sesión para publicar"), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          if (unref(auth).isAuthenticated) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/marketplace/mis-productos",
              class: "rounded-xl border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Gestionar mis productos `);
                } else {
                  return [
                    createTextVNode(" Gestionar mis productos ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          if (myMarketplaceProfilePath.value) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: myMarketplaceProfilePath.value,
              class: "rounded-xl border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 hover:bg-amber-100"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Ver mi perfil `);
                } else {
                  return [
                    createTextVNode(" Ver mi perfil ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(paginatedProducts.value, (product) => {
            _push(ssrRenderComponent(ProductCard, {
              key: product.id,
              product,
              accent: marketplaceAccent,
              isMarketplace: true,
              isMine: isMine(product)
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
        if (filteredProducts.value.length > perPage) {
          _push(`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#0f274f]/20 bg-[#0f274f]/5 px-4 py-3 text-sm text-[#0f274f]"><button class="rounded-lg border border-[#0f274f]/20 bg-white px-3 py-1.5 font-semibold hover:bg-[#0f274f]/10 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(pageStart.value)}-${ssrInterpolate(pageEnd.value)} de ${ssrInterpolate(filteredProducts.value.length)}</p><button class="rounded-lg border border-[#0f274f]/20 bg-white px-3 py-1.5 font-semibold hover:bg-[#0f274f]/10 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section></div>`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=marketplace-7xQJFpzJ.mjs.map
