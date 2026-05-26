<template>
  <div class="min-h-screen bg-slate-950 text-white">
    <div class="mx-auto max-w-7xl space-y-8 px-6 py-10">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Panel de administracion</p>
          <h1 class="text-3xl font-extrabold">Supervision de tiendas y marketplace</h1>
          <p class="text-sm text-white/70">Control operacional de tiendas, perfiles marketplace y denuncias.</p>
        </div>
        <button
          class="rounded-xl px-4 py-2 text-sm font-semibold text-white"
          :style="{ backgroundColor: theme.accent }"
          :disabled="loading"
          @click="loadOverview()"
        >
          {{ loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </header>

      <div v-if="error" class="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
        {{ error }}
      </div>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Tiendas</p>
          <p class="mt-2 text-2xl font-bold">{{ summary.stores_total }}</p>
        </article>
        <article class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Activas</p>
          <p class="mt-2 text-2xl font-bold text-emerald-200">{{ summary.stores_active }}</p>
        </article>
        <article class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Inactivas</p>
          <p class="mt-2 text-2xl font-bold text-amber-200">{{ summary.stores_inactive }}</p>
        </article>
        <article class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-white/60">Denuncias abiertas</p>
          <p class="mt-2 text-2xl font-bold text-rose-200">{{ summary.reports_open }}</p>
        </article>
      </section>

      <section class="grid gap-4 lg:grid-cols-2">
        <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 class="text-lg font-semibold">Top tiendas</h2>
          <p class="text-xs text-white/60">Ordenadas por ingresos y pedidos finalizados.</p>
          <div class="mt-4 space-y-2">
            <div
              v-for="store in topStores"
              :key="`top-${store.slug}`"
              class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <button class="text-left font-semibold hover:underline" @click="openStoreModal(store)">{{ store.name }}</button>
              <p class="text-xs text-white/70">Ingresos: {{ formatMoney(store.revenue_total) }} · Finalizados: {{ store.completed_orders }}</p>
            </div>
            <p v-if="!topStores.length" class="text-sm text-white/70">Sin datos todavia.</p>
          </div>
        </article>

        <article class="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 class="text-lg font-semibold">Tiendas denunciadas</h2>
          <p class="text-xs text-white/60">Con al menos una denuncia registrada en soporte.</p>
          <div class="mt-4 space-y-2">
            <div
              v-for="store in reportedStores"
              :key="`reported-${store.slug}`"
              class="rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <button class="text-left font-semibold hover:underline" @click="openStoreModal(store)">{{ store.name }}</button>
              <p class="text-xs text-white/70">Denuncias: {{ store.reports_total }} · Abiertas: {{ store.reports_open }}</p>
            </div>
            <p v-if="!reportedStores.length" class="text-sm text-white/70">Sin denuncias por ahora.</p>
          </div>
        </article>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 class="text-lg font-semibold">Catastro completo de tiendas</h2>
        <p class="text-xs text-white/60">Click en encabezados para ordenar, click en celdas para abrir detalle.</p>

        <div class="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <label class="space-y-1">
            <span class="text-xs text-white/60">Buscar por nombre, slug o creador</span>
            <input
              v-model.trim="searchDraft"
              type="text"
              placeholder="Ej: lider, marketplace, marko2blea"
              class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40"
              @keyup.enter="applyStoreSearch"
            />
          </label>
          <div class="flex items-center gap-2">
            <button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10" @click="applyStoreSearch">Buscar</button>
            <button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10" @click="clearStoreSearch">Limpiar</button>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <button
            v-for="option in stateOptions"
            :key="option.value"
            class="rounded-full px-3 py-1.5 text-xs font-semibold transition"
            :class="pagination.state === option.value ? 'bg-white text-slate-950' : 'border border-white/15 bg-white/5 text-white/80 hover:border-white/30'"
            @click="changeStateFilter(option.value)"
          >
            {{ option.label }}
          </button>
          <span class="ml-auto text-xs text-white/60">
            {{ pagination.total }} tiendas · pagina {{ pagination.page }} de {{ pagination.total_pages }}
          </span>
        </div>

        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-white/10 text-left text-white/60">
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('name')">
                    Tienda
                    <span>{{ sortIndicator('name') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('created_by_username')">
                    Creador
                    <span>{{ sortIndicator('created_by_username') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('created_at')">
                    Creacion
                    <span>{{ sortIndicator('created_at') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('store_type')">
                    Tipo
                    <span>{{ sortIndicator('store_type') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('contact')">
                    Contacto
                    <span>{{ sortIndicator('contact') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('revenue_total')">
                    Rendimiento
                    <span>{{ sortIndicator('revenue_total') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('reports_total')">
                    Denuncias
                    <span>{{ sortIndicator('reports_total') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">
                  <button class="inline-flex items-center gap-1 hover:text-white" @click="toggleSort('is_active')">
                    Estado
                    <span>{{ sortIndicator('is_active') }}</span>
                  </button>
                </th>
                <th class="px-3 py-2">Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!stores.length">
                <td colspan="9" class="px-3 py-6 text-center text-sm text-white/60">No hay tiendas para este filtro.</td>
              </tr>
              <tr v-for="store in stores" :key="store.slug" class="border-b border-white/5">
                <td class="px-3 py-3">
                  <button class="text-left" @click="openStoreModal(store)">
                    <p class="font-semibold hover:underline">{{ store.name }}</p>
                    <p class="text-xs text-white/60">/{{ store.slug }}</p>
                  </button>
                </td>
                <td class="px-3 py-3 text-xs">
                  <button class="hover:underline" @click="openCreatorModal(store.creator)">
                    {{ store.created_by_username || 'Sin registro' }}
                  </button>
                </td>
                <td class="px-3 py-3 text-xs">
                  <button class="hover:underline" @click="openStoreModal(store)">{{ formatDate(store.created_at) }}</button>
                </td>
                <td class="px-3 py-3 text-xs">
                  <button class="hover:underline" @click="openStoreModal(store)">{{ store.store_type }}</button>
                </td>
                <td class="px-3 py-3 text-xs">
                  <button class="text-left hover:underline" @click="openStoreModal(store)">
                    <p>{{ store.contact_email || 'Sin email' }}</p>
                    <p>{{ store.phone || store.whatsapp || 'Sin telefono' }}</p>
                  </button>
                </td>
                <td class="px-3 py-3 text-xs">
                  <button class="text-left hover:underline" @click="openStoreModal(store)">
                    <p>{{ formatMoney(store.revenue_total) }}</p>
                    <p>Pedidos: {{ store.orders_total }}</p>
                  </button>
                </td>
                <td class="px-3 py-3 text-xs">
                  <button class="hover:underline" @click="openFirstReportForStore(store)">
                    {{ store.reports_total }} ({{ store.reports_open }} abiertas)
                  </button>
                </td>
                <td class="px-3 py-3">
                  <span class="rounded-full px-2 py-0.5 text-xs" :class="store.is_active ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'">
                    {{ store.is_active ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td class="px-3 py-3">
                  <button
                    class="rounded-lg border border-white/20 px-2 py-1 text-xs hover:border-white/50 disabled:opacity-50"
                    :disabled="Boolean(stateLoading[store.slug])"
                    @click="toggleStoreState(store)"
                  >
                    {{ stateLoading[store.slug] ? 'Guardando...' : store.is_active ? 'Desactivar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
          <p>Mostrando {{ stores.length }} de {{ pagination.total }} tiendas filtradas.</p>
          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"
              :disabled="pagination.page <= 1 || loading"
              @click="changePage(pagination.page - 1)"
            >
              Anterior
            </button>
            <span>Pagina {{ pagination.page }} / {{ pagination.total_pages }}</span>
            <button
              class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"
              :disabled="pagination.page >= pagination.total_pages || loading"
              @click="changePage(pagination.page + 1)"
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 class="text-lg font-semibold">Perfiles de Marketplace</h2>
        <p class="text-xs text-white/60">Puedes revisar perfiles de vendedor y activar/desactivar su acceso.</p>

        <div class="mt-4 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-white/10 text-left text-white/60">
                <th class="px-3 py-2">Perfil</th>
                <th class="px-3 py-2">Email</th>
                <th class="px-3 py-2">Productos</th>
                <th class="px-3 py-2">Denuncias</th>
                <th class="px-3 py-2">Estado</th>
                <th class="px-3 py-2">Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!marketplaceSellers.length">
                <td colspan="6" class="px-3 py-6 text-center text-sm text-white/60">Sin perfiles marketplace registrados.</td>
              </tr>
              <tr v-for="seller in marketplaceSellers" :key="`seller-${seller.id}`" class="border-b border-white/5">
                <td class="px-3 py-3">
                  <button class="text-left hover:underline" @click="openSellerModal(seller)">
                    <p class="font-semibold">{{ seller.username }}</p>
                    <p class="text-xs text-white/60">{{ seller.first_name }} {{ seller.last_name }}</p>
                  </button>
                </td>
                <td class="px-3 py-3 text-xs">{{ seller.email || 'Sin email' }}</td>
                <td class="px-3 py-3 text-xs">{{ seller.products_active }} / {{ seller.products_total }} activos</td>
                <td class="px-3 py-3 text-xs">{{ seller.reports_total }} ({{ seller.reports_open }} abiertas)</td>
                <td class="px-3 py-3">
                  <span class="rounded-full px-2 py-0.5 text-xs" :class="seller.is_active ? 'bg-emerald-500/20 text-emerald-200' : 'bg-amber-500/20 text-amber-200'">
                    {{ seller.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="px-3 py-3">
                  <button
                    class="rounded-lg border border-white/20 px-2 py-1 text-xs hover:border-white/50 disabled:opacity-50"
                    :disabled="Boolean(sellerStateLoading[seller.id])"
                    @click="toggleMarketplaceSellerState(seller)"
                  >
                    {{ sellerStateLoading[seller.id] ? 'Guardando...' : seller.is_active ? 'Desactivar' : 'Activar' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 class="text-lg font-semibold">Perfiles de Marketplace denunciados</h2>
            <p class="text-xs text-white/60">Perfiles con reportes acumulados y acceso directo al detalle.</p>
          </div>
          <span class="text-xs text-white/60">{{ paginatedReportedMarketplaceSellers.length }} de {{ filteredReportedMarketplaceSellers.length }} perfiles</span>
        </div>

        <div class="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <label class="space-y-1">
            <span class="text-xs text-white/60">Buscar perfil denunciado</span>
            <input
              v-model.trim="reportedMarketplaceSearch"
              type="text"
              placeholder="Usuario, email o tienda"
              class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40"
            />
          </label>
          <div class="flex items-center gap-2">
            <button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10" @click="reportedMarketplacePage = 1">Buscar</button>
            <button class="rounded-xl border border-white/20 px-3 py-2 text-xs font-semibold hover:bg-white/10" @click="clearReportedMarketplaceSearch">Limpiar</button>
          </div>
        </div>

        <div class="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <button
            v-for="seller in paginatedReportedMarketplaceSellers"
            :key="`reported-seller-${seller.id}`"
            class="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-3 text-left transition hover:border-rose-300/40 hover:bg-rose-500/15"
            @click="openSellerModal(seller)"
          >
            <p class="font-semibold text-rose-50">{{ seller.username }}</p>
            <p class="text-xs text-rose-100/80">Denuncias: {{ seller.reports_total }} · Abiertas: {{ seller.reports_open }}</p>
            <p class="text-[11px] text-rose-100/60">{{ seller.email || 'Sin email' }}</p>
          </button>
          <p v-if="!paginatedReportedMarketplaceSellers.length" class="text-sm text-white/70">Sin perfiles marketplace denunciados.</p>
        </div>

        <div v-if="filteredReportedMarketplaceSellers.length > reportedMarketplacePerPage" class="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/70">
          <button
            class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"
            :disabled="reportedMarketplacePage <= 1"
            @click="reportedMarketplacePage -= 1"
          >
            Anterior
          </button>
          <span>Página {{ reportedMarketplacePage }} / {{ reportedMarketplaceTotalPages }}</span>
          <button
            class="rounded-lg border border-white/20 px-3 py-1 hover:border-white/40 disabled:opacity-40"
            :disabled="reportedMarketplacePage >= reportedMarketplaceTotalPages"
            @click="reportedMarketplacePage += 1"
          >
            Siguiente
          </button>
        </div>
      </section>

      <section class="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 class="text-lg font-semibold">Denuncias de soporte</h2>
        <p class="text-xs text-white/60">Filtro en tiempo real para revisar letra por letra y gestionar denuncias.</p>

        <div class="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <label class="space-y-1">
            <span class="text-xs text-white/60">Buscar denuncias por titulo, tienda o denunciante</span>
            <input
              v-model.trim="reportSearch"
              type="text"
              placeholder="Ej: marketplace, lider, usuario"
              class="w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40"
            />
          </label>
          <div class="flex flex-wrap items-center gap-2">
            <button
              v-for="option in reportStatusOptions"
              :key="option.value"
              class="rounded-full px-3 py-1.5 text-xs font-semibold transition"
              :class="reportStatusFilter === option.value ? 'bg-white text-slate-950' : 'border border-white/15 bg-white/5 text-white/80 hover:border-white/30'"
              @click="reportStatusFilter = option.value"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="mt-4 space-y-2">
          <article
            v-for="ticket in filteredReportTickets"
            :key="ticket.id"
            class="cursor-pointer rounded-xl border border-white/10 bg-white/5 px-3 py-3 hover:border-white/25"
            @click="openTicketModal(ticket)"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="font-semibold">{{ ticket.title }}</p>
              <span class="text-xs text-white/60">{{ formatDate(ticket.created_at) }}</span>
            </div>
            <p class="text-xs text-white/70">
              Tienda: {{ ticket.store_slug || 'Sin tienda' }} · Estado: {{ ticket.status }} · Denunciante: {{ ticket.created_by_name || 'Sin registro' }}
            </p>
            <p class="text-xs text-white/60">{{ ticket.description }}</p>

            <div class="mt-3 grid gap-2 md:grid-cols-[180px,1fr,auto]" @click.stop>
              <select
                v-model="ticketDraftStatus[ticket.id]"
                class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white"
              >
                <option value="open">Abierto</option>
                <option value="in_progress">En progreso</option>
                <option value="resolved">Resuelto</option>
                <option value="closed">Cerrado</option>
              </select>
              <input
                v-model.trim="ticketDraftResponse[ticket.id]"
                type="text"
                class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/50"
                placeholder="Respuesta administrativa"
              />
              <button
                class="rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/40 disabled:opacity-50"
                :disabled="Boolean(ticketUpdating[ticket.id])"
                @click="saveTicketUpdate(ticket)"
              >
                {{ ticketUpdating[ticket.id] ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </article>
          <p v-if="!filteredReportTickets.length" class="text-sm text-white/70">No hay denuncias para este filtro.</p>
        </div>
      </section>
    </div>

    <div v-if="showStoreDetail && selectedStore" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div class="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/15 bg-slate-900 p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold">Detalle de tienda: {{ selectedStore.name }}</h3>
          <button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10" @click="showStoreDetail = false">Cerrar</button>
        </div>
        <div class="grid gap-3 text-sm sm:grid-cols-2">
          <p><span class="text-white/60">Slug:</span> {{ selectedStore.slug }}</p>
          <p><span class="text-white/60">Tipo:</span> {{ selectedStore.store_type }}</p>
          <p><span class="text-white/60">Estado:</span> {{ selectedStore.is_active ? 'Activa' : 'Inactiva' }}</p>
          <p><span class="text-white/60">Creacion:</span> {{ formatDate(selectedStore.created_at) }}</p>
          <p><span class="text-white/60">Email:</span> {{ selectedStore.contact_email || 'Sin email' }}</p>
          <p><span class="text-white/60">Telefono:</span> {{ selectedStore.phone || selectedStore.whatsapp || 'Sin telefono' }}</p>
          <p><span class="text-white/60">Direccion:</span> {{ selectedStore.address || 'Sin direccion' }}</p>
          <p><span class="text-white/60">Delivery:</span> {{ selectedStore.delivery_fee_mode || 'Sin modo' }}</p>
          <p><span class="text-white/60">Pedidos:</span> {{ selectedStore.orders_total }}</p>
          <p><span class="text-white/60">Ingresos:</span> {{ formatMoney(selectedStore.revenue_total) }}</p>
          <p><span class="text-white/60">Denuncias:</span> {{ selectedStore.reports_total }} ({{ selectedStore.reports_open }} abiertas)</p>
          <p><span class="text-white/60">Carrito:</span> {{ selectedStore.cart_enabled ? 'Habilitado' : 'Deshabilitado' }}</p>
        </div>
        <div class="mt-4 space-y-2 text-sm">
          <p><span class="text-white/60">Descripcion:</span> {{ selectedStore.description || 'Sin descripcion' }}</p>
          <p><span class="text-white/60">About:</span> {{ selectedStore.about || 'Sin about' }}</p>
          <p><span class="text-white/60">Instagram:</span> {{ selectedStore.social_instagram || 'No definido' }}</p>
          <p><span class="text-white/60">Facebook:</span> {{ selectedStore.social_facebook || 'No definido' }}</p>
          <p><span class="text-white/60">TikTok:</span> {{ selectedStore.social_tiktok || 'No definido' }}</p>
          <p><span class="text-white/60">YouTube:</span> {{ selectedStore.social_youtube || 'No definido' }}</p>
        </div>

        <div class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-white/50">Denuncia</p>
              <p class="text-sm font-semibold">Motivo y datos relacionados</p>
            </div>
            <button class="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10" @click="selectedStoreReportVisible = !selectedStoreReportVisible">
              {{ selectedStoreReportVisible ? 'Ocultar motivo' : 'Ver motivo' }}
            </button>
          </div>
          <div v-if="selectedStoreReports.length" class="mt-3 space-y-2">
            <p class="text-xs text-white/60">{{ selectedStoreReports.length }} denuncias relacionadas.</p>
            <div v-if="selectedStoreReportVisible" class="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm">
              <p class="font-semibold text-rose-50">{{ selectedStoreReports[0].title }}</p>
              <p class="mt-1 text-xs text-rose-100/80">Denunciante: {{ selectedStoreReports[0].created_by_name || 'Sin registro' }} · {{ formatDate(selectedStoreReports[0].created_at) }}</p>
              <p class="mt-2 whitespace-pre-line text-rose-50/90">{{ selectedStoreReports[0].description }}</p>
              <p v-if="selectedStoreReports[0].response_message" class="mt-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80">
                Respuesta administrativa: {{ selectedStoreReports[0].response_message }}
              </p>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-white/60">Esta tienda aún no tiene denuncias asociadas.</p>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <button
            class="rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-500/15"
            :disabled="stateLoading[selectedStore.slug]"
            @click="toggleStoreState(selectedStore)"
          >
            {{ selectedStore.is_active ? 'Inactivar tienda' : 'Activar tienda' }}
          </button>
          <span v-if="selectedStore.reports_open >= 2" class="text-xs text-amber-200">Advertencia acumulada: esta tienda tiene {{ selectedStore.reports_open }} reportes abiertos.</span>
        </div>
      </div>
    </div>

    <div v-if="showCreatorDetail && selectedCreator" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div class="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-900 p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold">Detalle de creador</h3>
          <button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10" @click="showCreatorDetail = false">Cerrar</button>
        </div>
        <div class="space-y-2 text-sm">
          <p><span class="text-white/60">Usuario:</span> {{ selectedCreator.username || 'Sin dato' }}</p>
          <p><span class="text-white/60">Nombre:</span> {{ selectedCreator.first_name || '' }} {{ selectedCreator.last_name || '' }}</p>
          <p><span class="text-white/60">Email:</span> {{ selectedCreator.email || 'Sin email' }}</p>
          <p><span class="text-white/60">Estado:</span> {{ selectedCreator.is_active ? 'Activo' : 'Inactivo' }}</p>
          <p><span class="text-white/60">Registro:</span> {{ formatDate(selectedCreator.date_joined) }}</p>
          <p><span class="text-white/60">Ultimo login:</span> {{ formatDate(selectedCreator.last_login) }}</p>
        </div>
      </div>
    </div>

    <div v-if="showTicketDetail && selectedTicket" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div class="w-full max-w-2xl rounded-2xl border border-white/15 bg-slate-900 p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold">Detalle de denuncia #{{ selectedTicket.id }}</h3>
          <button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10" @click="showTicketDetail = false">Cerrar</button>
        </div>
        <div class="space-y-2 text-sm">
          <p><span class="text-white/60">Titulo:</span> {{ selectedTicket.title }}</p>
          <p><span class="text-white/60">Tienda:</span> {{ selectedTicket.store_slug || 'Sin tienda' }}</p>
          <p><span class="text-white/60">Estado:</span> {{ selectedTicket.status }}</p>
          <p><span class="text-white/60">Denunciante:</span> {{ selectedTicket.created_by_name || 'Sin registro' }}</p>
          <p><span class="text-white/60">Fecha:</span> {{ formatDate(selectedTicket.created_at) }}</p>
          <p><span class="text-white/60">Descripcion:</span> {{ selectedTicket.description }}</p>
        </div>
        <div class="mt-4 grid gap-2 md:grid-cols-[180px,1fr,auto]">
          <select v-model="ticketDraftStatus[selectedTicket.id]" class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white">
            <option value="open">Abierto</option>
            <option value="in_progress">En progreso</option>
            <option value="resolved">Resuelto</option>
            <option value="closed">Cerrado</option>
          </select>
          <input
            v-model.trim="ticketDraftResponse[selectedTicket.id]"
            type="text"
            class="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs text-white placeholder-white/50"
            placeholder="Respuesta administrativa"
          />
          <button
            class="rounded-lg border border-white/20 px-3 py-2 text-xs hover:border-white/40 disabled:opacity-50"
            :disabled="Boolean(ticketUpdating[selectedTicket.id])"
            @click="saveTicketUpdate(selectedTicket)"
          >
            {{ ticketUpdating[selectedTicket.id] ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSellerDetail && selectedSeller" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div class="w-full max-w-xl rounded-2xl border border-white/15 bg-slate-900 p-5">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold">Perfil marketplace: {{ selectedSeller.username }}</h3>
          <button class="rounded-lg border border-white/20 px-3 py-1 text-xs hover:bg-white/10" @click="showSellerDetail = false">Cerrar</button>
        </div>
        <div class="space-y-2 text-sm">
          <p><span class="text-white/60">Nombre:</span> {{ selectedSeller.first_name || '' }} {{ selectedSeller.last_name || '' }}</p>
          <p><span class="text-white/60">Email:</span> {{ selectedSeller.email || 'Sin email' }}</p>
          <p><span class="text-white/60">Store slug:</span> {{ selectedSeller.store_slug || 'Sin tienda marketplace' }}</p>
          <p><span class="text-white/60">Productos:</span> {{ selectedSeller.products_active }} activos de {{ selectedSeller.products_total }}</p>
          <p><span class="text-white/60">Denuncias:</span> {{ selectedSeller.reports_total }} ({{ selectedSeller.reports_open }} abiertas)</p>
          <p><span class="text-white/60">Registro:</span> {{ formatDate(selectedSeller.date_joined) }}</p>
          <p><span class="text-white/60">Ultimo login:</span> {{ formatDate(selectedSeller.last_login) }}</p>
        </div>

        <div class="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p class="text-xs uppercase tracking-[0.18em] text-white/50">Denuncia</p>
              <p class="text-sm font-semibold">Motivo y datos relacionados</p>
            </div>
            <button class="rounded-lg border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10" @click="selectedSellerReportVisible = !selectedSellerReportVisible">
              {{ selectedSellerReportVisible ? 'Ocultar motivo' : 'Ver motivo' }}
            </button>
          </div>
          <div v-if="selectedSellerReports.length" class="mt-3 space-y-2">
            <p class="text-xs text-white/60">{{ selectedSellerReports.length }} denuncias relacionadas.</p>
            <div v-if="selectedSellerReportVisible" class="rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm">
              <p class="font-semibold text-rose-50">{{ selectedSellerReports[0].title }}</p>
              <p class="mt-1 text-xs text-rose-100/80">Denunciante: {{ selectedSellerReports[0].created_by_name || 'Sin registro' }} · {{ formatDate(selectedSellerReports[0].created_at) }}</p>
              <p class="mt-2 whitespace-pre-line text-rose-50/90">{{ selectedSellerReports[0].description }}</p>
              <p v-if="selectedSellerReports[0].response_message" class="mt-2 rounded-lg bg-white/5 px-3 py-2 text-xs text-white/80">
                Respuesta administrativa: {{ selectedSellerReports[0].response_message }}
              </p>
            </div>
          </div>
          <p v-else class="mt-3 text-xs text-white/60">Este perfil aún no tiene denuncias asociadas.</p>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <button
            class="rounded-lg border border-amber-300/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-100 hover:bg-amber-500/15"
            :disabled="sellerStateLoading[selectedSeller.id]"
            @click="toggleMarketplaceSellerState(selectedSeller)"
          >
            {{ selectedSeller.is_active ? 'Inactivar perfil' : 'Activar perfil' }}
          </button>
          <span v-if="selectedSeller.reports_open >= 2" class="text-xs text-amber-200">Advertencia acumulada: este perfil tiene {{ selectedSeller.reports_open }} reportes abiertos.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { navigateTo, useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

definePageMeta({ middleware: ['auth'], requiresAuth: true, ssr: false })

type CreatorDetail = {
  id?: number | null
  username?: string | null
  email?: string | null
  first_name?: string | null
  last_name?: string | null
  is_active?: boolean
  date_joined?: string | null
  last_login?: string | null
}

type StoreRow = {
  id: number
  name: string
  slug: string
  store_type: string
  is_active: boolean
  created_at: string
  created_by_username?: string | null
  contact_email?: string
  phone?: string
  whatsapp?: string
  revenue_total: number
  orders_total: number
  completed_orders: number
  reports_total: number
  reports_open: number
  address?: string
  description?: string
  about?: string
  delivery_fee_mode?: string
  cart_enabled?: boolean
  social_instagram?: string
  social_facebook?: string
  social_tiktok?: string
  social_youtube?: string
  creator?: CreatorDetail
}

type Summary = {
  stores_total: number
  stores_active: number
  stores_inactive: number
  reported_stores: number
  reports_total: number
  reports_open: number
}

type Pagination = {
  page: number
  page_size: number
  total: number
  total_pages: number
  state: 'all' | 'active' | 'inactive'
  search?: string
  ordering?: string
  ordering_dir?: 'asc' | 'desc'
}

type ReportTicket = {
  id: number
  title: string
  description: string
  status: string
  created_at: string
  updated_at?: string
  response_message?: string
  responded_by_name?: string | null
  created_by_name?: string | null
  store_slug?: string | null
}

type MarketplaceSeller = {
  id: number
  username: string
  email?: string
  first_name?: string
  last_name?: string
  is_active: boolean
  date_joined?: string
  last_login?: string
  store_slug?: string | null
  products_total: number
  products_active: number
  reports_total: number
  reports_open: number
  last_report_at?: string | null
}

const auth = useAuthStore()
const theme = useThemeStore()
const config = useRuntimeConfig()

const loading = ref(false)
const error = ref('')
const stores = ref<StoreRow[]>([])
const summary = reactive<Summary>({
  stores_total: 0,
  stores_active: 0,
  stores_inactive: 0,
  reported_stores: 0,
  reports_total: 0,
  reports_open: 0,
})
const pagination = reactive<Pagination>({
  page: 1,
  page_size: 12,
  total: 0,
  total_pages: 1,
  state: 'all',
  search: '',
  ordering: 'created_at',
  ordering_dir: 'desc',
})
const topStores = ref<StoreRow[]>([])
const reportedStores = ref<StoreRow[]>([])

const reportTickets = ref<ReportTicket[]>([])
const reportStatusFilter = ref<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
const reportSearch = ref('')
const ticketDraftStatus = ref<Record<number, string>>({})
const ticketDraftResponse = ref<Record<number, string>>({})
const ticketUpdating = ref<Record<number, boolean>>({})

const stateLoading = ref<Record<string, boolean>>({})
const sellerStateLoading = ref<Record<number, boolean>>({})
const marketplaceSellers = ref<MarketplaceSeller[]>([])
const reportedMarketplaceSearch = ref('')
const reportedMarketplacePage = ref(1)
const reportedMarketplacePerPage = 6

const searchDraft = ref('')

const showStoreDetail = ref(false)
const selectedStore = ref<StoreRow | null>(null)

const showCreatorDetail = ref(false)
const selectedCreator = ref<CreatorDetail | null>(null)

const showTicketDetail = ref(false)
const selectedTicket = ref<ReportTicket | null>(null)

const showSellerDetail = ref(false)
const selectedSeller = ref<MarketplaceSeller | null>(null)
const selectedStoreReportVisible = ref(false)
const selectedSellerReportVisible = ref(false)

const stateOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inactivas' },
] as const

const reportStatusOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'open', label: 'Abiertas' },
  { value: 'in_progress', label: 'En progreso' },
  { value: 'resolved', label: 'Resueltas' },
  { value: 'closed', label: 'Cerradas' },
] as const

const isPlatformAdmin = computed(() => auth.user?.username === 'marko2blea')
const authHeaders = computed(() => (auth.token ? { Authorization: `Bearer ${auth.token}` } : {}))

const filteredReportTickets = computed(() => {
  const statusFiltered = reportStatusFilter.value === 'all'
    ? reportTickets.value
    : reportTickets.value.filter((ticket) => ticket.status === reportStatusFilter.value)

  const term = reportSearch.value.trim().toLowerCase()
  if (!term) return statusFiltered

  return statusFiltered.filter((ticket) =>
    String(ticket.title || '').toLowerCase().includes(term)
    || String(ticket.description || '').toLowerCase().includes(term)
    || String(ticket.store_slug || '').toLowerCase().includes(term)
    || String(ticket.created_by_name || '').toLowerCase().includes(term)
  )
})

const formatDate = (value?: string | null) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleString('es-CL')
}

const formatMoney = (value?: number) => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(amount)
}

const sortIndicator = (field: string) => {
  if (pagination.ordering !== field) return '⇅'
  return pagination.ordering_dir === 'asc' ? '↑' : '↓'
}

const toggleSort = async (field: string) => {
  const nextDir = pagination.ordering === field && pagination.ordering_dir === 'asc' ? 'desc' : 'asc'
  await loadOverview({ page: 1, ordering: field, orderingDir: nextDir })
}

const applyStoreSearch = async () => {
  await loadOverview({ page: 1, search: searchDraft.value.trim() })
}

const clearStoreSearch = async () => {
  searchDraft.value = ''
  await loadOverview({ page: 1, search: '' })
}

const loadMarketplaceSellers = async () => {
  try {
    const response = await $fetch<{ results: MarketplaceSeller[] }>(`${config.public.apiBase}/marketplace/platform/sellers/`, {
      headers: authHeaders.value,
    })
    marketplaceSellers.value = response?.results || []
  } catch (err: any) {
    error.value = err?.response?._data?.detail || 'No pudimos cargar perfiles marketplace.'
  }
}

const loadOverview = async (options?: {
  page?: number
  state?: Pagination['state']
  search?: string
  ordering?: string
  orderingDir?: 'asc' | 'desc'
}) => {
  loading.value = true
  error.value = ''
  try {
    if (typeof options?.page === 'number') pagination.page = options.page
    if (options?.state) {
      pagination.state = options.state
      pagination.page = 1
    }
    if (typeof options?.search === 'string') {
      pagination.search = options.search
      pagination.page = 1
    }
    if (options?.ordering) {
      pagination.ordering = options.ordering
      pagination.ordering_dir = options.orderingDir || 'asc'
      pagination.page = 1
    }

    const data = await $fetch<any>(`${config.public.apiBase}/stores/platform/overview/`, {
      headers: authHeaders.value,
      params: {
        page: pagination.page,
        page_size: pagination.page_size,
        state: pagination.state,
        search: pagination.search,
        ordering: pagination.ordering,
        ordering_dir: pagination.ordering_dir,
      },
    })

    stores.value = data?.stores || []
    topStores.value = data?.top_stores || []
    reportedStores.value = data?.reported_stores || []
    Object.assign(summary, data?.summary || {})
    Object.assign(pagination, data?.pagination || {})
    searchDraft.value = pagination.search || ''

    reportTickets.value = await $fetch<ReportTicket[]>(`${config.public.apiBase}/support/tickets/`, {
      headers: authHeaders.value,
      params: { kind: 'report' },
    })
    ticketDraftStatus.value = Object.fromEntries(reportTickets.value.map((ticket) => [ticket.id, ticket.status || 'open']))
    ticketDraftResponse.value = Object.fromEntries(reportTickets.value.map((ticket) => [ticket.id, ticket.response_message || '']))

    await loadMarketplaceSellers()
  } catch (err: any) {
    error.value = err?.response?._data?.detail || 'No pudimos cargar el panel de administracion.'
  } finally {
    loading.value = false
  }
}

const saveTicketUpdate = async (ticket: ReportTicket) => {
  ticketUpdating.value = { ...ticketUpdating.value, [ticket.id]: true }
  error.value = ''
  try {
    const payload = await $fetch<ReportTicket>(`${config.public.apiBase}/support/tickets/${ticket.id}/`, {
      method: 'PATCH',
      headers: authHeaders.value,
      body: {
        status: ticketDraftStatus.value[ticket.id] || ticket.status,
        response_message: ticketDraftResponse.value[ticket.id] || '',
      },
    })
    const index = reportTickets.value.findIndex((row) => row.id === ticket.id)
    if (index >= 0) reportTickets.value[index] = { ...reportTickets.value[index], ...payload }
    if (selectedTicket.value?.id === ticket.id) selectedTicket.value = { ...selectedTicket.value, ...payload }
  } catch (err: any) {
    error.value = err?.response?._data?.detail || 'No pudimos actualizar la denuncia.'
  } finally {
    ticketUpdating.value = { ...ticketUpdating.value, [ticket.id]: false }
  }
}

const changePage = async (page: number) => {
  if (page < 1 || page > pagination.total_pages || page === pagination.page) return
  await loadOverview({ page })
}

const changeStateFilter = async (state: Pagination['state']) => {
  await loadOverview({ state, page: 1 })
}

const askModerationReason = (entityLabel: string, nextState: boolean) => {
  const action = nextState ? 'activar' : 'desactivar'
  const answer = window.prompt(`Motivo obligatorio para ${action} ${entityLabel}:`) || ''
  const reason = answer.trim()
  if (reason.length < 10) {
    error.value = 'Debes ingresar un motivo de al menos 10 caracteres.'
    return null
  }
  return reason
}

const toggleStoreState = async (store: StoreRow) => {
  const nextState = !store.is_active
  const reason = askModerationReason(`la tienda ${store.slug}`, nextState)
  if (!reason) return
  stateLoading.value = { ...stateLoading.value, [store.slug]: true }
  try {
    await $fetch(`${config.public.apiBase}/stores/platform/${store.slug}/state/`, {
      method: 'PATCH',
      headers: authHeaders.value,
      body: { is_active: nextState, reason },
    })
    store.is_active = nextState
    await loadOverview()
  } catch (err: any) {
    error.value = err?.response?._data?.detail || 'No pudimos actualizar el estado de la tienda.'
  } finally {
    stateLoading.value = { ...stateLoading.value, [store.slug]: false }
  }
}

const toggleMarketplaceSellerState = async (seller: MarketplaceSeller) => {
  const nextState = !seller.is_active
  const reason = askModerationReason(`el perfil ${seller.username}`, nextState)
  if (!reason) return
  sellerStateLoading.value = { ...sellerStateLoading.value, [seller.id]: true }
  try {
    await $fetch(`${config.public.apiBase}/marketplace/platform/sellers/${seller.id}/state/`, {
      method: 'PATCH',
      headers: authHeaders.value,
      body: { is_active: nextState, reason },
    })
    seller.is_active = nextState
  } catch (err: any) {
    error.value = err?.response?._data?.detail || 'No pudimos actualizar el estado del perfil marketplace.'
  } finally {
    sellerStateLoading.value = { ...sellerStateLoading.value, [seller.id]: false }
  }
}

const openStoreModal = (store: StoreRow) => {
  selectedStore.value = store
  selectedStoreReportVisible.value = false
  showStoreDetail.value = true
}

const openCreatorModal = (creator?: CreatorDetail | null) => {
  if (!creator || !creator.username) {
    error.value = 'Esta tienda no tiene creador registrado.'
    return
  }
  selectedCreator.value = creator
  showCreatorDetail.value = true
}

const openTicketModal = (ticket: ReportTicket) => {
  selectedTicket.value = ticket
  showTicketDetail.value = true
}

const openSellerModal = (seller: MarketplaceSeller) => {
  selectedSeller.value = seller
  selectedSellerReportVisible.value = false
  showSellerDetail.value = true
}

const openFirstReportForStore = (store: StoreRow) => {
  const ticket = reportTickets.value.find((row) => row.store_slug === store.slug)
  if (!ticket) {
    error.value = 'No encontramos denuncias detalladas para esta tienda.'
    return
  }
  openTicketModal(ticket)
}

const selectedStoreReports = computed(() => {
  if (!selectedStore.value) return []
  return reportTickets.value.filter((ticket) => ticket.store_slug === selectedStore.value?.slug)
})

const selectedSellerReports = computed(() => {
  if (!selectedSeller.value) return []
  return reportTickets.value.filter((ticket) => ticket.store_slug === selectedSeller.value?.store_slug)
})

const reportedMarketplaceSellers = computed(() => marketplaceSellers.value.filter((seller) => seller.reports_total > 0))
const filteredReportedMarketplaceSellers = computed(() => {
  const term = reportedMarketplaceSearch.value.trim().toLowerCase()
  const base = [...reportedMarketplaceSellers.value].sort((a, b) => {
    const diff = Number(b.reports_total || 0) - Number(a.reports_total || 0)
    if (diff !== 0) return diff
    return String(a.username || '').localeCompare(String(b.username || ''))
  })
  if (!term) return base
  return base.filter((seller) =>
    String(seller.username || '').toLowerCase().includes(term)
    || String(seller.email || '').toLowerCase().includes(term)
    || String(seller.store_slug || '').toLowerCase().includes(term)
  )
})
const reportedMarketplaceTotalPages = computed(() => Math.max(1, Math.ceil(filteredReportedMarketplaceSellers.value.length / reportedMarketplacePerPage)))
const paginatedReportedMarketplaceSellers = computed(() => {
  const start = (reportedMarketplacePage.value - 1) * reportedMarketplacePerPage
  return filteredReportedMarketplaceSellers.value.slice(start, start + reportedMarketplacePerPage)
})

const clearReportedMarketplaceSearch = () => {
  reportedMarketplaceSearch.value = ''
  reportedMarketplacePage.value = 1
}

onMounted(async () => {
  const user = await auth.initializeSession({ forceProfile: true })
  if (!user) {
    await navigateTo('/login')
    return
  }
  if (!isPlatformAdmin.value) {
    await navigateTo('/dashboard')
    return
  }
  await loadOverview()
})

watch(filteredReportedMarketplaceSellers, () => {
  if (reportedMarketplacePage.value > reportedMarketplaceTotalPages.value) {
    reportedMarketplacePage.value = reportedMarketplaceTotalPages.value
  }
})

watch(reportedMarketplaceSearch, () => {
  reportedMarketplacePage.value = 1
})
</script>
