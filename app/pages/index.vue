<template>
  <div class="relative isolate overflow-hidden">
    <div class="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
      <div class="absolute -left-16 top-10 h-56 w-56 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl" />
      <div class="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl" />
    </div>

    <section
      class="relative z-10 bg-slate-950 text-white reveal"
      :style="heroStyle"
    >
      <div class="max-w-6xl mx-auto px-4 py-10 sm:px-6 sm:py-16 lg:py-24 grid lg:grid-cols-[1.1fr,0.9fr] gap-8 lg:gap-12 items-center">
        <div class="hidden md:block">
          <p class="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em]">
            Pymeweb impulsa tu negocio
          </p>
          <h1 class="hero-title mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.03] tracking-tight">
            Vende mas hoy: crea una tienda que destaque y convierta cada visita en compra
          </h1>
          <p class="mt-5 text-lg text-white/85 max-w-2xl">
            Diseña tu vitrina con estilo propio, publica en minutos y gestiona pedidos en un solo panel para crecer sin fricciones.
          </p>

          <div class="mt-8 grid gap-3 sm:grid-cols-3">
            <button
              v-if="auth.isAuthenticated"
              type="button"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              :style="{ backgroundColor: theme.accent, color: '#fff' }"
              @click="openCreateStoreModal"
            >
                Crear mi tienda
              <Star class="h-4 w-4" aria-hidden="true" />
            </button>
            <NuxtLink
              v-else
              to="/login"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              :style="{ backgroundColor: theme.accent, color: '#fff' }"
            >
              Iniciar sesión
              <ChevronRight class="h-4 w-4" aria-hidden="true" />
            </NuxtLink>
            <a
              href="#tiendas"
              class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:border-white/40 hover:bg-white/5 transition"
            >
              Ver tiendas
              <ChevronRight class="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-8 rounded-3xl bg-white/5 blur-2xl" />
          <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div class="flex items-center justify-between text-sm text-white/80">
              <span>Tutorial Pymeweb</span>
              <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">3 pasos</span>
            </div>

            <div class="mt-4 overflow-hidden rounded-2xl border border-white/20 bg-white/5 md:hidden">
              <img src="/logoPW.png" alt="Pymeweb" class="h-40 w-full object-contain p-4" />
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p class="text-xs uppercase text-white/60">Paso 1</p>
                  <p class="text-base font-semibold">Configura una tienda con identidad de marca</p>
                </div>
                <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Inicio</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p class="text-xs uppercase text-white/60">Paso 2</p>
                  <p class="text-base font-semibold">Publica productos y ofertas irresistibles</p>
                </div>
                <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Catálogo</span>
              </div>
              <div class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p class="text-xs uppercase text-white/60">Paso 3</p>
                  <p class="text-base font-semibold">Controla ventas y pedidos en tiempo real</p>
                </div>
                <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Ventas</span>
              </div>
              <p class="text-xs text-white/60">Un flujo completo para atraer clientes, cerrar ventas y escalar tu pyme.</p>
            </div>

            <div class="mt-5 grid grid-cols-2 gap-2 md:hidden">
              <NuxtLink
                v-if="auth.isAuthenticated"
                to="/dashboard"
                class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-white"
                :style="{ backgroundColor: theme.accent }"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                v-else
                to="/login"
                class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-white"
                :style="{ backgroundColor: theme.accent }"
              >
                Iniciar sesión
              </NuxtLink>
              <NuxtLink
                to="/marketplace"
                class="inline-flex items-center justify-center rounded-xl border border-white/30 px-3 py-2 text-xs font-semibold text-white"
              >
                Ir al marketplace
              </NuxtLink>
              <a
                href="#tiendas"
                class="inline-flex items-center justify-center rounded-xl border border-white/30 px-3 py-2 text-xs font-semibold text-white"
              >
                Ver tiendas
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8 reveal" style="animation-delay: 0.03s;">
      <div class="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-slate-900 via-[#0f274f] to-[#164172] p-5 text-white shadow-xl sm:p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Últimas novedades</p>
            <h3 class="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">Lo nuevo para vender mejor hoy</h3>
          </div>
        </div>

        <div v-if="loadingStoreProducts" class="mt-4 text-white/80">Cargando productos de tiendas...</div>
        <div v-else-if="storeProductsError" class="mt-4 text-rose-200">{{ storeProductsError }}</div>
        <div v-else-if="!featuredStoreProducts.length" class="mt-4 text-white/85">Sin productos recientes publicados.</div>
        <div v-else class="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProductCard
            v-for="product in featuredStoreProducts"
            :key="product.id"
            :product="product"
            :accent="storeAccent(product)"
            :hideStock="true"
          />
        </div>
      </div>
    </section>

    <section id="tiendas" class="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-9 reveal" style="animation-delay: 0.05s;">
      <div class="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#081225] via-[#11284f] to-[#1d4ed8] p-5 text-white shadow-2xl sm:p-6">
        <div class="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
          <div class="absolute -left-10 top-0 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />
          <div class="absolute right-10 top-6 h-48 w-48 rounded-full bg-amber-400/20 blur-3xl" />
          <div class="absolute -bottom-8 left-1/3 h-36 w-36 rounded-full bg-fuchsia-400/10 blur-3xl" />
        </div>
        <div class="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Todas las tiendas</p>
            <h3 class="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">Descubre tiendas activas en Pymeweb</h3>
            <p class="mt-2 max-w-2xl text-white/78">Filtra por nombre, guarda favoritas y entra directo a comprar desde cualquier dispositivo.</p>
          </div>
          <NuxtLink
            to="/tiendas"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/20"
          >
            Ver todas las tiendas
            <ChevronRight class="h-4 w-4" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_230px_230px] xl:items-end">
          <label class="space-y-1 md:col-span-2 xl:col-span-1">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100/80">Buscar tienda</span>
            <input
              v-model="filterQuery"
              type="text"
              placeholder="Buscar tienda..."
              class="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 shadow-inner backdrop-blur focus:border-cyan-300 focus:outline-none"
            />
          </label>
          <button
            type="button"
            class="inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition"
            :class="showFavoriteStoresOnly ? 'border-fuchsia-200 bg-fuchsia-400/20 text-white shadow-inner' : 'border-white/20 bg-white/10 text-white/85 hover:bg-white/15'"
            @click="toggleFavoriteStoreFilter"
          >
            <Heart class="h-4 w-4" :class="showFavoriteStoresOnly ? 'fill-current text-fuchsia-200' : 'text-cyan-200'" />
            {{ showFavoriteStoresOnly ? 'Solo favoritos' : 'Mostrar todos' }}
          </button>
          <NuxtLink
            to="/tiendas"
            class="hidden h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 xl:inline-flex"
          >
            Explorar catálogo
          </NuxtLink>
        </div>
      </div>

      <div v-if="loadingAll" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">Cargando tiendas...</div>
      <div v-else-if="error" class="rounded-2xl border border-rose-200/50 bg-rose-500/10 px-4 py-3 text-rose-100">{{ error }}</div>
      <div v-else-if="filteredStoresAll.length === 0" class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-white/75">
        {{ emptyStoresMessage }}
      </div>
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StoreCard v-for="store in paginatedStores" :key="store.slug" :store="store" :accent="theme.accent" />
      </div>

      <div v-if="storesTotalPages > 1" class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur">
        <button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40" :disabled="storesPage === 1" @click="storesPage--">
          Anterior
        </button>
        <span>Página {{ storesPage }} / {{ storesTotalPages }}</span>
        <button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40" :disabled="storesPage === storesTotalPages" @click="storesPage++">
          Siguiente
        </button>
      </div>
    </section>

    <section class="relative z-10 mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-9 reveal" style="animation-delay: 0.08s;">
      <div class="rounded-[2rem] border border-[#0f274f]/20 bg-gradient-to-br from-slate-950 via-[#0f274f] to-amber-500 p-5 text-white shadow-2xl sm:p-6">
        <div class="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/90">PW Marketplace</p>
            <h3 class="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">Productos destacados para comprar con confianza</h3>
            <p class="mt-2 max-w-2xl text-white/78">Encuentra ofertas de distintas tiendas y compra directo desde su origen, en un solo lugar.</p>
          </div>
          <div class="grid gap-3 sm:grid-cols-2 lg:min-w-[360px] lg:max-w-[420px] lg:flex-none lg:grid-cols-2 lg:justify-end">
            <button
              type="button"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition"
              :class="showFavoriteProductsOnly ? 'border-amber-200 bg-amber-400/20 text-white shadow-inner' : 'border-white/20 bg-white/10 text-white/85 hover:bg-white/20'"
              @click="toggleFavoriteProductFilter"
            >
              <Heart class="h-4 w-4" :class="showFavoriteProductsOnly ? 'fill-current text-amber-200' : 'text-amber-100'" />
              {{ showFavoriteProductsOnly ? 'Solo productos favoritos' : 'Todos los productos' }}
            </button>
            <NuxtLink
              to="/marketplace"
              class="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/20 sm:col-span-2 lg:col-span-1"
            >
              Ir al PW Marketplace
              <ChevronRight class="h-4 w-4" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-if="loadingMarketplace" class="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80">Cargando marketplace...</div>
      <div v-else-if="marketplaceError" class="rounded-2xl border border-rose-200/50 bg-rose-500/10 px-4 py-3 text-rose-100">{{ marketplaceError }}</div>
      <div v-else-if="!marketplaceProducts.length" class="rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-white/75">
        No hay productos de marketplace publicados todavía.
      </div>
      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="product in paginatedMarketplaceProducts" :key="product.id" :product="product" :isMarketplace="true" />
      </div>

      <div v-if="displayMarketplaceProducts.length > marketplacePerPage" class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur">
        <button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40" :disabled="marketplacePage === 1" @click="marketplacePage -= 1">
          Anterior
        </button>
        <p>Mostrando {{ marketplacePageStart }}-{{ marketplacePageEnd }} de {{ displayMarketplaceProducts.length }}</p>
        <button class="rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 font-semibold hover:bg-white/15 disabled:opacity-40" :disabled="marketplacePage === marketplaceTotalPages" @click="marketplacePage += 1">
          Siguiente
        </button>
      </div>
    </section>

    <section class="relative z-10 mx-auto max-w-6xl px-4 pb-8 sm:px-6 reveal" style="animation-delay: 0.1s;">
      <div class="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#eef6ff] p-6 shadow-sm sm:p-8">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img src="/logoPW.png" alt="Pymeweb" class="h-10 w-10 object-contain" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="section-kicker">Sobre Pymeweb</p>
            <h3 class="section-title text-3xl sm:text-4xl">Impulsamos pymes con una vitrina digital simple y potente</h3>
          </div>
        </div>
        <p class="mt-4 max-w-3xl text-slate-600">
          Pymeweb nace para ayudar a emprendedores y pequeñas empresas a vender online con identidad propia,
          sin fricción técnica y con foco en resultados reales.
        </p>
        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <article class="rounded-xl border border-sky-100 bg-sky-50 p-4">
            <p class="text-xs uppercase tracking-[0.16em] text-sky-700">Misión</p>
            <p class="mt-2 text-sm text-slate-700">Digitalizar ventas de pymes con herramientas prácticas y modernas.</p>
          </article>
          <article class="rounded-xl border border-violet-100 bg-violet-50 p-4">
            <p class="text-xs uppercase tracking-[0.16em] text-violet-700">Visión</p>
            <p class="mt-2 text-sm text-slate-700">Ser la plataforma de comercio local más confiable para crecer en Latinoamérica.</p>
          </article>
          <article class="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p class="text-xs uppercase tracking-[0.16em] text-emerald-700">Compromiso</p>
            <p class="mt-2 text-sm text-slate-700">Acompañar a cada negocio con soporte cercano, pagos seguros y evolución continua.</p>
          </article>
        </div>
      </div>
    </section>

    <section v-if="showCreateStoreModal" class="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-10">
      <div class="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          @click="closeCreateStoreModal"
          aria-label="Cerrar creación"
        >
          ×
        </button>

        <div class="space-y-4">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Nueva tienda</p>
            <h2 class="text-xl font-semibold text-slate-900">Crea tu tienda en Pymeweb</h2>
            <p class="text-slate-600">Completa los datos principales. Puedes seguir editando dentro de tu tienda luego de crearla.</p>
          </div>

          <div class="space-y-5">
            <section class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">General</p>
              <div class="mt-3 grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm text-slate-600">Nombre</label>
                  <input v-model="createForm.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-slate-600">Slug (opcional)</label>
                  <input v-model="createForm.slug" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Tipo de tienda</label>
                  <select v-model="createForm.store_type" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="retail">Retail</option>
                    <option value="fast_food">Comida rápida</option>
                    <option value="bakery">Pastelería</option>
                    <option value="pharmacy">Farmacia</option>
                    <option value="fashion">Moda</option>
                    <option value="bookstore">Librería</option>
                  </select>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Descripción</label>
                  <textarea v-model="createForm.description" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Quiénes somos</label>
                  <textarea v-model="createForm.about_who_we_are" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="¿Quiénes son y qué ofrecen?"></textarea>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Nuestra historia</label>
                  <textarea v-model="createForm.about_history" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="¿Cómo nació la tienda y su evolución?"></textarea>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Misión y visión</label>
                  <textarea v-model="createForm.about_mission" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="¿Cuál es su propósito y visión?"></textarea>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Información adicional (opcional)</label>
                  <textarea v-model="createForm.about_extra" rows="2" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Valores, equipo, certificaciones, etc."></textarea>
                </div>
              </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Diseño</p>
              <div class="mt-3 grid gap-4 md:grid-cols-2">
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Logo</label>
                  <input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @change="onCreateLogoSelect" />
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Banner principal (opcional)</label>
                  <input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @change="onCreateBannerSelect" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-slate-600">Color acento</label>
                  <input v-model="createForm.accent_color" type="color" class="h-10 w-full rounded-xl border border-slate-200 bg-white px-2 py-1" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-slate-600">Patrón</label>
                  <select v-model="createForm.hero_pattern_style" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                    <option value="type">Según tipo</option>
                    <option value="diagonal">Diagonal</option>
                    <option value="vertical">Vertical</option>
                    <option value="circles">Círculos</option>
                    <option value="none">Sin patrón</option>
                  </select>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Galería rápida (máximo 5: imagen/video)</label>
                  <input type="file" multiple accept="image/*,video/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @change="onCreateQuickMediaSelect" />
                  <p class="text-xs text-slate-500">{{ createForm.quick_media.length }}/5 elementos listos.</p>
                </div>
              </div>
            </section>

            <section class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Contacto</p>
              <div class="mt-3 grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label class="text-sm text-slate-600">Email de contacto</label>
                  <input v-model="createForm.contact_email" type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-slate-600">Teléfono</label>
                  <input v-model="createForm.phone" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-slate-600">WhatsApp</label>
                  <input v-model="createForm.whatsapp" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-slate-600">Dirección</label>
                  <input v-model="createForm.address" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                </div>
              </div>
            </section>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
              :style="{ backgroundColor: theme.accent }"
              :disabled="creating || !createForm.name.trim()"
              @click="createStore"
            >
              {{ creating ? 'Creando...' : 'Crear tienda' }}
            </button>
            <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
            <p v-else-if="createMessage" class="text-sm text-emerald-600">{{ createMessage }}</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="relative z-10 border-t bg-white/80 backdrop-blur">
      <div class="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-slate-500">
        © {{ new Date().getFullYear() }} Pymeweb — Gestiona y personaliza tus tiendas
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, Heart, Star } from 'lucide-vue-next'
import ProductCard from '~/components/ProductCard.vue'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'
import { useCartStore } from '~/stores/cart'
import { makeProductFavoriteKey, useFavorites } from '../composables/useFavorites'
import { useMarketplaceRequests } from '~/composables/useMarketplaceRequests'

