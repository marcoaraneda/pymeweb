<template>
  <div class="px-4 py-10" :class="pageShellClass" :style="pageShellStyle">
    <div class="mx-auto max-w-6xl space-y-6">
      <section class="relative overflow-hidden rounded-3xl border p-5 shadow-sm md:p-6" :class="catalogHeroClass" :style="catalogHeroStyle">
        <div class="absolute inset-0 opacity-80" :style="heroPatternStyle" aria-hidden="true" />
        <div class="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]" :class="catalogBadgeClass" :style="catalogBadgeStyle">{{ catalogBadgeLabel }}</p>
            <h1 class="mt-2 text-3xl font-bold text-slate-900">{{ catalogHeaderTitle }}</h1>
            <p class="text-slate-700">{{ catalogHeaderSubtitle }}</p>
            <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
              <span class="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1">{{ catalogChipOne }}</span>
              <span class="rounded-full border border-slate-300/80 bg-white/70 px-3 py-1">{{ catalogChipTwo }}</span>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <NuxtLink v-if="storeCartEnabled" :to="`/store/${slug}/carrito`" class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-white shadow" :style="accentStyle">
              <ShoppingCart class="h-4 w-4" aria-hidden="true" />
              Carrito
            </NuxtLink>
            <button
              v-if="showMenuSection && hasMenuPages"
              class="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
              @click="openMenuPanel"
            >
              Ver menú
            </button>
            <NuxtLink
              v-if="isStoreOwner"
              :to="`/store/${slug}/productos/crear`"
              class="rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
            >
              + Agregar producto
            </NuxtLink>
              <select
                v-if="tenantStore.categories.length"
                v-model="selectedCategory"
                class="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700"
              >
                <option value="">Todas las categorías</option>
                <option v-for="cat in tenantStore.categories" :key="cat.slug" :value="cat.slug">{{ cat.name }}</option>
              </select>
              <div class="w-full sm:w-64">
                <label class="sr-only" for="catalog-search">Buscar producto</label>
                <input
                  id="catalog-search"
                  v-model="searchQuery"
                  type="search"
                  placeholder="Buscar producto o categoría..."
                  class="w-full rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 focus:border-slate-400 focus:outline-none"
                />
              </div>
              <select
                v-model="sortMode"
                class="rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700"
              >
                <option value="recommended">Orden recomendado</option>
                <option value="name_asc">A → Z</option>
                <option value="name_desc">Z → A</option>
                <option value="price_asc">Precio: menor a mayor</option>
                <option value="price_desc">Precio: mayor a menor</option>
              </select>
          </div>
        </div>
      </section>

      <section v-if="showMenuSection" class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Menú</p>
            <h2 class="text-xl font-bold text-slate-900">Carta digital de la tienda</h2>
            <p class="text-sm text-slate-600">Revisa el menú completo antes de elegir tus productos.</p>
          </div>
          <div class="flex items-center gap-2">
            <span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">{{ menuPageCount }} página{{ menuPageCount === 1 ? '' : 's' }}</span>
            <button
              v-if="hasMenuPages"
              class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-300"
              @click="openMenuPanel"
            >
              Ver menú
            </button>
          </div>
        </div>
      </section>

      <section v-if="showWhatsAppCTA" class="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-emerald-700">WhatsApp</p>
            <h2 class="text-xl font-bold text-emerald-900">Agenda tu pedido por WhatsApp</h2>
            <p class="text-sm text-emerald-800">Número de la tienda: {{ storeWhatsAppDisplay }}</p>
          </div>
          <a
            v-if="hasStoreWhatsApp"
            :href="storeWhatsAppUrl"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center rounded-lg border border-emerald-300 bg-white px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
          >
            Agendar por WhatsApp
          </a>
        </div>
      </section>

      <div v-if="tenantStore.loading" class="text-slate-500">Cargando productos...</div>
      <div v-else-if="!filteredProducts.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
        {{ tenantStore.productos.length ? 'No encontramos productos con los filtros aplicados.' : 'No hay productos para esta tienda todavía.' }}
      </div>
      <div v-else>
        <div v-if="layoutMode === 'fast_food'" class="space-y-5">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="section in fastFoodSections"
              :key="`ff-${section}`"
              type="button"
              class="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
              :class="selectedFastFoodSection === section ? 'text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400'"
              :style="selectedFastFoodSection === section ? accentStyle : {}"
              @click="selectedFastFoodSection = section"
            >
              {{ section }}
            </button>
          </div>

          <section v-for="group in visibleFastFoodGroups" :key="`fast-${group.category}`" class="rounded-2xl border bg-white/90 p-4 shadow-sm" :style="layoutPanelStyle">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-lg font-extrabold text-slate-900">{{ group.category }}</h2>
              <span class="text-xs font-semibold uppercase tracking-[0.16em]" :style="layoutMetaStyle">{{ group.products.length }} opciones</span>
            </div>
            <div class="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory">
              <NuxtLink
                v-for="product in group.products"
                :key="product.id"
                :to="productDetailPath(product)"
                class="min-w-[220px] max-w-[220px] snap-start overflow-hidden rounded-xl border bg-white shadow-sm"
                :style="layoutMediaStyle"
              >
                <div class="relative h-28 bg-slate-100">
                  <img :src="getProductImage(product) || '/logoPW.png'" :alt="product.name || 'Producto'" class="h-full w-full object-cover" />
                </div>
                <div class="space-y-1 p-3">
                  <p class="line-clamp-2 text-sm font-bold text-slate-900">{{ product.name }}</p>
                  <p class="text-base font-extrabold" :style="{ color: accentColor }">{{ formatPrice(product) }}</p>
                  <button
                    class="mt-1 inline-flex w-full items-center justify-center rounded-lg px-2 py-1.5 text-xs font-semibold text-white"
                    :style="accentStyle"
                    :disabled="!storeCartEnabled"
                    :class="{ 'opacity-60 cursor-not-allowed': !storeCartEnabled }"
                    @click.prevent="quickAddToCart(product)"
                  >
                    {{ storeCartEnabled ? 'Agregar rápido' : 'Carrito deshabilitado' }}
                  </button>
                  <button
                    class="mt-2 inline-flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    @click.prevent="openComboBuilder(product)"
                  >
                    Personalizar combo
                  </button>
                </div>
              </NuxtLink>
            </div>
          </section>
        </div>

        <div v-else-if="layoutMode === 'bakery'" class="space-y-5">
          <section v-for="group in groupedLayoutProducts" :key="`bakery-${group.category}`" class="rounded-2xl border bg-white/90 p-4 shadow-sm" :style="layoutPanelStyle">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-lg font-extrabold text-slate-900">{{ group.category }}</h2>
              <span class="text-xs font-semibold uppercase tracking-[0.16em]" :style="layoutMetaStyle">Vitrina</span>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <ProductCard
                v-for="product in group.products"
                :key="product.id"
                :product="product"
                :accent="accentColor"
                :disable-cart="!storeCartEnabled"
                :canManage="isStoreOwner"
                :onDelete="deleteProduct"
                :editUrl="productDetailPath(product)"
              />
            </div>
          </section>
        </div>

        <div v-else-if="layoutMode === 'pharmacy'" class="space-y-3">
          <article v-for="product in paginatedProducts" :key="`pharmacy-${product.id}`" class="flex flex-col gap-3 rounded-2xl border bg-white p-3 shadow-sm sm:flex-row sm:items-center" :style="layoutPanelStyle">
            <NuxtLink :to="productDetailPath(product)" class="h-24 w-full overflow-hidden rounded-xl border bg-slate-100 sm:w-28" :style="layoutMediaStyle">
              <img :src="getProductImage(product) || '/logoPW.png'" :alt="product.name || 'Producto'" class="h-full w-full object-cover" />
            </NuxtLink>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold uppercase tracking-[0.16em]" :style="layoutMetaStyle">{{ product?.category?.name || 'General' }}</p>
              <NuxtLink :to="productDetailPath(product)" class="line-clamp-2 text-base font-bold text-slate-900 hover:underline">{{ product.name }}</NuxtLink>
              <p class="mt-1 text-sm text-slate-600">{{ formatStockLabel(product?.stock_available) }}</p>
            </div>
            <div class="flex flex-col items-start gap-2 sm:items-end">
              <p class="text-lg font-extrabold" :style="{ color: accentColor }">{{ formatPrice(product) }}</p>
              <button
                class="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                :style="accentStyle"
                :disabled="!storeCartEnabled"
                :class="{ 'opacity-60 cursor-not-allowed': !storeCartEnabled }"
                @click="quickAddToCart(product)"
              >
                {{ storeCartEnabled ? 'Agregar' : 'Carrito deshabilitado' }}
              </button>
            </div>
          </article>
        </div>

        <div v-else :class="productGridClass">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            :accent="accentColor"
            :disable-cart="!storeCartEnabled"
            :canManage="isStoreOwner"
            :onDelete="deleteProduct"
            :editUrl="productDetailPath(product)"
          />
        </div>
      </div>

      <div v-if="filteredProducts.length > perPage" class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <button
          class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"
          :disabled="page === 1"
          @click="page -= 1"
        >
          Anterior
        </button>
        <p>Mostrando {{ pageStart }}-{{ pageEnd }} de {{ filteredProducts.length }}</p>
        <button
          class="rounded-lg border border-blue-200 bg-white px-3 py-1.5 font-semibold hover:bg-blue-100 disabled:opacity-40"
          :disabled="page === totalPages"
          @click="page += 1"
        >
          Siguiente
        </button>
      </div>

      <section class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Síguenos</p>
            <h2 class="text-xl font-bold text-slate-900">Redes sociales de la tienda</h2>
            <p class="text-sm text-slate-600">Mantente al día con promociones, nuevos productos y horarios especiales.</p>
          </div>
          <div v-if="hasStoreSocialLinks" class="flex flex-wrap gap-2">
            <a
              v-for="social in storeSocialLinks"
              :key="social.key"
              :href="social.url"
              target="_blank"
              rel="noopener"
              class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              <Instagram v-if="social.key === 'instagram'" class="h-4 w-4 text-pink-600" />
              <Facebook v-else-if="social.key === 'facebook'" class="h-4 w-4 text-blue-600" />
              <Music2 v-else-if="social.key === 'tiktok'" class="h-4 w-4 text-slate-900" />
              <Youtube v-else-if="social.key === 'youtube'" class="h-4 w-4 text-red-600" />
              {{ social.label }}
            </a>
          </div>
          <p v-else class="text-sm text-slate-500">Esta tienda aún no configura sus redes sociales.</p>
        </div>
      </section>

      <div v-if="comboBuilderOpen && activeComboProduct" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 px-4 py-8">
        <div class="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Constructor de combo</p>
              <h3 class="text-xl font-bold text-slate-900">{{ activeComboProduct.name }}</h3>
              <p class="text-sm text-slate-600">Arma tu pedido al estilo comida rápida.</p>
            </div>
            <button class="rounded-full border border-slate-200 px-2 py-1 text-sm text-slate-600" @click="comboBuilderOpen = false">✕</button>
          </div>

          <div class="mt-4 space-y-4">
            <div>
              <p class="text-sm font-semibold text-slate-800">Tamaño</p>
              <div class="mt-2 flex gap-2">
                <button type="button" class="rounded-lg border px-3 py-2 text-sm" :class="comboConfig.size === 'regular' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white text-slate-700'" @click="comboConfig.size = 'regular'">Regular</button>
                <button type="button" class="rounded-lg border px-3 py-2 text-sm" :class="comboConfig.size === 'grande' ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white text-slate-700'" @click="comboConfig.size = 'grande'">Grande (+${{ (tenantStore.data as any)?.extra_size_large_price || 1200 }})</button>
              </div>
            </div>

            <div>
              <p class="text-sm font-semibold text-slate-800">Papas fritas</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <button v-for="option in friesOptions" :key="`fries-${option.value}`" type="button" class="rounded-lg border px-3 py-2 text-sm" :class="comboConfig.fries === option.value ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 bg-white text-slate-700'" @click="comboConfig.fries = option.value">
                  <span v-if="option.value === 'ninguna'">{{ option.label }}</span>
                  <span v-else-if="option.value === 'medianas'">Medianas (+${{ (tenantStore.data as any)?.extra_fries_medium_price || 900 }})</span>
                  <span v-else>Grandes (+${{ (tenantStore.data as any)?.extra_fries_large_price || 1400 }})</span>
                </button>
              </div>
            </div>

            <div>
              <p class="text-sm font-semibold text-slate-800">Bebida</p>
              <select v-model="comboConfig.drink" class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="Sin bebida">Sin bebida</option>
                <option v-for="drink in suggestedDrinks" :key="`drink-${drink}`" :value="drink">{{ drink }} (+${{ (tenantStore.data as any)?.extra_drink_price || 1000 }})</option>
              </select>
            </div>

            <div>
              <p class="text-sm font-semibold text-slate-800">Salsas (+${{ (tenantStore.data as any)?.extra_sauce_price || 250 }} c/u)</p>
              <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <label v-for="sauce in sauceOptions" :key="`sauce-${sauce}`" class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-700">
                  <input :checked="comboConfig.sauces.includes(sauce)" type="checkbox" @change="toggleSauce(sauce)" />
                  {{ sauce }}
                </label>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-semibold text-slate-800">Agregados</p>
                <span class="text-xs text-slate-500">Se cobran según el producto</span>
              </div>
              <div v-if="addonProducts.length" class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label v-for="addon in addonProducts" :key="`addon-${addon.id}`" class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
                  <span class="flex min-w-0 flex-col">
                    <span class="font-semibold text-slate-900">{{ addon.name }}</span>
                    <span class="text-xs text-slate-500">{{ formatCurrency(addon.price) }}</span>
                  </span>
                  <input :checked="comboConfig.addons.some((item) => String(item.id) === String(addon.id))" type="checkbox" class="h-4 w-4 accent-emerald-600" @change="toggleAddon(addon)" />
                </label>
              </div>
              <p v-else class="mt-2 rounded-xl border border-dashed border-slate-200 px-3 py-2 text-sm text-slate-500">No hay productos cargados en la categoría Agregados.</p>
            </div>
          </div>

          <div class="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
            <p class="text-sm text-slate-700">Total combo: <span class="font-bold text-slate-900">{{ formatCurrency(comboPreviewPrice) }}</span></p>
            <button class="rounded-xl px-4 py-2 text-sm font-semibold text-white" :style="accentStyle" :disabled="!storeCartEnabled" :class="{ 'opacity-60 cursor-not-allowed': !storeCartEnabled }" @click="addConfiguredComboToCart">{{ storeCartEnabled ? 'Agregar combo' : 'Carrito deshabilitado' }}</button>
          </div>
        </div>
      </div>

      <div v-if="menuPanelOpen && menuPages.length" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6">
        <div class="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div class="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 sm:px-5">
            <div>
              <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Menú de la tienda</p>
              <h3 class="text-lg font-bold text-slate-900">{{ tenantStore.data?.name || 'Tienda' }}</h3>
            </div>
            <div class="flex items-center gap-2">
              <span class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">Página {{ activeMenuPageIndex + 1 }} de {{ menuPages.length }}</span>
              <button class="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:bg-slate-50" @click="menuPanelOpen = false">✕</button>
            </div>
          </div>

          <div class="relative flex-1 overflow-hidden bg-slate-100">
            <img :src="menuPages[activeMenuPageIndex]?.url" :alt="menuPages[activeMenuPageIndex]?.label || `Página ${activeMenuPageIndex + 1}`" class="h-full w-full object-contain bg-slate-100" />
            <button v-if="menuPages.length > 1" class="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white hover:bg-slate-950/85" @click="previousMenuPage">‹</button>
            <button v-if="menuPages.length > 1" class="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-slate-950/70 text-white hover:bg-slate-950/85" @click="nextMenuPage">›</button>
          </div>

          <div class="flex gap-3 overflow-x-auto border-t border-slate-200 bg-white px-4 py-3">
            <button
              v-for="(page, index) in menuPages"
              :key="page.id || `${page.url}-${index}`"
              class="min-w-[92px] overflow-hidden rounded-xl border transition"
              :class="index === activeMenuPageIndex ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'"
              @click="activeMenuPageIndex = index"
            >
              <img :src="page.url" :alt="page.label || `Página ${index + 1}`" class="h-20 w-full object-cover" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useTenantStore } from '~/stores/tenant'
