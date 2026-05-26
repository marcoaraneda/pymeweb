import { useRuntimeConfig } from "nuxt/app";
import { useTenantStore } from "~/stores/tenant";
import { useAuthStore } from "~/stores/auth";

export const useReports = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const tenant = useTenantStore();

  const downloadReport = async (reportType: 'inventory' | 'sales' | 'reviews') => {
    try {
      const response = await $fetch(`${config.public.apiBase}/reports/export/`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${auth.token}` },
        params: { 
          store_id: tenant.data.id,
          type: reportType 
        },
        responseType: 'blob' // Fundamental para archivos
      });

      // Crear un enlace temporal para la descarga
      const url = window.URL.createObjectURL(new Blob([response as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${reportType}_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      const msg = error.response?._data?.detail || "Error al generar el reporte";
      throw new Error(msg);
    }
  };

  return { downloadReport };
};