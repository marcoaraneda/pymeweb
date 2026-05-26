<template>
  <ClientOnly>
    <NuxtPage v-if="!isDashboardRoot" />
    <div v-else class="relative min-h-screen bg-slate-950 text-white">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute -left-10 top-10 h-60 w-60 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-70" />
      <div class="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl opacity-60" />
    </div>

    <div class="relative z-10 mx-auto max-w-6xl px-6 py-10 space-y-10">
      <nav class="flex flex-wrap items-center justify-center gap-2">
        <NuxtLink
          v-for="link in dashboardLinks"
          :key="link.to"
          :to="link.to"
          class="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-lg"
          :class="route.path === link.to ? 'ring-2 ring-white/40' : ''"
          :style="{ background: link.color }"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Panel</p>
          <h1 class="text-3xl font-extrabold">Dashboard de tiendas</h1>
          <p class="text-white/70">Resumen rápido de tus tiendas, actividad y accesos. Revisa todas tus notificaciones desde aquí.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="selectedStore"
            class="rounded-xl border border-white/30 bg-white text-sm text-slate-900 px-3 py-2 focus:border-slate-300 focus:outline-none shadow-sm"
          >
            <option :value="MARKETPLACE_SCOPE">Marketplace</option>
            <option v-for="store in storesMine" :key="store.slug" :value="store.slug">{{ store.name }}</option>
          </select>
          <NuxtLink
            to="/notificaciones"
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5"
            :style="{ backgroundColor: theme.accent }"
          >
            Ver todas las notificaciones
          </NuxtLink>
        </div>
      </header>

      <Transition name="fade">
        <div
          v-if="toast"
          class="fixed left-1/2 top-6 sm:top-8 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg"
          :class="toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'"
        >
          {{ toast.text }}
        </div>
      </Transition>

      <div v-if="loadError" class="rounded-2xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-sm text-red-100">
        {{ loadError }}
      </div>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" v-if="!isMarketplaceSelected">
        <template v-if="statsLoading">
          <div v-for="n in 4" :key="n" class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="h-4 w-32 rounded bg-white/20 animate-pulse" />
            <div class="mt-3 h-7 w-16 rounded bg-white/30 animate-pulse" />
            <div class="mt-3 h-6 w-24 rounded bg-white/10 animate-pulse" />
          </div>
        </template>
        <template v-else>
          <StatCard title="Pedidos totales" :value="analytics.totalOrders" :icon="ShoppingCart" :accent="theme.accent" />
          <StatCard title="Pedidos pagados" :value="analytics.paidOrders" :icon="Eye" :accent="theme.accent" />
          <StatCard title="Ingresos" :value="currency(analytics.revenue)" :icon="Building2" :accent="theme.accent" />
          <StatCard title="Ticket promedio" :value="currency(analytics.avgTicket)" :icon="Headset" :accent="theme.accent" />
        </template>
      </section>

      <section v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Publicaciones</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ marketplaceOverview.total }}</p>
          <p class="text-xs text-white/60">Total de productos publicados</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">En curso</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ marketplaceOverview.inProgress }}</p>
          <p class="text-xs text-white/60">Preparando, enviándose o en tránsito</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Finalizados</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ marketplaceOverview.completed }}</p>
          <p class="text-xs text-white/60">Publicaciones marcadas como finalizadas</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Valor estimado</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ currency(marketplaceOverview.estimatedValue) }}</p>
          <p class="text-xs text-white/60">Suma referencial de precio por stock</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ventas cerradas</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ marketplaceSellerSummary.totalOrders }}</p>
          <p class="text-xs text-white/60">Pedidos completados o entregados</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Unidades vendidas</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ marketplaceSellerSummary.totalUnits }}</p>
          <p class="text-xs text-white/60">Total de unidades vendidas</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ingresos reales</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ currency(marketplaceSellerSummary.grossSales) }}</p>
          <p class="text-xs text-white/60">Ventas cerradas de tu perfil</p>
        </div>
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ventas en proceso</p>
          <p class="mt-2 text-2xl font-semibold text-white">{{ marketplaceSellerSummary.inProgressOrders }}</p>
          <p class="text-xs text-white/60">Pendiente, preparando o en tránsito</p>
        </div>
      </section>

      <section v-if="!isMarketplaceSelected" class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Rendimiento</p>
              <h2 class="text-xl font-semibold">Ingresos por día</h2>
            </div>
            <span class="text-xs text-white/60">{{ storeTrendSeries.length }} días</span>
          </div>
          <div v-if="dailyLoading" class="mt-4 space-y-2">
            <div v-for="n in 5" :key="`daily-skel-${n}`" class="h-6 rounded-lg bg-white/10 animate-pulse" />
          </div>
          <div v-else-if="!storeTrendSeries.length" class="mt-4 text-sm text-white/70">Sin datos diarios para la tienda seleccionada.</div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="item in storeTrendSeries" :key="`daily-${item.day}`" class="space-y-1">
              <div class="flex items-center justify-between text-xs text-white/70">
                <span>{{ formatShortDate(item.day) }}</span>
                <span>{{ currency(item.revenue) }}</span>
              </div>
              <div class="h-2 w-full rounded-full bg-white/10">
                <div
                  class="h-2 rounded-full"
                  :style="{ width: `${Math.max(6, Math.round((Number(item.revenue || 0) / storeTrendMax) * 100))}%`, backgroundColor: theme.accent }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Distribución</p>
              <h2 class="text-xl font-semibold">Estados de pedidos</h2>
            </div>
            <span class="text-xs text-white/60">{{ orders.length }} pedidos</span>
          </div>
          <div v-if="ordersLoading" class="mt-4 space-y-2">
            <div v-for="n in 5" :key="`status-skel-${n}`" class="h-6 rounded-lg bg-white/10 animate-pulse" />
          </div>
          <div v-else-if="!orderStatusSummary.length" class="mt-4 text-sm text-white/70">Sin pedidos para graficar.</div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="item in orderStatusSummary" :key="`status-row-${item.value}`" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-white/80">{{ item.label }}</span>
                <span class="text-white/60">{{ item.count }} ({{ item.percent }}%)</span>
              </div>
              <div class="h-2 w-full rounded-full bg-white/10">
                <div class="h-2 rounded-full" :style="{ width: `${Math.max(4, item.percent)}%`, backgroundColor: item.color }" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-else class="grid gap-6 lg:grid-cols-2">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Marketplace</p>
              <h2 class="text-xl font-semibold">Estados de publicaciones</h2>
            </div>
            <span class="text-xs text-white/60">{{ marketplaceOverview.total }} publicaciones</span>
          </div>
          <div v-if="loadingMarketplaceSubmissions" class="mt-4 space-y-2">
            <div v-for="n in 4" :key="`mp-status-skel-${n}`" class="h-6 rounded-lg bg-white/10 animate-pulse" />
          </div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="item in marketplaceStatusSummary" :key="`mp-status-${item.value}`" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-white/80">{{ item.label }}</span>
                <span class="text-white/60">{{ item.count }} ({{ item.percent }}%)</span>
              </div>
              <div class="h-2 w-full rounded-full bg-white/10">
                <div class="h-2 rounded-full" :style="{ width: `${Math.max(4, item.percent)}%`, backgroundColor: item.color }" />
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Actividad</p>
              <h2 class="text-xl font-semibold">Publicaciones últimos 7 días</h2>
            </div>
            <span class="text-xs text-white/60">Real</span>
          </div>
          <div class="mt-4 space-y-2">
            <div v-for="item in marketplaceRecentSeries" :key="`mp-day-${item.day}`" class="space-y-1">
              <div class="flex items-center justify-between text-xs text-white/70">
                <span>{{ formatShortDate(item.day) }}</span>
                <span>{{ item.count }} publicaciones</span>
              </div>
              <div class="h-2 w-full rounded-full bg-white/10">
                <div
                  class="h-2 rounded-full"
                  :style="{ width: `${Math.max(8, Math.round((item.count / marketplaceRecentMax) * 100))}%`, backgroundColor: '#f59e0b' }"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="isMarketplaceSelected" class="grid gap-6 lg:grid-cols-1">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Marketplace</p>
              <h2 class="text-xl font-semibold">Mis productos de Marketplace</h2>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <select
                v-model="marketplaceStatusFilter"
                class="rounded-xl border border-white/20 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="">Todos los estados</option>
                <option v-for="option in marketplaceStatusOptions" :key="`market-status-${option.value}`" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
              <button
                class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5 disabled:opacity-60"
                :style="{ backgroundColor: theme.accent }"
                :disabled="loadingMarketplaceSubmissions"
                @click="loadMarketplaceSubmissions"
              >
                {{ loadingMarketplaceSubmissions ? 'Actualizando...' : 'Actualizar' }}
              </button>
            </div>
          </div>

          <div v-if="loadingMarketplaceSubmissions" class="mt-4 grid gap-3 sm:grid-cols-2">
            <div v-for="n in 4" :key="`marketplace-submission-skeleton-${n}`" class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="h-4 w-36 rounded bg-white/20 animate-pulse" />
              <div class="mt-2 h-3 w-24 rounded bg-white/10 animate-pulse" />
              <div class="mt-3 h-8 w-full rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          <div v-else-if="!filteredMarketplaceSubmissions.length" class="mt-4 rounded-2xl border border-dashed border-white/15 bg-white/5 p-5 text-white/70">
            No tienes productos marketplace para el estado seleccionado.
          </div>
          <div v-else class="mt-4 space-y-3">
            <div
              v-for="item in paginatedMarketplaceSubmissions"
              :key="`marketplace-submission-${item.id}`"
              class="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p class="font-semibold text-white">{{ item.name }}</p>
                  <p class="text-xs text-white/60">{{ item.slug }} • ID {{ item.id }}</p>
                </div>
                <span class="rounded-full px-2 py-1 text-[11px] font-semibold" :class="marketplaceStatusBadge(item.marketplace_status).classes">
                  {{ marketplaceStatusBadge(item.marketplace_status).label }}
                </span>
              </div>
              <div class="mt-3 flex flex-wrap items-center gap-2">
                <select
                  class="rounded-lg border border-white/20 bg-white px-3 py-2 text-xs text-slate-900"
                  :value="item.marketplace_status || 'preparing'"
                  @change="(e) => updateMarketplaceStatus(item.id, (e.target as HTMLSelectElement).value)"
                >
                  <option v-for="option in marketplaceStatusOptions" :key="`market-status-item-${item.id}-${option.value}`" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
                <NuxtLink
                  :to="`/marketplace/productos/${item.slug}?edit=1`"
                  class="rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 hover:border-white/40 hover:text-white"
                >
                  Editar publicación
                </NuxtLink>
              </div>
            </div>

            <div v-if="marketplaceSubmissionsTotalPages > 1" class="flex items-center justify-between text-xs text-white/70">
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="marketplaceSubmissionsPage === 1" @click="marketplaceSubmissionsPage--">Anterior</button>
              <span>Página {{ marketplaceSubmissionsPage }} / {{ marketplaceSubmissionsTotalPages }}</span>
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="marketplaceSubmissionsPage === marketplaceSubmissionsTotalPages" @click="marketplaceSubmissionsPage++">Siguiente</button>
            </div>
          </div>
        </div>
      </section>

      <section v-if="!isMarketplaceSelected" class="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Soporte</p>
              <h2 class="text-xl font-semibold">Resumen de tickets</h2>
              <p class="text-white/70">Estado actual y acceso rápido al panel de soporte</p>
            </div>
            <NuxtLink
              :to="selectedStore ? `/dashboard/tickets?store=${selectedStore}` : '/dashboard/tickets'"
              class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold text-white/80 hover:text-white hover:border-white/40"
            >
              Ver tickets
            </NuxtLink>
          </div>

          <div class="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div class="rounded-xl bg-amber-500/15 px-3 py-2 text-amber-100">
              <p class="text-[11px] uppercase">Abiertos</p>
              <p class="mt-1 text-lg font-bold">{{ ticketStats.open }}</p>
            </div>
            <div class="rounded-xl bg-sky-500/15 px-3 py-2 text-sky-100">
              <p class="text-[11px] uppercase">En progreso</p>
              <p class="mt-1 text-lg font-bold">{{ ticketStats.inProgress }}</p>
            </div>
            <div class="rounded-xl bg-emerald-500/15 px-3 py-2 text-emerald-100">
              <p class="text-[11px] uppercase">Resueltos</p>
              <p class="mt-1 text-lg font-bold">{{ ticketStats.resolved }}</p>
            </div>
          </div>

          <div v-if="loadingTickets" class="mt-4 text-sm text-white/70">Cargando tickets...</div>
          <div v-else-if="!tickets.length" class="mt-4 rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-3 text-sm text-white/70">
            No hay tickets para la tienda seleccionada.
          </div>
          <div v-else class="mt-4 space-y-2">
            <button
              v-for="t in tickets.slice(0, 4)"
              :key="t.id"
              class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/80 transition hover:border-white/30"
              @click="goToSupport(t)"
            >
              <p class="font-semibold text-white line-clamp-1">{{ t.title }}</p>
              <p class="text-xs text-white/60">{{ t.store_slug || 'Sin tienda' }} • {{ ticketBadge(t.status).label }}</p>
            </button>
          </div>

          <div class="mt-5 rounded-2xl border border-rose-400/25 bg-rose-500/10 p-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-rose-100/80">Denuncias</p>
                <h3 class="text-sm font-semibold text-rose-100">Apartado de reportes</h3>
              </div>
              <NuxtLink
                :to="selectedStore ? `/dashboard/tickets?store=${selectedStore}&kind=report` : '/dashboard/tickets?kind=report'"
                class="rounded-lg border border-rose-300/40 px-3 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-400/15"
              >
                Gestionar denuncias
              </NuxtLink>
            </div>
            <div class="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div class="rounded-xl bg-rose-400/20 px-3 py-2 text-rose-100">
                <p class="text-[11px] uppercase">Abiertas</p>
                <p class="mt-1 text-lg font-bold">{{ reportStats.open }}</p>
              </div>
              <div class="rounded-xl bg-sky-400/20 px-3 py-2 text-sky-100">
                <p class="text-[11px] uppercase">En progreso</p>
                <p class="mt-1 text-lg font-bold">{{ reportStats.inProgress }}</p>
              </div>
              <div class="rounded-xl bg-emerald-400/20 px-3 py-2 text-emerald-100">
                <p class="text-[11px] uppercase">Resueltas/Cerradas</p>
                <p class="mt-1 text-lg font-bold">{{ reportStats.done }}</p>
              </div>
            </div>
            <div v-if="reportTickets.length" class="mt-3 space-y-1">
              <button
                v-for="r in reportTickets.slice(0, 3)"
                :key="`report-${r.id}`"
                class="w-full rounded-lg border border-rose-300/20 bg-rose-400/10 px-3 py-2 text-left text-xs text-rose-50/90 hover:border-rose-200/40"
                @click="openReportDetail(r)"
              >
                <p class="font-semibold line-clamp-1">{{ r.title }}</p>
                <p class="text-[11px] text-rose-100/70">{{ r.store_slug || 'Sin tienda' }} • {{ ticketBadge(r.status).label }}</p>
              </button>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Actividad útil</p>
              <h2 class="text-xl font-semibold">Pulso operativo</h2>
              <p class="text-white/70">Indicadores rápidos para decisiones del día.</p>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div class="rounded-xl bg-emerald-500/15 px-3 py-2 text-emerald-100">
              <p class="text-[11px] uppercase">Ventas 7d</p>
              <p class="mt-1 text-lg font-bold">{{ operationalSnapshot.orders7d }}</p>
            </div>
            <div class="rounded-xl bg-sky-500/15 px-3 py-2 text-sky-100">
              <p class="text-[11px] uppercase">Ingresos 7d</p>
              <p class="mt-1 text-lg font-bold">{{ currency(operationalSnapshot.revenue7d) }}</p>
            </div>
            <div class="rounded-xl bg-amber-500/15 px-3 py-2 text-amber-100">
              <p class="text-[11px] uppercase">Pendientes</p>
              <p class="mt-1 text-lg font-bold">{{ pendingOrders.length }}</p>
            </div>
            <div class="rounded-xl bg-fuchsia-500/15 px-3 py-2 text-fuchsia-100">
              <p class="text-[11px] uppercase">Conversión</p>
              <p class="mt-1 text-lg font-bold">{{ operationalSnapshot.conversionRate }}%</p>
            </div>
          </div>

          <div class="mt-4 space-y-2 text-sm text-white/75">
            <p>Mejor día: <span class="font-semibold text-white">{{ operationalSnapshot.bestDayLabel }}</span></p>
            <p>Ticket estimado: <span class="font-semibold text-white">{{ currency(operationalSnapshot.avgTicket) }}</span></p>
            <p>Última actualización: <span class="font-semibold text-white">{{ operationalSnapshot.updatedAt }}</span></p>
          </div>
        </div>
      </section>

      <section v-if="!isMarketplaceSelected" class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Más vendidos</p>
            <h2 class="text-xl font-semibold">Productos con más compras</h2>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              class="rounded-lg border border-white/15 px-3 py-1 text-sm text-white/80 hover:border-white/40"
              @click="exportTopProducts"
              :disabled="!topProducts.length"
            >
              Exportar Excel
            </button>
            <NuxtLink v-if="storesMine[0]" :to="`/store/${storesMine[0].slug}/productos`" class="text-sm font-semibold text-white/80 hover:text-white">Ver catálogo</NuxtLink>
          </div>
        </div>
        <div v-if="topLoading" class="mt-4 space-y-3">
          <div v-for="n in 3" :key="n" class="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-3">
            <div class="space-y-2">
              <div class="h-4 w-40 rounded bg-white/20 animate-pulse" />
              <div class="h-3 w-28 rounded bg-white/10 animate-pulse" />
            </div>
            <div class="space-y-2 text-right">
              <div class="h-4 w-16 rounded bg-white/20 animate-pulse ml-auto" />
              <div class="h-3 w-24 rounded bg-white/10 animate-pulse ml-auto" />
            </div>
          </div>
        </div>
        <div v-else-if="!topProducts.length" class="mt-4 text-white/70">No hay datos aún.</div>
        <div v-else class="mt-4 divide-y divide-white/10">
          <div v-for="prod in topProducts" :key="prod.id + (prod.store_slug || prod.store?.slug || '')" class="flex items-center justify-between py-3 text-white/80">
            <div>
              <p class="font-semibold text-white">{{ prod.name }}</p>
              <p class="text-xs text-white/60">{{ prod.store_slug || 'tienda' }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm">{{ prod.total_quantity }} ventas</p>
              <p class="text-xs text-white/60">Ingresos ${{ prod.revenue || '0' }}</p>
            </div>
          </div>
        </div>
      </section>

      <section v-if="!isMarketplaceSelected" class="grid gap-4 lg:grid-cols-2">
        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Pedidos en proceso</p>
              <h2 class="text-xl font-semibold">Pendientes</h2>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-100">{{ pendingOrders.length }}</span>
            </div>
          </div>
          <div v-if="ordersLoading" class="mt-4 space-y-3">
            <div v-for="n in 3" :key="n" class="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div class="flex items-center justify-between">
                <div class="h-4 w-32 rounded bg-white/20 animate-pulse" />
                <div class="h-3 w-20 rounded bg-amber-200/40 animate-pulse" />
              </div>
              <div class="mt-2 h-3 w-24 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          <div v-else-if="!pendingOrders.length" class="mt-4 text-white/70">No hay pedidos en proceso.</div>
          <div v-else class="mt-4 space-y-3">
            <NuxtLink
              v-for="o in pendingPageOrders"
              :key="o.id"
              :to="orderLink(o.id)"
              class="block rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/30"
            >
              <div class="flex items-center justify-between">
                <p class="font-semibold text-white">#{{ o.id }} — {{ o.name || 'Cliente' }}</p>
                <span class="text-xs text-white/60">{{ formatDate(o.created_at) }}</span>
              </div>
              <p class="text-xs text-white/60">{{ o.store_slug || 'tienda' }}</p>
              <NuxtLink :to="trackingLink(o)" class="mt-1 inline-flex items-center rounded-full border border-sky-300/40 bg-sky-400/10 px-2 py-0.5 text-[11px] font-semibold text-sky-100 hover:bg-sky-400/20">
                Tracking: {{ trackingCodeFor(o) }}
              </NuxtLink>
              <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span class="font-semibold" :style="{ color: theme.accent }">{{ currency(o.total) }}</span>
                <div class="flex items-center gap-2">
                  <span :class="['rounded-full px-2 py-0.5 text-[11px] font-semibold', statusBadge(o.status).classes]">{{ statusBadge(o.status).label }}</span>
                  <select
                    class="rounded-lg border border-white/20 bg-white px-2 py-1 text-[11px] text-slate-900"
                    :value="o.status"
                    @change="(e) => updateOrderStatus(o.id, (e.target as HTMLSelectElement).value)"
                  >
                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
                </div>
              </div>
            </NuxtLink>
            <div class="flex items-center justify-between text-xs text-white/70" v-if="pendingTotalPages > 1">
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="pendingPage === 1" @click="pendingPage--">Anterior</button>
              <span>Página {{ pendingPage }} / {{ pendingTotalPages }}</span>
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="pendingPage === pendingTotalPages" @click="pendingPage++">Siguiente</button>
            </div>
          </div>
        </div>

        <div class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-white/60">Entregados</p>
              <h2 class="text-xl font-semibold">Productos finalizados</h2>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-100">{{ deliveredOrders.length }}</span>
            </div>
          </div>
          <div v-if="ordersLoading" class="mt-4 space-y-3">
            <div v-for="n in 3" :key="n" class="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div class="flex items-center justify-between">
                <div class="h-4 w-32 rounded bg-white/20 animate-pulse" />
                <div class="h-3 w-20 rounded bg-emerald-200/40 animate-pulse" />
              </div>
              <div class="mt-2 h-3 w-24 rounded bg-white/10 animate-pulse" />
            </div>
          </div>
          <div v-else-if="!deliveredOrders.length" class="mt-4 text-white/70">No hay pedidos entregados.</div>
          <div v-else class="mt-4 space-y-3">
            <NuxtLink
              v-for="o in deliveredPageOrders"
              :key="o.id"
              :to="orderLink(o.id)"
              class="block rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-white/30"
            >
              <div class="flex items-center justify-between">
                <p class="font-semibold text-white">#{{ o.id }} — {{ o.name || 'Cliente' }}</p>
                <span class="text-xs text-white/60">{{ formatDate(o.created_at) }}</span>
              </div>
              <p class="text-xs text-white/60">{{ o.store_slug || 'tienda' }}</p>
              <NuxtLink :to="trackingLink(o)" class="mt-1 inline-flex items-center rounded-full border border-emerald-300/40 bg-emerald-400/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-100 hover:bg-emerald-400/20">
                Tracking: {{ trackingCodeFor(o) }}
              </NuxtLink>
              <div class="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span class="font-semibold" :style="{ color: theme.accent }">{{ currency(o.total) }}</span>
                <span :class="['rounded-full px-2 py-0.5 text-[11px] font-semibold', statusBadge(o.status).classes]">{{ statusBadge(o.status).label }}</span>
              </div>
            </NuxtLink>
            <div class="flex items-center justify-between text-xs text-white/70" v-if="deliveredTotalPages > 1">
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="deliveredPage === 1" @click="deliveredPage--">Anterior</button>
              <span>Página {{ deliveredPage }} / {{ deliveredTotalPages }}</span>
              <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="deliveredPage === deliveredTotalPages" @click="deliveredPage++">Siguiente</button>
            </div>
          </div>
        </div>
      </section>

      <section class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Comentarios</p>
            <h2 class="text-xl font-semibold">Lo que dicen los clientes</h2>
            <p class="text-xs text-white/60">Reseñas públicas sin desactivación manual; solo se bloquea lenguaje ofensivo al crear.</p>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 hover:text-white"
            @click="loadRecentReviews(true)"
          >
            <MessageSquare class="h-4 w-4" aria-hidden="true" />
            Actualizar
          </button>
        </div>
        <div v-if="loadingReviews" class="mt-4 space-y-3">
          <div v-for="n in 3" :key="n" class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div class="flex items-center justify-between">
              <div class="h-4 w-32 rounded bg-white/20 animate-pulse" />
              <div class="h-4 w-16 rounded bg-amber-200/30 animate-pulse" />
            </div>
            <div class="mt-2 h-3 w-40 rounded bg-white/10 animate-pulse" />
            <div class="mt-1 h-3 w-52 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
        <div v-else-if="!recentReviews.length" class="mt-4 text-white/70">
          {{ isMarketplaceSelected ? 'Aún no hay comentarios recientes vinculados a tu actividad de marketplace.' : 'Aún no hay reseñas registradas en tus tiendas.' }}
        </div>
        <div v-else class="mt-4 space-y-3">
          <div
            v-for="review in pagedRecentReviews"
            :key="review.id + review.created_at"
            class="block rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p class="text-white font-semibold">Producto {{ review.product || '—' }}</p>
                <p class="text-xs text-white/60">{{ review.customer_name || 'Cliente' }} • {{ review.store_slug }}</p>
              </div>
              <div class="flex flex-wrap items-center justify-end gap-2">
                <span class="rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="reviewStatusBadge(review.status).classes">
                  {{ reviewStatusBadge(review.status).label }}
                </span>
                <div class="flex items-center gap-1 text-amber-300">
                  <StarIcon
                    v-for="star in 5"
                    :key="star"
                    class="h-4 w-4"
                    :class="star <= Number(review.rating) ? 'text-amber-400 fill-amber-400 stroke-amber-400' : 'text-white/30 fill-transparent stroke-white/40'"
                  />
                </div>
              </div>
            </div>
            <p class="mt-2 text-white/80">{{ review.comment }}</p>
            <p class="mt-2 text-[11px] text-white/50">{{ new Date(review.created_at).toLocaleString() }}</p>
          </div>
          <div class="flex items-center justify-between text-xs text-white/70" v-if="reviewsTotalPages > 1">
            <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="reviewsPage === 1" @click="reviewsPage--">Anterior</button>
            <span>Página {{ reviewsPage }} / {{ reviewsTotalPages }}</span>
            <button class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40" :disabled="reviewsPage === reviewsTotalPages" @click="reviewsPage++">Siguiente</button>
          </div>
        </div>
      </section>

      <section v-if="false" class="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Soporte</p>
            <h2 class="text-xl font-semibold">Tickets</h2>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">{{ tickets.length }}</span>
          </div>
        </div>
        <div v-if="loadingTickets" class="mt-4 space-y-3">
          <div v-for="n in 3" :key="n" class="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div class="h-4 w-48 rounded bg-white/20 animate-pulse" />
            <div class="mt-2 h-3 w-32 rounded bg-white/10 animate-pulse" />
            <div class="mt-2 h-3 w-40 rounded bg-white/10 animate-pulse" />
          </div>
        </div>
        <div v-else-if="!tickets.length" class="mt-4 text-white/70">No hay tickets abiertos.</div>
        <div v-else class="mt-4 divide-y divide-white/10">
          <button
            v-for="t in tickets"
            :key="t.id"
            class="w-full py-3 flex items-start justify-between gap-3 text-left transition hover:bg-white/5"
            @click="openTicket(t)"
          >
            <div class="space-y-1">
              <p class="text-sm font-semibold text-white">{{ t.title }}</p>
              <p class="text-xs text-white/60">{{ t.store_slug || 'Sin tienda' }} • Prioridad {{ t.priority }}</p>
              <p class="text-sm text-white/80 line-clamp-2">{{ t.description }}</p>
            </div>
            <span :class="['rounded-full px-3 py-1 text-[11px] font-semibold', ticketBadge(t.status).classes]">{{ ticketBadge(t.status).label }}</span>
          </button>
        </div>
      </section>

      <div v-if="showTicketModal" class="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4 py-6">
        <div class="relative w-full max-w-2xl rounded-3xl bg-slate-900 p-6 shadow-2xl border border-white/10">
          <button class="absolute right-4 top-4 text-white/70 hover:text-white" @click="closeTicket">✕</button>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Ticket</p>
          <h3 class="text-2xl font-semibold text-white">{{ selectedTicket?.title }}</h3>
          <p class="text-sm text-white/70 mt-1">{{ selectedTicket?.store_slug || 'Sin tienda' }}</p>

          <div class="mt-4 grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-xs text-white/60">Estado</label>
              <select v-model="editStatus" class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
                <option value="open">Abierto</option>
                <option value="in_progress">En progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-xs text-white/60">Prioridad</label>
              <select v-model="editPriority" class="w-full rounded-xl border border-white/20 bg-white text-sm text-slate-900 px-3 py-2">
                <option value="low">Baja</option>
                <option value="normal">Normal</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <p class="text-xs uppercase tracking-[0.2em] text-white/60">Descripción</p>
            <p class="mt-2 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white/80 whitespace-pre-line">{{ selectedTicket?.description }}</p>
          </div>

          <div class="mt-4 space-y-2">
            <label class="text-xs text-white/60">Agregar comentario (visible para el cliente)</label>
            <textarea v-model="newComment" rows="3" class="w-full rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/90" placeholder="Escribe una actualización"></textarea>
          </div>

          <div class="mt-6 flex items-center gap-3">
            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/25 transition hover:-translate-y-0.5 disabled:opacity-60"
              :style="{ backgroundColor: theme.accent }"
              :disabled="savingTicket"
              @click="saveTicket"
            >
              {{ savingTicket ? 'Guardando...' : 'Guardar cambios' }}
            </button>
            <button class="text-sm text-white/70 hover:text-white" @click="closeTicket">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

      <div v-if="showReportModal" class="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4 py-6">
        <div class="relative w-full max-w-2xl rounded-3xl border border-rose-300/20 bg-slate-900 p-6 shadow-2xl">
          <button class="absolute right-4 top-4 text-white/70 hover:text-white" @click="closeReport">✕</button>
          <p class="text-xs uppercase tracking-[0.2em] text-rose-100/70">Denuncia recibida</p>
          <h3 class="text-2xl font-semibold text-white">{{ selectedReport?.title }}</h3>
          <p class="mt-1 text-sm text-white/70">
            {{ selectedReport?.store_slug || 'Sin tienda' }} · {{ formatDate(selectedReport?.created_at) }} · {{ selectedReport?.created_by_name || 'Sin denunciante' }}
          </p>

          <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/85">
            <p class="text-xs uppercase tracking-[0.18em] text-white/50">Motivo y detalle</p>
            <p class="mt-2 whitespace-pre-line">{{ selectedReport?.description }}</p>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-3">
            <button class="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10" @click="goToSupport(selectedReport || undefined)">Abrir en panel completo</button>
            <button class="rounded-xl px-4 py-2 text-sm font-semibold text-white" :style="{ backgroundColor: theme.accent }" @click="closeReport">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { navigateTo, useRuntimeConfig } from 'nuxt/app'
import { useRoute } from 'vue-router'
import StoreCard from '~/components/StoreCard.vue'
import StatCard from '~/components/StatCard.vue'
import { Building2, Eye, ShoppingCart, Headset, MessageSquare, Star as StarIcon } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useDashboardAccess } from '~/composables/useDashboardAccess'

