<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
  }>(),
  {
    message: "Something went wrong. Please try again.",
  },
)

defineEmits<{
  retry: []
}>()
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-8 text-center"
    role="alert"
  >
    <p class="text-sm font-medium text-red-700">{{ message }}</p>
    <UiButton variant="secondary" @click="$emit('retry')">Try again</UiButton>
  </div>
</template>
