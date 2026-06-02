import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
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
import './theme-LeBKALXb.mjs';

const useCMS = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const tenant = useTenantStore();
  const authedFetch = async (url, options = {}) => {
    if (!auth.token) throw new Error("No autenticado");
    const doFetch = (token) => $fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers || {} }
    });
    try {
      return await doFetch(auth.token);
    } catch (error) {
      const code = error?.response?._data?.code;
      if (code === "token_not_valid" && auth.refreshToken) {
        const refreshed = await auth.refreshTokens();
        if (refreshed) return doFetch(refreshed);
      }
      throw error;
    }
  };
  const getSections = async () => {
    if (!tenant.slug) throw new Error("Tienda no definida");
    try {
      return await authedFetch(`${config.public.apiBase}/store/${tenant.slug}/admin/cms/home-sections/`);
    } catch (error) {
      throw new Error("No se pudieron cargar las secciones.");
    }
  };
  const updateSectionStatus = async (sectionId, isEnabled) => {
    if (!tenant.slug) throw new Error("Tienda no definida");
    const doPatch = async (token) => $fetch(`${config.public.apiBase}/store/${tenant.slug}/admin/cms/home-sections/${sectionId}/`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { enabled: isEnabled }
    });
    try {
      if (!auth.token) throw new Error("No autenticado");
      return await doPatch(auth.token);
    } catch (error) {
      const code = error?.response?._data?.code;
      if (code === "token_not_valid" && auth.refreshToken) {
        const refreshed = await auth.refreshTokens();
        if (refreshed) return doPatch(refreshed);
      }
      throw new Error("Error al actualizar la sección.");
    }
  };
  const createSection = async (payload) => {
    if (!tenant.slug) throw new Error("Tienda no definida");
    try {
      return await authedFetch(`${config.public.apiBase}/store/${tenant.slug}/admin/cms/home-sections/`, {
        method: "POST",
        body: {
          section_type: payload.section_type,
          enabled: payload.enabled ?? true,
          order: payload.order ?? 0,
          config: payload.config ?? {}
        }
      });
    } catch (error) {
      const detail = error?.response?._data?.detail || error?.response?._data?.section_type || "No se pudo crear la sección.";
      throw new Error(Array.isArray(detail) ? detail.join(" ") : detail);
    }
  };
  return { getSections, updateSectionStatus, createSection };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cms",
  __ssrInlineRender: true,
  setup(__props) {
    useCMS();
    const sections = ref([]);
    const loading = ref(false);
    const initializing = ref(false);
    const savingId = ref(null);
    const errorMessage = ref("");
    const successMessage = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto space-y-8" }, _attrs))}><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold">Personalización de la Tienda</h1><p class="text-sm text-gray-500">Activa o desactiva secciones de la página principal.</p></div><button class="text-sm bg-gray-200 px-4 py-2 rounded-lg">Actualizar</button></div>`);
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
      if (loading.value) {
        _push(`<div class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500"> Cargando secciones... </div>`);
      } else if (!sections.value.length) {
        _push(`<div class="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500 space-y-3"><p>No hay secciones configuradas para esta tienda.</p><button class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"${ssrIncludeBooleanAttr(initializing.value) ? " disabled" : ""}>${ssrInterpolate(initializing.value ? "Inicializando..." : "Inicializar secciones por defecto")}</button></div>`);
      } else {
        _push(`<div class="grid gap-4"><!--[-->`);
        ssrRenderList(sections.value, (section) => {
          _push(`<div class="bg-white p-6 rounded-xl border flex justify-between items-center shadow-sm"><div><h3 class="font-bold text-gray-800 uppercase text-sm">${ssrInterpolate(section.section_type)}</h3><p class="text-gray-500 text-sm">Controla la visibilidad de esta sección en tu página principal.</p></div><button class="${ssrRenderClass([section.enabled ? "bg-green-500" : "bg-gray-300", "relative inline-flex h-6 w-11 items-center rounded-full transition-colors"])}"${ssrIncludeBooleanAttr(savingId.value === section.id) ? " disabled" : ""}><span class="${ssrRenderClass([section.enabled ? "translate-x-6" : "translate-x-1", "inline-block h-4 w-4 transform rounded-full bg-white transition-transform"])}"></span></button></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/cms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=cms-DTIkSd8C.mjs.map
