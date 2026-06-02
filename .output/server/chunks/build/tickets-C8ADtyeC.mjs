import { _ as __nuxt_component_0 } from './nuxt-link-D_lROxzU.mjs';
import { defineComponent, ref, computed, watch, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderStyle } from 'vue/server-renderer';
import { b as useAuthStore, a as useRuntimeConfig } from './server.mjs';
import { useRoute } from 'vue-router';
import { u as useThemeStore } from './theme-LeBKALXb.mjs';
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

const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tickets",
  __ssrInlineRender: true,
  setup(__props) {
    const auth = useAuthStore();
    const theme = useThemeStore();
    const config = useRuntimeConfig();
    useRoute();
    const tickets = ref([]);
    const loading = ref(true);
    const kind = ref("");
    const status = ref("");
    const priority = ref("");
    const storeSlug = ref("");
    const dateFrom = ref("");
    const dateTo = ref("");
    const storesMine = ref([]);
    const page = ref(1);
    const searchTerm = ref("");
    const savingTicketId = ref(null);
    const draftByTicket = ref({});
    const ticketMessageById = ref({});
    const isPlatformAdmin = computed(() => auth.user?.username === "marko2blea");
    const formatStatus = (value) => {
      const map = {
        open: "Abierto",
        in_progress: "En progreso",
        resolved: "Resuelto",
        closed: "Cerrado"
      };
      return map[value] || value;
    };
    const badgeClass = (value) => {
      const map = {
        open: "bg-amber-500/20 text-amber-100",
        in_progress: "bg-sky-500/20 text-sky-100",
        resolved: "bg-emerald-500/20 text-emerald-100",
        closed: "bg-slate-500/20 text-slate-100"
      };
      return map[value] || "bg-white/10 text-white";
    };
    const formatPriority = (value) => {
      const map = {
        low: "Baja",
        normal: "Normal",
        high: "Alta"
      };
      return map[value] || value;
    };
    const formatDate = (value) => {
      if (!value) return "Sin fecha";
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return value;
      return parsed.toLocaleString("es-CL", { dateStyle: "medium", timeStyle: "short" });
    };
    const filteredTickets = computed(() => {
      const term = searchTerm.value.trim().toLowerCase();
      if (!term) return tickets.value;
      return tickets.value.filter(
        (ticket) => String(ticket.title || "").toLowerCase().includes(term) || String(ticket.description || "").toLowerCase().includes(term) || String(ticket.store_slug || "").toLowerCase().includes(term) || String(ticket.created_by_name || "").toLowerCase().includes(term)
      );
    });
    const activeTickets = computed(() => filteredTickets.value.filter((t) => !["resolved", "closed"].includes(t.status)));
    const resolvedTickets = computed(() => filteredTickets.value.filter((t) => ["resolved", "closed"].includes(t.status)));
    const totalPages = computed(() => Math.max(1, Math.ceil(activeTickets.value.length / perPage)));
    const paginatedActiveTickets = computed(() => {
      const start = (page.value - 1) * perPage;
      return activeTickets.value.slice(start, start + perPage);
    });
    const pageStart = computed(() => activeTickets.value.length ? (page.value - 1) * perPage + 1 : 0);
    const pageEnd = computed(() => Math.min(page.value * perPage, activeTickets.value.length));
    const hydrateDrafts = () => {
      const drafts = {};
      tickets.value.forEach((ticket) => {
        drafts[ticket.id] = {
          response_message: String(ticket.response_message || ""),
          status: String(ticket.status || "open"),
          priority: String(ticket.priority || "normal")
        };
      });
      draftByTicket.value = drafts;
    };
    const loadTickets = async () => {
      if (!auth.token) return;
      loading.value = true;
      try {
        const params = {};
        if (kind.value) params.kind = kind.value;
        if (status.value) params.status = status.value;
        if (priority.value) params.priority = priority.value;
        if (storeSlug.value) params.store = storeSlug.value;
        if (dateFrom.value) params.date_from = dateFrom.value;
        if (dateTo.value) params.date_to = dateTo.value;
        tickets.value = await $fetch(`${config.public.apiBase}/support/tickets/`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          params
        });
        hydrateDrafts();
      } catch (error) {
        console.warn("No se pudieron cargar tickets", error);
        tickets.value = [];
        draftByTicket.value = {};
      } finally {
        loading.value = false;
      }
    };
    watch([kind, status, priority, storeSlug, dateFrom, dateTo], () => loadTickets());
    watch([kind, status, priority, storeSlug, dateFrom, dateTo], () => {
      page.value = 1;
    });
    watch(searchTerm, () => {
      page.value = 1;
    });
    watch(tickets, () => {
      if (page.value > totalPages.value) page.value = totalPages.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-950 text-white" }, _attrs))}><div class="mx-auto max-w-6xl px-6 py-10 space-y-8"><header class="flex flex-wrap items-center justify-between gap-4"><div><p class="text-xs uppercase tracking-[0.2em] text-white/60">Soporte</p><h1 class="text-3xl font-extrabold">Tickets</h1><p class="text-white/70">Revisa y da seguimiento a tickets abiertos por las tiendas.</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "rounded-xl px-4 py-2 text-sm font-semibold text-white shadow",
        style: { backgroundColor: unref(theme).accent }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Regresar`);
          } else {
            return [
              createTextVNode("Regresar")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header><section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur"><div class="flex flex-wrap items-center gap-3"><label class="text-sm text-white/70">Tipo</label><select class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><option value=""${ssrIncludeBooleanAttr(Array.isArray(kind.value) ? ssrLooseContain(kind.value, "") : ssrLooseEqual(kind.value, "")) ? " selected" : ""}>Todos</option><option value="support"${ssrIncludeBooleanAttr(Array.isArray(kind.value) ? ssrLooseContain(kind.value, "support") : ssrLooseEqual(kind.value, "support")) ? " selected" : ""}>Soporte</option>`);
      if (isPlatformAdmin.value) {
        _push(`<option value="report"${ssrIncludeBooleanAttr(Array.isArray(kind.value) ? ssrLooseContain(kind.value, "report") : ssrLooseEqual(kind.value, "report")) ? " selected" : ""}>Denuncia</option>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</select><label class="text-sm text-white/70">Estado</label><select class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><option value=""${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "") : ssrLooseEqual(status.value, "")) ? " selected" : ""}>Todos</option><option value="open"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "open") : ssrLooseEqual(status.value, "open")) ? " selected" : ""}>Abierto</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "in_progress") : ssrLooseEqual(status.value, "in_progress")) ? " selected" : ""}>En progreso</option><option value="resolved"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "resolved") : ssrLooseEqual(status.value, "resolved")) ? " selected" : ""}>Resuelto</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(status.value) ? ssrLooseContain(status.value, "closed") : ssrLooseEqual(status.value, "closed")) ? " selected" : ""}>Cerrado</option></select><label class="text-sm text-white/70">Prioridad</label><select class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><option value=""${ssrIncludeBooleanAttr(Array.isArray(priority.value) ? ssrLooseContain(priority.value, "") : ssrLooseEqual(priority.value, "")) ? " selected" : ""}>Todas</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(priority.value) ? ssrLooseContain(priority.value, "high") : ssrLooseEqual(priority.value, "high")) ? " selected" : ""}>Alta</option><option value="normal"${ssrIncludeBooleanAttr(Array.isArray(priority.value) ? ssrLooseContain(priority.value, "normal") : ssrLooseEqual(priority.value, "normal")) ? " selected" : ""}>Normal</option><option value="low"${ssrIncludeBooleanAttr(Array.isArray(priority.value) ? ssrLooseContain(priority.value, "low") : ssrLooseEqual(priority.value, "low")) ? " selected" : ""}>Baja</option></select><label class="text-sm text-white/70">Tienda</label><select class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><option value=""${ssrIncludeBooleanAttr(Array.isArray(storeSlug.value) ? ssrLooseContain(storeSlug.value, "") : ssrLooseEqual(storeSlug.value, "")) ? " selected" : ""}>Todas</option><!--[-->`);
      ssrRenderList(storesMine.value, (s) => {
        _push(`<option${ssrRenderAttr("value", s.slug)}${ssrIncludeBooleanAttr(Array.isArray(storeSlug.value) ? ssrLooseContain(storeSlug.value, s.slug) : ssrLooseEqual(storeSlug.value, s.slug)) ? " selected" : ""}>${ssrInterpolate(s.name)}</option>`);
      });
      _push(`<!--]--></select><label class="text-sm text-white/70">Desde</label><input${ssrRenderAttr("value", dateFrom.value)} type="date" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><label class="text-sm text-white/70">Hasta</label><input${ssrRenderAttr("value", dateTo.value)} type="date" class="rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><label class="text-sm text-white/70">Buscar</label><input${ssrRenderAttr("value", searchTerm.value)} type="text" placeholder="Titulo, descripcion, tienda o denunciante" class="min-w-[240px] rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><span class="ml-auto text-xs text-white/60">${ssrInterpolate(activeTickets.value.length)} activos | ${ssrInterpolate(resolvedTickets.value.length)} resueltos</span></div>`);
      if (loading.value) {
        _push(`<div class="mt-4 text-white/70">Cargando...</div>`);
      } else {
        _push(`<div class="mt-4 space-y-6">`);
        if (!activeTickets.value.length) {
          _push(`<div class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 text-white/70">No hay tickets activos para mostrar.</div>`);
        } else {
          _push(`<div class="divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/[0.03]"><!--[-->`);
          ssrRenderList(paginatedActiveTickets.value, (t) => {
            _push(`<article class="space-y-4 px-4 py-4"><div class="flex items-start justify-between gap-3"><div class="space-y-1"><p class="text-sm font-semibold text-white">${ssrInterpolate(t.title)}</p><p class="text-xs text-white/60">${ssrInterpolate(t.store_slug || "Sin tienda")} • ${ssrInterpolate(formatStatus(t.status))} • Prioridad ${ssrInterpolate(formatPriority(t.priority))}</p><p class="text-xs text-white/50"> Creado por ${ssrInterpolate(t.created_by_name || "Usuario")} • ${ssrInterpolate(formatDate(t.created_at))}</p></div><span class="${ssrRenderClass(["rounded-full px-3 py-1 text-[11px] font-semibold", badgeClass(t.status)])}">${ssrInterpolate(formatStatus(t.status))}</span></div><p class="text-sm leading-relaxed text-white/85">${ssrInterpolate(t.description)}</p><div class="rounded-xl border border-white/10 bg-slate-900/40 p-3 space-y-3"><p class="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Respuesta del equipo</p><textarea rows="4" placeholder="Describe resolución, acciones aplicadas, próximos pasos y tiempo estimado." class="w-full rounded-xl border border-white/15 bg-slate-950/70 px-3 py-2 text-sm text-white placeholder-white/35">${ssrInterpolate(draftByTicket.value[t.id].response_message)}</textarea><div class="grid gap-3 sm:grid-cols-2"><div class="space-y-1"><label class="text-xs text-white/60">Estado</label><select class="w-full rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><option value="open"${ssrIncludeBooleanAttr(Array.isArray(draftByTicket.value[t.id].status) ? ssrLooseContain(draftByTicket.value[t.id].status, "open") : ssrLooseEqual(draftByTicket.value[t.id].status, "open")) ? " selected" : ""}>Abierto</option><option value="in_progress"${ssrIncludeBooleanAttr(Array.isArray(draftByTicket.value[t.id].status) ? ssrLooseContain(draftByTicket.value[t.id].status, "in_progress") : ssrLooseEqual(draftByTicket.value[t.id].status, "in_progress")) ? " selected" : ""}>En progreso</option><option value="resolved"${ssrIncludeBooleanAttr(Array.isArray(draftByTicket.value[t.id].status) ? ssrLooseContain(draftByTicket.value[t.id].status, "resolved") : ssrLooseEqual(draftByTicket.value[t.id].status, "resolved")) ? " selected" : ""}>Resuelto</option><option value="closed"${ssrIncludeBooleanAttr(Array.isArray(draftByTicket.value[t.id].status) ? ssrLooseContain(draftByTicket.value[t.id].status, "closed") : ssrLooseEqual(draftByTicket.value[t.id].status, "closed")) ? " selected" : ""}>Cerrado</option></select></div><div class="space-y-1"><label class="text-xs text-white/60">Prioridad</label><select class="w-full rounded-xl border border-white/15 bg-white px-3 py-2 text-sm text-slate-900"><option value="low"${ssrIncludeBooleanAttr(Array.isArray(draftByTicket.value[t.id].priority) ? ssrLooseContain(draftByTicket.value[t.id].priority, "low") : ssrLooseEqual(draftByTicket.value[t.id].priority, "low")) ? " selected" : ""}>Baja</option><option value="normal"${ssrIncludeBooleanAttr(Array.isArray(draftByTicket.value[t.id].priority) ? ssrLooseContain(draftByTicket.value[t.id].priority, "normal") : ssrLooseEqual(draftByTicket.value[t.id].priority, "normal")) ? " selected" : ""}>Normal</option><option value="high"${ssrIncludeBooleanAttr(Array.isArray(draftByTicket.value[t.id].priority) ? ssrLooseContain(draftByTicket.value[t.id].priority, "high") : ssrLooseEqual(draftByTicket.value[t.id].priority, "high")) ? " selected" : ""}>Alta</option></select></div></div><div class="flex flex-wrap items-center gap-3"><button class="rounded-xl px-3 py-2 text-xs font-semibold text-white" style="${ssrRenderStyle({ backgroundColor: unref(theme).accent })}"${ssrIncludeBooleanAttr(savingTicketId.value === t.id) ? " disabled" : ""}>${ssrInterpolate(savingTicketId.value === t.id ? "Guardando..." : "Guardar respuesta")}</button><button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"${ssrIncludeBooleanAttr(savingTicketId.value === t.id) ? " disabled" : ""}> Marcar en progreso </button>`);
            if (ticketMessageById.value[t.id]) {
              _push(`<span class="${ssrRenderClass([ticketMessageById.value[t.id].type === "error" ? "text-red-300" : "text-emerald-300", "text-xs"])}">${ssrInterpolate(ticketMessageById.value[t.id].message)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
            if (t.responded_at) {
              _push(`<p class="text-[11px] text-white/50"> Última respuesta: ${ssrInterpolate(formatDate(t.responded_at))} por ${ssrInterpolate(t.responded_by_name || "equipo de soporte")}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></article>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`<div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3"><div class="flex items-center justify-between gap-3"><p class="text-sm font-semibold text-emerald-100">Tickets resueltos y cerrados</p><span class="text-xs text-emerald-200/80">${ssrInterpolate(resolvedTickets.value.length)} registros</span></div>`);
        if (!resolvedTickets.value.length) {
          _push(`<div class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs text-emerald-100/80"> Aún no hay tickets resueltos para el filtro actual. </div>`);
        } else {
          _push(`<div class="space-y-2"><!--[-->`);
          ssrRenderList(resolvedTickets.value, (t) => {
            _push(`<article class="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3"><div class="flex items-start justify-between gap-3"><div><p class="text-sm font-semibold text-emerald-50">${ssrInterpolate(t.title)}</p><p class="text-xs text-emerald-100/80">${ssrInterpolate(t.store_slug || "Sin tienda")} • ${ssrInterpolate(formatStatus(t.status))} • ${ssrInterpolate(formatDate(t.updated_at))}</p></div><span class="rounded-full bg-emerald-600/25 px-2.5 py-1 text-[11px] font-semibold text-emerald-100">${ssrInterpolate(formatStatus(t.status))}</span></div>`);
            if (t.response_message) {
              _push(`<p class="mt-2 text-xs leading-relaxed text-emerald-50/90">${ssrInterpolate(t.response_message)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</article>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      }
      if (activeTickets.value.length > perPage) {
        _push(`<div class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white/70"><button class="rounded-lg border border-white/20 px-3 py-1.5 font-semibold hover:bg-white/10 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === 1) ? " disabled" : ""}> Anterior </button><p>Mostrando ${ssrInterpolate(pageStart.value)}-${ssrInterpolate(pageEnd.value)} de ${ssrInterpolate(activeTickets.value.length)}</p><button class="rounded-lg border border-white/20 px-3 py-1.5 font-semibold hover:bg-white/10 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value === totalPages.value) ? " disabled" : ""}> Siguiente </button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/tickets.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=tickets-C8ADtyeC.mjs.map
