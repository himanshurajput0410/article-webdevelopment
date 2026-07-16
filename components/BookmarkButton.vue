<script setup lang="ts">
withDefaults(
  defineProps<{
    bookmarked: boolean
    pending?: boolean
  }>(),
  {
    pending: false,
  },
)

defineEmits<{
  toggle: []
}>()
</script>

<template>
  <button
    type="button"
    class="flex h-8 w-10 items-center justify-center transition-transform active:scale-90 disabled:cursor-not-allowed disabled:opacity-50"
    :aria-label="bookmarked ? 'Remove bookmark' : 'Add bookmark'"
    :disabled="pending"
    @click="$emit('toggle')"
  >
    <img v-if="!bookmarked" src="/icons/heart.png" alt="" class="h-8 w-10">
    <img v-else src="/icons/heart-minus.png" alt="" class="h-8 w-10">
  </button>
</template>