definePageMeta({ middleware: ['auth'], requiresAuth: true, ssr: false })

type TicketItem = {
  id: number
  title: string
  description: string
  status: string
  priority: string
  store_slug?: string | null
}

const auth = useAuthStore()
const theme = useThemeStore()
const route = useRoute()
const isDashboardRoot = computed(() => route.path === '/dashboard')
const { dashboardLinks } = useDashboardAccess()
const MARKETPLACE_SCOPE = 'marketplace'
const storesMine = ref<{ id: number; name: string; slug: string }[]>([])
const selectedStore = ref('')
const loading = ref(true)
const loadError = ref('')
const toast = ref<{ text: string; type: 'success' | 'error' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null
const topProducts = ref<any[]>([])
const topLoading = ref(true)
const orders = ref<any[]>([])
const ordersLoading = ref(true)
const pendingPage = ref(1)
const deliveredPage = ref(1)
const pendingPageSize = 6
const deliveredPageSize = 10
const config = useRuntimeConfig()
const apiBase = String(config.public.apiBase || '')
const deletingStore = ref(false)
const marketplaceSubmissions = ref<any[]>([])
const loadingMarketplaceSubmissions = ref(false)
const marketplaceSellerProfile = ref<any | null>(null)
const loadingMarketplaceSellerProfile = ref(false)
const marketplaceStatusFilter = ref('')
const marketplaceSubmissionsPage = ref(1)
const marketplaceSubmissionsPageSize = 8
const marketplaceStatusOptions = [
  { value: 'preparing', label: 'Preparando' },
  { value: 'shipping', label: 'Enviándose' },
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'completed', label: 'Finalizado' },
]
const statusOptions = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'delivered', label: 'Listo / Entregado' },
  { value: 'completed', label: 'Finalizado' },
  { value: 'cancelled', label: 'Cancelado' },
]

