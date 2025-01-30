<template>
  <div>
    <div class="flex justify-between items-center">
      <h1 class="text-xl font-semibold">Địa chỉ của tôi</h1>
      <Button label="Thêm Địa Chỉ Mới" icon="pi pi-plus" class="px-3 py-1.5 rounded-sm text-sm" />
    </div>

    <Divider class="my-4" />

    <div class="flex justify-between items-start">
      <div>
        <p>Số 24, Tổ 1 Khu Phố Bàu Hốt</p>
        <p class="text-gray-600 mt-1">Thị Trấn Lai Uyên, Huyện Bàu Bàng, Bình Dương
        </p>
      </div>

      <div class="flex gap-2">
        <button class="rounded-md px-3 py-1.5 text-blue-600 hover:text-blue-800 bg-transparent">
          Cập Nhật
        </button>
        <button class="rounded-md px-3 py-1.5 text-red-600 hover:text-red-800 bg-transparent">
          Xóa
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Divider, Button } from 'primevue';

</script>

<style scoped></style>
