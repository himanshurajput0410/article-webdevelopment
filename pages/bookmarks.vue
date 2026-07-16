<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { user } = useAuth()
</script>

<template>
  <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900">Your bookmarks</h1>
    <p class="mt-2 text-sm text-gray-500">Signed in as {{ user?.email }}.</p>
  </div>
</template>
