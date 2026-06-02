const useImages = () => {
  const FALLBACK_IMAGE = "/logoPW.png";
  const getProductImage = (product) => {
    if (product?.image_url) {
      return optimizeCloudinary(product.image_url);
    }
    if (product?.image) {
      return optimizeCloudinary(product.image);
    }
    if (product?.images?.length > 0) {
      return optimizeCloudinary(product.images[0].image);
    }
    return FALLBACK_IMAGE;
  };
  const optimizeCloudinary = (url) => {
    if (!url) return "";
    if (!url.includes("res.cloudinary.com")) {
      return url;
    }
    return url.replace(
      "/upload/",
      "/upload/f_auto,q_auto/"
    );
  };
  return {
    getProductImage,
    optimizeCloudinary
  };
};

export { useImages as u };
//# sourceMappingURL=useImages-CVASCtOr.mjs.map
