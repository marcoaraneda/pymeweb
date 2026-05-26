<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Control de Inventario</h1>
        <p class="text-sm text-gray-500">Consulta stock por variante y registra ajustes rápidos.</p>
      </div>
      <button @click="refreshStock" class="text-sm bg-gray-200 px-4 py-2 rounded-lg">Actualizar</button>
    </div>

    <div v-if="errorMessage" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ errorMessage }}
    </div>

    <div v-if="loading" class="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
      Cargando inventario...
    </div>

    <div v-else class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div v-if="!inventory.length" class="px-4 py-6 text-sm text-slate-500">No hay registros de stock para esta tienda.</div>
      <table v-else class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-4 font-semibold text-gray-600">Producto / Variante</th>
            <th class="p-4 font-semibold text-gray-600">Stock Actual</th>
            <th class="p-4 font-semibold text-gray-600">Estado</th>
            <th class="p-4 font-semibold text-gray-600 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pagedInventory" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="p-4">
              <p class="font-medium">{{ item.product_name }}</p>
              <p class="text-xs text-gray-500">{{ item.variant_name }} (SKU: {{ item.sku }})</p>
            </td>
            <td class="p-4 font-mono">{{ item.stock_available }}</td>
            <td class="p-4">
              <span v-if="item.stock_available <= item.stock_minimum" class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                STOCK BAJO
              </span>
              <span v-else class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Saludable</span>
              <p class="mt-1 text-[11px] text-gray-500">Mínimo {{ item.stock_minimum }}</p>
            </td>
            <td class="p-4 text-right">
              <button @click="openAdjustment(item)" class="text-blue-600 hover:underline text-sm font-medium">
                Ajustar Stock
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="inventoryTotalPages > 1" class="border-t bg-white px-4 py-3 text-xs text-slate-600">
        <div class="flex items-center justify-between">
          <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="inventoryPage === 1" @click="inventoryPage -= 1">Anterior</button>
          <span>Página {{ inventoryPage }} / {{ inventoryTotalPages }}</span>
          <button class="rounded-lg border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-40" :disabled="inventoryPage === inventoryTotalPages" @click="inventoryPage += 1">Siguiente</button>
        </div>
      </div>
    </div>

    <div v-if="adjustingItem" class="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <h2 class="text-sm font-semibold text-amber-900">Ajustar stock</h2>
      <p class="mt-1 text-xs text-amber-800">
        {{ adjustingItem.product_name }} / {{ adjustingItem.variant_name }}
      </p>
      <p class="mt-1 text-xs text-amber-800">Stock actual: {{ adjustingItem.stock_available }}</p>

      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <label class="text-sm text-slate-700">
          Nuevo stock
          <input
            v-model.number="targetStock"
            type="number"
            min="0"
            class="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
          />
        </label>
        <label class="text-sm text-slate-700">
          Motivo
          <input
            v-model.trim="adjustReason"
            type="text"
            placeholder="Ajuste manual desde panel"
            class="mt-1 w-full rounded-lg border border-amber-200 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div v-if="adjustError" class="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
        {{ adjustError }}
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button
          class="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          :disabled="savingAdjustment"
          @click="confirmAdjustment"
        >
          {{ savingAdjustment ? 'Guardando...' : 'Confirmar ajuste' }}
        </button>
        <button
          class="rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-900"
          :disabled="savingAdjustment"
          @click="cancelAdjustment"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: ['tenant', 'auth'], requiresAuth: true })
const { getStock, updateStock } = useInventory()

type InventoryItem = {
  id: number
  variant: number
  product_name: string
  variant_name: string
  sku: string
  stock_available: number
  stock_minimum: number
}

const inventory = ref<InventoryItem[]>([])
const loading = ref(false)
const errorMessage = ref('')
const adjustingItem = ref<InventoryItem | null>(null)
const targetStock = ref<number>(0)
const adjustReason = ref('')
const adjustError = ref('')
const savingAdjustment = ref(false)
const inventoryPage = ref(1)
const inventoryPageSize = 15

const inventoryTotalPages = computed(() => Math.max(1, Math.ceil(inventory.value.length / inventoryPageSize)))
const pagedInventory = computed(() => {
  const start = (inventoryPage.value - 1) * inventoryPageSize
  return inventory.value.slice(start, start + inventoryPageSize)
})

const refreshStock = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    inventory.value = await getStock()
    inventoryPage.value = 1
  } catch (e: any) {
    errorMessage.value = e?.message || 'No se pudo cargar el inventario.'
  } finally {
    loading.value = false
  }
}

const openAdjustment = async (item: InventoryItem) => {
  adjustingItem.value = item
  targetStock.value = item.stock_available
  adjustReason.value = 'Ajuste manual desde panel'
  adjustError.value = ''
}

const cancelAdjustment = () => {
  adjustingItem.value = null
  targetStock.value = 0
  adjustReason.value = ''
  adjustError.value = ''
}

const confirmAdjustment = async () => {
  if (!adjustingItem.value) return
  const item = adjustingItem.value
  const nextValue = Number(targetStock.value)

  if (!Number.isFinite(nextValue) || nextValue < 0) {
    adjustError.value = 'Ingresa un stock válido mayor o igual a 0.'
    return
  }

  const delta = nextValue - item.stock_available
  if (delta === 0) {
    cancelAdjustment()
    return
  }

  savingAdjustment.value = true
  adjustError.value = ''
  try {
    await updateStock({
      variantId: item.variant,
      quantity: Math.abs(delta),
      type: delta > 0 ? 'ENTRY' : 'EXIT',
      reason: adjustReason.value || 'Ajuste manual desde panel',
    })
    await refreshStock()
    cancelAdjustment()
  } catch (e: any) {
    adjustError.value = e?.message || 'No se pudo actualizar el stock.'
  } finally {
    savingAdjustment.value = false
  }
}

onMounted(refreshStock)

watch(inventory, () => {
  if (inventoryPage.value > inventoryTotalPages.value) inventoryPage.value = inventoryTotalPages.value
})
</script>
