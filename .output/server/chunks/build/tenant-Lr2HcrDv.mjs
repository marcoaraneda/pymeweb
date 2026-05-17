import { B as executeAsync } from '../_/nitro.mjs';
import { h as defineNuxtRouteMiddleware, b as useAuthStore, n as navigateTo } from './server.mjs';
import { u as useTenantStore } from './tenant-BxVVnK6Y.mjs';
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
import 'pinia';
import 'vue-router';
import './theme-CB1SKex-.mjs';

const tenant = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const slug = to.params.slug;
  if (!slug) return;
  const tenantStore = useTenantStore();
  useAuthStore();
  tenantStore.setSlug(slug);
  if (!tenantStore.data || tenantStore.data.slug !== slug) {
    try {
      ;
      [__temp, __restore] = executeAsync(() => tenantStore.fetchTienda()), await __temp, __restore();
      ;
    } catch (error) {
      return navigateTo("/");
    }
  }
});

export { tenant as default };
//# sourceMappingURL=tenant-Lr2HcrDv.mjs.map
