<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <i class="pi pi-star-fill text-yellow-500"></i>
        <h3 class="text-primary font-bold text-lg">GÓI CỦA BẠN</h3>
      </div>
    </div>

    <div class="text-sm space-y-2">
      <div class="flex justify-between">
        <span>Số lượt bán còn lại:</span>
        <span class="font-semibold">{{ packageInfo.listingsRemaining }}</span>
      </div>

      <div class="flex justify-between">
        <span>Số lượt đấu giá còn lại:</span>
        <span class="font-semibold">{{ packageInfo.auctionsRemaining }}</span>
      </div>

      <div class="flex justify-between items-center">
        <span>Tình trạng:</span>
        <span class="text-green-600 flex items-center gap-1">
          <i class="pi pi-circle-fill text-[6px]"></i>
          Hoạt động
        </span>
      </div>
    </div>

    <div class="mt-3">
      <button
        @click="upgradePackage"
        class="w-full py-2 px-4 bg-blue-500 text-white rounded flex items-center justify-center gap-2"
      >
        <i class="pi pi-sparkles"></i>
        <span>ĐĂNG KÝ GÓI BÁN</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Dữ liệu mẫu - Bạn có thể kết nối API sau này
const packageInfo = ref({
  listingsRemaining: 5,
  auctionsRemaining: 1,
  status: 'active',
})

const upgradePackage = () => {
  // Xử lý logic nâng cấp hoặc đăng ký gói
  console.log('Upgrade package clicked')
}
</script>

<style scoped>
/* Component sẽ tự động điều chỉnh chiều cao theo nội dung */
</style>
