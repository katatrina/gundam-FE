<template>
  <div>
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-xl font-semibold">Địa chỉ của tôi</h1>
      </div>

      <Button label="Thêm Địa Chỉ Mới" icon="pi pi-plus" class="px-3 py-1.5 rounded-sm text-sm"
        @click="showAddNewAddressDialog = true" />
    </div>

    <Dialog v-model:visible="showAddNewAddressDialog" modal header="Địa chỉ mới" :style="{ width: '35rem' }"
      class="rounded-sm">
      <div class="mt-1 text-sm space-y-3">
        <!-- Họ tên & Số điện thoại -->
        <div class="grid grid-cols-2 gap-2">
          <FloatLabel variant="on">
            <InputText id="receiver_name" v-model="val1" class="w-full rounded-sm" />
            <label for="receiver_name">Họ và tên</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <InputText id="receiver_phone_number" v-model="val2" class="w-full rounded-sm" />
            <label for="receiver_phone_number">Số điện thoại</label>
          </FloatLabel>
        </div>

        <!-- Địa chỉ (Tỉnh, Quận, Phường) -->
        <div class="grid grid-cols-3 gap-2">
          <FloatLabel variant="on">
            <Select v-model="value3" inputId="province" :options="provinces" optionLabel="provinceName"
              class="w-full rounded-sm" />
            <label for="province">Tỉnh/Thành phố</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <Select v-model="value4" inputId="district" :options="districts" optionLabel="provinceName"
              class="w-full rounded-sm" />
            <label for="district">Quận/Huyện</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <Select v-model="value5" inputId="ward" :options="wards" optionLabel="wardName" class="w-full rounded-sm" />
            <label for="ward">Phường/Xã</label>
          </FloatLabel>
        </div>

        <!-- Địa chỉ cụ thể -->
        <FloatLabel variant="on">
          <Textarea id="addressDetail" v-model="addressDetail" rows="2" style="resize: none"
            class="w-full rounded-sm" />
          <label for="addressDetail">Địa chỉ cụ thể</label>
        </FloatLabel>

        <!-- Checkbox Đặt làm mặc định -->
        <div class="flex items-center">
          <Checkbox v-model="isPrimaryAddress" class="mr-2" binary />
          <label class="text-gray-700">Đặt làm mặc định</label>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="Hủy" severity="secondary" @click="showAddNewAddressDialog = false" />
          <Button label="Xác Nhận" severity="primary" />
        </div>
      </div>
    </Dialog>

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
import { Button, Dialog, Divider, FloatLabel, InputText, Select, Tag, Textarea, Checkbox } from 'primevue';
import { ref } from 'vue';

const showAddNewAddressDialog = ref(false);

const val1 = ref('');
const val2 = ref('');
const value3 = ref(null);
const value4 = ref(null);
const value5 = ref(null);
const provinces = ref([
  { name: 'Hồ Chí Minh', code: 'HCM' },
  { name: 'Hà Nội', code: 'HN' },
  { name: 'Đà Nẵng', code: 'DN' },
]);
const districts = ref([
  { name: 'Quận 1', code: 'Q1' },
  { name: 'Quận 2', code: 'Q2' },
  { name: 'Quận 3', code: 'Q3' },
]);

const wards = ref([
  { name: 'Phường 1', code: 'P1' },
  { name: 'Phường 2', code: 'P2' },
  { name: 'Phường 3', code: 'P3' },
]);
const addressDetail = ref('');
const isPrimaryAddress = ref(false);

</script>

<style scoped></style>