const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
  if (!auth.token) throw new Error('No autenticado')
  const doFetch = (token: string) =>
    $fetch<T>(url as any, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    })

  try {
    return await doFetch(auth.token)
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) return doFetch(refreshed)
    }
    throw error
  }
}

const ensureAuthReady = async () => {
  return Boolean(await auth.initializeSession({ forceProfile: true }))
}

type DashboardSummary = {
  total_orders: number
  paid_orders: number
  total_revenue: number
  avg_ticket: number
  status_counts?: Record<string, number>
}

const analytics = ref<{ totalOrders: number; paidOrders: number; revenue: number; avgTicket: number }>({ totalOrders: 0, paidOrders: 0, revenue: 0, avgTicket: 0 })
const statsLoading = ref(true)
const dailyStats = ref<{ day: string; orders: number; revenue: number }[]>([])
const dailyLoading = ref(true)
const sparklineBars = computed(() => {
  const values = dailyStats.value.map((d) => Number(d.revenue) || Number(d.orders) || 0)
  if (!values.length) return []
  const max = Math.max(...values, 1)
  return values.map((v) => 24 + Math.round((v / max) * 120))
})
const showToast = (text: string, type: 'success' | 'error' = 'success') => {
  toast.value = { text, type }
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (toast.value = null), 3200)
}
const tickets = ref<TicketItem[]>([])
const reportTickets = ref<TicketItem[]>([])
const loadingTickets = ref(true)
const selectedTicket = ref<TicketItem | null>(null)
const showTicketModal = ref(false)
const selectedReport = ref<TicketItem | null>(null)
const showReportModal = ref(false)
const editStatus = ref('open')
const editPriority = ref('normal')
const newComment = ref('')
const savingTicket = ref(false)
const recentReviews = ref<ReviewFeedItem[]>([])
const loadingReviews = ref(false)
const REVIEW_EVENT = 'pymeweb:review-created'
const reviewsPage = ref(1)
const reviewsPageSize = 6

