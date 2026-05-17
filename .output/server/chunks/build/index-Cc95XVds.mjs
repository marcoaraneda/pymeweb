import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { _ as _export_sfc } from './server.mjs';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const tenantStore = useTenantStore();
    const theme = useThemeStore();
    const slug = computed(() => route.params.slug);
    computed(() => route.query.order);
    computed(() => route.query.token);
    const order = ref(null);
    const loading = ref(true);
    const paymentNotice = ref("");
    const currency = (value) => new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0
    }).format(Number(value) || 0);
    const orderDate = computed(() => {
      if (!order.value?.created_at) return "";
      return new Date(order.value.created_at).toLocaleString("es-CL");
    });
    const subtotal = computed(() => {
      if (!order.value?.items) return 0;
      return order.value.items.reduce(
        (acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );
    });
    const accentStyle = computed(() => ({ backgroundColor: theme.accent || "#2563eb", color: "#fff" }));
    const statusBadge = (status) => {
      const map = {
        pending: { label: "Pendiente", classes: "bg-amber-100 text-amber-700" },
        preparing: { label: "Preparando", classes: "bg-blue-100 text-blue-700" },
        in_transit: { label: "En tránsito", classes: "bg-indigo-100 text-indigo-700" },
        delivered: { label: "Llegó a destino", classes: "bg-emerald-100 text-emerald-700" },
        completed: { label: "Finalizado", classes: "bg-slate-200 text-slate-800" },
        cancelled: { label: "Cancelado", classes: "bg-red-100 text-red-700" }
      };
      return map[status || ""] || { label: status || "", classes: "bg-slate-100 text-slate-700" };
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 px-4 py-12" }, _attrs))} data-v-3a99ce4e><div class="mx-auto max-w-3xl" data-v-3a99ce4e>`);
      if (loading.value) {
        _push(`<div class="text-center text-slate-500" data-v-3a99ce4e>Cargando pedido...</div>`);
      } else if (order.value) {
        _push(`<div class="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-100" data-v-3a99ce4e><div class="flex items-start justify-between border-b border-dashed border-slate-200 px-8 py-6" data-v-3a99ce4e><div data-v-3a99ce4e><p class="text-xs uppercase tracking-[0.25em] text-slate-500" data-v-3a99ce4e>Boleta electrónica</p><h1 class="text-2xl font-bold text-slate-900" data-v-3a99ce4e>Pedido #${ssrInterpolate(order.value.id)}</h1><p class="text-sm text-slate-500" data-v-3a99ce4e>${ssrInterpolate(orderDate.value)}</p><p class="text-xs text-slate-500" data-v-3a99ce4e>Tracking: ${ssrInterpolate(order.value.tracking_code)}</p></div><span class="${ssrRenderClass(["rounded-full px-4 py-1 text-xs font-semibold", statusBadge(order.value.status).classes])}" data-v-3a99ce4e>${ssrInterpolate(statusBadge(order.value.status).label)}</span></div>`);
        if (paymentNotice.value) {
          _push(`<div class="mx-8 mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" data-v-3a99ce4e>${ssrInterpolate(paymentNotice.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid gap-6 px-8 py-6 md:grid-cols-2" data-v-3a99ce4e><div class="space-y-3" data-v-3a99ce4e><h2 class="text-sm font-semibold text-slate-700" data-v-3a99ce4e>Datos del comprador</h2><p class="text-sm text-slate-700" data-v-3a99ce4e><span class="text-slate-500" data-v-3a99ce4e>Nombre:</span> ${ssrInterpolate(order.value.name)}</p><p class="text-sm text-slate-700" data-v-3a99ce4e><span class="text-slate-500" data-v-3a99ce4e>Email:</span> ${ssrInterpolate(order.value.email)}</p><p class="text-sm text-slate-700" data-v-3a99ce4e><span class="text-slate-500" data-v-3a99ce4e>Teléfono:</span> ${ssrInterpolate(order.value.phone)}</p><p class="text-sm text-slate-700" data-v-3a99ce4e><span class="text-slate-500" data-v-3a99ce4e>Dirección:</span> ${ssrInterpolate(order.value.address)}</p></div><div class="space-y-3" data-v-3a99ce4e><h2 class="text-sm font-semibold text-slate-700" data-v-3a99ce4e>Tienda</h2><p class="text-sm text-slate-700" data-v-3a99ce4e>${ssrInterpolate(unref(tenantStore).data?.name || "Tu tienda")}</p><p class="text-xs text-slate-500" data-v-3a99ce4e>${ssrInterpolate(unref(tenantStore).data?.email)}</p><p class="text-xs text-slate-500" data-v-3a99ce4e>${ssrInterpolate(unref(tenantStore).data?.address)}</p></div></div><div class="border-y border-dashed border-slate-200 bg-slate-50/70 px-8 py-6" data-v-3a99ce4e><h3 class="mb-4 text-sm font-semibold text-slate-700" data-v-3a99ce4e>Detalle de productos</h3><div class="divide-y divide-slate-200" data-v-3a99ce4e><!--[-->`);
        ssrRenderList(order.value.items, (item) => {
          _push(`<div class="grid grid-cols-[1fr,80px,80px] items-center gap-3 py-3 text-sm text-slate-700" data-v-3a99ce4e><div data-v-3a99ce4e><p class="font-semibold text-slate-900" data-v-3a99ce4e>${ssrInterpolate(item.product_name)}</p><p class="text-xs text-slate-500" data-v-3a99ce4e>Cant. ${ssrInterpolate(item.quantity)}</p>`);
          if (item.options_summary) {
            _push(`<p class="text-xs text-slate-500" data-v-3a99ce4e>${ssrInterpolate(item.options_summary)}</p>`);
          } else if (item.addons?.length) {
            _push(`<p class="text-xs text-slate-500" data-v-3a99ce4e>Agregados: ${ssrInterpolate(item.addons.map((a) => a?.name).filter(Boolean).join(", "))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-right text-slate-600" data-v-3a99ce4e>${ssrInterpolate(currency(item.price))}</p><p class="text-right font-semibold text-slate-900" data-v-3a99ce4e>${ssrInterpolate(currency(item.price * item.quantity))}</p></div>`);
        });
        _push(`<!--]--></div></div><div class="px-8 py-6 space-y-3" data-v-3a99ce4e><div class="flex justify-between text-sm text-slate-700" data-v-3a99ce4e><span data-v-3a99ce4e>Subtotal</span><span data-v-3a99ce4e>${ssrInterpolate(currency(subtotal.value))}</span></div><div class="flex justify-between text-sm text-slate-500" data-v-3a99ce4e><span data-v-3a99ce4e>Impuestos / envío</span><span data-v-3a99ce4e>Incluidos en total</span></div><div class="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900" data-v-3a99ce4e><span data-v-3a99ce4e>Total pagado</span><span data-v-3a99ce4e>${ssrInterpolate(currency(order.value.total))}</span></div></div><div class="flex items-center justify-between border-t border-dashed border-slate-200 bg-slate-50 px-8 py-5" data-v-3a99ce4e><div class="text-xs text-slate-500" data-v-3a99ce4e>Gracias por tu compra. Recibirás un correo con el detalle.</div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${slug.value}`,
          class: "rounded-lg px-4 py-2 text-sm font-semibold text-white shadow",
          style: accentStyle.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Volver a la tienda `);
            } else {
              return [
                createTextVNode(" Volver a la tienda ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<div class="text-center text-red-500" data-v-3a99ce4e>Pedido no encontrado</div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/success/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3a99ce4e"]]);

export { index as default };
//# sourceMappingURL=index-Cc95XVds.mjs.map
