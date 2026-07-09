<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message?: string
  }>(),
  {
    title: 'Nothing to show',
    message: 'There is no data to display right now.',
  },
)
</script>

<template>
  <div class="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center" role="status">
    <p class="font-medium text-gray-900">{{ title }}</p>
    <p class="mt-1 text-sm text-gray-500">{{ message }}</p>
  </div>
</template>
