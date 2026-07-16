<script setup lang="ts">
const { user, isAuthenticated, logout } = useAuth()
const router = useRouter()

async function onLogout() {
  await logout()
  await router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-white">
    <header class="border-b border-gray-200">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="text-lg font-bold text-gray-900">Articles</NuxtLink>

        <div class="flex items-center gap-4 text-sm">
          <NuxtLink v-if="isAuthenticated" to="/bookmarks" class="font-medium text-gray-700 hover:text-gray-900">
            Bookmarks
          </NuxtLink>

          <template v-if="isAuthenticated">
            <span class="text-gray-500">{{ user?.name }}</span>
            <button
              type="button"
              class="font-medium text-accent hover:text-accent/80"
              @click="onLogout"
            >
              Log out
            </button>
          </template>

          <NuxtLink v-else to="/login" class="font-medium text-accent hover:text-accent/80">Log in</NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
