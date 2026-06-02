import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderTeleport, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { useRoute, useRouter } from 'vue-router';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { Menu, Home, Store, LayoutDashboard, Truck, ShoppingBag, Info, Headset, ShoppingCart, LogIn, Bell, UserRound, ShieldCheck, LogOut } from 'lucide-vue-next';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
import { u as useCartStore } from './cart-fX2c5KSU.mjs';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
import { u as useNotificationStore } from './notifications-B61Sz08u.mjs';
import { u as useDashboardAccess } from './useDashboardAccess-C0pUNvlL.mjs';
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

const navButtonBaseClass = "inline-flex h-11 min-w-[104px] items-center justify-center gap-2 rounded-2xl border px-3 text-[13px] font-semibold shadow-sm transition hover:-translate-y-0.5 whitespace-nowrap xl:px-4 xl:text-sm";
const mobileButtonBaseClass = "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-sm transition";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "store",
  __ssrInlineRender: true,
  setup(__props) {
    ref(null);
    const notifMenuStyle = ref("");
    ref(null);
    const menuGeneralStyle = ref("");
    ref(null);
    const accountMenuStyle = ref("");
    const route = useRoute();
    useRouter();
    const slug = computed(() => route.params.slug);
    const tenantStore = useTenantStore();
    const cart = useCartStore();
    const auth = useAuthStore();
    const theme = useThemeStore();
    const config = useRuntimeConfig();
    const { defaultDashboardRoute, hasStores: hasDashboardAccess } = useDashboardAccess();
    const brandName = computed(() => tenantStore.data?.name || "Tu tienda");
    computed(() => (brandName.value || "T")[0]?.toUpperCase?.() || "T");
    const brandLogo = computed(() => tenantStore.data?.logo_url || tenantStore.data?.logo?.url || tenantStore.data?.logo || "");
    const cartAllowedByType = computed(() => ["fast_food", "bakery"].includes(String(tenantStore.data?.store_type || "retail")));
    const storeCartEnabled = computed(() => {
      const value = tenantStore.data?.cart_enabled;
      const hasToggle = value === void 0 || value === null ? true : Boolean(value);
      return cartAllowedByType.value && hasToggle;
    });
    const avatarUrl = computed(() => {
      const base = auth.user?.avatar_url;
      if (!base) return null;
      const version = auth.user?.avatar_updated_at;
      if (!version) return base;
      const joiner = base.includes("?") ? "&" : "?";
      return `${base}${joiner}v=${encodeURIComponent(version)}`;
    });
    const userInitials = computed(() => (auth.user?.username || "U").slice(0, 2).toUpperCase());
    const isPlatformAdmin = computed(() => auth.user?.username === "marko2blea");
    const accentColor = computed(() => theme.accent || "#2563eb");
    const gradientStyle = computed(() => ({ backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom}, ${theme.gradientTo})`, opacity: 0.18 }));
    const hasStoreContext = computed(() => Boolean(slug.value));
    const showMobileNav = ref(false);
    const showGeneralMenu = ref(false);
    const showAccountMenu = ref(false);
    const navButtonClassFor = (targetPath, exact = false) => {
      const isActive = exact ? route.path === targetPath : route.path === targetPath || route.path.startsWith(`${targetPath}/`);
      return isActive ? `${navButtonBaseClass} text-white` : `${navButtonBaseClass} border-slate-900/15 bg-white text-slate-900 hover:bg-slate-50`;
    };
    const navButtonStyleFor = (targetPath, exact = false) => {
      const isActive = exact ? route.path === targetPath : route.path === targetPath || route.path.startsWith(`${targetPath}/`);
      if (!isActive) return {};
      return {
        borderColor: accentColor.value,
        backgroundColor: accentColor.value
      };
    };
    const mobileDangerButtonClass = `${mobileButtonBaseClass} border-red-200 bg-white text-red-600`;
    const mobileButtonClassFor = (targetPath, exact = false) => {
      const isActive = exact ? route.path === targetPath : route.path === targetPath || route.path.startsWith(`${targetPath}/`);
      return isActive ? `${mobileButtonBaseClass} text-white` : `${mobileButtonBaseClass} border-slate-900/10 bg-white text-slate-900`;
    };
    const mobileButtonStyleFor = (targetPath, exact = false) => {
      const isActive = exact ? route.path === targetPath : route.path === targetPath || route.path.startsWith(`${targetPath}/`);
      if (!isActive) return {};
      return {
        borderColor: accentColor.value,
        backgroundColor: accentColor.value
      };
    };
    const notificationStore = useNotificationStore();
    const notifications = computed(() => notificationStore.unread);
    const notificationsCount = computed(() => notificationStore.totalUnread);
    const showNotifications = ref(false);
    const isHydrated = ref(false);
    ref(null);
    ref(false);
    ref("");
    computed(() => {
      if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl;
      if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`;
      return "";
    });
    const canEditBrand = computed(() => {
      const membership = auth.user?.memberships || [];
      return membership.some((m) => m?.store?.slug === slug.value && (m.roles || []).includes("ADMIN"));
    });
    const applyThemeForSlug = () => {
      theme.loadFromStorage();
      theme.applyStoreTheme(slug.value);
    };
    const ensureStoreData = async () => {
      tenantStore.setSlug(slug.value);
      if (!tenantStore.data || tenantStore.data.slug !== slug.value) {
        await tenantStore.fetchTienda();
      }
    };
    const loadNotifications = async () => {
      if (!auth.token) {
        notificationStore.setUnread([]);
        return;
      }
      try {
        const data = await $fetch(
          `${config.public.apiBase}/support/dashboard/summary/`,
          {
            headers: { Authorization: `Bearer ${auth.token}` },
            params: slug.value ? { store: slug.value } : {}
          }
        );
        notificationStore.setUnread(data?.notifications || []);
      } catch (error) {
        console.warn("No se pudieron cargar notificaciones", error);
        notificationStore.setUnread([]);
      }
    };
    watch(
      () => route.params.slug,
      async () => {
        cart.setContext(slug.value);
        await ensureStoreData();
        applyThemeForSlug();
        await loadNotifications();
      }
    );
    watch(
      () => route.fullPath,
      () => {
        showMobileNav.value = false;
        showNotifications.value = false;
        showGeneralMenu.value = false;
        showAccountMenu.value = false;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "premium-shell min-h-screen bg-slate-50 text-slate-900" }, _attrs))}><header class="relative z-50 overflow-visible border-b border-slate-200 bg-white/85 backdrop-blur"><div class="pointer-events-none absolute inset-0" aria-hidden="true"><div class="absolute -left-12 top-6 h-40 w-40 rounded-full" style="${ssrRenderStyle(gradientStyle.value)}"></div><div class="absolute -right-10 -bottom-6 h-48 w-48 rounded-full" style="${ssrRenderStyle(gradientStyle.value)}"></div></div><div class="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6"><div class="flex flex-shrink-0 items-center gap-3"><div class="relative z-30"><button class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50" aria-label="Menú general">`);
      _push(ssrRenderComponent(unref(Menu), {
        class: "h-5 w-5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (showGeneralMenu.value) {
          _push2(`<div><div class="fixed inset-0 z-[99999]"></div><div class="fixed w-48 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-lg z-[100000]" style="${ssrRenderStyle([menuGeneralStyle.value, { "min-width": "180px" }])}"><p class="px-2 text-[11px] uppercase tracking-[0.18em] text-slate-500">General</p><div class="mt-2 space-y-2">`);
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: "/",
            class: "flex items-center gap-2 rounded-xl px-3 py-2 text-slate-800 hover:bg-slate-50"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(unref(Home), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push3(` Menú principal `);
              } else {
                return [
                  createVNode(unref(Home), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createTextVNode(" Menú principal ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push2(ssrRenderComponent(_component_NuxtLink, {
            to: "/marketplace",
            class: "flex items-center gap-2 rounded-xl px-3 py-2 text-slate-800 hover:bg-slate-50"
          }, {
            default: withCtx((_, _push3, _parent2, _scopeId) => {
              if (_push3) {
                _push3(ssrRenderComponent(unref(Store), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push3(` Marketplace `);
              } else {
                return [
                  createVNode(unref(Store), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createTextVNode(" Marketplace ")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (isHydrated.value && unref(auth).isAuthenticated && unref(hasDashboardAccess)) {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: unref(defaultDashboardRoute),
              class: "flex items-center gap-2 rounded-xl px-3 py-2 text-slate-800 hover:bg-slate-50"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(LayoutDashboard), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push3(` Dashboard `);
                } else {
                  return [
                    createVNode(unref(LayoutDashboard), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Dashboard ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          if (isHydrated.value && unref(auth).isAuthenticated) {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/seguimiento",
              class: "flex items-center gap-2 rounded-xl px-3 py-2 text-slate-800 hover:bg-slate-50"
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Truck), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push3(` Ver seguimiento `);
                } else {
                  return [
                    createVNode(unref(Truck), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    }),
                    createTextVNode(" Ver seguimiento ")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div><button${ssrRenderAttr("aria-label", canEditBrand.value ? "Cambiar imagen de la tienda" : "Logo de la tienda")} class="${ssrRenderClass([canEditBrand.value ? "hover:ring-2 hover:ring-slate-300" : "", "relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow ring-1 ring-slate-200"])}">`);
      if (brandLogo.value) {
        _push(`<img${ssrRenderAttr("src", brandLogo.value)} alt="Logo tienda" class="h-full w-full object-cover">`);
      } else {
        _push(`<img src="https://placehold.co/120x120?text=Logo" alt="Logo placeholder" class="h-full w-full object-cover">`);
      }
      if (canEditBrand.value) {
        _push(`<span class="absolute inset-0 flex items-center justify-center bg-black/40 text-[11px] font-semibold text-white opacity-0 transition hover:opacity-100">Cambiar</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><input type="file" accept="image/*" class="hidden"><div class="hidden xl:block">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/store/${slug.value}`,
        class: "text-xl font-semibold leading-tight text-slate-900 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(brandName.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(brandName.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-xs text-slate-600">Catálogo en vivo</p></div></div><nav class="hidden flex-1 flex-nowrap items-center justify-center gap-2 overflow-x-auto md:flex">`);
      if (hasStoreContext.value) {
        _push(`<div class="flex flex-nowrap items-center gap-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${slug.value}`,
          class: navButtonClassFor(`/store/${slug.value}`, true),
          style: navButtonStyleFor(`/store/${slug.value}`, true)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Home), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Inicio `);
            } else {
              return [
                createVNode(unref(Home), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createTextVNode(" Inicio ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${slug.value}/productos`,
          class: navButtonClassFor(`/store/${slug.value}/productos`),
          style: navButtonStyleFor(`/store/${slug.value}/productos`)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ShoppingBag), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Productos `);
            } else {
              return [
                createVNode(unref(ShoppingBag), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createTextVNode(" Productos ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${slug.value}/acerca`,
          class: navButtonClassFor(`/store/${slug.value}/acerca`),
          style: navButtonStyleFor(`/store/${slug.value}/acerca`)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Info), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Acerca de `);
            } else {
              return [
                createVNode(unref(Info), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createTextVNode(" Acerca de ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${slug.value}/soporte`,
          class: navButtonClassFor(`/store/${slug.value}/soporte`),
          style: navButtonStyleFor(`/store/${slug.value}/soporte`)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Headset), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Soporte `);
            } else {
              return [
                createVNode(unref(Headset), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createTextVNode(" Soporte ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</nav><div class="flex flex-shrink-0 flex-nowrap items-center gap-3"><button class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:bg-slate-50 md:hidden" aria-label="Abrir navegación">`);
      _push(ssrRenderComponent(unref(Menu), {
        class: "h-5 w-5",
        "aria-hidden": "true"
      }, null, _parent));
      _push(`</button>`);
      if (storeCartEnabled.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/store/${slug.value}/carrito`,
          class: "relative flex h-10 w-10 items-center justify-center rounded-xl text-white shadow",
          style: { backgroundColor: accentColor.value },
          "aria-label": "Carrito"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ShoppingCart), {
                class: "h-5 w-5",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              if (isHydrated.value && unref(cart).totalItems > 0) {
                _push2(`<span class="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-slate-900"${_scopeId}>${ssrInterpolate(unref(cart).totalItems)}</span>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(unref(ShoppingCart), {
                  class: "h-5 w-5",
                  "aria-hidden": "true"
                }),
                isHydrated.value && unref(cart).totalItems > 0 ? (openBlock(), createBlock("span", {
                  key: 0,
                  class: "absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-xs font-semibold text-slate-900"
                }, toDisplayString(unref(cart).totalItems), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!isHydrated.value || !unref(auth).isAuthenticated) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: navButtonClassFor("/login", true),
          style: navButtonStyleFor("/login", true)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LogIn), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span class="hidden xl:inline"${_scopeId}>Iniciar sesión</span>`);
            } else {
              return [
                createVNode(unref(LogIn), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createVNode("span", { class: "hidden xl:inline" }, "Iniciar sesión")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (isHydrated.value && unref(auth).isAuthenticated) {
        _push(`<div class="flex flex-nowrap items-center gap-2 md:gap-3"><div class="relative flex items-center"><button class="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow ring-1 ring-slate-200 text-slate-800 glass-btn" aria-label="Notificaciones">`);
        _push(ssrRenderComponent(unref(Bell), {
          class: "h-5 w-5",
          "aria-hidden": "true"
        }, null, _parent));
        if (notificationsCount.value > 0) {
          _push(`<span class="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">${ssrInterpolate(notificationsCount.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (showNotifications.value) {
            _push2(`<div><div class="fixed inset-0 z-[99999]"></div><div class="fixed w-64 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-lg z-[100000]" style="${ssrRenderStyle(notifMenuStyle.value)}"><div class="flex items-center justify-between"><p class="font-semibold text-slate-800">Notificaciones</p></div><div class="mt-2 space-y-2 max-h-60 overflow-y-auto">`);
            if (!notifications.value.length) {
              _push2(`<p class="text-slate-500">Sin notificaciones.</p>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(notifications.value, (n, idx) => {
                _push2(`<div class="w-full rounded-lg border border-slate-100 px-2 py-1 text-slate-700">${ssrInterpolate(n.message)}</div>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</div><div class="mt-3 flex items-center justify-between gap-2"><button type="button" class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 hover:border-slate-300"> Borrar notificaciones </button><button type="button" class="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"> Ver notificaciones </button></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        _push(`</div><button type="button" class="${ssrRenderClass([navButtonClassFor("/profile"), "h-11 whitespace-nowrap"])}" style="${ssrRenderStyle(navButtonStyleFor("/profile"))}" aria-label="Abrir menú de perfil">`);
        if (avatarUrl.value) {
          _push(`<span class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100"><img${ssrRenderAttr("src", avatarUrl.value)} alt="Avatar" class="h-full w-full object-cover"></span>`);
        } else {
          _push(`<span class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs uppercase">${ssrInterpolate(userInitials.value)}</span>`);
        }
        _push(`<span class="hidden max-w-[120px] truncate xl:inline">${ssrInterpolate(unref(auth).user?.username || "Perfil")}</span></button>`);
        ssrRenderTeleport(_push, (_push2) => {
          if (showAccountMenu.value) {
            _push2(`<div><div class="fixed inset-0 z-[99999]"></div><div class="fixed z-[100000] w-56 rounded-2xl border border-slate-200 bg-white py-2 text-sm shadow-lg" style="${ssrRenderStyle(accountMenuStyle.value)}">`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/profile",
              class: "flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50",
              onClick: ($event) => showAccountMenu.value = false
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(UserRound), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push3(`<span${_scopeId}>Editar perfil</span>`);
                } else {
                  return [
                    createVNode(unref(UserRound), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    }),
                    createVNode("span", null, "Editar perfil")
                  ];
                }
              }),
              _: 1
            }, _parent));
            if (isPlatformAdmin.value) {
              _push2(ssrRenderComponent(_component_NuxtLink, {
                to: "/administracion-tiendas",
                class: "flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50",
                onClick: ($event) => showAccountMenu.value = false
              }, {
                default: withCtx((_, _push3, _parent2, _scopeId) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(ShieldCheck), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    }, null, _parent2, _scopeId));
                    _push3(`<span${_scopeId}>Administración</span>`);
                  } else {
                    return [
                      createVNode(unref(ShieldCheck), {
                        class: "h-4 w-4",
                        "aria-hidden": "true"
                      }),
                      createVNode("span", null, "Administración")
                    ];
                  }
                }),
                _: 1
              }, _parent));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: "/seguimiento",
              class: "flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50",
              onClick: ($event) => showAccountMenu.value = false
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Truck), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push3(`<span${_scopeId}>Ver seguimiento</span>`);
                } else {
                  return [
                    createVNode(unref(Truck), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    }),
                    createVNode("span", null, "Ver seguimiento")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push2(`<button type="button" class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50">`);
            _push2(ssrRenderComponent(unref(LogOut), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent));
            _push2(`<span>Cerrar sesión</span></button></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (showMobileNav.value) {
        _push(`<div class="border-t border-slate-200 bg-white/95 px-4 py-3 text-sm sm:px-6 md:hidden"><div class="flex flex-col gap-4"><div class="space-y-2"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">General</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: mobileButtonClassFor("/", true),
          style: mobileButtonStyleFor("/", true)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Home), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>Menú principal</span>`);
            } else {
              return [
                createVNode(unref(Home), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createVNode("span", null, "Menú principal")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/marketplace",
          class: mobileButtonClassFor("/marketplace"),
          style: mobileButtonStyleFor("/marketplace")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Store), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(`<span${_scopeId}>Marketplace</span>`);
            } else {
              return [
                createVNode(unref(Store), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createVNode("span", null, "Marketplace")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (hasStoreContext.value) {
          _push(`<div class="space-y-2"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Esta tienda</p>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${slug.value}`,
            class: mobileButtonClassFor(`/store/${slug.value}`, true),
            style: mobileButtonStyleFor(`/store/${slug.value}`, true)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Home), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Inicio</span>`);
              } else {
                return [
                  createVNode(unref(Home), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Inicio")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${slug.value}/productos`,
            class: mobileButtonClassFor(`/store/${slug.value}/productos`),
            style: mobileButtonStyleFor(`/store/${slug.value}/productos`)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ShoppingBag), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Productos</span>`);
              } else {
                return [
                  createVNode(unref(ShoppingBag), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Productos")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${slug.value}/acerca`,
            class: mobileButtonClassFor(`/store/${slug.value}/acerca`),
            style: mobileButtonStyleFor(`/store/${slug.value}/acerca`)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Info), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Acerca de</span>`);
              } else {
                return [
                  createVNode(unref(Info), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Acerca de")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/store/${slug.value}/soporte`,
            class: mobileButtonClassFor(`/store/${slug.value}/soporte`),
            style: mobileButtonStyleFor(`/store/${slug.value}/soporte`)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Headset), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Soporte</span>`);
              } else {
                return [
                  createVNode(unref(Headset), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Soporte")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (storeCartEnabled.value) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/store/${slug.value}/carrito`,
              class: mobileButtonClassFor(`/store/${slug.value}/carrito`),
              style: mobileButtonStyleFor(`/store/${slug.value}/carrito`)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(ShoppingCart), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }, null, _parent2, _scopeId));
                  _push2(`<span${_scopeId}>Carrito</span>`);
                } else {
                  return [
                    createVNode(unref(ShoppingCart), {
                      class: "h-4 w-4",
                      "aria-hidden": "true"
                    }),
                    createVNode("span", null, "Carrito")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="space-y-2"><p class="text-xs uppercase tracking-[0.2em] text-slate-500">Cuenta</p>`);
        if (isHydrated.value && unref(auth).isAuthenticated && unref(hasDashboardAccess)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(defaultDashboardRoute),
            class: mobileButtonClassFor(unref(defaultDashboardRoute)),
            style: mobileButtonStyleFor(unref(defaultDashboardRoute))
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(LayoutDashboard), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Dashboard</span>`);
              } else {
                return [
                  createVNode(unref(LayoutDashboard), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Dashboard")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isHydrated.value && unref(auth).isAuthenticated) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            class: mobileButtonClassFor("/profile"),
            style: mobileButtonStyleFor("/profile")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(UserRound), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Perfil</span>`);
              } else {
                return [
                  createVNode(unref(UserRound), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Perfil")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isHydrated.value && unref(auth).isAuthenticated && isPlatformAdmin.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/administracion-tiendas",
            class: mobileButtonClassFor("/administracion-tiendas"),
            style: mobileButtonStyleFor("/administracion-tiendas")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(ShieldCheck), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Administración</span>`);
              } else {
                return [
                  createVNode(unref(ShieldCheck), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Administración")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isHydrated.value && unref(auth).isAuthenticated) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/seguimiento",
            class: mobileButtonClassFor("/seguimiento"),
            style: mobileButtonStyleFor("/seguimiento")
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Truck), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Ver seguimiento</span>`);
              } else {
                return [
                  createVNode(unref(Truck), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Ver seguimiento")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/login",
            class: mobileButtonClassFor("/login", true),
            style: mobileButtonStyleFor("/login", true)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(LogIn), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Iniciar sesión</span>`);
              } else {
                return [
                  createVNode(unref(LogIn), {
                    class: "h-4 w-4",
                    "aria-hidden": "true"
                  }),
                  createVNode("span", null, "Iniciar sesión")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        if (isHydrated.value && unref(auth).isAuthenticated) {
          _push(`<button class="${ssrRenderClass(mobileDangerButtonClass)}">`);
          _push(ssrRenderComponent(unref(LogOut), {
            class: "h-4 w-4",
            "aria-hidden": "true"
          }, null, _parent));
          _push(`<span>Cerrar sesión</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main class="pb-12 reveal" style="${ssrRenderStyle({ "animation-delay": "0.04s" })}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/store.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=store-sewIgsm9.mjs.map
