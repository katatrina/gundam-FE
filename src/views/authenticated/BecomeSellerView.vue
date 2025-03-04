<template>
  <div class="w-full">
    <header class="bg-white shadow-sm">
      <div class="mx-auto py-2 px-4">
        <!-- Minimal Header -->
        <nav class="flex items-center h-16">
          <!-- Logo and Title in one container -->
          <div class="flex items-center">
            <!-- Logo -->
            <RouterLink to="/" class="flex items-center focus:outline-none">
              <img src="/web-icon.png" alt="Mecha World" class="h-10 w-10" />
              <span class="ml-1 mr-4 text-xl font-medium text-emerald-500">Mecha World</span>
            </RouterLink>
            <!-- Page Title -->
            <span class="text-2xl">Đăng ký trở thành Người bán</span>
          </div>

          <!-- Flex Spacer -->
          <div class="flex-auto"></div>

          <!-- Auth Section -->
          <div class="flex items-center">
            <!-- Show a loading spinner when loading -->
            <div v-if="isLoadingAuth">
              <ProgressSpinner
                style="width: 30px; height: 30px"
                strokeWidth="8"
                fill="transparent"
                animationDuration="0.5s"
                aria-label="Custom ProgressSpinner"
              />
            </div>

            <!-- Show only avatar dropdown when authenticated -->
            <div v-else-if="isAuthenticated">
              <AvatarDropdownMenu />
            </div>

            <!-- Show login and register buttons when not authenticated -->
            <div v-else class="flex items-center">
              <RouterLink to="/login" class="hover:text-gray-600 font-medium text-emerald-500">
                Đăng Nhập
              </RouterLink>
              <Divider layout="vertical" type="solid" class="mx-4 h-full" />
              <Button label="Đăng Ký" raised />
            </div>
          </div>
        </nav>
      </div>
    </header>

    <Divider layout="horizontal" type="solid" class="mt-0" />

    <!--  Main Content -->
    <main>
      <div class="flex justify-center">
        <div class="card bg-white rounded-lg shadow-sm p-6 max-w-2xl w-full">
          <!-- Stepper -->
          <div class="flex items-center justify-between mb-6">
            <template v-for="(step, index) in steps" :key="index">
              <div class="flex flex-col items-center">
                <!-- Step Indicators -->
                <div
                  class="w-3 h-3 rounded-full"
                  :class="activeStep >= step.value ? 'bg-emerald-500' : 'bg-gray-200'"
                ></div>

                <!-- Step label -->
                <span
                  class="mt-2 text-center"
                  :class="activeStep >= step.value ? 'text-black' : 'text-gray-400'"
                >
                  {{ step.label }}
                </span>
              </div>

              <!-- Line connector (except for the last step) -->
              <div
                v-if="index < steps.length - 2"
                class="flex-grow h-[1.25px] mb-8 -ml-10 -mr-12"
                :class="activeStep > step.value ? 'bg-emerald-500' : 'bg-gray-200'"
              ></div>
              <!-- Line connector for the last step -->
              <div
                v-if="index === steps.length - 2"
                class="flex-grow h-[1.25px] mb-8 -ml-12 -mr-3"
                :class="activeStep > step.value ? 'bg-emerald-500' : 'bg-gray-200'"
              ></div>
            </template>
          </div>

          <!-- Divider -->
          <div class="border-t my-4"></div>

          <!-- Step Panels -->
          <!-- Step 1: Seller Information -->
          <div v-if="activeStep === 1" class="">
            <form @submit.prevent="processStep1">
              <div class="flex flex-row mb-4 items-center">
                <label
                  for="sellerFullName"
                  class="w-1/3 text-right pr-4 text-sm font-medium text-gray-700"
                  ><span class="text-red-400">*</span> Tên Shop</label
                >
                <InputText
                  id="sellerFullName"
                  type="text"
                  v-model="sellerFullName"
                  v-bind="sellerFullNameAttrs"
                  size="small"
                  class="w-2/5"
                  :class="{ 'border-red-500': errors.fullName }"
                  :style="errors.fullName ? { backgroundColor: '#fffafa' } : {}"
                />
              </div>
              <div v-show="errors.fullName" class="flex">
                <div class="w-36"></div>
                <span class="text-red-500 text-sm -mt-2 mb-2 ml-16">{{ errors.fullName }}</span>
              </div>

              <div class="flex flex-row mb-4 items-center">
                <label
                  for="sellerEmail"
                  class="w-1/3 text-right pr-4 text-sm font-medium text-gray-700"
                  ><span class="text-red-400">*</span> Email</label
                >
                <InputText
                  id="sellerEmail"
                  :value="sellerEmail"
                  size="small"
                  class="w-2/5"
                  disabled
                />
              </div>
              <div v-show="errors.email" class="flex">
                <div class="w-36"></div>
                <span class="text-red-500 text-sm">{{ errors.email }}</span>
              </div>

              <div class="flex flex-row items-center gap-4 w-full text-right ml-16">
                <PhoneNumberField
                  :current-phone-number="sellerPhoneNumber"
                  :require-marker="true"
                  :sm-medium-gray700="true"
                  :require-mask-phone-number="false"
                  @phone-updated="onPhoneUpdated"
                />
              </div>
              <div v-show="errors.phoneNumber" class="flex">
                <div class="w-36"></div>
                <span class="text-red-500 text-sm ml-16 mt-1">{{ errors.phoneNumber }}</span>
              </div>

              <div class="flex justify-end mt-4">
                <button
                  type="submit"
                  class="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Tiếp theo
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Shipping Settings -->
          <div v-else-if="activeStep === 2" class="flex flex-col gap-4">
            <div class="text-lg font-semibold mb-2">Cài đặt vận chuyển</div>

            <div class="field">
              <label for="shippingMethod" class="block mb-1 text-sm">Phương thức vận chuyển</label>
              <select
                id="shippingMethod"
                v-model="shippingMethod"
                class="w-full px-3 py-2 border rounded-md"
              >
                <option v-for="method in shippingOptions" :key="method.code" :value="method.code">
                  {{ method.name }}
                </option>
              </select>
            </div>

            <div class="field">
              <label class="block mb-1 text-sm">Khu vực giao hàng</label>
              <div class="space-y-2">
                <div v-for="area in areaOptions" :key="area.code" class="flex items-center">
                  <input
                    type="checkbox"
                    :id="area.code"
                    :value="area"
                    v-model="shippingAreas"
                    class="mr-2"
                  />
                  <label :for="area.code">{{ area.name }}</label>
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button
                @click="backToStep1"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
              <button
                class="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
              >
                Tiếp theo
              </button>
            </div>
          </div>

          <!-- Step 3: Terms of Service -->
          <div v-else-if="activeStep === 3" class="flex flex-col gap-4">
            <div class="text-lg font-semibold mb-2">Điều khoản sử dụng</div>

            <div class="border p-4 h-56 overflow-y-auto text-sm rounded bg-gray-50">
              <p class="mb-2">Điều khoản và điều kiện sử dụng dịch vụ của chúng tôi:</p>
              <p class="mb-2">1. Người bán phải cung cấp thông tin chính xác về sản phẩm.</p>
              <p class="mb-2">2. Thời gian xử lý đơn hàng không quá 24 giờ kể từ khi nhận đơn.</p>
              <p class="mb-2">3. Người bán chịu trách nhiệm về chất lượng sản phẩm cung cấp.</p>
              <p>4. Phí dịch vụ sẽ được tính theo từng gói đăng ký.</p>
            </div>

            <div class="field-checkbox flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                v-model="acceptTerms"
                class="mr-2 accent-emerald-500"
              />
              <label for="acceptTerms" class="text-sm">Tôi đồng ý với điều khoản sử dụng</label>
            </div>

            <div class="flex justify-between mt-4">
              <button
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
              <button
                :disabled="!acceptTerms"
                class="px-4 py-2 rounded-md transition-colors"
                :class="
                  acceptTerms
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                "
              >
                Tiếp theo
              </button>
            </div>
          </div>

          <!-- Step 4: Registration Package -->
          <div v-else-if="activeStep === 4" class="flex flex-col gap-4">
            <div class="text-lg font-semibold mb-2">Đăng ký gói bán</div>

            <div class="space-y-4">
              <div
                class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                :class="{ 'border-emerald-500': selectedPackage === 'basic' }"
                @click="selectedPackage = 'basic'"
              >
                <div class="text-base font-medium mb-1">Gói cơ bản</div>
                <div class="text-xl font-bold mb-2">199.000đ/tháng</div>
                <ul class="list-disc pl-5 text-xs space-y-1">
                  <li>Đăng 100 sản phẩm</li>
                  <li>Hỗ trợ cơ bản</li>
                  <li>Thống kê đơn giản</li>
                </ul>
              </div>

              <div
                class="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                :class="{ 'border-emerald-500': selectedPackage === 'premium' }"
                @click="selectedPackage = 'premium'"
              >
                <div class="text-base font-medium mb-1">Gói cao cấp</div>
                <div class="text-xl font-bold mb-2">499.000đ/tháng</div>
                <ul class="list-disc pl-5 text-xs space-y-1">
                  <li>Không giới hạn sản phẩm</li>
                  <li>Hỗ trợ 24/7</li>
                  <li>Thống kê chi tiết</li>
                </ul>
              </div>
            </div>

            <div class="flex justify-between mt-4">
              <button
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
              <button
                @click="completeRegistration"
                class="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
              >
                Hoàn tất đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import ProgressSpinner from 'primevue/progressspinner'

