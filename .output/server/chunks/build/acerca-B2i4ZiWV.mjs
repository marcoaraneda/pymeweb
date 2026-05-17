import { defineComponent, computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import 'pinia';
import './server.mjs';
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

const defaultAboutFallback = "Agrega un mensaje de “Acerca de nosotros” desde el editor de la tienda.";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "acerca",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    route.params.slug;
    const tenantStore = useTenantStore();
    const theme = useThemeStore();
    computed(() => tenantStore.data);
    const storeName = computed(() => tenantStore.data?.name || "Tienda");
    const storeDescription = computed(() => tenantStore.data?.description || "");
    const storeLogo = computed(() => tenantStore.data?.logo_url || tenantStore.data?.logo || "");
    const aboutMessage = computed(
      () => tenantStore.data?.about || tenantStore.data?.about_us || tenantStore.data?.about_text || ""
    );
    const aboutSections = computed(() => {
      const raw = String(aboutMessage.value || "").trim();
      if (!raw) {
        return {
          who: "",
          history: "",
          mission: "",
          extra: ""
        };
      }
      const normalized = raw.replace(/\r\n/g, "\n").replace(/^##\s*Quiénes\s+somos\s*$/im, "##QUIENES").replace(/^##\s*Nuestra\s+historia\s*$/im, "##HISTORIA").replace(/^##\s*Misión\s+y\s+visión\s*$/im, "##MISION");
      const chunks = normalized.split(/##(QUIENES|HISTORIA|MISION)\n?/);
      if (chunks.length === 1) {
        return {
          who: raw,
          history: "",
          mission: "",
          extra: ""
        };
      }
      const sections = {
        who: "",
        history: "",
        mission: "",
        extra: ""
      };
      for (let i = 1; i < chunks.length; i += 2) {
        const key = chunks[i];
        const value = String(chunks[i + 1] || "").trim();
        if (key === "QUIENES") sections.who = value;
        if (key === "HISTORIA") sections.history = value;
        if (key === "MISION") sections.mission = value;
      }
      return sections;
    });
    const contactEmail = computed(() => tenantStore.data?.contact_email || tenantStore.data?.email || "");
    const phone = computed(() => tenantStore.data?.phone || "");
    const socialLinks = computed(() => {
      const data = tenantStore.data;
      const links = [
        { key: "instagram", label: "Instagram", url: String(data?.social_instagram || "").trim() },
        { key: "facebook", label: "Facebook", url: String(data?.social_facebook || "").trim() },
        { key: "tiktok", label: "TikTok", url: String(data?.social_tiktok || "").trim() },
        { key: "youtube", label: "YouTube", url: String(data?.social_youtube || "").trim() }
      ];
      return links.filter((link) => link.url);
    });
    const branchLocations = computed(() => {
      const data = tenantStore.data;
      const locations = Array.isArray(data?.branch_locations) ? data.branch_locations : [];
      if (locations.length) return locations;
      if (data?.address) {
        return [{
          label: "Casa matriz",
          zone: "",
          address: String(data.address)
        }];
      }
      return [];
    });
    const heroStyle = computed(() => ({
      backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom || "#0f172a"}, ${theme.gradientTo || "#0b2358"})`
    }));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50" }, _attrs))}><section class="relative overflow-hidden text-white" style="${ssrRenderStyle(heroStyle.value)}"><div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_42%)]" aria-hidden="true"></div><div class="absolute -right-16 top-8 h-52 w-52 rounded-full bg-white/10 blur-3xl" aria-hidden="true"></div><div class="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14"><div class="grid gap-6 lg:grid-cols-[auto,1fr] lg:items-start"><div class="h-24 w-24 overflow-hidden rounded-2xl border border-white/30 bg-white/15 shadow-lg backdrop-blur">`);
      if (storeLogo.value) {
        _push(`<img${ssrRenderAttr("src", storeLogo.value)}${ssrRenderAttr("alt", `Logo ${storeName.value}`)} class="h-full w-full object-cover">`);
      } else {
        _push(`<div class="flex h-full w-full items-center justify-center text-3xl">🏪</div>`);
      }
      _push(`</div><div class="space-y-4"><p class="text-xs uppercase tracking-[0.24em] text-white/75">Acerca de la tienda</p><div class="grid gap-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-stretch"><article class="rounded-2xl border border-white/20 bg-white/10 px-4 py-4 backdrop-blur-sm"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Nombre</p><h1 class="mt-2 text-3xl font-bold leading-tight sm:text-4xl">${ssrInterpolate(storeName.value)}</h1></article><article class="rounded-2xl border border-white/20 bg-slate-950/25 px-4 py-4 backdrop-blur-sm"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Descripción</p><p class="mt-2 text-white/90">${ssrInterpolate(storeDescription.value || "Conoce la historia, ubicación y canales de contacto de esta tienda.")}</p></article></div></div></div></div></section><section class="mx-auto max-w-6xl space-y-6 px-6 py-10"><div class="grid gap-6 lg:grid-cols-2"><article class="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Identidad</p><h2 class="mt-2 text-2xl font-bold text-slate-900">Quiénes somos</h2><p class="mt-3 whitespace-pre-line text-slate-700">${ssrInterpolate(aboutSections.value.who || defaultAboutFallback)}</p><div class="mt-5 grid gap-3"><div class="rounded-2xl border border-slate-200 bg-white p-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Nuestra historia</p><p class="mt-2 text-sm text-slate-700">${ssrInterpolate(aboutSections.value.history || "Comparte cómo nació esta tienda y su evolución para conectar con tus clientes.")}</p></div><div class="rounded-2xl border border-slate-200 bg-white p-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Misión y visión</p><p class="mt-2 text-sm text-slate-700">${ssrInterpolate(aboutSections.value.mission || "Describe tu propósito, enfoque de servicio y visión de crecimiento.")}</p></div>`);
      if (aboutSections.value.extra) {
        _push(`<div class="rounded-2xl border border-slate-200 bg-white p-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Información adicional</p><p class="mt-2 text-sm text-slate-700 whitespace-pre-line">${ssrInterpolate(aboutSections.value.extra)}</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></article><article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"><p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Contacto</p><h2 class="mt-2 text-2xl font-bold text-slate-900">Hablemos</h2><p class="mt-2 text-slate-600">¿Tienes dudas o necesitas soporte? Te respondemos lo antes posible.</p><dl class="mt-4 space-y-2 text-sm text-slate-700">`);
      if (contactEmail.value) {
        _push(`<div class="flex items-center justify-between gap-3"><dt class="text-slate-500">Correo</dt><dd class="truncate font-semibold">${ssrInterpolate(contactEmail.value)}</dd></div>`);
      } else {
        _push(`<!---->`);
      }
      if (phone.value) {
        _push(`<div class="flex items-center justify-between gap-3"><dt class="text-slate-500">Teléfono</dt><dd class="font-semibold">${ssrInterpolate(phone.value)}</dd></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</dl><div class="mt-4 flex flex-wrap gap-2 text-sm font-semibold">`);
      if (contactEmail.value) {
        _push(`<a${ssrRenderAttr("href", `mailto:${contactEmail.value}`)} class="rounded-xl bg-blue-700 px-4 py-2 text-white shadow hover:bg-blue-800">Enviar correo</a>`);
      } else {
        _push(`<!---->`);
      }
      if (phone.value) {
        _push(`<a${ssrRenderAttr("href", `tel:${phone.value}`)} class="rounded-xl border border-blue-200 px-4 py-2 text-blue-700 hover:bg-blue-50">Llamar</a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mt-5 border-t border-slate-200 pt-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Síguenos</p>`);
      if (socialLinks.value.length) {
        _push(`<div class="mt-3 flex flex-wrap gap-2 text-sm font-semibold"><!--[-->`);
        ssrRenderList(socialLinks.value, (link) => {
          _push(`<a${ssrRenderAttr("href", link.url)} target="_blank" rel="noopener noreferrer" class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">${ssrInterpolate(link.label)}</a>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="mt-3 text-sm text-slate-500">Esta tienda aún no configura redes sociales.</p>`);
      }
      _push(`</div></article></div><article class="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm"><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Ubicaciones</p><h2 class="mt-1 text-2xl font-bold text-slate-900">Sucursales y direcciones</h2></div><span class="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">${ssrInterpolate(branchLocations.value.length)} sucursal${ssrInterpolate(branchLocations.value.length === 1 ? "" : "es")}</span></div>`);
      if (branchLocations.value.length) {
        _push(`<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(branchLocations.value, (branch, index) => {
          _push(`<article class="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">${ssrInterpolate(branch.label || `Sucursal ${index + 1}`)}</p><p class="mt-2 font-semibold text-slate-900">${ssrInterpolate(branch.address || "Dirección por confirmar")}</p><p class="text-sm text-slate-600">${ssrInterpolate(branch.zone || "Zona por confirmar")}</p></article>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">Esta tienda aún no ha configurado sucursales. Se usará la dirección principal para el despacho.</p>`);
      }
      _push(`</article></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/acerca.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=acerca-B2i4ZiWV.mjs.map
