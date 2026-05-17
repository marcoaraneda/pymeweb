import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { g as useRoute, b as useAuthStore } from './server.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
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

const pageSize = 10;
const pendingPageSize = 5;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useAuthStore();
    const theme = useThemeStore();
    useTenantStore();
    const slug = route.params.slug;
    const orders = ref([]);
    const loading = ref(true);
    const page = ref(1);
    const pendingPage = ref(1);
    const accentColor = computed(() => theme.accent || "#2563eb");
    const pendingList = computed(
      () => orders.value.filter((o) => ["pending", "preparing", "in_transit"].includes(o.status))
    );
    const pendingPaginated = computed(() => {
      const start = (pendingPage.value - 1) * pendingPageSize;
      return pendingList.value.slice(start, start + pendingPageSize);
    });
    const pendingTotalPages = computed(() => Math.max(1, Math.ceil(pendingList.value.length / pendingPageSize)) || 1);
    const paginatedOrders = computed(() => {
      const start = (page.value - 1) * pageSize;
      return orders.value.slice(start, start + pageSize);
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(orders.value.length / pageSize)));
    const currency = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0 }).format(Number(value) || 0);
    const statusBadge = (status) => {
      const map = {
        pending: { label: "Pendiente", classes: "bg-amber-100 text-amber-700" },
        preparing: { label: "Preparando", classes: "bg-blue-100 text-blue-700" },
        in_transit: { label: "En tránsito", classes: "bg-indigo-100 text-indigo-700" },
        delivered: { label: "Llegó a destino", classes: "bg-emerald-100 text-emerald-700" },
        completed: { label: "Finalizado", classes: "bg-slate-200 text-slate-800" },
        cancelled: { label: "Cancelado", classes: "bg-red-100 text-red-700" }
      };
      return map[status] || { label: status, classes: "bg-slate-100 text-slate-700" };
    };
    watch(
      () => pendingList.value.length,
      () => {
        pendingPage.value = 1;
      }
    );
    const formatDate = (date) => new Date(date).toLocaleString("es-CL");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-6xl mx-auto py-10 space-y-6" }, _attrs))}><div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Panel</p><h1 class="text-3xl font-bold text-slate-900">Compras realizadas</h1><p class="text-slate-600">Gestiona estados y comparte seguimiento.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}`,
        class: "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:shadow-lg",
        style: { backgroundColor: accentColor.value }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Entrar a la tienda `);
          } else {
            return [
              createTextVNode(" Entrar a la tienda ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="text-gray-500">Cargando pedidos...</div>`);
      } else {
        _push(`<div class="grid gap-4 lg:grid-cols-[0.9fr,1.1fr]"><div class="rounded-xl bg-white shadow ring-1 ring-slate-100 p-4 space-y-3"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Pendientes</p><h3 class="text-lg font-semibold text-slate-900">Preparar y enviar</h3></div><span class="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">${ssrInterpolate(pendingList.value.length)}</span></div>`);
        if (!pendingList.value.length) {
          _push(`<div class="text-sm text-slate-500">Sin pedidos pendientes.</div>`);
        } else {
          _push(`<div><!--[-->`);
          ssrRenderList(pendingPaginated.value, (p) => {
            _push(`<div class="rounded-lg border border-slate-100 px-3 py-2 text-sm"><div class="flex items-center justify-between"><p class="font-semibold text-slate-900">#${ssrInterpolate(p.id)} — ${ssrInterpolate(p.name)}</p><span class="text-xs text-slate-500">${ssrInterpolate(formatDate(p.created_at))}</span></div><p class="text-xs text-slate-500">Tracking ${ssrInterpolate(p.tracking_code || "—")}</p><div class="flex items-center justify-between pt-1"><span class="font-semibold text-slate-900">${ssrInterpolate(currency(p.total))}</span><span class="${ssrRenderClass(["rounded-full px-2 py-0.5 text-[11px] font-semibold", statusBadge(p.status).classes])}">${ssrInterpolate(statusBadge(p.status).label)}</span></div><div class="mt-2 flex justify-between text-xs text-slate-600">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/store/${unref(slug)}/admin/orders/${p.id}`,
              class: "font-semibold text-blue-600 hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Ver y preparar`);
                } else {
                  return [
                    createTextVNode("Ver y preparar")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/store/${unref(slug)}/success?order=${p.id}`,
              class: "hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`Seguimiento`);
                } else {
                  return [
                    createTextVNode("Seguimiento")
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`</div></div>`);
          });
          _push(`<!--]-->`);
          if (pendingTotalPages.value > 1) {
            _push(`<div class="mt-3 flex items-center justify-between text-xs text-slate-600"><button class="rounded-lg border px-2 py-1 hover:bg-slate-50 disabled:opacity-50"${ssrIncludeBooleanAttr(pendingPage.value === 1) ? " disabled" : ""}>Anterior</button><span>Página ${ssrInterpolate(pendingPage.value)} / ${ssrInterpolate(pendingTotalPages.value)}</span><button class="rounded-lg border px-2 py-1 hover:bg-slate-50 disabled:opacity-50"${ssrIncludeBooleanAttr(pendingPage.value === pendingTotalPages.value) ? " disabled" : ""}>Siguiente</button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        }
        _push(`</div><div class="overflow-hidden rounded-xl bg-white shadow ring-1 ring-slate-100"><div class="space-y-3 p-4 md:hidden"><!--[-->`);
        ssrRenderList(paginatedOrders.value, (order) => {
          _push(`<div class="rounded-xl border border-slate-100 bg-slate-50/80 p-4 text-sm"><div class="flex items-start justify-between gap-3"><div><p class="font-semibold text-slate-900">#${ssrInterpolate(order.id)} · ${ssrInterpolate(order.name)}</p><p class="mt-1 text-xs text-slate-500">${ssrInterpolate(formatDate(order.created_at))}</p></div><span class="${ssrRenderClass(["rounded-full px-2 py-1 text-[11px] font-semibold", statusBadge(order.status).classes])}">${ssrInterpolate(statusBadge(order.status).label)}</span></div><div class="mt-3 grid gap-2 text-xs text-slate-600"><p><span class="font-semibold text-slate-700">Total:</span> ${ssrInterpolate(currency(order.total))}</p><p><span class="font-semibold text-slate-700">Tracking:</span> ${ssrInterpolate(order.tracking_code || "—")}</p></div><div class="mt-3 flex flex-wrap gap-3 text-xs font-semibold">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${unref(slug)}/admin/orders/${order.id}`,
            class: "text-blue-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Ver`);
              } else {
                return [
                  createTextVNode("Ver")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${unref(slug)}/success?order=${order.id}`,
            class: "text-slate-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Seguimiento`);
              } else {
                return [
                  createTextVNode("Seguimiento")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div>`);
        });
        _push(`<!--]--></div><div class="hidden overflow-x-auto md:block"><table class="min-w-[760px] w-full text-sm"><thead class="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th class="p-3">ID</th><th class="p-3">Cliente</th><th class="p-3">Total</th><th class="p-3">Estado</th><th class="p-3">Seguimiento</th><th class="p-3">Fecha</th><th class="p-3 text-right">Acciones</th></tr></thead><tbody><!--[-->`);
        ssrRenderList(paginatedOrders.value, (order) => {
          _push(`<tr class="border-t border-slate-100"><td class="p-3 font-semibold text-slate-900">#${ssrInterpolate(order.id)}</td><td class="p-3 text-slate-800">${ssrInterpolate(order.name)}</td><td class="p-3 font-semibold text-slate-900">${ssrInterpolate(currency(order.total))}</td><td class="p-3"><span class="${ssrRenderClass(["px-2 py-1 rounded text-xs font-semibold", statusBadge(order.status).classes])}">${ssrInterpolate(statusBadge(order.status).label)}</span></td><td class="p-3 text-xs text-slate-600">${ssrInterpolate(order.tracking_code)}</td><td class="p-3 text-slate-600">${ssrInterpolate(formatDate(order.created_at))}</td><td class="p-3 text-right space-x-2">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${unref(slug)}/admin/orders/${order.id}`,
            class: "text-blue-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Ver `);
              } else {
                return [
                  createTextVNode(" Ver ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${unref(slug)}/success?order=${order.id}`,
            class: "text-slate-600 hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Seguimiento `);
              } else {
                return [
                  createTextVNode(" Seguimiento ")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody></table></div><div class="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700"><span>Mostrando ${ssrInterpolate(paginatedOrders.value.length)} de ${ssrInterpolate(orders.value.length)} pedidos</span><div class="flex items-center gap-2"><button class="rounded-lg border px-3 py-1 hover:bg-white disabled:opacity-50"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}>Anterior</button><span class="text-xs">Página ${ssrInterpolate(page.value)} / ${ssrInterpolate(totalPages.value)}</span><button class="rounded-lg border px-3 py-1 hover:bg-white disabled:opacity-50"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}>Siguiente</button></div></div></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/orders/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D7EdSZGO.mjs.map
