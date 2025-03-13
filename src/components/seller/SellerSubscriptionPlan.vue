<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <i class="pi pi-star-fill text-yellow-500"></i>
        <h3 class="text-primary font-bold text-lg">
          {{ subscriptionStore.subscriptionDetails?.plan_name || 'Gói của bạn' }}
        </h3>
        <i
          v-if="subscriptionStore.subscriptionDetails?.is_unlimited"
          class="pi pi-infinity text-primary ml-1"
          title="Gói không giới hạn"
        ></i>
      </div>
    </div>

    <div class="text-sm space-y-2">
      <div class="flex justify-between">
        <span>Số lượt bán còn lại:</span>
        <span class="font-semibold">
          {{
            subscriptionStore.subscriptionDetails?.max_listings
              ? `${calculateRemainingListings} / ${subscriptionStore.subscriptionDetails.max_listings}`
              : 'Không giới hạn'
          }}
        </span>
      </div>

      <div class="flex justify-between">
        <span>Số lượt đấu giá còn lại:</span>
        <span class="font-semibold">
          {{
            subscriptionStore.subscriptionDetails?.max_open_auctions
              ? `${calculateRemainingAuctions} / ${subscriptionStore.subscriptionDetails.max_open_auctions}`
              : 'Không giới hạn'
          }}
        </span>
      </div>

      <div v-if="!isTrialPlan" class="flex justify-between">
        <span>Ngày hết hạn:</span>
        <span class="font-semibold">
          {{ formatEndDate }}
        </span>
      </div>

      <div class="flex justify-between items-center">
        <span>Tình trạng:</span>
        <span
          :class="
            subscriptionStore.subscriptionDetails?.is_active ? 'text-green-600' : 'text-red-600'
          "
          class="flex items-center gap-1"
        >
          <i class="pi pi-circle-fill text-[6px]"></i>
          {{ subscriptionStore.subscriptionDetails?.is_active ? 'Hoạt động' : 'Không hoạt động' }}
        </span>
      </div>
    </div>

    <div class="mt-3">
      <button
        @click="upgradePackage"
        class="w-full py-2 px-4 bg-blue-500 text-white rounded flex items-center justify-center gap-2"
      >
        <i class="pi pi-sparkles"></i>
        <span>NÂNG CẤP GÓI BÁN</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/config/axios'
import { useCookies } from '@vueuse/integrations/useCookies.mjs'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import { onMounted, computed } from 'vue'
import { ACCESS_TOKEN_KEY } from '@/constants'
import type { SellerSubscriptionDetails } from '@/types/models'

const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const cookies = useCookies()

const calculateRemainingListings = computed(() => {
  if (
    !subscriptionStore.subscriptionDetails ||
    subscriptionStore.subscriptionDetails.max_listings === null
  )
    return 'Không giới hạn'
  return (
    subscriptionStore.subscriptionDetails.max_listings -
    subscriptionStore.subscriptionDetails.listings_used
  )
})

const calculateRemainingAuctions = computed(() => {
  if (
    !subscriptionStore.subscriptionDetails ||
    subscriptionStore.subscriptionDetails.max_open_auctions === null
  )
    return 'Không giới hạn'
  return (
    subscriptionStore.subscriptionDetails.max_open_auctions -
    subscriptionStore.subscriptionDetails.open_auctions_used
  )
})

const formatEndDate = computed(() => {
  if (!subscriptionStore.subscriptionDetails?.end_date) return 'Không xác định'
  return new Date(subscriptionStore.subscriptionDetails.end_date).toLocaleDateString('vi-VN')
})

const isTrialPlan = computed(() => {
  return (
    subscriptionStore.subscriptionDetails?.plan_name?.toLowerCase().includes('dùng thử') ||
    subscriptionStore.subscriptionDetails?.plan_name?.toLowerCase().includes('trial')
  )
})

const upgradePackage = () => {
  console.log('Upgrade package clicked')
}

onMounted(async () => {
  try {
    const response = await axios.get<SellerSubscriptionDetails>(
      `/sellers/${authStore.user?.id}/subscriptions/active`,
      {
        headers: {
          Authorization: `Bearer ${cookies.get(ACCESS_TOKEN_KEY)}`,
        },
      },
    )

    subscriptionStore.setSubscriptionDetails(response.data)
  } catch (error: any) {
    console.error("Can't fetch subscription details", error.message)
  }
})
</script>

<style scoped>
/* Phần style không thay đổi */
</style>
