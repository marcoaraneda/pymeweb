import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, computed, reactive, ref, watch, mergeProps, withCtx, createTextVNode, createVNode, toDisplayString, unref, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { P as ProductCard } from './ProductCard-Bc3E-sgC.mjs';
import { Store, CheckCircle2, Palette, Share2, Phone, Instagram, Facebook, Music2, Youtube, Tags, Sparkles, Search } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
import { u as useCartStore } from './cart-fX2c5KSU.mjs';
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
import './useFavorites-BLT7MOEn.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const categoryRowsPerPage = 4;
const featuredPerPage = 6;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const slug = computed(() => route.params.slug);
    const tenantStore = useTenantStore();
    useCartStore();
    const theme = useThemeStore();
    const auth = useAuthStore();
    const { getProductImage } = useImages();
    const config = useRuntimeConfig();
    const makeEmptyBranch = () => ({
      label: "",
      street: "",
      number: "",
      comuna: "",
      region: ""
    });
    const storeForm = reactive({
      name: "",
      slug: "",
      store_type: "retail",
      home_hero_title: "",
      home_hero_subtitle: "",
      home_featured_title: "",
      home_featured_subtitle: "",
      home_catalog_title: "",
      home_catalog_subtitle: "",
      hero_pattern_enabled: true,
      hero_pattern_style: "type",
      logo_url: "",
      description: "",
      about: "",
      about_who_we_are: "",
      about_history: "",
      about_mission: "",
      about_extra: "",
      contact_email: "",
      phone: "",
      whatsapp: "",
      address: "",
      branch_locations: [makeEmptyBranch()],
      delivery_fee_mode: "at_dispatch",
      shipping_base_fee: "",
      shipping_per_item_fee: "",
      shipping_free_over: "",
      pickup_skip_queue_enabled: true,
      cart_enabled: true,
      whatsapp_sales_enabled: true,
      pickup_instructions: "",
      menu_file_url: "",
      menu_file_kind: "",
      menu_cover_image_url: "",
      menu_pages: [],
      extra_size_large_price: "",
      extra_fries_medium_price: "",
      extra_fries_large_price: "",
      extra_drink_price: "",
      extra_sauce_price: "",
      social_instagram: "",
      social_facebook: "",
      social_tiktok: "",
      social_youtube: ""
    });
    const themeForm = reactive({ accent_color: "", gradient_from: "", gradient_to: "", banner_url: "" });
    const pendingTheme = reactive({ accent_color: "", gradient_from: "", gradient_to: "", banner_url: "" });
    const customAccent = ref("#2563eb");
    watch(customAccent, (value) => {
      const next = normalizedColor(value, pendingTheme.accent_color || "#2563eb");
      pendingTheme.accent_color = next;
      themeForm.accent_color = next;
    });
    const showStoreForm = ref(false);
    const showHomeCopyForm = ref(false);
    const homeCopyFocus = ref("hero");
    const savingHomeCopy = ref(false);
    const homeCopyStatus = ref("ok");
    const homeCopyMessage = ref("");
    const homeCopyEditorTitle = computed(() => {
      if (homeCopyFocus.value === "featured") return "Editar destacados";
      if (homeCopyFocus.value === "catalog") return "Editar catálogo";
      return "Editar portada principal";
    });
    const homeCopyEditorDescription = computed(() => {
      if (homeCopyFocus.value === "featured") return "Modifica el título y subtítulo de la sección de destacados.";
      if (homeCopyFocus.value === "catalog") return "Modifica el título y subtítulo de la sección de catálogo.";
      return "Modifica el título y subtítulo principales del hero de la tienda.";
    });
    const activeEditTab = ref("general");
    const updatingStore = ref(false);
    const syncingCategories = ref(false);
    const updateMessage = ref("");
    const updateStatus = ref("ok");
    const savingPayout = ref(false);
    const payoutStatus = ref("ok");
    const payoutMessage = ref("");
    const payoutConfigured = ref(false);
    const payoutVerificationStatus = ref("");
    const payoutAvailableMethods = ref([]);
    const payoutForm = reactive({
      payout_method_id: 0,
      provider: "paypal",
      account_email: "",
      account_holder_name: "",
      account_number_last4: "",
      bank_name: "",
      account_type: ""
    });
    const quickMediaItems = ref([]);
    const quickMediaDraft = ref([]);
    const activeQuickMediaIndex = ref(0);
    ref(null);
    ref(null);
    ref(false);
    const activeMenuPageIndex = ref(0);
    const showQuickMediaMenu = ref(false);
    const shouldAutoOpen = computed(() => {
      const edit = route.query.edit;
      return edit === "true" || edit === "1" || edit === "yes";
    });
    const hasText = (value) => String(value || "").trim().length > 0;
    const normalizeMenuPages = (value) => {
      const pages = Array.isArray(value) ? value : [];
      const sanitized = pages.filter((page) => page?.url).slice(0, 12).map((page, index) => ({
        id: String(page?.id || `${Date.now()}-${index}`),
        url: String(page.url),
        label: String(page?.label || "")
      }));
      if (sanitized.length) return sanitized;
      if (tenantStore.data?.menu_file_url) {
        return [{ id: "legacy-menu", url: String(tenantStore.data?.menu_file_url), label: "Carta principal" }];
      }
      return [];
    };
    const menuPages = computed(() => normalizeMenuPages(tenantStore.data?.menu_pages));
    const hasMenuPages = computed(() => menuPages.value.length > 0);
    const menuPageCount = computed(() => menuPages.value.length);
    const storeWhatsAppRaw = computed(() => String(tenantStore.data?.whatsapp || tenantStore.data?.phone || "").trim());
    const storeWhatsAppDigits = computed(() => storeWhatsAppRaw.value.replace(/[^\d]/g, ""));
    const hasStoreWhatsApp = computed(() => storeWhatsAppDigits.value.length > 0);
    const showWhatsAppCTA = computed(() => {
      const enabled = tenantStore.data?.whatsapp_sales_enabled;
      const hasToggle = enabled === void 0 || enabled === null ? true : Boolean(enabled);
      return hasToggle && hasStoreWhatsApp.value;
    });
    const storeWhatsAppDisplay = computed(() => storeWhatsAppRaw.value || "No configurado");
    const storeWhatsAppUrl = computed(() => {
      if (!hasStoreWhatsApp.value) return "#";
      const storeName = String(tenantStore.data?.name || "la tienda");
      const msg = encodeURIComponent(`Hola, quiero agendar un pedido en ${storeName}.`);
      return `https://wa.me/${storeWhatsAppDigits.value}?text=${msg}`;
    });
    const hasAnyBranchData = computed(
      () => storeForm.branch_locations.some(
        (branch) => [branch.street, branch.number, branch.comuna, branch.region].some((value) => hasText(value))
      )
    );
    const payoutProviderLabel = computed(() => {
      const provider = String(payoutForm.provider || "").toLowerCase();
      if (provider === "paypal") return "PayPal";
      if (provider === "card") return "Webpay / Tarjeta";
      if (provider === "bank_transfer") return "Transferencia";
      return "Sin definir";
    });
    const payoutStatusLabel = computed(() => {
      if (!payoutConfigured.value) return "Sin configurar";
      if (payoutVerificationStatus.value === "verified") return "Verificada";
      if (payoutVerificationStatus.value === "rejected") return "Rechazada";
      return "Pendiente de verificación";
    });
    const payoutStatusPillClass = computed(() => {
      if (!payoutConfigured.value) return "bg-slate-100 text-slate-700";
      if (payoutVerificationStatus.value === "verified") return "bg-emerald-100 text-emerald-700";
      if (payoutVerificationStatus.value === "rejected") return "bg-rose-100 text-rose-700";
      return "bg-amber-100 text-amber-700";
    });
    const parseAboutSections = (raw) => {
      const text = String(raw || "").trim();
      if (!text) {
        return {
          who: "",
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
      const normalized = text.replace(/\r\n/g, "\n").replace(/^##\s*Quiénes\s+somos\s*$/im, "##QUIENES").replace(/^##\s*Nuestra\s+historia\s*$/im, "##HISTORIA").replace(/^##\s*Misión\s+y\s+visión\s*$/im, "##MISION");
      const chunks = normalized.split(/##(QUIENES|HISTORIA|MISION)\n?/);
      if (chunks.length === 1) {
        sections.who = text;
        return sections;
      }
      for (let i = 1; i < chunks.length; i += 2) {
        const key = chunks[i];
        const value = String(chunks[i + 1] || "").trim();
        if (key === "QUIENES") sections.who = value;
        if (key === "HISTORIA") sections.history = value;
        if (key === "MISION") sections.mission = value;
      }
      return sections;
    };
    const tabCompletion = computed(() => {
      const generalDone = [
        hasText(storeForm.name),
        hasText(storeForm.slug),
        hasText(storeForm.store_type),
        hasText(storeForm.description),
        hasText(storeForm.logo_url)
      ].filter(Boolean).length;
      const aboutDone = [
        hasText(storeForm.about_who_we_are),
        hasText(storeForm.about_history),
        hasText(storeForm.about_mission),
        hasAnyBranchData.value
      ].filter(Boolean).length;
      const designDone = [
        hasText(storeForm.hero_pattern_style),
        hasText(pendingTheme.banner_url),
        hasText(pendingTheme.accent_color),
        hasText(pendingTheme.gradient_from),
        hasText(pendingTheme.gradient_to),
        quickMediaDraft.value.length > 0,
        storeForm.menu_pages.length > 0 || hasText(storeForm.menu_file_url)
      ].filter(Boolean).length;
      const contactDone = [
        hasText(storeForm.contact_email),
        hasText(storeForm.phone),
        hasText(storeForm.whatsapp),
        hasText(storeForm.address),
        hasText(storeForm.social_instagram),
        hasText(storeForm.social_facebook),
        hasText(storeForm.social_tiktok),
        hasText(storeForm.social_youtube)
      ].filter(Boolean).length;
      const accountDone = [
        hasText(payoutForm.provider),
        payoutForm.provider === "paypal" ? hasText(payoutForm.account_email) : hasText(payoutForm.account_number_last4),
        hasText(payoutForm.account_holder_name)
      ].filter(Boolean).length;
      return {
        general: {
          label: `${generalDone}/5`,
          completed: generalDone === 5
        },
        about: {
          label: `${aboutDone}/4`,
          completed: aboutDone === 4
        },
        design: {
          label: `${designDone}/7`,
          completed: designDone === 7
        },
        contact: {
          label: `${contactDone}/8`,
          completed: contactDone === 8
        },
        account: {
          label: `${accountDone}/3`,
          completed: accountDone === 3
        }
      };
    });
    const authedFetch = async (url, options = {}) => {
      if (!auth.token) throw new Error("No autenticado");
      const doFetch = (token) => $fetch(url, {
        ...options,
        headers: {
          ...options.headers || {},
          Authorization: `Bearer ${token}`
        }
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
    const applyPayoutAccount = (account) => {
      payoutForm.payout_method_id = Number(account?.payout_method?.id || 0);
      payoutForm.provider = String(account?.provider || "paypal");
      payoutForm.account_email = String(account?.account_email || "");
      payoutForm.account_holder_name = String(account?.account_holder_name || "");
      payoutForm.account_number_last4 = String(account?.account_number_last4 || "");
      payoutForm.bank_name = String(account?.bank_name || "");
      payoutForm.account_type = String(account?.account_type || "");
      payoutVerificationStatus.value = String(account?.verification_status || "");
    };
    const loadPayoutAccountForStore = async () => {
      if (!canEditTheme.value || !auth.token) return;
      try {
        const data = await authedFetch(`${config.public.apiBase}/store/${slug.value}/admin/payments/payout-account/`);
        payoutConfigured.value = Boolean(data?.configured);
        payoutAvailableMethods.value = Array.isArray(data?.available_methods) ? data.available_methods : [];
        if (payoutConfigured.value) {
          applyPayoutAccount(data?.account || {});
        } else {
          applyPayoutAccount({ provider: "paypal" });
        }
      } catch {
        payoutConfigured.value = false;
      }
    };
    const palette = [
      "#2563eb",
      // azul
      "#16a34a",
      // verde
      "#f59e0b",
      // ámbar
      "#e11d48",
      // rosa/rojo
      "#7c3aed",
      // violeta
      "#0ea5e9",
      // celeste
      "#f97316",
      // naranjo
      "#10b981",
      // esmeralda
      "#9333ea",
      // púrpura profundo
      "#0d9488",
      // teal oscuro
      "#64748b",
      // slate
      "#111827"
      // negro grafito
    ];
    const gradients = [
      { from: "#0f172a", to: "#0b2358" },
      { from: "#0b3b2e", to: "#0f766e" },
      { from: "#2b0b3f", to: "#7c3aed" },
      { from: "#3b0a1a", to: "#e11d48" },
      { from: "#1d4ed8", to: "#06b6d4" },
      { from: "#15803d", to: "#84cc16" },
      { from: "#c2410c", to: "#f97316" },
      { from: "#7c2d12", to: "#f59e0b" },
      { from: "#312e81", to: "#9333ea" }
    ];
    const patternOptions = [
      { value: "type", label: "Según tipo de tienda" },
      { value: "diagonal", label: "Barritas diagonales" },
      { value: "vertical", label: "Barritas verticales" },
      { value: "circles", label: "Círculos" },
      { value: "waves", label: "Ondas" },
      { value: "fine_grid", label: "Rejilla fina" },
      { value: "small_dots", label: "Puntos pequeños" },
      { value: "zigzag", label: "Zigzag" },
      { value: "soft_noise", label: "Noise suave" },
      { value: "double_diagonal", label: "Doble diagonal" },
      { value: "none", label: "Sin patrón (color sólido)" }
    ];
    const isHexColor = (value) => /^#[0-9a-fA-F]{6}$/.test(String(value || ""));
    const normalizedColor = (value, fallback = "#2563eb") => isHexColor(value) ? String(value) : fallback;
    const hexToRgba = (hex, alpha) => {
      const safe = normalizedColor(hex);
      const clean = safe.replace("#", "");
      const r = parseInt(clean.slice(0, 2), 16);
      const g = parseInt(clean.slice(2, 4), 16);
      const b = parseInt(clean.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    const previewAccent = computed(() => normalizedColor(pendingTheme.accent_color || themeForm.accent_color || theme.accent, "#2563eb"));
    const previewGradientFrom = computed(() => normalizedColor(pendingTheme.gradient_from || themeForm.gradient_from || theme.gradientFrom, "#111827"));
    const previewGradientTo = computed(() => normalizedColor(pendingTheme.gradient_to || themeForm.gradient_to || theme.gradientTo, "#0b2358"));
    const accentColor = computed(() => showStoreForm.value ? previewAccent.value : theme.accent || "#2563eb");
    const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: "#fff" }));
    const cloudinaryUploadUrl = computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    const storeType = computed(() => String(tenantStore.data?.store_type || storeForm.store_type || "retail"));
    const hasMenuSupport = computed(() => {
      return ["fast_food", "bakery"].includes(storeType.value);
    });
    const typeContent = computed(() => {
      const byType = {
        retail: {
          featuredTitle: "Ofertas relámpago: precios que vuelan",
          featuredSubtitle: "Selección curada para comprar rápido, ahorrar más y llevarte lo mejor hoy.",
          catalogTitle: "Compra por categoría como en una tienda grande",
          catalogSubtitle: "Navega por líneas especializadas y descubre productos ganadores en cada sección.",
          rowClass: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          shellClass: "bg-slate-50",
          heroClass: "",
          heroPattern: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.13), transparent 42%)",
          heroBadgeLabel: "Retail en vivo",
          heroBadgeClass: "border-white/20 bg-white/10 text-white",
          primaryCtaLabel: "Ver catálogo",
          secondaryCtaLabel: "Ofertas y destacados",
          chipOne: "Pago seguro",
          chipTwo: "Envíos rápidos",
          quickGlowClass: "bg-white/10",
          quickPanelClass: "border-white/15 bg-white/10"
        },
        fast_food: {
          featuredTitle: "Combos calientes listos para pedir",
          featuredSubtitle: "Prioriza tiempos de despacho y productos de alta rotación por franja horaria.",
          catalogTitle: "Arma tu pedido por secciones del menú",
          catalogSubtitle: "Desde hamburguesas y papas hasta bebidas, todo ordenado para comprar en segundos.",
          rowClass: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          shellClass: "bg-slate-50",
          heroClass: "from-[#2b1200] to-[#7a2f00]",
          heroPattern: "repeating-linear-gradient(135deg, rgba(255,158,27,0.16) 0px, rgba(255,158,27,0.16) 10px, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 20px)",
          heroBadgeLabel: "Comida rápida",
          heroBadgeClass: "border-amber-200/40 bg-amber-200/20 text-amber-100",
          primaryCtaLabel: "Ver menú",
          secondaryCtaLabel: "Combos y promos",
          chipOne: "Despacho express",
          chipTwo: "Combos del día",
          quickGlowClass: "bg-amber-300/20",
          quickPanelClass: "border-amber-100/35 bg-black/20"
        },
        bakery: {
          featuredTitle: "Lo recién horneado de hoy",
          featuredSubtitle: "Destaca productos frescos del día y promociones por hora para subir conversiones.",
          catalogTitle: "Vitrina dulce por especialidad",
          catalogSubtitle: "Tortas, pasteles, galletas y más, agrupados para una experiencia pastelera clara.",
          rowClass: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          shellClass: "bg-slate-50",
          heroClass: "from-[#3d1020] to-[#7a2d48]",
          heroPattern: "radial-gradient(circle at 25% 25%, rgba(255,201,217,0.22), transparent 36%), radial-gradient(circle at 80% 55%, rgba(255,235,205,0.18), transparent 44%)",
          heroBadgeLabel: "Pastelería artesanal",
          heroBadgeClass: "border-rose-200/40 bg-rose-200/20 text-rose-100",
          primaryCtaLabel: "Ver vitrina dulce",
          secondaryCtaLabel: "Novedades del horno",
          chipOne: "Recién horneado",
          chipTwo: "Pedidos por encargo",
          quickGlowClass: "bg-rose-300/20",
          quickPanelClass: "border-rose-100/30 bg-black/20"
        },
        pharmacy: {
          featuredTitle: "Promociones clave para tu bienestar",
          featuredSubtitle: "Exhibe productos esenciales y campañas estacionales con prioridad.",
          catalogTitle: "Encuentra por categoría de cuidado",
          catalogSubtitle: "Higiene, vitaminas, cuidado personal y más en una navegación simple y rápida.",
          rowClass: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          shellClass: "bg-slate-50",
          heroClass: "from-[#052a34] to-[#0b5f73]",
          heroPattern: "linear-gradient(90deg, rgba(179,241,255,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(179,241,255,0.08) 1px, transparent 1px)",
          heroBadgeLabel: "Farmacia y bienestar",
          heroBadgeClass: "border-cyan-200/40 bg-cyan-200/20 text-cyan-100",
          primaryCtaLabel: "Ver categorías de salud",
          secondaryCtaLabel: "Promos esenciales",
          chipOne: "Compra segura",
          chipTwo: "Entrega prioritaria",
          quickGlowClass: "bg-cyan-300/20",
          quickPanelClass: "border-cyan-100/30 bg-black/20"
        },
        fashion: {
          featuredTitle: "Looks destacados de la temporada",
          featuredSubtitle: "Impulsa colecciones y novedades con foco visual orientado a estilo.",
          catalogTitle: "Compra por línea y marca",
          catalogSubtitle: "Ropa, calzado y accesorios en bloques visuales inspirados en catálogos de moda.",
          rowClass: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          shellClass: "bg-slate-50",
          heroClass: "from-[#1d1029] to-[#5b2d84]",
          heroPattern: "radial-gradient(circle at 15% 30%, rgba(248,208,255,0.18), transparent 35%), repeating-linear-gradient(120deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 6px, transparent 6px, transparent 16px)",
          heroBadgeLabel: "Moda y tendencia",
          heroBadgeClass: "border-fuchsia-200/40 bg-fuchsia-200/20 text-fuchsia-100",
          primaryCtaLabel: "Ver colección",
          secondaryCtaLabel: "Looks destacados",
          chipOne: "Nuevos ingresos",
          chipTwo: "Drops semanales",
          quickGlowClass: "bg-fuchsia-300/20",
          quickPanelClass: "border-fuchsia-100/30 bg-black/20"
        },
        bookstore: {
          featuredTitle: "Recomendados que no te puedes perder",
          featuredSubtitle: "Destaca novedades, best sellers y packs para aumentar ticket promedio.",
          catalogTitle: "Explora por género y editorial",
          catalogSubtitle: "Una estantería digital ordenada para descubrir lecturas rápido.",
          rowClass: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm",
          shellClass: "bg-slate-50",
          heroClass: "from-[#161b3b] to-[#2d3f8a]",
          heroPattern: "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 18px)",
          heroBadgeLabel: "Librería digital",
          heroBadgeClass: "border-indigo-200/40 bg-indigo-200/20 text-indigo-100",
          primaryCtaLabel: "Explorar estantería",
          secondaryCtaLabel: "Recomendados",
          chipOne: "Curado por género",
          chipTwo: "Novedades editoriales",
          quickGlowClass: "bg-indigo-300/20",
          quickPanelClass: "border-indigo-100/30 bg-black/20"
        }
      };
      return byType[storeType.value] || byType.retail;
    });
    const storeHomeCopy = computed(() => {
      const raw = tenantStore.data?.home_copy;
      if (!raw || typeof raw !== "object") return {};
      return raw;
    });
    const heroTitle = computed(() => {
      const custom = String(storeHomeCopy.value.hero_title || "").trim();
      return custom || tenantStore.data?.name || "Tu tienda online";
    });
    const heroDescription = computed(() => {
      const custom = String(storeHomeCopy.value.hero_subtitle || "").trim();
      if (custom) return custom;
      return tenantStore.data?.description || "Explora un catálogo curado con envíos rápidos y una experiencia pensada para conversión. Personaliza el acento visual para alinear la tienda a tu marca.";
    });
    const featuredTitle = computed(() => {
      const custom = String(storeHomeCopy.value.featured_title || "").trim();
      return custom || typeContent.value?.featuredTitle || "Productos destacados";
    });
    const featuredSubtitle = computed(() => {
      const custom = String(storeHomeCopy.value.featured_subtitle || "").trim();
      return custom || typeContent.value?.featuredSubtitle || "Muestra lo mejor de tu tienda.";
    });
    const catalogTitle = computed(() => {
      const custom = String(storeHomeCopy.value.catalog_title || "").trim();
      return custom || typeContent.value?.catalogTitle || "Catálogo";
    });
    const catalogSubtitle = computed(() => {
      const custom = String(storeHomeCopy.value.catalog_subtitle || "").trim();
      return custom || typeContent.value?.catalogSubtitle || "Explora productos por categoría.";
    });
    const catalogRowClass = computed(() => typeContent.value?.rowClass || "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm");
    const pageShellClass = computed(() => typeContent.value?.shellClass || "bg-slate-50");
    const defaultPatternByType = computed(() => typeContent.value?.heroPattern || "none");
    const customPatternMap = {
      diagonal: "repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 10px, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 20px)",
      vertical: "repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 8px, rgba(0,0,0,0) 8px, rgba(0,0,0,0) 16px)",
      circles: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.16), transparent 38%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.12), transparent 42%)",
      waves: "radial-gradient(120% 90% at 0% 100%, rgba(255,255,255,0.14) 0 36%, transparent 37%), radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,0.10) 0 34%, transparent 35%)",
      fine_grid: "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
      small_dots: "radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px)",
      zigzag: "repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0 8px, transparent 8px 16px), repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)",
      soft_noise: "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.08), transparent 20%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.06), transparent 22%), radial-gradient(circle at 35% 75%, rgba(255,255,255,0.07), transparent 18%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05), transparent 20%)",
      double_diagonal: "repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0 10px, transparent 10px 20px), repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 10px, transparent 10px 20px)"
    };
    const selectedPatternStyle = computed(() => {
      const raw = showStoreForm.value ? String(storeForm.hero_pattern_style || "type") : String(tenantStore.data?.hero_pattern_style || "type");
      if (raw === "none") return "none";
      if (raw === "type") return defaultPatternByType.value;
      return customPatternMap[raw] || defaultPatternByType.value;
    });
    const selectedPatternKey = computed(() => {
      const raw = showStoreForm.value ? String(storeForm.hero_pattern_style || "type") : String(tenantStore.data?.hero_pattern_style || "type");
      if (raw !== "type") return raw;
      return storeType.value === "bakery" ? "circles" : "type";
    });
    const isCirclesPatternActive = computed(() => heroPatternEnabled.value && selectedPatternKey.value === "circles");
    const heroPatternStyle = computed(() => ({ backgroundImage: heroPatternEnabled.value ? selectedPatternStyle.value : "none" }));
    const heroBadgeLabel = computed(() => typeContent.value?.heroBadgeLabel || "Tienda online");
    const primaryCtaLabel = computed(() => typeContent.value?.primaryCtaLabel || "Ver catálogo");
    const secondaryCtaLabel = computed(() => typeContent.value?.secondaryCtaLabel || "Destacados");
    const chipOne = computed(() => typeContent.value?.chipOne || "Promociones");
    const chipTwo = computed(() => typeContent.value?.chipTwo || "Compra rápida");
    const pageShellStyle = computed(() => ({
      backgroundImage: `radial-gradient(circle at 15% 0%, ${hexToRgba(accentColor.value, 0.08)}, transparent 42%)`
    }));
    const heroPatternEnabled = computed(() => {
      if (showStoreForm.value) return String(storeForm.hero_pattern_style || "type") !== "none";
      return tenantStore.data?.hero_pattern_enabled ?? true;
    });
    const heroSectionStyle = computed(() => ({
      backgroundImage: `linear-gradient(120deg, ${showStoreForm.value ? previewGradientFrom.value : theme.gradientFrom}, ${showStoreForm.value ? previewGradientTo.value : theme.gradientTo})`
    }));
    const heroBadgeStyle = computed(() => ({
      borderColor: hexToRgba(accentColor.value, 0.5),
      backgroundColor: hexToRgba(accentColor.value, 0.22),
      color: "#ffffff"
    }));
    const quickGlowStyle = computed(() => ({
      backgroundColor: hexToRgba(accentColor.value, 0.24)
    }));
    const quickPanelStyle = computed(() => ({
      borderColor: hexToRgba(accentColor.value, 0.35),
      backgroundColor: "rgba(255,255,255,0.12)"
    }));
    const priceTextStyle = computed(() => ({ color: accentColor.value }));
    const categoryCountStyle = computed(() => ({ backgroundColor: `${accentColor.value}22`, color: accentColor.value }));
    const catalogCardStyle = computed(() => ({ borderColor: `${accentColor.value}33` }));
    const circlesDecorativeStyle = computed(() => {
      if (!isCirclesPatternActive.value) return {};
      return {
        backgroundImage: `radial-gradient(circle at 8% 12%, ${hexToRgba(accentColor.value, 0.1)}, transparent 35%), radial-gradient(circle at 92% 85%, ${hexToRgba(accentColor.value, 0.08)}, transparent 28%)`
      };
    });
    computed(() => ({
      backgroundColor: hexToRgba(accentColor.value, 0.14),
      border: `2px solid ${hexToRgba(accentColor.value, 0.3)}`
    }));
    const circlesBubbleTwoStyle = computed(() => ({
      backgroundColor: hexToRgba(accentColor.value, 0.1),
      border: `2px dashed ${hexToRgba(accentColor.value, 0.28)}`
    }));
    const heroBackgroundStyle = computed(() => {
      const banner = tenantStore.data?.banner_url || "";
      if (!banner) return {};
      return {
        backgroundImage: `linear-gradient(${hexToRgba(showStoreForm.value ? previewGradientFrom.value : theme.gradientFrom, 0.68)}, ${hexToRgba(showStoreForm.value ? previewGradientTo.value : theme.gradientTo, 0.72)}), url(${banner})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      };
    });
    const categoryLabel = (category) => typeof category === "string" ? category : category.name;
    const canEditTheme = computed(() => {
      const membershipRaw = auth.user?.memberships;
      const membership = Array.isArray(membershipRaw) ? membershipRaw : [];
      const ownsStore = membership.some((m) => {
        const rolesRaw = m?.roles;
        const roles = Array.isArray(rolesRaw) ? rolesRaw : [];
        const storeSlug = m?.store?.slug;
        const current = slug.value;
        return storeSlug?.toString().toLowerCase() === current?.toString().toLowerCase() && roles.map((r) => r?.toLowerCase?.()).some((r) => ["admin", "owner", "manager"].includes(r));
      });
      return ownsStore;
    });
    const safeProducts = computed(() => Array.isArray(tenantStore.productos) ? tenantStore.productos : []);
    const featuredProducts = computed(() => {
      const all = safeProducts.value;
      return all.filter((p) => Boolean(p?.is_featured));
    });
    const previewProducts = computed(() => safeProducts.value.slice(0, 2));
    const quickSlideCount = computed(() => 1 + quickMediaItems.value.length);
    const isProductsSlide = computed(() => activeQuickMediaIndex.value === 0);
    const activeQuickMedia = computed(() => {
      if (isProductsSlide.value) return null;
      return quickMediaItems.value[activeQuickMediaIndex.value - 1] || null;
    });
    const catalogCategories = computed(() => {
      const names = /* @__PURE__ */ new Set();
      safeProducts.value.forEach((p) => {
        const name = p?.category?.name || p?.category;
        if (name) names.add(name);
      });
      return Array.from(names).sort((a, b) => a.localeCompare(b));
    });
    const catalogCategory = ref("");
    const catalogQuery = ref("");
    const catalogSort = ref("");
    const catalogPage = ref(1);
    const featuredPage = ref(1);
    const filteredCatalog = computed(() => {
      let data = safeProducts.value;
      const query = catalogQuery.value.trim().toLowerCase();
      if (query) {
        data = data.filter((p) => {
          const name = String(p?.name || "").toLowerCase();
          const description = String(p?.description || "").toLowerCase();
          const category = String(p?.category?.name || p?.category || "").toLowerCase();
          return name.includes(query) || description.includes(query) || category.includes(query);
        });
      }
      if (catalogCategory.value) {
        data = data.filter((p) => (p?.category?.name || p?.category) === catalogCategory.value);
      }
      if (catalogSort.value) {
        data = [...data].sort((a, b) => {
          if (catalogSort.value === "az") {
            return String(a?.name || "").localeCompare(String(b?.name || ""));
          }
          if (catalogSort.value === "za") {
            return String(b?.name || "").localeCompare(String(a?.name || ""));
          }
          const pa = Number(a?.offer_price || a?.price || 0);
          const pb = Number(b?.offer_price || b?.price || 0);
          return catalogSort.value === "asc" ? pa - pb : pb - pa;
        });
      }
      return data;
    });
    const catalogRows = computed(() => {
      const grouped = /* @__PURE__ */ new Map();
      filteredCatalog.value.forEach((product) => {
        const category = String(product?.category?.name || product?.category || "General");
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category).push(product);
      });
      return Array.from(grouped.entries()).map(([category, products]) => {
        const byBrand = /* @__PURE__ */ new Map();
        products.forEach((product) => {
          const brand = String(product?.brand || "Otras marcas").trim() || "Otras marcas";
          if (!byBrand.has(brand)) byBrand.set(brand, []);
          byBrand.get(brand).push(product);
        });
        const brandGroups = Array.from(byBrand.entries()).map(([brand, items]) => ({
          brand,
          products: items.sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")))
        })).sort((a, b) => a.brand.localeCompare(b.brand));
        return { category, products, brandGroups };
      }).sort((a, b) => a.category.localeCompare(b.category));
    });
    const catalogTotalPages = computed(() => Math.max(1, Math.ceil(catalogRows.value.length / categoryRowsPerPage)));
    const paginatedCatalogRows = computed(() => {
      const start = (catalogPage.value - 1) * categoryRowsPerPage;
      return catalogRows.value.slice(start, start + categoryRowsPerPage);
    });
    const catalogPageStart = computed(() => catalogRows.value.length ? (catalogPage.value - 1) * categoryRowsPerPage + 1 : 0);
    const catalogPageEnd = computed(() => Math.min(catalogPage.value * categoryRowsPerPage, catalogRows.value.length));
    const getEffectivePrice = (product) => {
      const offer = Number(product?.offer_price || 0);
      if (offer > 0) return offer;
      return Number(product?.price || 0);
    };
    const getDiscountPercent = (product) => {
      const price = Number(product?.price || 0);
      const offer = Number(product?.offer_price || 0);
      if (!price || !offer || offer >= price) return 0;
      return Math.round((price - offer) / price * 100);
    };
    const formatCatalogPrice = (value) => new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(value) || 0);
    const getProductPath = (product) => {
      const id = product?.slug || product?.id;
      if (!id) return "/marketplace";
      if (product?.store?.slug && !product?.store_is_marketplace) return `/store/${product.store.slug}/productos/${id}`;
      return `/marketplace/productos/${id}`;
    };
    const featuredTotalPages = computed(() => Math.max(1, Math.ceil(featuredProducts.value.length / featuredPerPage)));
    const paginatedFeaturedProducts = computed(() => {
      const start = (featuredPage.value - 1) * featuredPerPage;
      return featuredProducts.value.slice(start, start + featuredPerPage);
    });
    const featuredPageStart = computed(() => featuredProducts.value.length ? (featuredPage.value - 1) * featuredPerPage + 1 : 0);
    const featuredPageEnd = computed(() => Math.min(featuredPage.value * featuredPerPage, featuredProducts.value.length));
    watch(
      () => pendingTheme.banner_url,
      (value) => {
        themeForm.banner_url = String(value || "");
      }
    );
    const setQuickMediaIndex = (index) => {
      const safe = Math.max(0, Math.min(index, quickSlideCount.value - 1));
      activeQuickMediaIndex.value = safe;
    };
    const startQuickMediaAutoplay = () => {
      return;
    };
    computed(() => {
      if (config.public.cloudinaryCloudName) {
        return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/auto/upload`;
      }
      if (cloudinaryUploadUrl.value) {
        return cloudinaryUploadUrl.value.replace("/image/upload", "/auto/upload").replace("/video/upload", "/auto/upload").replace("/raw/upload", "/auto/upload");
      }
      return "";
    });
    const sanitizeQuickMedia = (value) => {
      if (!Array.isArray(value)) return [];
      return value.filter((item) => item?.url && (item?.type === "image" || item?.type === "video")).slice(0, 7).map((item) => ({
        id: String(item?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
        type: item.type,
        url: String(item.url)
      }));
    };
    watch([catalogCategory, catalogSort, catalogQuery], () => {
      catalogPage.value = 1;
    });
    watch(filteredCatalog, () => {
      if (catalogPage.value > catalogTotalPages.value) catalogPage.value = catalogTotalPages.value;
    });
    watch(featuredProducts, () => {
      if (featuredPage.value > featuredTotalPages.value) featuredPage.value = featuredTotalPages.value;
    });
    const maybeOpenEdit = () => {
      if (shouldAutoOpen.value && canEditTheme.value) {
        showStoreForm.value = true;
      }
    };
    const loadData = async () => {
      tenantStore.setSlug(slug.value);
      await Promise.all([tenantStore.fetchTienda(), tenantStore.fetchProductos()]);
    };
    const hydrateForm = () => {
      const data = tenantStore.data || {};
      const homeCopy = data.home_copy && typeof data.home_copy === "object" ? data.home_copy : {};
      const branches = Array.isArray(data.branch_locations) ? data.branch_locations : [];
      storeForm.name = data.name || "";
      storeForm.slug = data.slug || slug.value || "";
      storeForm.store_type = data.store_type || "retail";
      storeForm.home_hero_title = String(homeCopy.hero_title || "");
      storeForm.home_hero_subtitle = String(homeCopy.hero_subtitle || "");
      storeForm.home_featured_title = String(homeCopy.featured_title || "");
      storeForm.home_featured_subtitle = String(homeCopy.featured_subtitle || "");
      storeForm.home_catalog_title = String(homeCopy.catalog_title || "");
      storeForm.home_catalog_subtitle = String(homeCopy.catalog_subtitle || "");
      storeForm.hero_pattern_enabled = data.hero_pattern_enabled ?? true;
      storeForm.hero_pattern_style = data.hero_pattern_style || "type";
      storeForm.logo_url = data.logo_url || data.logo || "";
      storeForm.description = data.description || "";
      storeForm.about = data.about || data.about_us || data.about_text || "";
      const aboutSections = parseAboutSections(storeForm.about);
      storeForm.about_who_we_are = aboutSections.who;
      storeForm.about_history = aboutSections.history;
      storeForm.about_mission = aboutSections.mission;
      storeForm.about_extra = aboutSections.extra;
      storeForm.contact_email = data.contact_email || data.email || "";
      storeForm.phone = data.phone || "";
      storeForm.whatsapp = data.whatsapp || "";
      storeForm.address = data.address || "";
      storeForm.extra_size_large_price = String(data.extra_size_large_price || "1200");
      storeForm.extra_fries_medium_price = String(data.extra_fries_medium_price || "900");
      storeForm.extra_fries_large_price = String(data.extra_fries_large_price || "1400");
      storeForm.extra_drink_price = String(data.extra_drink_price || "1000");
      storeForm.extra_sauce_price = String(data.extra_sauce_price || "250");
      storeForm.delivery_fee_mode = String(data.delivery_fee_mode || "at_dispatch");
      storeForm.shipping_base_fee = String(data.shipping_base_fee ?? "");
      storeForm.shipping_per_item_fee = String(data.shipping_per_item_fee ?? "");
      storeForm.shipping_free_over = String(data.shipping_free_over ?? "");
      storeForm.pickup_skip_queue_enabled = Boolean(data.pickup_skip_queue_enabled ?? true);
      storeForm.cart_enabled = Boolean(data.cart_enabled ?? true);
      storeForm.whatsapp_sales_enabled = Boolean(data.whatsapp_sales_enabled ?? true);
      storeForm.pickup_instructions = String(data.pickup_instructions || "");
      storeForm.social_instagram = data.social_instagram || "";
      storeForm.social_facebook = data.social_facebook || "";
      storeForm.social_tiktok = data.social_tiktok || "";
      storeForm.social_youtube = data.social_youtube || "";
      storeForm.menu_file_url = String(data.menu_file_url || "");
      storeForm.menu_file_kind = String(data.menu_file_kind || "");
      storeForm.menu_cover_image_url = String(data.menu_cover_image_url || "");
      storeForm.menu_pages = Array.isArray(data.menu_pages) ? data.menu_pages.filter((page) => page?.url).map((page, index) => ({
        id: String(page?.id || `${Date.now()}-${index}`),
        url: String(page.url),
        label: String(page?.label || "")
      })) : [];
      themeForm.accent_color = normalizedColor(data.accent_color || theme.accent, "#2563eb");
      themeForm.gradient_from = normalizedColor(data.gradient_from || theme.gradientFrom, "#111827");
      themeForm.gradient_to = normalizedColor(data.gradient_to || theme.gradientTo, "#0b2358");
      themeForm.banner_url = data.banner_url || "";
      pendingTheme.accent_color = themeForm.accent_color;
      pendingTheme.gradient_from = themeForm.gradient_from;
      pendingTheme.gradient_to = themeForm.gradient_to;
      pendingTheme.banner_url = themeForm.banner_url;
      customAccent.value = themeForm.accent_color;
      quickMediaItems.value = sanitizeQuickMedia(data.quick_media);
      quickMediaDraft.value = [...quickMediaItems.value];
      activeMenuPageIndex.value = 0;
      if (activeQuickMediaIndex.value >= quickMediaItems.value.length) {
        setQuickMediaIndex(0);
      }
      storeForm.branch_locations = branches.length ? branches.map((branch, index) => branchDraftFromApi(branch, index)) : [makeEmptyBranch()];
    };
    const splitAddressParts = (value) => {
      const raw = String(value || "").trim();
      if (!raw) return { street: "", number: "" };
      const trailing = raw.match(/^(.*?)[\s,#-]+(\d+[A-Za-z0-9-]*)$/);
      if (trailing) {
        return {
          street: trailing[1].trim(),
          number: trailing[2].trim()
        };
      }
      return { street: raw, number: "" };
    };
    const branchDraftFromApi = (branch, index) => {
      const zoneRaw = String(branch?.zone || "").trim();
      const zoneParts = zoneRaw.split(",").map((part) => part.trim()).filter(Boolean);
      const address = splitAddressParts(String(branch?.address || ""));
      return {
        label: String(branch?.label || `Sucursal ${index + 1}`).trim(),
        street: address.street,
        number: address.number,
        comuna: zoneParts[0] || "",
        region: zoneParts.slice(1).join(", ")
      };
    };
    watch(
      () => slug.value,
      async () => {
        theme.applyStoreTheme(slug.value);
        await loadData();
        hydrateForm();
      }
    );
    watch([shouldAutoOpen, canEditTheme], () => maybeOpenEdit());
    watch(showStoreForm, (opened) => {
      if (opened) {
        activeEditTab.value = "general";
        loadPayoutAccountForStore();
      }
    });
    watch(activeEditTab, (tab) => {
      if (tab === "account") {
        loadPayoutAccountForStore();
      }
    });
    watch(
      () => tenantStore.data,
      () => hydrateForm(),
      { immediate: true }
    );
    watch(menuPages, (pages) => {
      if (activeMenuPageIndex.value >= pages.length) {
        activeMenuPageIndex.value = 0;
      }
    });
    watch(quickSlideCount, () => startQuickMediaAutoplay(), { immediate: true });
    watch(activeQuickMediaIndex, () => {
      showQuickMediaMenu.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-screen text-slate-900", pageShellClass.value],
        style: pageShellStyle.value
      }, _attrs))}><section class="relative overflow-hidden bg-gradient-to-br from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] text-white" style="${ssrRenderStyle([heroBackgroundStyle.value, heroSectionStyle.value])}"><div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" aria-hidden="true"></div><div class="absolute inset-0 opacity-80" style="${ssrRenderStyle(heroPatternStyle.value)}" aria-hidden="true"></div><div class="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:gap-10 lg:py-20"><div class="space-y-5 lg:w-1/2"><p class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em]" style="${ssrRenderStyle(heroBadgeStyle.value)}">${ssrInterpolate(heroBadgeLabel.value)}</p><div class="flex items-center gap-3"><h1 class="text-4xl font-bold leading-tight md:text-5xl">${ssrInterpolate(heroTitle.value)}</h1>`);
      if (canEditTheme.value) {
        _push(`<button class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20" title="Editar tienda"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5"><path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.512l-3.12.89a.5.5 0 0 1-.62-.62l.89-3.12a2 2 0 0 1 .512-.878l8.5-8.5Z"></path><path d="M12.5 4.75 15.25 7.5"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="max-w-2xl text-lg text-white/80">${ssrInterpolate(heroDescription.value)}</p><div class="flex flex-wrap gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}/productos`,
        class: "inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5",
        style: accentStyle.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(primaryCtaLabel.value)} <span aria-hidden="true"${_scopeId}>→</span>`);
          } else {
            return [
              createTextVNode(toDisplayString(primaryCtaLabel.value) + " ", 1),
              createVNode("span", { "aria-hidden": "true" }, "→")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="#destacados" class="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition">${ssrInterpolate(secondaryCtaLabel.value)}</a></div><div class="flex flex-wrap gap-2 text-sm text-white/75"><span class="rounded-full border border-white/15 px-3 py-1">${ssrInterpolate(chipOne.value)}</span><span class="rounded-full border border-white/15 px-3 py-1">${ssrInterpolate(chipTwo.value)}</span>`);
      if (unref(tenantStore).categories.length) {
        _push(`<span class="rounded-full border border-white/15 px-3 py-1">${ssrInterpolate(unref(tenantStore).categories.length)} categorías</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(tenantStore).categories, (cat) => {
        _push(`<span class="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-white">${ssrInterpolate(categoryLabel(cat))}</span>`);
      });
      _push(`<!--]--></div></div><div class="relative lg:w-1/2"><div class="absolute -inset-6 rounded-3xl blur-2xl" style="${ssrRenderStyle(quickGlowStyle.value)}"></div><div class="relative rounded-3xl border p-6 shadow-2xl backdrop-blur" style="${ssrRenderStyle(quickPanelStyle.value)}"><p class="text-sm text-white/80">Vista rápida</p><div class="mt-4 space-y-3"><div class="relative overflow-hidden rounded-2xl border border-white/20 bg-black/20">`);
      if (isProductsSlide.value) {
        _push(`<div class="grid h-56 grid-rows-2 gap-2 bg-white/10 p-3 sm:h-64 sm:grid-cols-2 sm:grid-rows-1"><!--[-->`);
        ssrRenderList(previewProducts.value, (product) => {
          _push(`<div class="relative h-full overflow-hidden rounded-xl bg-white/10 shadow-inner"><img${ssrRenderAttr("src", unref(getProductImage)(product) || "/logoPW.png")}${ssrRenderAttr("alt", product.name || "Producto")} class="h-full w-full object-cover"><div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 pb-2 pt-6"><p class="line-clamp-1 text-xs font-semibold text-white sm:text-sm">${ssrInterpolate(product.name)}</p><p class="text-base font-extrabold leading-tight sm:text-lg" style="${ssrRenderStyle(priceTextStyle.value)}">$${ssrInterpolate(product.price)}</p></div></div>`);
        });
        _push(`<!--]-->`);
        if (!previewProducts.value.length) {
          _push(`<div class="flex items-center justify-center rounded-2xl border border-dashed border-white/30 text-sm text-white/80 sm:col-span-2"> Aún no hay productos recomendados para mostrar. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (activeQuickMedia.value?.type === "image") {
        _push(`<img${ssrRenderAttr("src", activeQuickMedia.value.url)} alt="Vista rápida de tienda" class="h-56 w-full object-cover sm:h-64">`);
      } else if (activeQuickMedia.value) {
        _push(`<video${ssrRenderAttr("src", activeQuickMedia.value.url)} class="h-56 w-full object-cover sm:h-64" controls muted playsinline></video>`);
      } else {
        _push(`<!---->`);
      }
      if (quickSlideCount.value > 1) {
        _push(`<button class="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-900/45 text-white hover:bg-slate-900/65" aria-label="Elemento anterior"><span aria-hidden="true">‹</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (quickSlideCount.value > 1) {
        _push(`<button class="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-900/45 text-white hover:bg-slate-900/65" aria-label="Siguiente elemento"><span aria-hidden="true">›</span></button>`);
      } else {
        _push(`<!---->`);
      }
      if (canEditTheme.value && activeQuickMedia.value && !isProductsSlide.value) {
        _push(`<div class="absolute right-3 top-3 relative"><button class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-slate-900/60 text-white hover:bg-slate-900/80"> ⋮ </button>`);
        if (showQuickMediaMenu.value) {
          _push(`<div class="absolute right-0 top-10 z-20 rounded-lg border border-white/20 bg-slate-900/95 backdrop-blur"><button class="block w-full px-4 py-2 text-left text-sm text-red-200 hover:bg-red-600/20"> Eliminar </button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="flex items-center justify-center gap-2"><!--[-->`);
      ssrRenderList(quickSlideCount.value, (n) => {
        _push(`<button class="${ssrRenderClass([n - 1 === activeQuickMediaIndex.value ? "bg-white" : "bg-white/40 hover:bg-white/70", "h-2.5 w-2.5 rounded-full transition"])}"${ssrRenderAttr("aria-label", `Ir al elemento ${n}`)}></button>`);
      });
      _push(`<!--]-->`);
      if (canEditTheme.value) {
        _push(`<button class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/35 bg-white/10 text-sm font-semibold text-white hover:bg-white/20" title="Agregar foto o video" aria-label="Agregar foto o video"> + </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input type="file" class="hidden" accept="image/*,video/*"></div></div>`);
      if (!previewProducts.value.length && !quickMediaItems.value.length) {
        _push(`<p class="text-white/70">Aún no hay productos cargados.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></section>`);
      if (canEditTheme.value && showHomeCopyForm.value) {
        _push(`<section class="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-10"><div class="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"><button class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100" aria-label="Cerrar editor de portada"> × </button><div class="space-y-4"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Edición rápida</p><h2 class="text-xl font-semibold text-slate-900">${ssrInterpolate(homeCopyEditorTitle.value)}</h2><p class="text-sm text-slate-600">${ssrInterpolate(homeCopyEditorDescription.value)}</p></div>`);
        if (homeCopyMessage.value) {
          _push(`<div class="${ssrRenderClass([homeCopyStatus.value === "error" ? "border-rose-200 bg-rose-50 text-rose-700" : "border-emerald-200 bg-emerald-50 text-emerald-700", "rounded-xl border px-3 py-2 text-sm"])}">${ssrInterpolate(homeCopyMessage.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (homeCopyFocus.value === "hero") {
          _push(`<div class="grid gap-4 sm:grid-cols-2"><label class="space-y-1 text-sm"><span class="font-semibold text-slate-700">Título principal</span><input id="quick-home-hero-title"${ssrRenderAttr("value", storeForm.home_hero_title)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></label><label class="space-y-1 text-sm"><span class="font-semibold text-slate-700">Subtítulo principal</span><input id="quick-home-hero-subtitle"${ssrRenderAttr("value", storeForm.home_hero_subtitle)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></label></div>`);
        } else if (homeCopyFocus.value === "featured") {
          _push(`<div class="grid gap-4 sm:grid-cols-2"><label class="space-y-1 text-sm"><span class="font-semibold text-slate-700">Título destacados</span><input id="quick-home-featured-title"${ssrRenderAttr("value", storeForm.home_featured_title)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></label><label class="space-y-1 text-sm"><span class="font-semibold text-slate-700">Subtítulo destacados</span><input id="quick-home-featured-subtitle"${ssrRenderAttr("value", storeForm.home_featured_subtitle)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></label></div>`);
        } else {
          _push(`<div class="grid gap-4 sm:grid-cols-2"><label class="space-y-1 text-sm"><span class="font-semibold text-slate-700">Título catálogo</span><input id="quick-home-catalog-title"${ssrRenderAttr("value", storeForm.home_catalog_title)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></label><label class="space-y-1 text-sm"><span class="font-semibold text-slate-700">Subtítulo catálogo</span><input id="quick-home-catalog-subtitle"${ssrRenderAttr("value", storeForm.home_catalog_subtitle)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></label></div>`);
        }
        _push(`<div class="flex items-center justify-end gap-2 pt-2"><button class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"> Cancelar </button><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(savingHomeCopy.value) ? " disabled" : ""}>${ssrInterpolate(savingHomeCopy.value ? "Guardando..." : "Guardar textos")}</button></div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (canEditTheme.value && showStoreForm.value) {
        _push(`<section class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-10" id="brand"><div class="relative w-full max-w-4xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"><button class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100" aria-label="Cerrar edición"> × </button><div class="space-y-4"><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-xs uppercase tracking-[0.25em] text-slate-500">Datos de la tienda</p><h2 class="text-xl font-semibold text-slate-900">Editar tienda</h2><p class="text-slate-600">Se guardan en el servidor para esta tienda.</p></div><div class="flex flex-col items-end gap-2">`);
        if (updateMessage.value) {
          _push(`<div class="${ssrRenderClass([updateStatus.value === "error" ? "text-red-600" : "text-emerald-600", "text-sm"])}">${ssrInterpolate(updateMessage.value)}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="sticky top-0 z-10 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2"><button class="${ssrRenderClass([activeEditTab.value === "general" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70", "rounded-xl px-3 py-2 text-sm font-semibold transition"])}"><span class="inline-flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Store), { class: "h-4 w-4" }, null, _parent));
        _push(` General <span class="${ssrRenderClass([tabCompletion.value.general.completed ? "border-emerald-600 bg-emerald-600 text-white" : activeEditTab.value === "general" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200", "inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"])}">`);
        if (tabCompletion.value.general.completed) {
          _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3.5 w-3.5" }, null, _parent));
        } else {
          _push(`<span>${ssrInterpolate(tabCompletion.value.general.label)}</span>`);
        }
        _push(`</span></span></button><button class="${ssrRenderClass([activeEditTab.value === "design" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70", "rounded-xl px-3 py-2 text-sm font-semibold transition"])}"><span class="inline-flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Palette), { class: "h-4 w-4" }, null, _parent));
        _push(` Diseño <span class="${ssrRenderClass([tabCompletion.value.design.completed ? "border-emerald-600 bg-emerald-600 text-white" : activeEditTab.value === "design" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200", "inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"])}">`);
        if (tabCompletion.value.design.completed) {
          _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3.5 w-3.5" }, null, _parent));
        } else {
          _push(`<span>${ssrInterpolate(tabCompletion.value.design.label)}</span>`);
        }
        _push(`</span></span></button><button class="${ssrRenderClass([activeEditTab.value === "about" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70", "rounded-xl px-3 py-2 text-sm font-semibold transition"])}"><span class="inline-flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Share2), { class: "h-4 w-4" }, null, _parent));
        _push(` Acerca <span class="${ssrRenderClass([tabCompletion.value.about.completed ? "border-emerald-600 bg-emerald-600 text-white" : activeEditTab.value === "about" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200", "inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"])}">`);
        if (tabCompletion.value.about.completed) {
          _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3.5 w-3.5" }, null, _parent));
        } else {
          _push(`<span>${ssrInterpolate(tabCompletion.value.about.label)}</span>`);
        }
        _push(`</span></span></button><button class="${ssrRenderClass([activeEditTab.value === "contact" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70", "rounded-xl px-3 py-2 text-sm font-semibold transition"])}"><span class="inline-flex items-center gap-2">`);
        _push(ssrRenderComponent(unref(Phone), { class: "h-4 w-4" }, null, _parent));
        _push(` Contacto <span class="${ssrRenderClass([tabCompletion.value.contact.completed ? "border-emerald-600 bg-emerald-600 text-white" : activeEditTab.value === "contact" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200", "inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"])}">`);
        if (tabCompletion.value.contact.completed) {
          _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3.5 w-3.5" }, null, _parent));
        } else {
          _push(`<span>${ssrInterpolate(tabCompletion.value.contact.label)}</span>`);
        }
        _push(`</span></span></button><button class="${ssrRenderClass([activeEditTab.value === "account" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:bg-white/70", "rounded-xl px-3 py-2 text-sm font-semibold transition"])}"><span class="inline-flex items-center gap-2"><span class="inline-flex h-4 w-4 items-center justify-center text-[11px]">$</span> Cuenta <span class="${ssrRenderClass([tabCompletion.value.account.completed ? "border-emerald-600 bg-emerald-600 text-white" : activeEditTab.value === "account" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200", "inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"])}">`);
        if (tabCompletion.value.account.completed) {
          _push(ssrRenderComponent(unref(CheckCircle2), { class: "h-3.5 w-3.5" }, null, _parent));
        } else {
          _push(`<span>${ssrInterpolate(tabCompletion.value.account.label)}</span>`);
        }
        _push(`</span></span></button></div>`);
        if (activeEditTab.value === "general") {
          _push(`<div class="grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Nombre de la tienda</label><input${ssrRenderAttr("value", storeForm.name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Slug (se usa en la URL)</label><input${ssrRenderAttr("value", storeForm.slug)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><p class="text-xs text-slate-500">Ejemplo: /store/${ssrInterpolate(storeForm.slug || "mitienda")}</p></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Tipo de tienda</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="retail"${ssrIncludeBooleanAttr(Array.isArray(storeForm.store_type) ? ssrLooseContain(storeForm.store_type, "retail") : ssrLooseEqual(storeForm.store_type, "retail")) ? " selected" : ""}>Retail</option><option value="fast_food"${ssrIncludeBooleanAttr(Array.isArray(storeForm.store_type) ? ssrLooseContain(storeForm.store_type, "fast_food") : ssrLooseEqual(storeForm.store_type, "fast_food")) ? " selected" : ""}>Comida rápida</option><option value="bakery"${ssrIncludeBooleanAttr(Array.isArray(storeForm.store_type) ? ssrLooseContain(storeForm.store_type, "bakery") : ssrLooseEqual(storeForm.store_type, "bakery")) ? " selected" : ""}>Pastelería</option><option value="pharmacy"${ssrIncludeBooleanAttr(Array.isArray(storeForm.store_type) ? ssrLooseContain(storeForm.store_type, "pharmacy") : ssrLooseEqual(storeForm.store_type, "pharmacy")) ? " selected" : ""}>Farmacia</option><option value="fashion"${ssrIncludeBooleanAttr(Array.isArray(storeForm.store_type) ? ssrLooseContain(storeForm.store_type, "fashion") : ssrLooseEqual(storeForm.store_type, "fashion")) ? " selected" : ""}>Moda</option><option value="bookstore"${ssrIncludeBooleanAttr(Array.isArray(storeForm.store_type) ? ssrLooseContain(storeForm.store_type, "bookstore") : ssrLooseEqual(storeForm.store_type, "bookstore")) ? " selected" : ""}>Librería</option></select><div class="flex flex-wrap items-center gap-2 pt-1"><button class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"${ssrIncludeBooleanAttr(syncingCategories.value || updatingStore.value) ? " disabled" : ""}>${ssrInterpolate(syncingCategories.value ? "Sincronizando categorías..." : "Sincronizar categorías de este tipo")}</button><p class="text-xs text-slate-500">Crea categorías faltantes del tipo elegido y ajusta las visibles en formularios.</p></div></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Descripción</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">${ssrInterpolate(storeForm.description)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Logo</label><input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><p class="text-xs text-slate-500">Solo archivo de imagen. Se aplicará al guardar cambios.</p>`);
          if (storeForm.logo_url) {
            _push(`<p class="text-xs text-slate-500">Logo listo para guardar.</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="space-y-3 md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Ventas y checkout</p><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(storeForm.cart_enabled) ? ssrLooseContain(storeForm.cart_enabled, null) : storeForm.cart_enabled) ? " checked" : ""} type="checkbox" class="h-4 w-4"> Habilitar carrito en la tienda </label><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><input${ssrIncludeBooleanAttr(Array.isArray(storeForm.whatsapp_sales_enabled) ? ssrLooseContain(storeForm.whatsapp_sales_enabled, null) : storeForm.whatsapp_sales_enabled) ? " checked" : ""} type="checkbox" class="h-4 w-4"> Habilitar ventas por WhatsApp </label></div>`);
          if (hasMenuSupport.value) {
            _push(`<div class="space-y-3 md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div><label class="text-sm font-semibold text-slate-700">Carta o menú</label><p class="text-xs text-slate-500">Sube PDF/Word/imagen o páginas de menú para mostrarlas en la tienda.</p></div><input type="file" accept="image/*,application/pdf,.doc,.docx" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><input type="file" multiple accept="image/*,application/pdf" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">`);
            if (storeForm.menu_file_url) {
              _push(`<p class="text-xs text-slate-500">Archivo principal listo para guardar.</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (activeEditTab.value === "design") {
          _push(`<div class="grid gap-4"><div class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 md:p-5"><div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Diseño</p><h3 class="text-base font-semibold text-slate-900">Diseño de marca</h3></div><span class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">Vista previa en tiempo real</span></div><div class="space-y-2"><label class="text-sm text-slate-600">Patrón decorativo del encabezado</label><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(patternOptions, (option) => {
            _push(`<button class="${ssrRenderClass([storeForm.hero_pattern_style === option.value ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400", "rounded-full border px-3 py-1.5 text-xs font-semibold transition"])}">${ssrInterpolate(option.label)}</button>`);
          });
          _push(`<!--]--></div></div><div class="space-y-2"><label class="text-sm text-slate-600">Banner principal (opcional)</label><input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><p class="text-xs text-slate-500">Solo archivo de imagen. Se aplicará al guardar cambios.</p>`);
          if (pendingTheme.banner_url) {
            _push(`<p class="text-xs text-slate-500">Banner listo para guardar.</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="space-y-2"><label class="text-sm text-slate-600">Color de acento</label><div class="flex flex-wrap items-center gap-2"><!--[-->`);
          ssrRenderList(palette, (c) => {
            _push(`<button class="h-8 w-8 rounded-full border border-slate-200 shadow-inner transition hover:-translate-y-0.5" style="${ssrRenderStyle({ backgroundColor: c })}"></button>`);
          });
          _push(`<!--]--><input${ssrRenderAttr("value", customAccent.value)} type="color" class="h-9 w-14 rounded border border-slate-200 bg-white"><button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Usar personalizado</button></div></div><div class="space-y-2"><label class="text-sm text-slate-600">Degradado</label><div class="flex flex-wrap items-center gap-2"><!--[-->`);
          ssrRenderList(gradients, (g) => {
            _push(`<button class="h-10 w-14 rounded-xl border border-slate-200 shadow-inner transition hover:-translate-y-0.5" style="${ssrRenderStyle({ backgroundImage: `linear-gradient(120deg, ${g.from}, ${g.to})` })}"></button>`);
          });
          _push(`<!--]--></div></div><div class="space-y-3"><div><label class="text-sm text-slate-600">Vista rápida: fotos o videos</label><p class="text-xs text-slate-500">Sube uno o varios archivos. Se mostrarán como carrusel automático en portada al guardar.</p></div><input type="file" multiple accept="image/*,video/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><p class="text-xs text-slate-500">Máximo 7 archivos y 15MB por archivo.</p>`);
          if (quickMediaDraft.value.length) {
            _push(`<div class="grid gap-3 md:grid-cols-2"><!--[-->`);
            ssrRenderList(quickMediaDraft.value, (item, index) => {
              _push(`<div class="rounded-xl border border-slate-200 bg-white p-3"><div class="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-black/5">`);
              if (item.type === "image") {
                _push(`<img${ssrRenderAttr("src", item.url)} alt="Elemento de vista rápida" class="h-28 w-full object-cover">`);
              } else {
                _push(`<video${ssrRenderAttr("src", item.url)} class="h-28 w-full object-cover" controls muted playsinline></video>`);
              }
              _push(`</div><div class="flex items-center justify-between gap-2"><p class="truncate text-xs text-slate-500">Elemento ${ssrInterpolate(index + 1)} · ${ssrInterpolate(item.type === "image" ? "Foto" : "Video")}</p><button class="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">Quitar</button></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<p class="text-xs text-slate-500">No has agregado fotos o videos para esta vista.</p>`);
          }
          _push(`</div></div></div>`);
        } else if (activeEditTab.value === "about") {
          _push(`<div class="grid gap-4 md:grid-cols-2"><div class="space-y-2 md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-4"><p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Contenido para página Acerca</p><p class="mt-2 text-sm text-slate-700">Completa esta sección para mostrar una presentación más clara de tu marca: quiénes son, historia, misión y sucursales.</p></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Quiénes somos</label><textarea rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Describe quiénes son y qué ofrecen.">${ssrInterpolate(storeForm.about_who_we_are)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Nuestra historia</label><textarea rows="6" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Cuenta cómo nació la tienda y su evolución.">${ssrInterpolate(storeForm.about_history)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Misión y visión</label><textarea rows="6" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Comparte la misión y visión de la tienda.">${ssrInterpolate(storeForm.about_mission)}</textarea></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Información adicional (opcional)</label><textarea rows="2" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Certificaciones, equipo, valores u otra información relevante.">${ssrInterpolate(storeForm.about_extra)}</textarea></div><div class="space-y-2 md:col-span-2"><div class="flex flex-wrap items-center justify-between gap-2"><label class="text-sm text-slate-600">Sucursales para mostrar en Acerca</label><button type="button" class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"> + Agregar sucursal </button></div><div class="space-y-3"><!--[-->`);
          ssrRenderList(storeForm.branch_locations, (branch, index) => {
            _push(`<article class="rounded-2xl border border-slate-200 bg-slate-50 p-3"><div class="mb-2 flex items-center justify-between gap-2"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sucursal ${ssrInterpolate(index + 1)}</p>`);
            if (storeForm.branch_locations.length > 1) {
              _push(`<button type="button" class="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"> Quitar </button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="grid gap-2 md:grid-cols-2"><input${ssrRenderAttr("value", branch.street)} type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Calle"><input${ssrRenderAttr("value", branch.number)} type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Número"><input${ssrRenderAttr("value", branch.comuna)} type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Comuna"><input${ssrRenderAttr("value", branch.region)} type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Región"></div></article>`);
          });
          _push(`<!--]--></div><p class="text-xs text-slate-500">Estas direcciones se mostrarán como tarjetas en la página Acerca.</p></div></div>`);
        } else if (activeEditTab.value === "account") {
          _push(`<div class="grid gap-4 md:grid-cols-2"><div class="md:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Cuenta receptora de pagos</p><p class="mt-2 text-sm text-emerald-900">Esta cuenta define dónde se deposita el dinero de las ventas de tu tienda. Según la cuenta configurada, se habilita el método de pago visible al cliente en checkout.</p></div><div class="md:col-span-2 flex flex-wrap items-center gap-2"><span class="${ssrRenderClass([payoutStatusPillClass.value, "rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(payoutStatusLabel.value)}</span><span class="text-xs text-slate-500">Proveedor activo: ${ssrInterpolate(payoutProviderLabel.value)}</span></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Usar método guardado en tu cuenta (opcional)</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option${ssrRenderAttr("value", 0)}${ssrIncludeBooleanAttr(Array.isArray(payoutForm.payout_method_id) ? ssrLooseContain(payoutForm.payout_method_id, 0) : ssrLooseEqual(payoutForm.payout_method_id, 0)) ? " selected" : ""}>Configurar manualmente</option><!--[-->`);
          ssrRenderList(payoutAvailableMethods.value, (method) => {
            _push(`<option${ssrRenderAttr("value", method.id)}${ssrIncludeBooleanAttr(Array.isArray(payoutForm.payout_method_id) ? ssrLooseContain(payoutForm.payout_method_id, method.id) : ssrLooseEqual(payoutForm.payout_method_id, method.id)) ? " selected" : ""}>${ssrInterpolate(method.label)} · ${ssrInterpolate(method.provider === "paypal" ? `PayPal ${method.account_email || ""}` : `Webpay/Tarjeta **** ${method.card_last4 || ""}`)}</option>`);
          });
          _push(`<!--]--></select></div><div class="space-y-2"><label class="text-sm text-slate-600">Método de pago a habilitar</label><select class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="paypal"${ssrIncludeBooleanAttr(Array.isArray(payoutForm.provider) ? ssrLooseContain(payoutForm.provider, "paypal") : ssrLooseEqual(payoutForm.provider, "paypal")) ? " selected" : ""}>PayPal</option><option value="card"${ssrIncludeBooleanAttr(Array.isArray(payoutForm.provider) ? ssrLooseContain(payoutForm.provider, "card") : ssrLooseEqual(payoutForm.provider, "card")) ? " selected" : ""}>Webpay / Tarjeta</option></select></div>`);
          if (payoutForm.provider === "paypal") {
            _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Correo PayPal</label><input${ssrRenderAttr("value", payoutForm.account_email)} type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="pagos@tu-negocio.cl"></div>`);
          } else {
            _push(`<div class="space-y-2"><label class="text-sm text-slate-600">Últimos 4 dígitos de tarjeta/cuenta</label><input${ssrRenderAttr("value", payoutForm.account_number_last4)} type="text" maxlength="8" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="1234"></div>`);
          }
          _push(`<div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Titular</label><input${ssrRenderAttr("value", payoutForm.account_holder_name)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Nombre del titular de la cuenta"></div><div class="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600"><p class="font-semibold text-slate-800">Seguridad y cumplimiento (Chile)</p><p class="mt-1">No guardamos números completos de tarjeta ni credenciales sensibles. Solo se almacenan datos mínimos (correo y últimos 4 dígitos) para identificación, trazabilidad y revisión manual, siguiendo principio de minimización de datos y buenas prácticas de seguridad (OWASP, control de acceso por rol, auditoría de cambios).</p></div><div class="md:col-span-2 flex flex-wrap items-center gap-3"><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(savingPayout.value) ? " disabled" : ""}>${ssrInterpolate(savingPayout.value ? "Guardando cuenta..." : "Guardar cuenta receptora")}</button>`);
          if (payoutConfigured.value) {
            _push(`<button class="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"${ssrIncludeBooleanAttr(savingPayout.value) ? " disabled" : ""}> Marcar verificada </button>`);
          } else {
            _push(`<!---->`);
          }
          if (payoutConfigured.value) {
            _push(`<button class="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"${ssrIncludeBooleanAttr(savingPayout.value) ? " disabled" : ""}> Rechazar </button>`);
          } else {
            _push(`<!---->`);
          }
          if (payoutMessage.value) {
            _push(`<p class="${ssrRenderClass([payoutStatus.value === "error" ? "text-red-600" : "text-emerald-600", "text-sm"])}">${ssrInterpolate(payoutMessage.value)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else if (activeEditTab.value === "contact") {
          _push(`<div class="grid gap-4 md:grid-cols-2"><div class="space-y-2"><label class="text-sm text-slate-600">Email de contacto</label><input${ssrRenderAttr("value", storeForm.contact_email)} type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2"><label class="text-sm text-slate-600">Teléfono</label><input${ssrRenderAttr("value", storeForm.phone)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">WhatsApp</label><input${ssrRenderAttr("value", storeForm.whatsapp)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></div><div class="space-y-2 md:col-span-2"><label class="text-sm text-slate-600">Dirección principal</label><input${ssrRenderAttr("value", storeForm.address)} type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Ej: Av. Principal 123, Providencia"></div><div class="md:col-span-2 rounded-2xl border border-pink-100 bg-pink-50 p-4"><p class="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">🔗 Redes Sociales</p><p class="mt-2 text-sm text-pink-900">Agrega los enlaces a tus perfiles de redes sociales. Se mostrarán en el footer y en la sección &quot;Síguenos&quot; de tu tienda. Deja vacío si no tienes perfil.</p></div><div class="space-y-2"><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">`);
          _push(ssrRenderComponent(unref(Instagram), { class: "h-4 w-4 text-pink-600" }, null, _parent));
          _push(` Instagram </label><input${ssrRenderAttr("value", storeForm.social_instagram)} type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://instagram.com/tu_usuario"></div><div class="space-y-2"><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">`);
          _push(ssrRenderComponent(unref(Facebook), { class: "h-4 w-4 text-blue-600" }, null, _parent));
          _push(` Facebook </label><input${ssrRenderAttr("value", storeForm.social_facebook)} type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://facebook.com/tu_pagina"></div><div class="space-y-2"><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">`);
          _push(ssrRenderComponent(unref(Music2), { class: "h-4 w-4 text-slate-900" }, null, _parent));
          _push(` TikTok </label><input${ssrRenderAttr("value", storeForm.social_tiktok)} type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://tiktok.com/@tu_usuario"></div><div class="space-y-2"><label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">`);
          _push(ssrRenderComponent(unref(Youtube), { class: "h-4 w-4 text-red-600" }, null, _parent));
          _push(` YouTube </label><input${ssrRenderAttr("value", storeForm.social_youtube)} type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://youtube.com/@tu_canal"></div>`);
          if ([storeForm.social_instagram, storeForm.social_facebook, storeForm.social_tiktok, storeForm.social_youtube].some(Boolean)) {
            _push(`<div class="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-semibold text-slate-600 uppercase">Vista previa</p><div class="mt-3 flex flex-wrap gap-2">`);
            if (storeForm.social_instagram) {
              _push(`<a${ssrRenderAttr("href", storeForm.social_instagram)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">`);
              _push(ssrRenderComponent(unref(Instagram), { class: "h-3.5 w-3.5 text-pink-600" }, null, _parent));
              _push(` Instagram </a>`);
            } else {
              _push(`<!---->`);
            }
            if (storeForm.social_facebook) {
              _push(`<a${ssrRenderAttr("href", storeForm.social_facebook)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">`);
              _push(ssrRenderComponent(unref(Facebook), { class: "h-3.5 w-3.5 text-blue-600" }, null, _parent));
              _push(` Facebook </a>`);
            } else {
              _push(`<!---->`);
            }
            if (storeForm.social_tiktok) {
              _push(`<a${ssrRenderAttr("href", storeForm.social_tiktok)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">`);
              _push(ssrRenderComponent(unref(Music2), { class: "h-3.5 w-3.5 text-slate-900" }, null, _parent));
              _push(` TikTok </a>`);
            } else {
              _push(`<!---->`);
            }
            if (storeForm.social_youtube) {
              _push(`<a${ssrRenderAttr("href", storeForm.social_youtube)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">`);
              _push(ssrRenderComponent(unref(Youtube), { class: "h-3.5 w-3.5 text-red-600" }, null, _parent));
              _push(` YouTube </a>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="sticky bottom-0 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><p class="text-sm text-slate-600">Cambiar el slug redirige a la nueva URL. El tema se persiste al guardar.</p><button class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(updatingStore.value) ? " disabled" : ""}>${ssrInterpolate(updatingStore.value ? "Guardando..." : "Guardar cambios de tienda")}</button></div></div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14" id="destacados"><div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10"><div class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div><div class="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div><div class="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div class="flex-1"><p class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white/90"><span class="inline-block h-2 w-2 rounded-full bg-white"></span> Ofertas relámpago </p><div class="flex items-center gap-3 pt-2"><h3 class="text-3xl font-black leading-tight sm:text-4xl">${ssrInterpolate(featuredTitle.value)}</h3>`);
      if (canEditTheme.value) {
        _push(`<button class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition hover:-translate-y-0.5 hover:bg-white/30" title="Editar título y subtítulo de destacados"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.512l-3.12.89a.5.5 0 0 1-.62-.62l.89-3.12a2 2 0 0 1 .512-.878l8.5-8.5Z"></path><path d="M12.5 4.75 15.25 7.5"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="mt-2 text-lg font-semibold text-white/95">${ssrInterpolate(featuredSubtitle.value)}</p></div></div></div>`);
      if (!featuredProducts.value.length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-600"><p class="font-semibold">Marca productos con la palomita de oferta destacada para mostrarlos aquí.</p></div>`);
      } else {
        _push(`<div class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"><!--[-->`);
        ssrRenderList(paginatedFeaturedProducts.value, (product) => {
          _push(ssrRenderComponent(ProductCard, {
            key: `featured-${product.id}`,
            product,
            accent: accentColor.value
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (featuredProducts.value.length > featuredPerPage) {
        _push(`<div class="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm text-amber-800"><button class="rounded-lg border border-amber-300 bg-white px-4 py-2 font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-40"${ssrIncludeBooleanAttr(featuredPage.value === 1) ? " disabled" : ""}> ← Anterior </button><p class="font-semibold">Destacados ${ssrInterpolate(featuredPageStart.value)}-${ssrInterpolate(featuredPageEnd.value)} de ${ssrInterpolate(featuredProducts.value.length)}</p><button class="rounded-lg border border-amber-300 bg-white px-4 py-2 font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-40"${ssrIncludeBooleanAttr(featuredPage.value === featuredTotalPages.value) ? " disabled" : ""}> Siguiente → </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="relative mx-auto max-w-6xl overflow-hidden px-4 py-8 sm:px-6 sm:py-10" id="catalogo" style="${ssrRenderStyle(circlesDecorativeStyle.value)}">`);
      if (isCirclesPatternActive.value) {
        _push(`<div class="pointer-events-none absolute -left-8 top-1/3 h-20 w-20 rounded-full" style="${ssrRenderStyle(circlesBubbleTwoStyle.value)}" aria-hidden="true"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><p class="flex items-center gap-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-950">`);
      _push(ssrRenderComponent(unref(Tags), { class: "h-3.5 w-3.5 text-slate-900" }, null, _parent));
      _push(` Vitrina principal</p><h2 class="mt-1 flex items-center gap-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "h-6 w-6 text-slate-900" }, null, _parent));
      _push(` ${ssrInterpolate(catalogTitle.value)} `);
      if (canEditTheme.value) {
        _push(`<button class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400" title="Editar título y subtítulo de catálogo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4"><path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.512l-3.12.89a.5.5 0 0 1-.62-.62l.89-3.12a2 2 0 0 1 .512-.878l8.5-8.5Z"></path><path d="M12.5 4.75 15.25 7.5"></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</h2><p class="mt-1 text-sm font-semibold text-slate-800">${ssrInterpolate(catalogSubtitle.value)}</p></div><div class="flex w-full flex-wrap items-center justify-center gap-3 text-sm md:w-auto md:justify-center"><label class="relative w-full min-w-[220px] sm:w-[280px] md:w-[220px]">`);
      _push(ssrRenderComponent(unref(Search), { class: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" }, null, _parent));
      _push(`<input${ssrRenderAttr("value", catalogQuery.value)} type="text" placeholder="Buscar producto..." class="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"></label><div class="flex flex-wrap items-center justify-center gap-3"><select class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(catalogCategory.value) ? ssrLooseContain(catalogCategory.value, "") : ssrLooseEqual(catalogCategory.value, "")) ? " selected" : ""}>Todas las categorías</option><!--[-->`);
      ssrRenderList(catalogCategories.value, (cat) => {
        _push(`<option${ssrRenderAttr("value", cat)}${ssrIncludeBooleanAttr(Array.isArray(catalogCategory.value) ? ssrLooseContain(catalogCategory.value, cat) : ssrLooseEqual(catalogCategory.value, cat)) ? " selected" : ""}>${ssrInterpolate(cat)}</option>`);
      });
      _push(`<!--]--></select><select class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"><option value=""${ssrIncludeBooleanAttr(Array.isArray(catalogSort.value) ? ssrLooseContain(catalogSort.value, "") : ssrLooseEqual(catalogSort.value, "")) ? " selected" : ""}>Ordenar por precio</option><option value="asc"${ssrIncludeBooleanAttr(Array.isArray(catalogSort.value) ? ssrLooseContain(catalogSort.value, "asc") : ssrLooseEqual(catalogSort.value, "asc")) ? " selected" : ""}>Menor a mayor</option><option value="desc"${ssrIncludeBooleanAttr(Array.isArray(catalogSort.value) ? ssrLooseContain(catalogSort.value, "desc") : ssrLooseEqual(catalogSort.value, "desc")) ? " selected" : ""}>Mayor a menor</option><option value="az"${ssrIncludeBooleanAttr(Array.isArray(catalogSort.value) ? ssrLooseContain(catalogSort.value, "az") : ssrLooseEqual(catalogSort.value, "az")) ? " selected" : ""}>A → Z</option><option value="za"${ssrIncludeBooleanAttr(Array.isArray(catalogSort.value) ? ssrLooseContain(catalogSort.value, "za") : ssrLooseEqual(catalogSort.value, "za")) ? " selected" : ""}>Z → A</option></select></div></div></div>`);
      if (unref(tenantStore).loading) {
        _push(`<div class="mt-6 text-slate-500">Cargando productos...</div>`);
      } else if (!catalogRows.value.length) {
        _push(`<div class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600"> Aún no hay productos cargados en esta tienda. </div>`);
      } else {
        _push(`<div class="mt-6 space-y-6 md:mt-7 md:space-y-8"><!--[-->`);
        ssrRenderList(paginatedCatalogRows.value, (row) => {
          _push(`<section class="${ssrRenderClass(catalogRowClass.value)}"><div class="mb-3 flex items-center justify-between"><h3 class="inline-flex items-center gap-2 text-lg font-extrabold text-slate-950"><span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold" style="${ssrRenderStyle(categoryCountStyle.value)}">${ssrInterpolate(row.products.length)}</span> ${ssrInterpolate(row.category)} · Los más buscados </h3><span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Línea de categoría</span></div><div class="space-y-4"><!--[-->`);
          ssrRenderList(row.brandGroups, (brandGroup) => {
            _push(`<div class="rounded-xl border border-slate-100 bg-slate-50/60 p-3"><div class="mb-2 flex items-center justify-between"><p class="text-sm font-bold text-slate-900">${ssrInterpolate(brandGroup.brand)}</p><span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">${ssrInterpolate(brandGroup.products.length)} productos</span></div><div class="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"><!--[-->`);
            ssrRenderList(brandGroup.products, (product) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: `mini-${row.category}-${brandGroup.brand}-${product.id}`,
                to: getProductPath(product),
                class: "group min-w-[170px] max-w-[170px] snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                style: catalogCardStyle.value
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="relative h-28 bg-slate-100"${_scopeId}><img${ssrRenderAttr("src", unref(getProductImage)(product) || "/logoPW.png")}${ssrRenderAttr("alt", product.name || "Producto")} class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"${_scopeId}>`);
                    if (getDiscountPercent(product) > 0) {
                      _push2(`<div class="absolute right-0 top-0 rounded-bl-lg bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white"${_scopeId}> -${ssrInterpolate(getDiscountPercent(product))}% </div>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div><div class="space-y-1 p-2.5"${_scopeId}><p class="line-clamp-2 text-xs font-semibold leading-snug text-slate-800"${_scopeId}>${ssrInterpolate(product.name)}</p><p class="text-base font-extrabold" style="${ssrRenderStyle(priceTextStyle.value)}"${_scopeId}>${ssrInterpolate(formatCatalogPrice(getEffectivePrice(product)))}</p>`);
                    if (getDiscountPercent(product) > 0) {
                      _push2(`<p class="text-[11px] font-semibold text-slate-400 line-through"${_scopeId}>${ssrInterpolate(formatCatalogPrice(Number(product?.price || 0)))}</p>`);
                    } else {
                      _push2(`<!---->`);
                    }
                    _push2(`</div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative h-28 bg-slate-100" }, [
                        createVNode("img", {
                          src: unref(getProductImage)(product) || "/logoPW.png",
                          alt: product.name || "Producto",
                          class: "h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                        }, null, 8, ["src", "alt"]),
                        getDiscountPercent(product) > 0 ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "absolute right-0 top-0 rounded-bl-lg bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white"
                        }, " -" + toDisplayString(getDiscountPercent(product)) + "% ", 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("div", { class: "space-y-1 p-2.5" }, [
                        createVNode("p", { class: "line-clamp-2 text-xs font-semibold leading-snug text-slate-800" }, toDisplayString(product.name), 1),
                        createVNode("p", {
                          class: "text-base font-extrabold",
                          style: priceTextStyle.value
                        }, toDisplayString(formatCatalogPrice(getEffectivePrice(product))), 5),
                        getDiscountPercent(product) > 0 ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-[11px] font-semibold text-slate-400 line-through"
                        }, toDisplayString(formatCatalogPrice(Number(product?.price || 0))), 1)) : createCommentVNode("", true)
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div></div>`);
          });
          _push(`<!--]--></div></section>`);
        });
        _push(`<!--]--></div>`);
      }
      if (catalogRows.value.length > categoryRowsPerPage) {
        _push(`<div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><button class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"${ssrIncludeBooleanAttr(catalogPage.value === 1) ? " disabled" : ""}> Anterior </button><p>Categorías ${ssrInterpolate(catalogPageStart.value)}-${ssrInterpolate(catalogPageEnd.value)} de ${ssrInterpolate(catalogRows.value.length)}</p><button class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"${ssrIncludeBooleanAttr(catalogPage.value === catalogTotalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="mx-auto max-w-6xl px-6 pb-14">`);
      if (showWhatsAppCTA.value) {
        _push(`<div class="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1.1fr,0.9fr] lg:p-6"><div class="space-y-2"><p class="section-kicker">Contacto rápido</p><h3 class="section-title text-3xl sm:text-4xl">Agenda tu pedido sin perder tiempo</h3><p class="max-w-2xl text-sm text-slate-600">Usa WhatsApp para reservas, retiros en local o pedidos con coordinación directa. También puedes revisar la carta desde el menú de la tienda.</p><div class="flex flex-wrap gap-3 pt-2">`);
        if (hasStoreWhatsApp.value) {
          _push(`<a${ssrRenderAttr("href", storeWhatsAppUrl.value)} target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow" style="${ssrRenderStyle(accentStyle.value)}"> Agendar por WhatsApp </a>`);
        } else {
          _push(`<!---->`);
        }
        if (hasMenuPages.value) {
          _push(`<button class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"> Ver menú </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="grid gap-3 sm:grid-cols-2"><article class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">WhatsApp</p><p class="mt-2 text-lg font-bold text-emerald-900">${ssrInterpolate(storeWhatsAppDisplay.value)}</p><p class="text-xs text-emerald-700/80">Atención para agendar pedidos y resolver dudas.</p></article><article class="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Menú</p><p class="mt-2 text-lg font-bold text-slate-900">${ssrInterpolate(menuPageCount.value)} página${ssrInterpolate(menuPageCount.value === 1 ? "" : "s")}</p><p class="text-xs text-slate-600">Se abre como panel dentro de la misma página.</p></article></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D6VsvBaH.mjs.map
