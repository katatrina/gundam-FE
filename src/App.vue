<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast';
</script>

<template>
  <Toast />
  <div class="w-full min-h-screen flex flex-col justify-between">
    <RouterView />
  </div>
</template>

<style scoped></style>
