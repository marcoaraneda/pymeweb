import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { P as ProductCard } from './ProductCard-Bc3E-sgC.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
import { u as useCartStore } from './cart-fX2c5KSU.mjs';
import { u as useImages } from './useImages-CVASCtOr.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import { ShoppingCart, Instagram, Facebook, Music2, Youtube } from 'lucide-vue-next';
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

const perPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const slug = route.params.slug;
    const config = useRuntimeConfig();
    const tenantStore = useTenantStore();
    const cart = useCartStore();
    const theme = useThemeStore();
    const auth = useAuthStore();
    const { getProductImage } = useImages();
    const selectedCategory = ref("");
    const searchQuery = ref("");
    const sortMode = ref("recommended");
    const page = ref(1);
    const selectedFastFoodSection = ref("Combos");
    const comboBuilderOpen = ref(false);
    const menuPanelOpen = ref(false);
    const activeMenuPageIndex = ref(0);
    const activeComboProduct = ref(null);
    const sauceOptions = ["BBQ", "Mostaza miel", "Ajo", "Picante", "Ketchup", "Mayonesa"];
    const friesOptions = [
      { value: "ninguna", label: "Sin papas" },
      { value: "medianas", label: "Medianas (+$900)" },
      { value: "grandes", label: "Grandes (+$1.400)" }
    ];
    const comboConfig = ref({
      size: "regular",
      fries: "medianas",
      drink: "Sin bebida",
      sauces: [],
      addons: []
    });
    const isStoreOwner = computed(() => {
      const memberships = auth.user?.memberships || [];
      return memberships.some((m) => {
        const storeSlug = m?.store?.slug;
        const roles = (m?.roles || []).map((r) => r?.code || r)?.map((r) => r?.toLowerCase?.());
        return storeSlug === slug && roles.some((r) => ["admin", "owner", "manager"].includes(r));
      });
    });
    const productDetailPath = (product) => product?.slug ? `/store/${slug}/productos/${product.slug}` : `/store/${slug}/productos`;
    const accentColor = computed(() => theme.accent || "#2563eb");
    const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: "#fff" }));
    const storeType = computed(() => String(tenantStore.data?.store_type || "retail"));
    const cartAllowedByType = computed(() => ["fast_food", "bakery"].includes(storeType.value));
    const showMenuSection = computed(() => ["fast_food", "bakery"].includes(storeType.value));
    const storeCartEnabled = computed(() => {
      const value = tenantStore.data?.cart_enabled;
      const hasToggle = value === void 0 || value === null ? true : Boolean(value);
      return cartAllowedByType.value && hasToggle;
    });
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
      const msg = encodeURIComponent(`Hola, quiero agendar un pedido en ${storeName}.`);
      return `https://wa.me/${storeWhatsAppDigits.value}?text=${msg}`;
    });
    const normalizeSocialUrl = (value) => {
      const raw = String(value || "").trim();
      if (!raw) return "";
      if (/^https?:\/\//i.test(raw)) return raw;
      return `https://${raw}`;
    };
    const storeSocialLinks = computed(() => {
      const data = tenantStore.data || {};
      const links = [
        { key: "instagram", label: "Instagram", url: normalizeSocialUrl(data.social_instagram) },
        { key: "facebook", label: "Facebook", url: normalizeSocialUrl(data.social_facebook) },
        { key: "tiktok", label: "TikTok", url: normalizeSocialUrl(data.social_tiktok) },
        { key: "youtube", label: "YouTube", url: normalizeSocialUrl(data.social_youtube) }
      ];
      return links.filter((item) => item.url);
    });
    const hasStoreSocialLinks = computed(() => storeSocialLinks.value.length > 0);
    const normalizeMenuPages = (value) => {
      const pages = Array.isArray(value) ? value : [];
      const sanitized = pages.filter((page2) => page2?.url).slice(0, 12).map((page2, index) => ({
        id: String(page2?.id || `${Date.now()}-${index}`),
        url: String(page2.url),
        label: String(page2?.label || "")
      }));
      if (sanitized.length) return sanitized;
      if (tenantStore.data?.menu_file_url) {
        return [{
          id: "legacy-menu",
          url: String(tenantStore.data?.menu_file_url),
          label: "Carta principal"
        }];
      }
      return [];
    };
    const menuPages = computed(() => normalizeMenuPages(tenantStore.data?.menu_pages));
    const hasMenuPages = computed(() => menuPages.value.length > 0);
    const menuPageCount = computed(() => menuPages.value.length);
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
    const typeTheme = computed(() => {
      const byType = {
        retail: {
          shellClass: "bg-slate-50",
          heroClass: "border-slate-200 bg-white",
          pattern: "radial-gradient(circle at 80% 20%, rgba(148,163,184,0.16), transparent 40%)",
          badgeLabel: "Top ventas",
          badgeClass: "border-slate-300 bg-slate-100 text-slate-700",
          title: "Lo mejor de esta tienda, listo para llevar hoy",
          subtitle: "Descubre productos destacados, aprovecha ofertas y compra en segundos.",
          chipOne: "Ofertas que se agotan rapido",
          chipTwo: "Compra inteligente por categoria"
        },
        fast_food: {
          shellClass: "bg-slate-50",
          heroClass: "border-slate-200 bg-white",
          pattern: "repeating-linear-gradient(135deg, rgba(234,88,12,0.12) 0px, rgba(234,88,12,0.12) 8px, transparent 8px, transparent 16px)",
          badgeLabel: "Menú rápido",
          badgeClass: "border-slate-300 bg-slate-100 text-slate-900",
          title: "Si tienes un bajon, aqui llega tu antojo en minutos",
          subtitle: "Combos irresistibles, pedido rapido y sabor que te salva el dia.",
          chipOne: "Promos para hoy",
          chipTwo: "Llego tu momento de comer rico"
        },
        bakery: {
          shellClass: "bg-slate-50",
          heroClass: "border-slate-200 bg-white",
          pattern: "radial-gradient(circle at 15% 25%, rgba(251,113,133,0.15), transparent 35%), radial-gradient(circle at 80% 60%, rgba(251,191,36,0.12), transparent 40%)",
          badgeLabel: "Vitrina dulce",
          badgeClass: "border-slate-300 bg-slate-100 text-slate-900",
          title: "Recien horneado para convertir cualquier momento en premio",
          subtitle: "Pasteles, tortas y pan recien hechos para enamorarte desde la vitrina.",
          chipOne: "Dulces que conquistan",
          chipTwo: "Encarga y celebra a lo grande"
        },
        pharmacy: {
          shellClass: "bg-slate-50",
          heroClass: "border-slate-200 bg-white",
          pattern: "linear-gradient(90deg, rgba(6,182,212,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(6,182,212,0.08) 1px, transparent 1px)",
          badgeLabel: "Salud y bienestar",
          badgeClass: "border-slate-300 bg-slate-100 text-slate-900",
          title: "Tu bienestar primero, con todo lo esencial en un solo lugar",
          subtitle: "Compra con confianza productos clave para cuidarte hoy mismo.",
          chipOne: "Confianza y respaldo",
          chipTwo: "Todo para cuidarte mejor"
        },
        fashion: {
          shellClass: "bg-slate-50",
          heroClass: "border-slate-200 bg-white",
          pattern: "repeating-linear-gradient(120deg, rgba(168,85,247,0.12) 0px, rgba(168,85,247,0.12) 6px, transparent 6px, transparent 16px)",
          badgeLabel: "Colección de moda",
          badgeClass: "border-slate-300 bg-slate-100 text-slate-900",
          title: "Tu proximo look viral comienza en esta coleccion",
          subtitle: "Prendas con estilo, tendencia y personalidad para destacar sin esfuerzo.",
          chipOne: "Nuevos drops",
          chipTwo: "Vistete para impactar"
        },
        bookstore: {
          shellClass: "bg-slate-50",
          heroClass: "border-slate-200 bg-white",
          pattern: "repeating-linear-gradient(0deg, rgba(99,102,241,0.11) 0px, rgba(99,102,241,0.11) 2px, transparent 2px, transparent 14px)",
          badgeLabel: "Estantería digital",
          badgeClass: "border-slate-300 bg-slate-100 text-slate-900",
          title: "Abre un libro y enciende tu proxima gran historia",
          subtitle: "Explora titulos seleccionados para aprender, inspirarte y disfrutar.",
          chipOne: "Selecciones que atrapan",
          chipTwo: "Tu siguiente lectura ideal"
        }
      };
      return byType[storeType.value] || byType.retail;
    });
    const pageShellClass = computed(() => typeTheme.value.shellClass);
    const catalogHeroClass = computed(() => typeTheme.value.heroClass);
    const heroPatternEnabled = computed(() => tenantStore.data?.hero_pattern_enabled ?? true);
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
    const heroPatternStyle = computed(() => {
      if (!heroPatternEnabled.value) return { backgroundImage: "none" };
      const style = String(tenantStore.data?.hero_pattern_style || "type");
      if (style === "none") return { backgroundImage: "none" };
      if (style === "type") return { backgroundImage: typeTheme.value.pattern };
      return { backgroundImage: customPatternMap[style] || typeTheme.value.pattern };
    });
    const catalogBadgeLabel = computed(() => typeTheme.value.badgeLabel);
    const catalogBadgeClass = computed(() => typeTheme.value.badgeClass);
    const catalogHeaderTitle = computed(() => typeTheme.value.title);
    const catalogHeaderSubtitle = computed(() => typeTheme.value.subtitle);
    const catalogChipOne = computed(() => typeTheme.value.chipOne);
    const catalogChipTwo = computed(() => typeTheme.value.chipTwo);
    const pageShellStyle = computed(() => ({
      backgroundImage: `radial-gradient(circle at 15% 0%, ${hexToRgba(accentColor.value, 0.08)}, transparent 42%)`
    }));
    const catalogHeroStyle = computed(() => ({
      borderColor: hexToRgba(accentColor.value, 0.34),
      backgroundImage: `linear-gradient(120deg, ${hexToRgba(theme.gradientFrom, 0.24)}, ${hexToRgba(theme.gradientTo, 0.08)})`
    }));
    const catalogBadgeStyle = computed(() => ({
      borderColor: hexToRgba(accentColor.value, 0.5),
      backgroundColor: hexToRgba(accentColor.value, 0.2),
      color: "#0f172a"
    }));
    const layoutPanelStyle = computed(() => ({ borderColor: hexToRgba(accentColor.value, 0.34) }));
    const layoutMediaStyle = computed(() => ({ borderColor: hexToRgba(accentColor.value, 0.28) }));
    const layoutMetaStyle = computed(() => ({ color: accentColor.value }));
    const layoutMode = computed(() => {
      if (storeType.value === "fast_food") return "fast_food";
      if (storeType.value === "bakery") return "bakery";
      if (storeType.value === "pharmacy") return "pharmacy";
      return "grid";
    });
    const productGridClass = computed(() => {
      if (storeType.value === "fashion") return "grid gap-5 sm:grid-cols-2 lg:grid-cols-4";
      if (storeType.value === "bookstore") return "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
      return "grid gap-5 sm:grid-cols-2 lg:grid-cols-3";
    });
    const productTimestamp = (product) => {
      const raw = product?.created_at || product?.created || product?.updated_at || product?.id;
      const time = new Date(raw).getTime();
      return Number.isFinite(time) ? time : Number(product?.id || 0);
    };
    const productPriceValue = (product) => Number(product?.offer_price || product?.price || 0);
    const productStockValue = (product) => normalizeStock(product?.stock_available);
    const sortedProductsByType = (items) => {
      const list = [...items];
      if (storeType.value === "fast_food") {
        return list.sort((a, b) => {
          const stockDiff = productStockValue(b) - productStockValue(a);
          if (stockDiff) return stockDiff;
          const offerDiff = Number(Boolean(b?.offer_price)) - Number(Boolean(a?.offer_price));
          if (offerDiff) return offerDiff;
          return productTimestamp(b) - productTimestamp(a);
        });
      }
      if (storeType.value === "bakery") {
        return list.sort((a, b) => {
          const categoryA = String(a?.category?.name || a?.category || "General");
          const categoryB = String(b?.category?.name || b?.category || "General");
          const byCategory = categoryA.localeCompare(categoryB);
          if (byCategory) return byCategory;
          return productTimestamp(b) - productTimestamp(a);
        });
      }
      if (storeType.value === "pharmacy") {
        return list.sort((a, b) => {
          const stockDiff = productStockValue(b) - productStockValue(a);
          if (stockDiff) return stockDiff;
          return String(a?.name || "").localeCompare(String(b?.name || ""));
        });
      }
      if (storeType.value === "fashion") {
        return list.sort((a, b) => {
          const offerDiff = Number(Boolean(b?.offer_price)) - Number(Boolean(a?.offer_price));
          if (offerDiff) return offerDiff;
          return productTimestamp(b) - productTimestamp(a);
        });
      }
      if (storeType.value === "bookstore") {
        return list.sort((a, b) => {
          const categoryA = String(a?.category?.name || a?.category || "General");
          const categoryB = String(b?.category?.name || b?.category || "General");
          const byCategory = categoryA.localeCompare(categoryB);
          if (byCategory) return byCategory;
          return String(a?.name || "").localeCompare(String(b?.name || ""));
        });
      }
      return list.sort((a, b) => {
        const offerDiff = Number(Boolean(b?.offer_price)) - Number(Boolean(a?.offer_price));
        if (offerDiff) return offerDiff;
        const priceDiff = productPriceValue(a) - productPriceValue(b);
        if (priceDiff) return priceDiff;
        return productTimestamp(b) - productTimestamp(a);
      });
    };
    const filteredProducts = computed(() => {
      const term = searchQuery.value.trim().toLowerCase();
      const base = !term ? tenantStore.productos || [] : (tenantStore.productos || []).filter((product) => matchesSearch(product, term));
      const sortedByType = sortedProductsByType(base);
      if (sortMode.value === "recommended") return sortedByType;
      if (sortMode.value === "name_asc") {
        return [...sortedByType].sort((a, b) => String(a?.name || "").localeCompare(String(b?.name || "")));
      }
      if (sortMode.value === "name_desc") {
        return [...sortedByType].sort((a, b) => String(b?.name || "").localeCompare(String(a?.name || "")));
      }
      if (sortMode.value === "price_asc") {
        return [...sortedByType].sort((a, b) => productPriceValue(a) - productPriceValue(b));
      }
      return [...sortedByType].sort((a, b) => productPriceValue(b) - productPriceValue(a));
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)));
    const paginatedProducts = computed(() => {
      const start = (page.value - 1) * perPage;
      return filteredProducts.value.slice(start, start + perPage);
    });
    const fastFoodSections = computed(() => {
      if (layoutMode.value !== "fast_food") return [];
      const defaults = ["Combos", "Hamburguesas", "Papas y acompañamientos", "Bebidas", "Bebestibles", "Salsas", "Postres", "Otros"];
      const present = new Set(
        paginatedProducts.value.map((product) => normalizeFastFoodCategory(String(product?.category?.name || product?.category || "General")))
      );
      const ordered = defaults.filter((item) => present.has(item));
      const extras = Array.from(present).filter((item) => !ordered.includes(item));
      return [...ordered, ...extras];
    });
    const groupedLayoutProducts = computed(() => {
      const grouped = /* @__PURE__ */ new Map();
      paginatedProducts.value.forEach((product) => {
        const category = layoutMode.value === "fast_food" ? normalizeFastFoodCategory(String(product?.category?.name || product?.category || "General")) : String(product?.category?.name || product?.category || "General");
        if (!grouped.has(category)) grouped.set(category, []);
        grouped.get(category).push(product);
      });
      return Array.from(grouped.entries()).map(([category, products]) => ({ category, products })).sort((a, b) => {
        if (layoutMode.value !== "fast_food") return a.category.localeCompare(b.category);
        const order = new Map(fastFoodSections.value.map((section, index) => [section, index]));
        return (order.get(a.category) ?? 999) - (order.get(b.category) ?? 999);
      });
    });
    const visibleFastFoodGroups = computed(() => {
      if (layoutMode.value !== "fast_food") return groupedLayoutProducts.value;
      if (!selectedFastFoodSection.value) return groupedLayoutProducts.value;
      return groupedLayoutProducts.value.filter((g) => g.category === selectedFastFoodSection.value);
    });
    const pageStart = computed(() => filteredProducts.value.length ? (page.value - 1) * perPage + 1 : 0);
    const pageEnd = computed(() => Math.min(page.value * perPage, filteredProducts.value.length));
    const suggestedDrinks = computed(() => {
      const drinks = (tenantStore.productos || []).filter((product) => {
        const category = normalizeFastFoodCategory(String(product?.category?.name || product?.category || ""));
        return category === "Bebidas" || category === "Bebestibles";
      }).map((product) => String(product?.name || "").trim()).filter(Boolean);
      return Array.from(new Set(drinks)).slice(0, 8);
    });
    const addonProducts = computed(() => {
      return (tenantStore.productos || []).filter((product) => {
        const category = String(product?.category?.name || product?.category || "").toLowerCase().trim();
        return category === "agregados";
      }).map((product) => ({
        id: product?.id,
        name: String(product?.name || "").trim(),
        price: getProductUnitPrice(product)
      })).filter((product) => product.name);
    });
    const parseMoney = (value) => {
      if (typeof value === "number") return Number.isFinite(value) ? value : 0;
      if (typeof value === "string") {
        const cleaned = value.replace(/[^\d.,-]/g, "").trim();
        if (!cleaned) return 0;
        const normalized = cleaned.includes(",") && cleaned.includes(".") ? cleaned.replace(/\./g, "").replace(",", ".") : cleaned.replace(",", ".");
        const parsed2 = Number(normalized);
        return Number.isFinite(parsed2) ? parsed2 : 0;
      }
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const getProductUnitPrice = (product) => {
      const offer = parseMoney(product?.offer_price);
      if (offer > 0) return offer;
      return parseMoney(product?.price);
    };
    const comboPreviewPrice = computed(() => {
      const base = getProductUnitPrice(activeComboProduct.value);
      const storeData = tenantStore.data || {};
      const sizeExtra = comboConfig.value.size === "grande" ? Number(storeData.extra_size_large_price || 1200) : 0;
      const friesExtra = comboConfig.value.fries === "grandes" ? Number(storeData.extra_fries_large_price || 1400) : comboConfig.value.fries === "medianas" ? Number(storeData.extra_fries_medium_price || 900) : 0;
      const drinkExtra = comboConfig.value.drink && comboConfig.value.drink !== "Sin bebida" ? Number(storeData.extra_drink_price || 1e3) : 0;
      const saucesExtra = comboConfig.value.sauces.length * Number(storeData.extra_sauce_price || 250);
      const addonsExtra = comboConfig.value.addons.reduce((acc, addon) => acc + parseMoney(addon.price), 0);
      return Math.max(0, base + sizeExtra + friesExtra + drinkExtra + saucesExtra + addonsExtra);
    });
    const deleteProduct = async (product) => {
      if (!isStoreOwner.value) {
        (void 0).alert("Solo el dueño puede eliminar productos");
        return;
      }
      if (!auth.token || !product?.id) {
        (void 0).alert("Inicia sesión para eliminar productos");
        return;
      }
      const confirmed = (void 0).confirm("¿Eliminar este producto?");
      if (!confirmed) return;
      const doDelete = async () => $fetch(`${config.public.apiBase}/store/${slug}/admin/catalogo/products/${product.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      try {
        await doDelete();
        await tenantStore.fetchProductos();
      } catch (error) {
        const code = error?.response?._data?.code;
        if (code === "token_not_valid" && auth.refreshToken) {
          const refreshed = await auth.refreshTokens();
          if (refreshed) {
            try {
              await doDelete();
              await tenantStore.fetchProductos();
              return;
            } catch (e) {
              console.error("Reintento de eliminación falló", e);
            }
          }
        }
        console.error("No pudimos eliminar el producto", error);
        (void 0).alert("No pudimos eliminar el producto");
      }
    };
    const matchesSearch = (product, term) => {
      if (!term) return true;
      const fields = [product?.name, product?.description, product?.category?.name, product?.slug];
      return fields.some((value) => {
        const text = value?.toString?.();
        return text ? text.toLowerCase().includes(term) : false;
      });
    };
    const normalizeStock = (value) => {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const formatPrice = (product) => {
      const value = Number(product?.offer_price || product?.price || 0);
      return formatCurrency(value);
    };
    const formatCurrency = (value) => {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(Number(value) || 0);
    };
    const formatStockLabel = (value) => {
      const stock = normalizeStock(value);
      if (stock <= 0) return "Sin stock";
      if (stock <= 5) return `Stock bajo (${stock})`;
      return `${stock} en inventario`;
    };
    const quickAddToCart = (product) => {
      if (!storeCartEnabled.value) return;
      const stock = normalizeStock(product?.stock_available);
      if (stock <= 0) return;
      cart.setContext(slug);
      cart.addProduct(product);
    };
    const normalizeFastFoodCategory = (rawCategory) => {
      const value = String(rawCategory || "").toLowerCase().trim();
      if (/combo/.test(value)) return "Combos";
      if (/burger|hamburguesa/.test(value)) return "Hamburguesas";
      if (/papa|acompañ|acompani|side/.test(value)) return "Papas y acompañamientos";
      if (/bebida/.test(value)) return "Bebidas";
      if (/bebestible|jugo|gaseosa|soda/.test(value)) return "Bebestibles";
      if (/salsa|dip/.test(value)) return "Salsas";
      if (/postre|helado|dessert/.test(value)) return "Postres";
      return rawCategory || "Otros";
    };
    const resetComboBuilder = () => {
      comboConfig.value = {
        size: "regular",
        fries: "medianas",
        drink: suggestedDrinks.value[0] || "Sin bebida",
        sauces: [],
        addons: []
      };
    };
    const openComboBuilder = (product) => {
      activeComboProduct.value = product;
      resetComboBuilder();
      comboBuilderOpen.value = true;
    };
    watch(
      () => selectedCategory.value,
      async (slugCat) => {
        page.value = 1;
        const params = {};
        if (slugCat) params.category = slugCat;
        await tenantStore.fetchProductos(params);
      }
    );
    watch(searchQuery, () => {
      page.value = 1;
    });
    watch(sortMode, () => {
      page.value = 1;
    });
    watch(filteredProducts, () => {
      if (page.value > totalPages.value) page.value = totalPages.value;
    });
    watch(
      fastFoodSections,
      (sections) => {
        if (!sections.length) return;
        if (!sections.includes(selectedFastFoodSection.value)) {
          selectedFastFoodSection.value = sections[0];
        }
      },
      { immediate: true }
    );
    watch(menuPages, (pages) => {
      if (activeMenuPageIndex.value >= pages.length) {
        activeMenuPageIndex.value = 0;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ProductCard = ProductCard;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["px-4 py-10", pageShellClass.value],
        style: pageShellStyle.value
      }, _attrs))}><div class="mx-auto max-w-6xl space-y-6"><section class="${ssrRenderClass([catalogHeroClass.value, "relative overflow-hidden rounded-3xl border p-5 shadow-sm md:p-6"])}" style="${ssrRenderStyle(catalogHeroStyle.value)}"><div class="absolute inset-0 opacity-80" style="${ssrRenderStyle(heroPatternStyle.value)}" aria-hidden="true"></div><div class="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p class="${ssrRenderClass([catalogBadgeClass.value, "inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]"])}" style="${ssrRenderStyle(catalogBadgeStyle.value)}">${ssrInterpolate(catalogBadgeLabel.value)}</p><h1 class="mt-2 text-3xl font-bold text-slate-900">${ssrInterpolate(catalogHeaderTitle.value)}</h1><p class="text-slate-700">${ssrInterpolate(catalogHeaderSubtitle.value)}</p><div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-700"><span class="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1">${ssrInterpolate(catalogChipOne.value)}</span><span class="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1">${ssrInterpolate(catalogChipTwo.value)}</span></div></div><div class="flex flex-wrap items-center gap-2">`);
      if (storeCartEnabled.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${unref(slug)}/carrito`,
          class: "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow",
          style: accentStyle.value
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ShoppingCart), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Carrito `);
            } else {
              return [
                createVNode(unref(ShoppingCart), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createTextVNode(" Carrito ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (showMenuSection.value && hasMenuPages.value) {
        _push(`<button class="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"> Ver menú </button>`);
      } else {
        _push(`<!---->`);
      }
      if (isStoreOwner.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${unref(slug)}/productos/crear`,
          class: "rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` + Agregar producto `);
            } else {
              return [
                createTextVNode(" + Agregar producto ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(tenantStore).categories.length) {
        _push(`<select class="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700"><option value=""${ssrIncludeBooleanAttr(Array.isArray(selectedCategory.value) ? ssrLooseContain(selectedCategory.value, "") : ssrLooseEqual(selectedCategory.value, "")) ? " selected" : ""}>Todas las categorías</option><!--[-->`);
        ssrRenderList(unref(tenantStore).categories, (cat) => {
          _push(`<option${ssrRenderAttr("value", cat.slug)}${ssrIncludeBooleanAttr(Array.isArray(selectedCategory.value) ? ssrLooseContain(selectedCategory.value, cat.slug) : ssrLooseEqual(selectedCategory.value, cat.slug)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
        });
        _push(`<!--]--></select>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-full sm:w-64"><label class="sr-only" for="catalog-search">Buscar producto</label><input id="catalog-search"${ssrRenderAttr("value", searchQuery.value)} type="search" placeholder="Buscar producto o categoría..." class="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"></div><select class="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700"><option value="recommended"${ssrIncludeBooleanAttr(Array.isArray(sortMode.value) ? ssrLooseContain(sortMode.value, "recommended") : ssrLooseEqual(sortMode.value, "recommended")) ? " selected" : ""}>Orden recomendado</option><option value="name_asc"${ssrIncludeBooleanAttr(Array.isArray(sortMode.value) ? ssrLooseContain(sortMode.value, "name_asc") : ssrLooseEqual(sortMode.value, "name_asc")) ? " selected" : ""}>A → Z</option><option value="name_desc"${ssrIncludeBooleanAttr(Array.isArray(sortMode.value) ? ssrLooseContain(sortMode.value, "name_desc") : ssrLooseEqual(sortMode.value, "name_desc")) ? " selected" : ""}>Z → A</option><option value="price_asc"${ssrIncludeBooleanAttr(Array.isArray(sortMode.value) ? ssrLooseContain(sortMode.value, "price_asc") : ssrLooseEqual(sortMode.value, "price_asc")) ? " selected" : ""}>Precio: menor a mayor</option><option value="price_desc"${ssrIncludeBooleanAttr(Array.isArray(sortMode.value) ? ssrLooseContain(sortMode.value, "price_desc") : ssrLooseEqual(sortMode.value, "price_desc")) ? " selected" : ""}>Precio: mayor a menor</option></select></div></div></section>`);
      if (showMenuSection.value) {
        _push(`<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Menú</p><h2 class="text-xl font-bold text-slate-900">Carta digital de la tienda</h2><p class="text-sm text-slate-600">Revisa el menú completo antes de elegir tus productos.</p></div><div class="flex items-center gap-2"><span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">${ssrInterpolate(menuPageCount.value)} página${ssrInterpolate(menuPageCount.value === 1 ? "" : "s")}</span>`);
        if (hasMenuPages.value) {
          _push(`<button class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"> Ver menú </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (showWhatsAppCTA.value) {
        _push(`<section class="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.2em] text-emerald-700">WhatsApp</p><h2 class="text-xl font-bold text-emerald-900">Agenda tu pedido por WhatsApp</h2><p class="text-sm text-emerald-800">Número de la tienda: ${ssrInterpolate(storeWhatsAppDisplay.value)}</p></div>`);
        if (hasStoreWhatsApp.value) {
          _push(`<a${ssrRenderAttr("href", storeWhatsAppUrl.value)} target="_blank" rel="noopener" class="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"> Agendar por WhatsApp </a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></section>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(tenantStore).loading) {
        _push(`<div class="text-slate-500">Cargando productos...</div>`);
      } else if (!filteredProducts.value.length) {
        _push(`<div class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">${ssrInterpolate(unref(tenantStore).productos.length ? "No encontramos productos con los filtros aplicados." : "No hay productos para esta tienda todavía.")}</div>`);
      } else {
        _push(`<div>`);
        if (layoutMode.value === "fast_food") {
          _push(`<div class="space-y-5"><div class="flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(fastFoodSections.value, (section) => {
            _push(`<button type="button" class="${ssrRenderClass([selectedFastFoodSection.value === section ? "text-white" : "border-slate-300 bg-white text-slate-700 hover:border-slate-400", "rounded-full border px-3 py-1.5 text-xs font-semibold transition"])}" style="${ssrRenderStyle(selectedFastFoodSection.value === section ? accentStyle.value : {})}">${ssrInterpolate(section)}</button>`);
          });
          _push(`<!--]--></div><!--[-->`);
          ssrRenderList(visibleFastFoodGroups.value, (group) => {
            _push(`<section class="rounded-2xl border bg-white/90 p-4 shadow-sm" style="${ssrRenderStyle(layoutPanelStyle.value)}"><div class="mb-3 flex items-center justify-between"><h2 class="text-lg font-extrabold text-slate-900">${ssrInterpolate(group.category)}</h2><span class="text-xs font-semibold uppercase tracking-[0.16em]" style="${ssrRenderStyle(layoutMetaStyle.value)}">${ssrInterpolate(group.products.length)} opciones</span></div><div class="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory"><!--[-->`);
            ssrRenderList(group.products, (product) => {
              _push(ssrRenderComponent(_component_NuxtLink, {
                key: product.id,
                to: productDetailPath(product),
                class: "min-w-[220px] max-w-[220px] snap-start overflow-hidden rounded-xl border bg-white shadow-sm",
                style: layoutMediaStyle.value
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`<div class="relative h-28 bg-slate-100"${_scopeId}><img${ssrRenderAttr("src", unref(getProductImage)(product) || "/logoPW.png")}${ssrRenderAttr("alt", product.name || "Producto")} class="h-full w-full object-cover"${_scopeId}></div><div class="space-y-1 p-3"${_scopeId}><p class="line-clamp-2 text-sm font-bold text-slate-900"${_scopeId}>${ssrInterpolate(product.name)}</p><p class="text-base font-extrabold" style="${ssrRenderStyle({ color: accentColor.value })}"${_scopeId}>${ssrInterpolate(formatPrice(product))}</p><button style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(!storeCartEnabled.value) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-60 cursor-not-allowed": !storeCartEnabled.value }, "mt-1 inline-flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-semibold text-white"])}"${_scopeId}>${ssrInterpolate(storeCartEnabled.value ? "Agregar rápido" : "Carrito deshabilitado")}</button><button class="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"${_scopeId}> Personalizar combo </button></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative h-28 bg-slate-100" }, [
                        createVNode("img", {
                          src: unref(getProductImage)(product) || "/logoPW.png",
                          alt: product.name || "Producto",
                          class: "h-full w-full object-cover"
                        }, null, 8, ["src", "alt"])
                      ]),
                      createVNode("div", { class: "space-y-1 p-3" }, [
                        createVNode("p", { class: "line-clamp-2 text-sm font-bold text-slate-900" }, toDisplayString(product.name), 1),
                        createVNode("p", {
                          class: "text-base font-extrabold",
                          style: { color: accentColor.value }
                        }, toDisplayString(formatPrice(product)), 5),
                        createVNode("button", {
                          class: ["mt-1 inline-flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-semibold text-white", { "opacity-60 cursor-not-allowed": !storeCartEnabled.value }],
                          style: accentStyle.value,
                          disabled: !storeCartEnabled.value,
                          onClick: withModifiers(($event) => quickAddToCart(product), ["prevent"])
                        }, toDisplayString(storeCartEnabled.value ? "Agregar rápido" : "Carrito deshabilitado"), 15, ["disabled", "onClick"]),
                        createVNode("button", {
                          class: "mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50",
                          onClick: withModifiers(($event) => openComboBuilder(product), ["prevent"])
                        }, " Personalizar combo ", 8, ["onClick"])
                      ])
                    ];
                  }
                }),
                _: 2
              }, _parent));
            });
            _push(`<!--]--></div></section>`);
          });
          _push(`<!--]--></div>`);
        } else if (layoutMode.value === "bakery") {
          _push(`<div class="space-y-5"><!--[-->`);
          ssrRenderList(groupedLayoutProducts.value, (group) => {
            _push(`<section class="rounded-2xl border bg-white/90 p-4 shadow-sm" style="${ssrRenderStyle(layoutPanelStyle.value)}"><div class="mb-3 flex items-center justify-between"><h2 class="text-lg font-extrabold text-slate-900">${ssrInterpolate(group.category)}</h2><span class="text-xs font-semibold uppercase tracking-[0.16em]" style="${ssrRenderStyle(layoutMetaStyle.value)}">Vitrina</span></div><div class="grid gap-4 md:grid-cols-2"><!--[-->`);
            ssrRenderList(group.products, (product) => {
              _push(ssrRenderComponent(_component_ProductCard, {
                key: product.id,
                product,
                accent: accentColor.value,
                "disable-cart": !storeCartEnabled.value,
                canManage: isStoreOwner.value,
                onDelete: deleteProduct,
                editUrl: productDetailPath(product)
              }, null, _parent));
            });
            _push(`<!--]--></div></section>`);
          });
          _push(`<!--]--></div>`);
        } else if (layoutMode.value === "pharmacy") {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(paginatedProducts.value, (product) => {
            _push(`<article class="flex flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center" style="${ssrRenderStyle(layoutPanelStyle.value)}">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: productDetailPath(product),
              class: "h-24 w-full overflow-hidden rounded-xl border bg-slate-100 sm:w-28",
              style: layoutMediaStyle.value
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<img${ssrRenderAttr("src", unref(getProductImage)(product) || "/logoPW.png")}${ssrRenderAttr("alt", product.name || "Producto")} class="h-full w-full object-cover"${_scopeId}>`);
                } else {
                  return [
                    createVNode("img", {
                      src: unref(getProductImage)(product) || "/logoPW.png",
                      alt: product.name || "Producto",
                      class: "h-full w-full object-cover"
                    }, null, 8, ["src", "alt"])
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<div class="min-w-0 flex-1"><p class="text-xs font-semibold uppercase tracking-[0.16em]" style="${ssrRenderStyle(layoutMetaStyle.value)}">${ssrInterpolate(product?.category?.name || "General")}</p>`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: productDetailPath(product),
              class: "line-clamp-2 text-base font-bold text-slate-900 hover:underline"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(product.name)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(product.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
            _push(`<p class="mt-1 text-sm text-slate-600">${ssrInterpolate(formatStockLabel(product?.stock_available))}</p></div><div class="flex flex-col items-start gap-2 sm:items-end"><p class="text-lg font-extrabold" style="${ssrRenderStyle({ color: accentColor.value })}">${ssrInterpolate(formatPrice(product))}</p><button style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(!storeCartEnabled.value) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-60 cursor-not-allowed": !storeCartEnabled.value }, "inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-white"])}">${ssrInterpolate(storeCartEnabled.value ? "Agregar" : "Carrito deshabilitado")}</button></div></article>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<div class="${ssrRenderClass(productGridClass.value)}"><!--[-->`);
          ssrRenderList(paginatedProducts.value, (product) => {
            _push(ssrRenderComponent(_component_ProductCard, {
              key: product.id,
              product,
              accent: accentColor.value,
              "disable-cart": !storeCartEnabled.value,
              canManage: isStoreOwner.value,
              onDelete: deleteProduct,
              editUrl: productDetailPath(product)
            }, null, _parent));
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      }
      if (filteredProducts.value.length > perPage) {
        _push(`<div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800"><button class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(pageStart.value)}-${ssrInterpolate(pageEnd.value)} de ${ssrInterpolate(filteredProducts.value.length)}</p><button class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div class="flex flex-wrap items-center justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Síguenos</p><h2 class="text-xl font-bold text-slate-900">Redes sociales de la tienda</h2><p class="text-sm text-slate-600">Mantente al día con promociones, nuevos productos y horarios especiales.</p></div>`);
      if (hasStoreSocialLinks.value) {
        _push(`<div class="flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(storeSocialLinks.value, (social) => {
          _push(`<a${ssrRenderAttr("href", social.url)} target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300">`);
          if (social.key === "instagram") {
            _push(ssrRenderComponent(unref(Instagram), { class: "h-4 w-4 text-pink-600" }, null, _parent));
          } else if (social.key === "facebook") {
            _push(ssrRenderComponent(unref(Facebook), { class: "h-4 w-4 text-blue-600" }, null, _parent));
          } else if (social.key === "tiktok") {
            _push(ssrRenderComponent(unref(Music2), { class: "h-4 w-4 text-slate-900" }, null, _parent));
          } else if (social.key === "youtube") {
            _push(ssrRenderComponent(unref(Youtube), { class: "h-4 w-4 text-red-600" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(social.label)}</a>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<p class="text-sm text-slate-500">Esta tienda aún no configura sus redes sociales.</p>`);
      }
      _push(`</div></section>`);
      if (comboBuilderOpen.value && activeComboProduct.value) {
        _push(`<div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4 py-8"><div class="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl"><div class="flex items-start justify-between gap-3"><div><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Constructor de combo</p><h3 class="text-xl font-bold text-slate-900">${ssrInterpolate(activeComboProduct.value.name)}</h3><p class="text-sm text-slate-600">Arma tu pedido al estilo comida rápida.</p></div><button class="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-600">✕</button></div><div class="mt-4 space-y-4"><div><p class="text-sm font-semibold text-slate-800">Tamaño</p><div class="mt-2 flex gap-2"><button type="button" class="${ssrRenderClass([comboConfig.value.size === "regular" ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 bg-white text-slate-700", "rounded-lg border px-3 py-2 text-sm"])}">Regular</button><button type="button" class="${ssrRenderClass([comboConfig.value.size === "grande" ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 bg-white text-slate-700", "rounded-lg border px-3 py-2 text-sm"])}">Grande (+$${ssrInterpolate(unref(tenantStore).data?.extra_size_large_price || 1200)})</button></div></div><div><p class="text-sm font-semibold text-slate-800">Papas fritas</p><div class="mt-2 flex flex-wrap gap-2"><!--[-->`);
        ssrRenderList(friesOptions, (option) => {
          _push(`<button type="button" class="${ssrRenderClass([comboConfig.value.fries === option.value ? "bg-slate-900 text-white border-slate-900" : "border-slate-200 bg-white text-slate-700", "rounded-lg border px-3 py-2 text-sm"])}">`);
          if (option.value === "ninguna") {
            _push(`<span>${ssrInterpolate(option.label)}</span>`);
          } else if (option.value === "medianas") {
            _push(`<span>Medianas (+$${ssrInterpolate(unref(tenantStore).data?.extra_fries_medium_price || 900)})</span>`);
          } else {
            _push(`<span>Grandes (+$${ssrInterpolate(unref(tenantStore).data?.extra_fries_large_price || 1400)})</span>`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div><div><p class="text-sm font-semibold text-slate-800">Bebida</p><select class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"><option value="Sin bebida"${ssrIncludeBooleanAttr(Array.isArray(comboConfig.value.drink) ? ssrLooseContain(comboConfig.value.drink, "Sin bebida") : ssrLooseEqual(comboConfig.value.drink, "Sin bebida")) ? " selected" : ""}>Sin bebida</option><!--[-->`);
        ssrRenderList(suggestedDrinks.value, (drink) => {
          _push(`<option${ssrRenderAttr("value", drink)}${ssrIncludeBooleanAttr(Array.isArray(comboConfig.value.drink) ? ssrLooseContain(comboConfig.value.drink, drink) : ssrLooseEqual(comboConfig.value.drink, drink)) ? " selected" : ""}>${ssrInterpolate(drink)} (+$${ssrInterpolate(unref(tenantStore).data?.extra_drink_price || 1e3)})</option>`);
        });
        _push(`<!--]--></select></div><div><p class="text-sm font-semibold text-slate-800">Salsas (+$${ssrInterpolate(unref(tenantStore).data?.extra_sauce_price || 250)} c/u)</p><div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3"><!--[-->`);
        ssrRenderList(sauceOptions, (sauce) => {
          _push(`<label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700"><input${ssrIncludeBooleanAttr(comboConfig.value.sauces.includes(sauce)) ? " checked" : ""} type="checkbox"> ${ssrInterpolate(sauce)}</label>`);
        });
        _push(`<!--]--></div></div><div><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold text-slate-800">Agregados</p><span class="text-xs text-slate-500">Se cobran según el producto</span></div>`);
        if (addonProducts.value.length) {
          _push(`<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"><!--[-->`);
          ssrRenderList(addonProducts.value, (addon) => {
            _push(`<label class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"><span class="flex min-w-0 flex-col"><span class="font-semibold text-slate-900">${ssrInterpolate(addon.name)}</span><span class="text-xs text-slate-500">${ssrInterpolate(formatCurrency(addon.price))}</span></span><input${ssrIncludeBooleanAttr(comboConfig.value.addons.some((item) => String(item.id) === String(addon.id))) ? " checked" : ""} type="checkbox" class="h-4 w-4 accent-emerald-600"></label>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<p class="mt-2 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-500">No hay productos cargados en la categoría Agregados.</p>`);
        }
        _push(`</div></div><div class="mt-5 flex items-center justify-between border-t border-slate-200 pt-4"><p class="text-sm text-slate-700">Total combo: <span class="font-bold text-slate-900">${ssrInterpolate(formatCurrency(comboPreviewPrice.value))}</span></p><button style="${ssrRenderStyle(accentStyle.value)}"${ssrIncludeBooleanAttr(!storeCartEnabled.value) ? " disabled" : ""} class="${ssrRenderClass([{ "opacity-60 cursor-not-allowed": !storeCartEnabled.value }, "rounded-xl px-4 py-2 text-sm font-semibold text-white"])}">${ssrInterpolate(storeCartEnabled.value ? "Agregar combo" : "Carrito deshabilitado")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (menuPanelOpen.value && menuPages.value.length) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6"><div class="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"><div class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5"><div><p class="text-xs uppercase tracking-[0.22em] text-slate-500">Menú de la tienda</p><h3 class="text-lg font-bold text-slate-900">${ssrInterpolate(unref(tenantStore).data?.name || "Tienda")}</h3></div><div class="flex items-center gap-2"><span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Página ${ssrInterpolate(activeMenuPageIndex.value + 1)} de ${ssrInterpolate(menuPages.value.length)}</span><button class="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50">✕</button></div></div><div class="relative flex-1 overflow-hidden bg-slate-100"><img${ssrRenderAttr("src", menuPages.value[activeMenuPageIndex.value]?.url)}${ssrRenderAttr("alt", menuPages.value[activeMenuPageIndex.value]?.label || `Página ${activeMenuPageIndex.value + 1}`)} class="h-full w-full object-contain bg-slate-100">`);
        if (menuPages.value.length > 1) {
          _push(`<button class="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white hover:bg-slate-950/85">‹</button>`);
        } else {
          _push(`<!---->`);
        }
        if (menuPages.value.length > 1) {
          _push(`<button class="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white hover:bg-slate-950/85">›</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex gap-3 overflow-x-auto border-t border-slate-200 bg-white px-4 py-3"><!--[-->`);
        ssrRenderList(menuPages.value, (page2, index) => {
          _push(`<button class="${ssrRenderClass([index === activeMenuPageIndex.value ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200 hover:border-slate-300", "min-w-[92px] overflow-hidden rounded-xl border transition"])}"><img${ssrRenderAttr("src", page2.url)}${ssrRenderAttr("alt", page2.label || `Página ${index + 1}`)} class="h-20 w-full object-cover"></button>`);
        });
        _push(`<!--]--></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/productos/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-B9PwlA5B.mjs.map
