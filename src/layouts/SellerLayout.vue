<template>
  <!-- Account pages layout -->
  <div>
    <div class="">
      <div class="flex flex-row gap-4">
        <!-- Left Section - Navigation Sidebar -->
        <section class="w-64 shrink-0 self-start top-6">
          <div class="bg-white rounded-md shadow-sm p-4">
            <!-- Seller Subscription Plan Component -->
            <div class="mb-4">
              <SellerSubscriptionPlan />
            </div>

            <!-- Divider (tùy chọn) -->
            <div class="border-t border-gray-200 my-4"></div>

            <!-- Navigation Sidebar -->
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