import { useCartStore } from '~/stores/cart'
import { useImages } from '~/composables/useImages'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'
import { Facebook, Instagram, Music2, ShoppingCart, Youtube } from 'lucide-vue-next'

definePageMeta({ layout: 'store' })

const route = useRoute()
const slug = route.params.slug as string
const config = useRuntimeConfig()

const tenantStore = useTenantStore()
const cart = useCartStore()
const theme = useThemeStore()
const auth = useAuthStore()
const { getProductImage } = useImages()

const selectedCategory = ref('')
const searchQuery = ref('')
const sortMode = ref<'recommended' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'>('recommended')
const page = ref(1)
const selectedFastFoodSection = ref('Combos')
const comboBuilderOpen = ref(false)
const menuPanelOpen = ref(false)
const activeMenuPageIndex = ref(0)
const activeComboProduct = ref<any | null>(null)
const sauceOptions = ['BBQ', 'Mostaza miel', 'Ajo', 'Picante', 'Ketchup', 'Mayonesa']
const friesOptions = [
  { value: 'ninguna', label: 'Sin papas' },
  { value: 'medianas', label: 'Medianas (+$900)' },
  { value: 'grandes', label: 'Grandes (+$1.400)' },
]
const comboConfig = ref<{
  size: 'regular' | 'grande'
  fries: 'ninguna' | 'medianas' | 'grandes'
  drink: string
  sauces: string[]
  addons: Array<{ id: number | string; name: string; price: number }>
}>({
  size: 'regular',
  fries: 'medianas',
  drink: 'Sin bebida',
  sauces: [],
  addons: [],
})
const perPage = 12
const isStoreOwner = computed(() => {
  const memberships = (auth.user as any)?.memberships || []
  return memberships.some((m: any) => {
    const storeSlug = m?.store?.slug
    const roles = (m?.roles || []).map((r: any) => r?.code || r)?.map((r: string) => r?.toLowerCase?.())
    return storeSlug === slug && roles.some((r: string) => ['admin', 'owner', 'manager'].includes(r))
  })
})

