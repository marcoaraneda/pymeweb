import { useRuntimeConfig } from "nuxt/app";
import { useAuthStore } from "~/stores/auth";
import { useTenantStore } from "~/stores/tenant";

export const useCMS = () => {
  const config = useRuntimeConfig();
  const auth = useAuthStore();
  const tenant = useTenantStore();

  const getSections = async () => {
    try {
      return await $fetch(`${config.public.apiBase}/cms/sections/`, {
        params: { store_slug: tenant.slug }
      });
    } catch (error) {
      throw new Error("No se pudieron cargar las secciones.");
    }
  };

  const updateSectionStatus = async (sectionId: number, isEnabled: boolean) => {
    try {
      return await $fetch(`${config.public.apiBase}/cms/sections/${sectionId}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${auth.token}` },
        body: { enabled: isEnabled }
      });
    } catch (error) {
      throw new Error("Error al actualizar la sección.");
    }
  };

  return { getSections, updateSectionStatus };
};