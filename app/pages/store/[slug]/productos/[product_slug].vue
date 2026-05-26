<template>
  <div v-if="product" class="relative mx-auto max-w-5xl space-y-10 px-4 py-10">
    <NuxtLink
      v-if="isStoreOwner"
      :to="`/store/${route.params.slug}/admin/productos/${route.params.product_slug}/editar`"
      class="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
      aria-label="Editar producto"
    >
      <Pencil class="h-4 w-4" aria-hidden="true" />
    </NuxtLink>
    <div class="grid gap-10 md:grid-cols-[1.05fr,0.95fr]">
      <div class="space-y-3">
      <div
        class="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition"
        :class="zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
        @click="toggleZoom"
        @mousemove="handleZoomMove"
        @mouseleave="handleZoomLeave"
      >
        <img
          :src="activeImage"
          :alt="product.name"
          class="h-full w-full object-cover transition duration-300"
          :class="zoomed ? 'scale-150' : 'scale-100'"
          :style="zoomed ? { transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%` } : undefined"
        />
        <button
          type="button"
          class="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 shadow"
          @click.stop="zoomOpen = true"
          aria-label="Ampliar imagen del producto"
        >
          <Search class="h-4 w-4" aria-hidden="true" />
          Ver grande
        </button>
        <button
          v-if="showInlineOwnerControls"
          type="button"
          class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-800 shadow"
          @click.stop="startEdit('image')"
          aria-label="Editar imagen principal"
        >
          <Pencil class="h-4 w-4" aria-hidden="true" />
          Editar imagen
        </button>
      </div>
      <div class="flex items-center gap-3 overflow-x-auto pb-2">
        <button
          v-for="(image, index) in galleryImages"
          :key="index"
          type="button"
          class="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border transition"
          :class="activeImageIndex === index ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'"
          @click="selectImage(index)"
        >
          <img :src="image" :alt="`Miniatura ${index + 1}`" class="h-full w-full object-cover" />
        </button>
        <button
          v-if="showInlineOwnerControls"
          type="button"
          class="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:-translate-y-0.5 hover:border-slate-400 hover:text-slate-700"
          @click="triggerGalleryPicker"
        >
          <span class="text-xl font-bold">+</span>
        </button>
        <input ref="galleryPicker" type="file" accept="image/*" class="hidden" @change="onFileSelectGallery" />
      </div>
      <div
        v-if="showInlineOwnerControls && editing.image"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3"
      >
        <label class="text-sm font-semibold text-slate-700">URL de imagen principal</label>
        <input
          v-model="form.image_url"
          type="url"
          placeholder="https://..."
          class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600">
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 cursor-pointer hover:-translate-y-0.5 transition">
            <input type="file" accept="image/*" class="hidden" @change="onFileSelect" />
            <span>{{ uploadingImage ? 'Subiendo...' : 'Subir archivo' }}</span>
          </label>
          <span class="text-slate-500">o pega un enlace</span>
        </div>
        <p v-if="uploadError" class="text-xs text-red-600">{{ uploadError }}</p>
        <p v-else-if="uploadingImage" class="text-xs text-slate-500">Procesando imagen...</p>
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="{ backgroundColor: accentColor }"
            :disabled="savingField === 'image'"
            @click="saveImage"
          >
            {{ savingField === 'image' ? 'Guardando...' : 'Guardar imagen' }}
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            @click="cancelEdit('image')"
          >
            Cancelar
          </button>
          <p v-if="updateMessage && savingField === 'image'" class="text-sm" :class="updateStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">
            {{ updateMessage }}
          </p>
        </div>
      </div>

      <div v-if="showInlineOwnerControls" class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
        <label class="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
          <input v-model="form.product_of_week" type="checkbox" class="h-4 w-4 accent-amber-600" />
          <span>Mostrar en Destacados de la semana</span>
        </label>
        <button
          class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
          :style="{ backgroundColor: accentColor }"
          :disabled="savingWeekly"
          @click="saveWeekly"
        >
          {{ savingWeekly ? 'Guardando...' : 'Guardar destacado' }}
        </button>
      </div>

      <div v-if="isTech && techSpecsList.length" class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Especificaciones técnicas</p>
        <div class="max-h-48 space-y-2 overflow-y-auto pr-1">
          <div
            v-for="spec in techSpecsList"
            :key="spec"
            class="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
          >
            <span class="mt-1 h-2 w-2 rounded-full bg-slate-400"></span>
            <span class="flex-1">{{ spec }}</span>
          </div>
        </div>
      </div>


      </div>

      <div class="space-y-4">
      <div class="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-500">
        <div class="flex items-center gap-2">
          <span v-if="!editing.category">{{ categoryLabel }}</span>
          <div v-else class="flex flex-wrap items-center gap-2">
            <select v-model="form.category" :disabled="loadingCategories" class="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700 disabled:bg-slate-100">
              <option value="">Sin categoría</option>
              <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <p v-if="categoriesError" class="text-[11px] text-red-600">{{ categoriesError }}</p>
            <button
              class="rounded-lg bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white shadow disabled:opacity-60"
              :disabled="savingField === 'category'"
              @click="saveCategory"
            >
              {{ savingField === 'category' ? 'Guardando...' : 'Guardar' }}
            </button>
            <button type="button" class="rounded-lg px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100" @click="cancelEdit('category')">Cancelar</button>
          </div>
        </div>
        <span v-if="product.is_marketplace" class="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold text-blue-800">Marketplace</span>
        <span v-if="product.product_of_week" class="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold text-amber-800">Producto de la semana</span>
        <button
          v-if="showInlineOwnerControls && !editing.category"
          type="button"
          class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          @click="startEdit('category')"
        >
          <Pencil class="h-3.5 w-3.5" aria-hidden="true" />
          Cambiar categoría
        </button>
      </div>

      <div class="flex items-start gap-2">
        <div class="flex-1">
          <div class="flex items-start gap-2">
            <h1 v-if="!editing.name" class="text-4xl font-bold text-slate-900">{{ product.name }}</h1>
            <div v-else class="w-full max-w-xl space-y-2">
              <input v-model="form.name" type="text" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-lg font-semibold text-slate-900" />
              <div class="flex flex-wrap items-center gap-2">
                <button
                  class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
                  :style="{ backgroundColor: accentColor }"
                  :disabled="savingField === 'name'"
                  @click="saveName"
                >
                  {{ savingField === 'name' ? 'Guardando...' : 'Guardar' }}
                </button>
                <button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="cancelEdit('name')">Cancelar</button>
              </div>
            </div>
          </div>
        </div>
        <button
          v-if="showInlineOwnerControls && !editing.name"
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          @click="startEdit('name')"
          aria-label="Editar nombre"
        >
          <Pencil class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>


      <div class="space-y-3">
        <div class="flex items-start gap-2">
          <p v-if="!editing.description" class="flex-1 text-slate-600">{{ product.description }}</p>
          <div v-else class="w-full space-y-2">
            <textarea v-model="form.description" rows="3" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
            <div class="flex flex-wrap items-center gap-2">
              <button
                class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
                :style="{ backgroundColor: accentColor }"
                :disabled="savingField === 'description'"
                @click="saveDescription"
              >
                {{ savingField === 'description' ? 'Guardando...' : 'Guardar' }}
              </button>
              <button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="cancelEdit('description')">Cancelar</button>
            </div>
          </div>
          <button
            v-if="showInlineOwnerControls && !editing.description"
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
            @click="startEdit('description')"
            aria-label="Editar descripción"
          >
            <Pencil class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Categoría</p>
              <p class="text-sm font-semibold text-slate-800">{{ categoryLabel }}</p>
              <p class="text-xs text-slate-500">Se guarda usando el ID numérico del catálogo.</p>
            </div>
            <button
              v-if="showInlineOwnerControls"
              type="button"
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-100"
              @click="openCategoryPanel"
            >
              <Pencil class="h-4 w-4" aria-hidden="true" />
              Cambiar categoría
            </button>
          </div>
        </div>

        <div v-if="hasCategoryDetails" class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Detalles del producto</p>
          <div class="flex flex-wrap gap-2 text-sm text-slate-700">
            <span v-if="categoryAttrs.clothingType" class="rounded-full border border-slate-200 px-3 py-1">Tipo: {{ categoryAttrs.clothingType }}</span>
            <span v-if="categoryAttrs.audience" class="rounded-full border border-slate-200 px-3 py-1">Público: {{ categoryAttrs.audience }}</span>
            <span v-if="categoryAttrs.size" class="rounded-full border border-slate-200 px-3 py-1">Talla: {{ categoryAttrs.size }}</span>
            <span v-if="categoryAttrs.shoeSizeUS" class="rounded-full border border-slate-200 px-3 py-1">Talla US: {{ categoryAttrs.shoeSizeUS }}</span>
            <span v-if="categoryAttrs.brand" class="rounded-full border border-slate-200 px-3 py-1">Marca: {{ categoryAttrs.brand }}</span>
            <span v-if="categoryAttrs.homeSpace" class="rounded-full border border-slate-200 px-3 py-1">Espacio: {{ categoryAttrs.homeSpace }}</span>
            <span v-if="categoryAttrs.foodType" class="rounded-full border border-slate-200 px-3 py-1">Alimento: {{ categoryAttrs.foodType }}</span>
            <span v-if="categoryAttrs.foodSize" class="rounded-full border border-slate-200 px-3 py-1">Presentación: {{ categoryAttrs.foodSize }}</span>
            <span v-if="categoryAttrs.petType" class="rounded-full border border-slate-200 px-3 py-1">Mascota: {{ categoryAttrs.petType }}</span>
            <span v-if="categoryAttrs.petItemType" class="rounded-full border border-slate-200 px-3 py-1">Artículo: {{ categoryAttrs.petItemType }}</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3 text-2xl font-bold" v-if="!editing.price">
          <div class="grid flex-1 gap-3 sm:grid-cols-[1.15fr,0.85fr]">
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="text-xs uppercase tracking-[0.18em] text-slate-500">Oferta</p>
              <p v-if="product.offer_price" class="mt-2 text-2xl font-semibold text-slate-900">{{ offerPackLabel }}</p>
              <p v-if="product.offer_price && offerMinQty > 1" class="mt-1 text-sm font-medium text-slate-600">
                Total {{ formatClp(offerPackTotal) }} para {{ offerMinQty }} unidades
              </p>
              <p v-else-if="product.offer_price" class="mt-1 text-sm font-medium text-slate-600">Precio promocional por unidad</p>
              <p v-else class="mt-2 text-2xl font-semibold text-slate-900">{{ formatClp(displayPrice) }}</p>
            </div>
            <div class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-left">
              <p class="text-xs uppercase tracking-[0.18em] text-emerald-700">Descuento</p>
              <p v-if="product.offer_price" class="mt-2 text-xl font-semibold text-emerald-900">{{ formatClp(offerUnitPrice) }} c/u</p>
              <p v-if="product.offer_price" class="mt-1 text-sm text-emerald-800">Antes {{ formatClp(normalUnitPrice) }} c/u</p>
              <p v-if="product.offer_price" class="mt-1 text-xs font-semibold text-emerald-700">Ahorro {{ discountBadge }}</p>
            </div>
          </div>
          <span class="inline-flex h-9 w-9" aria-hidden="true"></span>
        </div>
        <div v-else-if="showInlineOwnerControls" class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="grid gap-3 sm:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio</label>
              <input v-model.number="form.price" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Precio oferta</label>
              <input v-model.number="form.offer_price" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div class="space-y-1 sm:col-span-2">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Cantidad mínima para oferta</label>
              <input v-model.number="form.offer_min_qty" type="number" min="1" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
              :style="{ backgroundColor: accentColor }"
              :disabled="savingField === 'price'"
              @click="savePrice"
            >
              {{ savingField === 'price' ? 'Guardando...' : 'Guardar precios' }}
            </button>
            <button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="cancelEdit('price')">Cancelar</button>
          </div>
        </div>
      </div>

      <div class="flex items-start gap-2">
        <div class="flex flex-wrap items-center gap-2 text-sm font-semibold" :class="stockDescriptor.tone" v-if="!editing.stock">
          <span class="rounded-full px-3 py-1" :class="stockDescriptor.pill">
            {{ stockDescriptor.label }}
          </span>
          <span class="text-slate-600" v-if="isStoreOwner">(Base: {{ availableStock }} | Mínimo: {{ form.stock_minimum }})</span>
        </div>
        <button
          v-if="showInlineOwnerControls && !editing.stock"
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          @click="startEdit('stock')"
          aria-label="Editar stock"
        >
          <Pencil class="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div v-if="isClothing && availableSizes.length" class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Tallas</p>
          <span class="text-xs text-slate-500">Stock para {{ selectedSize || 'talla' }}: {{ availableStock }}</span>
        </div>
        <div class="max-w-xs">
          <select
            v-model="selectedSize"
            class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option v-for="size in availableSizes" :key="size" :value="size">
              {{ size }} ({{ sizeStock[size] || 0 }})
            </option>
          </select>
        </div>
        <p class="text-xs text-slate-500">Solo se muestran tallas con stock.</p>
      </div>

      <div v-if="showInlineOwnerControls && editing.stock" class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock base</label>
            <input v-model.number="form.stock_available" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock mínimo</label>
            <input v-model.number="form.stock_minimum" type="number" min="0" step="1" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
            :style="{ backgroundColor: accentColor }"
            :disabled="savingField === 'stock'"
            @click="saveStock"
          >
            {{ savingField === 'stock' ? 'Guardando...' : 'Guardar stock' }}
          </button>
          <button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="cancelEdit('stock')">Cancelar</button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Etiquetas</p>
          <button
            v-if="showInlineOwnerControls && !editing.tags"
            type="button"
            class="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            @click="startEdit('tags')"
          >
            Editar
          </button>
        </div>

        <div v-if="editing.tags" class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Escribe etiquetas separadas por coma</label>
          <input
            v-model="form.tagsInput"
            type="text"
            placeholder="Ej: Envío gratis, Orgánico, Nuevo"
            class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <div class="flex flex-wrap items-center gap-2">
            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow"
              :style="{ backgroundColor: accentColor }"
              :disabled="savingField === 'tags'"
              @click="saveTags"
            >
              {{ savingField === 'tags' ? 'Guardando...' : 'Guardar etiquetas' }}
            </button>
            <button type="button" class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="cancelEdit('tags')">Cancelar</button>
          </div>
        </div>

        <div v-else class="flex flex-wrap gap-2 text-sm text-slate-700">
          <span
            v-for="tag in displayTags"
            :key="tag"
            class="rounded-full border border-slate-200 px-3 py-1"
          >
            {{ tag }}
          </span>
          <span v-if="!displayTags.length" class="rounded-full border border-dashed border-slate-200 px-3 py-1 text-slate-500">Añade etiquetas para destacar este producto</span>
        </div>
      </div>

          <div v-if="hasCategoryDetails" class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Detalles del producto</p>
            <div class="flex flex-wrap gap-2 text-sm text-slate-700">
              <span v-if="categoryAttrs.clothingType" class="rounded-full border border-slate-200 px-3 py-1">Tipo: {{ categoryAttrs.clothingType }}</span>
              <span v-if="categoryAttrs.audience" class="rounded-full border border-slate-200 px-3 py-1">Público: {{ categoryAttrs.audience }}</span>
              <span v-if="categoryAttrs.size" class="rounded-full border border-slate-200 px-3 py-1">Talla: {{ categoryAttrs.size }}</span>
              <span v-if="categoryAttrs.shoeSizeUS" class="rounded-full border border-slate-200 px-3 py-1">Talla US: {{ categoryAttrs.shoeSizeUS }}</span>
              <span v-if="categoryAttrs.brand" class="rounded-full border border-slate-200 px-3 py-1">Marca: {{ categoryAttrs.brand }}</span>
              <span v-if="categoryAttrs.homeSpace" class="rounded-full border border-slate-200 px-3 py-1">Espacio: {{ categoryAttrs.homeSpace }}</span>
              <span v-if="categoryAttrs.foodType" class="rounded-full border border-slate-200 px-3 py-1">Alimento: {{ categoryAttrs.foodType }}</span>
              <span v-if="categoryAttrs.foodSize" class="rounded-full border border-slate-200 px-3 py-1">Presentación: {{ categoryAttrs.foodSize }}</span>
              <span v-if="categoryAttrs.petType" class="rounded-full border border-slate-200 px-3 py-1">Mascota: {{ categoryAttrs.petType }}</span>
              <span v-if="categoryAttrs.petItemType" class="rounded-full border border-slate-200 px-3 py-1">Artículo: {{ categoryAttrs.petItemType }}</span>
            </div>
          </div>

      <div v-if="hasCategoryDetails" class="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Detalles del producto</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <div v-if="categoryAttrs.brand" class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
            <p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Marca</p>
            <p class="font-semibold">{{ categoryAttrs.brand }}</p>
          </div>
          <div v-if="categoryAttrs.clothingType" class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
            <p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Tipo</p>
            <p class="font-semibold">{{ categoryAttrs.clothingType }}</p>
          </div>
          <div v-if="categoryAttrs.size" class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
            <p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Talla base</p>
            <p class="font-semibold">{{ categoryAttrs.size }}</p>
          </div>
          <div v-if="categoryAttrs.shoeSizeUS" class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
            <p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Talla US</p>
            <p class="font-semibold">{{ categoryAttrs.shoeSizeUS }}</p>
          </div>
          <div v-if="techSpecsList.length" class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800 sm:col-span-2">
            <p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Especificaciones</p>
            <p class="font-semibold">{{ techSpecsList.join(', ') }}</p>
          </div>
        </div>
      </div>

      <div v-if="showInlineOwnerControls && (isClothing || isTech || isShoes)" class="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Info adicional según categoría</p>
            <h3 class="text-sm font-semibold text-slate-800">Completa detalles clave (se guardan como etiquetas internas)</h3>
          </div>
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
            :style="{ backgroundColor: accentColor }"
            :disabled="savingField === 'tags'"
            @click="saveCategoryAttributes"
          >
            {{ savingField === 'tags' ? 'Guardando...' : 'Guardar detalles' }}
          </button>
        </div>
        <div v-if="isClothing" class="space-y-4">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla base</label>
              <select v-model="categoryAttrs.size" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Selecciona talla</option>
                <option v-for="size in sizeOptions" :key="size" :value="size">{{ size }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de prenda</label>
              <select v-model="categoryAttrs.clothingType" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Selecciona tipo</option>
                <option v-for="type in ['Camisa','Pantalón','Vestido','Chaqueta','Sudadera','Short','Falda','Accesorio']" :key="type" :value="type">{{ type }}</option>
              </select>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label>
            <select v-model="categoryAttrs.audience" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">Selecciona</option>
              <option v-for="aud in ['Niño','Niña','Mujer','Hombre','Unisex']" :key="aud" :value="aud">{{ aud }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Stock por talla</p>
            <div class="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              <div
                v-for="size in sizeOptions"
                :key="size"
                class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              >
                <label class="font-semibold text-slate-700">{{ size }}</label>
                <input
                  type="number"
                  min="0"
                  class="w-20 rounded-lg border border-slate-200 px-2 py-1 text-right"
                  v-model.number="sizeStock[size]"
                />
              </div>
            </div>
            <p class="text-xs text-slate-500">Se mostrará disponibilidad según talla seleccionada.</p>
          </div>
        </div>
        <div v-if="isTech" class="space-y-1">
          <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Especificaciones técnicas</label>
          <textarea v-model="categoryAttrs.techSpecs" rows="3" placeholder="Ej: 16GB RAM, 512GB SSD, Pantalla 144Hz" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
          <p class="text-xs text-slate-500">Se guardan como etiqueta interna "specs:..." para mostrar después en layout.</p>
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label>
            <input v-model="categoryAttrs.brand" type="text" placeholder="Ej: Samsung, Apple" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div v-if="isShoes" class="space-y-4">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (EU)</label>
              <select v-model="categoryAttrs.size" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Selecciona</option>
                <option v-for="size in shoeSizesEU" :key="`eu-${size}`" :value="`EU-${size}`">EU {{ size }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Talla (US)</label>
              <select v-model="categoryAttrs.shoeSizeUS" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Selecciona</option>
                <option v-for="size in shoeSizesUS" :key="`us-${size}`" :value="`US-${size}`">US {{ size }}</option>
              </select>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Público</label>
            <select v-model="categoryAttrs.audience" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="">Selecciona</option>
              <option v-for="aud in ['Niño','Niña','Mujer','Hombre','Unisex']" :key="`aud-${aud}`" :value="aud">{{ aud }}</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Marca</label>
            <input v-model="categoryAttrs.brand" type="text" placeholder="Ej: Nike, Adidas" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div v-if="isHome" class="space-y-2">
          <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Espacio del hogar</label>
          <select v-model="categoryAttrs.homeSpace" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="">Selecciona</option>
            <option v-for="room in ['Sala','Cocina','Habitación','Baño','Exterior','Oficina']" :key="room" :value="room">{{ room }}</option>
          </select>
        </div>

        <div v-if="isFood" class="space-y-3">
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de alimento/bebida</label>
            <input v-model="categoryAttrs.foodType" type="text" placeholder="Ej: Snacks, Granos, Bebida" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div class="space-y-1">
            <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Peso/volumen</label>
            <input v-model="categoryAttrs.foodSize" type="text" placeholder="Ej: 500g, 1L" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div v-if="isPet" class="space-y-3">
          <div class="grid gap-3 md:grid-cols-2">
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Tipo de mascota</label>
              <select v-model="categoryAttrs.petType" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Selecciona</option>
                <option v-for="pet in ['Perro','Gato','Ave','Pez','Roedor']" :key="pet" :value="pet">{{ pet }}</option>
              </select>
            </div>
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Artículo</label>
              <select v-model="categoryAttrs.petItemType" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Selecciona</option>
                <option v-for="item in ['Accesorio','Ropa','Juguete','Cama']" :key="item" :value="item">{{ item }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-3 pt-2">
        <button
          @click="addToCartFromDetail"
          class="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow transition"
          :class="{ 'cursor-not-allowed opacity-60': !canAddToCart }"
          :disabled="!canAddToCart"
          :style="{ backgroundColor: accentColor }"
        >
          <ShoppingCart class="h-4 w-4" aria-hidden="true" />
          {{ storeCartEnabled ? (canAddToCart ? 'Agregar al carrito' : 'Sin stock') : 'Carrito deshabilitado' }}
        </button>
        <NuxtLink
          v-if="product.store?.slug"
          :to="`/store/${product.store.slug}`"
          class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-300"
        >
          Ir a la tienda
        </NuxtLink>
      </div>

      <p v-if="updateMessage" class="text-sm" :class="updateStatus === 'error' ? 'text-red-600' : 'text-emerald-600'">
        {{ updateMessage }}
      </p>
      </div>
    </div>

    <section v-if="relatedProducts.length" class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Sugerencias</p>
          <h2 class="text-lg font-semibold text-slate-900">Te puede interesar</h2>
          <p class="text-sm text-slate-600">Elegimos por categoría, afinidad de etiquetas y lo más nuevo de esta tienda.</p>
        </div>
        <span v-if="product.store?.slug" class="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">{{ product.store.slug }}</span>
      </div>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProductCard
          v-for="item in relatedProducts"
          :key="item.id"
          :product="item"
          :accent="accentColor"
          :disable-cart="!storeCartEnabled"
          :hide-stock="true"
        />
      </div>
    </section>

    <section class="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Reseñas</p>
          <h2 class="text-lg font-semibold text-slate-900">Opiniones y valoración</h2>
        </div>
        <span class="flex items-center gap-1 text-sm font-semibold text-amber-600" v-if="averageRating">
          <Star class="h-4 w-4" aria-hidden="true" />
          {{ averageRating }}
        </span>
      </div>

      <div class="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
        <label class="text-sm font-semibold text-slate-700">Deja tu reseña</label>
        <div class="grid gap-2 sm:grid-cols-2">
          <input v-model="reviewForm.customer_name" type="text" placeholder="Tu nombre" class="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
          <div class="flex flex-col gap-1">
            <span class="text-xs uppercase tracking-wide text-slate-500">Tu valoración</span>
            <div class="flex items-center gap-1">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="transition"
                @mouseenter="reviewHover = star"
                @mouseleave="reviewHover = 0"
                @click="selectRating(star)"
                :aria-label="`Asignar ${star} estrellas`"
              >
                <Star
                  class="h-5 w-5 transition"
                  :class="star <= (reviewHover || reviewForm.rating)
                    ? 'text-amber-500 fill-amber-500 stroke-amber-500'
                    : 'text-slate-300 fill-transparent stroke-slate-300'"
                />
              </button>
              <span class="text-xs text-slate-500">
                {{ reviewHover || reviewForm.rating ? ((reviewHover || reviewForm.rating) + ' / 5') : 'Selecciona una valoración' }}
              </span>
            </div>
          </div>
        </div>
        <textarea v-model="reviewForm.comment" rows="3" placeholder="Escribe tu comentario" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"></textarea>
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-50"
            :style="{ backgroundColor: accentColor }"
            :disabled="sendingReview || !canSubmitReview"
            @click="sendReview"
          >
            {{ sendingReview ? 'Enviando…' : 'Publicar reseña' }}
          </button>
          <span class="text-xs text-slate-500">Tu reseña se publica abajo de inmediato.</span>
          <p v-if="reviewMessage" class="text-sm" :class="reviewStatus === 'error' ? 'text-red-600' : 'text-green-600'">{{ reviewMessage }}</p>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Reseñas recientes</p>
        <div class="space-y-3" v-if="reviews.length">
          <article v-for="review in reviews" :key="review.id" class="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
            <div class="flex flex-col gap-1 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ review.customer_name || 'Cliente' }}</span>
                <span v-if="review.pending" class="text-[11px] font-semibold uppercase tracking-widest text-amber-600">Pendiente</span>
              </div>
              <div class="flex items-center gap-1 text-amber-500">
                <Star
                  v-for="star in 5"
                  :key="`${review.id}-star-${star}`"
                  class="h-4 w-4"
                  :class="star <= Number(review.rating)
                    ? 'text-amber-500 fill-amber-500 stroke-amber-500'
                    : 'text-slate-300 fill-transparent stroke-slate-300'"
                />
              </div>
            </div>
            <p class="mt-1 text-sm text-slate-600">{{ review.comment }}</p>
            <p class="text-xs text-slate-400">{{ new Date(review.created_at).toLocaleDateString() }}</p>
          </article>
        </div>
        <p v-else class="text-sm text-slate-600">Aún no hay reseñas.</p>
      </div>
    </section>
  </div>

  <div v-else class="text-gray-500 text-center py-20">
    Producto no encontrado
  </div>

  <Teleport to="body">
    <div
      v-if="zoomOpen"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-label="Imagen ampliada del producto"
    >
      <button
        type="button"
        class="absolute right-6 top-6 rounded-full bg-white/90 p-2 text-slate-800 shadow"
        @click="zoomOpen = false"
        aria-label="Cerrar zoom"
      >
        <X class="h-5 w-5" aria-hidden="true" />
      </button>
      <img :src="activeImage" :alt="product?.name" class="max-h-[85vh] w-auto rounded-3xl border border-white/20 object-contain" />
    </div>
  </Teleport>

  <Teleport to="body">
    <transition name="fade">
      <div v-if="categoryPanelOpen" class="fixed inset-0 z-[9998] bg-black/40" @click.self="closeCategoryPanel">
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
          <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Cambiar categoría</p>
              <p class="text-sm font-semibold text-slate-800">Selecciona la categoría y guarda</p>
            </div>
            <button class="rounded-full p-2 text-slate-600 hover:bg-slate-100" @click="closeCategoryPanel" aria-label="Cerrar panel">
              <X class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div class="space-y-4 overflow-y-auto p-4">
            <div class="space-y-1">
              <label class="text-xs uppercase tracking-[0.2em] text-slate-500">Categoría</label>
              <select v-model="categoryDraft" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
                <option value="">Sin categoría</option>
                <option v-for="cat in availableCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
              <p class="text-[11px] uppercase tracking-[0.15em] text-slate-500">Actual</p>
              <p class="font-semibold">{{ categoryLabel }}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
            <button class="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" @click="closeCategoryPanel">Cancelar</button>
            <button
              class="rounded-xl px-4 py-2 text-sm font-semibold text-white shadow disabled:opacity-60"
              :style="{ backgroundColor: accentColor }"
              :disabled="savingField === 'category'"
              @click="confirmCategoryChange"
            >
              {{ savingField === 'category' ? 'Guardando...' : 'Guardar categoría' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { definePageMeta } from '#imports'
import { useProducts } from '~/composables/useProducts'
import { useCartStore } from '~/stores/cart'
import { useImages } from '~/composables/useImages'
import { useThemeStore } from '~/stores/theme'
import { useRuntimeConfig } from 'nuxt/app'
import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import ProductCard from '~/components/ProductCard.vue'
import { ShoppingCart, Star, Search, Pencil, X } from 'lucide-vue-next'
import { useNotificationStore } from '~/stores/notifications'

definePageMeta({ layout: 'store' })

const route = useRoute()
const cart = useCartStore()
const theme = useThemeStore()
const config = useRuntimeConfig()
const auth = useAuthStore()
const tenantStore = useTenantStore()
const { getProductBySlug, getProducts } = useProducts()
const { getProductImage, optimizeCloudinary } = useImages()
const notificationStore = useNotificationStore()

type EditableField = 'name' | 'description' | 'price' | 'image' | 'stock' | 'tags' | 'category'

const product = ref<any>(null)
const reviews = ref<any[]>([])
const relatedProducts = ref<any[]>([])
const sendingReview = ref(false)
const reviewMessage = ref('')
const reviewStatus = ref<'ok' | 'error'>('ok')
const reviewForm = ref({ rating: 0, comment: '', customer_name: '' })
const reviewHover = ref(0)
const savingWeekly = ref(false)
const newGalleryUrl = ref('')
const addingGallery = ref(false)
const galleryMessage = ref('')
const categoryAttrs = reactive({
  size: '',
  shoeSizeUS: '',
  techSpecs: '',
  clothingType: '',
  brand: '',
  audience: '',
  homeSpace: '',
  foodType: '',
  foodSize: '',
  petType: '',
  petItemType: '',
})
const sizeStock = reactive<Record<string, number>>({})
const selectedSize = ref('')
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '34', '36', '38', '40', '42', '44']
const shoeSizesEU = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
const shoeSizesUS = ['5', '6', '7', '8', '9', '10', '11', '12']
const categories = ref<any[]>([])
const categoriesError = ref('')
const loadingCategories = ref(false)
const accentColor = computed(() => theme.accent || '#2563eb')
const REVIEW_EVENT = 'pymeweb:review-created'
const placeholderImage = 'https://via.placeholder.com/640x640.png?text=Producto'
const zoomed = ref(false)
const zoomCoords = ref({ x: 50, y: 50 })
const categoryPanelOpen = ref(false)
const categoryDraft = ref<string | number>('')
const form = reactive({
  name: '',
  description: '',
  price: 0,
  offer_price: null as number | null,
  offer_min_qty: 1,
  image_url: '',
  stock_available: 0,
  stock_minimum: 0,
  tagsInput: '',
  product_of_week: false,
  extraImages: [] as string[],
  category: '' as string | number,
})
const editing = reactive<Record<EditableField, boolean>>({ name: false, description: false, price: false, image: false, stock: false, tags: false, category: false })
const savingField = ref<EditableField | null>(null)
const updateMessage = ref('')
const updateStatus = ref<'ok' | 'error'>('ok')
const uploadingImage = ref(false)
const uploadError = ref('')
const isStoreOwner = computed(() => {
  const memberships = (auth.user as any)?.memberships || []
  const storeSlug = product.value?.store?.slug || (route.params.slug as string)
  return memberships.some((m: any) => {
    const roles = (m?.roles || []).map((r: any) => r?.code || r)?.map((r: string) => r?.toLowerCase?.())
    return m?.store?.slug === storeSlug && roles.some((r: string) => ['admin', 'owner', 'manager'].includes(r))
  })
})
const showInlineOwnerControls = computed(() => false)
const galleryImages = computed(() => {
  if (!product.value) return [placeholderImage]
  const raw = (product.value.images || [])
    .map((img: any) => optimizeCloudinary(img?.image))
    .filter(Boolean)
  if (raw.length) return raw
  if (product.value.image_url) return [optimizeCloudinary(product.value.image_url)]
  if (product.value.image) return [optimizeCloudinary(product.value.image)]
  return [getProductImage(product.value)]
})
const galleryPicker = ref<HTMLInputElement | null>(null)
const activeImageIndex = ref(0)
const activeImage = computed(() => galleryImages.value[activeImageIndex.value] || placeholderImage)
const zoomOpen = ref(false)
const averageRating = computed(() => {
  if (!reviews.value.length) return null
  const avg = reviews.value.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.value.length
  return avg.toFixed(1)
})
const canSubmitReview = computed(() => reviewForm.value.rating > 0 && reviewForm.value.comment.trim().length > 0)
const cloudinaryUploadUrl = computed(() => {
  if (config.public.cloudinaryUploadUrl) return config.public.cloudinaryUploadUrl
  if (config.public.cloudinaryCloudName) return `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/upload`
  return ''
})
const getErrorMessage = (err: any) => {
  const detail = err?.response?._data?.detail || err?.response?._data
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) return detail.join(', ')
  if (detail && typeof detail === 'object') return Object.values(detail).flat().join(', ')
  return err?.message || 'Ocurrió un error'
}

const describeStock = (value: number) => {
  if (value <= 0) {
    return {
      label: 'Sin stock disponible',
      tone: 'text-red-600',
      pill: 'bg-red-50 text-red-700',
    }
  }
  if (value <= 5) {
    return {
      label: `Últimas ${value} unidades`,
      tone: 'text-amber-600',
      pill: 'bg-amber-50 text-amber-700',
    }
  }
  return {
    label: `${value} unidades disponibles`,
    tone: 'text-emerald-600',
    pill: 'bg-emerald-50 text-emerald-700',
  }
}

const availableCategories = computed(() => categories.value || [])

const resolvedCategoryValue = computed(() => {
  if (form.category) return form.category
  const raw = product.value?.category
  return raw?.id || raw?.slug || ''
})

const categoryLabel = computed(() => {
  const value = resolvedCategoryValue.value
  const found = availableCategories.value.find((c: any) => c.id === value || c.slug === value)
  if (found?.name) return found.name
  return product.value?.category?.name || product.value?.category || 'General'
})

const categoryName = computed(() => categoryLabel.value?.toLowerCase?.() || 'general')
const isClothing = computed(() => /ropa|shirt|camisa|pantal|jean|blusa|dress|vestido/.test(categoryName.value))
const isTech = computed(() => /tecno|electro|laptop|pc|notebook|tablet|phone|celu|smart/.test(categoryName.value))
const isShoes = computed(() => /calzado|zapato|zapatilla|sneaker|bota|sandalia/.test(categoryName.value))
const isHome = computed(() => /hogar|decor|casa|home/.test(categoryName.value))
const isFood = computed(() => /alimento|comida|bebida|grocery/.test(categoryName.value))
const isPet = computed(() => /mascota|pet/.test(categoryName.value))

const availableSizes = computed(() => {
  const sizes = Object.entries(sizeStock)
    .filter(([_, qty]) => Number(qty) > 0)
    .map(([size]) => size)
  if (sizes.length) return sizes
  if (categoryAttrs.size) return [categoryAttrs.size]
  if (isShoes.value) return shoeSizesEU.map((s) => `EU-${s}`)
  return sizeOptions
})

const techSpecsList = computed(() =>
  categoryAttrs.techSpecs
    ? categoryAttrs.techSpecs
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []
)

const hasCategoryDetails = computed(() =>
  Boolean(
    categoryAttrs.brand ||
      categoryAttrs.clothingType ||
      categoryAttrs.size ||
      categoryAttrs.shoeSizeUS ||
      categoryAttrs.audience ||
      categoryAttrs.homeSpace ||
      categoryAttrs.foodType ||
      categoryAttrs.foodSize ||
      categoryAttrs.petType ||
      categoryAttrs.petItemType ||
      techSpecsList.value.length
  )
)

const availableStock = computed(() => {
  if (isClothing.value && selectedSize.value && sizeStock[selectedSize.value] != null) {
    return Number(sizeStock[selectedSize.value] || 0)
  }
  const value = Number(product.value?.stock_available ?? 0)
  return Number.isFinite(value) ? value : 0
})
const storeCartEnabled = computed(() => {
  const type = String(product.value?.store?.store_type || 'retail')
  const cartAllowedByType = ['fast_food', 'bakery'].includes(type)
  const value = product.value?.store?.cart_enabled
  const hasToggle = value === undefined || value === null ? true : Boolean(value)
  return cartAllowedByType && hasToggle
})
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
const stockDescriptor = computed(() => describeStock(availableStock.value))
const canAddToCart = computed(() => storeCartEnabled.value && availableStock.value > 0 && (!isClothing.value || Boolean(selectedSize.value)))

const addToCartFromDetail = () => {
  if (!canAddToCart.value) return
  cart.addProduct(product.value)
}
const displayTags = computed(() => {
  const tags = (product.value?.tags || [])
    .map((t: any) => (typeof t === 'string' ? t : t?.name || t?.label || ''))
    .map((t: string) => t.trim())
    .filter(
      (t: string) =>
        Boolean(t) &&
        !/^(talla:|talla_us:|specs:|size_stock:|tipo:|marca:|publico:|hogar:|alimento:|porcion:|mascota:|item_mascota:)/i.test(t)
    )
  if (tags.length) return tags
  const fallback: string[] = []
  if (product.value?.store?.slug) fallback.push(`Tienda: ${product.value.store.slug}`)
  return fallback
})

watch(
  availableSizes,
  (sizes) => {
    if (!sizes.length) {
      selectedSize.value = ''
      return
    }
    if (!selectedSize.value || !sizes.includes(selectedSize.value)) {
      selectedSize.value = sizes[0]
    }
  },
  { immediate: true }
)

watch(
  () => [route.params.slug, route.params.product_slug],
  () => {
    void ensureProductLoadedByRoute()
  },
  { immediate: true }
)

const hydrateForm = (data: any) => {
  form.name = data?.name || ''
  form.description = data?.description || ''
  form.price = Number(data?.price || 0)
  form.offer_price = data?.offer_price ?? null
  form.offer_min_qty = Math.max(1, Number(data?.offer_min_qty || 1))
  form.image_url = data?.images?.[0]?.image || data?.image_url || data?.image || ''
  form.stock_available = Number(data?.stock_available ?? 0) || 0
  form.stock_minimum = Number(data?.stock_minimum ?? 0) || 0
  form.product_of_week = Boolean(data?.product_of_week)
  form.extraImages = (data?.images || [])
    .map((img: any) => img?.image)
    .filter(Boolean)
  form.category = data?.category?.id || ''
  const tags = (data?.tags || [])
    .map((t: any) => (typeof t === 'string' ? t : t?.name || t?.label || ''))
    .map((t: string) => t.trim())
    .filter(Boolean)
  form.tagsInput = tags.join(', ')
  categoryAttrs.size = tags.find((t) => t.toLowerCase().startsWith('talla:'))?.split(':')[1] || ''
  categoryAttrs.shoeSizeUS = tags.find((t) => t.toLowerCase().startsWith('talla_us:'))?.split(':')[1] || ''
  categoryAttrs.techSpecs = tags.find((t) => t.toLowerCase().startsWith('specs:'))?.substring(6) || ''
  categoryAttrs.clothingType = tags.find((t) => t.toLowerCase().startsWith('tipo:'))?.split(':')[1] || ''
  categoryAttrs.brand = tags.find((t) => t.toLowerCase().startsWith('marca:'))?.split(':')[1] || ''
  categoryAttrs.audience = tags.find((t) => t.toLowerCase().startsWith('publico:'))?.split(':')[1] || ''
  categoryAttrs.homeSpace = tags.find((t) => t.toLowerCase().startsWith('hogar:'))?.split(':')[1] || ''
  categoryAttrs.foodType = tags.find((t) => t.toLowerCase().startsWith('alimento:'))?.split(':')[1] || ''
  categoryAttrs.foodSize = tags.find((t) => t.toLowerCase().startsWith('porcion:'))?.split(':')[1] || ''
  categoryAttrs.petType = tags.find((t) => t.toLowerCase().startsWith('mascota:'))?.split(':')[1] || ''
  categoryAttrs.petItemType = tags.find((t) => t.toLowerCase().startsWith('item_mascota:'))?.split(':')[1] || ''
  Object.keys(sizeStock).forEach((k) => delete sizeStock[k])
  tags.forEach((t) => {
    const match = t.match(/^size_stock:([^:]+):(-?\d+)/i)
    if (match) {
      const qty = Number(match[2]) || 0
      if (qty > 0) {
        sizeStock[match[1]] = qty
      }
    }
  })
  const sizes = Object.keys(sizeStock)
  if (!selectedSize.value && sizes.length) {
    selectedSize.value = sizes[0]
  }
}

const resetMessages = () => {
  updateMessage.value = ''
  updateStatus.value = 'ok'
}

const parseTagsInput = (value: string) =>
  value
    .split(',')
    .map((tag: string) => tag.trim())
    .filter(Boolean)

const loadCategories = async () => {
  loadingCategories.value = true
  categoriesError.value = ''
  try {
    const slug = route.params.slug as string
    tenantStore.setSlug(slug)
    categories.value = await $fetch(`${config.public.apiBase}/store/${slug}/catalogo/categories/`)
  } catch (error) {
    categoriesError.value = getErrorMessage(error) || 'No pudimos cargar categorías'
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

const openCategoryPanel = () => {
  const current = resolvedCategoryValue.value
  categoryDraft.value = Number.isFinite(Number(current)) ? Number(current) : current || ''
  categoryPanelOpen.value = true
}

const closeCategoryPanel = () => {
  categoryPanelOpen.value = false
}

const refreshProduct = async () => {
  const requestedIdentifier = route.params.product_slug as string
  let data: any = null

  try {
    data = await getProductBySlug(requestedIdentifier)
  } catch (error) {
    const requestedId = Number(requestedIdentifier)
    if (Number.isFinite(requestedId)) {
      const catalogResponse: any = await getProducts()
      const catalogList = Array.isArray(catalogResponse) ? catalogResponse : catalogResponse?.results || []
      const matchedById = (catalogList || []).find((item: any) => Number(item?.id) === requestedId)
      if (matchedById) {
        data = matchedById?.slug ? await getProductBySlug(matchedById.slug) : matchedById
      }
    }

    if (!data) {
      const storeSlug = String(route.params.slug || tenantStore.slug || '')
      data = await $fetch(`${config.public.apiBase}/store/${storeSlug}/catalogo/products/${requestedIdentifier}/`)
    }
  }

  product.value = data
  hydrateForm(data)
  await fetchRelatedProducts()
}

async function ensureProductLoadedByRoute() {
  if (product.value) return
  const storeSlug = String(route.params.slug || tenantStore.slug || '')
  const productSlug = String(route.params.product_slug || '')
  if (!storeSlug || !productSlug) return
  try {
    const data: any = await $fetch(`${config.public.apiBase}/store/${storeSlug}/catalogo/products/${productSlug}/`)
    product.value = data
    hydrateForm(data)
    await fetchRelatedProducts()
  } catch (error) {
    console.error('No se pudo cargar el producto por ruta', error)
  }
}

const fetchRelatedProducts = async () => {
  if (!tenantStore.slug) return
  try {
    const list: any[] = await getProducts()
    const currentSlug = product.value?.slug || (route.params.product_slug as string)
    const currentCat = product.value?.category?.slug || product.value?.category?.name || product.value?.category
    const currentTags = new Set(
      (product.value?.tags || [])
        .map((t: any) => (typeof t === 'string' ? t : t?.name || t?.label || ''))
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean)
    )
    const scored = (list || [])
      .filter((item: any) => item?.slug !== currentSlug)
      .map((item: any) => {
        let score = 0
        const itemCat = item?.category?.slug || item?.category?.name || item?.category
        if (itemCat && currentCat && itemCat === currentCat) score += 4
        if (item?.product_of_week) score += 2
        if (item?.is_featured) score += 1
        const itemTags = (item?.tags || [])
          .map((t: any) => (typeof t === 'string' ? t : t?.name || t?.label || ''))
          .map((t: string) => t.trim().toLowerCase())
          .filter(Boolean)
        const shared = itemTags.filter((t: string) => currentTags.has(t)).length
        score += Math.min(shared, 3)
        const created = item?.created_at ? new Date(item.created_at).getTime() : 0
        return { item, score, created }
      })
      .sort((a: any, b: any) => {
        if (b.score !== a.score) return b.score - a.score
        return b.created - a.created
      })
      .slice(0, 6)
      .map((entry: any) => entry.item)

    relatedProducts.value = scored
  } catch (error) {
    relatedProducts.value = []
  }
}

const updateProduct = async (payload: Record<string, any>) => {
  if (!isStoreOwner.value) {
    updateStatus.value = 'error'
    updateMessage.value = 'Solo el dueño puede editar este producto'
    return false
  }

  const endpointSlug = product.value?.slug || (route.params.product_slug as string)
  const endpoint = `${config.public.apiBase}/store/${route.params.slug}/catalogo/products/${endpointSlug}/`

  const doPatch = (tokenOverride?: string) =>
    $fetch(endpoint, {
      method: 'PATCH',
      body: payload,
      headers: tokenOverride || auth.token ? { Authorization: `Bearer ${tokenOverride || auth.token}` } : undefined,
    })

  try {
    resetMessages()
    await doPatch()
    await refreshProduct()
    updateStatus.value = 'ok'
    updateMessage.value = 'Cambios guardados'
    return true
  } catch (error: any) {
    const code = error?.response?._data?.code
    if (code === 'token_not_valid' && auth.refreshToken) {
      const refreshed = await auth.refreshTokens()
      if (refreshed) {
        try {
          await doPatch(refreshed)
          await refreshProduct()
          updateStatus.value = 'ok'
          updateMessage.value = 'Cambios guardados'
          return true
        } catch (retryErr) {
          console.error('Retry after refresh failed', retryErr)
        }
      }
    }
    updateStatus.value = 'error'
    const apiError = error?.response?._data
    updateMessage.value = typeof apiError === 'string' ? apiError : 'No pudimos guardar los cambios'
    console.error('Update product failed', error)
    return false
  } finally {
    savingField.value = null
  }
}

const startEdit = (field: EditableField) => {
  if (!isStoreOwner.value) return
  resetMessages()
  editing[field] = true
}

const cancelEdit = (field: EditableField) => {
  editing[field] = false
  hydrateForm(product.value)
  resetMessages()
}

const saveName = async () => {
  if (!form.name.trim()) {
    updateStatus.value = 'error'
    updateMessage.value = 'El nombre no puede estar vacío'
    return
  }
  savingField.value = 'name'
  const ok = await updateProduct({ name: form.name.trim() })
  if (ok) editing.name = false
}

const saveDescription = async () => {
  savingField.value = 'description'
  const ok = await updateProduct({ description: form.description })
  if (ok) editing.description = false
}

const savePrice = async () => {
  savingField.value = 'price'
  const payload: any = {
    price: form.price,
    offer_price: form.offer_price,
    offer_min_qty: Math.max(1, Number(form.offer_min_qty) || 1),
  }
  const ok = await updateProduct(payload)
  if (ok) editing.price = false
}

const saveStock = async () => {
  savingField.value = 'stock'
  const available = Number(form.stock_available)
  const minimum = Number(form.stock_minimum)
  if (available < 0 || minimum < 0) {
    updateStatus.value = 'error'
    updateMessage.value = 'El stock no puede ser negativo'
    savingField.value = null
    return
  }
  const payload: any = {
    stock_available: Number.isFinite(available) ? available : 0,
    stock_minimum: Number.isFinite(minimum) ? minimum : 0,
  }
  const ok = await updateProduct(payload)
  if (ok) editing.stock = false
}

const saveTags = async () => {
  savingField.value = 'tags'
  const parsed = parseTagsInput(form.tagsInput)
  const ok = await updateProduct({ tags: parsed })
  if (ok) editing.tags = false
}

const saveCategory = async () => {
  savingField.value = 'category'
  const payload: any = {}
  const catValue = Number(form.category)
  if (!form.category) {
    payload.category = null
  } else if (Number.isFinite(catValue)) {
    payload.category = catValue
  } else {
    updateStatus.value = 'error'
    updateMessage.value = 'Selecciona una categoría válida (ID)'
    savingField.value = null
    return false
  }
  const ok = await updateProduct(payload)
  if (ok) editing.category = false
  return ok
}

const saveCategoryAttributes = async () => {
  savingField.value = 'tags'
  const baseTags = parseTagsInput(form.tagsInput)
  const extra: string[] = []
  if (categoryAttrs.size) extra.push(`talla:${categoryAttrs.size}`)
  if (categoryAttrs.shoeSizeUS) extra.push(`talla_us:${categoryAttrs.shoeSizeUS}`)
  if (categoryAttrs.clothingType) extra.push(`tipo:${categoryAttrs.clothingType}`)
  if (categoryAttrs.techSpecs) extra.push(`specs:${categoryAttrs.techSpecs}`)
  if (categoryAttrs.brand) extra.push(`marca:${categoryAttrs.brand}`)
  if (categoryAttrs.audience) extra.push(`publico:${categoryAttrs.audience}`)
  if (categoryAttrs.homeSpace) extra.push(`hogar:${categoryAttrs.homeSpace}`)
  if (categoryAttrs.foodType) extra.push(`alimento:${categoryAttrs.foodType}`)
  if (categoryAttrs.foodSize) extra.push(`porcion:${categoryAttrs.foodSize}`)
  if (categoryAttrs.petType) extra.push(`mascota:${categoryAttrs.petType}`)
  if (categoryAttrs.petItemType) extra.push(`item_mascota:${categoryAttrs.petItemType}`)
  Object.entries(sizeStock).forEach(([size, qty]) => {
    if (size && qty != null && Number(qty) > 0) extra.push(`size_stock:${size}:${Number(qty) || 0}`)
  })
  const merged = [
    ...baseTags.filter(
      (t) =>
        !/^(talla:|talla_us:|specs:|tipo:|marca:|size_stock:|color:|material:|publico:|hogar:|alimento:|porcion:|mascota:|item_mascota:)/i.test(t)
    ),
    ...extra,
  ]
  const ok = await updateProduct({ tags: merged })
  if (ok) {
    form.tagsInput = merged.join(', ')
    updateStatus.value = 'ok'
    updateMessage.value = 'Atributos guardados'
  }
  savingField.value = null
}

const confirmCategoryChange = async () => {
  form.category = categoryDraft.value
  const ok = await saveCategory()
  if (ok) {
    categoryPanelOpen.value = false
  }
}

const saveWeekly = async () => {
  savingWeekly.value = true
  const ok = await updateProduct({ product_of_week: Boolean(form.product_of_week) })
  if (ok) {
    updateStatus.value = 'ok'
    updateMessage.value = 'Marcado como destacado de la semana'
  }
  savingWeekly.value = false
}

const addGalleryImage = async () => {
  if (addingGallery.value) return
  const raw = newGalleryUrl.value.trim()
  if (!raw) return
  addingGallery.value = true
  galleryMessage.value = ''
  try {
    let cloudUrl = raw
    if (!/^https?:\/\//i.test(raw) || !raw.includes('res.cloudinary.com')) {
      cloudUrl = await ensureCloudinaryUrl(raw)
    }
    const ok = await updateProduct({ extra_images: [cloudUrl] })
    if (ok) {
      form.extraImages.push(cloudUrl)
      if (product.value?.images) {
        product.value.images.push({ image: cloudUrl })
      }
      galleryMessage.value = 'Imagen agregada a la galería'
      newGalleryUrl.value = ''
    }
  } catch (error) {
    galleryMessage.value = getErrorMessage(error) || 'No pudimos agregar la imagen'
  } finally {
    addingGallery.value = false
  }
}

const onFileSelectGallery = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return
  addingGallery.value = true
  galleryMessage.value = ''
  try {
    const result = await uploadToCloudinary(file)
    const url = result?.secure_url
    if (!url) throw new Error('No pudimos obtener la URL de la imagen')
    newGalleryUrl.value = url
    await addGalleryImage()
  } catch (error) {
    galleryMessage.value = getErrorMessage(error) || 'No pudimos subir la imagen'
  } finally {
    addingGallery.value = false
    if (target) target.value = ''
  }
}

const saveImage = async () => {
  savingField.value = 'image'
  if (form.image_url && !/^https?:\/\//i.test(form.image_url)) {
    updateStatus.value = 'error'
    updateMessage.value = 'La imagen debe ser un enlace válido (http/https)'
    savingField.value = null
    return
  }
  let imageUrl = form.image_url
  if (imageUrl) {
    try {
      imageUrl = await ensureCloudinaryUrl(imageUrl)
    } catch (err) {
      updateStatus.value = 'error'
      updateMessage.value = getErrorMessage(err) || 'No pudimos subir la imagen a Cloudinary'
      savingField.value = null
      return
    }
  }
  const ok = await updateProduct({ image_url: imageUrl, image: imageUrl })
  if (ok) {
    editing.image = false
    // Mantén la imagen principal actualizada en memoria para el slider
    if (imageUrl) {
      const existing = product.value?.images || []
      product.value.images = [{ image: imageUrl }, ...existing]
      activeImageIndex.value = 0
    }
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
  return $fetch<any>(cloudinaryUploadUrl.value, {
    method: 'POST',
    body: formData,
  })
}

const ensureCloudinaryUrl = async (currentUrl?: string) => {
  if (!currentUrl) return ''
  if (currentUrl.includes('res.cloudinary.com')) return currentUrl
  const result = await uploadToCloudinary(currentUrl, 'upload/product')
  if (!result?.secure_url) throw new Error('No pudimos subir la imagen a Cloudinary')
  return result.secure_url
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
    form.image_url = result.secure_url
    updateMessage.value = 'Imagen subida, guarda para aplicar'
    updateStatus.value = 'ok'
  } catch (error) {
    uploadError.value = getErrorMessage(error) || 'No pudimos subir la imagen'
  } finally {
    uploadingImage.value = false
    if (target) target.value = ''
  }
}

const withPendingFlag = (review: any = {}) => ({
  ...review,
  pending: review?.status ? review.status !== 'APPROVED' : false,
})

const fetchReviews = async () => {
  if (!product.value) return
  try {
    const data = await $fetch<any[]>(`${config.public.apiBase}/store/${route.params.slug}/resenas/reviews/product/${product.value.slug}/`)
    reviews.value = (data || []).map(withPendingFlag)
  } catch (error) {
    reviews.value = []
  }
}

const parseReviewError = (error: any): string => {
  const payload = error?.response?._data
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }
  if (Array.isArray(payload) && payload.length) {
    return String(payload[0])
  }
  if (payload && typeof payload === 'object') {
    for (const value of Object.values(payload)) {
      if (Array.isArray(value) && value.length) {
        return String(value[0])
      }
      if (typeof value === 'string' && value.trim()) {
        return value
      }
    }
  }
  return 'No pudimos enviar la reseña'
}

const sendReview = async () => {
  if (!product.value) return
  if (reviewForm.value.rating <= 0) {
    reviewStatus.value = 'error'
    reviewMessage.value = 'Selecciona una valoración antes de enviar.'
    return
  }
  sendingReview.value = true
  reviewMessage.value = ''
  try {
    const created = await $fetch<any>(`${config.public.apiBase}/store/${route.params.slug}/resenas/reviews/product/${product.value.slug}/create/`, {
      method: 'POST',
      body: {
        rating: reviewForm.value.rating,
        comment: reviewForm.value.comment,
        customer_name: reviewForm.value.customer_name,
        product_slug: product.value.slug,
      },
    })
    const pendingReview = withPendingFlag(created)
    reviewMessage.value = 'Gracias, tu reseña ya aparece para otros compradores.'
    reviewStatus.value = 'ok'
    reviewForm.value = { rating: 0, comment: '', customer_name: '' }
    reviewHover.value = 0
    reviews.value = [pendingReview, ...reviews.value]
    try {
      notificationStore.pushNotification({
        type: 'review:new',
        message: `Nueva reseña para ${product.value?.name}`,
        count: 1,
        store: product.value?.store?.slug,
        product_slug: pendingReview.product_slug || product.value?.slug,
      })
      if (process.client) {
        window.dispatchEvent(
          new CustomEvent(REVIEW_EVENT, {
            detail: {
              store: product.value?.store?.slug,
              product: pendingReview.product_slug || product.value?.slug,
            },
          })
        )
      }
    } catch (notifyError) {
      console.warn('No se pudo notificar la reseña nueva', notifyError)
    }
  } catch (error: any) {
    reviewMessage.value = parseReviewError(error)
    reviewStatus.value = 'error'
  } finally {
    sendingReview.value = false
  }
}

const selectRating = (value: number) => {
  reviewForm.value.rating = value
  reviewMessage.value = ''
  reviewStatus.value = 'ok'
}

const selectImage = (index: number) => {
  activeImageIndex.value = index
  zoomed.value = false
}

const toggleZoom = () => {
  zoomed.value = !zoomed.value
  if (!zoomed.value) {
    zoomCoords.value = { x: 50, y: 50 }
  }
}

const handleZoomMove = (event: MouseEvent) => {
  if (!zoomed.value) return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  zoomCoords.value = { x, y }
}

const triggerGalleryPicker = () => {
  if (!galleryPicker.value) return
  galleryPicker.value.click()
}

const handleZoomLeave = () => {
  if (!zoomed.value) {
    zoomCoords.value = { x: 50, y: 50 }
  }
}


watch(
  galleryImages,
  (images) => {
    if (!images.length) {
      activeImageIndex.value = 0
      return
    }
    if (activeImageIndex.value > images.length - 1) {
      activeImageIndex.value = 0
    }
    zoomed.value = false
  }
)

onMounted(async () => {
  const slug = route.params.slug as string
  auth.restoreFromCookies()
  if (auth.token && !auth.user) {
    try {
      await auth.fetchProfile()
    } catch (e) {
      console.warn('No se pudo cargar el perfil en detalle de producto', e)
    }
  }

  tenantStore.setSlug(slug)
  theme.loadFromStorage()
  theme.applyStoreTheme(slug)

  try {
    await tenantStore.fetchTienda()
  } catch (e) {
    console.warn('No se pudo cargar la tienda para el detalle de producto', e)
  }

  try {
    await loadCategories()
  } catch (e) {
    console.warn('No se pudieron cargar categorías en el detalle de producto', e)
  }

  try {
    await refreshProduct()
  } catch (e) {
    console.error('Error cargando producto', e)
  }

  try {
    await fetchReviews()
  } catch (e) {
    console.warn('No se pudieron cargar reseñas', e)
  }

  activeImageIndex.value = 0
})
</script>
