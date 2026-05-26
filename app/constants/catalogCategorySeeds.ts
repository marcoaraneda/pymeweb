export type CatalogCategorySeed = {
  name: string
  slug: string
}

export const CATEGORY_SEEDS_BY_STORE_TYPE: Record<string, CatalogCategorySeed[]> = {
  retail: [
    { name: 'Ropa', slug: 'ropa' },
    { name: 'Polera', slug: 'polera' },
    { name: 'Poleron', slug: 'poleron' },
    { name: 'Calzado', slug: 'calzado' },
    { name: 'Electrodomesticos', slug: 'electrodomesticos' },
    { name: 'Tecnologia', slug: 'tecnologia' },
    { name: 'Computacion', slug: 'computacion' },
    { name: 'Celulares', slug: 'celulares' },
    { name: 'TV y Audio', slug: 'tv-audio' },
    { name: 'Hogar', slug: 'hogar' },
    { name: 'Muebles', slug: 'muebles' },
    { name: 'Cocina', slug: 'cocina' },
    { name: 'Comida', slug: 'comida' },
    { name: 'Bebidas', slug: 'bebidas' },
    { name: 'Supermercado', slug: 'supermercado' },
    { name: 'Salud y Belleza', slug: 'salud-belleza' },
    { name: 'Deportes', slug: 'deportes' },
    { name: 'Aire libre', slug: 'aire-libre' },
    { name: 'Jugueteria', slug: 'jugueteria' },
    { name: 'Bebes', slug: 'bebes' },
    { name: 'Mascotas', slug: 'mascotas' },
    { name: 'Libreria', slug: 'libreria' },
    { name: 'Automotriz', slug: 'automotriz' },
    { name: 'Ferreteria', slug: 'ferreteria' },
    { name: 'Oficina', slug: 'oficina' },
  ],
  fast_food: [
    { name: 'Agregados', slug: 'agregados' },
    { name: 'Combos', slug: 'combos' },
    { name: 'Hamburguesas', slug: 'hamburguesas' },
    { name: 'Pizzas', slug: 'pizzas' },
    { name: 'Sandwiches', slug: 'sandwiches' },
    { name: 'Wraps', slug: 'wraps' },
    { name: 'Desayunos', slug: 'desayunos' },
    { name: 'Papas y Acompanamientos', slug: 'papas-acompanamientos' },
    { name: 'Pollo y Nuggets', slug: 'pollo-nuggets' },
    { name: 'Ensaladas', slug: 'ensaladas' },
    { name: 'Salsas', slug: 'salsas' },
    { name: 'Postres', slug: 'postres' },
    { name: 'Bebidas', slug: 'bebidas' },
    { name: 'Bebestibles', slug: 'bebestibles' },
  ],
  bakery: [
    { name: 'Tortas', slug: 'tortas' },
    { name: 'Pasteles', slug: 'pasteles' },
    { name: 'Queques', slug: 'queques' },
    { name: 'Galletas', slug: 'galletas' },
    { name: 'Panaderia', slug: 'panaderia' },
    { name: 'Productos sin azucar', slug: 'sin-azucar' },
    { name: 'Cafeteria', slug: 'cafeteria' },
    { name: 'Bebidas frias', slug: 'bebidas-frias' },
    { name: 'Snacks dulces', slug: 'snacks-dulces' },
  ],
  pharmacy: [
    { name: 'Medicamentos', slug: 'medicamentos' },
    { name: 'Vitaminas', slug: 'vitaminas' },
    { name: 'Cuidado personal', slug: 'cuidado-personal' },
    { name: 'Higiene', slug: 'higiene' },
    { name: 'Dermocosmetica', slug: 'dermocosmetica' },
    { name: 'Primeros auxilios', slug: 'primeros-auxilios' },
    { name: 'Bebes y maternidad', slug: 'bebes-maternidad' },
    { name: 'Suplementos', slug: 'suplementos' },
  ],
  fashion: [
    { name: 'Poleras', slug: 'poleras' },
    { name: 'Polerones', slug: 'polerones' },
    { name: 'Pantalones', slug: 'pantalones' },
    { name: 'Jeans', slug: 'jeans' },
    { name: 'Vestidos', slug: 'vestidos' },
    { name: 'Abrigos', slug: 'abrigos' },
    { name: 'Calzado', slug: 'calzado' },
    { name: 'Accesorios', slug: 'accesorios' },
    { name: 'Deportivo', slug: 'deportivo' },
  ],
  bookstore: [
    { name: 'Novedades', slug: 'novedades' },
    { name: 'Ficcion', slug: 'ficcion' },
    { name: 'No ficcion', slug: 'no-ficcion' },
    { name: 'Infantil', slug: 'infantil' },
    { name: 'Comics y Manga', slug: 'comics-manga' },
    { name: 'Papeleria', slug: 'papeleria' },
    { name: 'Oficina', slug: 'oficina' },
    { name: 'Escolar', slug: 'escolar' },
  ],
}

export const getCatalogCategorySeedsByStoreType = (storeType?: string): CatalogCategorySeed[] => {
  const key = String(storeType || 'retail').trim().toLowerCase()
  return CATEGORY_SEEDS_BY_STORE_TYPE[key] || CATEGORY_SEEDS_BY_STORE_TYPE.retail
}

// Compatibilidad con implementaciones previas.
export const CATALOG_CATEGORY_SEEDS: CatalogCategorySeed[] = CATEGORY_SEEDS_BY_STORE_TYPE.retail
