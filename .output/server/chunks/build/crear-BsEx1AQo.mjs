import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, reactive, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import { u as useImages } from './useImages-CVASCtOr.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "crear",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const auth = useAuthStore();
    const tenantStore = useTenantStore();
    const theme = useThemeStore();
    const { getProductImage } = useImages();
    const config = useRuntimeConfig();
    const slug = route.params.slug;
    const form = reactive({
      name: "",
      description: "",
      price: 0,
      offer_price: null,
      offer_min_qty: 1,
      category: "",
      image_url: "",
      stock_available: 0,
      stock_minimum: 0,
      product_of_week: false,
      free_shipping: false,
      tagsInput: ""
    });
    const saving = ref(false);
    const loadingCategories = ref(false);
    const message = ref("");
    const messageStatus = ref("ok");
    const categories = ref([]);
    const categoriesError = ref("");
    const uploadingImage = ref(false);
    const uploadError = ref("");
    const categoryAttrs = reactive({
      size: "",
      shoeSizeUS: "",
      techSpecs: "",
      clothingType: "",
      brand: "",
      audience: "",
      homeSpace: "",
      foodType: "",
      foodSize: "",
      petType: "",
      petItemType: ""
    });
    const sizeStock = reactive({});
    const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "34", "36", "38", "40", "42", "44"];
    const shoeSizesEU = ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
    const shoeSizesUS = ["5", "6", "7", "8", "9", "10", "11", "12"];
    const accentColor = computed(() => theme.accent || "#2563eb");
    const previewImage = computed(() => form.image_url || getProductImage({}));
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    const isStoreOwner = computed(() => {
      const memberships = auth.user?.memberships || [];
      return memberships.some((m) => {
        const roles = (m?.roles || []).map((r) => r?.code || r)?.map((r) => r?.toLowerCase?.());
        return m?.store?.slug === slug && roles.some((r) => ["admin", "owner", "manager"].includes(r));
      });
    });
    const availableCategories = computed(() => categories.value || []);
    const storeType = computed(() => String(tenantStore.data?.store_type || "retail"));
    computed(() => {
      if (storeType.value !== "fast_food") return null;
      return availableCategories.value.find((cat) => String(cat?.slug || "").toLowerCase() === "agregados") || null;
    });
    const selectedCategoryLabel = computed(() => {
      if (!form.category) return "General";
      const catId = Number(form.category);
      const found = availableCategories.value.find((c) => Number(c.id) === catId);
      return found?.name || "General";
    });
    const categoryName = computed(() => selectedCategoryLabel.value.toLowerCase());
    const isClothing = computed(() => /ropa|shirt|camisa|pantal|jean|blusa|dress|vestido/.test(categoryName.value));
    const isTech = computed(() => /tecno|electro|laptop|pc|notebook|tablet|phone|celu|smart/.test(categoryName.value));
    const isShoes = computed(() => /calzado|zapato|zapatilla|sneaker|bota|sandalia/.test(categoryName.value));
    const isHome = computed(() => /hogar|decor|casa|home/.test(categoryName.value));
    const isFood = computed(() => /alimento|comida|bebida|grocery/.test(categoryName.value));
    const isPet = computed(() => /mascota|pet/.test(categoryName.value));
    const isValidForm = computed(() => {
      return Boolean(form.name.trim() && Number(form.price) > 0);
    });
    const offerMinQty = computed(() => Math.max(1, Number(form.offer_min_qty) || 1));
    const offerPackTotal = computed(() => Number(form.offer_price || 0) * offerMinQty.value);
    const offerPackLabel = computed(() => {
      const offerUnitPrice = Number(form.offer_price || 0);
      if (!offerUnitPrice || offerUnitPrice <= 0) return "";
      return offerMinQty.value > 1 ? `${offerMinQty.value}x ${offerUnitPrice}` : `${offerUnitPrice}`;
    });
    const formatClp = (value) => new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0));
    const canSubmit = computed(() => isValidForm.value && isStoreOwner.value && !saving.value && !uploadingImage.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-50 px-4 py-10" }, _attrs))}><div class="mx-auto max-w-5xl space-y-6">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}/productos`,
        class: "text-sm font-semibold text-slate-700 hover:text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Volver`);
          } else {
            return [
              createTextVNode("← Volver")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="grid gap-8 md:grid-cols-[1.1fr,0.9fr] md:items-start"><div class="space-y-4"><div class="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"><img${ssrRenderAttr("src", previewImage.value)} alt="Imagen del producto" class="h-full w-full object-cover"></div><div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"><label class="text-sm font-semibold text-slate-700">URL de imagen principal</label><input${ssrRenderAttr("value", form.image_url)} type="url" placeholder="https://..." class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Se usará como portada. Puedes cambiarla luego desde el detalle.</p><div class="flex flex-wrap items-center gap-2 text-xs text-slate-600"><label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition"><input type="file" accept="image/*" class="hidden"><span>${ssrInterpolate(uploadingImage.value ? "Subiendo..." : "Subir archivo")}</span></label><span class="text-slate-500">o pega un enlace</span></div>`);
      if (uploadError.value) {
        _push(`<p class="text-xs text-red-600">${ssrInterpolate(uploadError.value)}</p>`);
      } else if (uploadingImage.value) {
        _push(`<p class="text-xs text-slate-500">Procesando imagen...</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="space-y-5"><div class="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500"><span>${ssrInterpolate(selectedCategoryLabel.value)}</span><span class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Nuevo</span></div><input${ssrRenderAttr("value", form.name)} type="text" placeholder="Nombre del producto" class="w-full rounded-xl border border-slate-200 px-3 py-3 text-2xl font-semibold text-slate-900" required><p class="text-xs text-slate-500">Requerido: nombre visible para el cliente.</p><textarea rows="3" placeholder="Describe tu producto" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(form.description)}</textarea><div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</label><input${ssrRenderAttr("value", form.price)} type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" required><p class="text-xs text-slate-500">Requerido: mayor a 0.</p></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio oferta por unidad</label><input${ssrRenderAttr("value", form.offer_price)} type="number" step="0.01" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Ej: 1990 para mostrar un pack como 3x1990.</p></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Cantidad mínima para oferta</label><input${ssrRenderAttr("value", form.offer_min_qty)} type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Ej: 3 para que la oferta aplique desde 3 unidades.</p></div></div>`);
      if (form.offer_price) {
        _push(`<div class="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-3 text-sm text-emerald-900"><p class="text-xs uppercase tracking-[0.2em] text-emerald-700">Vista previa</p><p class="font-semibold">${ssrInterpolate(offerPackLabel.value)}</p><p class="text-xs text-emerald-800">Total ${ssrInterpolate(formatClp(offerPackTotal.value))} por pack de ${ssrInterpolate(offerMinQty.value)} unidades.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="grid gap-3 sm:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock disponible</label><input${ssrRenderAttr("value", form.stock_available)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Se guarda directo en el producto (sin variantes).</p></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock mínimo</label><input${ssrRenderAttr("value", form.stock_minimum)} type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Categoría</label>`);
      if (loadingCategories.value) {
        _push(`<div class="h-10 rounded-xl border border-slate-200 bg-slate-100 animate-pulse"></div>`);
      } else {
        _push(`<select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, "") : ssrLooseEqual(form.category, "")) ? " selected" : ""}>Sin categoría</option><!--[-->`);
        ssrRenderList(availableCategories.value, (cat) => {
          _push(`<option${ssrRenderAttr("value", cat.id || cat.slug)}${ssrIncludeBooleanAttr(Array.isArray(form.category) ? ssrLooseContain(form.category, cat.id || cat.slug) : ssrLooseEqual(form.category, cat.id || cat.slug)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
        });
        _push(`<!--]--></select>`);
      }
      if (categoriesError.value) {
        _push(`<p class="text-xs text-red-600">${ssrInterpolate(categoriesError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><label class="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800"><input${ssrIncludeBooleanAttr(Array.isArray(form.product_of_week) ? ssrLooseContain(form.product_of_week, null) : form.product_of_week) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-emerald-600"><span>Agregar a destacados de la semana</span></label><label class="flex items-center gap-3 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-800"><input${ssrIncludeBooleanAttr(Array.isArray(form.free_shipping) ? ssrLooseContain(form.free_shipping, null) : form.free_shipping) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-sky-600"><span>Este producto tiene envío gratis</span></label></div><div class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div class="flex items-center justify-between"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Etiquetas y detalles</p><h3 class="text-sm font-semibold text-slate-800">Ajusta etiquetas y atributos según la categoría</h3></div></div><div class="space-y-2"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Etiquetas (opcional)</label><input${ssrRenderAttr("value", form.tagsInput)} type="text" placeholder="Ej: envío gratis, nuevo, eco" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Se separan por coma y se guardan con los atributos internos.</p></div>`);
      if (isClothing.value) {
        _push(`<div class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Ropa</p><div class="grid gap-3 md:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla base</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, "") : ssrLooseEqual(categoryAttrs.size, "")) ? " selected" : ""}>Selecciona talla</option><!--[-->`);
        ssrRenderList(sizeOptions, (size) => {
          _push(`<option${ssrRenderAttr("value", size)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, size) : ssrLooseEqual(categoryAttrs.size, size)) ? " selected" : ""}>${ssrInterpolate(size)}</option>`);
        });
        _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de prenda</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.clothingType) ? ssrLooseContain(categoryAttrs.clothingType, "") : ssrLooseEqual(categoryAttrs.clothingType, "")) ? " selected" : ""}>Selecciona tipo</option><!--[-->`);
        ssrRenderList(["Camisa", "Pantalón", "Vestido", "Chaqueta", "Sudadera", "Short", "Falda", "Accesorio"], (type) => {
          _push(`<option${ssrRenderAttr("value", type)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.clothingType) ? ssrLooseContain(categoryAttrs.clothingType, type) : ssrLooseEqual(categoryAttrs.clothingType, type)) ? " selected" : ""}>${ssrInterpolate(type)}</option>`);
        });
        _push(`<!--]--></select></div></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, "") : ssrLooseEqual(categoryAttrs.audience, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
        ssrRenderList(["Niño", "Niña", "Mujer", "Hombre", "Unisex"], (aud) => {
          _push(`<option${ssrRenderAttr("value", aud)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, aud) : ssrLooseEqual(categoryAttrs.audience, aud)) ? " selected" : ""}>${ssrInterpolate(aud)}</option>`);
        });
        _push(`<!--]--></select></div><div class="space-y-2"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock por talla</p><div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3"><!--[-->`);
        ssrRenderList(sizeOptions, (size) => {
          _push(`<div class="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><label class="font-semibold text-slate-700">${ssrInterpolate(size)}</label><input type="number" min="0" class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right"${ssrRenderAttr("value", sizeStock[size])}></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isTech.value) {
        _push(`<div class="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Tecnología</p><textarea rows="3" placeholder="Ej: 16GB RAM, 512GB SSD, Pantalla 144Hz" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(categoryAttrs.techSpecs)}</textarea><p class="text-xs text-slate-500">Se guardan como etiqueta interna &quot;specs:&quot;.</p><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label><input${ssrRenderAttr("value", categoryAttrs.brand)} type="text" placeholder="Ej: Samsung, Apple" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isShoes.value) {
        _push(`<div class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Calzado</p><div class="grid gap-3 md:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (EU)</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, "") : ssrLooseEqual(categoryAttrs.size, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
        ssrRenderList(shoeSizesEU, (size) => {
          _push(`<option${ssrRenderAttr("value", `EU-${size}`)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.size) ? ssrLooseContain(categoryAttrs.size, `EU-${size}`) : ssrLooseEqual(categoryAttrs.size, `EU-${size}`)) ? " selected" : ""}>EU ${ssrInterpolate(size)}</option>`);
        });
        _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (US)</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.shoeSizeUS) ? ssrLooseContain(categoryAttrs.shoeSizeUS, "") : ssrLooseEqual(categoryAttrs.shoeSizeUS, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
        ssrRenderList(shoeSizesUS, (size) => {
          _push(`<option${ssrRenderAttr("value", `US-${size}`)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.shoeSizeUS) ? ssrLooseContain(categoryAttrs.shoeSizeUS, `US-${size}`) : ssrLooseEqual(categoryAttrs.shoeSizeUS, `US-${size}`)) ? " selected" : ""}>US ${ssrInterpolate(size)}</option>`);
        });
        _push(`<!--]--></select></div></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, "") : ssrLooseEqual(categoryAttrs.audience, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
        ssrRenderList(["Niño", "Niña", "Mujer", "Hombre", "Unisex"], (aud) => {
          _push(`<option${ssrRenderAttr("value", aud)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.audience) ? ssrLooseContain(categoryAttrs.audience, aud) : ssrLooseEqual(categoryAttrs.audience, aud)) ? " selected" : ""}>${ssrInterpolate(aud)}</option>`);
        });
        _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label><input${ssrRenderAttr("value", categoryAttrs.brand)} type="text" placeholder="Ej: Nike, Adidas" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isHome.value) {
        _push(`<div class="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Hogar y decoración</p><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Espacio</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.homeSpace) ? ssrLooseContain(categoryAttrs.homeSpace, "") : ssrLooseEqual(categoryAttrs.homeSpace, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
        ssrRenderList(["Sala", "Cocina", "Habitación", "Baño", "Exterior", "Oficina"], (room) => {
          _push(`<option${ssrRenderAttr("value", room)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.homeSpace) ? ssrLooseContain(categoryAttrs.homeSpace, room) : ssrLooseEqual(categoryAttrs.homeSpace, room)) ? " selected" : ""}>${ssrInterpolate(room)}</option>`);
        });
        _push(`<!--]--></select></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isFood.value) {
        _push(`<div class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Alimentos y bebidas</p><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo</label><input${ssrRenderAttr("value", categoryAttrs.foodType)} type="text" placeholder="Ej: Snacks, Granos, Bebida" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Peso/volumen</label><input${ssrRenderAttr("value", categoryAttrs.foodSize)} type="text" placeholder="Ej: 500g, 1L" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isPet.value) {
        _push(`<div class="space-y-3 rounded-xl border border-slate-100 bg-slate-50 p-3"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Mascotas (accesorios y ropa)</p><div class="grid gap-3 md:grid-cols-2"><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de mascota</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petType) ? ssrLooseContain(categoryAttrs.petType, "") : ssrLooseEqual(categoryAttrs.petType, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
        ssrRenderList(["Perro", "Gato", "Ave", "Pez", "Roedor"], (pet) => {
          _push(`<option${ssrRenderAttr("value", pet)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petType) ? ssrLooseContain(categoryAttrs.petType, pet) : ssrLooseEqual(categoryAttrs.petType, pet)) ? " selected" : ""}>${ssrInterpolate(pet)}</option>`);
        });
        _push(`<!--]--></select></div><div class="space-y-1"><label class="text-xs uppercase tracking-[0.2em] text-slate-500">Artículo</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value=""${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petItemType) ? ssrLooseContain(categoryAttrs.petItemType, "") : ssrLooseEqual(categoryAttrs.petItemType, "")) ? " selected" : ""}>Selecciona</option><!--[-->`);
        ssrRenderList(["Accesorio", "Ropa", "Juguete", "Cama"], (item) => {
          _push(`<option${ssrRenderAttr("value", item)}${ssrIncludeBooleanAttr(Array.isArray(categoryAttrs.petItemType) ? ssrLooseContain(categoryAttrs.petItemType, item) : ssrLooseEqual(categoryAttrs.petItemType, item)) ? " selected" : ""}>${ssrInterpolate(item)}</option>`);
        });
        _push(`<!--]--></select></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex flex-wrap items-center gap-3"><button class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow" style="${ssrRenderStyle({ backgroundColor: accentColor.value })}"${ssrIncludeBooleanAttr(!canSubmit.value) ? " disabled" : ""}>${ssrInterpolate(saving.value ? "Guardando..." : "Guardar producto")}</button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${unref(slug)}/productos`,
        class: "rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cancelar `);
          } else {
            return [
              createTextVNode(" Cancelar ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (message.value) {
        _push(`<p class="${ssrRenderClass([messageStatus.value === "error" ? "text-red-600" : "text-emerald-600", "text-sm"])}">${ssrInterpolate(message.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/productos/crear.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=crear-BsEx1AQo.mjs.map
