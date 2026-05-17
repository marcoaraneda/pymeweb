import { computed, watch, toRef, isRef } from 'vue';
import { u as useNuxtApp } from './server.mjs';

const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const makeProductFavoriteKey = (storeSlug, productIdOrSlug) => {
  const store = (storeSlug || "marketplace").toString();
  const prod = productIdOrSlug === null || productIdOrSlug === void 0 ? "" : String(productIdOrSlug);
  return prod ? `${store}:${prod}` : "";
};
const useFavorites = () => {
  const favoriteStoreSlugs = useState("favoriteStoreSlugs", () => []);
  const favoriteProductKeys = useState("favoriteProductKeys", () => []);
  const storeSet = computed(() => new Set(favoriteStoreSlugs.value));
  const productSet = computed(() => new Set(favoriteProductKeys.value));
  const persist = () => {
    return;
  };
  watch([favoriteStoreSlugs, favoriteProductKeys], persist, { deep: true });
  const isStoreFavorite = (slug) => storeSet.value.has(slug);
  const toggleStoreFavorite = (slug) => {
    if (!slug) return;
    const next = new Set(favoriteStoreSlugs.value);
    if (next.has(slug)) next.delete(slug);
    else next.add(slug);
    favoriteStoreSlugs.value = Array.from(next);
  };
  const isProductFavoriteKey = (key) => Boolean(key) && productSet.value.has(key);
  const toggleProductFavoriteKey = (key) => {
    if (!key) return;
    const next = new Set(favoriteProductKeys.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    favoriteProductKeys.value = Array.from(next);
  };
  return {
    favoriteStoreSlugs,
    favoriteProductKeys,
    isStoreFavorite,
    toggleStoreFavorite,
    isProductFavoriteKey,
    toggleProductFavoriteKey
  };
};

export { makeProductFavoriteKey as m, useFavorites as u };
//# sourceMappingURL=useFavorites-BLT7MOEn.mjs.map
