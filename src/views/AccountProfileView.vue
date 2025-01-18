<template>
  <!-- Added container class and flex to center horizontally -->
  <div class="container mx-auto flex justify-center">
    <div class="flex flex-row gap-2 w-full max-w-5xl">
      <!-- General Information: 3/5 width -->
      <div class="w-3/5">
        <form class="space-y-6" @submit="onUpdateUser">
          <!-- Fullname with reserved error space -->
          <div class="h-[44px]">
            <div class="flex items-center gap-4">
              <label class="w-32 flex-shrink-0 text-right" for="fullName">Tên</label>
              <InputText type="text" v-model="name" size="small" id="fullName" class="w-3/5"
                :class="{ 'border-red-500': errors.name }" :style="errors.name ? { backgroundColor: '#fffafa' } : {}" />
            </div>
            <div v-if="errors.name" class="flex">
              <div class="w-36"></div>
              <ErrorMessage name="name" class="text-red-500 text-sm" />
            </div>
          </div>

          <!-- Email with consistent height -->
          <div class="h-[44px]">
            <div class="flex items-center gap-4">
              <label class="w-32 flex-shrink-0 text-right">Email</label>
              <InputText :value="email" size="small" class="w-3/5" disabled />
            </div>
          </div>

          <!-- Phone Number with consistent height -->
          <div class="h-[44px]">
            <div class="flex items-center gap-4">
              <label class="w-32 flex-shrink-0 text-right">Số điện thoại</label>
              <div v-if="phoneNumber" class="flex items-center gap-2">
                {{ phoneNumber }}
                <button type="button" class="text-blue-600 underline">Thay Đổi</button>
              </div>
              <button v-else type="button" class="text-blue-600 underline">Thêm</button>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="h-[44px]">
            <div class="flex items-center gap-4">
              <div class="w-32"></div>
              <Button type="submit" label="Lưu" class="w-20" :loading="isSubmitting" />
            </div>
          </div>
        </form>
      </div>

      <!-- Vertical Divider -->
      <Divider layout="vertical" type="solid" class="h-44" />

      <!-- Avatar Image: 1/5 width -->
      <div class="w-1/5 mx-auto">
        <img :src="picture || ''" alt="avatar" class="rounded-full w-28 h-28 mx-auto" referrerpolicy="no-referrer" />
        <!-- Chọn Ảnh button -->
        <div class="flex justify-center mt-4">
          <Button type="button" label="Chọn Ảnh" icon="pi pi-image"
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
import axios from '@/config/axios';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types/models';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, Divider, InputText, useToast } from 'primevue';
import { ErrorMessage, useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import * as yup from 'yup';

const authStore = useAuthStore();
const toast = useToast();

const email = ref<string>('');
const phoneNumber = ref<string | null>(null);
const picture = ref<string | null>(null);

const validationSchema = yup.object({
  name: yup.string().required('Tên không được để trống').min(2, 'Tên phải có ít nhất 2 ký tự')
});

const { defineField, handleSubmit, resetForm, isSubmitting, errors } = useForm({
  validationSchema: toTypedSchema(validationSchema)
});

const [name] = defineField('name');

const onUpdateUser = handleSubmit(async (values) => {
  // Simulates delay to show the loading button
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const response = await axios.put<User>(`/users/${authStore.user?.id}`, {
      name: values.name,
    });

    // Show success toast
    toast.add({ severity: 'success', summary: 'Đã cập nhật hồ sơ', life: 3000, group: 'tc' });

    // Use the new updateUser action instead of direct assignment
    // authStore.user = response.data;
    authStore.setUser(response.data);
  } catch (error: any) {
    console.error('Error updating profile:', error);
  }
});

onMounted(async () => {
  try {
    const response = await axios.get<User>(`/users/${authStore.user?.id}`);

    // Set read-only fields
    const data = response.data;
    email.value = data.email;
    phoneNumber.value = data.phone_number;
    picture.value = data.picture;

    // Only reset the validated field
    resetForm({
      values: {
        name: data.name
      }
    });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
  }
});
</script>

<style scoped></style>
