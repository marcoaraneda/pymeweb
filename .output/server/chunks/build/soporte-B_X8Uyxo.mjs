import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { useRoute } from 'vue-router';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
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

const perPage = 8;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "soporte",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = computed(() => route.params.slug);
    const auth = useAuthStore();
    const theme = useThemeStore();
    const config = useRuntimeConfig();
    const accentColor = computed(() => theme.accent || "#2563eb");
    const form = ref({ title: "", description: "", priority: "normal" });
    const sending = ref(false);
    const message = ref("");
    const messageClass = computed(() => message.value.toLowerCase().includes("error") ? "text-red-600" : "text-emerald-600");
    const reportForm = ref({
      title: "",
      description: "",
      category: "fraude",
      incidentDate: "",
      orderReference: "",
      contact: "",
      evidenceUrl: ""
    });
    const reportSending = ref(false);
    const reportMessage = ref("");
    const reportMessageClass = computed(() => reportMessage.value.toLowerCase().includes("error") ? "text-red-700" : "text-emerald-700");
    const tickets = ref([]);
    const loading = ref(false);
    const page = ref(1);
    const accentStyle = computed(() => ({ backgroundColor: accentColor.value }));
    const totalPages = computed(() => Math.max(1, Math.ceil(tickets.value.length / perPage)));
    const paginatedTickets = computed(() => {
      const start = (page.value - 1) * perPage;
      return tickets.value.slice(start, start + perPage);
    });
    const pageStart = computed(() => tickets.value.length ? (page.value - 1) * perPage + 1 : 0);
    const pageEnd = computed(() => Math.min(page.value * perPage, tickets.value.length));
    const formatStatus = (value) => {
      const map = {
        open: "Abierto",
        in_progress: "En progreso",
        resolved: "Resuelto",
        closed: "Cerrado"
      };
      return map[value] || value;
    };
    const badgeClass = (value) => {
      const map = {
        open: "bg-amber-100 text-amber-800",
        in_progress: "bg-sky-100 text-sky-800",
        resolved: "bg-emerald-100 text-emerald-800",
        closed: "bg-slate-200 text-slate-800"
      };
      return map[value] || "bg-slate-200 text-slate-800";
    };
    const baseDescription = (desc) => {
      const [first] = desc.split("[Admin");
      return (first || "").trim();
    };
    const adminReplies = (desc) => {
      const parts = desc.split("[Admin");
      return parts.slice(1).map((p) => p.replace("]", "").trim()).filter(Boolean);
    };
    const formatDate = (iso) => {
      if (!iso) return "";
      const d = new Date(iso);
      return d.toLocaleString();
    };
    const loadTickets = async () => {
      if (!auth.token) return;
      loading.value = true;
      try {
        tickets.value = await $fetch(`${config.public.apiBase}/support/tickets/`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          params: { store: slug.value, kind: "support" }
        });
      } catch (error) {
        console.warn("No se pudieron cargar tickets", error);
        tickets.value = [];
      } finally {
        loading.value = false;
      }
    };
    watch(() => slug.value, () => loadTickets());
    watch(tickets, () => {
      if (page.value > totalPages.value) page.value = totalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 text-slate-900" }, _attrs))}><section class="mx-auto max-w-4xl px-6 py-10 space-y-6 reveal"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Soporte</p><h1 class="text-3xl font-bold text-slate-900">Enviar ticket</h1><p class="text-slate-600">Cuéntanos el problema, lo asignaremos al equipo correcto.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}`,
        class: "text-sm font-semibold text-slate-700 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Regresar`);
          } else {
            return [
              createTextVNode("Regresar")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="mt-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5"><p class="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Ticket de soporte para la tienda</p><div class="grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Título</label><input${ssrRenderAttr("value", form.value.title)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Ej. Problema con pago"></div><div class="space-y-2"><label class="text-sm text-slate-600">Prioridad</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="normal"${ssrIncludeBooleanAttr(Array.isArray(form.value.priority) ? ssrLooseContain(form.value.priority, "normal") : ssrLooseEqual(form.value.priority, "normal")) ? " selected" : ""}>Normal</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(form.value.priority) ? ssrLooseContain(form.value.priority, "high") : ssrLooseEqual(form.value.priority, "high")) ? " selected" : ""}>Alta</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(form.value.priority) ? ssrLooseContain(form.value.priority, "low") : ssrLooseEqual(form.value.priority, "low")) ? " selected" : ""}>Baja</option></select></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Descripción</label><textarea rows="4" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Describe qué sucede, pasos para reproducir y pantallas afectadas.">${ssrInterpolate(form.value.description)}</textarea></div></div><div class="mt-4 flex flex-wrap items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(sending.value) ? " disabled" : ""}>${ssrInterpolate(sending.value ? "Enviando..." : "Enviar ticket")}</button><span class="text-sm text-slate-600">Se asociará a esta tienda.</span>`);
      if (message.value) {
        _push(`<span class="${ssrRenderClass([messageClass.value, "text-sm"])}">${ssrInterpolate(message.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="rounded-3xl border border-rose-200 bg-rose-50 p-6 shadow-lg shadow-rose-900/5"><p class="text-xs font-semibold uppercase tracking-[0.14em] text-rose-700">Denunciar tienda</p><h2 class="mt-1 text-xl font-semibold text-rose-900">Denuncia formal para administración de plataforma</h2><p class="mt-1 text-sm text-rose-800/90">Esta denuncia no va al flujo de soporte normal de la tienda, se deriva para revisión administrativa de plataforma.</p><div class="mt-4 grid gap-4 md:grid-cols-2"><div class="space-y-2 md:col-span-2"><label class="text-sm text-rose-900">Título de la denuncia</label><input${ssrRenderAttr("value", reportForm.value.title)} type="text" class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm" placeholder="Ej. Cobro indebido / Producto no corresponde"></div><div class="space-y-2"><label class="text-sm text-rose-900">Tipo de incidencia</label><select class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm"><option value="fraude"${ssrIncludeBooleanAttr(Array.isArray(reportForm.value.category) ? ssrLooseContain(reportForm.value.category, "fraude") : ssrLooseEqual(reportForm.value.category, "fraude")) ? " selected" : ""}>Fraude o estafa</option><option value="incumplimiento"${ssrIncludeBooleanAttr(Array.isArray(reportForm.value.category) ? ssrLooseContain(reportForm.value.category, "incumplimiento") : ssrLooseEqual(reportForm.value.category, "incumplimiento")) ? " selected" : ""}>Incumplimiento de publicación</option><option value="maltrato"${ssrIncludeBooleanAttr(Array.isArray(reportForm.value.category) ? ssrLooseContain(reportForm.value.category, "maltrato") : ssrLooseEqual(reportForm.value.category, "maltrato")) ? " selected" : ""}>Maltrato o conducta inapropiada</option><option value="entrega"${ssrIncludeBooleanAttr(Array.isArray(reportForm.value.category) ? ssrLooseContain(reportForm.value.category, "entrega") : ssrLooseEqual(reportForm.value.category, "entrega")) ? " selected" : ""}>Problema grave de entrega</option><option value="otro"${ssrIncludeBooleanAttr(Array.isArray(reportForm.value.category) ? ssrLooseContain(reportForm.value.category, "otro") : ssrLooseEqual(reportForm.value.category, "otro")) ? " selected" : ""}>Otro</option></select></div><div class="space-y-2"><label class="text-sm text-rose-900">Fecha del incidente</label><input${ssrRenderAttr("value", reportForm.value.incidentDate)} type="datetime-local" class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-rose-900">Número de pedido (opcional)</label><input${ssrRenderAttr("value", reportForm.value.orderReference)} type="text" class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm" placeholder="Ej. 4521"></div><div class="space-y-2"><label class="text-sm text-rose-900">Contacto del denunciante</label><input${ssrRenderAttr("value", reportForm.value.contact)} type="text" class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm" placeholder="Email o teléfono"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-rose-900">Evidencia (URL opcional)</label><input${ssrRenderAttr("value", reportForm.value.evidenceUrl)} type="url" class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm" placeholder="https://..."></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-rose-900">Descripción detallada</label><textarea rows="5" class="w-full rounded-xl border border-rose-200 bg-white px-3 py-2 text-sm" placeholder="Describe en detalle lo ocurrido, cuándo sucedió y qué solución esperas.">${ssrInterpolate(reportForm.value.description)}</textarea></div></div><div class="mt-4 flex flex-wrap items-center gap-3"><button class="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-50"${ssrIncludeBooleanAttr(reportSending.value) ? " disabled" : ""}>${ssrInterpolate(reportSending.value ? "Enviando denuncia..." : "Enviar denuncia")}</button><span class="text-sm text-rose-900/80">Se enviará con la tienda actual: ${ssrInterpolate(slug.value)}</span>`);
      if (reportMessage.value) {
        _push(`<span class="${ssrRenderClass([reportMessageClass.value, "text-sm"])}">${ssrInterpolate(reportMessage.value)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 reveal" style="${ssrRenderStyle({ "animation-delay": "0.05s" })}"><div class="flex items-center justify-between"><h2 class="text-xl font-semibold text-slate-900">Tus tickets</h2><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">${ssrInterpolate(tickets.value.length)}</span></div>`);
      if (loading.value) {
        _push(`<div class="mt-4 text-slate-600">Cargando...</div>`);
      } else if (!tickets.value.length) {
        _push(`<div class="mt-4 text-slate-600">Aún no has enviado tickets.</div>`);
      } else {
        _push(`<div class="mt-4 divide-y divide-slate-200"><!--[-->`);
        ssrRenderList(paginatedTickets.value, (t) => {
          _push(`<article class="py-4 space-y-3"><div class="flex items-start justify-between gap-3"><div><p class="font-semibold text-slate-900">${ssrInterpolate(t.title)}</p><p class="text-xs text-slate-500">${ssrInterpolate(formatStatus(t.status))} • Prioridad ${ssrInterpolate(t.priority)}</p><p class="text-[11px] text-slate-400">Actualizado ${ssrInterpolate(formatDate(t.updated_at))}</p></div><span class="${ssrRenderClass(["rounded-full px-3 py-1 text-[11px] font-semibold", badgeClass(t.status)])}">${ssrInterpolate(formatStatus(t.status))}</span></div><div class="rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700 whitespace-pre-line">${ssrInterpolate(baseDescription(t.description))}</div>`);
          if (adminReplies(t.description).length) {
            _push(`<div class="space-y-2"><p class="text-xs font-semibold text-slate-600">Respuestas del administrador</p><div class="space-y-2"><!--[-->`);
            ssrRenderList(adminReplies(t.description), (reply, idx) => {
              _push(`<div class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800" style="${ssrRenderStyle({ borderLeft: `4px solid ${accentColor.value}` })}">${ssrInterpolate(reply)}</div>`);
            });
            _push(`<!--]--></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]--></div>`);
      }
      if (tickets.value.length > perPage) {
        _push(`<div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"><button class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(pageStart.value)}-${ssrInterpolate(pageEnd.value)} de ${ssrInterpolate(tickets.value.length)}</p><button class="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/soporte.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=soporte-B_X8Uyxo.mjs.map