type ReviewFeedItem = {
  id: number | string
  rating: number
  comment: string
  customer_name: string
  created_at: string
  store_slug: string
  product?: number
  status?: string
}

const barColor = (idx: number) => (idx === sparklineBars.value.length - 1 ? theme.accent : 'rgba(255,255,255,0.25)')
const isMarketplaceSelected = computed(() => selectedStore.value === MARKETPLACE_SCOPE)
const hasPhysicalStoreSelected = computed(() => Boolean(selectedStore.value) && !isMarketplaceSelected.value)

const marketplaceOverview = computed(() => {
  const items = marketplaceSubmissions.value || []
  const completed = items.filter((item) => String(item.marketplace_status || 'preparing') === 'completed').length
  const inProgress = items.filter((item) => ['preparing', 'shipping', 'in_transit'].includes(String(item.marketplace_status || 'preparing'))).length
  const estimatedValue = items.reduce((total, item) => {
    const unitPrice = Number(item.offer_price || item.price || 0)
    const stock = Math.max(1, Number(item.stock_available || 0))
    return total + unitPrice * stock
  }, 0)
  return {
    total: items.length,
    completed,
    inProgress,
    estimatedValue,
  }
})

const marketplaceSellerSummary = computed(() => {
  const summary = marketplaceSellerProfile.value?.sales_summary || {}
  return {
    totalOrders: Number(summary.total_orders || 0),
    totalUnits: Number(summary.total_units || 0),
    grossSales: Number(summary.gross_sales || 0),
    inProgressOrders: Number(summary.in_progress_orders || 0),
  }
})

