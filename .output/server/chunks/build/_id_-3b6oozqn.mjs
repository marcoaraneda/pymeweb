import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { b as useAuthStore } from './server.mjs';
import { P as ProductCard } from './ProductCard-Bc3E-sgC.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import { BadgeCheck } from 'lucide-vue-next';
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
import './cart-fX2c5KSU.mjs';
import './useFavorites-BLT7MOEn.mjs';

const marketplaceAccent = "#f59e0b";
const perPage = 12;
const salesPerPage = 8;
const inProgressPerPage = 8;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useThemeStore();
    const auth = useAuthStore();
    const sellerId = route.params.id;
    const seller = ref(null);
    const loading = ref(true);
    const error = ref("");
    const searchTerm = ref("");
    const categoryFilter = ref("");
    const categories = ref([]);
    const activePage = ref(1);
    const soldPage = ref(1);
    const salesPage = ref(1);
    const inProgressPage = ref(1);
    const savingRating = ref(false);
    const showReportForm = ref(false);
    const savingReport = ref(false);
    const reportTitle = ref("");
    const reportDescription = ref("");
    const reportMessage = ref(null);
    const salesSummary = computed(() => seller.value?.sales_summary || {
      total_orders: 0,
      total_units: 0,
      gross_sales: 0,
      in_progress_orders: 0,
      in_progress_units: 0,
      in_progress_amount: 0
    });
    const salesHistory = computed(() => seller.value?.sales_history || []);
    const salesInProgressHistory = computed(() => seller.value?.sales_in_progress_history || []);
    const ratingSummary = computed(() => seller.value?.rating_summary || { average: 0, count: 0 });
    const myRating = computed(() => Number(seller.value?.my_rating || 0));
    const averageRating = computed(() => Number(ratingSummary.value.average || 0));
    const displayRating = computed(() => myRating.value > 0 ? myRating.value : Math.round(averageRating.value));
    const sellerNumericId = computed(() => Number(seller.value?.id || sellerId || 0));
    const currentUserId = computed(() => Number(auth.user?.id || 0));
    const canRateSeller = computed(() => Boolean(auth.isAuthenticated && currentUserId.value && sellerNumericId.value && currentUserId.value !== sellerNumericId.value));
    const canReportSeller = computed(() => Boolean(auth.isAuthenticated && currentUserId.value && sellerNumericId.value && currentUserId.value !== sellerNumericId.value));
    const ratingLabel = computed(() => {
      const count = Number(ratingSummary.value.count || 0);
      const avg = Number(averageRating.value || 0);
      if (!count) return "Sin calificaciones todavía";
      return `${avg.toFixed(1)} (${count} calificaciones)`;
    });
    const salesTotalPages = computed(() => Math.max(1, Math.ceil(salesHistory.value.length / salesPerPage)));
    const pagedSalesHistory = computed(() => {
      const start = (salesPage.value - 1) * salesPerPage;
      return salesHistory.value.slice(start, start + salesPerPage);
    });
    const inProgressTotalPages = computed(() => Math.max(1, Math.ceil(salesInProgressHistory.value.length / inProgressPerPage)));
    const pagedSalesInProgressHistory = computed(() => {
      const start = (inProgressPage.value - 1) * inProgressPerPage;
      return salesInProgressHistory.value.slice(start, start + inProgressPerPage);
    });
    const fullName = computed(() => {
      if (!seller.value) return "";
      const parts = [seller.value.first_name, seller.value.last_name].filter(Boolean);
      return parts.join(" ");
    });
    const allProducts = computed(() => {
      if (!seller.value) return { active: [], sold: [] };
      return {
        active: seller.value.active_products || [],
        sold: seller.value.sold_products || []
      };
    });
    computed(() => {
      const map = /* @__PURE__ */ new Map();
      allProducts.value.active.concat(allProducts.value.sold).forEach((p) => {
        if (p.category?.slug || p.category?.id) {
          const key = p.category.slug || p.category.id;
          map.set(String(key), { id: p.category.id, slug: p.category.slug, name: p.category.name });
        }
      });
      return Array.from(map.values());
    });
    const filteredActive = computed(() => {
      const term = searchTerm.value.trim().toLowerCase();
      const cat = categoryFilter.value;
      return allProducts.value.active.filter((p) => {
        const matchesTerm = !term || p.name?.toLowerCase().includes(term);
        const matchesCat = !cat || p.category?.slug === cat || String(p.category?.id) === String(cat);
        return matchesTerm && matchesCat;
      });
    });
    const filteredSold = computed(() => {
      const term = searchTerm.value.trim().toLowerCase();
      const cat = categoryFilter.value;
      return allProducts.value.sold.filter((p) => {
        const matchesTerm = !term || p.name?.toLowerCase().includes(term);
        const matchesCat = !cat || p.category?.slug === cat || String(p.category?.id) === String(cat);
        return matchesTerm && matchesCat;
      });
    });
    const activeTotalPages = computed(() => Math.max(1, Math.ceil(filteredActive.value.length / perPage)));
    const soldTotalPages = computed(() => Math.max(1, Math.ceil(filteredSold.value.length / perPage)));
    const pagedActive = computed(() => {
      const start = (activePage.value - 1) * perPage;
      return filteredActive.value.slice(start, start + perPage);
    });
    const pagedSold = computed(() => {
      const start = (soldPage.value - 1) * perPage;
      return filteredSold.value.slice(start, start + perPage);
    });
    const isMine = (product) => {
      const userId = auth.user?.id;
      return Boolean(userId && product?.submitted_by === userId);
    };
    const formatClp = (value) => new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
    const formatDate = (value) => {
      if (!value) return "";
      try {
        return new Date(value).toLocaleString("es-CL", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });
      } catch {
        return value;
      }
    };
    const formatOrderStatus = (status) => {
      const labels = {
        pending: "Pendiente",
        preparing: "Preparando",
        in_transit: "En transito",
        delivered: "Entregado",
        completed: "Completado",
        cancelled: "Cancelado"
      };
      return labels[status] || status;
    };
    watch([searchTerm, categoryFilter], () => {
      activePage.value = 1;
      soldPage.value = 1;
    });
    watch(salesHistory, () => {
      if (salesPage.value > salesTotalPages.value) salesPage.value = salesTotalPages.value;
    });
    watch(salesInProgressHistory, () => {
      if (inProgressPage.value > inProgressTotalPages.value) inProgressPage.value = inProgressTotalPages.value;
    });
    watch(filteredActive, () => {
      if (activePage.value > activeTotalPages.value) activePage.value = activeTotalPages.value;
    });
    watch(filteredSold, () => {
      if (soldPage.value > soldTotalPages.value) soldPage.value = soldTotalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 text-slate-900 px-4 py-10" }, _attrs))}><div class="mx-auto max-w-6xl space-y-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/marketplace",
        class: "text-sm font-semibold text-slate-700 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Volver al marketplace`);
          } else {
            return [
              createTextVNode("← Volver al marketplace")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">`);
      if (loading.value) {
        _push(`<div class="text-slate-500">Cargando vendedor...</div>`);
      } else if (error.value) {
        _push(`<div class="text-red-600">${ssrInterpolate(error.value)}</div>`);
      } else if (!seller.value) {
        _push(`<div class="text-slate-600">Vendedor no encontrado.</div>`);
      } else {
        _push(`<div class="space-y-4"><div class="flex flex-wrap items-center gap-3"><div class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-amber-100 text-lg font-semibold text-amber-900">`);
        if (seller.value.avatar_url) {
          _push(`<img${ssrRenderAttr("src", seller.value.avatar_url)}${ssrRenderAttr("alt", seller.value.username)} class="h-full w-full object-cover">`);
        } else {
          _push(`<span>${ssrInterpolate(seller.value.username?.slice(0, 2)?.toUpperCase?.())}</span>`);
        }
        _push(`</div><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Vendedor</p><h1 class="flex items-center gap-2 text-2xl font-bold text-slate-900"><span>${ssrInterpolate(seller.value.username)}</span>`);
        if (seller.value.is_verified) {
          _push(ssrRenderComponent(unref(BadgeCheck), {
            class: "h-5 w-5 text-red-600",
            "aria-label": "Verificado"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</h1><p class="text-sm text-slate-600">${ssrInterpolate(fullName.value)}</p><div class="mt-1 flex flex-wrap items-center gap-2" aria-label="Calificación de vendedor"><!--[-->`);
        ssrRenderList([1, 2, 3, 4, 5], (star) => {
          _push(`<button type="button" class="${ssrRenderClass([star <= displayRating.value ? "text-amber-500" : "text-slate-300", "text-xl leading-none"])}"${ssrIncludeBooleanAttr(!canRateSeller.value || savingRating.value) ? " disabled" : ""}>${ssrInterpolate(star <= displayRating.value ? "★" : "☆")}</button>`);
        });
        _push(`<!--]--><span class="text-xs text-slate-500">${ssrInterpolate(ratingLabel.value)}</span></div></div></div><div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><article class="rounded-xl border border-amber-100 bg-amber-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-amber-800">Ventas cerradas</p><p class="mt-2 text-2xl font-bold text-amber-950">${ssrInterpolate(Number(salesSummary.value.total_orders || 0))}</p><p class="text-xs text-amber-800/80">Pedidos completados o entregados</p></article><article class="rounded-xl border border-emerald-100 bg-emerald-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-emerald-800">Unidades vendidas</p><p class="mt-2 text-2xl font-bold text-emerald-950">${ssrInterpolate(Number(salesSummary.value.total_units || 0))}</p><p class="text-xs text-emerald-800/80">Sumadas desde historial de ventas</p></article><article class="rounded-xl border border-sky-100 bg-sky-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-sky-800">Ingresos</p><p class="mt-2 text-2xl font-bold text-sky-950">${ssrInterpolate(formatClp(salesSummary.value.gross_sales || 0))}</p><p class="text-xs text-sky-800/80">Total vendido en marketplace</p></article><article class="rounded-xl border border-violet-100 bg-violet-50 p-4"><p class="text-xs uppercase tracking-[0.18em] text-violet-800">Ventas en proceso</p><p class="mt-2 text-2xl font-bold text-violet-950">${ssrInterpolate(Number(salesSummary.value.in_progress_orders || 0))}</p><p class="text-xs text-violet-800/80">Pedidos pendientes, preparando o en transito</p></article></div><div class="rounded-xl border border-rose-200 bg-rose-50 p-4"><div class="flex flex-wrap items-center justify-between gap-2"><div><p class="text-xs uppercase tracking-[0.16em] text-rose-700">Seguridad marketplace</p><h2 class="text-base font-semibold text-rose-900">Denunciar este perfil</h2><p class="text-xs text-rose-800/80">Usa esta acción si detectas comportamiento sospechoso o incumplimiento de normas.</p></div><button class="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-900 hover:bg-rose-100 disabled:opacity-50"${ssrIncludeBooleanAttr(!canReportSeller.value || savingReport.value) ? " disabled" : ""}>${ssrInterpolate(showReportForm.value ? "Cancelar" : "Denunciar")}</button></div>`);
        if (reportMessage.value) {
          _push(`<div class="${ssrRenderClass([reportMessage.value.type === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-100 text-rose-700", "mt-3 rounded-lg border px-3 py-2 text-xs"])}">${ssrInterpolate(reportMessage.value.text)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (showReportForm.value) {
          _push(`<form class="mt-3 space-y-2"><input${ssrRenderAttr("value", reportTitle.value)} type="text" maxlength="140" placeholder="Título breve de la denuncia" class="h-10 w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"><textarea rows="4" maxlength="1000" placeholder="Describe lo ocurrido con el mayor detalle posible" class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none">${ssrInterpolate(reportDescription.value)}</textarea><div class="flex items-center justify-end gap-2"><button type="button" class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Cerrar</button><button type="submit" class="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"${ssrIncludeBooleanAttr(savingReport.value) ? " disabled" : ""}>${ssrInterpolate(savingReport.value ? "Enviando..." : "Enviar denuncia")}</button></div></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="filter-panel"><div class="grid gap-3 md:grid-cols-2 xl:grid-cols-[220px_minmax(0,1fr)] xl:items-end"><label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Categoría</span><select class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, "") : ssrLooseEqual(categoryFilter.value, "")) ? " selected" : ""}>Todas las categorías</option><!--[-->`);
        ssrRenderList(categories.value, (cat) => {
          _push(`<option${ssrRenderAttr("value", cat.slug || cat.id)}${ssrIncludeBooleanAttr(Array.isArray(categoryFilter.value) ? ssrLooseContain(categoryFilter.value, cat.slug || cat.id) : ssrLooseEqual(categoryFilter.value, cat.slug || cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
        });
        _push(`<!--]--></select></label><label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Buscar</span><input${ssrRenderAttr("value", searchTerm.value)} type="text" placeholder="Buscar producto por nombre" class="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"></label></div></div><div class="space-y-3"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold text-slate-900">Productos activos</h2><span class="text-sm text-slate-500">${ssrInterpolate(filteredActive.value.length)} productos</span></div>`);
        if (!filteredActive.value.length) {
          _push(`<div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600"> No hay productos activos. </div>`);
        } else {
          _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(pagedActive.value, (product) => {
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
        if (activeTotalPages.value > 1) {
          _push(`<div class="flex items-center justify-between text-xs text-slate-600"><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(activePage.value === 1) ? " disabled" : ""}>Anterior</button><span>Página ${ssrInterpolate(activePage.value)} / ${ssrInterpolate(activeTotalPages.value)}</span><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(activePage.value === activeTotalPages.value) ? " disabled" : ""}>Siguiente</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-3"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold text-slate-900">Productos vendidos / inactivos</h2><span class="text-sm text-slate-500">${ssrInterpolate(filteredSold.value.length)} productos</span></div>`);
        if (!filteredSold.value.length) {
          _push(`<div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600"> No hay productos marcados como vendidos. </div>`);
        } else {
          _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
          ssrRenderList(pagedSold.value, (product) => {
            _push(ssrRenderComponent(ProductCard, {
              key: `sold-${product.id}`,
              product,
              accent: marketplaceAccent,
              isMarketplace: true,
              isMine: isMine(product)
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
        if (soldTotalPages.value > 1) {
          _push(`<div class="flex items-center justify-between text-xs text-slate-600"><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(soldPage.value === 1) ? " disabled" : ""}>Anterior</button><span>Página ${ssrInterpolate(soldPage.value)} / ${ssrInterpolate(soldTotalPages.value)}</span><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(soldPage.value === soldTotalPages.value) ? " disabled" : ""}>Siguiente</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-3"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold text-slate-900">Ventas en proceso</h2><span class="text-sm text-slate-500">${ssrInterpolate(salesInProgressHistory.value.length)} movimientos</span></div>`);
        if (!salesInProgressHistory.value.length) {
          _push(`<div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600"> No hay ventas marketplace en proceso para este vendedor. </div>`);
        } else {
          _push(`<div class="space-y-2"><!--[-->`);
          ssrRenderList(pagedSalesInProgressHistory.value, (item) => {
            _push(`<article class="rounded-xl border border-slate-200 bg-white p-4"><div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(item.product_name)}</p><p class="text-xs text-slate-500">Pedido #${ssrInterpolate(item.order_id)} · Comprador: ${ssrInterpolate(item.buyer_name || "Cliente")}</p></div><div class="text-right"><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(formatClp(item.subtotal || 0))}</p><p class="text-xs text-slate-500">${ssrInterpolate(formatOrderStatus(item.status))}</p></div></div><div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600"><span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Cantidad: ${ssrInterpolate(item.quantity)}</span><span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Unitario: ${ssrInterpolate(formatClp(item.unit_price || 0))}</span><span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">${ssrInterpolate(formatDate(item.created_at))}</span></div></article>`);
          });
          _push(`<!--]--></div>`);
        }
        if (inProgressTotalPages.value > 1) {
          _push(`<div class="flex items-center justify-between text-xs text-slate-600"><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(inProgressPage.value === 1) ? " disabled" : ""}>Anterior</button><span>Página ${ssrInterpolate(inProgressPage.value)} / ${ssrInterpolate(inProgressTotalPages.value)}</span><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(inProgressPage.value === inProgressTotalPages.value) ? " disabled" : ""}>Siguiente</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-3"><div class="flex items-center justify-between"><h2 class="text-lg font-semibold text-slate-900">Historial de ventas marketplace</h2><span class="text-sm text-slate-500">${ssrInterpolate(salesHistory.value.length)} ventas</span></div>`);
        if (!salesHistory.value.length) {
          _push(`<div class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-slate-600"> Este vendedor todavia no registra ventas cerradas en marketplace. </div>`);
        } else {
          _push(`<div class="space-y-2"><!--[-->`);
          ssrRenderList(pagedSalesHistory.value, (item) => {
            _push(`<article class="rounded-xl border border-slate-200 bg-white p-4"><div class="flex flex-wrap items-start justify-between gap-3"><div><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(item.product_name)}</p><p class="text-xs text-slate-500">Pedido #${ssrInterpolate(item.order_id)} · Comprador: ${ssrInterpolate(item.buyer_name || "Cliente")}</p></div><div class="text-right"><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(formatClp(item.subtotal || 0))}</p><p class="text-xs text-slate-500">${ssrInterpolate(formatOrderStatus(item.status))}</p></div></div><div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-600"><span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Cantidad: ${ssrInterpolate(item.quantity)}</span><span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Unitario: ${ssrInterpolate(formatClp(item.unit_price || 0))}</span><span class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">${ssrInterpolate(formatDate(item.created_at))}</span></div></article>`);
          });
          _push(`<!--]--></div>`);
        }
        if (salesTotalPages.value > 1) {
          _push(`<div class="flex items-center justify-between text-xs text-slate-600"><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(salesPage.value === 1) ? " disabled" : ""}>Anterior</button><span>Página ${ssrInterpolate(salesPage.value)} / ${ssrInterpolate(salesTotalPages.value)}</span><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(salesPage.value === salesTotalPages.value) ? " disabled" : ""}>Siguiente</button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace/vendedores/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-3b6oozqn.mjs.map
