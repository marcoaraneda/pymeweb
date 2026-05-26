<template>
  <div class="space-y-8">
    <header>
      <h1 class="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h1>
      <p class="text-gray-500">Consulta y exporta el estado actual de tu negocio.</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border shadow-sm hover:border-blue-500 transition">
        <div class="text-blue-600 mb-4 text-3xl">📊</div>
        <h3 class="font-bold text-lg">Resumen de Stock</h3>
        <p class="text-sm text-gray-500 mb-6">Lista detallada de productos con stock bajo y variantes.</p>
        <button @click="handleExport('inventory')" 
                class="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">
          Descargar Excel
        </button>
      </div>

      <div class="bg-white p-6 rounded-2xl border shadow-sm hover:border-blue-500 transition">
        <div class="text-yellow-500 mb-4 text-3xl">⭐</div>
        <h3 class="font-bold text-lg">Reporte de Feedback</h3>
        <p class="text-sm text-gray-500 mb-6">Análisis de satisfacción de clientes y reseñas moderadas.</p>
        <button @click="handleExport('reviews')" 
                class="w-full py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">
          Exportar CSV
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin', middleware: 'auth' });
const { downloadReport } = useReports();

const handleExport = async (type) => {
  try {
    await downloadReport(type);
  } catch (e) {
    alert(e.message);
  }
};
</script>