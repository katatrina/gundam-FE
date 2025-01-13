<template>
  <Toast />
  <div class="w-full min-h-screen flex flex-col justify-between">
    <RouterView />
  </div>
  <Toast position="bottom-right" group="br" />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { RouterView } from 'vue-router';

</script>

<style scoped></style>
