import { b as useAuthStore, a as useRuntimeConfig, c as __nuxt_component_1 } from './server.mjs';
import { defineComponent, ref, computed, watch, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useRoute } from 'vue-router';
import { u as useThemeStore } from './theme-CB1SKex-.mjs';
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

const staffPageSize = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "recursos-humanos",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    useThemeStore();
    useRoute();
    useDashboardAccess();
    const config = useRuntimeConfig();
    String(config.public.apiBase || "");
    const stores = ref([]);
    ref({ store: "" });
    const staff = ref([]);
    const selectedMember = ref(null);
    ref(false);
    ref("");
    const lastUpdated = ref(null);
    ref(false);
    ref("");
    ref(false);
    const staffPage = ref(1);
    ref({ identifier: "", roles: ["FINANCE"] });
    const allowedStoreSlugs = computed(() => {
      const memberships = auth.user?.memberships || [];
      const allowed = /* @__PURE__ */ new Set(["ADMIN", "HR"]);
      const slugs = /* @__PURE__ */ new Set();
      for (const membership of memberships) {
        if (membership.roles?.some((role) => allowed.has(role))) {
          slugs.add(membership.store.slug);
        }
      }
      return slugs;
    });
    computed(() => {
      if (!auth.user?.memberships?.length) return stores.value;
      if (!allowedStoreSlugs.value.size) return [];
      return stores.value.filter((s) => allowedStoreSlugs.value.has(s.slug));
    });
    computed(() => {
      const total = staff.value.length;
      const active = staff.value.filter((m) => m.is_active).length;
      const admins = staff.value.filter((m) => m.roles.includes("ADMIN")).length;
      const avgTenure = averageTenureDays.value;
      return [
        { label: "Equipo total", value: total, note: "Membresías registradas" },
        { label: "Activos", value: active, note: "Con acceso vigente" },
        { label: "Admins", value: admins, note: "Rol administrador" },
        { label: "Antigüedad promedio", value: avgTenure ? `${avgTenure} días` : "—", note: "Promedio del equipo" }
      ];
    });
    computed(() => {
      const counter = { ADMIN: 0, EDITOR: 0, INVENTORY: 0, REPORTS: 0, HR: 0, FINANCE: 0, DATA_ANALYST: 0 };
      staff.value.forEach((member) => {
        member.roles.forEach((role) => {
          counter[role] = (counter[role] || 0) + 1;
        });
      });
      return Object.entries(counter).map(([label, count]) => ({ label: roleLabel(label), count })).filter((row) => row.count > 0);
    });
    computed(() => {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1e3;
      return staff.value.filter((m) => new Date(m.created_at).getTime() >= cutoff);
    });
    const staffTotalPages = computed(() => Math.max(1, Math.ceil(staff.value.length / staffPageSize)));
    const pagedStaff = computed(() => {
      const start = (staffPage.value - 1) * staffPageSize;
      return staff.value.slice(start, start + staffPageSize);
    });
    const averageTenureDays = computed(() => {
      if (!staff.value.length) return 0;
      const now = Date.now();
      const sum = staff.value.reduce((acc, member) => acc + (now - new Date(member.created_at).getTime()), 0);
      return Math.round(sum / staff.value.length / (24 * 60 * 60 * 1e3));
    });
    computed(() => lastUpdated.value ? lastUpdated.value.toLocaleString() : "—");
    const roleLabel = (role) => {
      const map = {
        ADMIN: "Administrador",
        EDITOR: "Editor",
        INVENTORY: "Inventario",
        REPORTS: "Reportes",
        HR: "Recursos Humanos",
        FINANCE: "Finanzas",
        DATA_ANALYST: "Analista de datos"
      };
      return map[role] || role;
    };
    watch(staff, () => {
      if (staffPage.value > staffTotalPages.value) staffPage.value = staffTotalPages.value;
      if (selectedMember.value && !staff.value.some((member) => member.user.id === selectedMember.value?.user.id)) {
        selectedMember.value = staff.value[0] || null;
      }
    });
    watch(pagedStaff, () => {
      if (!selectedMember.value && pagedStaff.value.length) {
        selectedMember.value = pagedStaff.value[0];
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/recursos-humanos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=recursos-humanos-BQ5jVK-S.mjs.map
