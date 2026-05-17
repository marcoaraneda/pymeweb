import { defineComponent, ref, reactive, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
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

const faqPageSize = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "faq",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useAuthStore();
    const theme = useThemeStore();
    route.params.slug;
    const loading = ref(false);
    const saving = ref(false);
    const message = ref("");
    const messageType = ref("ok");
    const faqs = ref([]);
    const faqPage = ref(1);
    const form = reactive({
      question: "",
      answer: ""
    });
    const accentColor = computed(() => theme.accent || "#2563eb");
    const faqTotalPages = computed(() => Math.max(1, Math.ceil(faqs.value.length / faqPageSize)));
    const pagedFaqs = computed(() => {
      const start = (faqPage.value - 1) * faqPageSize;
      return faqs.value.slice(start, start + faqPageSize);
    });
    watch(faqs, () => {
      if (faqPage.value > faqTotalPages.value) faqPage.value = faqTotalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-slate-900">FAQ de la tienda</h1><p class="text-sm text-slate-600">Administra preguntas frecuentes visibles para clientes.</p></div><button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""}>${ssrInterpolate(loading.value ? "Actualizando..." : "Actualizar")}</button></header><section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"><h2 class="text-sm font-semibold text-slate-800">Nueva pregunta</h2><div class="grid gap-3"><input${ssrRenderAttr("value", form.question)} type="text" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Pregunta frecuente"><textarea rows="3" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Respuesta">${ssrInterpolate(form.answer)}</textarea></div><div class="flex items-center gap-2"><button class="rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Guardando..." : "Guardar FAQ")}</button>`);
      if (message.value) {
        _push(`<p class="${ssrRenderClass([messageType.value === "error" ? "text-red-600" : "text-emerald-700", "text-sm"])}">${ssrInterpolate(message.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section><section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="flex items-center justify-between"><h2 class="text-sm font-semibold text-slate-800">Items</h2><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">${ssrInterpolate(faqs.value.length)}</span></div>`);
      if (loading.value) {
        _push(`<div class="mt-4 text-sm text-slate-500">Cargando FAQ...</div>`);
      } else if (!faqs.value.length) {
        _push(`<div class="mt-4 text-sm text-slate-500">No hay preguntas frecuentes configuradas.</div>`);
      } else {
        _push(`<ul class="mt-4 divide-y divide-slate-100"><!--[-->`);
        ssrRenderList(pagedFaqs.value, (faq) => {
          _push(`<li class="py-3 space-y-2"><div class="flex items-start justify-between gap-2"><div><p class="text-sm font-semibold text-slate-900">${ssrInterpolate(faq.question)}</p><p class="text-sm text-slate-700 whitespace-pre-line">${ssrInterpolate(faq.answer)}</p></div><button class="${ssrRenderClass([faq.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-700", "rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(faq.is_active ? "Activo" : "Inactivo")}</button></div></li>`);
        });
        _push(`<!--]--></ul>`);
      }
      if (faqTotalPages.value > 1) {
        _push(`<div class="mt-4 flex items-center justify-between text-xs text-slate-600"><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(faqPage.value === 1) ? " disabled" : ""}>Anterior</button><span>Página ${ssrInterpolate(faqPage.value)} / ${ssrInterpolate(faqTotalPages.value)}</span><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(faqPage.value === faqTotalPages.value) ? " disabled" : ""}>Siguiente</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/faq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=faq-BmCj8juB.mjs.map
