<template>
  <!-- Account pages layout -->
  <div>
    <div class="">
      <div class="flex flex-row gap-4">
        <!-- Left Section - Navigation Sidebar -->
        <section class="w-64 shrink-0 self-start sticky top-6">
          <!-- Seller Subscription Plan Component - height tự động điều chỉnh -->
          <div class="bg-white rounded-md shadow-sm p-4 mb-3 h-auto">
            <SellerSubscriptionPlan />
          </div>

          <!-- Navigation Sidebar -->
          <div class="bg-white rounded-md shadow-sm p-4">
            <SellerLeftSideBar />
          </div>
        </section>

        <!-- Right Section - Main Content -->
        <section class="flex-1 min-h-[387px] bg-white rounded-md shadow-sm px-4 mb-10">
          <RouterView />
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SellerLeftSideBar from '@/components/seller/SellerLeftSideBar.vue'
import SellerSubscriptionPlan from '@/components/seller/SellerSubscriptionPlan.vue'
</script>
