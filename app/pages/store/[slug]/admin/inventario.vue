<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800">Control de Inventario</h1>
      <button @click="refreshStock" class="text-sm bg-gray-200 px-4 py-2 rounded-lg">Actualizar</button>
    </div>

    <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="p-4 font-semibold text-gray-600">Producto / Variante</th>
            <th class="p-4 font-semibold text-gray-600">Stock Actual</th>
            <th class="p-4 font-semibold text-gray-600">Estado</th>
            <th class="p-4 font-semibold text-gray-600 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventory" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="p-4">
              <p class="font-medium">{{ item.product_name }}</p>
              <p class="text-xs text-gray-500">{{ item.variant_name }} (SKU: {{ item.sku }})</p>
            </td>
            <td class="p-4 font-mono">{{ item.quantity }}</td>
            <td class="p-4">
              <span v-if="item.quantity <= item.min_stock" class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">
                STOCK BAJO
              </span>
              <span v-else class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Saludable</span>
            </td>
            <td class="p-4 text-right">
              <button @click="openAdjustment(item)" class="text-blue-600 hover:underline text-sm font-medium">
                Ajustar Stock
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' })
const { getStock } = useInventory()
const inventory = ref([])

const refreshStock = async () => {
  try {
    inventory.value = await getStock()
  } catch (e) {
    alert(e.message) // Manejo de errores profesional
  }
}

onMounted(refreshStock)
</script>