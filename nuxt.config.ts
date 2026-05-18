export default defineNuxtConfig({
  // 1. Indica que el código fuente está en la carpeta 'app'
  srcDir: 'app/', 
  
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/global.css'],

  // 2. Ajusta la ruta de los stores (ahora están en app/stores)
  imports: {
    dirs: ['stores'] 
  },

  runtimeConfig: {
    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ||
        process.env.API_BASE ||
        (process.env.NODE_ENV === 'production'
          ? 'https://pymeweb-backend.onrender.com/api'
          : 'http://127.0.0.1:8000/api'),
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || '',
      cloudinaryUploadUrl: process.env.CLOUDINARY_UPLOAD_URL || '',
      googleClientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    }
  },

  app: {
    head: {
      title: 'Pymeweb - Gestión Digital para PYMEs',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Plataforma integral de gestión' },
        { name: 'referrer', content: 'no-referrer' },
        // CSP: ajusta dominios externos si usas CDNs, fuentes o mapas
        {
          'http-equiv': 'Content-Security-Policy',
          content: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://accounts.google.com https://apis.google.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "frame-src 'self' https://accounts.google.com",
            "worker-src 'self' blob:",
            // Permite API y websockets de desarrollo
            `connect-src 'self' ${process.env.API_BASE || 'http://127.0.0.1:8000'} http://localhost:8000 http://127.0.0.1:8000 http://192.168.18.61:8000 ws://localhost:* ws://127.0.0.1:* ws://192.168.18.61:* https://api.cloudinary.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com`,
            // Añade dominios externos requeridos via NUXT_CSP_EXTRA (espacio-separados)
            process.env.NUXT_CSP_EXTRA ? `connect-src 'self' ${process.env.API_BASE || 'http://127.0.0.1:8000'} ${process.env.NUXT_CSP_EXTRA}` : null,
          ].filter(Boolean).join('; ')
        },
        { 'http-equiv': 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=()' },
      ]
    }
  },

  // Dev server ports to avoid clashes with other running services
  devServer: {
    port: Number(process.env.NUXT_PORT) || 3001,
    host: process.env.NUXT_HOST || 'localhost'
  },
  vite: {
    server: {
      hmr: {
        port: Number(process.env.NUXT_HMR_PORT) || 24680
      }
    }
  },

  routeRules: {
    // Prerender root page for static generation
    '/': { prerender: true },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: [],
      ignore: ['/admin', '/dashboard', '/store', '/marketplace', '/profile', '/tiendas', '/login', '/register', '/notificaciones'],
    }
  }
})
