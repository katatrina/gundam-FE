<template>
  <Toast position="bottom-right" group="br" />
  <div class="w-full min-h-screen flex flex-col justify-between">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import Toast from 'primevue/toast';
import { RouterView } from 'vue-router';
import { verifyAccessToken } from './utils/auth';
import { onMounted } from 'vue';

onMounted(() => {
  verifyAccessToken();
});
</script>

<style scoped></style>
