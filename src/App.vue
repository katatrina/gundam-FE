<template>
  <div class="w-full min-h-screen flex flex-col justify-between bg-gray-100">
    <RouterView />
  </div>
  <Toast position="top-center" group="tc" />
  <Toast position="top-right" group="tr" />
  <Toast position="bottom-right" group="br" />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { RouterView } from 'vue-router';

</script>

<style scoped></style>
