import { d as defineStore, a as useRuntimeConfig, u as useNuxtApp, b as useRequestEvent } from './server.mjs';
import { ref, computed } from 'vue';
import { d as destr, y as klona, z as parse, A as getRequestHeader, B as isEqual, C as setCookie, D as getCookie, E as deleteCookie } from '../_/nitro.mjs';

const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => destr(decodeURIComponent(val)),
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const useAuthStore = defineStore("auth", () => {
  const token = useCookie("pymeweb_token", {
    sameSite: "lax",
    secure: "production" === "production"
  });
  const user = ref(null);
  const isAuthenticated = computed(() => Boolean(token.value));
  const setToken = (value) => {
    token.value = value;
  };
  const initializeSession = async () => {
    if (token.value) return token.value;
    return token.value;
  };
  const fetchMyStores = async () => {
    if (!token.value) return [];
    const config = useRuntimeConfig();
    try {
      return await $fetch(`${config.public.apiBase}/stores/mine/`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
    } catch {
      return [];
    }
  };
  const logout = () => {
    setToken(null);
    user.value = null;
  };
  return {
    token,
    user,
    isAuthenticated,
    initializeSession,
    fetchMyStores,
    logout,
    setToken
  };
});

export { useAuthStore as u };
//# sourceMappingURL=auth-8-vC_PDE.mjs.map
