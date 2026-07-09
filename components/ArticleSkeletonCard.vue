<template>
  <div class="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" aria-hidden="true">
    <div class="aspect-video w-full animate-pulse bg-gray-200" />
    <div class="flex flex-col gap-3 p-4">
      <UiSkeletonLine width="40%" height="0.75rem" />
      <UiSkeletonLine height="1.25rem" />
      <UiSkeletonLine width="90%" height="0.875rem" />
      <UiSkeletonLine width="70%" height="0.875rem" />
    </div>
  </div>
</template>
