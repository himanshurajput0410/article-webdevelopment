<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'accent'
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    type: 'button',
  },
)

defineEmits<{
  click: [MouseEvent]
}>()

const variantClasses: Record<'primary' | 'secondary' | 'accent', string> = {
  primary: 'rounded-md bg-gray-900 text-white hover:bg-gray-700',
  secondary: 'rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-50',
  accent: 'rounded-full bg-blue-600 text-white hover:bg-blue-700',
}
</script>

<template>
  <button
    :type="type"
    class="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
    :class="variantClasses[variant]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
