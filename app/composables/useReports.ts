import { useRuntimeConfig } from "nuxt/app";
import { useTenantStore } from "~/stores/tenant";
import { useAuthStore } from "~/stores/auth";

export const useReports = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const tenant = useTenantStore();

  const downloadReport = async (reportType: 'inventory' | 'sales' | 'reviews', opts: { storeSlug?: string; start?: string; end?: string } = {}) => {
    if (!auth.token) throw new Error('No autenticado');
    if (!tenant.data?.slug && !opts.storeSlug) throw new Error('Tienda no definida');
    const doFetch = async (token: string) => {
      const params: Record<string, any> = {
        store_id: tenant.data?.id,
        store_slug: opts.storeSlug || tenant.data?.slug,
        type: reportType,
      }
      if (opts.start) params.start = opts.start
      if (opts.end) params.end = opts.end

      const response = await $fetch(`${config.public.apiBase}/reports/export/`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        params,
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response as any]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_${reportType}_${new Date().toISOString().slice(0,10)}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    try {
      return await doFetch(auth.token)
    } catch (error: any) {
      const code = error.response?._data?.code
      if (code === 'token_not_valid' && auth.refreshToken) {
        const refreshed = await auth.refreshTokens()
        if (refreshed) return doFetch(refreshed)
      }
      const msg = error.response?._data?.detail || "Error al generar el reporte";
      throw new Error(msg);
    }
  };

  return { downloadReport };
};