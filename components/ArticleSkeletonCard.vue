<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'list' | 'grid'
  }>(),
  {
    variant: 'list',
  },
)
</script>

<template>
  <div
    class="flex overflow-hidden rounded-2xl shadow-sm  ring-1 ring-black/5"
    :class="variant === 'list' ? 'flex-col sm:flex-row' : 'flex-col'"
    aria-hidden="true"
  >
    <div
      class="w-full shrink-0 animate-pulse bg-gray-200"
      :class="variant === 'list' ? 'aspect-[16/10] sm:aspect-auto sm:w-64' : 'aspect-square'"
    />
    <div class="min-w-0 flex-1 space-y-3 bg-card p-3" :class="variant === 'list' && 'sm:p-4'">
      <div class="h-4 w-full animate-pulse rounded bg-white/20" />
      <div v-if="variant === 'list'" class="h-3.5 w-3/5 animate-pulse rounded bg-white/20" />
    </div>
  </div>
</template>
