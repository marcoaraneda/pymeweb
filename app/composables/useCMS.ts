import { useRuntimeConfig } from "nuxt/app";
import { useAuthStore } from "~/stores/auth";
import { useTenantStore } from "~/stores/tenant";

export type CMSSection = {
  id: number
  section_type: string
  enabled: boolean
  order: number
  config?: Record<string, any>
}

export const useCMS = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const tenant = useTenantStore();

  const authedFetch = async <T>(url: string, options: Record<string, any> = {}) => {
    if (!auth.token) throw new Error("No autenticado");

    const doFetch = (token: string) =>
      $fetch<T>(url, {
        ...options,
        headers: { Authorization: `Bearer ${token}`, ...(options.headers || {}) },
      });

    try {
      return await doFetch(auth.token);
    } catch (error: any) {
      const code = error?.response?._data?.code;
      if (code === 'token_not_valid' && auth.refreshToken) {
        const refreshed = await auth.refreshTokens();
        if (refreshed) return doFetch(refreshed);
      }
      throw error;
    }
  };

  const getSections = async (): Promise<CMSSection[]> => {
    if (!tenant.slug) throw new Error("Tienda no definida");
    try {
      return await authedFetch<CMSSection[]>(`${config.public.apiBase}/store/${tenant.slug}/admin/cms/home-sections/`);
    } catch (error) {
      throw new Error("No se pudieron cargar las secciones.");
    }
  };

  const updateSectionStatus = async (sectionId: number, isEnabled: boolean): Promise<CMSSection> => {
    if (!tenant.slug) throw new Error("Tienda no definida");
    const doPatch = async (token: string) =>
      $fetch<CMSSection>(`${config.public.apiBase}/store/${tenant.slug}/admin/cms/home-sections/${sectionId}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: { enabled: isEnabled }
      });

    try {
      if (!auth.token) throw new Error("No autenticado");
      return await doPatch(auth.token);
    } catch (error) {
      const code = (error as any)?.response?._data?.code;
      if (code === 'token_not_valid' && auth.refreshToken) {
        const refreshed = await auth.refreshTokens();
        if (refreshed) return doPatch(refreshed);
      }
      throw new Error("Error al actualizar la sección.");
    }
  };

  const createSection = async (payload: { section_type: string; enabled?: boolean; order?: number; config?: Record<string, any> }): Promise<CMSSection> => {
    if (!tenant.slug) throw new Error("Tienda no definida")
    try {
      return await authedFetch<CMSSection>(`${config.public.apiBase}/store/${tenant.slug}/admin/cms/home-sections/`, {
        method: 'POST',
        body: {
          section_type: payload.section_type,
          enabled: payload.enabled ?? true,
          order: payload.order ?? 0,
          config: payload.config ?? {},
        },
      })
    } catch (error: any) {
      const detail = error?.response?._data?.detail || error?.response?._data?.section_type || 'No se pudo crear la sección.'
      throw new Error(Array.isArray(detail) ? detail.join(' ') : detail)
    }
  }

  return { getSections, updateSectionStatus, createSection };
};