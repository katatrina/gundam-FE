<!-- PhoneField.vue -->
<template>
  <label class="w-32 flex-shrink-0 text-right">Số điện thoại</label>
  <div v-if="currentPhoneNumber" class="flex items-center gap-2">
    {{ maskPhoneNumber(currentPhoneNumber) }}
    <button type="button" class="text-blue-600 underline" @click="showUpdatePhoneNumberDialog = true">Thay Đổi</button>
  </div>
  <button v-else type="button" class="text-blue-600 underline" @click="showUpdatePhoneNumberDialog = true">Thêm</button>

  <!-- Phone Update Dialog -->
  <Dialog v-model:visible="showUpdatePhoneNumberDialog" modal header="Cập nhật số điện thoại"
    :style="{ width: '23rem' }" class="rounded-sm">
    <form @submit="onSubmit">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Nhập số bạn muốn sử dụng</span>

      <div class="mb-4">
        <InputGroup>
          <InputGroupAddon>
            <img src="@/assets/images/vietnam-flag-icon.png" alt="Vietnam Flag" class="w-6 h-6" />
          </InputGroupAddon>
          <InputText v-model="newPhonerNumber" v-bind="newPhonerNumberAttrs" placeholder="Nhập số điện thoại" />
        </InputGroup>

        <!-- Error message for invalid phone number -->
        <span class="text-red-500 text-sm ml-12">{{ errors.newPhoneNumber }}</span>
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Hủy" severity="secondary" @click="showUpdatePhoneNumberDialog = false" />
        <Button type="submit" label="Tiếp Theo" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import { maskPhoneNumber } from '@/utils/user';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, Dialog, InputGroup, InputGroupAddon, InputText } from 'primevue';
import { useForm } from 'vee-validate';
import { ref } from 'vue';
import * as yup from 'yup';

const props = defineProps<{
  currentPhoneNumber: string | null;
}>()

const showUpdatePhoneNumberDialog = ref(false)

const newPhoneNumberSchema = yup.object({
  newPhoneNumber: yup.string()
    .required('Nhập một số hợp lệ')
    .matches(/^(09|08|07|05|03)[0-9]{8}$/, 'Nhập một số hợp lệ')
    // Kiểm tra số điện thoại mới có trùng với số điện thoại cũ không
    .test('is-not-same-as-old-phone', 'Số điện thoại mới không được trùng với số điện thoại cũ', (newPhoneNumber) => {
      return newPhoneNumber !== props.currentPhoneNumber;
    })
});

const { defineField, errors, handleSubmit } = useForm({
  validationSchema: toTypedSchema(newPhoneNumberSchema),
  initialValues: {
    newPhoneNumber: ''
  }
});

const [newPhonerNumber, newPhonerNumberAttrs] = defineField('newPhoneNumber', {
  validateOnModelUpdate: false,
  validateOnBlur: false,
});

const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});

// const resetUpdatePhoneNumberForm = () => {
//   newPhonerNumber.value = '';
//   showUpdatePhoneNumberDialog.value = false;
// }
</script>

<style scoped></style>