import PhoneNumberField from '@/components/account/PhoneNumberField.vue'
import AvatarDropdownMenu from '@/components/common/AvatarDropdownMenu.vue'
import axios from '@/config/axios'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/models'
import { storeToRefs } from 'pinia'
import { InputText } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, watch } from 'vue'
import * as yup from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'

const toast = useToast()
const authStore = useAuthStore()
const { isAuthenticated, isLoadingAuth } = storeToRefs(authStore)

// Step state
const activeStep = ref(1)
const steps = [
  { value: 1, label: 'Thông tin Shop' },
  { value: 2, label: 'Cài đặt vận chuyển' },
  { value: 3, label: 'Điều khoản sử dụng' },
  { value: 4, label: 'Hoàn tất' },
]

// Step 1: Seller Information
const step1ValidationSchema = yup.object({
  fullName: yup.string().required('Tên không được để trống').min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: yup.string().required('Email không được để trống').email('Email không hợp lệ'),
  phoneNumber: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
})

const {
  defineField,
  handleSubmit: handleStep1Submit,
  errors,
  validateField,
} = useForm({
  validationSchema: toTypedSchema(step1ValidationSchema),
})

const [sellerFullName, sellerFullNameAttrs] = defineField('fullName', {
  validateOnModelUpdate: true,
  validateOnChange: true,
  validateOnInput: true,
})