type Store = { id: number; name: string; slug: string; store_type?: string }

const config = useRuntimeConfig()
const apiBase = String(config.public.apiBase || '')
const router = useRouter()
const auth = useAuthStore()
const theme = useThemeStore()
const cart = useCartStore()
const { controlledGet } = useMarketplaceRequests()

const { isStoreFavorite, isProductFavoriteKey, toggleProductFavoriteKey } = useFavorites()

const asAnyTo = (path: string) => ({ path } as any)

const storesAll = ref<Store[]>([])
const storesMine = ref<Store[]>([])
const loadingAll = ref(true)
const loadingMine = ref(false)
const marketplaceProducts = ref<any[]>([])
const loadingMarketplace = ref(true)
const marketplaceError = ref('')
const latestStoreProducts = ref<any[]>([])
const shuffledStoreProducts = ref<any[]>([])
const highlightedStoreProductId = ref<number | string | null>(null)
const loadingStoreProducts = ref(true)
const storeProductsError = ref('')
const error = ref('')
const newStoreName = ref('')
const creating = ref(false)
const createError = ref('')
const createMessage = ref('')
const showCreateStoreModal = ref(false)
const createForm = ref({
  name: '',
  slug: '',
  store_type: 'retail',
  description: '',
  about: '',
  about_who_we_are: '',
  about_history: '',
  about_mission: '',
  about_extra: '',
  contact_email: '',
  phone: '',
  whatsapp: '',
  address: '',
  logo_url: '',
  banner_url: '',
  accent_color: '#2563eb',
  gradient_from: '#111827',
  gradient_to: '#0b2358',
  hero_pattern_style: 'type',
  quick_media: [] as Array<{ id: string; type: 'image' | 'video'; url: string }>,
})
const filterQuery = ref('')
const storesPage = ref(1)
const storesPerPage = 9
const showFavoriteStoresOnly = ref(false)
const showFavoriteProductsOnly = ref(false)
const marketplacePage = ref(1)
const marketplacePerPage = 6
const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})

