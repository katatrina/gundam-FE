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
                <label for="sellerFullName" class="w-1/3 text-right pr-4 font-medium text-gray-700"
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
                <span class="text-red-500 -mt-2 mb-2 ml-16 text-sm">{{ errors.fullName }}</span>
              </div>

              <div class="flex flex-row mb-4 items-center">
                <label for="sellerEmail" class="w-1/3 text-right pr-4 font-medium text-gray-700"
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
                  :textMediumGray700="true"
                  :require-mask-phone-number="false"
                  @phone-updated="onPhoneUpdated"
                />
              </div>
              <div v-show="errors.phoneNumber" class="flex">
                <div class="w-36"></div>
                <span class="text-red-500 ml-16 mt-1 text-sm">{{ errors.phoneNumber }}</span>
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
          <div v-else-if="activeStep === 2" class="">
            <form>
              <div class="flex flex-row mb-4">
                <label
                  for="pickupAddress"
                  class="w-1/3 text-right pr-4 ml-14 font-medium text-gray-700"
                  ><span class="text-red-400">*</span> Địa chỉ lấy hàng</label
                >

                <div class="w-2/5">
                  <!-- Nếu có địa chỉ lấy hàng -->
                  <div v-if="currentPickupAddress" class="">
                    <div class="flex flex-col">
                      <div class="flex items-center">
                        <span class="font-medium">{{ currentPickupAddress?.full_name }}</span>
                        <span class="mx-2">|</span>
                        <span>{{ currentPickupAddress?.phone_number }}</span>
                      </div>
                      <div class="mt-1">
                        {{ currentPickupAddress?.detail }}
                      </div>
                      <div class="">
                        {{ currentPickupAddress?.ward_name }}
                      </div>
                      <div class="">
                        {{ currentPickupAddress?.district_name }}
                      </div>
                      <div class="">
                        {{ currentPickupAddress?.province_name }}
                      </div>
                    </div>
                    <div class="mt-2">
                      <button
                        type="button"
                        class="text-blue-500"
                        @click="openEditDialog(currentPickupAddress)"
                      >
                        Chỉnh sửa
                      </button>
                    </div>
                  </div>

                  <!-- Nếu chưa có địa chỉ lấy hàng -->
                  <div v-else>
                    <button type="button" @click="openCreateDialog" class="text-blue-500">
                      Thêm
                    </button>
                  </div>
                </div>
              </div>

              <AddressDialog
                ref="addressDialogRef"
                :forcePrimaryAddress="false"
                :forcePickupAddress="true"
                @create-new-address="handleCreateNewAddress"
                @update-address="handleUpdateAddress"
                :mode="dialogMode"
              />

              <div class="flex justify-between mt-4">
                <button
                  @click="backToStep1"
                  class="flex bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Quay lại
                </button>
                <Button class="flex" @click="processStep2" :disabled="!currentPickupAddress">
                  Tiếp theo
                </Button>
              </div>
            </form>
          </div>

          <!-- Step 3: Terms of Service -->
          <div v-else-if="activeStep === 3" class="flex flex-col gap-4">
            <div class="border p-4 h-56 overflow-y- rounded bg-gray-50">
              <p class="mb-2">Điều khoản và điều kiện sử dụng dịch vụ của chúng tôi:</p>
              <p class="mb-2">1. Người bán phải cung cấp thông tin chính xác về sản phẩm.</p>
              <p class="mb-2">2. Thời gian xử lý đơn hàng không quá 24 giờ kể từ khi nhận đơn.</p>
              <p class="mb-2">3. Người bán chịu trách nhiệm về chất lượng sản phẩm cung cấp.</p>
              <p>4. Phí dịch vụ sẽ được tính theo từng gói đăng ký.</p>
            </div>

            <div class="field-checkbox flex items-center select-none">
              <input
                type="checkbox"
                id="acceptTerms"
                v-model="acceptTerms"
                class="mr-2 accent-emerald-500 cursor-pointer h-4 w-4"
              />
              <label for="acceptTerms" class="cursor-pointer"
                >Tôi đồng ý với điều khoản sử dụng</label
              >
            </div>

            <div class="flex justify-between mt-4">
              <button
                @click="backToStep2"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Quay lại
              </button>
              <Button
                type="button"
                @click="handleCompleteRegistration"
                :disabled="!acceptTerms || isLoading"
                class="px-4 py-2 rounded-md"
                :loading="isLoading"
                label="Hoàn tất"
              />
            </div>
          </div>

          <!-- Step 4: Registration Success - Simplified Layout -->
          <div v-else-if="activeStep === 4" class="">
            <div class="flex flex-col sm:flex-row items-center gap-4">
              <!-- Success message section -->
              <div class="flex flex-col items-center justify-center text-center sm:w-1/2 p-4">
                <div
                  class="w-16 h-16 flex items-center justify-center rounded-full bg-emerald-100 mb-3 shadow"
                >
                  <i class="pi pi-check text-2xl text-emerald-600"></i>
                </div>

                <h2 class="text-xl font-bold text-gray-800 mb-2">Đăng ký thành công!</h2>
                <p class="text-base text-gray-600">Bạn đã trở thành người bán trên Mecha World</p>
              </div>

              <!-- Package information section -->
              <div class="sm:w-1/2 w-full">
                <div class="rounded-lg overflow-hidden shadow border border-gray-200">
                  <!-- Package header -->
                  <div class="bg-emerald-600 p-3 text-center">
                    <h3 class="text-white font-semibold">GÓI DÙNG THỬ</h3>
                    <span class="text-white text-sm">Miễn phí</span>
                  </div>

                  <!-- Package content -->
                  <div class="bg-white p-4 text-gray-600">
                    <!-- Selling limit -->
                    <div class="flex items-center mb-3">
                      <svg
                        class="w-5 h-5 mr-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                        ></path>
                      </svg>
                      <span class=""
                        >Số lượt bán: <span class="font-medium text-gray-800">5</span></span
                      >
                    </div>

                    <!-- Auction limit -->
                    <div class="flex items-center">
                      <i class="pi pi-hammer mr-3" style="font-size: 1.25rem" />
                      <span class=""
                        >Số lượt mở đấu giá: <span class="text-gray-800 font-medium">1</span></span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Start selling button -->
            <div class="flex justify-center mt-6">
              <RouterLink
                to="seller/gundam/list"
                style="padding: 12px 32px"
                class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 rounded-md"
              >
                <span>Bắt đầu bán hàng</span>
                <i class="pi pi-arrow-right ml-2"></i>
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { Button, Divider, ProgressSpinner } from 'primevue'
import { useToast } from 'primevue/usetoast'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ACCESS_TOKEN_KEY } from '@/constants'