const [sellerEmail] = defineField('email')

const [sellerPhoneNumber] = defineField('phoneNumber', {
  validateOnModelUpdate: false,
  validateOnChange: true,
  validateOnInput: true,
})

// Bước 1 -> Bước 2
const processStep1 = () => {
  // Sử dụng handleStep1Submit để validate và xử lý form
  handleStep1Submit(async (values) => {
    try {
      // Cập nhật thông tin người dùng
      await axios.put<User>(`/users/${authStore.user?.id}`, {
        full_name: values.fullName,
      })

      // Chuyển sang bước tiếp theo khi thành công
      activeStep.value = 2
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  })()
}

// Step 2: Shipping Settings
const shippingOptions = [
  { name: 'Giao hàng tiêu chuẩn', code: 'standard' },
  { name: 'Giao hàng nhanh', code: 'express' },
  { name: 'Giao hàng hỏa tốc', code: 'sameday' },
]
const shippingMethod = ref(null)

const areaOptions = [
  { name: 'Miền Bắc', code: 'north' },
  { name: 'Miền Trung', code: 'central' },
  { name: 'Miền Nam', code: 'south' },
]
const shippingAreas = ref([])

// Step 3: Terms of Service
const acceptTerms = ref(false)

// Step 4: Registration Package
const selectedPackage = ref('basic')

// Fetch shop information when component is mounted or when returning to step 1
const fetchDataForStep1 = async () => {
  try {
    const response = await axios.get<User>(`/users/${authStore.user?.id}`)

    if (response.data) {
      const sellerData = response.data as User
      sellerFullName.value = sellerData.full_name
      sellerEmail.value = sellerData.email
      sellerPhoneNumber.value = sellerData.phone_number ?? ''
    }
  } catch (error) {
    console.error('Failed to fetch shop information:', error)
  }
}

const onPhoneUpdated = (newPhoneNumber: string) => {
  sellerPhoneNumber.value = newPhoneNumber

  validateField('phoneNumber')
}

onMounted(() => {
  if (activeStep.value === 1) {
    fetchDataForStep1()
  }
})

// Watch for step changes to call fetchShopInfo when returning to step 1
watch(activeStep, (newStep) => {
  if (newStep === 1) {
    fetchDataForStep1()
  }
})

// Registration completion
const completeRegistration = async () => {
  if (!isAuthenticated.value) {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'Bạn cần đăng nhập để hoàn tất đăng ký',
      life: 3000,
    })
    return
  }

  try {
    // Prepare data for submission
    const sellerData = {
      name: sellerFullName.value,
      phoneNumber: sellerPhoneNumber.value,
      shippingMethod: shippingMethod.value,
      // shippingAreas: shippingAreas.value.map((area) => area.code),
      acceptTerms: acceptTerms.value,
      package: selectedPackage.value,
    }

    // Submit data to API
    await axios.post('/api/seller/register', sellerData)

    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Đăng ký thành công!',
      life: 3000,
    })

    // Redirect to seller dashboard or another appropriate page
    // router.push('/seller/dashboard')
  } catch (error) {
    console.error('Failed to complete registration:', error)
  }
}

const backToStep1 = () => {
  activeStep.value = 1
}

// const backToStep2 = () => {
//   activeStep.value = 2
// }

// const backToStep3 = () => {
//   activeStep.value = 3
// }
</script>
