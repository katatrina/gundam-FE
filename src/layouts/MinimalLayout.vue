<template>
  <div class="w-full">
    <header class="header">
      <div class="container mx-auto px-4 py-2">
        <nav class="flex items-center h-16">
          <RouterLink to="/" class="flex items-center">
            <img src="https://images-na.ssl-images-amazon.com/images/I/61wswIFrQPL.jpg" alt="ComZone" class="h-8">
            <span class="ml-2 text-xl font-bold">Mecha World</span>
          </RouterLink>
        </nav>
      </div>
    </header>

    <Divider layout="horizontal" type="solid" class="mt-0" />

    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Divider from 'primevue/divider';
</script>