const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
}))

const toggleFavoriteProductFilter = () => {
  showFavoriteProductsOnly.value = !showFavoriteProductsOnly.value
}

const toggleFavoriteStoreFilter = () => {
  showFavoriteStoresOnly.value = !showFavoriteStoresOnly.value
  storesPage.value = 1
}

const filteredStoresAll = computed(() => {
  const term = filterQuery.value.trim().toLowerCase()
  const base = !term
    ? storesAll.value
    : storesAll.value.filter((s) => s.name.toLowerCase().includes(term) || s.slug.toLowerCase().includes(term))

  const filtered = showFavoriteStoresOnly.value ? base.filter((s) => isStoreFavorite(s.slug)) : base

  return [...filtered].sort((a, b) => {
    const favDiff = Number(isStoreFavorite(b.slug)) - Number(isStoreFavorite(a.slug))
    if (favDiff) return favDiff
    return a.name.localeCompare(b.name)
  })
})

const emptyStoresMessage = computed(() =>
  filterQuery.value.trim()
    ? 'No hay tiendas que coincidan con tu búsqueda.'
    : 'No hay tiendas disponibles.'
)

const storesTotalPages = computed(() => Math.max(1, Math.ceil(filteredStoresAll.value.length / storesPerPage)))
const paginatedStores = computed(() => {
  const start = (storesPage.value - 1) * storesPerPage
  return filteredStoresAll.value.slice(start, start + storesPerPage)
})

