<script setup lang="ts">
import { CircleCheck, CircleX, X } from '@lucide/vue'

const { toasts, dismiss } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
    <TransitionGroup name="toast" tag="div" class="flex flex-col items-center gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        role="status"
        class="pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg"
        :class="toast.type === 'success' ? 'bg-gray-900' : 'bg-red-600'"
      >
        <CircleCheck v-if="toast.type === 'success'" :size="18" class="shrink-0" aria-hidden="true" />
        <CircleX v-else :size="18" class="shrink-0" aria-hidden="true" />
        <span>{{ toast.message }}</span>
        <button
          type="button"
          class="ml-1 text-white/70 hover:text-white"
          aria-label="Dismiss notification"
          @click="dismiss(toast.id)"
        >
          <X :size="16" aria-hidden="true" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
