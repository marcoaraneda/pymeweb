<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#fff7ed_100%)] px-4 py-8 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <NuxtLink to="/marketplace#productos" class="inline-flex items-center text-sm font-semibold text-slate-700 transition hover:text-slate-900">← Volver</NuxtLink>

      <div v-if="loading" class="rounded-[28px] border border-slate-200 bg-white/90 p-8 text-slate-500 shadow-sm">Cargando producto...</div>
      <div v-else-if="error" class="rounded-[28px] border border-rose-200 bg-white/90 p-8 text-rose-700 shadow-sm">{{ error }}</div>
      <div v-else-if="!product" class="rounded-[28px] border border-slate-200 bg-white/90 p-8 text-slate-600 shadow-sm">Producto no encontrado.</div>

      <template v-else>
        <section class="grid gap-6 xl:grid-cols-[1.15fr,0.85fr]">
          <div class="space-y-6">
            <div class="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_-32px_rgba(15,23,42,0.45)]">
              <div class="grid gap-4 p-4 md:p-5 xl:grid-cols-[1fr,96px] xl:items-start">
                <div class="space-y-4">
                  <div class="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
                    <div class="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                      <span class="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-sm">Marketplace</span>
                      <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900 shadow-sm">Producto de la semana</span>
                    </div>
                    <button
                      v-if="canEdit"
                      type="button"
                      class="absolute right-4 top-4 z-10 rounded-full border border-amber-200 bg-white/95 px-4 py-2 text-xs font-semibold text-amber-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50"
                      @click="showEditForm = !showEditForm"
                    >
                      {{ showEditForm ? 'Cerrar editor' : 'Editar publicación' }}
                    </button>
                    <div class="aspect-square overflow-hidden bg-slate-100">
                      <img :src="productImage || '/logoPW.png'" :alt="product.name" class="h-full w-full object-cover" @error="onImgError($event)" />
                    </div>
                  </div>

                  <div class="flex gap-3 overflow-x-auto pb-1 xl:grid xl:grid-cols-4 xl:gap-3 xl:overflow-visible">
                    <button
                      v-for="(image, index) in galleryImages"
                      :key="`${image}-${index}`"
                      type="button"
                      class="group relative h-20 w-20 flex-none overflow-hidden rounded-2xl border transition sm:h-24 sm:w-24 xl:h-auto xl:w-full xl:aspect-square"
                      :class="activeGalleryIndex === index ? 'border-amber-400 ring-2 ring-amber-200' : 'border-slate-200 hover:border-slate-300'"
                      @click="selectGalleryImage(index)"
                    >
                      <img :src="image" :alt="`${product.name} foto ${index + 1}`" class="h-full w-full object-cover transition duration-300 group-hover:scale-105" @error="onImgError($event)" />
                      <span
                        v-if="activeGalleryIndex === index"
                        class="absolute inset-x-2 bottom-2 rounded-full bg-slate-900/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white"
                      >
                        Principal
                      </span>
                    </button>
                  </div>
                </div>

                <aside class="space-y-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 xl:p-4">
                  <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Resumen</p>
                  <h1 class="text-2xl font-semibold leading-tight text-slate-900 xl:text-3xl">{{ product.name }}</h1>
                  <div class="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    <span class="rounded-full bg-white px-3 py-1 shadow-sm">{{ product.category?.name || 'General' }}</span>
                    <span v-if="product.free_shipping" class="rounded-full bg-sky-100 px-3 py-1 text-sky-800">Envío gratis</span>
                    <span v-if="product.offer_price && Number(product.offer_min_qty || 1) > 1" class="rounded-full bg-rose-100 px-3 py-1 text-rose-700">Desde {{ Number(product.offer_min_qty) }} unidades</span>
                  </div>
                  <div class="rounded-[20px] bg-white p-4 shadow-sm">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</p>
                    <div class="mt-3 grid gap-3 sm:grid-cols-[1.15fr,0.85fr]">
                      <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Oferta</p>
                        <p v-if="product.offer_price" class="mt-2 text-2xl font-semibold text-slate-900">
                          {{ offerPackLabel }}
                        </p>
                        <p v-if="product.offer_price && offerMinQty > 1" class="mt-1 text-sm text-slate-600">
                          Total {{ formatClp(offerPackTotal) }} para {{ offerMinQty }} unidades
                        </p>
                        <p v-else-if="product.offer_price" class="mt-1 text-sm text-slate-600">
                          Precio promocional por unidad
                        </p>
                        <p v-else class="mt-2 text-2xl font-semibold text-slate-900">
                          {{ formatClp(normalUnitPrice) }}
                        </p>
                      </div>
                      <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                        <p class="text-xs uppercase tracking-[0.18em] text-emerald-700">Descuento</p>
                        <p v-if="product.offer_price" class="mt-2 text-xl font-semibold text-emerald-900">
                          {{ formatClp(offerUnitPrice) }} c/u
                        </p>
                        <p v-if="product.offer_price" class="mt-1 text-sm text-emerald-800">
                          Antes {{ formatClp(normalUnitPrice) }} c/u
                        </p>
                        <p v-if="product.offer_price" class="mt-1 text-xs font-semibold text-emerald-700">Ahorro {{ discountBadge }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="rounded-[20px] bg-white p-4 shadow-sm">
                    <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Vendedor</p>
                    <p class="mt-2 text-sm font-semibold text-slate-900">
                      <NuxtLink
                        v-if="product.submitted_by"
                        :to="`/marketplace/vendedores/${product.submitted_by}`"
                        class="hover:underline"
                      >
                        {{ product.submitted_by_name || 'Marketplace' }}
                      </NuxtLink>
                      <span v-else>{{ product.submitted_by_name || 'Marketplace' }}</span>
                    </p>
                    <p class="mt-1 text-xs text-slate-500">ID {{ product.id }}</p>
                  </div>
                  <div class="grid gap-2">
                    <NuxtLink
                      v-if="product.store?.slug && !product.store_is_marketplace"
                      :to="`/store/${product.store.slug}/productos/${product.slug}`"
                      class="inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                      :style="accentStyle"
                    >
                      Ver en tienda
                    </NuxtLink>
                    <button
                      class="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
                      :style="accentStyle"
                      @click="handleAddToCart"
                    >
                      <ShoppingCart class="h-4 w-4" aria-hidden="true" />
                      Agregar al carrito
                    </button>
                    <button
                      v-if="canEdit"
                      type="button"
                      class="rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-300 hover:bg-amber-50"
                      @click="showEditForm = true"
                    >
                      Abrir editor
                    </button>
                  </div>
                </aside>
              </div>
            </div>

            <div class="grid gap-4 md:grid-cols-[1.1fr,0.9fr]">
              <article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Descripción</p>
                <p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{{ product.description || 'Sin descripción disponible.' }}</p>
              </article>

              <article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
                <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Estado</p>
                <div class="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                  <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-3 py-1 text-amber-800">Destacado</span>
                  <span v-if="product.offer_price" class="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700">Oferta activa</span>
                  <span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">Stock {{ product.stock_available ?? 0 }}</span>
                </div>
                <p class="mt-3 text-sm text-slate-600">{{ product.free_shipping ? 'Este producto tiene envío gratis.' : 'El envío se calcula según la tienda.' }}</p>
              </article>
            </div>
          </div>

          <aside class="space-y-4">
            <article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Resumen comercial</p>
              <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Precio actual</p>
                  <p class="mt-2 text-2xl font-semibold text-slate-900">{{ formatClp(displayPrice) }}</p>
                </div>
                <div class="rounded-2xl bg-slate-50 p-4">
                  <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Visibilidad</p>
                  <p class="mt-2 text-sm font-semibold text-slate-900">Marketplace</p>
                  <p class="text-xs text-slate-500">La publicación es visible para todos los usuarios.</p>
                </div>
              </div>
            </article>

            <article class="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
              <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Acciones</p>
              <div class="mt-4 space-y-3">
                <button
                  class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  @click="showEditForm = true"
                >
                  {{ canEdit ? 'Editar publicación' : 'Ver editor' }}
                </button>
                <NuxtLink
                  v-if="product.store?.slug && !product.store_is_marketplace"
                  :to="`/store/${product.store.slug}`"
                  class="block rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Ver tienda origen
                </NuxtLink>
              </div>
            </article>
          </aside>
        </section>

        <section v-if="showEditForm" class="rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.4)]">
          <div class="flex flex-col gap-3 border-b border-slate-100 pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p class="text-xs uppercase tracking-[0.25em] text-slate-500">Editor premium</p>
              <h2 class="mt-1 text-2xl font-semibold text-slate-900">Editar publicación</h2>
              <p class="mt-1 text-sm text-slate-500">Ajusta el contenido, la imagen principal y la galería adicional.</p>
            </div>
            <span class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-900">Solo visible para quien la subió</span>
          </div>

          <div v-if="!canEdit" class="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Verificando permisos de edición...
          </div>

          <div class="mt-5 grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
            <div class="space-y-5">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2 md:col-span-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Nombre</label>
                  <input v-model="editForm.name" type="text" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Precio</label>
                  <input v-model.number="editForm.price" type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Categoría</label>
                  <select v-model="editForm.category" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100">
                    <option value="">Sin categoría</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
                  </select>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <input v-model="hasOffer" type="checkbox" class="h-4 w-4 rounded border-slate-300" />
                    Activar oferta
                  </label>
                </div>
                <div v-if="hasOffer" class="space-y-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Precio oferta</label>
                  <input v-model.number="editForm.offer_price" type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" />
                </div>
                <div v-if="hasOffer" class="space-y-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cantidad mínima</label>
                  <input v-model.number="editForm.offer_min_qty" type="number" min="1" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stock disponible</label>
                  <input v-model.number="editForm.stock_available" type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" />
                </div>
                <div class="space-y-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stock mínimo</label>
                  <input v-model.number="editForm.stock_minimum" type="number" min="0" step="1" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" />
                </div>
                <div v-if="supportsSizeStock" class="space-y-3 md:col-span-2">
                  <div class="flex items-center justify-between gap-3">
                    <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Cantidad por talla</label>
                    <span class="text-xs text-slate-400">Se suma automáticamente al stock</span>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <div v-for="size in availableSizes" :key="`detail-size-${size}`" class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{{ size }}</p>
                      <input
                        :value="sizeStockMap[size] || 0"
                        type="number"
                        min="0"
                        step="1"
                        class="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                        @input="updateSizeQty(size, $event)"
                      />
                    </div>
                  </div>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    <input v-model="editForm.free_shipping" type="checkbox" class="h-4 w-4 rounded border-slate-300" />
                    Envío gratis
                  </label>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Imagen principal</label>
                  <input v-model="editForm.image_url" type="url" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100" placeholder="https://..." />
                  <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <label class="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                      <input type="file" accept="image/*" class="hidden" @change="onFileSelect" />
                      <span>{{ uploadingImage ? 'Subiendo...' : 'Subir archivo' }}</span>
                    </label>
                    <button type="button" class="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" @click="editForm.image_url = productImage">Usar foto actual</button>
                  </div>
                  <p v-if="uploadError" class="text-xs text-rose-600">{{ uploadError }}</p>
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Descripción</label>
                  <textarea v-model="editForm.description" rows="4" class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"></textarea>
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Galería</p>
                    <p class="text-sm text-slate-600">Agrega más fotos para mostrar el producto desde distintos ángulos.</p>
                  </div>
                  <button
                    type="button"
                    class="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    @click="triggerGalleryPicker"
                  >
                    Subir archivo
                  </button>
                </div>

                <input ref="galleryPicker" type="file" accept="image/*" class="hidden" @change="onFileSelectGallery" />

                <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <button
                    v-for="(image, index) in galleryImages"
                    :key="`editor-gallery-${image}-${index}`"
                    type="button"
                    class="relative overflow-hidden rounded-2xl border bg-white text-left transition hover:-translate-y-0.5"
                    :class="activeGalleryIndex === index ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'"
                    @click="selectGalleryImage(index)"
                  >
                    <div class="aspect-square">
                      <img :src="image" :alt="`Foto ${index + 1}`" class="h-full w-full object-cover" @error="onImgError($event)" />
                    </div>
                    <div class="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                      <span class="font-semibold text-slate-700">Foto {{ index + 1 }}</span>
                      <span v-if="activeGalleryIndex === index" class="rounded-full bg-amber-100 px-2 py-1 font-semibold text-amber-800">Activa</span>
                    </div>
                  </button>
                </div>

                <div class="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
                  <input
                    v-model="newGalleryUrl"
                    type="url"
                    class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                    placeholder="Pega un enlace de imagen o sube un archivo"
                  />
                  <button
                    type="button"
                    class="rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60"
                    :style="accentStyle"
                    :disabled="galleryUploading"
                    @click="addGalleryImage"
                  >
                    {{ galleryUploading ? 'Agregando...' : 'Agregar foto' }}
                  </button>
                </div>
                <p v-if="galleryUploadError" class="mt-2 text-xs text-rose-600">{{ galleryUploadError }}</p>
              </div>
            </div>

            <aside class="space-y-4 rounded-[28px] border border-slate-200 bg-slate-50 p-4">
              <div class="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
                <div class="aspect-square bg-slate-100">
                  <img :src="productImage || '/logoPW.png'" :alt="product.name" class="h-full w-full object-cover" @error="onImgError($event)" />
                </div>
                <div class="space-y-2 p-4">
                  <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Vista previa</p>
                  <h3 class="text-lg font-semibold text-slate-900">{{ editForm.name || product.name }}</h3>
                  <p class="text-sm text-slate-600 line-clamp-3">{{ editForm.description || product.description || 'Sin descripción disponible.' }}</p>
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-sm font-semibold text-slate-900">{{ formatClp(editForm.price || product.price) }}</span>
                    <span class="text-xs text-slate-500">{{ galleryImages.length }} foto(s)</span>
                  </div>
                </div>
              </div>

              <div class="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Consejo</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">Usa una portada clara y al menos dos fotos extra para que la publicación se vea más confiable y profesional.</p>
              </div>
            </aside>
          </div>

          <div class="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <button
              class="rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:opacity-60"
              :style="accentStyle"
              :disabled="saving"
              @click="saveEdits"
            >
              {{ saving ? 'Guardando...' : 'Guardar cambios' }}
            </button>
            <p v-if="saveMessage" class="text-sm font-medium text-emerald-700">{{ saveMessage }}</p>
            <p v-if="saveError" class="text-sm font-medium text-rose-600">{{ saveError }}</p>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRuntimeConfig, navigateTo } from 'nuxt/app'
import { definePageMeta } from '#imports'
import { useCartStore } from '~/stores/cart'
import { useTenantStore } from '~/stores/tenant'
import { useThemeStore } from '~/stores/theme'
import { useAuthStore } from '~/stores/auth'
import { useImages } from '~/composables/useImages'
import { useMarketplaceRequests } from '~/composables/useMarketplaceRequests'
import { ShoppingCart } from 'lucide-vue-next'

definePageMeta({ layout: 'default' })

const route = useRoute()
const slugParam = route.params.slug as string
const config = useRuntimeConfig()
const cart = useCartStore()
const tenantStore = useTenantStore()
const theme = useThemeStore()
const auth = useAuthStore()
const { getProductImage } = useImages()
const { controlledGet, controlledMutation } = useMarketplaceRequests()

const product = ref<any | null>(null)
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const saveMessage = ref('')
const saveError = ref('')
const editForm = ref({ name: '', description: '', price: 0, offer_price: null as number | null, offer_min_qty: 1, category: '' as string | number, stock_available: 0, stock_minimum: 0, image_url: '', free_shipping: false })
const categories = ref<any[]>([])
const sizeStockMap = reactive<Record<string, number>>({})
const uploadingImage = ref(false)
const uploadError = ref('')
const galleryPicker = ref<HTMLInputElement | null>(null)
const galleryUploading = ref(false)
const galleryUploadError = ref('')
const newGalleryUrl = ref('')
const hasOffer = ref(false)
const activeGalleryIndex = ref(0)
const apparelSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const shoeSizes = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']

const selectedCategoryName = computed(() => {
  const selected = categories.value.find((cat: any) => String(cat.id) === String(editForm.value.category))
  return String(selected?.name || product.value?.category?.name || '').toLowerCase()
})

const supportsSizeStock = computed(() => /calzado|poleron|polerón|pantalon|pantalón/.test(selectedCategoryName.value))
const availableSizes = computed(() => (/calzado/.test(selectedCategoryName.value) ? shoeSizes : apparelSizes))

const syncStockFromSizes = () => {
  if (!supportsSizeStock.value) return
  editForm.value.stock_available = Object.values(sizeStockMap).reduce((acc, qty) => acc + (Number(qty) || 0), 0)
}

const updateSizeQty = (size: string, event: Event) => {
  const target = event.target as HTMLInputElement | null
  const qty = Math.max(0, Number(target?.value || 0))
  sizeStockMap[size] = qty
  syncStockFromSizes()
}

const accentStyle = computed(() => ({ backgroundColor: theme.accent || '#2563eb', color: '#fff' }))
const galleryImages = computed(() => {
  const images = (product.value?.images || [])
    .map((img: any) => img?.image || '')
    .filter(Boolean)

  const primary = editForm.value.image_url || product.value?.image_url || product.value?.image || getProductImage(product.value)
  if (primary && !images.includes(primary)) {
    images.unshift(primary)
  }

  return images.length ? images : ['/logoPW.png']
})
const productImage = computed(() => galleryImages.value[activeGalleryIndex.value] || galleryImages.value[0] || '/logoPW.png')
const displayPrice = computed(() => {
  if (product.value?.offer_price != null) {
    return Number(product.value.offer_price)
  }
  return Number(product.value?.price || 0)
})
const normalUnitPrice = computed(() => Number(product.value?.price || 0))
const offerMinQty = computed(() => Math.max(1, Number(product.value?.offer_min_qty || 1)))
const offerUnitPrice = computed(() => Number(product.value?.offer_price || 0))
const offerPackTotal = computed(() => offerUnitPrice.value * offerMinQty.value)
const offerPackLabel = computed(() => {
  if (!product.value?.offer_price) return ''
  return offerMinQty.value > 1
    ? `${offerMinQty.value}x ${formatClp(offerUnitPrice.value)}`
    : formatClp(offerUnitPrice.value)
})
const discountPercent = computed(() => {
  const price = Number(product.value?.price || 0)
  const offer = Number(product.value?.offer_price || 0)
  if (!price || !offer || offer >= price) return 0
  return Math.round(((price - offer) / price) * 100)
})
const discountBadge = computed(() => (discountPercent.value > 0 ? `${discountPercent.value}%` : ''))
const formatClp = (value: number | string) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number(value) || 0)
const canEdit = computed(() => {
  const userId = String((auth.user as any)?.id ?? '')
  const username = String((auth.user as any)?.username ?? '').trim().toLowerCase()
  const candidateOwnerId =
    product.value?.submitted_by ??
    product.value?.submitted_by_id ??
    product.value?.owner_id ??
    product.value?.user_id ??
    product.value?.owner?.id ??
    product.value?.user?.id ??
    ''
  const submittedBy = String(
    typeof candidateOwnerId === 'object' && candidateOwnerId !== null
      ? (candidateOwnerId as any).id ?? ''
      : candidateOwnerId,
  )
  const submittedByName = String(
    product.value?.submitted_by_name ??
      product.value?.owner_name ??
      product.value?.user_name ??
      '',
  )
    .trim()
    .toLowerCase()
  const byId = Boolean(userId && submittedBy && userId === submittedBy)
  const byName = Boolean(username && submittedByName && username === submittedByName)
  const byFlag = Boolean(product.value?.is_owner === true)
  return byId || byName || byFlag
})
const showEditForm = ref(false)
const wantsEditFromQuery = computed(() => String(route.query.edit || '') === '1')

const selectGalleryImage = (index: number) => {
  activeGalleryIndex.value = index
}

const triggerGalleryPicker = () => {
  galleryPicker.value?.click()
}

const ensureCloudinaryUrl = async (currentUrl?: string) => {
  if (!currentUrl) return ''
  if (currentUrl.includes('res.cloudinary.com')) return currentUrl
  const result = await uploadToCloudinary(currentUrl, 'upload/product')
  if (!result?.secure_url) throw new Error('No pudimos subir la imagen a Cloudinary')
  return result.secure_url
}

watch(
  galleryImages,
  (images) => {
    if (!images.length) {
      activeGalleryIndex.value = 0
      return
    }
    if (activeGalleryIndex.value > images.length - 1) {
      activeGalleryIndex.value = 0
    }
  },
  { immediate: true },
)

watch([canEdit, wantsEditFromQuery], ([editable, wantsEdit]) => {
  if (wantsEdit) {
    showEditForm.value = true
    return
  }
  if (!editable && showEditForm.value) {
    showEditForm.value = false
  }
}, { immediate: true })

const isHttpsUrl = (value?: string) => {
  if (!value) return false
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const onImgError = (event: Event) => {
  const target = event.target as HTMLImageElement | null
  if (!target) return
  target.onerror = null
  target.src = '/logoPW.png'
}

const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})

const loadProduct = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await controlledGet<any>(
      `marketplace:product:${encodeURIComponent(slugParam)}`,
      `${config.public.apiBase}/marketplace/products/${encodeURIComponent(slugParam)}/`,
      { backoffMs: 8_000, minIntervalMs: 300 },
    )
    product.value = data
    editForm.value = {
      name: data.name || '',
      description: data.description || '',
      price: Number(data.price) || 0,
      offer_price: data.offer_price ? Number(data.offer_price) : null,
      offer_min_qty: Math.max(1, Number(data.offer_min_qty || 1)),
      category: data.category?.id || '',
      stock_available: Number(data.stock_available || 0),
      stock_minimum: Number(data.stock_minimum || 0),
      image_url: data.image_url || data.images?.[0]?.image || data.image || '',
      free_shipping: Boolean(data.free_shipping),
    }
    activeGalleryIndex.value = 0
    Object.keys(sizeStockMap).forEach((key) => delete sizeStockMap[key])
    const map = data?.size_stock_map || {}
    Object.entries(map).forEach(([size, qty]) => {
      const n = Math.max(0, Number(qty || 0))
      if (n > 0) sizeStockMap[size] = n
    })
    hasOffer.value = editForm.value.offer_price != null
    if (data?.store?.slug) {
      tenantStore.setSlug(data.store.slug)
      theme.applyStoreTheme(data.store.slug)
    } else {
      theme.loadFromStorage()
      theme.applyTheme()
    }
  } catch (err: any) {
    // Fallback: intentar por ID si el slug falla y parece numérico
    const numericId = Number(slugParam)
    if (!product.value && Number.isFinite(numericId)) {
      try {
        const data = await controlledGet<any>(
          `marketplace:product:${numericId}`,
          `${config.public.apiBase}/marketplace/products/${numericId}/`,
          { backoffMs: 8_000, minIntervalMs: 300 },
        )
        product.value = data
        editForm.value = {
          name: data.name || '',
          description: data.description || '',
          price: Number(data.price) || 0,
          offer_price: data.offer_price ? Number(data.offer_price) : null,
          offer_min_qty: Math.max(1, Number(data.offer_min_qty || 1)),
          category: data.category?.id || '',
          stock_available: Number(data.stock_available || 0),
          stock_minimum: Number(data.stock_minimum || 0),
          image_url: data.image_url || data.images?.[0]?.image || data.image || '',
          free_shipping: Boolean(data.free_shipping),
        }
        activeGalleryIndex.value = 0
        hasOffer.value = editForm.value.offer_price != null
        if (data?.store?.slug) {
          tenantStore.setSlug(data.store.slug)
          theme.applyStoreTheme(data.store.slug)
        } else {
          theme.loadFromStorage()
          theme.applyTheme()
        }
        return
      } catch (err2: any) {
        /* fallthrough */
      }
    }
    const detail = err?.response?._data?.detail || err?.response?._data
    error.value = typeof detail === 'string' ? detail : 'Producto no encontrado'
    product.value = null
  } finally {
    loading.value = false
  }
}

