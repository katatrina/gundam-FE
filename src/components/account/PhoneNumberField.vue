<!-- PhoneField.vue -->
<template>
  <label class="w-32 flex-shrink-0 text-right">Số điện thoại</label>
  <div v-if="currentPhoneNumber" class="flex items-center gap-2 text-sm">
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
          <InputText v-model="newPhoneNumber" v-bind="newPhoneNumberAttrs" placeholder="Nhập số điện thoại"
            autocomplete="off" autofocus />
        </InputGroup>

        <!-- Fixed height container for error message -->
        <div class="h-8 mt-1"> <!-- h-5 = 20px height, enough for one line of text -->
          <span class="text-red-500 text-sm" v-if="errors.newPhoneNumber">
            {{ errors.newPhoneNumber }}
          </span>
        </div>
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
    <p class="text-surface-500 dark:text-surface-400 mb-4">
      Để đảm bảo số này là của bạn, chúng tôi sẽ gửi mã xác thực qua SMS.
    </p>

    <div class="flex items-center justify-between border rounded-md px-3 py-2 mb-6">
      <div class="flex items-center gap-2">
        <img src="@/assets/images/vietnam-flag-icon.png" alt="Vietnam Flag" class="w-6 h-6" />
        <span class="text-base text-gray-900">{{ newPhoneNumber }}</span>
      </div>
      <span class="pi pi-pencil cursor-pointer" @click="backToStep1"></span>
    </div>

    <div class="flex justify-end gap-3">
      <Button type="button" label="Hủy" severity="secondary" class="rounded-md px-4 py-2"
        @click="resetFormAndCloseDialog" :disabled="isLoadingOTP" />
      <Button label="Nhận Mã" @click="proceedToStep3" class="rounded-md px-4 py-2" :loading="isLoadingOTP" autofocus />
    </div>
  </Dialog>

  <!-- Step 3: Submit OTP -->
  <Dialog v-model:visible="showOTPInputDialog" modal header="Cập nhật số điện thoại" :style="{ width: '24rem' }"
    class="rounded-lg shadow-lg" :closable="false" @show="focusOTPInput">
    <form @submit.prevent="handleOTPSubmit" class="flex flex-col h-full justify-between">
      <div>
        <p class="text-surface-500 dark:text-surface-400 mb-6 text-center">
          Mã xác thực đã được gửi đến số
          <span class="flex items-center justify-center font-medium text-gray-900">
            {{ newPhoneNumber }}
          </span>
        </p>
        <p class="text-surface-500 dark:text-surface-400 text-sm mb-2 text-center">
          Vui lòng nhập mã để xác nhận số điện thoại
        </p>
      </div>


      <!-- OTP Input -->
      <div class="flex flex-col items-center mb-4">
        <InputOtp v-model="OTPValue" :length="6" variant="filled" integerOnly class="flex justify-center gap-2" />
      </div>

      <!-- Send OTP again -->
      <div class="text-center mb-6">
        <button type="button" class="text-blue-600" :disabled="timeLeft > 0"
          :class="{ 'opacity-50 cursor-not-allowed': timeLeft > 0 }" @click="generateOTP">
          {{ timeLeft > 0
            ? `Vui lòng chờ ${formatDuration(
              { seconds: timeLeft },
              { locale: vi }
            )} để gửi lại`
            : 'Gửi lại'
          }}
        </button>
      </div>

      <div class="flex justify-end gap-4 mt-auto">
        <Button type="button" label="Hủy" severity="secondary" class="rounded-md px-4 py-2"
          @click="resetFormAndCloseDialog" :disabled="isVerifyingOTP" />
        <Button type="submit" label="Xác Minh" :loading="isVerifyingOTP" />
      </div>
    </form>
  </Dialog>

</template>

<script setup lang="ts">
import axios from '@/config/axios';
import { useAuthStore } from '@/stores/auth';
import { formatDuration, differenceInSeconds } from 'date-fns';
import { vi } from 'date-fns/locale';
import { maskPhoneNumber } from '@/utils/user';
import { toTypedSchema } from '@vee-validate/yup';
import { Button, Dialog, InputGroup, InputGroupAddon, InputOtp, InputText, useToast } from 'primevue';
import { useForm } from 'vee-validate';
import { nextTick, onUnmounted, ref } from 'vue';
import * as yup from 'yup';

const props = defineProps<{
  currentPhoneNumber: string | null;
}>()

interface GenerateOTPResponse {
  otp_code: string;
  phone_number: string;
  expires_at: string;
  can_resend_in: string;
}

// Define the emit event
const emit = defineEmits<{
  (e: 'phone-updated', newPhoneNumber: string): void;
}>();

const OTPValue = ref('')
const authStore = useAuthStore()