const fetchAllStores = async () => {
  loadingAll.value = true
  error.value = ''
  try {
    storesAll.value = await $fetch<Store[]>(`${apiBase}/stores/` as any)
    storesPage.value = 1
  } catch (err) {
    console.error(err)
    // Evitamos mostrar error rojo; dejamos el estado vacío
    storesAll.value = []
    error.value = ''
  } finally {
    loadingAll.value = false
  }
}

const fetchMarketplace = async () => {
  loadingMarketplace.value = true
  marketplaceError.value = ''
  try {
    marketplaceProducts.value = await controlledGet<any[]>(
      'home:marketplace:products:limit6',
      `${apiBase}/marketplace/products/?limit=6`,
      { backoffMs: 10_000, minIntervalMs: 1000 },
    )
  } catch (err: any) {
    console.error(err)
    marketplaceError.value = err?.response?.status === 429
      ? 'Marketplace temporalmente ocupado. Reintentaremos en unos segundos.'
      : 'Error al cargar el marketplace'
  } finally {
    loadingMarketplace.value = false
  }
}

const fetchLatestStoreProducts = async () => {
  loadingStoreProducts.value = true
  storeProductsError.value = ''
  const candidates = [
    `${apiBase}/products/latest/?limit=12&ordering=-created_at`,
    `${apiBase}/marketplace/products/?store_only=true&limit=12&ordering=-created_at`,
  ]
  for (const url of candidates) {
    try {
      const isMarketplaceUrl = url.includes('/marketplace/products/')
      const data = isMarketplaceUrl
        ? await controlledGet<any[]>(
            `home:store-products:${url}`,
            url,
            { backoffMs: 10_000, minIntervalMs: 1000 },
          )
        : await $fetch<any[]>(url as any)
      if (data?.length) {
        latestStoreProducts.value = data
        shuffleFeaturedProducts()
        loadingStoreProducts.value = false
        return
      }
    } catch (err) {
      // try next endpoint
    }
  }
  // Fallback: usa los productos de marketplace que pertenezcan a tiendas (no marketplace)
  const fallback = (marketplaceProducts.value || [])
    .filter((p: any) => !p.store_is_marketplace)
    .sort((a: any, b: any) => new Date(b.created_at || b.created || b.id).getTime() - new Date(a.created_at || a.created || a.id).getTime())
  latestStoreProducts.value = fallback.slice(0, 6)
  shuffleFeaturedProducts()
  storeProductsError.value = ''
  loadingStoreProducts.value = false
}