const handleAddToCart = async () => {
  if (!product.value) return
  cart.setContext('marketplace')
  cart.addProduct(product.value)
  await navigateTo('/marketplace/carrito')
}

const saveEdits = async () => {
  if (!product.value || !auth.token) {
    saveError.value = 'Inicia sesión para editar tu publicación'
    return
  }
  if (!editForm.value.name?.trim()) {
    saveError.value = 'Ingresa un nombre'
    return
  }
  if (!editForm.value.price || editForm.value.price <= 0) {
    saveError.value = 'El precio debe ser mayor a 0'
    return
  }
  if (hasOffer.value) {
    if (editForm.value.offer_price == null || editForm.value.offer_price <= 0) {
      saveError.value = 'La oferta debe ser mayor a 0'
      return
    }
    if (Number(editForm.value.offer_price) >= Number(editForm.value.price)) {
      saveError.value = 'La oferta debe ser menor al precio'
      return
    }
    if (Number(editForm.value.offer_min_qty || 0) < 1) {
      saveError.value = 'La cantidad mínima para oferta debe ser al menos 1'
      return
    }
  }
  if (editForm.value.stock_available != null && editForm.value.stock_available < 0) {
    saveError.value = 'El stock no puede ser negativo'
    return
  }
  if (editForm.value.stock_minimum != null && editForm.value.stock_minimum < 0) {
    saveError.value = 'El stock mínimo no puede ser negativo'
    return
  }
  if (uploadingImage.value) {
    saveError.value = 'Espera a que termine la subida de imagen'
    return
  }
  if (editForm.value.image_url && !isHttpsUrl(editForm.value.image_url)) {
    saveError.value = 'La imagen debe ser un enlace válido con https'
    return
  }
  saving.value = true
  saveMessage.value = ''
  saveError.value = ''
  try {
    const updated = await controlledMutation<any>(
      `marketplace:product:update:${encodeURIComponent(product.value.id || slugParam)}`,
      `${config.public.apiBase}/marketplace/products/${encodeURIComponent(product.value.id || slugParam)}/`,
      {
        method: 'PATCH',
        body: {
          name: editForm.value.name,
          description: editForm.value.description,
          price: editForm.value.price,
          offer_price: hasOffer.value ? editForm.value.offer_price : null,
          offer_min_qty: hasOffer.value ? Math.max(1, Number(editForm.value.offer_min_qty) || 1) : 1,
          category: editForm.value.category || null,
          stock_available: editForm.value.stock_available,
          stock_minimum: editForm.value.stock_minimum,
          size_stock_map: supportsSizeStock.value ? Object.fromEntries(Object.entries(sizeStockMap).filter(([_, qty]) => Number(qty) > 0)) : {},
          image_url: editForm.value.image_url,
          free_shipping: Boolean(editForm.value.free_shipping),
        },
        headers: { Authorization: `Bearer ${auth.token}` },
        backoffMs: 10_000,
      },
    )
    product.value = updated
    activeGalleryIndex.value = 0
    saveMessage.value = 'Cambios guardados'
  } catch (err: any) {
    const detail = err?.response?._data?.detail || err?.response?._data
    saveError.value = typeof detail === 'string' ? detail : 'No pudimos guardar los cambios'
  } finally {
    saving.value = false
  }
}

