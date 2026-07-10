<script setup lang="ts">
withDefaults(
  defineProps<{
    message?: string
    retrying?: boolean
  }>(),
  {
    message: 'Something went wrong. Please try again.',
    retrying: false,
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
    <p class="break-words text-sm font-medium text-red-700">{{ message }}</p>
    <UiButton variant="secondary" :disabled="retrying" @click="$emit('retry')">
      {{ retrying ? 'Retrying…' : 'Try again' }}
    </UiButton>
  </div>
</template>