const storeTrendSeries = computed(() => dailyStats.value.slice(-10))
const storeTrendMax = computed(() => {
  if (!storeTrendSeries.value.length) return 1
  return Math.max(...storeTrendSeries.value.map((item) => Number(item.revenue || 0)), 1)
})

const orderStatusPalette: Record<string, string> = {
  pending: '#f59e0b',
  preparing: '#f97316',
  in_transit: '#0ea5e9',
  delivered: '#22c55e',
  completed: '#10b981',
  paid: '#14b8a6',
  cancelled: '#ef4444',
}

const orderStatusSummary = computed(() => {
  const total = Math.max(orders.value.length, 1)
  const grouped = statusOptions
    .map((option) => {
      const count = orders.value.filter((order) => String(order.status) === option.value).length
      const percent = Math.round((count / total) * 100)
      return {
        value: option.value,
        label: option.label,
        count,
        percent,
        color: orderStatusPalette[option.value] || theme.accent,
      }
    })
    .filter((item) => item.count > 0)
  return grouped
})

const marketplaceStatusPalette: Record<string, string> = {
  preparing: '#f59e0b',
  shipping: '#0ea5e9',
  in_transit: '#3b82f6',
  completed: '#10b981',
}

const marketplaceStatusSummary = computed(() => {
  const total = Math.max(marketplaceSubmissions.value.length, 1)
  return marketplaceStatusOptions.map((option) => {
    const count = marketplaceSubmissions.value.filter((item) => String(item.marketplace_status || 'preparing') === option.value).length
    return {
      value: option.value,
      label: option.label,
      count,
      percent: Math.round((count / total) * 100),
      color: marketplaceStatusPalette[option.value] || '#f59e0b',
    }
  })
})

const marketplaceRecentSeries = computed(() => {
  const days: { day: string; count: number }[] = []
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - offset)
    const day = date.toISOString().slice(0, 10)
    days.push({ day, count: 0 })
  }
  const byDay = new Map(days.map((row) => [row.day, row]))
  marketplaceSubmissions.value.forEach((item) => {
    const dateSource = item.created_at || item.updated_at
    if (!dateSource) return
    const day = String(dateSource).slice(0, 10)
    const row = byDay.get(day)
    if (row) row.count += 1
  })
  return days
})

const marketplaceRecentMax = computed(() => {
  if (!marketplaceRecentSeries.value.length) return 1
  return Math.max(...marketplaceRecentSeries.value.map((row) => row.count), 1)
})