import AddressDialog from '@/components/account/AddressDialog.vue'
import PhoneNumberField from '@/components/account/PhoneNumberField.vue'
import AvatarDropdownMenu from '@/components/common/AvatarDropdownMenu.vue'
import axios from '@/config/axios'
import { useAuthStore } from '@/stores/auth'
import type { User, UserAddress } from '@/types/models'
import { toTypedSchema } from '@vee-validate/yup'
import { storeToRefs } from 'pinia'
import { InputText } from 'primevue'
import { useForm } from 'vee-validate'
import { onMounted, ref, watch } from 'vue'
import * as yup from 'yup'

const authStore = useAuthStore()
const toast = useToast()
const cookies = useCookies()
const { isAuthenticated, isLoadingAuth } = storeToRefs(authStore)

// Step state
const activeStep = ref(1)
const isLoading = ref(false)
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
const currentPickupAddress = ref<UserAddress>()
const addressDialogRef = ref()
const dialogMode = ref<'create' | 'update'>('create')

// Hàm fetch địa chỉ lấy hàng
const fetchPickupAddress = async () => {
  try {
    const response = await axios.get<UserAddress>(`/users/${authStore.user?.id}/addresses/pickup`)

    if (response.data) {
      currentPickupAddress.value = response.data
    }
  } catch (error) {
    console.error('Failed to fetch pickup address:', error)
  }
}

const handleCreateNewAddress = async (data: UserAddress) => {
  try {
    const response = await axios.post<UserAddress>(`/users/${authStore.user?.id}/addresses`, data)
    currentPickupAddress.value = response.data
    addressDialogRef?.value.closeDialog()
    toast.add({ severity: 'success', summary: 'Đã thêm địa chỉ mới', group: 'tc', life: 3000 })
  } catch (err: any) {
    console.log('Error creating address', err)
  }
}

const handleUpdateAddress = async (address: UserAddress) => {
  try {
    const response = await axios.put<UserAddress>(
      `/users/${authStore.user?.id}/addresses/${address.id}`,
      address,
    )
    currentPickupAddress.value = response.data
    addressDialogRef?.value.closeDialog()
    toast.add({ severity: 'success', summary: 'Đã cập nhật địa chỉ', group: 'tc', life: 3000 })
  } catch (err: any) {
    console.log('Error updating address', err)
  }
}

const openCreateDialog = () => {
  dialogMode.value = 'create'
  addressDialogRef?.value.openDialog(null, 'create')
}

const openEditDialog = (address: UserAddress) => {
  dialogMode.value = 'update'
  addressDialogRef?.value.openDialog(address, 'update')
}

const processStep2 = () => {
  if (currentPickupAddress.value) {
    // Chuyển sang bước tiếp theo
    activeStep.value = 3
  } else {
    console.error('Pickup address is required')
  }
}

// Step 3: Terms of Service
const acceptTerms = ref(false)

// Step 4: Registration Package

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

const handleCompleteRegistration = async () => {
  try {
    isLoading.value = true
    // Simulate loading using promise
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const access_token = cookies.get(ACCESS_TOKEN_KEY)
    const response = await axios.post<User>(`/users/become-seller`, null, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    authStore.setUser(response.data)

    // Move to the last step
    activeStep.value = 4
  } catch (error) {
    console.error('Error completing registration:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (activeStep.value === 1) {
    fetchDataForStep1()
  }
})

// Watch for step changes to call appropriate fetch function based on step
watch(activeStep, (newStep) => {
  if (newStep === 1) {
    fetchDataForStep1()
  } else if (newStep === 2) {
    fetchPickupAddress()
  }
})

const backToStep1 = () => {
  activeStep.value = 1
}

const backToStep2 = () => {
  activeStep.value = 2
}
</script>
