export default defineNuxtConfig({
  compatibilityDate: '2026-07-09',

  devtools: { enabled: true },

  ssr: true,

  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxt/eslint'],

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
    typeCheck: true,
  },

  app: {
    head: {
      title: 'Web Dev Challenge',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
    },
  },
})
