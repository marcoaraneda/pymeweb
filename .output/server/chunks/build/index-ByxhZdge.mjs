import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { h as useRoute, b as useAuthStore } from './server.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const theme = useThemeStore();
    useAuthStore();
    useTenantStore();
    const slug = route.params.slug;
    const activeTab = ref("general");
    const saving = ref(false);
    const message = ref("");
    const messageType = ref("success");
    const tabs = [
      { id: "general", label: "General" },
      { id: "design", label: "Diseño" }
    ];
    const form = reactive({
      name: "",
      store_type: "retail",
      description: "",
      about_who_we_are: "",
      about_history: "",
      about_mission: "",
      about_extra: "",
      contact_email: "",
      phone: "",
      whatsapp: "",
      address: "",
      menu_file_url: "",
      menu_file_kind: "",
      menu_cover_image_url: "",
      logo_url: "",
      banner_url: "",
      accent_color: "#2563eb",
      hero_pattern_enabled: true,
      hero_pattern_style: "type",
      quick_media: [],
      social_instagram: "",
      social_facebook: "",
      social_tiktok: "",
      social_youtube: ""
    });
    const openCarouselMenuIndex = ref(-1);
    const logoFileName = ref("");
    const bannerFileName = ref("");
    const menuFileName = ref("");
    const menuCoverFileName = ref("");
    const hasMenuSupport = computed(() => {
      return ["fast_food", "bakery"].includes(form.store_type);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-8" }, _attrs))}><div class="flex items-center justify-between gap-4"><div><h2 class="text-2xl font-bold">Configuración de tienda</h2><p class="text-white/70">Personaliza tu tienda, diseño y opciones</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}`,
        class: "rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Ver tienda `);
          } else {
            return [
              createTextVNode(" Ver tienda ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="flex gap-2 border-b border-white/10"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([activeTab.value === tab.id ? "border-b-2 text-white" : "text-white/60 hover:text-white", "px-4 py-3 text-sm font-semibold transition"])}" style="${ssrRenderStyle(activeTab.value === tab.id ? { borderColor: unref(theme).accent } : {})}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div><div class="space-y-6">`);
      if (activeTab.value === "general") {
        _push(`<div class="space-y-6"><section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><h3 class="mb-4 text-lg font-semibold">Información general</h3><div class="grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-white/80">Nombre de tienda</label><input${ssrRenderAttr("value", form.name)} type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><div class="space-y-2"><label class="text-sm text-white/80">Tipo de tienda</label><select disabled class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white opacity-60"><option value="retail"${ssrIncludeBooleanAttr(Array.isArray(form.store_type) ? ssrLooseContain(form.store_type, "retail") : ssrLooseEqual(form.store_type, "retail")) ? " selected" : ""}>Retail</option><option value="fast_food"${ssrIncludeBooleanAttr(Array.isArray(form.store_type) ? ssrLooseContain(form.store_type, "fast_food") : ssrLooseEqual(form.store_type, "fast_food")) ? " selected" : ""}>Comida rápida</option><option value="bakery"${ssrIncludeBooleanAttr(Array.isArray(form.store_type) ? ssrLooseContain(form.store_type, "bakery") : ssrLooseEqual(form.store_type, "bakery")) ? " selected" : ""}>Pastelería</option><option value="pharmacy"${ssrIncludeBooleanAttr(Array.isArray(form.store_type) ? ssrLooseContain(form.store_type, "pharmacy") : ssrLooseEqual(form.store_type, "pharmacy")) ? " selected" : ""}>Farmacia</option><option value="fashion"${ssrIncludeBooleanAttr(Array.isArray(form.store_type) ? ssrLooseContain(form.store_type, "fashion") : ssrLooseEqual(form.store_type, "fashion")) ? " selected" : ""}>Moda</option><option value="bookstore"${ssrIncludeBooleanAttr(Array.isArray(form.store_type) ? ssrLooseContain(form.store_type, "bookstore") : ssrLooseEqual(form.store_type, "bookstore")) ? " selected" : ""}>Librería</option></select><p class="text-xs text-white/50">El tipo de tienda no puede cambiar después de crear la tienda.</p></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Descripción</label><textarea rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">${ssrInterpolate(form.description)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Acerca de - Quiénes somos</label><textarea rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">${ssrInterpolate(form.about_who_we_are)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Acerca de - Nuestra historia</label><textarea rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">${ssrInterpolate(form.about_history)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Acerca de - Misión y visión</label><textarea rows="3" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">${ssrInterpolate(form.about_mission)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Acerca de - Información adicional</label><textarea rows="2" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white">${ssrInterpolate(form.about_extra)}</textarea></div></div></section><section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><h3 class="mb-4 text-lg font-semibold">Contacto</h3><div class="grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-white/80">Email</label><input${ssrRenderAttr("value", form.contact_email)} type="email" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><div class="space-y-2"><label class="text-sm text-white/80">Teléfono</label><input${ssrRenderAttr("value", form.phone)} type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><div class="space-y-2"><label class="text-sm text-white/80">WhatsApp</label><input${ssrRenderAttr("value", form.whatsapp)} type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Dirección</label><input${ssrRenderAttr("value", form.address)} type="text" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div></div></section>`);
        if (hasMenuSupport.value) {
          _push(`<section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><h3 class="mb-4 text-lg font-semibold">Carta o Menú</h3><p class="mb-4 text-sm text-white/70">Sube tu carta o menú en PDF</p><div class="grid gap-4"><div class="space-y-2"><label class="text-sm text-white/80">Archivo PDF o imagen</label><input type="file" accept=".pdf,image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"><p class="text-xs text-white/50">${ssrInterpolate(menuFileName.value || (form.menu_file_url ? "Archivo listo para guardar" : "Ningún archivo seleccionado"))}</p></div><div class="space-y-2"><label class="text-sm text-white/80">Imagen de portada del menú (opcional)</label><input type="file" accept="image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"><p class="text-xs text-white/50">${ssrInterpolate(menuCoverFileName.value || (form.menu_cover_image_url ? "Portada lista para guardar" : "Sin portada"))}</p></div></div></section>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (activeTab.value === "design") {
        _push(`<div class="space-y-6"><section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><h3 class="mb-4 text-lg font-semibold">Identidad visual</h3><div class="grid gap-4 md:grid-cols-2"><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Logo</label><div class="flex gap-3">`);
        if (form.logo_url) {
          _push(`<img${ssrRenderAttr("src", form.logo_url)} alt="Logo" class="h-20 w-20 rounded-lg object-cover">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<input type="file" accept="image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><p class="text-xs text-white/50">${ssrInterpolate(logoFileName.value || (form.logo_url ? "Logo listo para guardar" : "Ningún archivo seleccionado"))}</p></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-white/80">Banner principal</label><div class="flex flex-col gap-3">`);
        if (form.banner_url) {
          _push(`<img${ssrRenderAttr("src", form.banner_url)} alt="Banner" class="h-32 w-full rounded-lg object-cover">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<input type="file" accept="image/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><p class="text-xs text-white/50">${ssrInterpolate(bannerFileName.value || (form.banner_url ? "Banner listo para guardar" : "Ningún archivo seleccionado"))}</p></div><div class="space-y-2"><label class="text-sm text-white/80">Color acento</label><input${ssrRenderAttr("value", form.accent_color)} type="color" class="h-10 w-full rounded-xl border border-white/15 bg-white/5 px-2 py-1"></div><div class="space-y-2"><label class="text-sm text-white/80">Patrón</label><select class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"><option value="type"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "type") : ssrLooseEqual(form.hero_pattern_style, "type")) ? " selected" : ""}>Según tipo</option><option value="diagonal"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "diagonal") : ssrLooseEqual(form.hero_pattern_style, "diagonal")) ? " selected" : ""}>Diagonal</option><option value="vertical"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "vertical") : ssrLooseEqual(form.hero_pattern_style, "vertical")) ? " selected" : ""}>Vertical</option><option value="circles"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "circles") : ssrLooseEqual(form.hero_pattern_style, "circles")) ? " selected" : ""}>Círculos</option><option value="waves"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "waves") : ssrLooseEqual(form.hero_pattern_style, "waves")) ? " selected" : ""}>Ondas</option><option value="fine_grid"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "fine_grid") : ssrLooseEqual(form.hero_pattern_style, "fine_grid")) ? " selected" : ""}>Rejilla fina</option><option value="small_dots"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "small_dots") : ssrLooseEqual(form.hero_pattern_style, "small_dots")) ? " selected" : ""}>Puntos pequeños</option><option value="zigzag"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "zigzag") : ssrLooseEqual(form.hero_pattern_style, "zigzag")) ? " selected" : ""}>Zigzag</option><option value="soft_noise"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "soft_noise") : ssrLooseEqual(form.hero_pattern_style, "soft_noise")) ? " selected" : ""}>Noise suave</option><option value="double_diagonal"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "double_diagonal") : ssrLooseEqual(form.hero_pattern_style, "double_diagonal")) ? " selected" : ""}>Doble diagonal</option><option value="none"${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_style) ? ssrLooseContain(form.hero_pattern_style, "none") : ssrLooseEqual(form.hero_pattern_style, "none")) ? " selected" : ""}>Sin patrón</option></select></div><div class="space-y-2"><label class="inline-flex items-center gap-2 text-sm text-white/80"><input${ssrIncludeBooleanAttr(Array.isArray(form.hero_pattern_enabled) ? ssrLooseContain(form.hero_pattern_enabled, null) : form.hero_pattern_enabled) ? " checked" : ""} type="checkbox" class="rounded"> Habilitar patrón </label></div></div></section><section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><h3 class="mb-4 text-lg font-semibold">Carrusel principal</h3><p class="mb-4 text-sm text-white/70">Sube imágenes o videos para el carrusel (máximo 5)</p><div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3"><!--[-->`);
        ssrRenderList(form.quick_media, (item, idx) => {
          _push(`<div class="group relative carousel-item">`);
          if (item.type === "image") {
            _push(`<img${ssrRenderAttr("src", item.url)}${ssrRenderAttr("alt", `Carrusel ${idx + 1}`)} class="h-40 w-full rounded-lg object-cover object-center">`);
          } else {
            _push(`<div class="flex h-40 w-full items-center justify-center rounded-lg bg-white/10"><span class="text-sm text-white/60">Video</span></div>`);
          }
          _push(`<button class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow transition" aria-label="Abrir opciones"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></button>`);
          if (openCarouselMenuIndex.value === idx) {
            _push(`<div class="absolute right-2 top-12 z-50 carousel-item-menu"><div class="rounded-lg border border-slate-200 bg-white p-2 text-sm shadow-lg w-36"><button class="w-full text-left px-3 py-2 text-red-600 font-semibold hover:bg-slate-50">Eliminar</button></div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
        if (form.quick_media.length < 5) {
          _push(`<div class="mt-4"><input type="file" multiple accept="image/*,video/*" class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"><p class="mt-2 text-xs text-white/50">${ssrInterpolate(form.quick_media.length)}/5 elementos</p></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section><section class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"><h3 class="mb-4 text-lg font-semibold">Redes sociales</h3><div class="grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-white/80">Instagram</label><input${ssrRenderAttr("value", form.social_instagram)} type="url" placeholder="https://instagram.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><div class="space-y-2"><label class="text-sm text-white/80">Facebook</label><input${ssrRenderAttr("value", form.social_facebook)} type="url" placeholder="https://facebook.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><div class="space-y-2"><label class="text-sm text-white/80">TikTok</label><input${ssrRenderAttr("value", form.social_tiktok)} type="url" placeholder="https://tiktok.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div><div class="space-y-2"><label class="text-sm text-white/80">YouTube</label><input${ssrRenderAttr("value", form.social_youtube)} type="url" placeholder="https://youtube.com/..." class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"></div></div></section></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-wrap items-center gap-3"><button class="rounded-xl px-6 py-2 font-semibold text-white" style="${ssrRenderStyle({ backgroundColor: unref(theme).accent })}"${ssrIncludeBooleanAttr(saving.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Guardando..." : "Guardar cambios")}</button>`);
      if (message.value) {
        _push(`<p class="${ssrRenderClass(messageType.value === "error" ? "text-red-400" : "text-emerald-400")}">${ssrInterpolate(message.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ByxhZdge.mjs.map