const operationalSnapshot = computed(() => {
  const last7 = dailyStats.value.slice(-7)
  const orders7d = last7.reduce((acc, day) => acc + Number(day.orders || 0), 0)
  const revenue7d = last7.reduce((acc, day) => acc + Number(day.revenue || 0), 0)
  const bestDay = [...last7].sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))[0]
  const conversionRate = analytics.value.totalOrders
    ? Math.round((Number(analytics.value.paidOrders || 0) / Number(analytics.value.totalOrders || 1)) * 100)
    : 0
  return {
    orders7d,
    revenue7d,
    conversionRate,
    avgTicket: Number(analytics.value.avgTicket || 0),
    bestDayLabel: bestDay ? `${formatShortDate(bestDay.day)} (${currency(bestDay.revenue)})` : 'Sin datos',
    updatedAt: new Date().toLocaleString(),
  }
})

const pendingOrders = computed(() => orders.value.filter((o) => ['pending', 'preparing', 'in_transit'].includes(o.status)))
const deliveredOrders = computed(() => orders.value.filter((o) => ['completed', 'delivered', 'paid'].includes(o.status)))

const pendingTotalPages = computed(() => Math.max(1, Math.ceil(pendingOrders.value.length / pendingPageSize)))
const deliveredTotalPages = computed(() => Math.max(1, Math.ceil(deliveredOrders.value.length / deliveredPageSize)))
const reviewsTotalPages = computed(() => Math.max(1, Math.ceil(recentReviews.value.length / reviewsPageSize)))

const pendingPageOrders = computed(() => {
  const start = (pendingPage.value - 1) * pendingPageSize
  return pendingOrders.value.slice(start, start + pendingPageSize)
})

const deliveredPageOrders = computed(() => {
  const start = (deliveredPage.value - 1) * deliveredPageSize
  return deliveredOrders.value.slice(start, start + deliveredPageSize)
})

const pagedRecentReviews = computed(() => {
  const start = (reviewsPage.value - 1) * reviewsPageSize
  return recentReviews.value.slice(start, start + reviewsPageSize)
})

const statusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'Preparando',
    in_transit: 'En tránsito',
    delivered: 'Listo / Entregado',
    completed: 'Finalizado',
    paid: 'Pagado',
    cancelled: 'Cancelado',
  }
  return map[status] || status
}

const statusBadge = (status: string) => {
  const map: Record<string, { label: string; classes: string }> = {
    pending: { label: statusLabel('pending'), classes: 'bg-amber-100/70 text-amber-900' },
    preparing: { label: statusLabel('preparing'), classes: 'bg-amber-100/70 text-amber-900' },
    in_transit: { label: statusLabel('in_transit'), classes: 'bg-sky-100/80 text-sky-900' },
    delivered: { label: statusLabel('delivered'), classes: 'bg-emerald-100/70 text-emerald-900' },
    completed: { label: statusLabel('completed'), classes: 'bg-emerald-100/70 text-emerald-900' },
    paid: { label: statusLabel('paid'), classes: 'bg-emerald-100/70 text-emerald-900' },
    cancelled: { label: statusLabel('cancelled'), classes: 'bg-red-100 text-red-700' },
  }
  return map[status] || { label: statusLabel(status), classes: 'bg-white/20 text-white' }
}

const ticketBadge = (status: string) => {
  const map: Record<string, { label: string; classes: string }> = {
    open: { label: 'Abierto', classes: 'bg-amber-500/20 text-amber-100' },
    in_progress: { label: 'En progreso', classes: 'bg-sky-500/20 text-sky-100' },
    resolved: { label: 'Resuelto', classes: 'bg-emerald-500/20 text-emerald-100' },
    closed: { label: 'Cerrado', classes: 'bg-slate-500/20 text-slate-100' },
  }
  return map[status] || { label: status, classes: 'bg-white/10 text-white' }
}

const ticketStats = computed(() => ({
  open: tickets.value.filter((ticket) => ticket.status === 'open').length,
  inProgress: tickets.value.filter((ticket) => ticket.status === 'in_progress').length,
  resolved: tickets.value.filter((ticket) => ticket.status === 'resolved').length,
}))

const reportStats = computed(() => ({
  open: reportTickets.value.filter((ticket) => ticket.status === 'open').length,
  inProgress: reportTickets.value.filter((ticket) => ticket.status === 'in_progress').length,
  done: reportTickets.value.filter((ticket) => ['resolved', 'closed'].includes(ticket.status)).length,
}))

const reportPreview = (value: string) => {
  const text = String(value || '').trim()
  return text.length > 160 ? `${text.slice(0, 160)}...` : text
}

const filteredMarketplaceSubmissions = computed(() => {
  if (!marketplaceStatusFilter.value) return marketplaceSubmissions.value
  return marketplaceSubmissions.value.filter((item) => String(item.marketplace_status || 'preparing') === marketplaceStatusFilter.value)
})

const marketplaceSubmissionsTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredMarketplaceSubmissions.value.length / marketplaceSubmissionsPageSize)),
)

const paginatedMarketplaceSubmissions = computed(() => {
  const start = (marketplaceSubmissionsPage.value - 1) * marketplaceSubmissionsPageSize
  return filteredMarketplaceSubmissions.value.slice(start, start + marketplaceSubmissionsPageSize)
})

const marketplaceStatusBadge = (status?: string) => {
  const normalized = String(status || 'preparing')
  const map: Record<string, { label: string; classes: string }> = {
    preparing: { label: 'Preparando', classes: 'bg-amber-100/70 text-amber-900' },
    shipping: { label: 'Enviándose', classes: 'bg-sky-100/80 text-sky-900' },
    in_transit: { label: 'En tránsito', classes: 'bg-blue-100/80 text-blue-900' },
    completed: { label: 'Finalizado', classes: 'bg-emerald-100/70 text-emerald-900' },
  }
  return map[normalized] || { label: normalized, classes: 'bg-white/20 text-white' }
}

const normalizeReviewStatus = (status?: string) => String(status || 'PENDING').toUpperCase()

const reviewStatusBadge = (status?: string) => {
  const normalized = normalizeReviewStatus(status)
  const map: Record<string, { label: string; classes: string }> = {
    PENDING: { label: 'Pendiente', classes: 'bg-amber-100/80 text-amber-900' },
    APPROVED: { label: 'Aprobada', classes: 'bg-emerald-100/80 text-emerald-900' },
    REJECTED: { label: 'Rechazada', classes: 'bg-rose-100/80 text-rose-900' },
  }
  return map[normalized] || { label: normalized, classes: 'bg-white/20 text-white' }
}

const currency = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(Number(value) || 0)

const formatDate = (value?: string | Date) => {
  if (!value) return '—'
  const date = typeof value === 'string' ? new Date(value) : value
  return date.toLocaleString()
}

const formatShortDate = (value?: string) => {
  if (!value) return '—'
  const date = new Date(value)
  return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })
}

const orderLink = (orderId: number) => {
  const firstStore = storesMine.value[0]
  const slug = selectedStore.value || firstStore?.slug
  return slug ? `/store/${slug}/admin/orders/${orderId}` : '#'
}

const trackingCodeFor = (order: any) => {
  const tracking = String(order?.tracking_code || '').trim()
  if (tracking) return tracking
  const id = Number(order?.id || 0)
  return id > 0 ? `ORD-${id}` : 'Sin codigo'
}

const trackingLink = (order: any) => {
  const code = encodeURIComponent(trackingCodeFor(order))
  return `/seguimiento?code=${code}`
}

