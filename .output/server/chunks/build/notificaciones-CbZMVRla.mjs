import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, computed, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderComponent, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { b as useAuthStore } from './server.mjs';
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
import 'vue-router';

const perPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "notificaciones",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    const notificationStore = useNotificationStore();
    const refreshing = ref(false);
    const typeFilter = ref("all");
    const onlyUnread = ref(false);
    const page = ref(1);
    const availableTypes = computed(() => notificationStore.types);
    const feed = computed(() => notificationStore.feed);
    const unreadCount = computed(() => notificationStore.totalUnread);
    const filteredFeed = computed(() => {
      return feed.value.filter((n) => typeFilter.value === "all" ? true : n.type === typeFilter.value).filter((n) => onlyUnread.value ? !n.read : true);
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredFeed.value.length / perPage)));
    const paginatedFeed = computed(() => {
      const start = (page.value - 1) * perPage;
      return filteredFeed.value.slice(start, start + perPage);
    });
    const pageStart = computed(() => filteredFeed.value.length ? (page.value - 1) * perPage + 1 : 0);
    const pageEnd = computed(() => Math.min(page.value * perPage, filteredFeed.value.length));
    const formatType = (type) => {
      const map = {
        order_sold: "Producto vendido",
        order_completed: "Pedido finalizado",
        shipping_pending: "Pendiente de envío",
        shipping_followup: "Seguimiento en tránsito",
        review_new: "Nueva reseña",
        review_pending: "Reseñas por aprobar",
        ticket: "Ticket",
        ticket_update: "Actualización de ticket",
        ticket_detail: "Detalle de ticket",
        report_new: "Nueva denuncia",
        report_sla_overdue: "Denuncia con SLA vencido",
        moderation_action: "Acción de moderación",
        order: "Pedidos",
        order_new: "Nuevo pedido",
        product: "Producto"
      };
      return map[type] || type;
    };
    const formatDate = (value) => {
      return new Intl.DateTimeFormat("es-CL", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(value));
    };
    watch([typeFilter, onlyUnread], () => {
      page.value = 1;
    });
    watch(filteredFeed, () => {
      if (page.value > totalPages.value) page.value = totalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_32%),linear-gradient(180deg,_#f8fafc_0%,_#fff_100%)] px-4 py-8 sm:px-6 lg:px-8" }, _attrs))}><div class="mx-auto max-w-6xl space-y-6"><div class="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-950 text-white shadow-[0_24px_60px_-30px_rgba(15,23,42,0.45)]"><div class="grid gap-6 p-6 md:grid-cols-[1.1fr,0.9fr] md:p-8"><div class="space-y-4"><p class="text-xs uppercase tracking-[0.3em] text-slate-300">Centro de notificaciones</p><h1 class="text-2xl font-semibold sm:text-3xl">Notificaciones</h1><p class="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">Alertas operativas de pedidos, envíos, reseñas y tickets en una vista más clara y profesional.</p><div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><button class="w-full rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 disabled:opacity-60 sm:w-auto"${ssrIncludeBooleanAttr(refreshing.value) ? " disabled" : ""}>${ssrInterpolate(refreshing.value ? "Actualizando..." : "Actualizar feed")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "w-full rounded-full border border-white/20 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Volver al dashboard `);
          } else {
            return [
              createTextVNode(" Volver al dashboard ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3"><article class="rounded-3xl bg-white/10 p-4 backdrop-blur"><p class="text-xs uppercase tracking-[0.22em] text-slate-300">Sin leer</p><p class="mt-2 text-3xl font-semibold text-white">${ssrInterpolate(unreadCount.value)}</p></article><article class="rounded-3xl bg-white/10 p-4 backdrop-blur"><p class="text-xs uppercase tracking-[0.22em] text-slate-300">Totales</p><p class="mt-2 text-3xl font-semibold text-white">${ssrInterpolate(feed.value.length)}</p></article><article class="rounded-3xl bg-white/10 p-4 backdrop-blur"><p class="text-xs uppercase tracking-[0.22em] text-slate-300">Filtradas</p><p class="mt-2 text-3xl font-semibold text-white">${ssrInterpolate(filteredFeed.value.length)}</p></article></div></div></div><section class="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.22)] sm:p-6"><div class="flex flex-col gap-4 border-b border-slate-100 pb-4 lg:flex-row lg:items-end lg:justify-between"><div class="space-y-1"><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Feed</p><h2 class="text-2xl font-semibold text-slate-900">Recientes</h2><p class="text-sm text-slate-500">${ssrInterpolate(unreadCount.value)} sin leer</p></div><div class="rounded-[28px] border border-slate-200 bg-slate-50/80 p-3 shadow-sm backdrop-blur sm:p-4"><div class="mb-3 flex items-center justify-between gap-3"><p class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Filtros</p><p class="text-xs text-slate-400">Refina el centro de notificaciones</p></div><div class="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(280px,1fr)_auto_auto_auto] xl:items-center"><select class="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/5"><option value="all"${ssrIncludeBooleanAttr(Array.isArray(typeFilter.value) ? ssrLooseContain(typeFilter.value, "all") : ssrLooseEqual(typeFilter.value, "all")) ? " selected" : ""}>Todos los tipos</option><!--[-->`);
      ssrRenderList(availableTypes.value, (t) => {
        _push(`<option${ssrRenderAttr("value", t)}${ssrIncludeBooleanAttr(Array.isArray(typeFilter.value) ? ssrLooseContain(typeFilter.value, t) : ssrLooseEqual(typeFilter.value, t)) ? " selected" : ""}>${ssrInterpolate(formatType(t))}</option>`);
      });
      _push(`<!--]--></select><label class="inline-flex h-11 w-full items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm xl:w-auto"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(onlyUnread.value) ? ssrLooseContain(onlyUnread.value, null) : onlyUnread.value) ? " checked" : ""} class="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"> Solo sin leer </label><button class="h-11 w-full rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-40 xl:w-auto"${ssrIncludeBooleanAttr(!feed.value.length) ? " disabled" : ""}>Marcar leído</button><button class="h-11 w-full rounded-2xl border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-rose-50 disabled:opacity-40 xl:w-auto"${ssrIncludeBooleanAttr(!feed.value.length) ? " disabled" : ""}>Limpiar</button></div></div></div>`);
      if (!filteredFeed.value.length) {
        _push(`<div class="mt-5 rounded-[24px] border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500"> No hay notificaciones para este filtro. </div>`);
      } else {
        _push(`<ul class="mt-5 space-y-3"><!--[-->`);
        ssrRenderList(paginatedFeed.value, (item) => {
          _push(`<li class="group rounded-[24px] border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"><div class="flex items-start gap-4"><div class="${ssrRenderClass([item.read ? "bg-slate-300" : "bg-emerald-500", "mt-1 h-3 w-3 rounded-full"])}"></div><div class="min-w-0 flex-1"><div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div class="min-w-0"><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(item.message)}</p><p class="mt-1 text-xs text-slate-500">${ssrInterpolate(formatType(item.type))} • ${ssrInterpolate(item.store || "tienda")}</p></div><div class="flex flex-wrap items-center gap-2 text-xs text-slate-500"><span>${ssrInterpolate(formatDate(item.created_at))}</span><button class="${ssrRenderClass([item.read ? "bg-slate-200 text-slate-700" : "bg-emerald-100 text-emerald-700", "rounded-full px-3 py-1 text-[11px] font-semibold transition"])}">${ssrInterpolate(item.read ? "Leída" : "Marcar leída")}</button></div></div></div></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      if (filteredFeed.value.length > perPage) {
        _push(`<div class="mt-5 flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between"><button class="rounded-xl border border-slate-200 px-3 py-2 font-semibold transition hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(pageStart.value)}-${ssrInterpolate(pageEnd.value)} de ${ssrInterpolate(filteredFeed.value.length)}</p><button class="rounded-xl border border-slate-200 px-3 py-2 font-semibold transition hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/notificaciones.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=notificaciones-CbZMVRla.mjs.map
