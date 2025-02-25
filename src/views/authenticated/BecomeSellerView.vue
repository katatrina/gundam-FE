<template>
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
            class="flex-grow h-[1.25px] mb-8 -mx-12"
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
      <div class="p-2">
        <!-- Step 1: Seller Information -->
        <div v-if="activeStep === 1" class="flex flex-col gap-4">
          <div class="field">
            <label for="sellerName" class="block mb-1 text-sm">Tên người bán</label>
            <input
              id="sellerName"
              v-model="sellerName"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Nhập tên người bán"
            />
          </div>

          <div class="field">
            <label for="sellerEmail" class="block mb-1 text-sm">Email</label>
            <input
              id="sellerEmail"
              v-model="sellerEmail"
              type="email"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Nhập email"
            />
          </div>

          <div class="field">
            <label for="sellerPhone" class="block mb-1 text-sm">Số điện thoại</label>
            <input
              id="sellerPhone"
              v-model="sellerPhone"
              class="w-full px-3 py-2 border rounded-md"
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div class="flex justify-end mt-4">
            <button
              @click="goToNextStep"
              class="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Tiếp theo
            </button>
          </div>
        </div>

        <!-- Step 2: Shipping Settings -->
        <div v-if="activeStep === 2" class="flex flex-col gap-4">
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
              @click="goToPreviousStep"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Quay lại
            </button>
            <button
              @click="goToNextStep"
              class="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-colors"
            >
              Tiếp theo
            </button>
          </div>
        </div>

        <!-- Step 3: Terms of Service -->
        <div v-if="activeStep === 3" class="flex flex-col gap-4">
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
              @click="goToPreviousStep"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Quay lại
            </button>
            <button
              @click="goToNextStep"
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
        <div v-if="activeStep === 4" class="flex flex-col gap-4">
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
              @click="goToPreviousStep"
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
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// Step state
const activeStep = ref(1)
const steps = [
  { value: 1, label: 'Thông tin người bán' },
  { value: 2, label: 'Cài đặt vận chuyển' },
  { value: 3, label: 'Điều khoản sử dụng' },
  { value: 4, label: 'Hoàn tất' },
]

// Step 1: Seller Information
const sellerName = ref('')
const sellerEmail = ref('')
const sellerPhone = ref('')

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

// Navigation methods
const goToNextStep = () => {
  if (activeStep.value < 4) {
    activeStep.value++
  }
}

const goToPreviousStep = () => {
  if (activeStep.value > 1) {
    activeStep.value--
  }
}

// Registration completion
const completeRegistration = () => {
  // Here you would typically submit the form data
  // For demo purposes, we'll just show an alert
  alert('Đăng ký thành công!')
}
</script>