const loadData = async () => {
  loading.value = true
  loadError.value = ''
  let success = true
  try {
    storesMine.value = await auth.fetchMyStores()
    if (!selectedStore.value) {
      selectedStore.value = (storesMine.value && storesMine.value.length > 0) ? storesMine.value[0]!.slug : MARKETPLACE_SCOPE
    } else if (!isMarketplaceSelected.value && !(storesMine.value && storesMine.value.find((s) => s.slug === selectedStore.value))) {
      selectedStore.value = (storesMine.value && storesMine.value.length > 0) ? storesMine.value[0]!.slug : MARKETPLACE_SCOPE
    }
    if (isMarketplaceSelected.value) {
      await Promise.all([loadMarketplaceSubmissions(), loadMarketplaceSellerProfile(), loadRecentReviews()])
    } else {
      await Promise.all([loadOrders(), loadSummary(), loadDailyStats(), loadRecentReviews(), loadTickets(), loadReportTickets(), loadMarketplaceSubmissions(), loadMarketplaceSellerProfile()])
    }
  } catch (error) {
    console.error('No se pudo cargar el dashboard', error)
    loadError.value = 'No se pudo cargar el dashboard. Intenta actualizar.'
    success = false
  } finally {
    loading.value = false
  }
  return success
}

const loadMarketplaceSubmissions = async () => {
  if (!auth.token) {
    marketplaceSubmissions.value = []
    return
  }
  loadingMarketplaceSubmissions.value = true
  try {
    marketplaceSubmissions.value = await authedFetch<any[]>(`${apiBase}/marketplace/submissions/`)
    marketplaceSubmissionsPage.value = 1
  } catch (error) {
    console.warn('No se pudieron cargar productos marketplace', error)
    marketplaceSubmissions.value = []
  } finally {
    loadingMarketplaceSubmissions.value = false
  }
}

const loadMarketplaceSellerProfile = async () => {
  const userId = (auth.user as any)?.id
  if (!userId) {
    marketplaceSellerProfile.value = null
    return
  }
  loadingMarketplaceSellerProfile.value = true
  try {
    marketplaceSellerProfile.value = await $fetch<any>(`${apiBase}/marketplace/sellers/${userId}/`)
  } catch (error) {
    console.warn('No se pudo cargar perfil marketplace para dashboard', error)
    marketplaceSellerProfile.value = null
  } finally {
    loadingMarketplaceSellerProfile.value = false
  }
}

const updateMarketplaceStatus = async (productId: number, status: string) => {
  if (!productId || !status) return
  try {
    const updated = await authedFetch<any>(`${apiBase}/marketplace/submissions/${productId}/`, {
      method: 'PATCH',
      body: { marketplace_status: status },
    })
    marketplaceSubmissions.value = marketplaceSubmissions.value.map((item) =>
      item.id === productId ? { ...item, marketplace_status: updated.marketplace_status || status } : item,
    )
    showToast('Estado de producto marketplace actualizado', 'success')
  } catch (error) {
    console.error('No se pudo actualizar estado de producto marketplace', error)
    showToast('No se pudo actualizar estado de producto marketplace', 'error')
  }
}

const confirmDeleteStore = async (store: any) => {
  if (deletingStore.value) return
  const ok = window.confirm(`¿Eliminar la tienda “${store.name}”? Esto la desactivará y ya no estará visible.`)
  if (!ok) return
  deletingStore.value = true
  try {
    await authedFetch(`${apiBase}/stores/${store.slug}/`, {
      method: 'DELETE',
    })
    await loadData()
    showToast('Tienda eliminada', 'success')
  } catch (error: any) {
    console.error('No se pudo eliminar', error)
    showToast('No se pudo eliminar la tienda (revisa permisos)', 'error')
  } finally {
    deletingStore.value = false
  }
}

const rebuildTopProductsFromOrders = (ordersList: any[]) => {
  const aggregated: Record<string, any> = {}
  ordersList.forEach((order) => {
    const storeSlug = order.store_slug || order.store?.slug || 'tienda'
    ;(order.items || []).forEach((item: any) => {
      const key = `${storeSlug}-${item.product}`
      const qty = Number(item.quantity) || 0
      const revenue = (Number(item.price) || 0) * qty
      if (!aggregated[key]) {
        aggregated[key] = {
          id: item.product,
          name: item.product_name || `Producto ${item.product}`,
          store_slug: storeSlug,
          total_quantity: 0,
          revenue: 0,
        }
      }
      aggregated[key].total_quantity += qty
      aggregated[key].revenue = Number((aggregated[key].revenue || 0) + revenue)
    })
  })
  topProducts.value = Object.values(aggregated).sort((a: any, b: any) => (b.total_quantity || 0) - (a.total_quantity || 0)).slice(0, 10)
}

const loadTopProducts = async () => {
  topLoading.value = true
  try {
    rebuildTopProductsFromOrders(orders.value)
  } finally {
    topLoading.value = false
  }
}

const loadOrders = async () => {
  ordersLoading.value = true
  topLoading.value = true
  orders.value = []
  if (!auth.token || !storesMine.value.length || !hasPhysicalStoreSelected.value) {
    ordersLoading.value = false
    return
  }
  const targetSlugs = [selectedStore.value]
  try {
    const collected: any[] = []
    for (const slug of targetSlugs) {
      const list = await authedFetch<any[]>(`${apiBase}/orders/`, { params: { store: slug } }).catch(() => [])
      const detailedIds = list.slice(0, 12).map((o) => o.id)
      const details = await Promise.all(
        detailedIds.map((id) => authedFetch<any>(`${apiBase}/orders/${id}/`).catch(() => null))
      )
      const detailMap = new Map<number, any>()
      details.forEach((d) => {
        if (d?.id) detailMap.set(d.id, d)
      })
      list.forEach((o) => {
        const enriched = detailMap.get(o.id)
        collected.push({ ...o, ...(enriched || {}), store_slug: slug })
      })
    }

    orders.value = collected.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    pendingPage.value = 1
    deliveredPage.value = 1
    rebuildTopProductsFromOrders(orders.value)
    topLoading.value = false
  } catch (error) {
    console.warn('No se pudieron cargar pedidos')
  } finally {
    ordersLoading.value = false
  }
}

const updateOrderStatus = async (orderId: number, status: string) => {
  if (!status || !orderId) return
  try {
    const updated = await authedFetch<any>(`${apiBase}/orders/${orderId}/`, {
      method: 'PATCH',
      body: { status },
    })
    orders.value = orders.value.map((o) => (o.id === orderId ? { ...o, status: updated.status || status } : o))
    rebuildTopProductsFromOrders(orders.value)
    showToast('Estado actualizado', 'success')
  } catch (error) {
    console.error('No se pudo actualizar estado', error)
    showToast('No se pudo actualizar estado', 'error')
  }
}

const loadTickets = async () => {
  loadingTickets.value = true
  tickets.value = []
  if (!auth.token || !hasPhysicalStoreSelected.value) {
    loadingTickets.value = false
    return
  }
  const params: Record<string, any> = { status: 'open', store: selectedStore.value, kind: 'support' }
  try {
    tickets.value = await authedFetch<TicketItem[]>(`${apiBase}/support/tickets/`, { params })
  } catch (error) {
    console.warn('No se pudieron cargar tickets', error)
    tickets.value = []
  } finally {
    loadingTickets.value = false
  }
}

const loadReportTickets = async () => {
  reportTickets.value = []
  if (!auth.token || !hasPhysicalStoreSelected.value) return
  const params: Record<string, any> = { kind: 'report', store: selectedStore.value }
  try {
    reportTickets.value = await authedFetch<TicketItem[]>(`${apiBase}/support/tickets/`, { params })
  } catch (error) {
    console.warn('No se pudieron cargar denuncias', error)
    reportTickets.value = []
  }
}

const goToSupport = async (ticket?: TicketItem) => {
  const query = new URLSearchParams()
  if (hasPhysicalStoreSelected.value) query.set('store', selectedStore.value)
  if (ticket?.status) query.set('status', ticket.status)
  const suffix = query.toString()
  await navigateTo(suffix ? `/dashboard/tickets?${suffix}` : '/dashboard/tickets')
}

