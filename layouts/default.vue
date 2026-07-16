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
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="shrink-0 whitespace-nowrap font-bold text-gray-900">
          <span class="text-base sm:hidden">Articles</span>
          <span class="hidden text-lg sm:inline">Article Manager</span>
        </NuxtLink>

        <div class="flex min-w-0 items-center gap-3 text-sm sm:gap-4">
          <NuxtLink
            v-if="isAuthenticated"
            to="/bookmarks"
            class="whitespace-nowrap font-medium text-gray-700 hover:text-gray-900"
          >
            Bookmarks
          </NuxtLink>

          <template v-if="isAuthenticated">
            <span class="hidden truncate text-gray-500 sm:inline">{{ user?.name }}</span>
            <button
              type="button"
              class="whitespace-nowrap font-medium text-accent hover:text-accent/80"
              @click="onLogout"
            >
              Log out
            </button>
          </template>

          <NuxtLink v-else to="/login" class="whitespace-nowrap font-medium text-accent hover:text-accent/80">
            Log in
          </NuxtLink>
        </div>
      </div>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>
