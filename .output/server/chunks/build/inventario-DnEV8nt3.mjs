import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { u as useTenantStore } from './tenant-BxLMheJI.mjs';
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
import 'vue-router';
import './theme-LeBKALXb.mjs';

const useInventory = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const tenant = useTenantStore();
  const authedFetch = async (url, options = {}) => {
    if (!auth.token) {
      throw new Error("No autenticado");
    }
    const doFetch = (token) => $fetch(url, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers || {} }
    });
    try {
      return await doFetch(auth.token);
    } catch (error) {
      const code = error.response?._data?.code;
      if (code === "token_not_valid" && auth.refreshToken) {
        const refreshed = await auth.refreshTokens();
        if (refreshed) {
          return await doFetch(refreshed);
        }
      }
      throw error;
    }
  };
  const getStock = async () => {
    if (!tenant.slug) {
      throw new Error("Tienda no cargada");
    }
    try {
      return await authedFetch(`${config.public.apiBase}/store/${tenant.slug}/admin/inventario/stocks/`);
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      throw new Error("No se pudo cargar el stock. Intente más tarde.");
    }
  };
  const updateStock = async (payload) => {
    if (!tenant.slug) {
      throw new Error("Tienda no cargada");
    }
    try {
      return await authedFetch(`${config.public.apiBase}/store/${tenant.slug}/admin/inventario/movements/`, {
        method: "POST",
        body: {
          variant: payload.variantId,
          quantity: payload.quantity,
          movement_type: payload.type,
          reason: payload.reason || ""
        }
      });
    } catch (error) {
      const errorMessage = error.response?._data?.detail || "Error al obtener inventario";
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  };
  return { getStock, updateStock };
};
const inventoryPageSize = 15;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "inventario",
  __ssrInlineRender: true,
  setup(__props) {
    useInventory();
    const inventory = ref([]);
    const loading = ref(false);
    const errorMessage = ref("");
    const adjustingItem = ref(null);
    const targetStock = ref(0);
    const adjustReason = ref("");
    const adjustError = ref("");
    const savingAdjustment = ref(false);
    const inventoryPage = ref(1);
    const inventoryTotalPages = computed(() => Math.max(1, Math.ceil(inventory.value.length / inventoryPageSize)));
    const pagedInventory = computed(() => {
      const start = (inventoryPage.value - 1) * inventoryPageSize;
      return inventory.value.slice(start, start + inventoryPageSize);
    });
    watch(inventory, () => {
      if (inventoryPage.value > inventoryTotalPages.value) inventoryPage.value = inventoryTotalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h1 class="text-2xl font-bold text-gray-800">Control de Inventario</h1><p class="text-sm text-gray-500">Consulta stock por variante y registra ajustes rápidos.</p></div><button class="text-sm bg-gray-200 px-4 py-2 rounded-lg">Actualizar</button></div>`);
      if (unref(errorMessage)) {
        _push(`<div class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">${ssrInterpolate(unref(errorMessage))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500"> Cargando inventario... </div>`);
      } else {
        _push(`<div class="bg-white rounded-xl shadow-sm border overflow-hidden">`);
        if (!unref(inventory).length) {
          _push(`<div class="px-4 py-6 text-sm text-slate-500">No hay registros de stock para esta tienda.</div>`);
        } else {
          _push(`<table class="w-full text-left"><thead class="bg-gray-50 border-b"><tr><th class="p-4 font-semibold text-gray-600">Producto / Variante</th><th class="p-4 font-semibold text-gray-600">Stock Actual</th><th class="p-4 font-semibold text-gray-600">Estado</th><th class="p-4 font-semibold text-gray-600 text-right">Acciones</th></tr></thead><tbody><!--[-->`);
          ssrRenderList(unref(pagedInventory), (item) => {
            _push(`<tr class="border-b hover:bg-gray-50"><td class="p-4"><p class="font-medium">${ssrInterpolate(item.product_name)}</p><p class="text-xs text-gray-500">${ssrInterpolate(item.variant_name)} (SKU: ${ssrInterpolate(item.sku)})</p></td><td class="p-4 font-mono">${ssrInterpolate(item.stock_available)}</td><td class="p-4">`);
            if (item.stock_available <= item.stock_minimum) {
              _push(`<span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold"> STOCK BAJO </span>`);
            } else {
              _push(`<span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Saludable</span>`);
            }
            _push(`<p class="mt-1 text-[11px] text-gray-500">Mínimo ${ssrInterpolate(item.stock_minimum)}</p></td><td class="p-4 text-right"><button class="text-blue-600 hover:underline text-sm font-medium"> Ajustar Stock </button></td></tr>`);
          });
          _push(`<!--]--></tbody></table>`);
        }
        if (unref(inventoryTotalPages) > 1) {
          _push(`<div class="border-t bg-white px-4 py-3 text-xs text-slate-600"><div class="flex items-center justify-between"><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(unref(inventoryPage) === 1) ? " disabled" : ""}>Anterior</button><span>Página ${ssrInterpolate(unref(inventoryPage))} / ${ssrInterpolate(unref(inventoryTotalPages))}</span><button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(unref(inventoryPage) === unref(inventoryTotalPages)) ? " disabled" : ""}>Siguiente</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      if (unref(adjustingItem)) {
        _push(`<div class="rounded-xl border border-amber-200 bg-amber-50 p-4"><h2 class="text-sm font-semibold text-amber-900">Ajustar stock</h2><p class="mt-1 text-xs text-amber-800">${ssrInterpolate(unref(adjustingItem).product_name)} / ${ssrInterpolate(unref(adjustingItem).variant_name)}</p><p class="mt-1 text-xs text-amber-800">Stock actual: ${ssrInterpolate(unref(adjustingItem).stock_available)}</p><div class="mt-3 grid gap-3 sm:grid-cols-2"><label class="text-sm text-slate-700"> Nuevo stock <input${ssrRenderAttr("value", unref(targetStock))} type="number" min="0" class="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"></label><label class="text-sm text-slate-700"> Motivo <input${ssrRenderAttr("value", unref(adjustReason))} type="text" placeholder="Ajuste manual desde panel" class="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"></label></div>`);
        if (unref(adjustError)) {
          _push(`<div class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">${ssrInterpolate(unref(adjustError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-4 flex flex-wrap gap-2"><button class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"${ssrIncludeBooleanAttr(unref(savingAdjustment)) ? " disabled" : ""}>${ssrInterpolate(unref(savingAdjustment) ? "Guardando..." : "Confirmar ajuste")}</button><button class="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900"${ssrIncludeBooleanAttr(unref(savingAdjustment)) ? " disabled" : ""}> Cancelar </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/store/[slug]/admin/inventario.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=inventario-DnEV8nt3.mjs.map