const productDetailPath = (product: any) => (product?.slug ? `/store/${slug}/productos/${product.slug}` : `/store/${slug}/productos`)

const accentColor = computed(() => theme.accent || '#2563eb')
const accentStyle = computed(() => ({ backgroundColor: accentColor.value, color: '#fff' }))
const storeType = computed(() => String((tenantStore.data as any)?.store_type || 'retail'))
const cartAllowedByType = computed(() => ['fast_food', 'bakery'].includes(storeType.value))
const showMenuSection = computed(() => ['fast_food', 'bakery'].includes(storeType.value))
const storeCartEnabled = computed(() => {
  const value = (tenantStore.data as any)?.cart_enabled
  const hasToggle = value === undefined || value === null ? true : Boolean(value)
  return cartAllowedByType.value && hasToggle
})
const showWhatsAppCTA = computed(() => {
  const enabled = (tenantStore.data as any)?.whatsapp_sales_enabled
  const hasToggle = enabled === undefined || enabled === null ? true : Boolean(enabled)
  return hasToggle && hasStoreWhatsApp.value
})
const storeWhatsAppRaw = computed(() => String((tenantStore.data as any)?.whatsapp || (tenantStore.data as any)?.phone || '').trim())
const storeWhatsAppDigits = computed(() => storeWhatsAppRaw.value.replace(/[^\d]/g, ''))
const hasStoreWhatsApp = computed(() => storeWhatsAppDigits.value.length > 0)
const storeWhatsAppDisplay = computed(() => storeWhatsAppRaw.value || 'No configurado')
const storeWhatsAppUrl = computed(() => {
  if (!hasStoreWhatsApp.value) return '#'
  const storeName = String((tenantStore.data as any)?.name || 'la tienda')
  const msg = encodeURIComponent(`Hola, quiero agendar un pedido en ${storeName}.`)
  return `https://wa.me/${storeWhatsAppDigits.value}?text=${msg}`
})
const normalizeSocialUrl = (value: any) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw
  return `https://${raw}`
}
const storeSocialLinks = computed(() => {
  const data: any = tenantStore.data || {}
  const links = [
    { key: 'instagram', label: 'Instagram', url: normalizeSocialUrl(data.social_instagram) },
    { key: 'facebook', label: 'Facebook', url: normalizeSocialUrl(data.social_facebook) },
    { key: 'tiktok', label: 'TikTok', url: normalizeSocialUrl(data.social_tiktok) },
    { key: 'youtube', label: 'YouTube', url: normalizeSocialUrl(data.social_youtube) },
  ]
  return links.filter((item) => item.url)
})
const hasStoreSocialLinks = computed(() => storeSocialLinks.value.length > 0)
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
    return [{
      id: 'legacy-menu',
      url: String((tenantStore.data as any)?.menu_file_url),
      label: 'Carta principal',
    }]
  }
  return []
}
const menuPages = computed(() => normalizeMenuPages((tenantStore.data as any)?.menu_pages))
const hasMenuPages = computed(() => menuPages.value.length > 0)
const menuPageCount = computed(() => menuPages.value.length)
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
const typeTheme = computed(() => {
  const byType: Record<string, { shellClass: string; heroClass: string; pattern: string; badgeLabel: string; badgeClass: string; title: string; subtitle: string; chipOne: string; chipTwo: string }> = {
    retail: {
      shellClass: 'bg-slate-50',
      heroClass: 'border-slate-200 bg-white',
      pattern: 'radial-gradient(circle at 80% 20%, rgba(148,163,184,0.16), transparent 40%)',
      badgeLabel: 'Top ventas',
      badgeClass: 'border-slate-300 bg-slate-100 text-slate-700',
      title: 'Lo mejor de esta tienda, listo para llevar hoy',
      subtitle: 'Descubre productos destacados, aprovecha ofertas y compra en segundos.',
      chipOne: 'Ofertas que se agotan rapido',
      chipTwo: 'Compra inteligente por categoria',
    },
    fast_food: {
      shellClass: 'bg-slate-50',
      heroClass: 'border-slate-200 bg-white',
      pattern: 'repeating-linear-gradient(135deg, rgba(234,88,12,0.12) 0px, rgba(234,88,12,0.12) 8px, transparent 8px, transparent 16px)',
      badgeLabel: 'Menú rápido',
      badgeClass: 'border-slate-300 bg-slate-100 text-slate-900',
      title: 'Si tienes un bajon, aqui llega tu antojo en minutos',
      subtitle: 'Combos irresistibles, pedido rapido y sabor que te salva el dia.',
      chipOne: 'Promos para hoy',
      chipTwo: 'Llego tu momento de comer rico',
    },
    bakery: {
      shellClass: 'bg-slate-50',
      heroClass: 'border-slate-200 bg-white',
      pattern: 'radial-gradient(circle at 15% 25%, rgba(251,113,133,0.15), transparent 35%), radial-gradient(circle at 80% 60%, rgba(251,191,36,0.12), transparent 40%)',
      badgeLabel: 'Vitrina dulce',
      badgeClass: 'border-slate-300 bg-slate-100 text-slate-900',
      title: 'Recien horneado para convertir cualquier momento en premio',
      subtitle: 'Pasteles, tortas y pan recien hechos para enamorarte desde la vitrina.',
      chipOne: 'Dulces que conquistan',
      chipTwo: 'Encarga y celebra a lo grande',
    },
    pharmacy: {
      shellClass: 'bg-slate-50',
      heroClass: 'border-slate-200 bg-white',
      pattern: 'linear-gradient(90deg, rgba(6,182,212,0.12) 1px, transparent 1px), linear-gradient(180deg, rgba(6,182,212,0.08) 1px, transparent 1px)',
      badgeLabel: 'Salud y bienestar',
      badgeClass: 'border-slate-300 bg-slate-100 text-slate-900',
      title: 'Tu bienestar primero, con todo lo esencial en un solo lugar',
      subtitle: 'Compra con confianza productos clave para cuidarte hoy mismo.',
      chipOne: 'Confianza y respaldo',
      chipTwo: 'Todo para cuidarte mejor',
    },
    fashion: {
      shellClass: 'bg-slate-50',
      heroClass: 'border-slate-200 bg-white',
      pattern: 'repeating-linear-gradient(120deg, rgba(168,85,247,0.12) 0px, rgba(168,85,247,0.12) 6px, transparent 6px, transparent 16px)',
      badgeLabel: 'Colección de moda',
      badgeClass: 'border-slate-300 bg-slate-100 text-slate-900',
      title: 'Tu proximo look viral comienza en esta coleccion',
      subtitle: 'Prendas con estilo, tendencia y personalidad para destacar sin esfuerzo.',
      chipOne: 'Nuevos drops',
      chipTwo: 'Vistete para impactar',
    },
    bookstore: {
      shellClass: 'bg-slate-50',
      heroClass: 'border-slate-200 bg-white',
      pattern: 'repeating-linear-gradient(0deg, rgba(99,102,241,0.11) 0px, rgba(99,102,241,0.11) 2px, transparent 2px, transparent 14px)',
      badgeLabel: 'Estantería digital',
      badgeClass: 'border-slate-300 bg-slate-100 text-slate-900',
      title: 'Abre un libro y enciende tu proxima gran historia',
      subtitle: 'Explora titulos seleccionados para aprender, inspirarte y disfrutar.',
      chipOne: 'Selecciones que atrapan',
      chipTwo: 'Tu siguiente lectura ideal',
    },
  }
  return byType[storeType.value] || byType.retail
})
const pageShellClass = computed(() => typeTheme.value.shellClass)
const catalogHeroClass = computed(() => typeTheme.value.heroClass)
const heroPatternEnabled = computed(() => (tenantStore.data as any)?.hero_pattern_enabled ?? true)
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
const heroPatternStyle = computed(() => {
  if (!heroPatternEnabled.value) return { backgroundImage: 'none' }
  const style = String((tenantStore.data as any)?.hero_pattern_style || 'type')
  if (style === 'none') return { backgroundImage: 'none' }
  if (style === 'type') return { backgroundImage: typeTheme.value.pattern }
  return { backgroundImage: customPatternMap[style] || typeTheme.value.pattern }
})
const catalogBadgeLabel = computed(() => typeTheme.value.badgeLabel)
const catalogBadgeClass = computed(() => typeTheme.value.badgeClass)
const catalogHeaderTitle = computed(() => typeTheme.value.title)
const catalogHeaderSubtitle = computed(() => typeTheme.value.subtitle)
const catalogChipOne = computed(() => typeTheme.value.chipOne)
const catalogChipTwo = computed(() => typeTheme.value.chipTwo)
const pageShellStyle = computed(() => ({
  backgroundImage: `radial-gradient(circle at 15% 0%, ${hexToRgba(accentColor.value, 0.08)}, transparent 42%)`,
}))
const catalogHeroStyle = computed(() => ({
  borderColor: hexToRgba(accentColor.value, 0.34),
  backgroundImage: `linear-gradient(120deg, ${hexToRgba(theme.gradientFrom, 0.24)}, ${hexToRgba(theme.gradientTo, 0.08)})`,
}))
const catalogBadgeStyle = computed(() => ({
  borderColor: hexToRgba(accentColor.value, 0.5),
  backgroundColor: hexToRgba(accentColor.value, 0.2),
  color: '#0f172a',
}))
const layoutPanelStyle = computed(() => ({ borderColor: hexToRgba(accentColor.value, 0.34) }))
const layoutMediaStyle = computed(() => ({ borderColor: hexToRgba(accentColor.value, 0.28) }))
const layoutMetaStyle = computed(() => ({ color: accentColor.value }))
const layoutMode = computed(() => {
  if (storeType.value === 'fast_food') return 'fast_food'
  if (storeType.value === 'bakery') return 'bakery'
  if (storeType.value === 'pharmacy') return 'pharmacy'
  return 'grid'
})
const productGridClass = computed(() => {
  if (storeType.value === 'fashion') return 'grid gap-5 sm:grid-cols-2 lg:grid-cols-4'
  if (storeType.value === 'bookstore') return 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
  return 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
})
const productTimestamp = (product: any) => {
  const raw = product?.created_at || product?.created || product?.updated_at || product?.id
  const time = new Date(raw).getTime()
  return Number.isFinite(time) ? time : Number(product?.id || 0)
}
const productPriceValue = (product: any) => Number(product?.offer_price || product?.price || 0)
const productStockValue = (product: any) => normalizeStock(product?.stock_available)
const sortedProductsByType = (items: any[]) => {
  const list = [...items]

  if (storeType.value === 'fast_food') {
    return list.sort((a, b) => {
      const stockDiff = productStockValue(b) - productStockValue(a)
      if (stockDiff) return stockDiff
      const offerDiff = Number(Boolean(b?.offer_price)) - Number(Boolean(a?.offer_price))
      if (offerDiff) return offerDiff
      return productTimestamp(b) - productTimestamp(a)
    })
  }

  if (storeType.value === 'bakery') {
    return list.sort((a, b) => {
      const categoryA = String(a?.category?.name || a?.category || 'General')
      const categoryB = String(b?.category?.name || b?.category || 'General')
      const byCategory = categoryA.localeCompare(categoryB)
      if (byCategory) return byCategory
      return productTimestamp(b) - productTimestamp(a)
    })
  }

  if (storeType.value === 'pharmacy') {
    return list.sort((a, b) => {
      const stockDiff = productStockValue(b) - productStockValue(a)
      if (stockDiff) return stockDiff
      return String(a?.name || '').localeCompare(String(b?.name || ''))
    })
  }

  if (storeType.value === 'fashion') {
    return list.sort((a, b) => {
      const offerDiff = Number(Boolean(b?.offer_price)) - Number(Boolean(a?.offer_price))
      if (offerDiff) return offerDiff
      return productTimestamp(b) - productTimestamp(a)
    })
  }

  if (storeType.value === 'bookstore') {
    return list.sort((a, b) => {
      const categoryA = String(a?.category?.name || a?.category || 'General')
      const categoryB = String(b?.category?.name || b?.category || 'General')
      const byCategory = categoryA.localeCompare(categoryB)
      if (byCategory) return byCategory
      return String(a?.name || '').localeCompare(String(b?.name || ''))
    })
  }

  return list.sort((a, b) => {
    const offerDiff = Number(Boolean(b?.offer_price)) - Number(Boolean(a?.offer_price))
    if (offerDiff) return offerDiff
    const priceDiff = productPriceValue(a) - productPriceValue(b)
    if (priceDiff) return priceDiff
    return productTimestamp(b) - productTimestamp(a)
  })
}
const filteredProducts = computed(() => {
  const term = searchQuery.value.trim().toLowerCase()
  const base = !term
    ? (tenantStore.productos || [])
    : (tenantStore.productos || []).filter((product: any) => matchesSearch(product, term))
  const sortedByType = sortedProductsByType(base)
  if (sortMode.value === 'recommended') return sortedByType
  if (sortMode.value === 'name_asc') {
    return [...sortedByType].sort((a: any, b: any) => String(a?.name || '').localeCompare(String(b?.name || '')))
  }
  if (sortMode.value === 'name_desc') {
    return [...sortedByType].sort((a: any, b: any) => String(b?.name || '').localeCompare(String(a?.name || '')))
  }
  if (sortMode.value === 'price_asc') {
    return [...sortedByType].sort((a: any, b: any) => productPriceValue(a) - productPriceValue(b))
  }
  return [...sortedByType].sort((a: any, b: any) => productPriceValue(b) - productPriceValue(a))
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / perPage)))
const paginatedProducts = computed(() => {
  const start = (page.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})
const fastFoodSections = computed(() => {
  if (layoutMode.value !== 'fast_food') return [] as string[]
  const defaults = ['Combos', 'Hamburguesas', 'Papas y acompañamientos', 'Bebidas', 'Bebestibles', 'Salsas', 'Postres', 'Otros']
  const present = new Set(
    paginatedProducts.value.map((product: any) => normalizeFastFoodCategory(String(product?.category?.name || product?.category || 'General')))
  )
  const ordered = defaults.filter((item) => present.has(item))
  const extras = Array.from(present).filter((item) => !ordered.includes(item))
  return [...ordered, ...extras]
})
const groupedLayoutProducts = computed(() => {
  const grouped = new Map<string, any[]>()
  paginatedProducts.value.forEach((product: any) => {
    const category =
      layoutMode.value === 'fast_food'
        ? normalizeFastFoodCategory(String(product?.category?.name || product?.category || 'General'))
        : String(product?.category?.name || product?.category || 'General')
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category)!.push(product)
  })
  return Array.from(grouped.entries())
    .map(([category, products]) => ({ category, products }))
    .sort((a, b) => {
      if (layoutMode.value !== 'fast_food') return a.category.localeCompare(b.category)
      const order = new Map(fastFoodSections.value.map((section, index) => [section, index]))
      return (order.get(a.category) ?? 999) - (order.get(b.category) ?? 999)
    })
})
const visibleFastFoodGroups = computed(() => {
  if (layoutMode.value !== 'fast_food') return groupedLayoutProducts.value
  if (!selectedFastFoodSection.value) return groupedLayoutProducts.value
  return groupedLayoutProducts.value.filter((g) => g.category === selectedFastFoodSection.value)
})
const pageStart = computed(() => (filteredProducts.value.length ? (page.value - 1) * perPage + 1 : 0))
const pageEnd = computed(() => Math.min(page.value * perPage, filteredProducts.value.length))
const suggestedDrinks = computed(() => {
  const drinks = (tenantStore.productos || [])
    .filter((product: any) => {
      const category = normalizeFastFoodCategory(String(product?.category?.name || product?.category || ''))
      return category === 'Bebidas' || category === 'Bebestibles'
    })
    .map((product: any) => String(product?.name || '').trim())
    .filter(Boolean)
  return Array.from(new Set(drinks)).slice(0, 8)
})
const addonProducts = computed(() => {
  return (tenantStore.productos || [])
    .filter((product: any) => {
      const category = String(product?.category?.name || product?.category || '').toLowerCase().trim()
      return category === 'agregados'
    })
    .map((product: any) => ({
      id: product?.id,
      name: String(product?.name || '').trim(),
      price: getProductUnitPrice(product),
    }))
    .filter((product: any) => product.name)
})
const parseMoney = (value: any) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.,-]/g, '').trim()
    if (!cleaned) return 0
    const normalized = cleaned.includes(',') && cleaned.includes('.')
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned.replace(',', '.')
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}
const getProductUnitPrice = (product: any) => {
  const offer = parseMoney(product?.offer_price)
  if (offer > 0) return offer
  return parseMoney(product?.price)
}
const comboPreviewPrice = computed(() => {
  const base = getProductUnitPrice(activeComboProduct.value)
  const storeData = tenantStore.data as any || {}
  const sizeExtra = comboConfig.value.size === 'grande' ? Number(storeData.extra_size_large_price || 1200) : 0
  const friesExtra = comboConfig.value.fries === 'grandes' ? Number(storeData.extra_fries_large_price || 1400) : comboConfig.value.fries === 'medianas' ? Number(storeData.extra_fries_medium_price || 900) : 0
  const drinkExtra = comboConfig.value.drink && comboConfig.value.drink !== 'Sin bebida' ? Number(storeData.extra_drink_price || 1000) : 0
  const saucesExtra = comboConfig.value.sauces.length * Number(storeData.extra_sauce_price || 250)
  const addonsExtra = comboConfig.value.addons.reduce((acc, addon) => acc + parseMoney(addon.price), 0)
  return Math.max(0, base + sizeExtra + friesExtra + drinkExtra + saucesExtra + addonsExtra)
})

