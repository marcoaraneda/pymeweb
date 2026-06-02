import { r as executeAsync } from '../_/nitro.mjs';
import { i as defineNuxtRouteMiddleware, b as useAuthStore, n as navigateTo } from './server.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import './theme-LeBKALXb.mjs';

const auth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const slug = to.params.slug;
  const needsAuth = Boolean(to.meta?.requiresAuth) || to.path.includes("/admin") && !to.path.includes("/login");
  if (!needsAuth) return;
  const auth2 = useAuthStore();
  const tenant = useTenantStore();
  if (slug) tenant.setSlug(slug);
  const loginPath = "/login";
  auth2.restoreFromCookies();
  if (!auth2.token) {
    return navigateTo(loginPath);
  }
  const profile = ([__temp, __restore] = executeAsync(() => auth2.initializeSession({ forceProfile: true })), __temp = await __temp, __restore(), __temp);
  if (!profile && auth2.token && auth2.isProfileBackoffActive) {
    return;
  }
  if (!auth2.token || !profile) {
    return navigateTo(loginPath);
  }
});

export { auth as default };
//# sourceMappingURL=auth-kmFyUq2Q.mjs.map
