<template>
  <div class="relative isolate overflow-hidden">
    <div class="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
      <div class="absolute -left-16 top-10 h-56 w-56 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl" />
      <div class="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-gradient-to-r from-[var(--gradient-from,#111827)] to-[var(--gradient-to,#0b2358)] blur-3xl" />
    </div>

    <section
      class="relative z-10 bg-slate-950 text-white"
      :style="heroStyle"
    >
      <div class="max-w-6xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em]">
            Gestiona y personaliza
          </p>
          <h1 class="mt-6 text-4xl md:text-5xl font-extrabold leading-tight">
            Tu ecosistema de tiendas, con el estilo que necesitas
          </h1>
          <p class="mt-4 text-lg text-white/80 max-w-2xl">
            Inicia sesión, consulta tus tiendas, explora todas las disponibles y ajusta los colores para que tu marca se sienta en casa.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink
              v-if="!auth.isAuthenticated"
              to="/login"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              :style="{ backgroundColor: theme.accent, color: '#fff' }"
            >
              Iniciar sesión
              <span aria-hidden="true">→</span>
            </NuxtLink>
            <a
              v-else
              href="#crear-tienda"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold shadow-lg shadow-black/20 transition hover:-translate-y-0.5"
              :style="{ backgroundColor: theme.accent, color: '#fff' }"
            >
              Crear tienda
              <span aria-hidden="true">★</span>
            </a>
            <a
              href="#tiendas"
              class="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 font-semibold text-white hover:border-white/40 hover:bg-white/5 transition"
            >
              Ver tiendas
            </a>
          </div>
        </div>

        <div class="relative">
          <div class="absolute -inset-8 rounded-3xl bg-white/5 blur-2xl" />
          <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div class="flex items-center justify-between text-sm text-white/80">
              <span>Panel de tiendas</span>
              <span class="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                Sincronizado
                <span class="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              </span>
            </div>

            <div v-if="auth.isAuthenticated" class="mt-4 space-y-3">
              <div
                v-for="s in storesMine.slice(0, 3)"
                :key="s.slug"
                class="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
              >
                <div>
                  <p class="text-sm text-white/70">{{ s.slug }}</p>
                  <p class="text-base font-semibold">{{ s.name }}</p>
                </div>
                <span class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">Activa</span>
              </div>
              <p class="text-xs text-white/60">Vista previa de tus tiendas. Ajusta colores dentro de cada tienda.</p>
            </div>

            <div v-else class="mt-4 space-y-3 text-white/80">
              <p class="text-sm">Explora las tiendas disponibles y compra sin registrar.</p>
              <p class="text-xs text-white/60">Inicia sesión para administrar tus propias tiendas.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

      <section id="tiendas" class="relative z-10 max-w-6xl mx-auto px-6 py-14 space-y-10">
        <div class="grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <div v-if="auth.isAuthenticated" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Mis tiendas</p>
                <h3 class="text-xl font-semibold text-slate-900">Creadas o administradas por ti</h3>
              </div>
              <a
                href="#crear-tienda"
                class="text-sm font-semibold text-slate-600 underline decoration-dashed"
              >
                Crear tienda
              </a>
            </div>

            <div class="space-y-4">
              <div
                id="crear-tienda"
                class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div class="flex flex-col gap-3 sm:flex-row">
                  <input
                    v-model="newStoreName"
                    type="text"
                    placeholder="Nombre de tu nueva tienda"
                    class="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-slate-800 shadow-inner focus:border-slate-400 focus:outline-none"
                  />
                  <button
                    class="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    :style="{ backgroundColor: theme.accent }"
                    :disabled="creating || !newStoreName.trim()"
                    @click="createStore"
                  >
                    {{ creating ? 'Creando…' : 'Crear tienda' }}
                  </button>
                </div>
                <p v-if="createError" class="mt-2 text-sm text-red-600">{{ createError }}</p>
                <p v-else-if="createMessage" class="mt-2 text-sm text-green-600">{{ createMessage }}</p>
              </div>

              <div v-if="loadingMine" class="text-slate-500">Cargando tus tiendas...</div>
              <div v-else-if="storesMine.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
                No tienes tiendas asociadas aún. Crea una o solicita acceso.
              </div>
              <div v-else class="grid gap-4 sm:grid-cols-2">
                <StoreCard v-for="store in storesMine" :key="store.slug" :store="store" :accent="theme.accent" />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Todas las tiendas</p>
                <h3 class="text-xl font-semibold text-slate-900">Explora el marketplace</h3>
              </div>
              <input
                v-model="filterQuery"
                type="text"
                placeholder="Buscar tienda..."
                class="hidden w-56 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none sm:block"
              />
            </div>

            <div class="sm:hidden">
              <input
                v-model="filterQuery"
                type="text"
                placeholder="Buscar tienda..."
                class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none"
              />
            </div>

            <div v-if="loadingAll" class="text-slate-500">Cargando tiendas...</div>
            <div v-else-if="error" class="text-red-500">{{ error }}</div>
            <div v-else-if="filteredStoresAll.length === 0" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
              No hay tiendas que coincidan con tu búsqueda.
            </div>
            <div v-else class="grid gap-4 sm:grid-cols-2">
              <StoreCard v-for="store in filteredStoresAll" :key="store.slug" :store="store" :accent="theme.accent" />
            </div>
          </div>
        </div>
      </section>

      <section class="relative z-10 max-w-6xl mx-auto px-6 py-14 space-y-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Marketplace</p>
            <h3 class="text-2xl font-semibold text-slate-900">Productos destacados de todas las tiendas</h3>
            <p class="text-slate-600">Compra directo en la tienda propietaria sin salir del marketplace.</p>
          </div>
          <NuxtLink
            to="/marketplace"
            class="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="{ backgroundColor: theme.accent }"
          >
            Ir al marketplace
            <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>

        <div v-if="loadingMarketplace" class="text-slate-500">Cargando marketplace...</div>
        <div v-else-if="marketplaceError" class="text-red-600">{{ marketplaceError }}</div>
        <div v-else-if="!marketplaceProducts.length" class="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-slate-600">
          No hay productos de marketplace publicados todavía.
        </div>
        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="product in marketplaceProducts"
            :key="product.id"
            class="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div class="h-44 w-full overflow-hidden bg-slate-100">
              <img :src="productImage(product)" :alt="product.name" class="h-full w-full object-cover" />
            </div>
            <div class="p-4 space-y-2">
              <div class="flex items-center justify-between">
                <p class="text-xs uppercase text-slate-500">{{ product.category?.name || 'General' }}</p>
                <span class="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">{{ product.store?.slug || 'tienda' }}</span>
              </div>
              <h3 class="text-lg font-semibold text-slate-900 group-hover:text-slate-700 line-clamp-1">{{ product.name }}</h3>
              <p class="text-sm text-slate-600 line-clamp-2">{{ product.description }}</p>
              <div class="flex items-center gap-2">
                <p class="text-base font-bold" :style="{ color: theme.accent }">
                  <span v-if="product.offer_price" class="mr-1 text-slate-400 line-through">${{ product.price }}</span>
                  ${{ product.offer_price || product.price }}
                </p>
                <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
                <span v-else-if="product.offer_price" class="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">Oferta</span>
              </div>
              <div class="flex items-center gap-2 pt-1">
                <NuxtLink
                  :to="`/store/${product.store?.slug}/productos/${product.slug}`"
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-white shadow"
                  :style="{ backgroundColor: theme.accent }"
                >
                  Ir a la tienda
                </NuxtLink>
                <NuxtLink
                  :to="`/store/${product.store?.slug}`"
                  class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  Ver tienda
                </NuxtLink>
              </div>
            </div>
          </article>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import StoreCard from '~/components/StoreCard.vue'