onMounted(async () => {
  auth.restoreFromCookies()
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)
  tenantStore.setSlug(slug)
  await tenantStore.fetchTienda()
  await tenantStore.fetchCategories()
  await tenantStore.fetchProductos()
})

// admin menu handled inside ProductCard

const deleteProduct = async (product: any) => {
  if (!isStoreOwner.value) {
    window.alert('Solo el dueño puede eliminar productos')
    return
  }
  if (!auth.token || !product?.id) {
    window.alert('Inicia sesión para eliminar productos')
    return
  }
  const confirmed = window.confirm('¿Eliminar este producto?')
  if (!confirmed) return
  const doDelete = async () =>
    $fetch(`${config.public.apiBase}/store/${slug}/admin/catalogo/products/${product.id}/`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.token}` },
    })

  try {
    await doDelete()
    // ProductCard will close its menu; refresh list
    await tenantStore.fetchProductos()
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) {
        try {
          await doDelete()
          await tenantStore.fetchProductos()
          return
        } catch (e) {
          console.error('Reintento de eliminación falló', e)
        }
      }
    }

    console.error('No pudimos eliminar el producto', error)
    window.alert('No pudimos eliminar el producto')
  }
}

const matchesSearch = (product: any, term: string) => {
  if (!term) return true
  const fields = [product?.name, product?.description, product?.category?.name, product?.slug]
  return fields.some((value) => {
    const text = value?.toString?.()
    return text ? text.toLowerCase().includes(term) : false
  })
}

const normalizeStock = (value: any) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const formatPrice = (product: any) => {
  const value = Number(product?.offer_price || product?.price || 0)
  return formatCurrency(value)
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

const formatStockLabel = (value: any) => {
  const stock = normalizeStock(value)
  if (stock <= 0) return 'Sin stock'
  if (stock <= 5) return `Stock bajo (${stock})`
  return `${stock} en inventario`
}

const formatStockClass = (value: any) => {
  const stock = normalizeStock(value)
  if (stock <= 0) return 'text-red-600'
  if (stock <= 5) return 'text-amber-600'
  return 'text-emerald-600'
}

const quickAddToCart = (product: any) => {
  if (!storeCartEnabled.value) return
  const stock = normalizeStock(product?.stock_available)
  if (stock <= 0) return
  cart.setContext(slug)
  cart.addProduct(product)
}

const normalizeFastFoodCategory = (rawCategory: string) => {
  const value = String(rawCategory || '').toLowerCase().trim()
  if (/combo/.test(value)) return 'Combos'
  if (/burger|hamburguesa/.test(value)) return 'Hamburguesas'
  if (/papa|acompañ|acompani|side/.test(value)) return 'Papas y acompañamientos'
  if (/bebida/.test(value)) return 'Bebidas'
  if (/bebestible|jugo|gaseosa|soda/.test(value)) return 'Bebestibles'
  if (/salsa|dip/.test(value)) return 'Salsas'
  if (/postre|helado|dessert/.test(value)) return 'Postres'
  return rawCategory || 'Otros'
}

const resetComboBuilder = () => {
  comboConfig.value = {
    size: 'regular',
    fries: 'medianas',
    drink: suggestedDrinks.value[0] || 'Sin bebida',
    sauces: [],
    addons: [],
  }
}

const openComboBuilder = (product: any) => {
  activeComboProduct.value = product
  resetComboBuilder()
  comboBuilderOpen.value = true
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

const toggleSauce = (sauce: string) => {
  const current = comboConfig.value.sauces
  if (current.includes(sauce)) {
    comboConfig.value.sauces = current.filter((item) => item !== sauce)
    return
  }
  comboConfig.value.sauces = [...current, sauce]
}

const toggleAddon = (addon: { id: number | string; name: string; price: number }) => {
  const current = comboConfig.value.addons
  const exists = current.some((item) => String(item.id) === String(addon.id))
  if (exists) {
    comboConfig.value.addons = current.filter((item) => String(item.id) !== String(addon.id))
    return
  }
  comboConfig.value.addons = [...current, addon]
}

const addConfiguredComboToCart = () => {
  if (!storeCartEnabled.value) return
  if (!activeComboProduct.value) return
  const storeData = tenantStore.data as any || {}
  cart.setContext(slug)
  cart.addConfiguredProduct({
    product: activeComboProduct.value,
    quantity: 1,
    size: comboConfig.value.size,
    fries: comboConfig.value.fries,
    drink: comboConfig.value.drink,
    sauces: comboConfig.value.sauces,
    addons: comboConfig.value.addons,
    // Pasar precios dinámicos desde store
    extraSizeLargePrice: Number(storeData.extra_size_large_price || 1200),
    extraFriesMediumPrice: Number(storeData.extra_fries_medium_price || 900),
    extraFriesLargePrice: Number(storeData.extra_fries_large_price || 1400),
    extraDrinkPrice: Number(storeData.extra_drink_price || 1000),
    extraSaucePrice: Number(storeData.extra_sauce_price || 250),
  })
  comboBuilderOpen.value = false
}

watch(
  () => selectedCategory.value,
  async (slugCat) => {
    page.value = 1
    const params: Record<string, any> = {}
    if (slugCat) params.category = slugCat
    await tenantStore.fetchProductos(params)
  }
)

watch(searchQuery, () => {
  page.value = 1
})

watch(sortMode, () => {
  page.value = 1
})

watch(filteredProducts, () => {
  if (page.value > totalPages.value) page.value = totalPages.value
})

watch(
  fastFoodSections,
  (sections) => {
    if (!sections.length) return
    if (!sections.includes(selectedFastFoodSection.value)) {
      selectedFastFoodSection.value = sections[0]
    }
  },
  { immediate: true }
)

watch(menuPages, (pages) => {
  if (activeMenuPageIndex.value >= pages.length) {
    activeMenuPageIndex.value = 0
  }
})

// no-op: ProductCard handles its own menus
</script>
