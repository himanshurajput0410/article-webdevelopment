// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    // the domain layer must stay independent of Vue/Nuxt/Nitro so the
    // dependency arrow only ever points inward, from infra towards it
    files: ['models/domain/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['vue', '#app', '#imports', 'nuxt', 'h3', 'ofetch'],
        },
      ],
    },
  },
)
