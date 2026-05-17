import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { g as useRoute, b as useAuthStore } from './server.mjs';
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
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "pagos",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useAuthStore();
    const theme = useThemeStore();
    const slug = route.params.slug;
    const loading = ref(false);
    const saving = ref(false);
    const message = ref("");
    const messageType = ref("ok");
    const configured = ref(false);
    const verificationStatus = ref("");
    const events = ref([]);
    const availableMethods = ref([]);
    const selectedMethodId = ref(0);
    const form = reactive({
      provider: "paypal",
      account_email: "",
      account_holder_name: "",
      bank_name: "",
      account_type: "",
      account_number_last4: ""
    });
    const accentColor = computed(() => theme.accent || "#2563eb");
    const statusLabel = computed(() => {
      if (!configured.value) return "Sin configurar";
      if (verificationStatus.value === "verified") return "Verificada";
      if (verificationStatus.value === "rejected") return "Rechazada";
      return "Pendiente de verificacion";
    });
    const statusPillClass = computed(() => {
      if (!configured.value) return "bg-slate-100 text-slate-700";
      if (verificationStatus.value === "verified") return "bg-emerald-100 text-emerald-700";
      if (verificationStatus.value === "rejected") return "bg-rose-100 text-rose-700";
      return "bg-amber-100 text-amber-700";
    });
    const eventActionLabel = (action) => {
      const map = {
        updated: "Cuenta actualizada",
        verified: "Cuenta verificada",
        rejected: "Cuenta rechazada"
      };
      return map[String(action || "").toLowerCase()] || action || "Evento";
    };
    const formatDate = (value) => {
      if (!value) return "—";
      return new Intl.DateTimeFormat("es-CL", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(new Date(value));
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-slate-900">Cuenta receptora de pagos</h1><p class="text-sm text-slate-600">Configura donde llega el dinero de esta tienda.</p></div><button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(loading.value ? "Actualizando..." : "Actualizar")}</button></header><section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4"><div class="flex flex-wrap items-center gap-2"><span class="${ssrRenderClass([statusPillClass.value, "rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(statusLabel.value)}</span><span class="text-xs text-slate-500">Tienda: ${ssrInterpolate(unref(slug))}</span></div><div class="grid gap-3 md:grid-cols-2"><label class="space-y-1 md:col-span-2"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Método guardado en perfil (opcional)</span><select class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700"><option${ssrRenderAttr("value", 0)}${ssrIncludeBooleanAttr(Array.isArray(selectedMethodId.value) ? ssrLooseContain(selectedMethodId.value, 0) : ssrLooseEqual(selectedMethodId.value, 0)) ? " selected" : ""}>Configurar manualmente</option><!--[-->`);
      ssrRenderList(availableMethods.value, (m) => {
        _push(`<option${ssrRenderAttr("value", m.id)}${ssrIncludeBooleanAttr(Array.isArray(selectedMethodId.value) ? ssrLooseContain(selectedMethodId.value, m.id) : ssrLooseEqual(selectedMethodId.value, m.id)) ? " selected" : ""}>${ssrInterpolate(m.label)} · ${ssrInterpolate(m.provider === "paypal" ? `PayPal ${m.account_email || ""}` : `Tarjeta **** ${m.card_last4 || ""}`)}</option>`);
      });
      _push(`<!--]--></select></label><label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Proveedor</span><select class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700"><option value="paypal"${ssrIncludeBooleanAttr(Array.isArray(form.provider) ? ssrLooseContain(form.provider, "paypal") : ssrLooseEqual(form.provider, "paypal")) ? " selected" : ""}>PayPal</option><option value="card"${ssrIncludeBooleanAttr(Array.isArray(form.provider) ? ssrLooseContain(form.provider, "card") : ssrLooseEqual(form.provider, "card")) ? " selected" : ""}>Tarjeta</option><option value="bank_transfer"${ssrIncludeBooleanAttr(Array.isArray(form.provider) ? ssrLooseContain(form.provider, "bank_transfer") : ssrLooseEqual(form.provider, "bank_transfer")) ? " selected" : ""}>Transferencia bancaria</option></select></label>`);
      if (form.provider === "paypal") {
        _push(`<label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Correo PayPal</span><input${ssrRenderAttr("value", form.account_email)} type="email" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="cobros@mitienda.com"></label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Titular</span><input${ssrRenderAttr("value", form.account_holder_name)} type="text" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Nombre del titular"></label>`);
      if (form.provider === "card") {
        _push(`<label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Ultimos 4 digitos de tarjeta</span><input${ssrRenderAttr("value", form.account_number_last4)} type="text" maxlength="8" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="1234"></label>`);
      } else {
        _push(`<!---->`);
      }
      if (form.provider === "bank_transfer") {
        _push(`<!--[--><label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Banco</span><input${ssrRenderAttr("value", form.bank_name)} type="text" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Banco"></label><label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Tipo de cuenta</span><input${ssrRenderAttr("value", form.account_type)} type="text" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="Corriente / Vista"></label><label class="space-y-1"><span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Ultimos 4 digitos</span><input${ssrRenderAttr("value", form.account_number_last4)} type="text" maxlength="8" class="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm" placeholder="1234"></label><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-wrap items-center gap-2"><button class="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Guardando..." : "Guardar cuenta receptora")}</button>`);
      if (configured.value) {
        _push(`<button class="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 disabled:opacity-60"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}> Marcar verificada </button>`);
      } else {
        _push(`<!---->`);
      }
      if (configured.value) {
        _push(`<button class="rounded-lg border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 disabled:opacity-60"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}> Rechazar </button>`);
      } else {
        _push(`<!---->`);
      }
      if (message.value) {
        _push(`<p class="${ssrRenderClass([messageType.value === "error" ? "text-red-600" : "text-emerald-700", "text-sm"])}">${ssrInterpolate(message.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
      if (events.value.length) {
        _push(`<section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"><h2 class="text-sm font-semibold text-slate-800">Historial de verificación y cambios</h2><ul class="divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(events.value, (event, idx) => {
          _push(`<li class="py-2 text-sm"><div class="flex flex-wrap items-center justify-between gap-2"><p class="font-semibold text-slate-800">${ssrInterpolate(eventActionLabel(event.action))}</p><span class="text-xs text-slate-500">${ssrInterpolate(formatDate(event.created_at))}</span></div><p class="text-xs text-slate-500">por ${ssrInterpolate(event.actor_username || "sistema")}</p>`);
          if (event.note) {
            _push(`<p class="text-xs text-slate-600">${ssrInterpolate(event.note)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/pagos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=pagos-CWZjy-1x.mjs.map
