<template>
  <div class="bg-white rounded-md p-4">
    <!-- Navigation Left Side Bar -->
    <div class="w-full">
      <AccountLeftSideBar />
    </div>

    <!-- Main Content in the right -->
    <div class="w-4/5">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountLeftSideBar from '@/components/AccountLeftSideBar.vue';
</script>

<style scoped></style>
