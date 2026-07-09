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
  <div class="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5" aria-hidden="true">
    <div :class="variant === 'list' ? 'aspect-[16/10]' : 'aspect-square'" class="w-full animate-pulse bg-gray-200" />
    <div class="space-y-3 bg-slate-800 p-3">
      <div class="h-4 w-full animate-pulse rounded bg-slate-600" />
      <div v-if="variant === 'list'" class="h-3.5 w-3/5 animate-pulse rounded bg-slate-600" />
    </div>
  </div>
</template>
