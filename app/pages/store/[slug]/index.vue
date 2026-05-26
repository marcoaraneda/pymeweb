<template>
  <div class="min-h-screen text-slate-900" :class="pageShellClass" :style="pageShellStyle">
    <section class="relative overflow-hidden bg-gradient-to-br from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] text-white" :style="[heroBackgroundStyle, heroSectionStyle]">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_45%)]" aria-hidden="true" />
      <div class="absolute inset-0 opacity-80" :style="heroPatternStyle" aria-hidden="true" />
      <div class="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16 lg:flex-row lg:items-center lg:gap-10 lg:py-20">
        <div class="space-y-5 lg:w-1/2">
          <p class="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em]" :style="heroBadgeStyle">{{ heroBadgeLabel }}</p>
          <div class="flex items-center gap-3">
            <h1 class="text-4xl font-bold leading-tight md:text-5xl">{{ heroTitle }}</h1>
            <button
              v-if="canEditTheme"
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20"
              title="Editar tienda"
              @click="activeEditTab = 'general'; showStoreForm = true"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5">
                <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.512l-3.12.89a.5.5 0 0 1-.62-.62l.89-3.12a2 2 0 0 1 .512-.878l8.5-8.5Z" />
                <path d="M12.5 4.75 15.25 7.5" />
              </svg>
            </button>
          </div>
          <p class="max-w-2xl text-lg text-white/80">
            {{ heroDescription }}
          </p>
          <div class="flex flex-wrap gap-3">
            <NuxtLink
              :to="`/store/${slug}/productos`"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              :style="accentStyle"
            >
              {{ primaryCtaLabel }}
              <span aria-hidden="true">→</span>
            </NuxtLink>
            <a href="#destacados" class="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:border-white/40 hover:bg-white/5 transition">
              {{ secondaryCtaLabel }}
            </a>
          </div>
          <div class="flex flex-wrap gap-2 text-sm text-white/75">
            <span class="rounded-full border border-white/15 px-3 py-1">{{ chipOne }}</span>
            <span class="rounded-full border border-white/15 px-3 py-1">{{ chipTwo }}</span>
              <span v-if="tenantStore.categories.length" class="rounded-full border border-white/15 px-3 py-1">{{ tenantStore.categories.length }} categorías</span>
              <span
                v-for="cat in tenantStore.categories"
                :key="categoryKey(cat)"
                class="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-white"
              >
                {{ categoryLabel(cat) }}
              </span>
          </div>
        </div>

        <div class="relative lg:w-1/2">
          <div class="absolute -inset-6 rounded-3xl blur-2xl" :style="quickGlowStyle" />
          <div class="relative rounded-3xl border p-6 shadow-2xl backdrop-blur" :style="quickPanelStyle">
            <p class="text-sm text-white/80">Vista rápida</p>
            <div class="mt-4 space-y-3">
              <div class="relative overflow-hidden rounded-2xl border border-white/20 bg-black/20">
                <div v-if="isProductsSlide" class="grid h-56 grid-rows-2 gap-2 bg-white/10 p-3 sm:h-64 sm:grid-cols-2 sm:grid-rows-1">
                  <div v-for="product in previewProducts" :key="product.id" class="relative h-full overflow-hidden rounded-xl bg-white/10 shadow-inner">
                    <img
                      :src="getProductImage(product) || '/logoPW.png'"
                      :alt="product.name || 'Producto'"
                      class="h-full w-full object-cover"
                    />
                    <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 pb-2 pt-6">
                      <p class="line-clamp-1 text-xs font-semibold text-white sm:text-sm">{{ product.name }}</p>
                      <p class="text-base font-extrabold leading-tight sm:text-lg" :style="priceTextStyle">${{ product.price }}</p>
                    </div>
                  </div>
                  <div v-if="!previewProducts.length" class="flex items-center justify-center rounded-2xl border border-dashed border-white/30 text-sm text-white/80 sm:col-span-2">
                    Aún no hay productos recomendados para mostrar.
                  </div>
                </div>
                <img
                  v-else-if="activeQuickMedia?.type === 'image'"
                  :src="activeQuickMedia.url"
                  alt="Vista rápida de tienda"
                  class="h-56 w-full object-cover sm:h-64"
                />
                <video
                  v-else-if="activeQuickMedia"
                  :src="activeQuickMedia.url"
                  class="h-56 w-full object-cover sm:h-64"
                  controls
                  muted
                  playsinline
                />
                <button
                  v-if="quickSlideCount > 1"
                  class="absolute left-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-900/45 text-white hover:bg-slate-900/65"
                  aria-label="Elemento anterior"
                  @click="previousQuickMedia"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  v-if="quickSlideCount > 1"
                  class="absolute right-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-slate-900/45 text-white hover:bg-slate-900/65"
                  aria-label="Siguiente elemento"
                  @click="nextQuickMedia"
                >
                  <span aria-hidden="true">›</span>
                </button>

                <!-- Menu de opciones para elemento activo -->
                <div v-if="canEditTheme && activeQuickMedia && !isProductsSlide" class="absolute right-3 top-3 relative">
                  <button
                    class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-slate-900/60 text-white hover:bg-slate-900/80"
                    @click="showQuickMediaMenu = !showQuickMediaMenu"
                  >
                    ⋮
                  </button>
                  <div
                    v-if="showQuickMediaMenu"
                    class="absolute right-0 top-10 z-20 rounded-lg border border-white/20 bg-slate-900/95 backdrop-blur"
                  >
                    <button
                      class="block w-full px-4 py-2 text-left text-sm text-red-200 hover:bg-red-600/20"
                      @click="deleteCurrentQuickMedia"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-center gap-2">
                <button
                  v-for="n in quickSlideCount"
                  :key="`quick-dot-${n - 1}`"
                  class="h-2.5 w-2.5 rounded-full transition"
                  :class="n - 1 === activeQuickMediaIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'"
                  :aria-label="`Ir al elemento ${n}`"
                  @click="setQuickMediaIndex(n - 1)"
                />
                <button
                  v-if="canEditTheme"
                  class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/35 bg-white/10 text-sm font-semibold text-white hover:bg-white/20"
                  title="Agregar foto o video"
                  aria-label="Agregar foto o video"
                  @click="openQuickMediaPicker"
                >
                  +
                </button>
                <input
                  ref="quickMediaPicker"
                  type="file"
                  class="hidden"
                  accept="image/*,video/*"
                  @change="onQuickMediaUpload"
                />
              </div>
            </div>
            <p v-if="!previewProducts.length && !quickMediaItems.length" class="text-white/70">Aún no hay productos cargados.</p>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="canEditTheme && showHomeCopyForm"
      class="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-10"
    >
      <div class="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          aria-label="Cerrar editor de portada"
          @click="showHomeCopyForm = false"
        >
          ×
        </button>

        <div class="space-y-4">
          <div>
            <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Edición rápida</p>
            <h2 class="text-xl font-semibold text-slate-900">{{ homeCopyEditorTitle }}</h2>
            <p class="text-sm text-slate-600">{{ homeCopyEditorDescription }}</p>
          </div>

          <div v-if="homeCopyMessage" class="rounded-xl border px-3 py-2 text-sm" :class="homeCopyStatus === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'">
            {{ homeCopyMessage }}
          </div>

          <div v-if="homeCopyFocus === 'hero'" class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1 text-sm">
              <span class="font-semibold text-slate-700">Título principal</span>
              <input id="quick-home-hero-title" v-model="storeForm.home_hero_title" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label class="space-y-1 text-sm">
              <span class="font-semibold text-slate-700">Subtítulo principal</span>
              <input id="quick-home-hero-subtitle" v-model="storeForm.home_hero_subtitle" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
          </div>

          <div v-else-if="homeCopyFocus === 'featured'" class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1 text-sm">
              <span class="font-semibold text-slate-700">Título destacados</span>
              <input id="quick-home-featured-title" v-model="storeForm.home_featured_title" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label class="space-y-1 text-sm">
              <span class="font-semibold text-slate-700">Subtítulo destacados</span>
              <input id="quick-home-featured-subtitle" v-model="storeForm.home_featured_subtitle" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
          </div>

          <div v-else class="grid gap-4 sm:grid-cols-2">
            <label class="space-y-1 text-sm">
              <span class="font-semibold text-slate-700">Título catálogo</span>
              <input id="quick-home-catalog-title" v-model="storeForm.home_catalog_title" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
            <label class="space-y-1 text-sm">
              <span class="font-semibold text-slate-700">Subtítulo catálogo</span>
              <input id="quick-home-catalog-subtitle" v-model="storeForm.home_catalog_subtitle" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </label>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <button class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="showHomeCopyForm = false">
              Cancelar
            </button>
            <button class="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" :style="accentStyle" :disabled="savingHomeCopy" @click="saveHomeCopyQuick">
              {{ savingHomeCopy ? 'Guardando...' : 'Guardar textos' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section v-if="canEditTheme && showStoreForm" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/70 px-4 py-10" id="brand">
      <div class="relative w-full max-w-4xl max-h-[calc(100vh-3rem)] overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
          @click="showStoreForm = false"
          aria-label="Cerrar edición"
        >
          ×
        </button>

        <div class="space-y-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Datos de la tienda</p>
              <h2 class="text-xl font-semibold text-slate-900">Editar tienda</h2>
              <p class="text-slate-600">Se guardan en el servidor para esta tienda.</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <div v-if="updateMessage" class="text-sm" :class="updateStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">{{ updateMessage }}</div>
            </div>
          </div>

          <div class="sticky top-0 z-10 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2">
            <button
              class="rounded-xl px-3 py-2 text-sm font-semibold transition"
              :class="activeEditTab === 'general' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'"
              @click="activeEditTab = 'general'"
            >
              <span class="inline-flex items-center gap-2">
                <Store class="h-4 w-4" />
                General
                <span
                  class="inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"
                  :class="tabCompletion.general.completed ? 'border-emerald-600 bg-emerald-600 text-white' : (activeEditTab === 'general' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200')"
                >
                  <CheckCircle2 v-if="tabCompletion.general.completed" class="h-3.5 w-3.5" />
                  <span v-else>{{ tabCompletion.general.label }}</span>
                </span>
              </span>
            </button>
            <button
              class="rounded-xl px-3 py-2 text-sm font-semibold transition"
              :class="activeEditTab === 'design' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'"
              @click="activeEditTab = 'design'"
            >
              <span class="inline-flex items-center gap-2">
                <Palette class="h-4 w-4" />
                Diseño
                <span
                  class="inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"
                  :class="tabCompletion.design.completed ? 'border-emerald-600 bg-emerald-600 text-white' : (activeEditTab === 'design' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200')"
                >
                  <CheckCircle2 v-if="tabCompletion.design.completed" class="h-3.5 w-3.5" />
                  <span v-else>{{ tabCompletion.design.label }}</span>
                </span>
              </span>
            </button>
            <button
              class="rounded-xl px-3 py-2 text-sm font-semibold transition"
              :class="activeEditTab === 'about' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'"
              @click="activeEditTab = 'about'"
            >
              <span class="inline-flex items-center gap-2">
                <Share2 class="h-4 w-4" />
                Acerca
                <span
                  class="inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"
                  :class="tabCompletion.about.completed ? 'border-emerald-600 bg-emerald-600 text-white' : (activeEditTab === 'about' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200')"
                >
                  <CheckCircle2 v-if="tabCompletion.about.completed" class="h-3.5 w-3.5" />
                  <span v-else>{{ tabCompletion.about.label }}</span>
                </span>
              </span>
            </button>
            <button
              class="rounded-xl px-3 py-2 text-sm font-semibold transition"
              :class="activeEditTab === 'contact' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'"
              @click="activeEditTab = 'contact'"
            >
              <span class="inline-flex items-center gap-2">
                <Phone class="h-4 w-4" />
                Contacto
                <span
                  class="inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"
                  :class="tabCompletion.contact.completed ? 'border-emerald-600 bg-emerald-600 text-white' : (activeEditTab === 'contact' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200')"
                >
                  <CheckCircle2 v-if="tabCompletion.contact.completed" class="h-3.5 w-3.5" />
                  <span v-else>{{ tabCompletion.contact.label }}</span>
                </span>
              </span>
            </button>
            <button
              class="rounded-xl px-3 py-2 text-sm font-semibold transition"
              :class="activeEditTab === 'account' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-white/70'"
              @click="activeEditTab = 'account'"
            >
              <span class="inline-flex items-center gap-2">
                <span class="inline-flex h-4 w-4 items-center justify-center text-[11px]">$</span>
                Cuenta
                <span
                  class="inline-flex min-w-10 items-center justify-center rounded-full border px-2 py-0.5 text-[11px] font-bold"
                  :class="tabCompletion.account.completed ? 'border-emerald-600 bg-emerald-600 text-white' : (activeEditTab === 'account' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200')"
                >
                  <CheckCircle2 v-if="tabCompletion.account.completed" class="h-3.5 w-3.5" />
                  <span v-else>{{ tabCompletion.account.label }}</span>
                </span>
              </span>
            </button>
          </div>

          <div v-if="activeEditTab === 'general'" class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Nombre de la tienda</label>
              <input v-model="storeForm.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Slug (se usa en la URL)</label>
              <input v-model="storeForm.slug" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
              <p class="text-xs text-slate-500">Ejemplo: /store/{{ storeForm.slug || 'mitienda' }}</p>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Tipo de tienda</label>
              <select v-model="storeForm.store_type" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="retail">Retail</option>
                <option value="fast_food">Comida rápida</option>
                <option value="bakery">Pastelería</option>
                <option value="pharmacy">Farmacia</option>
                <option value="fashion">Moda</option>
                <option value="bookstore">Librería</option>
              </select>
              <div class="flex flex-wrap items-center gap-2 pt-1">
                <button
                  class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  :disabled="syncingCategories || updatingStore"
                  @click="syncStoreTypeCategories()"
                >
                  {{ syncingCategories ? 'Sincronizando categorías...' : 'Sincronizar categorías de este tipo' }}
                </button>
                <p class="text-xs text-slate-500">Crea categorías faltantes del tipo elegido y ajusta las visibles en formularios.</p>
              </div>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Descripción</label>
              <textarea v-model="storeForm.description" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Logo</label>
              <input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @change="onStoreLogoFileSelect" />
              <p class="text-xs text-slate-500">Solo archivo de imagen. Se aplicará al guardar cambios.</p>
              <p v-if="storeForm.logo_url" class="text-xs text-slate-500">Logo listo para guardar.</p>
            </div>
            <div class="space-y-3 md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Ventas y checkout</p>
              <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input v-model="storeForm.cart_enabled" type="checkbox" class="h-4 w-4" />
                Habilitar carrito en la tienda
              </label>
              <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input v-model="storeForm.whatsapp_sales_enabled" type="checkbox" class="h-4 w-4" />
                Habilitar ventas por WhatsApp
              </label>
            </div>
            <div v-if="hasMenuSupport" class="space-y-3 md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <label class="text-sm font-semibold text-slate-700">Carta o menú</label>
                <p class="text-xs text-slate-500">Sube PDF/Word/imagen o páginas de menú para mostrarlas en la tienda.</p>
              </div>
              <input type="file" accept="image/*,application/pdf,.doc,.docx" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @change="onMenuFileSelect" />
              <input type="file" multiple accept="image/*,application/pdf" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @change="onMenuPagesSelect" />
              <p v-if="storeForm.menu_file_url" class="text-xs text-slate-500">Archivo principal listo para guardar.</p>
            </div>
          </div>

          <div v-else-if="activeEditTab === 'design'" class="grid gap-4">
            <div class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 md:col-span-2 md:p-5">
              <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p class="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Diseño</p>
                  <h3 class="text-base font-semibold text-slate-900">Diseño de marca</h3>
                </div>
                <span class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">Vista previa en tiempo real</span>
              </div>

              <div class="space-y-2">
                <label class="text-sm text-slate-600">Patrón decorativo del encabezado</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="option in patternOptions"
                    :key="`pattern-${option.value}`"
                    class="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                    :class="storeForm.hero_pattern_style === option.value ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'"
                    @click="storeForm.hero_pattern_style = option.value"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm text-slate-600">Banner principal (opcional)</label>
                <input type="file" accept="image/*" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" @change="onStoreBannerFileSelect" />
                <p class="text-xs text-slate-500">Solo archivo de imagen. Se aplicará al guardar cambios.</p>
                <p v-if="pendingTheme.banner_url" class="text-xs text-slate-500">Banner listo para guardar.</p>
              </div>

              <div class="space-y-2">
                <label class="text-sm text-slate-600">Color de acento</label>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-for="c in palette"
                    :key="`pending-accent-${c}`"
                    class="h-8 w-8 rounded-full border border-slate-200 shadow-inner transition hover:-translate-y-0.5"
                    :style="{ backgroundColor: c }"
                    @click="queueAccent(c)"
                  />
                  <input v-model="customAccent" type="color" class="h-9 w-14 rounded border border-slate-200 bg-white" />
                  <button class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="queueCustomAccent">Usar personalizado</button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="text-sm text-slate-600">Degradado</label>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-for="g in gradients"
                    :key="`pending-gradient-${g.from}-${g.to}`"
                    class="h-10 w-14 rounded-xl border border-slate-200 shadow-inner transition hover:-translate-y-0.5"
                    :style="{ backgroundImage: `linear-gradient(120deg, ${g.from}, ${g.to})` }"
                    @click="queueGradient(g.from, g.to)"
                  />
                </div>
              </div>

              <div class="space-y-3">
                <div>
                  <label class="text-sm text-slate-600">Vista rápida: fotos o videos</label>
                  <p class="text-xs text-slate-500">Sube uno o varios archivos. Se mostrarán como carrusel automático en portada al guardar.</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  @change="onQuickMediaUpload"
                />
                <p class="text-xs text-slate-500">Máximo 7 archivos y 15MB por archivo.</p>
                <div v-if="quickMediaDraft.length" class="grid gap-3 md:grid-cols-2">
                  <div v-for="(item, index) in quickMediaDraft" :key="item.id" class="rounded-xl border border-slate-200 bg-white p-3">
                    <div class="mb-2 overflow-hidden rounded-lg border border-slate-200 bg-black/5">
                      <img v-if="item.type === 'image'" :src="item.url" alt="Elemento de vista rápida" class="h-28 w-full object-cover" />
                      <video v-else :src="item.url" class="h-28 w-full object-cover" controls muted playsinline />
                    </div>
                    <div class="flex items-center justify-between gap-2">
                      <p class="truncate text-xs text-slate-500">Elemento {{ index + 1 }} · {{ item.type === 'image' ? 'Foto' : 'Video' }}</p>
                      <button class="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50" @click="removeQuickMedia(item.id)">Quitar</button>
                    </div>
                  </div>
                </div>
                <p v-else class="text-xs text-slate-500">No has agregado fotos o videos para esta vista.</p>
              </div>
            </div>
          </div>

          <div v-else-if="activeEditTab === 'about'" class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2 md:col-span-2 rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Contenido para página Acerca</p>
              <p class="mt-2 text-sm text-slate-700">Completa esta sección para mostrar una presentación más clara de tu marca: quiénes son, historia, misión y sucursales.</p>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Quiénes somos</label>
              <textarea v-model="storeForm.about_who_we_are" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Describe quiénes son y qué ofrecen."></textarea>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Nuestra historia</label>
              <textarea v-model="storeForm.about_history" rows="6" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Cuenta cómo nació la tienda y su evolución."></textarea>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Misión y visión</label>
              <textarea v-model="storeForm.about_mission" rows="6" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Comparte la misión y visión de la tienda."></textarea>
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Información adicional (opcional)</label>
              <textarea v-model="storeForm.about_extra" rows="2" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Certificaciones, equipo, valores u otra información relevante."></textarea>
            </div>
            <div class="space-y-2 md:col-span-2">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <label class="text-sm text-slate-600">Sucursales para mostrar en Acerca</label>
                <button type="button" class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100" @click="addBranchLocation">
                  + Agregar sucursal
                </button>
              </div>
              <div class="space-y-3">
                <article v-for="(branch, index) in storeForm.branch_locations" :key="`branch-about-${index}`" class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div class="mb-2 flex items-center justify-between gap-2">
                    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Sucursal {{ index + 1 }}</p>
                    <button v-if="storeForm.branch_locations.length > 1" type="button" class="rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50" @click="removeBranchLocation(index)">
                      Quitar
                    </button>
                  </div>
                  <div class="grid gap-2 md:grid-cols-2">
                    <input v-model="branch.street" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Calle" />
                    <input v-model="branch.number" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Número" />
                    <input v-model="branch.comuna" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Comuna" />
                    <input v-model="branch.region" type="text" class="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Región" />
                  </div>
                </article>
              </div>
              <p class="text-xs text-slate-500">Estas direcciones se mostrarán como tarjetas en la página Acerca.</p>
            </div>
          </div>

          <div v-else-if="activeEditTab === 'account'" class="grid gap-4 md:grid-cols-2">
            <div class="md:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Cuenta receptora de pagos</p>
              <p class="mt-2 text-sm text-emerald-900">Esta cuenta define dónde se deposita el dinero de las ventas de tu tienda. Según la cuenta configurada, se habilita el método de pago visible al cliente en checkout.</p>
            </div>

            <div class="md:col-span-2 flex flex-wrap items-center gap-2">
              <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="payoutStatusPillClass">{{ payoutStatusLabel }}</span>
              <span class="text-xs text-slate-500">Proveedor activo: {{ payoutProviderLabel }}</span>
            </div>

            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Usar método guardado en tu cuenta (opcional)</label>
              <select v-model.number="payoutForm.payout_method_id" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" @change="onSelectSavedPayoutMethod">
                <option :value="0">Configurar manualmente</option>
                <option v-for="method in payoutAvailableMethods" :key="method.id" :value="method.id">
                  {{ method.label }} · {{ method.provider === 'paypal' ? `PayPal ${method.account_email || ''}` : `Webpay/Tarjeta **** ${method.card_last4 || ''}` }}
                </option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-slate-600">Método de pago a habilitar</label>
              <select v-model="payoutForm.provider" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="paypal">PayPal</option>
                <option value="card">Webpay / Tarjeta</option>
              </select>
            </div>

            <div class="space-y-2" v-if="payoutForm.provider === 'paypal'">
              <label class="text-sm text-slate-600">Correo PayPal</label>
              <input v-model="payoutForm.account_email" type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="pagos@tu-negocio.cl" />
            </div>

            <div class="space-y-2" v-else>
              <label class="text-sm text-slate-600">Últimos 4 dígitos de tarjeta/cuenta</label>
              <input v-model="payoutForm.account_number_last4" type="text" maxlength="8" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="1234" />
            </div>

            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Titular</label>
              <input v-model="payoutForm.account_holder_name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Nombre del titular de la cuenta" />
            </div>

            <div class="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <p class="font-semibold text-slate-800">Seguridad y cumplimiento (Chile)</p>
              <p class="mt-1">No guardamos números completos de tarjeta ni credenciales sensibles. Solo se almacenan datos mínimos (correo y últimos 4 dígitos) para identificación, trazabilidad y revisión manual, siguiendo principio de minimización de datos y buenas prácticas de seguridad (OWASP, control de acceso por rol, auditoría de cambios).</p>
            </div>

            <div class="md:col-span-2 flex flex-wrap items-center gap-3">
              <button
                class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
                :style="accentStyle"
                :disabled="savingPayout"
                @click="savePayoutAccountFromStore"
              >
                {{ savingPayout ? 'Guardando cuenta...' : 'Guardar cuenta receptora' }}
              </button>
              <button
                v-if="payoutConfigured"
                class="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                :disabled="savingPayout"
                @click="verifyPayoutAccountFromStore('verify')"
              >
                Marcar verificada
              </button>
              <button
                v-if="payoutConfigured"
                class="rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                :disabled="savingPayout"
                @click="verifyPayoutAccountFromStore('reject')"
              >
                Rechazar
              </button>
              <p v-if="payoutMessage" class="text-sm" :class="payoutStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">{{ payoutMessage }}</p>
            </div>
          </div>

          <div v-else-if="activeEditTab === 'contact'" class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Email de contacto</label>
              <input v-model="storeForm.contact_email" type="email" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2">
              <label class="text-sm text-slate-600">Teléfono</label>
              <input v-model="storeForm.phone" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">WhatsApp</label>
              <input v-model="storeForm.whatsapp" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-2 md:col-span-2">
              <label class="text-sm text-slate-600">Dirección principal</label>
              <input v-model="storeForm.address" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Ej: Av. Principal 123, Providencia" />
            </div>
            <div class="md:col-span-2 rounded-2xl border border-pink-100 bg-pink-50 p-4">
              <p class="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">🔗 Redes Sociales</p>
              <p class="mt-2 text-sm text-pink-900">Agrega los enlaces a tus perfiles de redes sociales. Se mostrarán en el footer y en la sección "Síguenos" de tu tienda. Deja vacío si no tienes perfil.</p>
            </div>

            <div class="space-y-2">
              <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Instagram class="h-4 w-4 text-pink-600" />
                Instagram
              </label>
              <input v-model="storeForm.social_instagram" type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://instagram.com/tu_usuario" />
            </div>

            <div class="space-y-2">
              <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Facebook class="h-4 w-4 text-blue-600" />
                Facebook
              </label>
              <input v-model="storeForm.social_facebook" type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://facebook.com/tu_pagina" />
            </div>

            <div class="space-y-2">
              <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Music2 class="h-4 w-4 text-slate-900" />
                TikTok
              </label>
              <input v-model="storeForm.social_tiktok" type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://tiktok.com/@tu_usuario" />
            </div>

            <div class="space-y-2">
              <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Youtube class="h-4 w-4 text-red-600" />
                YouTube
              </label>
              <input v-model="storeForm.social_youtube" type="url" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://youtube.com/@tu_canal" />
            </div>

            <div v-if="[storeForm.social_instagram, storeForm.social_facebook, storeForm.social_tiktok, storeForm.social_youtube].some(Boolean)" class="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-xs font-semibold text-slate-600 uppercase">Vista previa</p>
              <div class="mt-3 flex flex-wrap gap-2">
                <a v-if="storeForm.social_instagram" :href="storeForm.social_instagram" target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">
                  <Instagram class="h-3.5 w-3.5 text-pink-600" /> Instagram
                </a>
                <a v-if="storeForm.social_facebook" :href="storeForm.social_facebook" target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">
                  <Facebook class="h-3.5 w-3.5 text-blue-600" /> Facebook
                </a>
                <a v-if="storeForm.social_tiktok" :href="storeForm.social_tiktok" target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">
                  <Music2 class="h-3.5 w-3.5 text-slate-900" /> TikTok
                </a>
                <a v-if="storeForm.social_youtube" :href="storeForm.social_youtube" target="_blank" rel="noopener" class="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400">
                  <Youtube class="h-3.5 w-3.5 text-red-600" /> YouTube
                </a>
              </div>
            </div>
          </div>

          <div class="sticky bottom-0 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p class="text-sm text-slate-600">Cambiar el slug redirige a la nueva URL. El tema se persiste al guardar.</p>
            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
              :style="accentStyle"
              :disabled="updatingStore"
              @click="saveStore"
            >
              {{ updatingStore ? 'Guardando...' : 'Guardar cambios de tienda' }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14" id="destacados">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 px-6 py-8 text-white shadow-lg sm:px-8 sm:py-10">
        <div class="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div class="absolute -left-8 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div class="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1">
            <p class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white/90">
              <span class="inline-block h-2 w-2 rounded-full bg-white" />
              Ofertas relámpago
            </p>
            <div class="flex items-center gap-3 pt-2">
              <h3 class="text-3xl font-black leading-tight sm:text-4xl">{{ featuredTitle }}</h3>
              <button
                v-if="canEditTheme"
                class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white transition hover:-translate-y-0.5 hover:bg-white/30"
                title="Editar título y subtítulo de destacados"
                @click="openHomeCopyEditor('featured')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                  <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.512l-3.12.89a.5.5 0 0 1-.62-.62l.89-3.12a2 2 0 0 1 .512-.878l8.5-8.5Z" />
                  <path d="M12.5 4.75 15.25 7.5" />
                </svg>
              </button>
            </div>
            <p class="mt-2 text-lg font-semibold text-white/95">{{ featuredSubtitle }}</p>
          </div>
        </div>
      </div>

      <div v-if="!featuredProducts.length" class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
        <p class="font-semibold">Marca productos con la palomita de oferta destacada para mostrarlos aquí.</p>
      </div>
      <div v-else class="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard
          v-for="product in paginatedFeaturedProducts"
          :key="`featured-${product.id}`"
          :product="product"
          :accent="accentColor"
        />
      </div>

      <div v-if="featuredProducts.length > featuredPerPage" class="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-3.5 text-sm text-amber-800">
        <button
          class="rounded-lg border border-amber-300 bg-white px-4 py-2 font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-40"
          :disabled="featuredPage === 1"
          @click="featuredPage -= 1"
        >
          ← Anterior
        </button>
        <p class="font-semibold">Destacados {{ featuredPageStart }}-{{ featuredPageEnd }} de {{ featuredProducts.length }}</p>
        <button
          class="rounded-lg border border-amber-300 bg-white px-4 py-2 font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-40"
          :disabled="featuredPage === featuredTotalPages"
          @click="featuredPage += 1"
        >
          Siguiente →
        </button>
      </div>
    </section>

    <section class="relative mx-auto max-w-6xl overflow-hidden px-4 py-8 sm:px-6 sm:py-10" id="catalogo" :style="circlesDecorativeStyle">
      <div v-if="isCirclesPatternActive" class="pointer-events-none absolute -left-8 top-1/3 h-20 w-20 rounded-full" :style="circlesBubbleTwoStyle" aria-hidden="true" />
      <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="flex items-center gap-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-950"><Tags class="h-3.5 w-3.5 text-slate-900" /> Vitrina principal</p>
          <h2 class="mt-1 flex items-center gap-2 text-2xl font-extrabold text-slate-950 sm:text-3xl">
            <Sparkles class="h-6 w-6 text-slate-900" /> {{ catalogTitle }}
            <button
              v-if="canEditTheme"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-400"
                title="Editar título y subtítulo de catálogo"
              @click="openHomeCopyEditor('catalog')"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4">
                <path d="M13.586 3.586a2 2 0 0 1 2.828 2.828l-8.5 8.5a2 2 0 0 1-.878.512l-3.12.89a.5.5 0 0 1-.62-.62l.89-3.12a2 2 0 0 1 .512-.878l8.5-8.5Z" />
                <path d="M12.5 4.75 15.25 7.5" />
              </svg>
            </button>
          </h2>
          <p class="mt-1 text-sm font-semibold text-slate-800">{{ catalogSubtitle }}</p>
        </div>
        <div class="flex w-full flex-wrap items-center justify-center gap-3 text-sm md:w-auto md:justify-center">
          <label class="relative w-full min-w-[220px] sm:w-[280px] md:w-[220px]">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              v-model="catalogQuery"
              type="text"
              placeholder="Buscar producto..."
              class="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"
            />
          </label>
          <div class="flex flex-wrap items-center justify-center gap-3">
            <select
              v-model="catalogCategory"
              class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"
            >
              <option value="">Todas las categorías</option>
              <option v-for="cat in catalogCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <select
              v-model="catalogSort"
              class="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"
            >
              <option value="">Ordenar por precio</option>
              <option value="asc">Menor a mayor</option>
              <option value="desc">Mayor a menor</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="tenantStore.loading" class="mt-6 text-slate-500">Cargando productos...</div>
      <div v-else-if="!catalogRows.length" class="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        Aún no hay productos cargados en esta tienda.
      </div>
      <div v-else class="mt-6 space-y-6 md:mt-7 md:space-y-8">
        <section v-for="row in paginatedCatalogRows" :key="`row-${row.category}`" :class="catalogRowClass">
          <div class="mb-3 flex items-center justify-between">
            <h3 class="inline-flex items-center gap-2 text-lg font-extrabold text-slate-950">
              <span class="inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold" :style="categoryCountStyle">{{ row.products.length }}</span>
              {{ row.category }} · Los más buscados
            </h3>
            <span class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Línea de categoría</span>
          </div>

          <div class="space-y-4">
            <div v-for="brandGroup in row.brandGroups" :key="`brand-${row.category}-${brandGroup.brand}`" class="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <div class="mb-2 flex items-center justify-between">
                <p class="text-sm font-bold text-slate-900">{{ brandGroup.brand }}</p>
                <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{{ brandGroup.products.length }} productos</span>
              </div>

              <div class="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
                <NuxtLink
                  v-for="product in brandGroup.products"
                  :key="`mini-${row.category}-${brandGroup.brand}-${product.id}`"
                  :to="getProductPath(product)"
                  class="group min-w-[170px] max-w-[170px] snap-start overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  :style="catalogCardStyle"
                >
                  <div class="relative h-28 bg-slate-100">
                    <img :src="getProductImage(product) || '/logoPW.png'" :alt="product.name || 'Producto'" class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]" />
                    <div v-if="getDiscountPercent(product) > 0" class="absolute right-0 top-0 rounded-bl-lg bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white">
                      -{{ getDiscountPercent(product) }}%
                    </div>
                  </div>
                  <div class="space-y-1 p-2.5">
                    <p class="line-clamp-2 text-xs font-semibold leading-snug text-slate-800">{{ product.name }}</p>
                    <p class="text-base font-extrabold" :style="priceTextStyle">{{ formatCatalogPrice(getEffectivePrice(product)) }}</p>
                    <p v-if="getDiscountPercent(product) > 0" class="text-[11px] font-semibold text-slate-400 line-through">{{ formatCatalogPrice(Number(product?.price || 0)) }}</p>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div v-if="catalogRows.length > categoryRowsPerPage" class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <button
          class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"
          :disabled="catalogPage === 1"
          @click="catalogPage -= 1"
        >
          Anterior
        </button>
        <p>Categorías {{ catalogPageStart }}-{{ catalogPageEnd }} de {{ catalogRows.length }}</p>
        <button
          class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"
          :disabled="catalogPage === catalogTotalPages"
          @click="catalogPage += 1"
        >
          Siguiente
        </button>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-6 pb-14">
      <div v-if="showWhatsAppCTA" class="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-[1.1fr,0.9fr] lg:p-6">
        <div class="space-y-2">
          <p class="section-kicker">Contacto rápido</p>
          <h3 class="section-title text-3xl sm:text-4xl">Agenda tu pedido sin perder tiempo</h3>
          <p class="max-w-2xl text-sm text-slate-600">Usa WhatsApp para reservas, retiros en local o pedidos con coordinación directa. También puedes revisar la carta desde el menú de la tienda.</p>
          <div class="flex flex-wrap gap-3 pt-2">
            <a
              v-if="hasStoreWhatsApp"
              :href="storeWhatsAppUrl"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
              :style="accentStyle"
            >
              Agendar por WhatsApp
            </a>
            <button
              v-if="hasMenuPages"
              class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
              @click="openMenuPanel"
            >
              Ver menú
            </button>
          </div>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <article class="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">WhatsApp</p>
            <p class="mt-2 text-lg font-bold text-emerald-900">{{ storeWhatsAppDisplay }}</p>
            <p class="text-xs text-emerald-700/80">Atención para agendar pedidos y resolver dudas.</p>
          </article>
          <article class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Menú</p>
            <p class="mt-2 text-lg font-bold text-slate-900">{{ menuPageCount }} página{{ menuPageCount === 1 ? '' : 's' }}</p>
            <p class="text-xs text-slate-600">Se abre como panel dentro de la misma página.</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ProductCard from '~/components/ProductCard.vue'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { CheckCircle2, Facebook, Flame, Instagram, Music2, Palette, Phone, Search, Share2, Sparkles, Store, Tags, Youtube, Zap } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { definePageMeta } from '#imports'
import { useRuntimeConfig } from 'nuxt/app'
import { useTenantStore } from '~/stores/tenant'
import { useCartStore } from '~/stores/cart'
import { useThemeStore } from '~/stores/theme'
import { useImages } from '~/composables/useImages'
import { useAuthStore } from '~/stores/auth'
import { getCatalogCategorySeedsByStoreType } from '~/constants/catalogCategorySeeds'

definePageMeta({ layout: 'store', middleware: ['tenant'] })

const route = useRoute()
const router = useRouter()
const slug = computed(() => route.params.slug as string)

const tenantStore = useTenantStore()
const cart = useCartStore()
const theme = useThemeStore()
const auth = useAuthStore()
const { getProductImage } = useImages()
const config = useRuntimeConfig()

type StoreCategory = string | { name: string; slug: string }
type BranchDraft = {
  label: string
  street: string
  number: string
  comuna: string
  region: string
}

const makeEmptyBranch = (): BranchDraft => ({
  label: '',
  street: '',
  number: '',
  comuna: '',
  region: '',
})

const storeForm = reactive({
  name: '',
  slug: '',
  store_type: 'retail',
  home_hero_title: '',
  home_hero_subtitle: '',
  home_featured_title: '',
  home_featured_subtitle: '',
  home_catalog_title: '',
  home_catalog_subtitle: '',
  hero_pattern_enabled: true,
  hero_pattern_style: 'type',
  logo_url: '',
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
  branch_locations: [makeEmptyBranch()] as BranchDraft[],
  delivery_fee_mode: 'at_dispatch',
  shipping_base_fee: '',
  shipping_per_item_fee: '',
  shipping_free_over: '',
  pickup_skip_queue_enabled: true,
  cart_enabled: true,
  whatsapp_sales_enabled: true,
  pickup_instructions: '',
  menu_file_url: '',
  menu_file_kind: '',
  menu_cover_image_url: '',
  menu_pages: [] as Array<{ id: string; url: string; label?: string }>,
  extra_size_large_price: '',
  extra_fries_medium_price: '',
  extra_fries_large_price: '',
  extra_drink_price: '',
  extra_sauce_price: '',
  social_instagram: '',
  social_facebook: '',
  social_tiktok: '',
  social_youtube: '',
})
const themeForm = reactive({ accent_color: '', gradient_from: '', gradient_to: '', banner_url: '' })
const pendingTheme = reactive({ accent_color: '', gradient_from: '', gradient_to: '', banner_url: '' })
const customAccent = ref('#2563eb')
watch(customAccent, (value) => {
  const next = normalizedColor(value, pendingTheme.accent_color || '#2563eb')
  pendingTheme.accent_color = next
  themeForm.accent_color = next
})
const showStoreForm = ref(false)
const showHomeCopyForm = ref(false)
const homeCopyFocus = ref<'hero' | 'featured' | 'catalog'>('hero')
const savingHomeCopy = ref(false)
const homeCopyStatus = ref<'ok' | 'error'>('ok')
const homeCopyMessage = ref('')
const homeCopyEditorTitle = computed(() => {
  if (homeCopyFocus.value === 'featured') return 'Editar destacados'
  if (homeCopyFocus.value === 'catalog') return 'Editar catálogo'
  return 'Editar portada principal'
})
const homeCopyEditorDescription = computed(() => {
  if (homeCopyFocus.value === 'featured') return 'Modifica el título y subtítulo de la sección de destacados.'
  if (homeCopyFocus.value === 'catalog') return 'Modifica el título y subtítulo de la sección de catálogo.'
  return 'Modifica el título y subtítulo principales del hero de la tienda.'
})
const addBranchLocation = () => {
  storeForm.branch_locations.push(makeEmptyBranch())
}

const removeBranchLocation = (index: number) => {
  storeForm.branch_locations.splice(index, 1)
  if (!storeForm.branch_locations.length) {
    storeForm.branch_locations.push(makeEmptyBranch())
  }
}

const activeEditTab = ref<'general' | 'design' | 'about' | 'contact' | 'account'>('general')
const updatingStore = ref(false)
const syncingCategories = ref(false)
const updateMessage = ref('')
const updateStatus = ref<'ok' | 'error'>('ok')
const savingPayout = ref(false)
const payoutStatus = ref<'ok' | 'error'>('ok')
const payoutMessage = ref('')
const payoutConfigured = ref(false)
const payoutVerificationStatus = ref<'pending' | 'verified' | 'rejected' | ''>('')
const payoutAvailableMethods = ref<any[]>([])
const payoutForm = reactive({
  payout_method_id: 0,
  provider: 'paypal',
  account_email: '',
  account_holder_name: '',
  account_number_last4: '',
  bank_name: '',
  account_type: '',
})
type QuickMediaType = 'image' | 'video'
type QuickMediaItem = { id: string; type: QuickMediaType; url: string }
const quickMediaItems = ref<QuickMediaItem[]>([])
const quickMediaDraft = ref<QuickMediaItem[]>([])
const activeQuickMediaIndex = ref(0)
const quickMediaInterval = ref<ReturnType<typeof setInterval> | null>(null)
const quickMediaPicker = ref<HTMLInputElement | null>(null)
const menuPanelOpen = ref(false)
const activeMenuPageIndex = ref(0)
const showQuickMediaMenu = ref(false)
const shouldAutoOpen = computed(() => {
  const edit = route.query.edit
  return edit === 'true' || edit === '1' || edit === 'yes'
})
const hasText = (value?: string) => String(value || '').trim().length > 0
const normalizeMenuPages = (value: any) => {
  const pages = Array.isArray(value) ? value : []
  const sanitized = pages
    .filter((page: any) => page?.url)
    .slice(0, 12)
    .map((page: any, index: number) => ({
      id: String(page?.id || `${Date.now()}-${index}`),
      url: String(page.url),
      label: String(page?.label || ''),
    }))
  if (sanitized.length) return sanitized
  if ((tenantStore.data as any)?.menu_file_url) {
    return [{ id: 'legacy-menu', url: String((tenantStore.data as any)?.menu_file_url), label: 'Carta principal' }]
  }
  return []
}
const menuPages = computed(() => normalizeMenuPages((tenantStore.data as any)?.menu_pages))
const hasMenuPages = computed(() => menuPages.value.length > 0)
const menuPageCount = computed(() => menuPages.value.length)
const storeWhatsAppRaw = computed(() => String((tenantStore.data as any)?.whatsapp || (tenantStore.data as any)?.phone || '').trim())
const storeWhatsAppDigits = computed(() => storeWhatsAppRaw.value.replace(/[^\d]/g, ''))
const hasStoreWhatsApp = computed(() => storeWhatsAppDigits.value.length > 0)
const showWhatsAppCTA = computed(() => {
  const enabled = (tenantStore.data as any)?.whatsapp_sales_enabled
  const hasToggle = enabled === undefined || enabled === null ? true : Boolean(enabled)
  return hasToggle && hasStoreWhatsApp.value
})
const storeWhatsAppDisplay = computed(() => storeWhatsAppRaw.value || 'No configurado')
const storeWhatsAppUrl = computed(() => {
  if (!hasStoreWhatsApp.value) return '#'
  const storeName = String((tenantStore.data as any)?.name || 'la tienda')
  const msg = encodeURIComponent(`Hola, quiero agendar un pedido en ${storeName}.`)
  return `https://wa.me/${storeWhatsAppDigits.value}?text=${msg}`
})
const hasAnyBranchData = computed(() =>
  storeForm.branch_locations.some((branch) =>
    [branch.street, branch.number, branch.comuna, branch.region].some((value) => hasText(value))
  )
)
const payoutProviderLabel = computed(() => {
  const provider = String(payoutForm.provider || '').toLowerCase()
  if (provider === 'paypal') return 'PayPal'
  if (provider === 'card') return 'Webpay / Tarjeta'
  if (provider === 'bank_transfer') return 'Transferencia'
  return 'Sin definir'
})
const payoutStatusLabel = computed(() => {
  if (!payoutConfigured.value) return 'Sin configurar'
  if (payoutVerificationStatus.value === 'verified') return 'Verificada'
  if (payoutVerificationStatus.value === 'rejected') return 'Rechazada'
  return 'Pendiente de verificación'
})
const payoutStatusPillClass = computed(() => {
  if (!payoutConfigured.value) return 'bg-slate-100 text-slate-700'
  if (payoutVerificationStatus.value === 'verified') return 'bg-emerald-100 text-emerald-700'
  if (payoutVerificationStatus.value === 'rejected') return 'bg-rose-100 text-rose-700'
  return 'bg-amber-100 text-amber-700'
})

const parseAboutSections = (raw: string) => {
  const text = String(raw || '').trim()
  if (!text) {
    return {
      who: '',
      history: '',
      mission: '',
      extra: '',
    }
  }

  const sections = {
    who: '',
    history: '',
    mission: '',
    extra: '',
  }

  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/^##\s*Quiénes\s+somos\s*$/im, '##QUIENES')
    .replace(/^##\s*Nuestra\s+historia\s*$/im, '##HISTORIA')
    .replace(/^##\s*Misión\s+y\s+visión\s*$/im, '##MISION')
  const chunks = normalized.split(/##(QUIENES|HISTORIA|MISION)\n?/)

  if (chunks.length === 1) {
    sections.who = text
    return sections
  }

  for (let i = 1; i < chunks.length; i += 2) {
    const key = chunks[i]
    const value = String(chunks[i + 1] || '').trim()
    if (key === 'QUIENES') sections.who = value
    if (key === 'HISTORIA') sections.history = value
    if (key === 'MISION') sections.mission = value
  }

  return sections
}

const buildAboutNarrative = () => {
  const parts = [
    hasText(storeForm.about_who_we_are) ? `## Quiénes somos\n${storeForm.about_who_we_are.trim()}` : '',
    hasText(storeForm.about_history) ? `## Nuestra historia\n${storeForm.about_history.trim()}` : '',
    hasText(storeForm.about_mission) ? `## Misión y visión\n${storeForm.about_mission.trim()}` : '',
    hasText(storeForm.about_extra) ? storeForm.about_extra.trim() : '',
  ].filter(Boolean)

  if (parts.length) return parts.join('\n\n')
  return String(storeForm.about || '').trim()
}
const tabCompletion = computed(() => {
  const generalDone = [
    hasText(storeForm.name),
    hasText(storeForm.slug),
    hasText(storeForm.store_type),
    hasText(storeForm.description),
    hasText(storeForm.logo_url),
  ].filter(Boolean).length
  const aboutDone = [
    hasText(storeForm.about_who_we_are),
    hasText(storeForm.about_history),
    hasText(storeForm.about_mission),
    hasAnyBranchData.value,
  ].filter(Boolean).length
  const designDone = [
    hasText(storeForm.hero_pattern_style),
    hasText(pendingTheme.banner_url),
    hasText(pendingTheme.accent_color),
    hasText(pendingTheme.gradient_from),
    hasText(pendingTheme.gradient_to),
    quickMediaDraft.value.length > 0,
    storeForm.menu_pages.length > 0 || hasText(storeForm.menu_file_url),
  ].filter(Boolean).length
  const contactDone = [
    hasText(storeForm.contact_email),
    hasText(storeForm.phone),
    hasText(storeForm.whatsapp),
    hasText(storeForm.address),
    hasText(storeForm.social_instagram),
    hasText(storeForm.social_facebook),
    hasText(storeForm.social_tiktok),
    hasText(storeForm.social_youtube),
  ].filter(Boolean).length
  const accountDone = [
    hasText(payoutForm.provider),
    payoutForm.provider === 'paypal' ? hasText(payoutForm.account_email) : hasText(payoutForm.account_number_last4),
    hasText(payoutForm.account_holder_name),
  ].filter(Boolean).length
  return {
    general: {
      label: `${generalDone}/5`,
      completed: generalDone === 5,
    },
    about: {
      label: `${aboutDone}/4`,
      completed: aboutDone === 4,
    },
    design: {
      label: `${designDone}/7`,
      completed: designDone === 7,
    },
    contact: {
      label: `${contactDone}/8`,
      completed: contactDone === 8,
    },
    account: {
      label: `${accountDone}/3`,
      completed: accountDone === 3,
    },
  }
})

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

const applyPayoutAccount = (account: any) => {
  payoutForm.payout_method_id = Number(account?.payout_method?.id || 0)
  payoutForm.provider = String(account?.provider || 'paypal')
  payoutForm.account_email = String(account?.account_email || '')
  payoutForm.account_holder_name = String(account?.account_holder_name || '')
  payoutForm.account_number_last4 = String(account?.account_number_last4 || '')
  payoutForm.bank_name = String(account?.bank_name || '')
  payoutForm.account_type = String(account?.account_type || '')
  payoutVerificationStatus.value = String(account?.verification_status || '') as any
}

const onSelectSavedPayoutMethod = () => {
  const method = payoutAvailableMethods.value.find((m) => Number(m.id) === Number(payoutForm.payout_method_id))
  if (!method) return
  payoutForm.provider = String(method.provider || 'paypal')
  payoutForm.account_email = String(method.account_email || '')
  payoutForm.account_holder_name = String(method.account_holder_name || '')
  payoutForm.account_number_last4 = String(method.card_last4 || '')
  payoutForm.bank_name = ''
  payoutForm.account_type = ''
}

const loadPayoutAccountForStore = async () => {
  if (!canEditTheme.value || !auth.token) return
  try {
    const data = await authedFetch<any>(`${config.public.apiBase}/store/${slug.value}/admin/payments/payout-account/`)
    payoutConfigured.value = Boolean(data?.configured)
    payoutAvailableMethods.value = Array.isArray(data?.available_methods) ? data.available_methods : []
    if (payoutConfigured.value) {
      applyPayoutAccount(data?.account || {})
    } else {
      applyPayoutAccount({ provider: 'paypal' })
    }
  } catch {
    payoutConfigured.value = false
  }
}

const savePayoutAccountFromStore = async () => {
  if (!canEditTheme.value || !auth.token || savingPayout.value) return
  savingPayout.value = true
  payoutMessage.value = ''
  try {
    const payload = {
      payout_method_id: Number(payoutForm.payout_method_id) || null,
      provider: payoutForm.provider,
      account_email: payoutForm.account_email,
      account_holder_name: payoutForm.account_holder_name,
      account_number_last4: payoutForm.account_number_last4,
      bank_name: payoutForm.bank_name,
      account_type: payoutForm.account_type,
    }

    const data = await authedFetch<any>(`${config.public.apiBase}/store/${slug.value}/admin/payments/payout-account/`, {
      method: 'PATCH',
      body: payload,
    })

    payoutConfigured.value = true
    applyPayoutAccount(data?.account || payload)
    payoutStatus.value = 'ok'
    payoutMessage.value = data?.message || 'Cuenta receptora guardada.'
    await tenantStore.fetchTienda()
    if (import.meta.client) {
      localStorage.setItem(
        'store-payment-policy-updated',
        JSON.stringify({ slug: slug.value, at: Date.now() })
      )
    }
  } catch (error: any) {
    payoutStatus.value = 'error'
    payoutMessage.value = error?.response?._data?.detail || 'No pudimos guardar la cuenta receptora.'
  } finally {
    savingPayout.value = false
  }
}

const verifyPayoutAccountFromStore = async (action: 'verify' | 'reject') => {
  if (!canEditTheme.value || !auth.token || savingPayout.value || !payoutConfigured.value) return
  let note = ''
  if (action === 'reject') {
    note = window.prompt('Motivo de rechazo (obligatorio):', '')?.trim() || ''
    if (!note) {
      payoutStatus.value = 'error'
      payoutMessage.value = 'Debes indicar un motivo para rechazar.'
      return
    }
  } else {
    note = window.prompt('Nota opcional de verificación:', '')?.trim() || ''
  }

  savingPayout.value = true
  payoutMessage.value = ''
  try {
    const data = await authedFetch<any>(`${config.public.apiBase}/store/${slug.value}/admin/payments/payout-account/verify/`, {
      method: 'POST',
      body: { action, note },
    })

    payoutConfigured.value = true
    applyPayoutAccount(data?.account || {})
    payoutStatus.value = 'ok'
    payoutMessage.value = data?.message || 'Estado de cuenta receptora actualizado.'
    await tenantStore.fetchTienda()
    if (import.meta.client) {
      localStorage.setItem(
        'store-payment-policy-updated',
        JSON.stringify({ slug: slug.value, at: Date.now() })
      )
    }
  } catch (error: any) {
    payoutStatus.value = 'error'
    payoutMessage.value = error?.response?._data?.detail || 'No se pudo actualizar la verificación de la cuenta.'
  } finally {
    savingPayout.value = false
  }
}

const palette = [
  '#2563eb', // azul
  '#16a34a', // verde
  '#f59e0b', // ámbar
  '#e11d48', // rosa/rojo
  '#7c3aed', // violeta
  '#0ea5e9', // celeste
  '#f97316', // naranjo
  '#10b981', // esmeralda
  '#9333ea', // púrpura profundo
  '#0d9488', // teal oscuro
  '#64748b', // slate
  '#111827', // negro grafito
]
const gradients = [
  { from: '#0f172a', to: '#0b2358' },
  { from: '#0b3b2e', to: '#0f766e' },
  { from: '#2b0b3f', to: '#7c3aed' },
  { from: '#3b0a1a', to: '#e11d48' },
  { from: '#1d4ed8', to: '#06b6d4' },
  { from: '#15803d', to: '#84cc16' },
  { from: '#c2410c', to: '#f97316' },
  { from: '#7c2d12', to: '#f59e0b' },
  { from: '#312e81', to: '#9333ea' },
]
const patternOptions = [
  { value: 'type', label: 'Según tipo de tienda' },
  { value: 'diagonal', label: 'Barritas diagonales' },
  { value: 'vertical', label: 'Barritas verticales' },
  { value: 'circles', label: 'Círculos' },
  { value: 'waves', label: 'Ondas' },
  { value: 'fine_grid', label: 'Rejilla fina' },
  { value: 'small_dots', label: 'Puntos pequeños' },
  { value: 'zigzag', label: 'Zigzag' },
  { value: 'soft_noise', label: 'Noise suave' },
  { value: 'double_diagonal', label: 'Doble diagonal' },
  { value: 'none', label: 'Sin patrón (color sólido)' },
]

const isHexColor = (value?: string) => /^#[0-9a-fA-F]{6}$/.test(String(value || ''))
const normalizedColor = (value?: string, fallback = '#2563eb') => (isHexColor(value) ? String(value) : fallback)
const hexToRgba = (hex: string, alpha: number) => {
  const safe = normalizedColor(hex)
  const clean = safe.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const previewAccent = computed(() => normalizedColor(pendingTheme.accent_color || themeForm.accent_color || theme.accent, '#2563eb'))
const previewGradientFrom = computed(() => normalizedColor(pendingTheme.gradient_from || themeForm.gradient_from || theme.gradientFrom, '#111827'))
const previewGradientTo = computed(() => normalizedColor(pendingTheme.gradient_to || themeForm.gradient_to || theme.gradientTo, '#0b2358'))
const accentColor = computed(() => (showStoreForm.value ? previewAccent.value : theme.accent || '#2563eb'))
const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: '#fff' }))
const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})
const storeType = computed(() => String((tenantStore.data as any)?.store_type || storeForm.store_type || 'retail'))

const hasMenuSupport = computed(() => {
  return ['fast_food', 'bakery'].includes(storeType.value)
})

const typeContent = computed(() => {
  const byType: Record<string, {
    featuredTitle: string
    featuredSubtitle: string
    catalogTitle: string
    catalogSubtitle: string
    rowClass: string
    shellClass: string
    heroClass: string
    heroPattern: string
    heroBadgeLabel: string
    heroBadgeClass: string
    primaryCtaLabel: string
    secondaryCtaLabel: string
    chipOne: string
    chipTwo: string
    quickGlowClass: string
    quickPanelClass: string
  }> = {
    retail: {
      featuredTitle: 'Ofertas relámpago: precios que vuelan',
      featuredSubtitle: 'Selección curada para comprar rápido, ahorrar más y llevarte lo mejor hoy.',
      catalogTitle: 'Compra por categoría como en una tienda grande',
      catalogSubtitle: 'Navega por líneas especializadas y descubre productos ganadores en cada sección.',
      rowClass: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
      shellClass: 'bg-slate-50',
      heroClass: '',
      heroPattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.13), transparent 42%)',
      heroBadgeLabel: 'Retail en vivo',
      heroBadgeClass: 'border-white/20 bg-white/10 text-white',
      primaryCtaLabel: 'Ver catálogo',
      secondaryCtaLabel: 'Ofertas y destacados',
      chipOne: 'Pago seguro',
      chipTwo: 'Envíos rápidos',
      quickGlowClass: 'bg-white/10',
      quickPanelClass: 'border-white/15 bg-white/10',
    },
    fast_food: {
      featuredTitle: 'Combos calientes listos para pedir',
      featuredSubtitle: 'Prioriza tiempos de despacho y productos de alta rotación por franja horaria.',
      catalogTitle: 'Arma tu pedido por secciones del menú',
      catalogSubtitle: 'Desde hamburguesas y papas hasta bebidas, todo ordenado para comprar en segundos.',
      rowClass: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
      shellClass: 'bg-slate-50',
      heroClass: 'from-[#2b1200] to-[#7a2f00]',
      heroPattern: 'repeating-linear-gradient(135deg, rgba(255,158,27,0.16) 0px, rgba(255,158,27,0.16) 10px, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 20px)',
      heroBadgeLabel: 'Comida rápida',
      heroBadgeClass: 'border-amber-200/40 bg-amber-200/20 text-amber-100',
      primaryCtaLabel: 'Ver menú',
      secondaryCtaLabel: 'Combos y promos',
      chipOne: 'Despacho express',
      chipTwo: 'Combos del día',
      quickGlowClass: 'bg-amber-300/20',
      quickPanelClass: 'border-amber-100/35 bg-black/20',
    },
    bakery: {
      featuredTitle: 'Lo recién horneado de hoy',
      featuredSubtitle: 'Destaca productos frescos del día y promociones por hora para subir conversiones.',
      catalogTitle: 'Vitrina dulce por especialidad',
      catalogSubtitle: 'Tortas, pasteles, galletas y más, agrupados para una experiencia pastelera clara.',
      rowClass: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
      shellClass: 'bg-slate-50',
      heroClass: 'from-[#3d1020] to-[#7a2d48]',
      heroPattern: 'radial-gradient(circle at 25% 25%, rgba(255,201,217,0.22), transparent 36%), radial-gradient(circle at 80% 55%, rgba(255,235,205,0.18), transparent 44%)',
      heroBadgeLabel: 'Pastelería artesanal',
      heroBadgeClass: 'border-rose-200/40 bg-rose-200/20 text-rose-100',
      primaryCtaLabel: 'Ver vitrina dulce',
      secondaryCtaLabel: 'Novedades del horno',
      chipOne: 'Recién horneado',
      chipTwo: 'Pedidos por encargo',
      quickGlowClass: 'bg-rose-300/20',
      quickPanelClass: 'border-rose-100/30 bg-black/20',
    },
    pharmacy: {
      featuredTitle: 'Promociones clave para tu bienestar',
      featuredSubtitle: 'Exhibe productos esenciales y campañas estacionales con prioridad.',
      catalogTitle: 'Encuentra por categoría de cuidado',
      catalogSubtitle: 'Higiene, vitaminas, cuidado personal y más en una navegación simple y rápida.',
      rowClass: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
      shellClass: 'bg-slate-50',
      heroClass: 'from-[#052a34] to-[#0b5f73]',
      heroPattern: 'linear-gradient(90deg, rgba(179,241,255,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(179,241,255,0.08) 1px, transparent 1px)',
      heroBadgeLabel: 'Farmacia y bienestar',
      heroBadgeClass: 'border-cyan-200/40 bg-cyan-200/20 text-cyan-100',
      primaryCtaLabel: 'Ver categorías de salud',
      secondaryCtaLabel: 'Promos esenciales',
      chipOne: 'Compra segura',
      chipTwo: 'Entrega prioritaria',
      quickGlowClass: 'bg-cyan-300/20',
      quickPanelClass: 'border-cyan-100/30 bg-black/20',
    },
    fashion: {
      featuredTitle: 'Looks destacados de la temporada',
      featuredSubtitle: 'Impulsa colecciones y novedades con foco visual orientado a estilo.',
      catalogTitle: 'Compra por línea y marca',
      catalogSubtitle: 'Ropa, calzado y accesorios en bloques visuales inspirados en catálogos de moda.',
      rowClass: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
      shellClass: 'bg-slate-50',
      heroClass: 'from-[#1d1029] to-[#5b2d84]',
      heroPattern: 'radial-gradient(circle at 15% 30%, rgba(248,208,255,0.18), transparent 35%), repeating-linear-gradient(120deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 6px, transparent 6px, transparent 16px)',
      heroBadgeLabel: 'Moda y tendencia',
      heroBadgeClass: 'border-fuchsia-200/40 bg-fuchsia-200/20 text-fuchsia-100',
      primaryCtaLabel: 'Ver colección',
      secondaryCtaLabel: 'Looks destacados',
      chipOne: 'Nuevos ingresos',
      chipTwo: 'Drops semanales',
      quickGlowClass: 'bg-fuchsia-300/20',
      quickPanelClass: 'border-fuchsia-100/30 bg-black/20',
    },
    bookstore: {
      featuredTitle: 'Recomendados que no te puedes perder',
      featuredSubtitle: 'Destaca novedades, best sellers y packs para aumentar ticket promedio.',
      catalogTitle: 'Explora por género y editorial',
      catalogSubtitle: 'Una estantería digital ordenada para descubrir lecturas rápido.',
      rowClass: 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm',
      shellClass: 'bg-slate-50',
      heroClass: 'from-[#161b3b] to-[#2d3f8a]',
      heroPattern: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 18px)',
      heroBadgeLabel: 'Librería digital',
      heroBadgeClass: 'border-indigo-200/40 bg-indigo-200/20 text-indigo-100',
      primaryCtaLabel: 'Explorar estantería',
      secondaryCtaLabel: 'Recomendados',
      chipOne: 'Curado por género',
      chipTwo: 'Novedades editoriales',
      quickGlowClass: 'bg-indigo-300/20',
      quickPanelClass: 'border-indigo-100/30 bg-black/20',
    },
  }
  return byType[storeType.value] || byType.retail
})
const storeHomeCopy = computed(() => {
  const raw = (tenantStore.data as any)?.home_copy
  if (!raw || typeof raw !== 'object') return {}
  return raw as Record<string, string>
})
const heroTitle = computed(() => {
  const custom = String(storeHomeCopy.value.hero_title || '').trim()
  return custom || tenantStore.data?.name || 'Tu tienda online'
})
const heroDescription = computed(() => {
  const custom = String(storeHomeCopy.value.hero_subtitle || '').trim()
  if (custom) return custom
  return (
    tenantStore.data?.description ||
    'Explora un catálogo curado con envíos rápidos y una experiencia pensada para conversión. Personaliza el acento visual para alinear la tienda a tu marca.'
  )
})
const featuredTitle = computed(() => {
  const custom = String(storeHomeCopy.value.featured_title || '').trim()
  return custom || typeContent.value?.featuredTitle || 'Productos destacados'
})
const featuredSubtitle = computed(() => {
  const custom = String(storeHomeCopy.value.featured_subtitle || '').trim()
  return custom || typeContent.value?.featuredSubtitle || 'Muestra lo mejor de tu tienda.'
})
const catalogTitle = computed(() => {
  const custom = String(storeHomeCopy.value.catalog_title || '').trim()
  return custom || typeContent.value?.catalogTitle || 'Catálogo'
})
const catalogSubtitle = computed(() => {
  const custom = String(storeHomeCopy.value.catalog_subtitle || '').trim()
  return custom || typeContent.value?.catalogSubtitle || 'Explora productos por categoría.'
})
const catalogRowClass = computed(() => typeContent.value?.rowClass || 'rounded-2xl border border-slate-200 bg-white p-4 shadow-sm')
const pageShellClass = computed(() => typeContent.value?.shellClass || 'bg-slate-50')
const defaultPatternByType = computed(() => typeContent.value?.heroPattern || 'none')
const customPatternMap: Record<string, string> = {
  diagonal: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 10px, rgba(0,0,0,0) 10px, rgba(0,0,0,0) 20px)',
  vertical: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.14) 0px, rgba(255,255,255,0.14) 8px, rgba(0,0,0,0) 8px, rgba(0,0,0,0) 16px)',
  circles: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.16), transparent 38%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.12), transparent 42%)',
  waves: 'radial-gradient(120% 90% at 0% 100%, rgba(255,255,255,0.14) 0 36%, transparent 37%), radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,0.10) 0 34%, transparent 35%)',
  fine_grid: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
  small_dots: 'radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px)',
  zigzag: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.15) 0 8px, transparent 8px 16px), repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0 8px, transparent 8px 16px)',
  soft_noise: 'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.08), transparent 20%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.06), transparent 22%), radial-gradient(circle at 35% 75%, rgba(255,255,255,0.07), transparent 18%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.05), transparent 20%)',
  double_diagonal: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.14) 0 10px, transparent 10px 20px), repeating-linear-gradient(45deg, rgba(255,255,255,0.12) 0 10px, transparent 10px 20px)',
}
const selectedPatternStyle = computed(() => {
  const raw = showStoreForm.value
    ? String(storeForm.hero_pattern_style || 'type')
    : String((tenantStore.data as any)?.hero_pattern_style || 'type')
  if (raw === 'none') return 'none'
  if (raw === 'type') return defaultPatternByType.value
  return customPatternMap[raw] || defaultPatternByType.value
})
const selectedPatternKey = computed(() => {
  const raw = showStoreForm.value
    ? String(storeForm.hero_pattern_style || 'type')
    : String((tenantStore.data as any)?.hero_pattern_style || 'type')
  if (raw !== 'type') return raw
  return storeType.value === 'bakery' ? 'circles' : 'type'
})
const isCirclesPatternActive = computed(() => heroPatternEnabled.value && selectedPatternKey.value === 'circles')
const heroPatternStyle = computed(() => ({ backgroundImage: heroPatternEnabled.value ? selectedPatternStyle.value : 'none' }))
const heroBadgeLabel = computed(() => typeContent.value?.heroBadgeLabel || 'Tienda online')
const primaryCtaLabel = computed(() => typeContent.value?.primaryCtaLabel || 'Ver catálogo')
const secondaryCtaLabel = computed(() => typeContent.value?.secondaryCtaLabel || 'Destacados')
const chipOne = computed(() => typeContent.value?.chipOne || 'Promociones')
const chipTwo = computed(() => typeContent.value?.chipTwo || 'Compra rápida')
const pageShellStyle = computed(() => ({
  backgroundImage: `radial-gradient(circle at 15% 0%, ${hexToRgba(accentColor.value, 0.08)}, transparent 42%)`,
}))
const heroPatternEnabled = computed(() => {
  if (showStoreForm.value) return String(storeForm.hero_pattern_style || 'type') !== 'none'
  return (tenantStore.data as any)?.hero_pattern_enabled ?? true
})
const heroSectionStyle = computed(() => ({
  backgroundImage: `linear-gradient(120deg, ${showStoreForm.value ? previewGradientFrom.value : theme.gradientFrom}, ${showStoreForm.value ? previewGradientTo.value : theme.gradientTo})`,
}))
const heroBadgeStyle = computed(() => ({
  borderColor: hexToRgba(accentColor.value, 0.5),
  backgroundColor: hexToRgba(accentColor.value, 0.22),
  color: '#ffffff',
}))
const quickGlowStyle = computed(() => ({
  backgroundColor: hexToRgba(accentColor.value, 0.24),
}))
const quickPanelStyle = computed(() => ({
  borderColor: hexToRgba(accentColor.value, 0.35),
  backgroundColor: 'rgba(255,255,255,0.12)',
}))
const priceTextStyle = computed(() => ({ color: accentColor.value }))
const categoryCountStyle = computed(() => ({ backgroundColor: `${accentColor.value}22`, color: accentColor.value }))
const catalogCardStyle = computed(() => ({ borderColor: `${accentColor.value}33` }))
const circlesDecorativeStyle = computed(() => {
  if (!isCirclesPatternActive.value) return {}
  return {
    backgroundImage: `radial-gradient(circle at 8% 12%, ${hexToRgba(accentColor.value, 0.1)}, transparent 35%), radial-gradient(circle at 92% 85%, ${hexToRgba(accentColor.value, 0.08)}, transparent 28%)`,
  }
})
const circlesBubbleOneStyle = computed(() => ({
  backgroundColor: hexToRgba(accentColor.value, 0.14),
  border: `2px solid ${hexToRgba(accentColor.value, 0.3)}`,
}))
const circlesBubbleTwoStyle = computed(() => ({
  backgroundColor: hexToRgba(accentColor.value, 0.1),
  border: `2px dashed ${hexToRgba(accentColor.value, 0.28)}`,
}))
const heroBackgroundStyle = computed(() => {
  const banner = (tenantStore.data as any)?.banner_url || ''
  if (!banner) return {}
  return {
    backgroundImage: `linear-gradient(${hexToRgba(showStoreForm.value ? previewGradientFrom.value : theme.gradientFrom, 0.68)}, ${hexToRgba(showStoreForm.value ? previewGradientTo.value : theme.gradientTo, 0.72)}), url(${banner})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
})
const categoryKey = (category: StoreCategory) => (typeof category === 'string' ? category : category.slug)
const categoryLabel = (category: StoreCategory) => (typeof category === 'string' ? category : category.name)
const openHomeCopyEditor = (focus: 'hero' | 'featured' | 'catalog' = 'hero') => {
  if (!canEditTheme.value) return
  homeCopyFocus.value = focus
  homeCopyMessage.value = ''
  showHomeCopyForm.value = true
  nextTick(() => {
    if (focus === 'featured') {
      document.getElementById('quick-home-featured-title')?.focus()
      return
    }
    if (focus === 'catalog') {
      document.getElementById('quick-home-catalog-title')?.focus()
      return
    }
    document.getElementById('quick-home-hero-title')?.focus()
  })
}
const canEditTheme = computed(() => {
  const membershipRaw = (auth.user as any)?.memberships
  const membership = Array.isArray(membershipRaw) ? membershipRaw : []
  const ownsStore = membership.some((m: any) => {
    const rolesRaw = m?.roles
    const roles = Array.isArray(rolesRaw) ? rolesRaw : []
    const storeSlug = m?.store?.slug
    const current = slug.value
    return storeSlug?.toString().toLowerCase() === current?.toString().toLowerCase() &&
      roles.map((r: string) => r?.toLowerCase?.()).some((r: string) => ['admin', 'owner', 'manager'].includes(r))
  })
  return ownsStore
})

const safeProducts = computed(() => Array.isArray(tenantStore.productos) ? tenantStore.productos : [])

const featuredProducts = computed(() => {
  const all = safeProducts.value
  return all.filter((p: any) => Boolean(p?.is_featured))
})

const previewProducts = computed(() => safeProducts.value.slice(0, 2))
const quickSlideCount = computed(() => 1 + quickMediaItems.value.length)
const isProductsSlide = computed(() => activeQuickMediaIndex.value === 0)
const activeQuickMedia = computed(() => {
  if (isProductsSlide.value) return null
  return quickMediaItems.value[activeQuickMediaIndex.value - 1] || null
})

const catalogCategories = computed(() => {
  const names = new Set<string>()
  safeProducts.value.forEach((p: any) => {
    const name = p?.category?.name || p?.category
    if (name) names.add(name)
  })
  return Array.from(names).sort((a, b) => a.localeCompare(b))
})

const catalogCategory = ref('')
const catalogQuery = ref('')
const catalogSort = ref('')
const catalogPage = ref(1)
const categoryRowsPerPage = 4
const featuredPage = ref(1)
const featuredPerPage = 6

const filteredCatalog = computed(() => {
  let data = safeProducts.value
  const query = catalogQuery.value.trim().toLowerCase()
  if (query) {
    data = data.filter((p: any) => {
      const name = String(p?.name || '').toLowerCase()
      const description = String(p?.description || '').toLowerCase()
      const category = String(p?.category?.name || p?.category || '').toLowerCase()
      return name.includes(query) || description.includes(query) || category.includes(query)
    })
  }
  if (catalogCategory.value) {
    data = data.filter((p: any) => (p?.category?.name || p?.category) === catalogCategory.value)
  }
  if (catalogSort.value) {
    data = [...data].sort((a: any, b: any) => {
      if (catalogSort.value === 'az') {
        return String(a?.name || '').localeCompare(String(b?.name || ''))
      }
      if (catalogSort.value === 'za') {
        return String(b?.name || '').localeCompare(String(a?.name || ''))
      }
      const pa = Number(a?.offer_price || a?.price || 0)
      const pb = Number(b?.offer_price || b?.price || 0)
      return catalogSort.value === 'asc' ? pa - pb : pb - pa
    })
  }
  return data
})

const catalogRows = computed(() => {
  const grouped = new Map<string, any[]>()
  filteredCatalog.value.forEach((product: any) => {
    const category = String(product?.category?.name || product?.category || 'General')
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category)!.push(product)
  })
  return Array.from(grouped.entries())
    .map(([category, products]) => {
      const byBrand = new Map<string, any[]>()
      products.forEach((product: any) => {
        const brand = String(product?.brand || 'Otras marcas').trim() || 'Otras marcas'
        if (!byBrand.has(brand)) byBrand.set(brand, [])
        byBrand.get(brand)!.push(product)
      })
      const brandGroups = Array.from(byBrand.entries())
        .map(([brand, items]) => ({
          brand,
          products: items.sort((a: any, b: any) => String(a?.name || '').localeCompare(String(b?.name || ''))),
        }))
        .sort((a, b) => a.brand.localeCompare(b.brand))
      return { category, products, brandGroups }
    })
    .sort((a, b) => a.category.localeCompare(b.category))
})

const catalogTotalPages = computed(() => Math.max(1, Math.ceil(catalogRows.value.length / categoryRowsPerPage)))
const paginatedCatalogRows = computed(() => {
  const start = (catalogPage.value - 1) * categoryRowsPerPage
  return catalogRows.value.slice(start, start + categoryRowsPerPage)
})
const catalogPageStart = computed(() => (catalogRows.value.length ? (catalogPage.value - 1) * categoryRowsPerPage + 1 : 0))
const catalogPageEnd = computed(() => Math.min(catalogPage.value * categoryRowsPerPage, catalogRows.value.length))

const getEffectivePrice = (product: any) => {
  const offer = Number(product?.offer_price || 0)
  if (offer > 0) return offer
  return Number(product?.price || 0)
}

const getDiscountPercent = (product: any) => {
  const price = Number(product?.price || 0)
  const offer = Number(product?.offer_price || 0)
  if (!price || !offer || offer >= price) return 0
  return Math.round(((price - offer) / price) * 100)
}

const formatCatalogPrice = (value: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

const getProductPath = (product: any) => {
  const id = product?.slug || product?.id
  if (!id) return '/marketplace'
  if (product?.store?.slug && !product?.store_is_marketplace) return `/store/${product.store.slug}/productos/${id}`
  return `/marketplace/productos/${id}`
}

const featuredTotalPages = computed(() => Math.max(1, Math.ceil(featuredProducts.value.length / featuredPerPage)))
const paginatedFeaturedProducts = computed(() => {
  const start = (featuredPage.value - 1) * featuredPerPage
  return featuredProducts.value.slice(start, start + featuredPerPage)
})
const featuredPageStart = computed(() => (featuredProducts.value.length ? (featuredPage.value - 1) * featuredPerPage + 1 : 0))
const featuredPageEnd = computed(() => Math.min(featuredPage.value * featuredPerPage, featuredProducts.value.length))

const queueAccent = (color: string) => {
  const next = normalizedColor(color)
  pendingTheme.accent_color = next
  themeForm.accent_color = next
}

const queueGradient = (from: string, to: string) => {
  const nextFrom = normalizedColor(from, '#111827')
  const nextTo = normalizedColor(to, '#0b2358')
  pendingTheme.gradient_from = nextFrom
  pendingTheme.gradient_to = nextTo
  themeForm.gradient_from = nextFrom
  themeForm.gradient_to = nextTo
}

const queueCustomAccent = () => {
  const next = normalizedColor(customAccent.value)
  pendingTheme.accent_color = next
  themeForm.accent_color = next
}

watch(
  () => pendingTheme.banner_url,
  (value) => {
    themeForm.banner_url = String(value || '')
  }
)

const setQuickMediaIndex = (index: number) => {
  const safe = Math.max(0, Math.min(index, quickSlideCount.value - 1))
  activeQuickMediaIndex.value = safe
}

const previousQuickMedia = () => {
  if (quickSlideCount.value <= 1) return
  const next = (activeQuickMediaIndex.value - 1 + quickSlideCount.value) % quickSlideCount.value
  setQuickMediaIndex(next)
}

const nextQuickMedia = () => {
  if (quickSlideCount.value <= 1) return
  const next = (activeQuickMediaIndex.value + 1) % quickSlideCount.value
  setQuickMediaIndex(next)
}

const stopQuickMediaAutoplay = () => {
  if (!quickMediaInterval.value) return
  clearInterval(quickMediaInterval.value)
  quickMediaInterval.value = null
}

const startQuickMediaAutoplay = () => {
  if (!import.meta.client) return
  stopQuickMediaAutoplay()
  if (quickSlideCount.value <= 1) return
  quickMediaInterval.value = setInterval(() => {
    const next = (activeQuickMediaIndex.value + 1) % quickSlideCount.value
    setQuickMediaIndex(next)
  }, 5000)
}

const openQuickMediaPicker = () => {
  quickMediaPicker.value?.click()
}

const detectQuickMediaType = (mime: string) => (mime.startsWith('video/') ? 'video' : 'image')

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

const onStoreLogoFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  try {
    const result = await uploadToCloudinary(file, 'upload/store')
    if (!result?.secure_url) throw new Error('No se obtuvo URL del logo')
    storeForm.logo_url = result.secure_url
    updateStatus.value = 'ok'
    updateMessage.value = 'Logo listo para guardar.'
  } catch {
    updateStatus.value = 'error'
    updateMessage.value = 'No pudimos subir el logo.'
  } finally {
    if (input) input.value = ''
  }
}

const onStoreBannerFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  try {
    const result = await uploadToCloudinary(file, 'upload/store')
    if (!result?.secure_url) throw new Error('No se obtuvo URL del banner')
    pendingTheme.banner_url = result.secure_url
    themeForm.banner_url = result.secure_url
    updateStatus.value = 'ok'
    updateMessage.value = 'Banner listo para guardar.'
  } catch {
    updateStatus.value = 'error'
    updateMessage.value = 'No pudimos subir el banner.'
  } finally {
    if (input) input.value = ''
  }
}

const cloudinaryAutoUploadUrl = computed(() => {
  if (config.public.cloudinaryCloudName) {
    return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/auto/upload`
  }
  if (cloudinaryUploadUrl.value) {
    return cloudinaryUploadUrl.value
      .replace('/image/upload', '/auto/upload')
      .replace('/video/upload', '/auto/upload')
      .replace('/raw/upload', '/auto/upload')
  }
  return ''
})

