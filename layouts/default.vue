<template>
  <div class="min-h-screen bg-gray-50">
    <header class="border-b border-gray-200 bg-white">
      <div class="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="text-lg font-semibold text-gray-900">
          Articles
        </NuxtLink>
      </div>
    </header>
    <main class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <slot />
    </main>
  </div>
</template>
