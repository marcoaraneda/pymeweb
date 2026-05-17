import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { b as useAuthStore, c as __nuxt_component_1, n as navigateTo } from './server.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, createVNode, unref, createTextVNode, createBlock, createCommentVNode, openBlock, toDisplayString, nextTick, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderTeleport, ssrRenderStyle, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-D84iBmkp.mjs';
import { useRoute, useRouter } from 'vue-router';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
import { u as useCartStore } from './cart-Dcn-8ZaM.mjs';
import { House, ShoppingBag, LayoutDashboard, Store, ShoppingCart, LogIn, Bell, Eye, User, ShieldCheck, LogOut } from 'lucide-vue-next';
import { u as useNotificationStore } from './notifications-Bf4qERDu.mjs';
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
import 'pinia';

const mainNavBaseClass = "layout-main-nav-btn inline-flex h-10 min-w-[112px] shrink-0 items-center justify-center gap-2 rounded-2xl border px-3 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 lg:h-11 lg:min-w-[136px] lg:px-4 lg:text-sm";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const theme = useThemeStore();
    const cart = useCartStore();
    const { defaultDashboardRoute, hasStores: hasDashboardAccess } = useDashboardAccess();
    const handleMarketplaceCartClick = () => {
      try {
        console.debug("[UI] handleMarketplaceCartClick invoked");
        cart.setContext("marketplace");
      } catch (e) {
        console.warn("[UI] handleMarketplaceCartClick error", e);
      }
    };
    const route = useRoute();
    useRouter();
    const isDashboardRoute = computed(() => route.path === "/dashboard" || route.path.startsWith("/dashboard/"));
    const showMenu = ref(false);
    const showMenuMobile = ref(false);
    ref(null);
    const avatarUrl = computed(() => {
      const base = auth.user?.avatar_url;
      if (!base) return null;
      const version = auth.user?.avatar_updated_at;
      if (!version) return base;
      const joiner = base.includes("?") ? "&" : "?";
      return `${base}${joiner}v=${encodeURIComponent(version)}`;
    });
    const myMarketplaceProfilePath = computed(() => {
      const id = auth.user?.id;
      return id ? `/marketplace/vendedores/${id}` : "";
    });
    const isPlatformAdmin = computed(() => auth.user?.username === "marko2blea");
    const initials = computed(() => (auth.user?.username || "U").slice(0, 2).toUpperCase());
    computed(() => theme.accent || "#2563eb");
    const isMarketplaceRoute = computed(() => route.path.startsWith("/marketplace"));
    const mainNavClassFor = (targetPath, exact = false) => {
      const isActive = exact ? route.path === targetPath : route.path === targetPath || route.path.startsWith(`${targetPath}/`);
      return isActive ? `${mainNavBaseClass} border-[#0f274f] bg-[#0f274f] text-white hover:bg-[#103264]` : `${mainNavBaseClass} border-[#0f274f]/20 bg-white text-[#0f274f] hover:bg-[#0f274f]/5`;
    };
    const notificationStore = useNotificationStore();
    const notifBtnRef = ref(null);
    const notifMenuStyle = ref("");
    const unreadNotifications = computed(() => notificationStore.unread);
    const notificationsCount = computed(() => notificationStore.totalUnread);
    const showNotifications = ref(false);
    const isHydrated = ref(false);
    const positionNotifMenu = async () => {
      if (!showNotifications.value) return;
      await nextTick();
      if (notifBtnRef.value) {
        const rect = notifBtnRef.value.getBoundingClientRect();
        if ((void 0).innerWidth < 640) {
          const menuWidth2 = Math.max(260, (void 0).innerWidth - 16);
          notifMenuStyle.value = `top: ${Math.max(12, rect.bottom + 8)}px; left: 8px; width: ${menuWidth2}px;`;
          return;
        }
        const menuWidth = Math.min(320, (void 0).innerWidth - 16);
        const maxLeft = Math.max(8, (void 0).innerWidth - menuWidth - 8);
        const left = Math.min(Math.max(8, rect.left), maxLeft);
        notifMenuStyle.value = `top: ${rect.bottom + 8}px; left: ${left}px; width: ${menuWidth}px;`;
      }
    };
    const goDashboard = async () => {
      showMenu.value = false;
      showMenuMobile.value = false;
      showNotifications.value = false;
      await navigateTo(defaultDashboardRoute.value);
    };
    watch(
      () => route.fullPath,
      () => {
        showMenu.value = false;
        showMenuMobile.value = false;
        showNotifications.value = false;
      }
    );
    watch(
      () => showNotifications.value,
      (isOpen) => {
        if (isOpen) positionNotifMenu();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-screen overflow-x-hidden bg-slate-50 text-slate-900", { "premium-shell": !isDashboardRoute.value }]
      }, _attrs))}><header class="sticky top-0 z-20 border-b border-slate-200 bg-white/85 backdrop-blur"><div class="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-5 sm:py-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-3 font-semibold text-slate-900"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Pymeweb" class="h-9 w-9 rounded-full object-contain"${_scopeId}><div class="hidden lg:block"${_scopeId}><p class="layout-brand-title leading-none"${_scopeId}>Pymeweb</p><p class="layout-brand-subtitle text-xs text-slate-500"${_scopeId}>Marketplace multi-tienda</p></div>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Pymeweb",
                class: "h-9 w-9 rounded-full object-contain"
              }),
              createVNode("div", { class: "hidden lg:block" }, [
                createVNode("p", { class: "layout-brand-title leading-none" }, "Pymeweb"),
                createVNode("p", { class: "layout-brand-subtitle text-xs text-slate-500" }, "Marketplace multi-tienda")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="hidden items-center gap-2 xl:gap-3 md:flex">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: mainNavClassFor("/", true)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(House), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Inicio `);
          } else {
            return [
              createVNode(unref(House), {
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
        to: "/tiendas",
        class: mainNavClassFor("/tiendas")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ShoppingBag), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Ver tiendas `);
          } else {
            return [
              createVNode(unref(ShoppingBag), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }),
              createTextVNode(" Ver tiendas ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (isHydrated.value && unref(auth).isAuthenticated && unref(hasDashboardAccess)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: unref(defaultDashboardRoute),
          class: mainNavClassFor(unref(defaultDashboardRoute)),
          onClick: goDashboard
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LayoutDashboard), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Dashboard `);
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
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/marketplace",
        class: mainNavClassFor("/marketplace")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Store), {
              class: "h-4 w-4",
              "aria-hidden": "true"
            }, null, _parent2, _scopeId));
            _push2(` Marketplace `);
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
      _push(`</nav><div class="flex items-center gap-2 lg:gap-3">`);
      if (isMarketplaceRoute.value) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/marketplace/carrito",
          class: "relative hidden h-11 w-11 items-center justify-center rounded-xl text-white shadow md:inline-flex",
          style: { backgroundColor: "#f59e0b" },
          "aria-label": "Carrito marketplace",
          onClick: handleMarketplaceCartClick
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ShoppingCart), {
                class: "h-5 w-5",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              if (isHydrated.value && unref(cart).totalItems > 0) {
                _push2(`<span class="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-900 px-1 text-xs font-semibold text-white"${_scopeId}>${ssrInterpolate(unref(cart).totalItems)}</span>`);
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
                  class: "absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-slate-900 px-1 text-xs font-semibold text-white"
                }, toDisplayString(unref(cart).totalItems), 1)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-800 glass-btn" aria-label="Abrir menu"><span class="flex flex-col items-center justify-center gap-1" aria-hidden="true"><span class="h-[2px] w-5 rounded bg-slate-800"></span><span class="h-[2px] w-5 rounded bg-slate-800"></span><span class="h-[2px] w-5 rounded bg-slate-800"></span></span></button>`);
      if (!isHydrated.value || !unref(auth).isAuthenticated) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "layout-main-nav-btn hidden h-10 min-w-[120px] shrink-0 items-center justify-center gap-2 rounded-2xl border border-[#0f274f]/20 bg-[#0f274f]/5 px-3 text-xs font-semibold text-[#0f274f] transition hover:bg-[#0f274f]/10 md:inline-flex lg:h-11 lg:min-w-[144px] lg:px-4 lg:text-sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LogIn), {
                class: "h-4 w-4",
                "aria-hidden": "true"
              }, null, _parent2, _scopeId));
              _push2(` Iniciar sesión `);
            } else {
              return [
                createVNode(unref(LogIn), {
                  class: "h-4 w-4",
                  "aria-hidden": "true"
                }),
                createTextVNode(" Iniciar sesión ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (isHydrated.value) {
        _push(`<div class="relative flex items-center gap-2 lg:gap-3"><div class="relative inline-flex items-center"><button class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm glass-btn">`);
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
            _push2(`<div><div class="fixed inset-0 z-[99999]"></div><div class="fixed z-[100000] w-[min(20rem,calc(100vw-1rem))] rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-lg max-h-[min(26rem,calc(100vh-6rem))] overflow-hidden" style="${ssrRenderStyle(notifMenuStyle.value)}"><div class="flex items-center justify-between"><p class="font-semibold text-slate-800">Notificaciones</p></div><div class="mt-2 space-y-2 max-h-60 overflow-y-auto">`);
            if (!unreadNotifications.value.length) {
              _push2(`<p class="text-slate-500">Sin notificaciones.</p>`);
            } else {
              _push2(`<!--[-->`);
              ssrRenderList(unreadNotifications.value, (n, idx) => {
                _push2(`<div class="w-full rounded-lg border border-slate-100 px-2 py-1 text-slate-700">${ssrInterpolate(n.message)}</div>`);
              });
              _push2(`<!--]-->`);
            }
            _push2(`</div><div class="mt-3 flex items-center justify-between gap-2"><button type="button" class="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 hover:border-slate-300"> Borrar notificaciones </button><button type="button" class="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"> Ver notificaciones </button></div></div></div>`);
          } else {
            _push2(`<!---->`);
          }
        }, "body", false, _parent);
        _push(`</div><button class="layout-main-nav-btn hidden h-11 w-11 shrink-0 items-center justify-center gap-2 rounded-2xl px-2 text-sm font-semibold text-slate-800 glass-btn md:flex lg:w-40 lg:px-4">`);
        if (avatarUrl.value) {
          _push(`<span class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white/15"><img${ssrRenderAttr("src", avatarUrl.value)} alt="Avatar" class="h-full w-full object-cover"></span>`);
        } else {
          _push(`<span class="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-xs uppercase">${ssrInterpolate(initials.value)}</span>`);
        }
        _push(`<span class="hidden min-w-0 flex-1 truncate lg:block">${ssrInterpolate(unref(auth).user?.username || "Perfil")}</span></button>`);
        if (showMenu.value) {
          _push(`<div class="absolute right-0 top-full z-[100001] mt-2 w-[min(18rem,calc(100vw-1rem))] max-w-[calc(100vw-1rem)] rounded-xl border border-slate-200 bg-white py-2 text-sm shadow-lg max-h-[calc(100vh-7rem)] overflow-y-auto">`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/seguimiento",
            class: "flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(Eye), { class: "h-4 w-4 flex-shrink-0" }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Seguimiento</span>`);
              } else {
                return [
                  createVNode(unref(Eye), { class: "h-4 w-4 flex-shrink-0" }),
                  createVNode("span", null, "Seguimiento")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (myMarketplaceProfilePath.value) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: myMarketplaceProfilePath.value,
              class: "flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(Store), { class: "h-4 w-4 flex-shrink-0" }, null, _parent2, _scopeId));
                  _push2(`<span${_scopeId}>Perfil Marketplace</span>`);
                } else {
                  return [
                    createVNode(unref(Store), { class: "h-4 w-4 flex-shrink-0" }),
                    createVNode("span", null, "Perfil Marketplace")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/profile",
            class: "flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(User), { class: "h-4 w-4 flex-shrink-0" }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>Editar perfil</span>`);
              } else {
                return [
                  createVNode(unref(User), { class: "h-4 w-4 flex-shrink-0" }),
                  createVNode("span", null, "Editar perfil")
                ];
              }
            }),
            _: 1
          }, _parent));
          if (isPlatformAdmin.value) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/administracion-tiendas",
              class: "flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:bg-slate-50 transition"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(unref(ShieldCheck), { class: "h-4 w-4 flex-shrink-0" }, null, _parent2, _scopeId));
                  _push2(`<span${_scopeId}>Administración</span>`);
                } else {
                  return [
                    createVNode(unref(ShieldCheck), { class: "h-4 w-4 flex-shrink-0" }),
                    createVNode("span", null, "Administración")
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`<button class="flex w-full items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition">`);
          _push(ssrRenderComponent(unref(LogOut), { class: "h-4 w-4 flex-shrink-0" }, null, _parent));
          _push(`<span>Cerrar sesión</span></button></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (showMenuMobile.value) {
        _push(`<div class="border-t border-slate-200 bg-white/95 px-4 py-4 text-sm md:hidden"><div class="mx-auto flex max-w-2xl flex-col gap-3">`);
        if (isHydrated.value && unref(auth).isAuthenticated) {
          _push(`<div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"><div class="flex items-center gap-3">`);
          if (avatarUrl.value) {
            _push(`<span class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white"><img${ssrRenderAttr("src", avatarUrl.value)} alt="Avatar" class="h-full w-full object-cover"></span>`);
          } else {
            _push(`<span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold uppercase text-white">${ssrInterpolate(initials.value)}</span>`);
          }
          _push(`<div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-900">${ssrInterpolate(unref(auth).user?.username || "Perfil")}</p><p class="truncate text-xs text-slate-500">${ssrInterpolate(myMarketplaceProfilePath.value ? "Perfil marketplace activo" : "Sesión iniciada")}</p></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col gap-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Inicio`);
            } else {
              return [
                createTextVNode("Inicio")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/tiendas",
          class: "rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Ver tiendas`);
            } else {
              return [
                createTextVNode("Ver tiendas")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (isHydrated.value && unref(auth).isAuthenticated && unref(hasDashboardAccess)) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: unref(defaultDashboardRoute),
            class: "rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10",
            onClick: goDashboard
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Dashboard`);
              } else {
                return [
                  createTextVNode("Dashboard")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/marketplace",
          class: "rounded-lg px-3 py-2 text-[#0f274f] hover:bg-[#0f274f]/10"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Marketplace`);
            } else {
              return [
                createTextVNode("Marketplace")
              ];
            }
          }),
          _: 1
        }, _parent));
        if (isMarketplaceRoute.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/marketplace/carrito",
            class: "rounded-lg px-3 py-2 hover:bg-slate-100 text-amber-700",
            onClick: handleMarketplaceCartClick
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Carrito marketplace `);
              } else {
                return [
                  createTextVNode(" Carrito marketplace ")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="my-2 border-t border-slate-200"></div>`);
        if (isHydrated.value && unref(auth).isAuthenticated) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/seguimiento",
            class: "rounded-lg px-3 py-2 hover:bg-slate-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Ver seguimiento`);
              } else {
                return [
                  createTextVNode("Ver seguimiento")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isHydrated.value && unref(auth).isAuthenticated && myMarketplaceProfilePath.value) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: myMarketplaceProfilePath.value,
            class: "rounded-lg px-3 py-2 hover:bg-slate-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Ver perfil marketplace`);
              } else {
                return [
                  createTextVNode("Ver perfil marketplace")
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
            class: "rounded-lg px-3 py-2 hover:bg-slate-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Editar perfil`);
              } else {
                return [
                  createTextVNode("Editar perfil")
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
            class: "rounded-lg px-3 py-2 hover:bg-slate-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Administración`);
              } else {
                return [
                  createTextVNode("Administración")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (isHydrated.value && unref(auth).isAuthenticated) {
          _push(`<button class="rounded-lg px-3 py-2 text-left text-red-600 hover:bg-slate-100">Cerrar sesión</button>`);
        } else {
          _push(`<!---->`);
        }
        if (!isHydrated.value || !unref(auth).isAuthenticated) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/login",
            class: "rounded-lg px-3 py-2 hover:bg-slate-100"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Iniciar sesión`);
              } else {
                return [
                  createTextVNode("Iniciar sesión")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><main class="reveal" style="${ssrRenderStyle({ "animation-delay": "0.04s" })}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BOa3hiwk.mjs.map
