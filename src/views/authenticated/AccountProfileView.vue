<template>
  <div class="container mx-auto flex justify-center">
    <div class="flex flex-row gap-2 w-full max-w-5xl">
      <!-- General Information: 3/5 width -->
      <div class="w-3/5">
        <form class="space-y-6" @submit="onUpdateUser">
          <!-- Fullname with reserved error space -->
          <div class="h-[44px]">
            <div class="flex items-center gap-4">
              <label class="w-32 flex-shrink-0 text-right" for="fullName">Tên</label>
              <InputText type="text" v-model="fullName" size="small" id="fullName" class="w-3/5"
                :class="{ 'border-red-500': errors.fullName }"
                :style="errors.fullName ? { backgroundColor: '#fffafa' } : {}" />
            </div>
            <div v-show="errors.fullName" class="flex">
              <div class="w-36"></div>
              <span class="text-red-500 text-sm">{{ errors.fullName }}</span>
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
              <PhoneField :currentPhoneNumber="phoneNumber" @phone-updated="onPhoneUpdated" />
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
        <img v-if="avatar" :src="avatar" alt="avatar" class="rounded-full w-28 h-28 mx-auto"
          referrerpolicy="no-referrer" />
        <img v-else src="@/assets/images/default-avatar.png" alt="default-avatar" class="rounded-full w-28 h-28 mx-auto"
          referrerpolicy="no-referrer" />

        <!-- File Select button -->
        <div class="flex flex-col items-center mt-4">
          <Field name="avatar" v-slot="{ handleChange, handleBlur, errorMessage }">
            <div class="flex flex-col items-center">
              <input type="file" id="avatar-upload" accept=".jpeg,.jpg,.png" class="hidden" @change="(e) => {
                handleChange(e);
                handleAvatarUpload(e);
              }" @blur="handleBlur" :disabled="isLoadingNewAvatar" />
              <label for="avatar-upload" :class="[
                'flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md transition-colors duration-200',
                isLoadingNewAvatar ? 'opacity-75 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-100 cursor-pointer'
              ]">
                <ProgressSpinner v-if="isLoadingNewAvatar" style="width:20px;height:20px" />
                <i v-else class="pi pi-image"></i>
                <span>{{ isLoadingNewAvatar ? 'Đang tải...' : 'Chọn Ảnh' }}</span>
              </label>
              <span v-if="errorMessage" class="text-red-500 text-sm mt-1 whitespace-nowrap">{{ errorMessage }}</span>
            </div>
          </Field>
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
import PhoneField from '@/components/account/PhoneNumberField.vue';
import axios from '@/config/axios';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types/models';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, Divider, InputText, ProgressSpinner, useToast } from 'primevue';
import { Field, useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import * as yup from 'yup';

interface updateAvatarResponse {
  avatar_url: string;
}

const authStore = useAuthStore();
const toast = useToast();

const email = ref<string>('');
const phoneNumber = ref<string | null>(null);
const avatar = ref<string | null>(null);
const isLoadingNewAvatar = ref(false);

const mainFormValidationSchema = yup.object({
  fullName: yup.string().required('Tên không được để trống').min(2, 'Tên phải có ít nhất 2 ký tự')
});

// Create a separate validation schema for the file
const avatarValidationSchema = yup.object({
  avatar: yup
    .mixed<File>()
    .test('fileSize', 'Dung lượng file phải nhỏ hơn 1 MB', (value) => {
      if (!value) return true;
      return value.size <= 1024 * 1024;
    })
    .test('fileType', 'Chỉ chấp nhận file JPEG hoặc PNG', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/png'].includes(value.type);
    })
});

const { defineField, handleSubmit, resetForm, isSubmitting, errors, values } = useForm({
  validationSchema: toTypedSchema(mainFormValidationSchema)
});

const [fullName] = defineField('fullName');

// Create a separate form for file upload
const { handleSubmit: handleFileSubmit } = useForm({
  validationSchema: avatarValidationSchema
});

// Handle file upload
const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  try {
    isLoadingNewAvatar.value = true;

    // Validate using the file validation schema
    await handleFileSubmit(async () => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.patch<updateAvatarResponse>(
        `/users/${authStore.user?.id}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      const data = response.data;

      avatar.value = data.avatar_url;
      authStore.setUserAvatar(data.avatar_url);

      toast.add({
        severity: 'success',
        summary: 'Đã cập nhật ảnh đại diện',
        life: 3000,
        group: 'tc'
      });
    })();
  } catch (error) {
    console.error('Error uploading avatar:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Không thể cập nhật ảnh đại diện',
      life: 3000,
      group: 'tc'
    });
  } finally {
    isLoadingNewAvatar.value = false;
    input.value = '';
  }
};

const onUpdateUser = handleSubmit.withControlled(async () => {
  // Simulates delay to show the loading button
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    const response = await axios.put<User>(`/users/${authStore.user?.id}`, {
      full_name: values.fullName,
    });

    // Show success toast
    toast.add({ severity: 'success', summary: 'Đã cập nhật hồ sơ', life: 3000, group: 'tc' });

    // Update the user in the store
    authStore.setUser(response.data);
  } catch (error: any) {
    console.error('Error updating profile:', error);
  }
});

const onPhoneUpdated = (newPhoneNumber: string) => {
  console.log('Phone number updated:', newPhoneNumber);
  phoneNumber.value = newPhoneNumber; // Update parent state if necessary
};

onMounted(async () => {
  try {
    const response = await axios.get<User>(`/users/${authStore.user?.id}`);

    const data = response.data;
    email.value = data.email;
    phoneNumber.value = data.phone_number;
    avatar.value = data.avatar_url;

    // Set controlled values
    resetForm({
      values: {
        fullName: data.full_name
      }
    });
  } catch (error: any) {
    console.error('Error fetching user data:', error);
  }
});
</script>

<style scoped></style>
