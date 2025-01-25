<template>
  <!-- Account pages layout -->
  <div class="text-sm">
    <div class="container mx-auto">
      <div class="flex flex-row gap-4">
        <!-- Left Section - Navigation Sidebar -->
        <section class="w-52 shrink-0 bg-white rounded-md shadow-sm p-4 self-start sticky top-6">
          <AccountLeftSideBar />
        </section>

        <!-- Right Section - Main Content -->
        <section class="flex-1 bg-white rounded-md shadow-sm p-4">
          <RouterView />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountLeftSideBar from '@/components/profile/AccountLeftSideBar.vue';
</script>
