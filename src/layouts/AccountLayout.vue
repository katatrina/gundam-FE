<template>
  <!-- Account pages layout -->
  <div>
    <div class="">
      <div class="flex flex-row gap-4">
        <!-- Left Section - Navigation Sidebar -->
        <section class="w-64 shrink-0 bg-white rounded-md shadow-sm p-4 self-start top-6">
          <AccountLeftSideBar />
        </section>

        <!-- Right Section - Main Content -->
        <section class="flex-1 min-h-[280px] bg-white rounded-md shadow-sm p-4 mb-10">
          <RouterView />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AccountLeftSideBar from '@/components/account/AccountLeftSideBar.vue';
</script>
