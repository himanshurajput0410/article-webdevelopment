<script setup lang="ts">
withDefaults(
  defineProps<{
    width?: string
    height?: string
  }>(),
  {
    width: '100%',
    height: '1rem',
  },
)
</script>

<template>
  <div
    class="animate-pulse rounded bg-gray-200"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>
