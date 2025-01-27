<!-- PhoneField.vue -->
<template>
  <label class="w-32 flex-shrink-0 text-right">Số điện thoại</label>
  <div v-if="currentPhoneNumber" class="flex items-center gap-2">
    {{ maskPhoneNumber(currentPhoneNumber) }}
    <button type="button" class="text-blue-600 underline" @click="showUpdatePhoneNumberDialog = true">Thay Đổi</button>
  </div>
  <button v-else type="button" class="text-blue-600 underline" @click="showUpdatePhoneNumberDialog = true">Thêm</button>

  <!-- Step 1: Input new phone number -->
  <Dialog v-model:visible="showUpdatePhoneNumberDialog" modal header="Cập nhật số điện thoại"
    :style="{ width: '23rem' }" class="rounded-sm" :closable="false">
    <form @submit="proceedToStep2">
      <span class="text-surface-500 dark:text-surface-400 block mb-4">Nhập số bạn muốn sử dụng</span>

      <div class="mb-4">
        <InputGroup>
          <InputGroupAddon>
            <img src="@/assets/images/vietnam-flag-icon.png" alt="Vietnam Flag" class="w-6 h-6" />
          </InputGroupAddon>
          <InputText v-model="newPhonerNumber" v-bind="newPhonerNumberAttrs" placeholder="Nhập số điện thoại"
            autocomplete="off" autofocus />
        </InputGroup>

        <span class="text-red-500 text-sm ml-12">{{ errors.newPhoneNumber }}</span>
      </div>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Hủy" severity="secondary" @click="resetFormAndCloseDialog" />
        <Button type="submit" label="Tiếp Theo" autofocus />
      </div>
    </form>
  </Dialog>

  <!-- Step 2: Ask user whether they can accept OTP via Zalo -->
  <Dialog v-model:visible="showOTPAskingDialog" modal header="Cập nhật số điện thoại" :style="{ width: '21rem' }"
    class="rounded-sm" :closable="false">
    <form @submit.prevent="proceedToStep3">
      <p class="text-surface-500 dark:text-surface-400 text-sm mb-4">
        Để đảm bảo số này là của bạn, chúng tôi sẽ gửi mã xác thực qua Zalo.
      </p>

      <div class="flex items-center justify-between border rounded-md px-3 py-2 mb-6">
        <div class="flex items-center gap-2">
          <img src="@/assets/images/vietnam-flag-icon.png" alt="Vietnam Flag" class="w-6 h-4" />
          <span class="text-base text-gray-900">{{ newPhonerNumber }}</span>
        </div>
        <span class="pi pi-pencil cursor-pointer" @click="backToStep1"></span>
      </div>

      <div class="flex justify-end gap-3">
        <Button type="button" label="Hủy" severity="secondary" class="rounded-md px-4 py-2"
          @click="resetFormAndCloseDialog" />
        <Button type="submit" label="Nhận Mã" class="rounded-md px-4 py-2" autofocus />
      </div>
    </form>
  </Dialog>

  <!-- Step 3: Submit OTP -->
  <Dialog v-model:visible="showOTPInputDialog" modal header="Cập nhật số điện thoại" :style="{ width: '22rem' }"
    class="rounded-lg shadow-lg" :closable="false" @show="focusOTPInput">
    <form @submit.prevent="handleOTPSubmit" class="flex flex-col h-full justify-between">
      <div>
        <p class="text-surface-500 dark:text-surface-400 text-sm mb-6 text-center">
          Mã xác thực đã được gửi qua Zalo đến số
          <span class="font-medium text-gray-900">{{ newPhonerNumber }}</span>.
        </p>
        <p class="text-surface-500 dark:text-surface-400 text-sm mb-2 text-center">
          Vui lòng nhập mã để xác nhận số điện thoại.
        </p>
      </div>

      <!-- OTP Input -->
      <div class="flex justify-center items-center mb-6">
        <InputOtp v-model="OTPValue" variant="filled" integerOnly class="w-full max-w-[12rem] text-center" />
      </div>

      <div class="flex justify-end gap-4 mt-auto">
        <Button type="button" label="Hủy" severity="secondary" class="rounded-md px-4 py-2"
          @click="resetFormAndCloseDialog" />
        <Button type="submit" label="Xác minh" />
      </div>
    </form>
  </Dialog>

</template>

<script setup lang="ts">
import { maskPhoneNumber } from '@/utils/user';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, Dialog, InputGroup, InputGroupAddon, InputText, InputOtp } from 'primevue';
import { useForm } from 'vee-validate';
import { nextTick, ref } from 'vue';
import * as yup from 'yup';

const props = defineProps<{
  currentPhoneNumber: string | null;
}>()

const OTPValue = ref('')

const showUpdatePhoneNumberDialog = ref(false)
const showOTPAskingDialog = ref(false)
const showOTPInputDialog = ref(false)

const newPhoneNumberSchema = yup.object({
  newPhoneNumber: yup.string()
    .required('Nhập một số hợp lệ')
    .matches(/^(09|08|07|05|03)[0-9]{8}$/, 'Nhập một số hợp lệ')
    // Kiểm tra số điện thoại mới có trùng với số điện thoại cũ không
    .test('is-not-same-as-old-phone', 'Số điện thoại mới không được trùng với số điện thoại cũ', (newPhoneNumber) => {
      return newPhoneNumber !== props.currentPhoneNumber;
    })
});

const { defineField, errors, handleSubmit, resetField } = useForm({
  validationSchema: toTypedSchema(newPhoneNumberSchema),
  initialValues: {
    newPhoneNumber: ''
  }
});

const [newPhonerNumber, newPhonerNumberAttrs] = defineField('newPhoneNumber', {
  validateOnModelUpdate: false,
  validateOnBlur: false,
  validateOnChange: false
});

const proceedToStep2 = handleSubmit(() => {
  showUpdatePhoneNumberDialog.value = false;
  showOTPAskingDialog.value = true;
});

const backToStep1 = () => {
  showOTPAskingDialog.value = false;
  showUpdatePhoneNumberDialog.value = true;
}

const focusOTPInput = () => {
  nextTick(() => {
    // Use document.querySelector to find the input directly
    const firstInput = document.querySelector('.p-inputotp input');
    if (firstInput) {
      (firstInput as HTMLInputElement).focus();
    }
  });
};

const proceedToStep3 = (() => {
  showOTPAskingDialog.value = false;
  showOTPInputDialog.value = true;
});

const resetFormAndCloseDialog = () => {
  resetField('newPhoneNumber');
  showUpdatePhoneNumberDialog.value = false;
  showOTPAskingDialog.value = false;
  showOTPInputDialog.value = false;
  OTPValue.value = '';
}

const handleOTPSubmit = () => {
  // Call API to send OTP
  // Show a toast message
  // Close the dialog
  console.log('OTP submitted');
}

</script>

<style scoped></style>
