<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const submitting = ref(false)
const errorMessage = ref<string | null>(null)

async function onSubmit() {
  submitting.value = true
  errorMessage.value = null

  try {
    await login({ email: email.value, password: password.value })
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    await router.push(redirect)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-sm px-4 py-16 sm:px-6">
    <h1 class="mb-1 text-3xl font-bold text-gray-900">Log in</h1>
    <p class="mb-6 text-sm text-gray-500">Use one of the seeded demo accounts to continue.</p>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
          placeholder="ada@example.com"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
      </div>

      <div>
        <label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          required
          placeholder="password123"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
        >
      </div>

      <p v-if="errorMessage" class="text-sm font-medium text-red-700" role="alert">{{ errorMessage }}</p>

      <UiButton type="submit" variant="accent" class="w-full" :disabled="submitting">
        {{ submitting ? 'Logging in…' : 'Log in' }}
      </UiButton>
    </form>
  </div>
</template>
