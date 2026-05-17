import { defineComponent, ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { g as useRoute, b as useAuthStore } from './server.mjs';
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

const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "resenas",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useAuthStore();
    route.params.slug;
    const reviews = ref([]);
    const loading = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const selectedStatus = ref("ALL");
    const page = ref(1);
    const statusOptions = [
      { value: "ALL", label: "Todas" },
      { value: "PENDING", label: "Pendientes" },
      { value: "APPROVED", label: "Aprobadas" },
      { value: "REJECTED", label: "Rechazadas" }
    ];
    const filteredReviews = computed(() => {
      if (selectedStatus.value === "ALL") return reviews.value;
      return reviews.value.filter((review) => review.status === selectedStatus.value);
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredReviews.value.length / perPage)));
    const paginatedReviews = computed(() => {
      const start = (page.value - 1) * perPage;
      return filteredReviews.value.slice(start, start + perPage);
    });
    const pageStart = computed(() => filteredReviews.value.length ? (page.value - 1) * perPage + 1 : 0);
    const pageEnd = computed(() => Math.min(page.value * perPage, filteredReviews.value.length));
    const statusClasses = (status) => {
      if (status === "APPROVED") return "bg-emerald-100 text-emerald-700";
      if (status === "REJECTED") return "bg-rose-100 text-rose-700";
      return "bg-amber-100 text-amber-700";
    };
    const formatDate = (value) => new Date(value).toLocaleString("es-CL");
    watch(selectedStatus, () => {
      page.value = 1;
    });
    watch(filteredReviews, () => {
      if (page.value > totalPages.value) page.value = totalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-800">Reseñas de la tienda</h1><p class="text-sm text-gray-500">Listado de reseñas públicas registradas en la tienda (sin opción de desactivación manual).</p></div><button class="text-sm bg-gray-200 px-4 py-2 rounded-lg">Actualizar</button></div>`);
      if (errorMessage.value) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ssrInterpolate(errorMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (successMessage.value) {
        _push(`<div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">${ssrInterpolate(successMessage.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
      ssrRenderList(statusOptions, (option) => {
        _push(`<button class="${ssrRenderClass([selectedStatus.value === option.value ? "border-amber-400 bg-amber-50 text-amber-800" : "border-slate-200 bg-white text-slate-600", "rounded-full border px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(option.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (loading.value) {
        _push(`<div class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500"> Cargando reseñas... </div>`);
      } else {
        _push(`<div class="space-y-3">`);
        if (!filteredReviews.value.length) {
          _push(`<div class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500"> No hay reseñas registradas. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(paginatedReviews.value, (review) => {
          _push(`<article class="rounded-xl border bg-white p-4 shadow-sm"><div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p class="font-semibold text-slate-900">${ssrInterpolate(review.product_name || `Producto #${review.product}`)}</p><p class="text-xs text-slate-500">${ssrInterpolate(review.customer_name || "Cliente sin nombre")} • ${ssrInterpolate(formatDate(review.created_at))}</p><p class="mt-2 text-sm text-slate-700">${ssrInterpolate(review.comment || "Sin comentario.")}</p></div><div class="flex flex-col items-start gap-2 sm:items-end"><span class="${ssrRenderClass([statusClasses(review.status), "rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(review.status)}</span><span class="text-sm text-amber-600">${ssrInterpolate("★".repeat(review.rating))}</span></div></div></article>`);
        });
        _push(`<!--]-->`);
        if (filteredReviews.value.length > perPage) {
          _push(`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"><button class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(pageStart.value)}-${ssrInterpolate(pageEnd.value)} de ${ssrInterpolate(filteredReviews.value.length)}</p><button class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/resenas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=resenas-Dd4lkDWv.mjs.map
