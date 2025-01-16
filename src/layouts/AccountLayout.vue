<template>
  <!-- Account pages layout -->
  <div class="text-sm">
    <div class="flex flex-row gap-4">
      <!-- Left Section - Navigation Sidebar -->
      <section class="w-52 bg-white rounded-md shadow-sm p-4">
        <AccountLeftSideBar />
      </section>

      <!-- Right Section - Main Content -->
      <section class="flex-1 bg-white rounded-md shadow-sm p-4">
        <RouterView />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountLeftSideBar from '@/components/AccountLeftSideBar.vue';
</script>