const loadRecentReviews = async (notify = false) => {
  if (!auth.token) {
    recentReviews.value = []
    return false
  }
  loadingReviews.value = true
  let success = false
  try {
    if (isMarketplaceSelected.value) {
      const feed = await authedFetch<any>(`${apiBase}/support/notifications/feed/`).catch(() => ({ results: [] }))
      const rows = Array.isArray(feed?.results) ? feed.results : []
      recentReviews.value = rows
        .filter((item: any) => item?.type === 'review_new')
        .map((item: any, idx: number) => ({
          id: item.id || `review-marketplace-${idx}`,
          rating: Number(item?.meta?.rating || 0),
          comment: String(item?.message || 'Comentario marketplace'),
          customer_name: 'Cliente',
          created_at: String(item?.created_at || new Date().toISOString()),
          store_slug: String(item?.store || 'marketplace'),
          product: item?.meta?.product,
          status: item?.meta?.status,
        }))
      success = true
    } else {
      const targetSlugs = [selectedStore.value]
      const aggregated: ReviewFeedItem[] = []
      for (const slug of targetSlugs) {
        const rows = await authedFetch<ReviewFeedItem[]>(`${apiBase}/store/${slug}/admin/resenas/reviews/`, { params: {} }).catch(() => [])
        rows.forEach((r: any) => aggregated.push({ ...r, store_slug: slug } as any))
      }
      aggregated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      recentReviews.value = aggregated.slice(0, 12)
      success = true
    }
  } catch (error) {
    console.warn('No se pudieron cargar reseñas', error)
    recentReviews.value = []
  } finally {
    loadingReviews.value = false
    if (notify) {
      showToast(success ? 'Reseñas actualizadas' : 'No se pudieron cargar reseñas', success ? 'success' : 'error')
    }
  }
  return success
}

const openTicket = (t: any) => {
  selectedTicket.value = { ...t }
  editStatus.value = t.status
  editPriority.value = t.priority
  newComment.value = ''
  showTicketModal.value = true
}

const openReportDetail = (ticket: TicketItem) => {
  selectedReport.value = ticket
  showReportModal.value = true
}

const closeReport = () => {
  selectedReport.value = null
  showReportModal.value = false
}

const closeTicket = () => {
  showTicketModal.value = false
  selectedTicket.value = null
}

const saveTicket = async () => {
  if (!selectedTicket.value) return
  savingTicket.value = true
  try {
    const body: Record<string, any> = {
      status: editStatus.value,
      priority: editPriority.value,
    }
    if (newComment.value.trim()) {
      body.description = `${selectedTicket.value.description}\n\n[Admin] ${newComment.value.trim()}`
    }
    const updated = await authedFetch<TicketItem>(`${apiBase}/support/tickets/${selectedTicket.value.id}/`, {
      method: 'PATCH',
      body,
    })
    // refresh list locally
    tickets.value = tickets.value.map((t) => (t.id === updated.id ? updated : t))
    selectedTicket.value = updated
    newComment.value = ''
    showTicketModal.value = false
    showToast('Ticket actualizado', 'success')
  } catch (error) {
    console.error('No se pudo guardar el ticket', error)
    showToast('No se pudo guardar el ticket', 'error')
  } finally {
    savingTicket.value = false
  }
}

const loadSummary = async () => {
  if (!auth.token) return false
  if (!hasPhysicalStoreSelected.value) return false
  const params: Record<string, any> = {}
  statsLoading.value = true
  let success = false
  try {
    const targetSlugs = [selectedStore.value]
    let totalOrders = 0
    let paidOrders = 0
    let revenue = 0
    let avgTicketSum = 0
    let avgCount = 0

    for (const slug of targetSlugs) {
      const summary = await authedFetch<any>(`${apiBase}/store/${slug}/admin/reportes/orders/summary/`, { params: {} }).catch(() => null)
      if (summary) {
        totalOrders += Number(summary.total_orders || 0)
        paidOrders += Number(summary.paid_orders || 0)
        revenue += Number(summary.total_revenue || 0)
        if (summary.avg_ticket) {
          avgTicketSum += Number(summary.avg_ticket)
          avgCount += 1
        }
      }
    }

    analytics.value = {
      totalOrders,
      paidOrders,
      revenue,
      avgTicket: avgCount ? avgTicketSum / avgCount : 0,
    }
    success = true
  } catch (error) {
    console.warn('No se pudo cargar el resumen', error)
  } finally {
    statsLoading.value = false
  }
  return success
}

const loadDailyStats = async () => {
  if (!auth.token) return false
  if (!hasPhysicalStoreSelected.value) return false
  dailyLoading.value = true
  const aggregated: Record<string, { orders: number; revenue: number }> = {}
  try {
    const targetSlugs = [selectedStore.value]
    for (const slug of targetSlugs) {
      const rows = await authedFetch<any[]>(`${apiBase}/store/${slug}/admin/reportes/orders/daily/`, { params: {} }).catch(() => [])
      rows.forEach((row: any) => {
        const day = row.day
        if (!aggregated[day]) aggregated[day] = { orders: 0, revenue: 0 }
        aggregated[day].orders += Number(row.orders_count || 0)
        aggregated[day].revenue += Number(row.revenue || 0)
      })
    }
    dailyStats.value = Object.entries(aggregated)
      .map(([day, vals]) => ({ day, orders: vals.orders, revenue: vals.revenue }))
      .sort((a, b) => (a.day > b.day ? 1 : -1))
  } catch (error) {
    console.warn('No se pudieron cargar métricas diarias', error)
  } finally {
    dailyLoading.value = false
  }
  return Boolean(dailyStats.value.length)
}

const refresh = async (notify = false) => {
  const ok = await loadData()
  if (notify) {
    showToast(ok ? 'Datos actualizados' : 'No se pudo actualizar', ok ? 'success' : 'error')
  }
}

const exportCsv = (filename: string, rows: Record<string, any>[], headers: { key: string; label: string }[]) => {
  if (!rows.length) return
  const csvRows = []
  csvRows.push(headers.map((h) => '"' + (h.label || '').replace(/"/g, '""') + '"').join(','))
  rows.forEach((row) => {
    csvRows.push(
      headers
        .map((h) => {
          const val = row[h.key] ?? ''
          return '"' + String(val).replace(/"/g, '""') + '"'
        })
        .join(',')
    )
  })
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

const exportTopProducts = () => {
  exportCsv('top-products', topProducts.value, [
    { key: 'name', label: 'Producto' },
    { key: 'store_slug', label: 'Tienda' },
    { key: 'total_quantity', label: 'Ventas' },
    { key: 'revenue', label: 'Ingresos' },
  ])
}

onMounted(async () => {
  const ready = await ensureAuthReady()
  if (!ready) {
    await navigateTo('/login')
    return
  }
  await loadData()
  theme.applyTheme()
  if (process.client) {
    window.addEventListener(REVIEW_EVENT, handleReviewEvent as EventListener)
  }
})

const handleReviewEvent = () => {
  if (!auth.isAuthenticated) return
  loadRecentReviews()
}

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener(REVIEW_EVENT, handleReviewEvent as EventListener)
  }
  if (toastTimer) clearTimeout(toastTimer)
})

watch(selectedStore, async () => {
  if (!selectedStore.value) return
  pendingPage.value = 1
  deliveredPage.value = 1
  reviewsPage.value = 1
  if (isMarketplaceSelected.value) {
    await Promise.all([loadMarketplaceSubmissions(), loadMarketplaceSellerProfile(), loadRecentReviews()])
  } else {
    await Promise.all([loadOrders(), loadSummary(), loadDailyStats(), loadRecentReviews(), loadTickets(), loadReportTickets(), loadMarketplaceSubmissions(), loadMarketplaceSellerProfile()])
  }
})

watch(marketplaceStatusFilter, () => {
  marketplaceSubmissionsPage.value = 1
})

watch(filteredMarketplaceSubmissions, () => {
  if (marketplaceSubmissionsPage.value > marketplaceSubmissionsTotalPages.value) {
    marketplaceSubmissionsPage.value = marketplaceSubmissionsTotalPages.value
  }
})

watch(recentReviews, () => {
  if (reviewsPage.value > reviewsTotalPages.value) reviewsPage.value = reviewsTotalPages.value
})
</script>