const fetchCategories = async () => {
  try {
    categories.value = await $fetch(`${config.public.apiBase}/marketplace/categories/`)
  } catch {
    categories.value = []
  }
}

const uploadToCloudinary = async (fileOrUrl: File | string, folder = 'upload/product') => {
  if (!cloudinaryUploadUrl.value || !config.public.cloudinaryUploadPreset) {
    throw new Error('Configura CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET')
  }
  const formData = new FormData()
  formData.append('file', fileOrUrl)
  formData.append('upload_preset', config.public.cloudinaryUploadPreset)
  formData.append('folder', folder)
  return $fetch<any>(cloudinaryUploadUrl.value, { method: 'POST', body: formData })
}

const addGalleryImage = async () => {
  if (!product.value || !auth.token || galleryUploading.value) return
  const raw = newGalleryUrl.value.trim()
  if (!raw) {
    galleryUploadError.value = 'Pega una URL o sube una foto primero'
    return
  }

  galleryUploading.value = true
  galleryUploadError.value = ''
  saveError.value = ''
  try {
    const cloudUrl = await ensureCloudinaryUrl(raw)
    const updated = await controlledMutation<any>(
      `marketplace:product:gallery:${encodeURIComponent(product.value.id || slugParam)}`,
      `${config.public.apiBase}/marketplace/products/${encodeURIComponent(product.value.id || slugParam)}/`,
      {
        method: 'PATCH',
        body: { extra_images: [cloudUrl] },
        headers: { Authorization: `Bearer ${auth.token}` },
        backoffMs: 10_000,
      },
    )
    product.value = updated
    newGalleryUrl.value = ''
    saveMessage.value = 'Foto agregada a la galería'
    activeGalleryIndex.value = Math.max(0, (updated?.images?.length || 1) - 1)
  } catch (err: any) {
    const detail = err?.response?._data?.detail || err?.response?._data
    galleryUploadError.value = typeof detail === 'string' ? detail : err?.message || 'No pudimos agregar la foto'
  } finally {
    galleryUploading.value = false
  }
}