const storeAccent = (product: any) => product?.store?.color || product?.store?.brand_color || theme.accent
const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0)
const displayPrice = (product: any) => {
  const minQty = Math.max(1, Number(product?.offer_min_qty || 1))
  if (product?.offer_price && minQty <= 1) return Number(product.offer_price)
  return Number(product?.price || 0)
}
const shuffleArray = <T,>(items: T[]) => {
  const clone = [...items]
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = clone[i]
    clone[i] = clone[j]
    clone[j] = temp
  }
  return clone
}

const shuffleFeaturedProducts = () => {
  const base = shuffleArray((latestStoreProducts.value || []).filter(Boolean))
  shuffledStoreProducts.value = base
  if (!base.length) {
    highlightedStoreProductId.value = null
    return
  }
  if (!base.some((product) => String(product?.id) === String(highlightedStoreProductId.value))) {
    highlightedStoreProductId.value = base[0]?.id ?? null
  }
}

const rotateHighlightedFeaturedProduct = () => {
  const source = shuffledStoreProducts.value.length ? shuffledStoreProducts.value : latestStoreProducts.value
  if (!source.length) {
    highlightedStoreProductId.value = null
    return
  }
  const currentId = highlightedStoreProductId.value
  const candidates = source.filter((product) => String(product?.id) !== String(currentId))
  const pool = candidates.length ? candidates : source
  const randomIndex = Math.floor(Math.random() * pool.length)
  highlightedStoreProductId.value = pool[randomIndex]?.id ?? source[0]?.id ?? null
}