const uploadAnyFileToCloudinary = async (file: File, folder = 'upload/store') => {
  if (!cloudinaryAutoUploadUrl.value || !config.public.cloudinaryUploadPreset) {
    throw new Error('Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET')
  }
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', config.public.cloudinaryUploadPreset)
  formData.append('folder', folder)
  return $fetch<any>(cloudinaryAutoUploadUrl.value, {
    method: 'POST',
    body: formData,
  })
}

const detectMenuFileKind = (file: File) => {
  const mime = String(file.type || '').toLowerCase()
  const name = String(file.name || '').toLowerCase()
  if (mime.includes('pdf') || name.endsWith('.pdf')) return 'pdf'
  if (mime.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) return 'word'
  if (mime.startsWith('image/') || /\.(png|jpe?g|webp|gif|avif)$/.test(name)) return 'image'
  return 'file'
}

const onMenuFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  try {
    const result = await uploadAnyFileToCloudinary(file, 'upload/store/menu')
    if (!result?.secure_url) throw new Error('No se obtuvo URL de la carta')
    storeForm.menu_file_url = result.secure_url
    storeForm.menu_file_kind = detectMenuFileKind(file)
    updateStatus.value = 'ok'
    updateMessage.value = 'Carta del local lista para guardar.'
  } catch {
    updateStatus.value = 'error'
    updateMessage.value = 'No pudimos subir la carta del local.'
  } finally {
    if (input) input.value = ''
  }
}

const onMenuPagesSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const files = Array.from(input?.files || [])
  if (!files.length) return
  try {
    const uploaded = await Promise.all(
      files.slice(0, 12 - storeForm.menu_pages.length).map(async (file, index) => {
        const result = await uploadToCloudinary(file, 'upload/store/menu-pages')
        if (!result?.secure_url) return null
        return {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${index}`,
          url: result.secure_url,
          label: file.name,
        }
      })
    )
    storeForm.menu_pages = [...storeForm.menu_pages, ...uploaded.filter(Boolean) as Array<{ id: string; url: string; label?: string }>]
    updateStatus.value = 'ok'
    updateMessage.value = 'Páginas de menú listas para guardar.'
  } catch {
    updateStatus.value = 'error'
    updateMessage.value = 'No pudimos subir una o más páginas del menú.'
  } finally {
    if (input) input.value = ''
  }
}

const removeMenuPage = (pageId: string) => {
  storeForm.menu_pages = storeForm.menu_pages.filter((page) => page.id !== pageId)
}

const onMenuCoverImageSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]
  if (!file) return
  try {
    const result = await uploadToCloudinary(file, 'upload/store/menu')
    if (!result?.secure_url) throw new Error('No se obtuvo portada de carta')
    storeForm.menu_cover_image_url = result.secure_url
    updateStatus.value = 'ok'
    updateMessage.value = 'Portada de carta lista para guardar.'
  } catch {
    updateStatus.value = 'error'
    updateMessage.value = 'No pudimos subir la portada de la carta.'
  } finally {
    if (input) input.value = ''
  }
}

const openMenuPanel = () => {
  if (!menuPages.value.length) return
  activeMenuPageIndex.value = 0
  menuPanelOpen.value = true
}

const previousMenuPage = () => {
  if (!menuPages.value.length) return
  activeMenuPageIndex.value = (activeMenuPageIndex.value - 1 + menuPages.value.length) % menuPages.value.length
}

const nextMenuPage = () => {
  if (!menuPages.value.length) return
  activeMenuPageIndex.value = (activeMenuPageIndex.value + 1) % menuPages.value.length
}

const persistQuickMediaDraft = async () => {
  if (!canEditTheme.value) return false
  try {
    await $fetch(`${config.public.apiBase}/stores/${slug.value}/`, {
      method: 'PATCH',
      body: { quick_media: sanitizeQuickMedia(quickMediaDraft.value) },
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
    })
    return true
  } catch {
    return false
  }
}

const onQuickMediaUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const files = Array.from(input?.files || [])
  if (!files.length) return

  const validFiles = files.filter((file) => file.size <= 15 * 1024 * 1024)
  if (!validFiles.length) {
    updateStatus.value = 'error'
    updateMessage.value = 'Los archivos superan el límite de 15MB por elemento.'
    if (input) input.value = ''
    return
  }

  const availableSlots = Math.max(0, 7 - quickMediaDraft.value.length)
  const filesToProcess = validFiles.slice(0, availableSlots)
  if (!filesToProcess.length) {
    updateStatus.value = 'error'
    updateMessage.value = 'Solo puedes guardar hasta 7 elementos en Vista rápida.'
    if (input) input.value = ''
    return
  }

  const items = await Promise.all(
    filesToProcess.map(
      (file) =>
        new Promise<QuickMediaItem>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            resolve({
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              type: detectQuickMediaType(file.type || ''),
              url: String(reader.result || ''),
            })
          }
          reader.onerror = () => reject(reader.error)
          reader.readAsDataURL(file)
        })
    )
  )

  quickMediaDraft.value = [...quickMediaDraft.value, ...items]
  quickMediaItems.value = [...quickMediaDraft.value]
  setQuickMediaIndex(quickSlideCount.value - 1)
  const persisted = await persistQuickMediaDraft()
  updateStatus.value = persisted ? 'ok' : 'error'
  updateMessage.value = persisted
    ? 'Elemento agregado y guardado en la tienda.'
    : 'Elemento agregado localmente, pero no se pudo guardar en servidor todavía.'
  if (input) input.value = ''
}

const removeQuickMedia = async (id: string) => {
  quickMediaDraft.value = quickMediaDraft.value.filter((item) => item.id !== id)
  quickMediaItems.value = [...quickMediaDraft.value]
  if (activeQuickMediaIndex.value >= quickSlideCount.value) {
    setQuickMediaIndex(quickSlideCount.value - 1)
  }
  const persisted = await persistQuickMediaDraft()
  updateStatus.value = persisted ? 'ok' : 'error'
  updateMessage.value = persisted
    ? 'Elemento eliminado y cambios guardados.'
    : 'Elemento eliminado localmente, pero no se pudo guardar en servidor todavía.'
}

const deleteCurrentQuickMedia = async () => {
  if (!activeQuickMedia.value || isProductsSlide.value) return
  const currentId = activeQuickMedia.value.id
  showQuickMediaMenu.value = false
  await removeQuickMedia(currentId)
}

const sanitizeQuickMedia = (value: any): QuickMediaItem[] => {
  if (!Array.isArray(value)) return []
  return value
    .filter((item: any) => item?.url && (item?.type === 'image' || item?.type === 'video'))
    .slice(0, 7)
    .map((item: any) => ({
      id: String(item?.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
      type: item.type,
      url: String(item.url),
    }))
}

watch([catalogCategory, catalogSort, catalogQuery], () => {
  catalogPage.value = 1
})

watch(filteredCatalog, () => {
  if (catalogPage.value > catalogTotalPages.value) catalogPage.value = catalogTotalPages.value
})

watch(featuredProducts, () => {
  if (featuredPage.value > featuredTotalPages.value) featuredPage.value = featuredTotalPages.value
})

const maybeOpenEdit = () => {
  if (shouldAutoOpen.value && canEditTheme.value) {
    showStoreForm.value = true
  }
}

const loadData = async () => {
  tenantStore.setSlug(slug.value)
  await Promise.all([tenantStore.fetchTienda(), tenantStore.fetchProductos()])
}

const hydrateForm = () => {
  const data = tenantStore.data || {}
  const homeCopy = data.home_copy && typeof data.home_copy === 'object' ? data.home_copy : {}
  const branches = Array.isArray(data.branch_locations) ? data.branch_locations : []
  storeForm.name = data.name || ''
  storeForm.slug = data.slug || slug.value || ''
  storeForm.store_type = data.store_type || 'retail'
  storeForm.home_hero_title = String((homeCopy as any).hero_title || '')
  storeForm.home_hero_subtitle = String((homeCopy as any).hero_subtitle || '')
  storeForm.home_featured_title = String((homeCopy as any).featured_title || '')
  storeForm.home_featured_subtitle = String((homeCopy as any).featured_subtitle || '')
  storeForm.home_catalog_title = String((homeCopy as any).catalog_title || '')
  storeForm.home_catalog_subtitle = String((homeCopy as any).catalog_subtitle || '')
  storeForm.hero_pattern_enabled = data.hero_pattern_enabled ?? true
  storeForm.hero_pattern_style = data.hero_pattern_style || 'type'
  storeForm.logo_url = data.logo_url || data.logo || ''
  storeForm.description = data.description || ''
  storeForm.about = data.about || data.about_us || data.about_text || ''
  const aboutSections = parseAboutSections(storeForm.about)
  storeForm.about_who_we_are = aboutSections.who
  storeForm.about_history = aboutSections.history
  storeForm.about_mission = aboutSections.mission
  storeForm.about_extra = aboutSections.extra
  storeForm.contact_email = data.contact_email || data.email || ''
  storeForm.phone = data.phone || ''
  storeForm.whatsapp = data.whatsapp || ''
  storeForm.address = data.address || ''
  // Agregados (nuevo)
  storeForm.extra_size_large_price = String(data.extra_size_large_price || '1200')
  storeForm.extra_fries_medium_price = String(data.extra_fries_medium_price || '900')
  storeForm.extra_fries_large_price = String(data.extra_fries_large_price || '1400')
  storeForm.extra_drink_price = String(data.extra_drink_price || '1000')
  storeForm.extra_sauce_price = String(data.extra_sauce_price || '250')
  // Envío
  storeForm.delivery_fee_mode = String(data.delivery_fee_mode || 'at_dispatch')
  storeForm.shipping_base_fee = String(data.shipping_base_fee ?? '')
  storeForm.shipping_per_item_fee = String(data.shipping_per_item_fee ?? '')
  storeForm.shipping_free_over = String(data.shipping_free_over ?? '')
  storeForm.pickup_skip_queue_enabled = Boolean(data.pickup_skip_queue_enabled ?? true)
  storeForm.cart_enabled = Boolean(data.cart_enabled ?? true)
  storeForm.whatsapp_sales_enabled = Boolean(data.whatsapp_sales_enabled ?? true)
  storeForm.pickup_instructions = String(data.pickup_instructions || '')
  // Redes Sociales (nuevo)
  storeForm.social_instagram = data.social_instagram || ''
  storeForm.social_facebook = data.social_facebook || ''
  storeForm.social_tiktok = data.social_tiktok || ''
  storeForm.social_youtube = data.social_youtube || ''
  // Menu files
  storeForm.menu_file_url = String(data.menu_file_url || '')
  storeForm.menu_file_kind = String(data.menu_file_kind || '')
  storeForm.menu_cover_image_url = String(data.menu_cover_image_url || '')
  storeForm.menu_pages = Array.isArray(data.menu_pages)
    ? data.menu_pages.filter((page: any) => page?.url).map((page: any, index: number) => ({
        id: String(page?.id || `${Date.now()}-${index}`),
        url: String(page.url),
        label: String(page?.label || ''),
      }))
    : []
  // Theme
  themeForm.accent_color = normalizedColor(data.accent_color || theme.accent, '#2563eb')
  themeForm.gradient_from = normalizedColor(data.gradient_from || theme.gradientFrom, '#111827')
  themeForm.gradient_to = normalizedColor(data.gradient_to || theme.gradientTo, '#0b2358')
  themeForm.banner_url = data.banner_url || ''
  pendingTheme.accent_color = themeForm.accent_color
  pendingTheme.gradient_from = themeForm.gradient_from
  pendingTheme.gradient_to = themeForm.gradient_to
  pendingTheme.banner_url = themeForm.banner_url
  customAccent.value = themeForm.accent_color
  quickMediaItems.value = sanitizeQuickMedia(data.quick_media)
  quickMediaDraft.value = [...quickMediaItems.value]
  activeMenuPageIndex.value = 0
  if (activeQuickMediaIndex.value >= quickMediaItems.value.length) {
    setQuickMediaIndex(0)
  }
  storeForm.branch_locations = branches.length
    ? branches.map((branch: any, index: number) => branchDraftFromApi(branch, index))
    : [makeEmptyBranch()]
}

type StoreUpdateResponse = {
  slug?: string
  name?: string
  store_type?: string
  hero_pattern_enabled?: boolean
  hero_pattern_style?: string
  logo_url?: string
  logo?: string
  description?: string
  contact_email?: string
  about?: string
  phone?: string
  whatsapp?: string
  banner_url?: string
  accent_color?: string
  gradient_from?: string
  gradient_to?: string
  quick_media?: Array<{ id?: string; type?: 'image' | 'video'; url?: string }>
  address?: string
  branch_locations?: Array<{ label?: string; zone?: string; address?: string }>
  delivery_fee_mode?: string
  shipping_base_fee?: string | number
  shipping_per_item_fee?: string | number
  shipping_free_over?: string | number
  pickup_skip_queue_enabled?: boolean
  cart_enabled?: boolean
  whatsapp_sales_enabled?: boolean
  pickup_instructions?: string
  menu_file_url?: string
  menu_file_kind?: string
  menu_cover_image_url?: string
  menu_pages?: Array<{ id?: string; url?: string; label?: string }>
  home_copy?: {
    hero_title?: string
    hero_subtitle?: string
    featured_title?: string
    featured_subtitle?: string
    catalog_title?: string
    catalog_subtitle?: string
  }
  [key: string]: unknown
}

const buildHomeCopyPayload = () => ({
  hero_title: String(storeForm.home_hero_title || '').trim(),
  hero_subtitle: String(storeForm.home_hero_subtitle || '').trim(),
  featured_title: String(storeForm.home_featured_title || '').trim(),
  featured_subtitle: String(storeForm.home_featured_subtitle || '').trim(),
  catalog_title: String(storeForm.home_catalog_title || '').trim(),
  catalog_subtitle: String(storeForm.home_catalog_subtitle || '').trim(),
})

const parseOptionalMoney = (value: string) => {
  const raw = String(value || '').trim()
  if (!raw) return null
  const parsed = Number(raw.replace(',', '.'))
  if (!Number.isFinite(parsed) || parsed < 0) return null
  return parsed
}

const splitAddressParts = (value: string) => {
  const raw = String(value || '').trim()
  if (!raw) return { street: '', number: '' }
  const trailing = raw.match(/^(.*?)[\s,#-]+(\d+[A-Za-z0-9-]*)$/)
  if (trailing) {
    return {
      street: trailing[1].trim(),
      number: trailing[2].trim(),
    }
  }
  return { street: raw, number: '' }
}

const branchDraftFromApi = (branch: any, index: number): BranchDraft => {
  const zoneRaw = String(branch?.zone || '').trim()
  const zoneParts = zoneRaw.split(',').map((part) => part.trim()).filter(Boolean)
  const address = splitAddressParts(String(branch?.address || ''))
  return {
    label: String(branch?.label || `Sucursal ${index + 1}`).trim(),
    street: address.street,
    number: address.number,
    comuna: zoneParts[0] || '',
    region: zoneParts.slice(1).join(', '),
  }
}

const parseBranchLocations = (branches: BranchDraft[]) =>
  (Array.isArray(branches) ? branches : [])
    .map((branch, index) => {
      const street = String(branch?.street || '').trim()
      const number = String(branch?.number || '').trim()
      const comuna = String(branch?.comuna || '').trim()
      const region = String(branch?.region || '').trim()
      const label = String(branch?.label || '').trim() || `Sucursal ${index + 1}`
      return {
        label,
        zone: [comuna, region].filter(Boolean).join(', '),
        address: [street, number].filter(Boolean).join(' ').trim(),
      }
    })
    .filter((branch) => branch.address || branch.zone)

const storeTypeLabel = (value: string) => {
  const labels: Record<string, string> = {
    retail: 'Retail',
    fast_food: 'Comida rápida',
    bakery: 'Pastelería',
    pharmacy: 'Farmacia',
    fashion: 'Moda',
    bookstore: 'Librería',
  }
  return labels[String(value || 'retail')] || 'Retail'
}

const syncStoreTypeCategories = async (targetSlug?: string, silent = false) => {
  if (!canEditTheme.value) return
  syncingCategories.value = true
  try {
    const effectiveSlug = targetSlug || slug.value
    const selectedType = String(storeForm.store_type || 'retail')
    const seeds = getCatalogCategorySeedsByStoreType(selectedType)
    const allowedSlugs = new Set(seeds.map((seed) => seed.slug))

    const headers: Record<string, string> = auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
    let fetchedCategories = await $fetch<any[]>(`${config.public.apiBase}/store/${effectiveSlug}/catalogo/categories/`, {
      headers,
    })
    const existingSlugs = new Set(fetchedCategories.map((cat: any) => String(cat?.slug || '').toLowerCase()))

    let createdCount = 0
    for (const seed of seeds) {
      if (existingSlugs.has(seed.slug)) continue
      try {
        await $fetch(`${config.public.apiBase}/store/${effectiveSlug}/catalogo/categories/`, {
          method: 'POST',
          body: seed,
          headers,
        })
        createdCount += 1
      } catch {
        // Ignoramos creaciones puntuales fallidas para no bloquear la sincronización completa.
      }
    }

    fetchedCategories = await $fetch<any[]>(`${config.public.apiBase}/store/${effectiveSlug}/catalogo/categories/`, {
      headers,
    })
    tenantStore.categories = fetchedCategories
      .filter((cat: any) => allowedSlugs.has(String(cat?.slug || '').toLowerCase()))
      .map((cat: any) => ({
        name: cat?.name || cat?.slug,
        slug: cat?.slug || cat?.name,
      }))

    if (!silent) {
      updateStatus.value = 'ok'
      updateMessage.value = `Categorías sincronizadas para ${storeTypeLabel(selectedType)} (${createdCount} nuevas).`
    }
  } catch {
    if (!silent) {
      updateStatus.value = 'error'
      updateMessage.value = 'No pudimos sincronizar categorías para el tipo de tienda.'
    }
  } finally {
    syncingCategories.value = false
  }
}

const saveStore = async () => {
  if (!canEditTheme.value) return
  updatingStore.value = true
  updateMessage.value = ''
  const previousSlug = slug.value
  const previousType = String((tenantStore.data as any)?.store_type || 'retail')
  try {
    const payload: any = {
      name: storeForm.name,
      slug: storeForm.slug,
      store_type: storeForm.store_type,
      home_copy: buildHomeCopyPayload(),
      hero_pattern_enabled: storeForm.hero_pattern_style !== 'none',
      hero_pattern_style: storeForm.hero_pattern_style,
      logo_url: storeForm.logo_url,
      description: storeForm.description,
      contact_email: storeForm.contact_email,
      about: buildAboutNarrative(),
      phone: storeForm.phone,
      whatsapp: storeForm.whatsapp,
      address: storeForm.address,
      banner_url: themeForm.banner_url,
      accent_color: normalizedColor(themeForm.accent_color, '#2563eb'),
      gradient_from: normalizedColor(themeForm.gradient_from, '#111827'),
      gradient_to: normalizedColor(themeForm.gradient_to, '#0b2358'),
      quick_media: sanitizeQuickMedia(quickMediaDraft.value),
      branch_locations: parseBranchLocations(storeForm.branch_locations),
      delivery_fee_mode: String(storeForm.delivery_fee_mode || 'at_dispatch'),
      shipping_base_fee: parseOptionalMoney(storeForm.shipping_base_fee) ?? 0,
      shipping_per_item_fee: parseOptionalMoney(storeForm.shipping_per_item_fee) ?? 0,
      shipping_free_over: parseOptionalMoney(storeForm.shipping_free_over),
      pickup_skip_queue_enabled: Boolean(storeForm.pickup_skip_queue_enabled),
      cart_enabled: Boolean(storeForm.cart_enabled),
      whatsapp_sales_enabled: Boolean(storeForm.whatsapp_sales_enabled),
      pickup_instructions: storeForm.pickup_instructions,
      menu_file_url: storeForm.menu_file_url,
      menu_file_kind: storeForm.menu_file_kind,
      menu_cover_image_url: storeForm.menu_cover_image_url,
      menu_pages: storeForm.menu_pages,
      // Redes Sociales
      social_instagram: storeForm.social_instagram,
      social_facebook: storeForm.social_facebook,
      social_tiktok: storeForm.social_tiktok,
      social_youtube: storeForm.social_youtube,
    }

    const updated = await $fetch<StoreUpdateResponse>(`${config.public.apiBase}/stores/${previousSlug}/`, {
      method: 'PATCH',
      body: payload,
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
    })

    tenantStore.data = updated
    const nextSlug = updated.slug || storeForm.slug || previousSlug

    if (nextSlug !== previousSlug) {
      theme.renameStoreTheme(previousSlug, nextSlug)
      tenantStore.setSlug(nextSlug)
      await router.replace(`/store/${nextSlug}`)
    } else {
      tenantStore.setSlug(previousSlug)
    }

    await tenantStore.fetchTienda()
    hydrateForm()

    const currentType = String(payload.store_type || 'retail')
    if (currentType !== previousType) {
      await syncStoreTypeCategories(nextSlug, true)
    }

    theme.setStoreTheme(tenantStore.slug || nextSlug, {
      accent: payload.accent_color,
      gradientFrom: payload.gradient_from,
      gradientTo: payload.gradient_to,
    })
    theme.applyStoreTheme(tenantStore.slug || nextSlug)
    updateStatus.value = 'ok'
    updateMessage.value = currentType !== previousType
      ? 'Cambios guardados y categorías sincronizadas por tipo de tienda.'
      : 'Cambios guardados'
    showStoreForm.value = false
  } catch (error: any) {
    updateStatus.value = 'error'
    updateMessage.value = error?.response?._data || 'No pudimos guardar la tienda'
  } finally {
    updatingStore.value = false
  }
}

const saveHomeCopyQuick = async () => {
  if (!canEditTheme.value || !auth.token || savingHomeCopy.value) return
  savingHomeCopy.value = true
  homeCopyMessage.value = ''
  try {
    const payload = { home_copy: buildHomeCopyPayload() }
    await authedFetch<StoreUpdateResponse>(`${config.public.apiBase}/stores/${slug.value}/`, {
      method: 'PATCH',
      body: payload,
    })
    await tenantStore.fetchTienda()
    hydrateForm()
    homeCopyStatus.value = 'ok'
    homeCopyMessage.value = 'Textos de portada guardados.'
    showHomeCopyForm.value = false
  } catch {
    homeCopyStatus.value = 'error'
    homeCopyMessage.value = 'No pudimos guardar los textos de portada.'
  } finally {
    savingHomeCopy.value = false
  }
}

onMounted(async () => {
  auth.restoreFromCookies()
  if (auth.token && !auth.user) {
    await auth.fetchProfile()
  }
  theme.loadFromStorage()
  theme.applyStoreTheme(slug.value)
  await loadData()
  hydrateForm()
  await loadPayoutAccountForStore()
  maybeOpenEdit()
})

watch(
  () => slug.value,
  async () => {
    theme.applyStoreTheme(slug.value)
    await loadData()
    hydrateForm()
  }
)

watch([shouldAutoOpen, canEditTheme], () => maybeOpenEdit())

watch(showStoreForm, (opened) => {
  if (opened) {
    activeEditTab.value = 'general'
    loadPayoutAccountForStore()
  }
})

watch(activeEditTab, (tab) => {
  if (tab === 'account') {
    loadPayoutAccountForStore()
  }
})

watch(
  () => tenantStore.data,
  () => hydrateForm(),
  { immediate: true }
)

watch(menuPages, (pages) => {
  if (activeMenuPageIndex.value >= pages.length) {
    activeMenuPageIndex.value = 0
  }
})

watch(quickSlideCount, () => startQuickMediaAutoplay(), { immediate: true })

watch(activeQuickMediaIndex, () => {
  showQuickMediaMenu.value = false
})

onBeforeUnmount(() => {
  stopQuickMediaAutoplay()
})
</script>
