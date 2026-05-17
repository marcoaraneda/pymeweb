import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, ref, reactive, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain, ssrRenderList, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { useRouter, useRoute } from 'vue-router';
import { _ as _export_sfc, b as useAuthStore } from './server.mjs';
import { u as useCartStore } from './cart-Dcn-8ZaM.mjs';
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

const placeholder = "https://via.placeholder.com/200x200.png?text=Producto";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const cart = useCartStore();
    const tenantStore = useTenantStore();
    const theme = useThemeStore();
    useAuthStore();
    useRouter();
    const route = useRoute();
    computed(() => route.params.slug);
    const loadingPage = ref(true);
    const loadingOrder = ref(false);
    const checkoutPaymentHint = ref("");
    const dispatchFeeAcknowledged = ref(false);
    ref([]);
    ref(null);
    const selectedPaymentMode = ref("webpay");
    const form = reactive({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
    const deliveryMethod = ref("pickup");
    const shippingCost = ref(0);
    const shippingDetail = ref("El costo de envío se calcula automáticamente.");
    const accentColor = computed(() => theme.accent || "#2563eb");
    const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: "#fff" }));
    const showWhatsAppCTA = computed(() => {
      const enabled = tenantStore.data?.whatsapp_sales_enabled;
      const hasToggle = enabled === void 0 || enabled === null ? true : Boolean(enabled);
      return hasToggle && hasStoreWhatsApp.value;
    });
    const storeWhatsAppRaw = computed(() => String(tenantStore.data?.whatsapp || tenantStore.data?.phone || "").trim());
    const storeWhatsAppDigits = computed(() => storeWhatsAppRaw.value.replace(/[^\d]/g, ""));
    const hasStoreWhatsApp = computed(() => storeWhatsAppDigits.value.length > 0);
    const storeWhatsAppDisplay = computed(() => storeWhatsAppRaw.value || "No configurado");
    const storeWhatsAppUrl = computed(() => {
      if (!hasStoreWhatsApp.value) return "#";
      const storeName = String(tenantStore.data?.name || "la tienda");
      const orderLabel = deliveryMethod.value === "delivery" ? "delivery" : "retiro en local";
      const shippingNote = deliveryMethod.value === "delivery" ? `El envío estimado es ${formatClp(shippingCost.value || 0)}.` : "Quiero retirar en local para saltarme la fila.";
      const msg = encodeURIComponent(
        `Hola, quiero agendar un pedido en ${storeName}.
Tipo de pedido: ${orderLabel}.
${shippingNote}
Total estimado: ${formatClp(totalWithShipping.value)}.`
      );
      return `https://wa.me/${storeWhatsAppDigits.value}?text=${msg}`;
    });
    const isDispatchChargeMode = computed(() => String(tenantStore.data?.delivery_fee_mode || "at_dispatch") === "at_dispatch");
    const shippingBaseFee = computed(() => Number(tenantStore.data?.shipping_base_fee || 0));
    const shippingPerItemFee = computed(() => Number(tenantStore.data?.shipping_per_item_fee || 200));
    const shippingFreeOver = computed(() => Number(tenantStore.data?.shipping_free_over || 0));
    const storePaymentMethod = computed(() => {
      const raw = String(tenantStore.data?.payment_checkout_method || "").toLowerCase();
      if (raw === "paypal") return "paypal";
      if (raw === "webpay") return "webpay";
      return "manual";
    });
    const storePaymentNote = computed(
      () => String(tenantStore.data?.payment_checkout_note || "").trim()
    );
    const paymentMethodOptions = computed(() => {
      if (storePaymentMethod.value === "paypal") {
        return [{ value: "paypal", label: "PayPal", help: "Método habilitado por la tienda." }];
      }
      if (storePaymentMethod.value === "webpay") {
        return [{ value: "webpay", label: "Webpay", help: "Tarjeta crédito/débito habilitada por la tienda." }];
      }
      return [{ value: "manual", label: "Pago manual", help: "La tienda no tiene pasarela online habilitada." }];
    });
    watch(
      () => storePaymentMethod.value,
      (method) => {
        selectedPaymentMode.value = method;
      },
      { immediate: true }
    );
    const payButtonText = computed(() => {
      if (selectedPaymentMode.value === "webpay") return "Pagar con Webpay";
      if (selectedPaymentMode.value === "paypal") return "Pagar con PayPal";
      return "Completar pedido sin pasarela";
    });
    const loadingPaymentText = computed(() => {
      if (selectedPaymentMode.value === "webpay") return "Redirigiendo…";
      if (selectedPaymentMode.value === "paypal") return "Conectando PayPal…";
      return "Procesando…";
    });
    const formatClp = (value) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0);
    const inferZone = (text) => {
      const normalized = String(text || "").toLowerCase();
      const centerHints = ["santiago", "providencia", "nunoa", "ñuñoa", "las condes", "vitacura", "la reina", "macul", "estacion central"];
      const northSouthHints = ["maipu", "maipú", "puente alto", "la florida", "san miguel", "huechuraba", "quilicura", "la cisterna", "independencia"];
      if (centerHints.some((hint) => normalized.includes(hint))) return "center";
      if (northSouthHints.some((hint) => normalized.includes(hint))) return "metro";
      return "outer";
    };
    const zoneCost = (fromZone, toZone) => {
      const matrix = {
        center: { center: 1800, metro: 2800, outer: 4200 },
        metro: { center: 2600, metro: 3200, outer: 4700 },
        outer: { center: 3800, metro: 4300, outer: 5600 }
      };
      return matrix[fromZone]?.[toZone] ?? 4800;
    };
    const resolveBranches = () => {
      const data = tenantStore.data || {};
      const branches = Array.isArray(data.branch_locations) ? data.branch_locations : [];
      const normalized = branches.map((branch) => {
        const zone = inferZone(branch?.zone || branch?.address || "");
        return {
          label: branch?.label || "Sucursal",
          zone,
          address: branch?.address || ""
        };
      }).filter((branch) => branch.address || branch.zone);
      if (normalized.length) return normalized;
      return [
        {
          label: "Casa matriz",
          zone: inferZone(data?.address || ""),
          address: data?.address || ""
        }
      ];
    };
    const computeShipping = () => {
      if (deliveryMethod.value === "pickup") return 0;
      const customerZone = inferZone(form.address);
      const branches = resolveBranches();
      const best = branches.map((branch) => ({
        ...branch,
        cost: zoneCost(branch.zone, customerZone)
      })).sort((a, b) => a.cost - b.cost)[0];
      const perItem = Math.min(cart.totalItems * Math.max(0, shippingPerItemFee.value || 0), 2200);
      const bulkyFee = cart.totalPrice >= 12e4 ? 800 : 0;
      const subtotalDiscount = shippingFreeOver.value > 0 && cart.totalPrice >= shippingFreeOver.value ? 999999 : 0;
      const base = Math.max(0, shippingBaseFee.value || Number(best?.cost || 3200));
      const estimated = Math.max(0, base + perItem + bulkyFee - subtotalDiscount);
      shippingDetail.value = `Estimado desde ${best?.label || "sucursal"} (${best?.address || "dirección principal"}) hacia tu zona.`;
      return estimated;
    };
    const totalWithShipping = computed(() => {
      const extra = deliveryMethod.value === "delivery" && !isDispatchChargeMode.value ? computeShipping() : 0;
      return Math.max(0, cart.totalPrice + extra);
    });
    watch(deliveryMethod, (val) => {
      if (val === "pickup") {
        shippingCost.value = 0;
        shippingDetail.value = "Retiro en tienda seleccionado. No se cobra envío.";
        dispatchFeeAcknowledged.value = false;
      } else {
        shippingCost.value = computeShipping();
      }
    });
    watch(
      () => [form.address, cart.totalItems, cart.totalPrice, tenantStore.data?.branch_locations, tenantStore.data?.address],
      () => {
        if (deliveryMethod.value === "delivery") {
          shippingCost.value = computeShipping();
        }
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 px-4 py-10" }, _attrs))} data-v-ab47bddb><div class="mx-auto max-w-6xl space-y-8" data-v-ab47bddb><div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between" data-v-ab47bddb><div data-v-ab47bddb><p class="text-xs uppercase tracking-[0.25em] text-slate-500" data-v-ab47bddb>Checkout</p><h1 class="text-3xl font-bold text-slate-900" data-v-ab47bddb>Finaliza tu compra</h1><p class="text-slate-600" data-v-ab47bddb>Completa tus datos y revisa el resumen antes de pagar.</p></div>`);
      if (unref(tenantStore).slug) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${unref(tenantStore).slug}/carrito`,
          class: "inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ← Volver al carrito `);
            } else {
              return [
                createTextVNode(" ← Volver al carrito ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (loadingPage.value) {
        _push(`<div class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm" data-v-ab47bddb>Cargando checkout...</div>`);
      } else if (unref(cart).items.length === 0) {
        _push(`<div class="space-y-4" data-v-ab47bddb><div class="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm" data-v-ab47bddb> Tu carrito está vacío. </div><div class="rounded-2xl border border-blue-100 bg-blue-50 p-4 shadow-sm" data-v-ab47bddb><p class="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700" data-v-ab47bddb>Método de pago disponible</p><p class="mt-1 text-sm font-bold text-slate-900" data-v-ab47bddb>${ssrInterpolate(paymentMethodOptions.value[0]?.label || "Pago manual")}</p><p class="mt-1 text-sm text-slate-600" data-v-ab47bddb>${ssrInterpolate(storePaymentNote.value || paymentMethodOptions.value[0]?.help)}</p></div></div>`);
      } else {
        _push(`<div class="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]" data-v-ab47bddb><section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5" data-v-ab47bddb><div class="flex items-center justify-between" data-v-ab47bddb><h2 class="text-xl font-semibold text-slate-900" data-v-ab47bddb>Datos del cliente</h2><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600" data-v-ab47bddb>Entrega</span></div>`);
        if (showWhatsAppCTA.value) {
          _push(`<div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" data-v-ab47bddb><p class="font-semibold text-emerald-900" data-v-ab47bddb>¿Prefieres agendar por WhatsApp?</p><p class="mt-1" data-v-ab47bddb>Número de la tienda: ${ssrInterpolate(storeWhatsAppDisplay.value)}</p>`);
          if (hasStoreWhatsApp.value) {
            _push(`<a${ssrRenderAttr("href", storeWhatsAppUrl.value)} target="_blank" rel="noopener" class="mt-2 inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-100" data-v-ab47bddb> Agendar pedido por WhatsApp </a>`);
          } else {
            _push(`<p class="mt-2 text-xs text-emerald-700/80" data-v-ab47bddb>La tienda aún no configuró su número de WhatsApp en la sección de contacto.</p>`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid gap-4 md:grid-cols-2" data-v-ab47bddb><div class="space-y-2" data-v-ab47bddb><label class="text-sm text-slate-600" data-v-ab47bddb>Nombre completo</label><input${ssrRenderAttr("value", form.name)} type="text" class="input" placeholder="Ej: Juan Pérez" data-v-ab47bddb></div><div class="space-y-2" data-v-ab47bddb><label class="text-sm text-slate-600" data-v-ab47bddb>Correo electrónico</label><input${ssrRenderAttr("value", form.email)} type="email" class="input" placeholder="tu@correo.com" data-v-ab47bddb></div><div class="space-y-2" data-v-ab47bddb><label class="text-sm text-slate-600" data-v-ab47bddb>Teléfono</label><input${ssrRenderAttr("value", form.phone)} type="text" class="input" placeholder="+56 9 1234 5678" data-v-ab47bddb></div>`);
        if (deliveryMethod.value === "delivery") {
          _push(`<div class="space-y-2 md:col-span-2" data-v-ab47bddb><label class="text-sm text-slate-600" data-v-ab47bddb>Dirección</label><textarea rows="3" class="input" placeholder="Calle, número, comuna, ciudad" data-v-ab47bddb>${ssrInterpolate(form.address)}</textarea></div>`);
        } else {
          _push(`<div class="space-y-2 md:col-span-2" data-v-ab47bddb><label class="text-sm text-slate-600" data-v-ab47bddb>Sucursal para consumo en local</label><div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700" data-v-ab47bddb>${ssrInterpolate(unref(tenantStore).data?.address || "Dirección principal de la tienda")}</div></div>`);
        }
        if (checkoutPaymentHint.value) {
          _push(`<p class="text-xs text-emerald-700 md:col-span-2" data-v-ab47bddb>${ssrInterpolate(checkoutPaymentHint.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-3" data-v-ab47bddb><label class="text-sm text-slate-600" data-v-ab47bddb>Tipo de pedido</label><div class="flex flex-col gap-2" data-v-ab47bddb><label class="flex items-center gap-2 text-sm text-slate-700" data-v-ab47bddb><input type="radio" value="pickup"${ssrIncludeBooleanAttr(ssrLooseEqual(deliveryMethod.value, "pickup")) ? " checked" : ""} data-v-ab47bddb> Comer en local (sin envío) </label><label class="flex items-center gap-2 text-sm text-slate-700" data-v-ab47bddb><input type="radio" value="delivery"${ssrIncludeBooleanAttr(ssrLooseEqual(deliveryMethod.value, "delivery")) ? " checked" : ""} data-v-ab47bddb> Envío a domicilio (costo automático) `);
        if (deliveryMethod.value === "delivery") {
          _push(`<span class="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600" data-v-ab47bddb>${ssrInterpolate(formatClp(shippingCost.value))}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label></div><p class="text-xs text-slate-500" data-v-ab47bddb>${ssrInterpolate(shippingDetail.value)}</p>`);
        if (isDispatchChargeMode.value && deliveryMethod.value === "delivery") {
          _push(`<p class="text-xs text-amber-700" data-v-ab47bddb>El envío se cobra al despacho. El total pagado ahora no incluye envío.</p>`);
        } else {
          _push(`<!---->`);
        }
        if (isDispatchChargeMode.value && deliveryMethod.value === "delivery") {
          _push(`<label class="inline-flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800" data-v-ab47bddb><input${ssrIncludeBooleanAttr(Array.isArray(dispatchFeeAcknowledged.value) ? ssrLooseContain(dispatchFeeAcknowledged.value, null) : dispatchFeeAcknowledged.value) ? " checked" : ""} type="checkbox" class="mt-0.5" data-v-ab47bddb> Confirmo que pagaré el envío directamente al despacho. </label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (deliveryMethod.value === "pickup") {
          _push(`<div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800" data-v-ab47bddb> Pedido para consumir en local. Dirección de referencia: ${ssrInterpolate(unref(tenantStore).data?.address || "Sucursal principal")}. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-3" data-v-ab47bddb><label class="text-sm text-slate-600" data-v-ab47bddb>Método de pago</label><div class="grid gap-2 sm:grid-cols-3" data-v-ab47bddb><!--[-->`);
        ssrRenderList(paymentMethodOptions.value, (method) => {
          _push(`<button type="button" class="${ssrRenderClass([selectedPaymentMode.value === method.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300", "rounded-xl border px-3 py-2 text-left text-sm transition"])}" data-v-ab47bddb><p class="font-semibold" data-v-ab47bddb>${ssrInterpolate(method.label)}</p><p class="text-xs opacity-80" data-v-ab47bddb>${ssrInterpolate(method.help)}</p></button>`);
        });
        _push(`<!--]--></div></div></section><aside class="space-y-4" data-v-ab47bddb><div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" data-v-ab47bddb><div class="flex items-center justify-between" data-v-ab47bddb><h3 class="text-lg font-semibold text-slate-900" data-v-ab47bddb>Resumen del pedido</h3><span class="text-sm text-slate-600" data-v-ab47bddb>${ssrInterpolate(unref(cart).totalItems)} artículos</span></div><div class="divide-y divide-slate-100" data-v-ab47bddb><!--[-->`);
        ssrRenderList(unref(cart).items, (item) => {
          _push(`<div class="flex items-center gap-3 py-3 text-sm text-slate-700" data-v-ab47bddb><div class="h-14 w-14 overflow-hidden rounded-xl bg-slate-100" data-v-ab47bddb><img${ssrRenderAttr("src", item.image || placeholder)}${ssrRenderAttr("alt", item.name)} class="h-full w-full object-cover" data-v-ab47bddb></div><div class="flex-1" data-v-ab47bddb><p class="font-semibold text-slate-900 line-clamp-1" data-v-ab47bddb>${ssrInterpolate(item.name)}</p><p class="text-xs text-slate-500" data-v-ab47bddb>Cantidad: ${ssrInterpolate(item.quantity)}</p>`);
          if (item.optionsSummary) {
            _push(`<p class="text-xs text-slate-500" data-v-ab47bddb>${ssrInterpolate(item.optionsSummary)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="font-semibold" style="${ssrRenderStyle({ color: accentColor.value })}" data-v-ab47bddb>${ssrInterpolate(formatClp(item.price * item.quantity))}</p></div>`);
        });
        _push(`<!--]--></div><div class="space-y-2 text-sm text-slate-700" data-v-ab47bddb><div class="flex justify-between" data-v-ab47bddb><span data-v-ab47bddb>Subtotal</span><span data-v-ab47bddb>${ssrInterpolate(formatClp(unref(cart).totalPrice))}</span></div><div class="flex justify-between text-slate-500" data-v-ab47bddb><span data-v-ab47bddb>Envío</span><span data-v-ab47bddb>${ssrInterpolate(deliveryMethod.value === "delivery" ? isDispatchChargeMode.value ? `${formatClp(shippingCost.value || 0)} (al despacho)` : formatClp(shippingCost.value || 0) : "Retiro en tienda")}</span></div></div><div class="flex items-center justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900" data-v-ab47bddb><span data-v-ab47bddb>Total</span><span data-v-ab47bddb>${ssrInterpolate(formatClp(totalWithShipping.value))}</span></div><button${ssrIncludeBooleanAttr(loadingOrder.value) ? " disabled" : ""} class="w-full rounded-xl px-4 py-3 text-sm font-semibold text-white shadow disabled:opacity-60" style="${ssrRenderStyle(accentStyle.value)}" data-v-ab47bddb>${ssrInterpolate(loadingOrder.value ? loadingPaymentText.value : payButtonText.value)}</button></div><div class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 shadow-sm" data-v-ab47bddb><p class="font-semibold text-slate-800" data-v-ab47bddb>Seguridad y soporte</p><p data-v-ab47bddb>Pago procesado por pasarela segura (Webpay o PayPal). Ante dudas, contáctanos usando el correo de tu pedido.</p></div></aside></div>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/checkout/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ab47bddb"]]);

export { index as default };
//# sourceMappingURL=index-RUnCzGdM.mjs.map
