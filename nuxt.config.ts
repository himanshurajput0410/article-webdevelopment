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
      title: 'Articles',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  runtimeConfig: {
    public: {
      articlesApiUrl:
        process.env.NUXT_PUBLIC_ARTICLES_API_URL ||
        'https://mocki.io/v1/38c57ea8-5688-4a36-9629-8c9616754eb8',
    },
  },
})