const featuredStoreProducts = computed(() => latestStoreProducts.value || [])

const featuredMainProduct = computed(() => featuredStoreProducts.value[0] || null)
const featuredSecondaryProducts = computed(() => featuredStoreProducts.value.slice(1))
let featuredRotationTimer: ReturnType<typeof setInterval> | null = null

const productFavoriteKey = (product: any) => makeProductFavoriteKey(product?.store?.slug, product?.slug || product?.id)
const isProductFavorite = (product: any) => isProductFavoriteKey(productFavoriteKey(product))
const toggleProductFavorite = (product: any) => toggleProductFavoriteKey(productFavoriteKey(product))
const displayMarketplaceProducts = computed(() => {
  const base = marketplaceProducts.value || []
  const filtered = showFavoriteProductsOnly.value ? base.filter((p: any) => isProductFavorite(p)) : base
  return [...filtered].sort((a: any, b: any) => Number(isProductFavorite(b)) - Number(isProductFavorite(a)))
})
const marketplaceTotalPages = computed(() => Math.max(1, Math.ceil(displayMarketplaceProducts.value.length / marketplacePerPage)))
const paginatedMarketplaceProducts = computed(() => {
  const start = (marketplacePage.value - 1) * marketplacePerPage
  return displayMarketplaceProducts.value.slice(start, start + marketplacePerPage)
})
const marketplacePageStart = computed(() => (displayMarketplaceProducts.value.length ? (marketplacePage.value - 1) * marketplacePerPage + 1 : 0))
const marketplacePageEnd = computed(() => Math.min(marketplacePage.value * marketplacePerPage, displayMarketplaceProducts.value.length))