import { useAuthStore } from '~/stores/auth'
import { useThemeStore } from '~/stores/theme'

type Store = { id: number; name: string; slug: string }

const config = useRuntimeConfig()
const auth = useAuthStore()
const theme = useThemeStore()

const storesAll = ref<Store[]>([])
const storesMine = ref<Store[]>([])
const loadingAll = ref(true)
const loadingMine = ref(false)
const marketplaceProducts = ref<any[]>([])
const loadingMarketplace = ref(true)
const marketplaceError = ref('')
const error = ref('')
const newStoreName = ref('')
const creating = ref(false)
const createError = ref('')
const createMessage = ref('')
const filterQuery = ref('')
const heroStyle = computed(() => ({
  backgroundImage: `linear-gradient(120deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
}))

const filteredStoresAll = computed(() => {
  const term = filterQuery.value.trim().toLowerCase()
  if (!term) return storesAll.value
  return storesAll.value.filter((s) => s.name.toLowerCase().includes(term) || s.slug.toLowerCase().includes(term))
})

const fetchAllStores = async () => {
  loadingAll.value = true
  error.value = ''
  try {
    storesAll.value = await $fetch<Store[]>(`${config.public.apiBase}/stores/`)
  } catch (err) {
    console.error(err)
    error.value = 'Error al cargar las tiendas'
  } finally {
    loadingAll.value = false
  }
}

const fetchMarketplace = async () => {
  loadingMarketplace.value = true
  marketplaceError.value = ''
  try {
    marketplaceProducts.value = await $fetch(`${config.public.apiBase}/marketplace/products/?limit=6`)
  } catch (err) {
    console.error(err)
    marketplaceError.value = 'Error al cargar el marketplace'
  } finally {
    loadingMarketplace.value = false
  }
}

const productImage = (product: any) => product?.images?.[0]?.image || 'https://via.placeholder.com/400x240?text=Producto'

const fetchMyStores = async () => {
  if (!auth.token) return
  loadingMine.value = true
  try {
    storesMine.value = await auth.fetchMyStores()
  } finally {
    loadingMine.value = false
  }
}

const createStore = async () => {
  if (!auth.token) {
    await navigateTo('/login')
    return
  }
  if (!newStoreName.value.trim()) {
    createError.value = 'Escribe el nombre de tu tienda'
    return
  }

  createError.value = ''
  createMessage.value = ''
  creating.value = true
  try {
    await $fetch<Store>(`${config.public.apiBase}/stores/`, {
      method: 'POST',
      body: { name: newStoreName.value },
      headers: { Authorization: `Bearer ${auth.token}` },
    })
    createMessage.value = 'Tienda creada correctamente'
    newStoreName.value = ''
    await Promise.all([fetchAllStores(), fetchMyStores()])
  } catch (err: any) {
    createError.value = err?.response?._data?.detail || 'No pudimos crear la tienda'
  } finally {
    creating.value = false
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  await fetchAllStores()
  await fetchMarketplace()
  if (auth.token) {
    await fetchMyStores()
  }
  theme.applyTheme()
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
</script>
