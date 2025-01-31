<template>
  <div>
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-xl font-semibold">Địa chỉ của tôi</h1>
      </div>

      <Button label="Thêm Địa Chỉ Mới" icon="pi pi-plus" class="px-3 py-1.5 rounded-sm text-sm"
        @click="addNewAddressDialogRef?.openDialog()" />
    </div>

    <AddNewAddressDialog ref="addNewAddressDialogRef" />

    <Divider />

    <div class="flex justify-between items-start">
      <div class="space-y-1">
        <div class="flex items-center">
          <p class="font-semibold">Nguyễn Văn A</p>
          <Divider layout="vertical" class="mx-2 h-6" />
          <p class="text-gray-600">0987654321</p>
        </div>
        <p class="text-gray-600">Số 24, Tổ 1 Khu Phố Bàu Hốt</p>
        <p class="text-gray-600">Thị Trấn Lai Uyên, Huyện Bàu Bàng, Bình Dương</p>
        <Tag value="Mặc định" severity="info"></Tag>
      </div>

      <div class="flex flex-col items-end gap-y-2">
        <div class="flex">
          <button class="rounded-md px-3 py-1.5 text-blue-600 hover:text-blue-800 bg-transparent">
            Cập Nhật
          </button>
          <button class="rounded-md px-3 py-1.5 text-red-600 hover:text-red-800 bg-transparent">
            Xóa
          </button>
        </div>

        <Button label="Thiết lập mặc định" severity="secondary" class="rounded-sm" size="small" raised />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Divider, Tag } from 'primevue';
import AddNewAddressDialog from '@/components/account/AddNewAddressDialog.vue';
import { ref } from 'vue';

const addNewAddressDialogRef = ref();

</script>

<style scoped></style>