const productImage = (product: any) => product?.image_url || product?.image || product?.images?.[0]?.image || '/logoPW.png'

const addToCart = async (product: any) => {
  if (!product) return
  cart.setContext('marketplace')
  cart.addProduct(product)
  await router.push('/marketplace/carrito')
}

const fetchMyStores = async () => {
  if (!auth.token) return
  loadingMine.value = true
  try {
    storesMine.value = await auth.fetchMyStores()
  } finally {
    loadingMine.value = false
  }
}

const openCreateStoreModal = () => {
  if (!auth.isAuthenticated) {
    router.push('/login')
    return
  }
  showCreateStoreModal.value = true
}

const closeCreateStoreModal = () => {
  showCreateStoreModal.value = false
}

const uploadToCloudinary = async (file: File, folder = 'upload/store') => {
  if (!cloudinaryUploadUrl.value || !config.public.cloudinaryUploadPreset) {
    throw new Error('Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.cloudinaryUploadPreset)
  formData.append('folder', folder)
  return $fetch<any>(cloudinaryUploadUrl.value, {
    method: 'POST',
    body: formData,
  })
}

const onCreateLogoSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  try {
    const result = await uploadToCloudinary(file, 'upload/store')
    if (!result?.secure_url) throw new Error('No se obtuvo URL del logo')
    createForm.value.logo_url = result.secure_url
    createMessage.value = 'Logo cargado correctamente.'
  } catch {
    createError.value = 'No pudimos subir el logo.'
  } finally {
    if (input) input.value = ''
  }
}

const onCreateBannerSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  try {
    const result = await uploadToCloudinary(file, 'upload/store')
    if (!result?.secure_url) throw new Error('No se obtuvo URL del banner')
    createForm.value.banner_url = result.secure_url
    createMessage.value = 'Banner cargado correctamente.'
  } catch {
    createError.value = 'No pudimos subir el banner.'
  } finally {
    if (input) input.value = ''
  }
}

const onCreateQuickMediaSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const files = Array.from(input?.files || [])
  if (!files.length) return

  const available = Math.max(0, 5 - createForm.value.quick_media.length)
  if (!available) {
    createError.value = 'Máximo 5 elementos de galería rápida.'
    if (input) input.value = ''
    return
  }

  const selected = files.slice(0, available)
  for (const file of selected) {
    try {
      const result = await uploadToCloudinary(file, 'upload/store')
      if (!result?.secure_url) continue
      createForm.value.quick_media.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        url: result.secure_url,
      })
    } catch {
      createError.value = 'Algunos archivos de galería no se pudieron subir.'
    }
  }

  if (input) input.value = ''
}

const buildCreateAboutNarrative = () => {
  const parts = [
    createForm.value.about_who_we_are.trim()
      ? `## Quiénes somos\n${createForm.value.about_who_we_are.trim()}`
      : '',
    createForm.value.about_history.trim()
      ? `## Nuestra historia\n${createForm.value.about_history.trim()}`
      : '',
    createForm.value.about_mission.trim()
      ? `## Misión y visión\n${createForm.value.about_mission.trim()}`
      : '',
    createForm.value.about_extra.trim(),
  ].filter(Boolean)

  if (parts.length) return parts.join('\n\n')
  return createForm.value.about.trim()
}

