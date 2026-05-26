export const useImages = () => {
  const FALLBACK_IMAGE = '/logoPW.png'

  /**
   * Retorna la imagen principal de un producto
   * - Usa Cloudinary (URL completa)
   * - Optimiza formato y calidad automáticamente
   */
  const getProductImage = (product: any): string => {
    if (product?.image_url) {
      return optimizeCloudinary(product.image_url)
    }

    if (product?.image) {
      return optimizeCloudinary(product.image)
    }

    if (product?.images?.length > 0) {
      return optimizeCloudinary(product.images[0].image)
    }

    // Imagen local por defecto para evitar dependencia de servicios externos.
    return FALLBACK_IMAGE
  }

  /**
   * Optimización Cloudinary:
   * - f_auto  → formato automático (webp / avif / jpg)
   * - q_auto  → calidad automática
   */
  const optimizeCloudinary = (url: string): string => {
    if (!url) return ""

    // Si no es Cloudinary, devolver tal cual
    if (!url.includes("res.cloudinary.com")) {
      return url
    }

    return url.replace(
      "/upload/",
      "/upload/f_auto,q_auto/"
    )
  }

  return {
    getProductImage,
    optimizeCloudinary,
  }
}