// const isInputtingNewPhoneNumber = ref(false)
const isLoadingOTP = ref(false)
const isVerifyingOTP = ref(false)
const showUpdatePhoneNumberDialog = ref(false)
const showOTPAskingDialog = ref(false)
const showOTPInputDialog = ref(false)
const toast = useToast();

// Countdown related refs
const canResendTime = ref<string | null>(null);
const timeLeft = ref<number>(0);
const countdownTimer = ref<number | null>(null);

const newPhoneNumberSchema = yup.object({
  newPhoneNumber: yup.string()
    .required('Nhập một số hợp lệ')
    .matches(/^(09|08|07|05|03)[0-9]{8}$/, 'Nhập một số hợp lệ')
    // Kiểm tra số điện thoại mới có trùng với số điện thoại cũ không
    .test('is-not-same-as-old-phone', 'Số điện thoại mới không được trùng với số điện thoại cũ', (newPhoneNumber) => {
      return newPhoneNumber !== props.currentPhoneNumber;
    })
});

const { defineField, errors, handleSubmit, resetField, setFieldError } = useForm({
  validationSchema: toTypedSchema(newPhoneNumberSchema),
  initialValues: {
    newPhoneNumber: ''
  }
});

const [newPhoneNumber, newPhoneNumberAttrs] = defineField('newPhoneNumber', {
  validateOnModelUpdate: false,
  validateOnBlur: false,
  validateOnChange: false,
});

const startCountdown = (targetTime: string) => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }

  const updateTimer = () => {
    const target = new Date(targetTime);
    const now = new Date();
    const diffInSeconds = differenceInSeconds(target, now);

    if (diffInSeconds <= 0) {
      clearInterval(countdownTimer.value!);
      timeLeft.value = 0;
      canResendTime.value = null;
      return;
    }

    timeLeft.value = diffInSeconds;
  };

  updateTimer();
  countdownTimer.value = setInterval(updateTimer, 1000) as unknown as number;
};

const proceedToStep2 = handleSubmit(async () => {
  try {
    await axios.get(`/users/by-phone?phone_number=${newPhoneNumber.value}`);
    // If we get here, it means the phone number exists
    setFieldError('newPhoneNumber', 'Số điện thoại đã tồn tại');
  } catch (error: any) {
    if (error.response.status === 404) {
      // Phone number doesn't exist - this is what we want
      showUpdatePhoneNumberDialog.value = false;
      showOTPAskingDialog.value = true;
      return;
    } else {
      console.error('Error checking phone number:', error);
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Đã có lỗi xảy ra. Vui lòng thử lại',
        life: 5000,
        group: 'tr'
      });
    }
  }
}
);

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

const generateOTP = async () => {
  try {
    isLoadingOTP.value = true;
    const response = await axios.post<GenerateOTPResponse>('/otp/generate', { phone_number: newPhoneNumber.value });
    console.log(response.data);

    // Start countdown with the received time
    canResendTime.value = response.data.can_resend_in;
    startCountdown(response.data.can_resend_in);

    showOTPAskingDialog.value = false;
    showOTPInputDialog.value = true;
  } catch (error: any) {
    console.error('Error generating OTP:', error);

    toast.add({
      severity: 'error',
      summary: 'Không thể gửi mã xác thực. Vui lòng thử lại',
      life: 5000,
      group: 'tr'
    });
  } finally {
    isLoadingOTP.value = false;
  }
};

const proceedToStep3 = async () => {
  await generateOTP();
};

const handleOTPSubmit = async () => {
  if (OTPValue.value.length !== 6) return;
  isVerifyingOTP.value = true;

  try {
    const response = await axios.post('/otp/verify', {
      user_id: authStore.user?.id,
      phone_number: newPhoneNumber.value,
      otp_code: OTPValue.value
    });

    if (response.status === 200) {
      emit('phone-updated', newPhoneNumber.value!);
      authStore.setPhoneNumber(newPhoneNumber.value || '');

      resetFormAndCloseDialog();

      toast.add({
        severity: 'success',
        summary: 'Số điện thoại đã được cập nhật',
        life: 5000,
        group: 'tr'
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Mã xác thực đã hết hạn hoặc không hợp lệ',
        life: 5000,
        group: 'tr'
      });
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error);

    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Đã có lỗi xảy ra. Vui lòng thử lại',
      life: 5000,
      group: 'tr'
    });
  } finally {
    isVerifyingOTP.value = false;
  }
};

const resetFormAndCloseDialog = () => {
  resetField('newPhoneNumber');
  showUpdatePhoneNumberDialog.value = false;
  showOTPAskingDialog.value = false;
  showOTPInputDialog.value = false;
  OTPValue.value = '';

  // Clear countdown
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
  timeLeft.value = 0;
  canResendTime.value = null;
};

// Cleanup on component unmount
onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value);
  }
});
</script>

<style scoped></style>