const createStore = async () => {
  if (!auth.token) {
    await router.push('/login')
    return
  }
  if (!createForm.value.name.trim()) {
    createError.value = 'Escribe el nombre de tu tienda'
    return
  }

  createError.value = ''
  createMessage.value = ''
  creating.value = true
  try {
    const created = await $fetch<Store>(`${apiBase}/stores/` as any, {
      method: 'POST',
      body: {
        name: createForm.value.name,
        slug: createForm.value.slug,
        store_type: createForm.value.store_type,
        description: createForm.value.description,
        about: buildCreateAboutNarrative(),
        contact_email: createForm.value.contact_email,
        phone: createForm.value.phone,
        whatsapp: createForm.value.whatsapp,
        address: createForm.value.address,
        logo_url: createForm.value.logo_url,
        banner_url: createForm.value.banner_url,
        accent_color: createForm.value.accent_color,
        gradient_from: createForm.value.gradient_from,
        gradient_to: createForm.value.gradient_to,
        hero_pattern_style: createForm.value.hero_pattern_style,
        hero_pattern_enabled: createForm.value.hero_pattern_style !== 'none',
        quick_media: createForm.value.quick_media,
      },
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    createMessage.value = 'Tienda creada correctamente'
    createForm.value = {
      name: '',
      slug: '',
      store_type: 'retail',
      description: '',
      about: '',
      about_who_we_are: '',
      about_history: '',
      about_mission: '',
      about_extra: '',
      contact_email: '',
      phone: '',
      whatsapp: '',
      address: '',
      logo_url: '',
      banner_url: '',
      accent_color: '#2563eb',
      gradient_from: '#111827',
      gradient_to: '#0b2358',
      hero_pattern_style: 'type',
      quick_media: [],
    }
    showCreateStoreModal.value = false
    await Promise.all([fetchAllStores(), fetchMyStores()])
    if (created?.slug) {
      await router.push({ path: '/store/' + created.slug, query: { edit: 'true' } } as any)
    }
  } catch (err: any) {
    createError.value = err?.response?._data?.detail || 'No pudimos crear la tienda'
  } finally {
    creating.value = false
  }
}

const productDetailPath = (product: any) => {
  const id = product?.slug || product?.id
  if (!id) return '/marketplace'
  if (product?.store?.slug && !product?.store_is_marketplace) {
    return `/store/${product.store.slug}/productos/${id}`
  }
  return `/marketplace/productos/${id}`
}

const storePath = (product: any) => {
  const storeSlug = product?.store?.slug
  return storeSlug ? `/store/${storeSlug}` : '/tiendas'
}

// Marketplace accent and styles
const MARKET_ACCENT = '#f59e0b'
const marketGlowStyle = computed(() => ({ background: `radial-gradient(circle at 30% 20%, ${MARKET_ACCENT}1a, transparent 40%)` }))
const marketBadgeClass = computed(() => 'bg-amber-100 text-amber-800')

onMounted(async () => {
  theme.loadFromStorage()
  await auth.initializeSession().catch(() => null)
  await fetchAllStores()
  await fetchMarketplace()
  await fetchLatestStoreProducts()
  rotateHighlightedFeaturedProduct()
  featuredRotationTimer = setInterval(() => {
    shuffleFeaturedProducts()
    rotateHighlightedFeaturedProduct()
  }, 6000)
  if (auth.token) {
    await fetchMyStores()
  }
  theme.applyTheme()
})

onBeforeUnmount(() => {
  if (featuredRotationTimer) {
    clearInterval(featuredRotationTimer)
    featuredRotationTimer = null
  }
})

watch(latestStoreProducts, () => {
  shuffleFeaturedProducts()
  rotateHighlightedFeaturedProduct()
})

watch(
  () => auth.token,
  async (token) => {
    if (token) {
      await fetchMyStores()
    } else {
      storesMine.value = []
    }
  }
)

watch(filterQuery, () => {
  storesPage.value = 1
})

watch(displayMarketplaceProducts, () => {
  if (marketplacePage.value > marketplaceTotalPages.value) marketplacePage.value = marketplaceTotalPages.value
})

watch(showFavoriteProductsOnly, () => {
  marketplacePage.value = 1
})
</script>

