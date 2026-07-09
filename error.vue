<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

function handleClear() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
    <h1 class="text-4xl font-bold text-gray-900">
      {{ props.error.statusCode }}
    </h1>
    <p class="text-gray-600">
      {{ props.error.statusMessage || 'Something went wrong.' }}
    </p>
    <button
      class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      @click="handleClear"
    >
      Back to home
    </button>
  </div>
</template>
