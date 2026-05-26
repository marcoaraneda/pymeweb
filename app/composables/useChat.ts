import { useRuntimeConfig } from 'nuxt/app'
import { useMarketplaceRequests } from '~/composables/useMarketplaceRequests'

type MarketplaceProduct = {
  id: number | string
  name: string
  price: number
  offer_price?: number | null
  description?: string
  store?: { slug?: string; name?: string }
}

type StoreItem = { name: string; slug: string; description?: string }

let productsCache: MarketplaceProduct[] | null = null
let storesCache: StoreItem[] | null = null
let lastProductsFetch = 0
let lastStoresFetch = 0

const CACHE_TTL = 1000 * 60 * 5 // 5 minutos

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 }).format(value || 0)

export const useChat = () => {
  const config = useRuntimeConfig()
  const { controlledGet } = useMarketplaceRequests()

  const fetchMarketplaceProducts = async (): Promise<MarketplaceProduct[]> => {
    const now = Date.now()
    if (productsCache && now - lastProductsFetch < CACHE_TTL) return productsCache
    try {
      productsCache = await controlledGet<MarketplaceProduct[]>(
        'chat:marketplace:products',
        `${config.public.apiBase}/marketplace/products/`,
        { backoffMs: 10_000, minIntervalMs: 1000 },
      )
      lastProductsFetch = now
      return productsCache || []
    } catch (error) {
      console.warn('No se pudieron cargar productos para el chat', error)
      return []
    }
  }

  const fetchStores = async (): Promise<StoreItem[]> => {
    const now = Date.now()
    if (storesCache && now - lastStoresFetch < CACHE_TTL) return storesCache
    try {
      storesCache = await controlledGet<StoreItem[]>(
        'chat:stores',
        `${config.public.apiBase}/stores/`,
        { backoffMs: 10_000, minIntervalMs: 1500 },
      )
      lastStoresFetch = now
      return storesCache || []
    } catch (error) {
      console.warn('No se pudieron cargar tiendas para el chat', error)
      return []
    }
  }

  const cheapestProductAnswer = async () => {
    const products = await fetchMarketplaceProducts()
    if (!products.length) return 'No encontré productos en el marketplace por ahora. ¿Quieres que revise de nuevo en unos minutos?'
    const sorted = [...products].sort((a, b) => {
      const pa = Number(a.offer_price || a.price || 0)
      const pb = Number(b.offer_price || b.price || 0)
      return pa - pb
    })
    const top = sorted.slice(0, 3)
    const list = top
      .map((p) => {
        const storeLabel = p.store?.name ? `en la tienda ${p.store.name}` : 'en el marketplace'
        return `• ${p.name} — ${formatCurrency(Number(p.offer_price || p.price || 0))} ${storeLabel}`
      })
      .join('\n')
      return `Estos son los precios más bajos que encontré ahora mismo:\n${list}\n¿Te gustaría ver alguno en detalle? Solo dime cuál.`
  }

  const computersAnswer = async () => {
    const products = await fetchMarketplaceProducts()
    const filtered = products.filter((p) => /comput|pc|laptop|notebook|equipo/i.test(p.name || p.description || ''))
    if (!filtered.length) {
      return 'No veo computadores disponibles en este momento. Si quieres, puedo avisarte cuando aparezcan nuevos.'
    }
    const top = filtered.slice(0, 3)
    const list = top
      .map((p) => {
        const storeLabel = p.store?.name ? `en la tienda ${p.store.name}` : 'en el marketplace'
        return `• ${p.name} — ${formatCurrency(Number(p.offer_price || p.price || 0))} ${storeLabel}`
      })
      .join('\n')
    return `Estos computadores están disponibles ahora mismo:\n${list}\n¿Buscas algo más específico? Cuéntame y te ayudo a filtrar.`
  }

  const storesAnswer = async () => {
    const stores = await fetchStores()
    if (!stores.length) return 'Todavía no hay tiendas registradas. ¿Te gustaría ser la primera? Puedes crear la tuya desde el panel.'
    const list = stores
      .slice(0, 5)
      .map((s) => `• ${s.name}`)
      .join('\n')
    return `Estas son algunas tiendas activas en Pymeweb:\n${list}\n¿Quieres ver más detalles de alguna? Dímelo y te muestro.`
  }

  const fallbackAnswer = () =>
    'Puedo ayudarte a comparar precios, recomendar tiendas o buscar productos por categoría. Por ejemplo, prueba con: "¿Qué tienda vende más barato hoy?" o "Muéstrame notebooks disponibles".'


  /**
   * Prompt base: El asistente solo responde sobre productos, tiendas, compras, ayuda de uso de la web y temas relacionados a Pymeweb. Si la pregunta no es relevante, responde que solo puede ayudar con temas de la página.
   */
  const sendMessage = async (message: string) => {
    const lower = message.toLowerCase()
    let answer = ''

    // Preguntas frecuentes y comandos clave
    if (lower.includes('barat') || lower.includes('econom')) {
      answer = await cheapestProductAnswer()
    } else if (/comput|pc|laptop|notebook/.test(lower)) {
      answer = await computersAnswer()
    } else if (lower.includes('tienda') || lower.includes('store')) {
      answer = await storesAnswer()
    } else if (lower.includes('ayuda') || lower.includes('cómo funciona') || lower.includes('uso')) {
      answer = 'Puedes buscar productos, comparar precios, ver tiendas y comprar directamente desde la plataforma. Si tienes dudas, dime qué necesitas y te ayudo.'
    } else if (lower.includes('contacto') || lower.includes('soporte')) {
      answer = '¿Necesitas ayuda? Puedes contactarnos usando el formulario de la web o desde la sección de soporte. ¡Estoy aquí para ayudarte también!'
    } else if (lower.match(/(hola|buenas|buenos días|buenas tardes|buenas noches)/)) {
      answer = '¡Hola! ¿En qué puedo ayudarte hoy? Pregúntame por productos, precios o tiendas.'
    } else if (lower.match(/(quién eres|quien eres|tu nombre|eres humano|eres una ia)/)) {
      answer = 'Soy Aurora, tu asistente virtual en Pymeweb. Estoy aquí para ayudarte a encontrar productos, comparar precios y resolver tus dudas.'
    } else if (lower.match(/(gracias|muchas gracias|te agradezco)/)) {
      answer = '¡De nada! Si tienes otra pregunta, aquí estaré para ayudarte.'
    } else if (lower.match(/(chiste|cuéntame un chiste|cuentame un chiste)/)) {
      answer = '¿Por qué el computador fue al doctor? Porque tenía un virus... ¡pero ya se actualizó!'
    } else if (lower.match(/(quién hizo|quien hizo|quién creó|quien creo|quién desarrolló|quien desarrollo)/)) {
      answer = 'Pymeweb fue creada por un equipo apasionado por ayudar a las pymes a crecer. ¿Te gustaría saber más?'
    } else if (lower.match(/(no encuentro|no hay|no aparece)/)) {
      answer = 'Si no encuentras un producto o tienda, puede que aún no esté disponible. ¿Quieres que te avise cuando aparezca?'
    } else if (lower.match(/(categoría|categorias|categorías)/)) {
      answer = 'Puedes buscar productos por categoría usando el buscador o preguntándome por el tipo de producto que te interesa. ¿Qué categoría buscas?'
    } else if (lower.match(/(envío|envios|envíos|despacho|despachos)/)) {
      answer = 'El envío depende de cada tienda. Si tienes dudas sobre un pedido, dime el producto y reviso la información.'
    } else {
      // Si la pregunta no es relevante, responde con el prompt base
      answer = 'Solo puedo responder preguntas sobre productos, tiendas, compras y el uso de Pymeweb. ¿Te gustaría saber precios, productos o ayuda sobre la plataforma?'
    }

    return { answer }
  }

  return { sendMessage }
}