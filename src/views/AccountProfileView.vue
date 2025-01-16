<template>
  <!-- Added container class and flex to center horizontally -->
  <div class="container mx-auto flex justify-center">
    <div class="flex flex-row gap-4 w-full max-w-5xl">
      <!-- General Information: 7/10 width -->
      <div class="w-3/5">
        <form class="space-y-4" @submit.prevent="submitForm">
          <!-- Fullname -->
          <div class="flex items-center gap-4">
            <label class="w-32 flex-shrink-0 text-right" for="full_name">Tên</label>
            <InputText type="text" v-model="name" size="small" id="full_name" class="w-3/5" />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-32 flex-shrink-0 text-right">Email</label>
            <InputText :value="email" size="small" class="w-3/5" disabled />
          </div>

          <div class="flex items-center gap-4">
            <label class="w-32 flex-shrink-0 text-right">Số điện thoại</label>
            <div v-if="phone" class="flex items-center gap-2">
              {{ phone }}
              <button type="button" class="text-blue-600 underline">Thay Đổi</button>
            </div>
            <button v-else type="button" class="text-blue-600 underline">Thêm</button>
          </div>

          <div class="flex items-center gap-4">
            <div class="w-32"></div>
            <Button type="submit" label="Lưu" class="text-base" />
          </div>
        </form>
      </div>

      <Divider layout="vertical" type="solid" class="h-44" />

      <!-- Avatar Image: 3/10 width -->
      <div class="w-1/5 mx-auto">
        <img src="@/assets/images/user-avatar.png" alt="avatar" class="rounded-full w-28 h-28 mx-auto" />
        <!-- Chọn Ảnh button -->
        <div class="flex justify-center mt-4">
          <Button type="button" label="Chọn Ảnh" icon="pi pi-image" size="normal"
            class="bg-white border-gray-200 text-gray-500 hover:bg-gray-100" />
        </div>
        <div class="text-center text-sm text-gray-500 mt-2">
          Dụng lượng file tối đa 1 MB
          <br />
          Định dạng: .JPEG, .PNG
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const name = ref('Jack');
const email = ref('abc@gmail.com');
const phone = ref('*********89');

</script>

<style scoped></style>