const onFileSelectGallery = async (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const file = target?.files?.[0]
  if (!file) return
  galleryUploadError.value = ''
  galleryUploading.value = true
  try {
    const result = await uploadToCloudinary(file)
    if (!result?.secure_url) throw new Error('No pudimos obtener la URL de la imagen')
    newGalleryUrl.value = result.secure_url
    await addGalleryImage()
  } catch (err: any) {
    galleryUploadError.value = err?.message || 'No pudimos subir la imagen'
  } finally {
    galleryUploading.value = false
    if (target) target.value = ''
  }
}

const onFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return
  uploadError.value = ''
  uploadingImage.value = true
  try {
    const result = await uploadToCloudinary(file)
    if (!result?.secure_url) throw new Error('No pudimos obtener la URL de la imagen')
    editForm.value.image_url = result.secure_url
    if (product.value) {
      product.value.image_url = result.secure_url
    }
  } catch (err: any) {
    uploadError.value = err?.message || 'No pudimos subir la imagen'
  } finally {
    uploadingImage.value = false
    if (target) target.value = ''
  }
}

onMounted(async () => {
  theme.loadFromStorage()
  auth.restoreFromCookies()
  if (wantsEditFromQuery.value) {
    showEditForm.value = true
  }
  await auth.initializeSession().catch(() => null)
  cart.loadFromStorage()
  cart.setContext('marketplace')
  await fetchCategories()
  await loadProduct()
  if (wantsEditFromQuery.value) {
    showEditForm.value = true
  }
})

watch(
  () => editForm.value.offer_price,
  (value) => {
    if (value == null) return
    hasOffer.value = true
  },
)

watch(hasOffer, (enabled) => {
  if (!enabled) {
    editForm.value.offer_price = null
    editForm.value.offer_min_qty = 1
  }
})

watch([supportsSizeStock, availableSizes], () => {
  if (!supportsSizeStock.value) {
    Object.keys(sizeStockMap).forEach((key) => delete sizeStockMap[key])
    return
  }
  availableSizes.value.forEach((size) => {
    if (sizeStockMap[size] == null) sizeStockMap[size] = 0
  })
  Object.keys(sizeStockMap).forEach((size) => {
    if (!availableSizes.value.includes(size)) delete sizeStockMap[size]
  })
  syncStockFromSizes()
}, { immediate: true })
</script>
