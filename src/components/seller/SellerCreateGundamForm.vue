<template>
  <div class="flex justify-center">
    <Stepper value="1" class="basis-[50rem]">
      <StepList>
        <Step value="1">Thông tin cơ bản</Step>
        <Step value="2">Tình trạng và mô tả</Step>
        <Step value="3">Hình ảnh và phụ kiện</Step>
      </StepList>

      <StepPanels>
        <form @submit="onSubmit" novalidate>
          <!-- Step 1: Basic Information -->
          <StepPanel v-slot="{ activateCallback }" value="1">
            <div class="">
              <div class="space-y-4">
                <!-- Model name -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="name">
                      <span class="text-red-500 mr-1">*</span>Tên mô hình
                    </label>
                    <div class="w-full">
                      <InputText
                        type="text"
                        v-model="name"
                        v-bind="nameAttrs"
                        id="name"
                        class="rounded-sm w-full"
                        :class="{ 'border-red-500': errors.name }"
                        :style="errors.name ? { backgroundColor: '#fffafa' } : {}"
                        placeholder="Tên mô hình + Series + Edition"
                      />
                      <div class="h-5">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.name ? 'visible' : 'hidden' }"
                        >
                          {{ errors.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Grade -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="grade">
                      <span class="text-red-500 mr-1">*</span>Phân loại
                    </label>
                    <div class="w-full">
                      <Select
                        v-model="grade"
                        v-bind="gradeAttrs"
                        :options="grades"
                        optionLabel="display_name"
                        option-value="id"
                        label-id="grade"
                        placeholder="Chọn phân loại"
                        class="w-full rounded-sm"
                        :class="{ 'border-red-500': errors.gradeId }"
                        :style="errors.gradeId ? { backgroundColor: '#fffafa' } : {}"
                      />
                      <div class="h-5">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.gradeId ? 'visible' : 'hidden' }"
                        >
                          {{ errors.gradeId }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Manufacturer -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="manufacturer">
                      <span class="text-red-500 mr-1">*</span>Thương hiệu
                    </label>
                    <div class="w-full">
                      <InputText
                        type="text"
                        v-model="manufacturer"
                        v-bind="manufacturerAttrs"
                        id="manufacturer"
                        class="rounded-sm w-full"
                        :class="{ 'border-red-500': errors.manufacturer }"
                        :style="errors.manufacturer ? { backgroundColor: '#fffafa' } : {}"
                      />
                      <div class="h-5">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.manufacturer ? 'visible' : 'hidden' }"
                        >
                          {{ errors.manufacturer }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Scale -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="scale">
                      <span class="text-red-500 mr-1">*</span>Tỉ lệ
                    </label>
                    <div class="w-full">
                      <Select
                        v-model="scale"
                        v-bind="scaleAttrs"
                        :options="scales"
                        placeholder="Chọn tỉ lệ"
                        class="w-full rounded-sm"
                      />
                      <div class="h-5">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.scale ? 'visible' : 'hidden' }"
                        >
                          {{ errors.scale }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Weight -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="weight">
                      <span class="text-red-500 mr-1">*</span>Cân nặng
                    </label>
                    <div class="w-full">
                      <InputGroup class="w-full">
                        <InputNumber
                          v-model="weight"
                          v-bind="weightAttrs"
                          @input="(event) => (weight = Number(event.value))"
                          id="weight"
                          show-buttons
                          locale="vi-VN"
                          :format="true"
                          :input-class="{ 'rounded-l-sm': true, 'border-red-500': errors.weight }"
                          :input-style="errors.weight ? { backgroundColor: '#fffafa' } : {}"
                        />
                        <InputGroupAddon class="rounded-r-sm" append>gram</InputGroupAddon>
                      </InputGroup>
                      <div class="h-5">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.weight ? 'visible' : 'hidden' }"
                        >
                          {{ errors.weight }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Price -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="price">
                      <span class="text-red-500 mr-1">*</span>Giá
                    </label>
                    <div class="w-full">
                      <InputGroup class="w-full">
                        <InputNumber
                          v-model="price"
                          v-bind="priceAttrs"
                          @input="(event) => (price = Number(event.value))"
                          id="price"
                          show-buttons
                          :min="0"
                          :step="1000"
                          locale="vi-VN"
                          :format="true"
                          :input-class="{ 'rounded-l-sm': true, 'border-red-500': errors.price }"
                          :input-style="errors.price ? { backgroundColor: '#fffafa' } : {}"
                        />
                        <InputGroupAddon class="rounded-r-sm">đ</InputGroupAddon>
                      </InputGroup>
                      <div class="h-5">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.price ? 'visible' : 'hidden' }"
                        >
                          {{ errors.price }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Next button -->
            <div class="flex pt-6 justify-end">
              <Button
                label="Kế tiếp"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="activateCallback('2')"
                :disabled="!isStepOneValid"
              />
            </div>
          </StepPanel>

          <!-- Step 2: Condition and Description -->
          <StepPanel v-slot="{ activateCallback }" value="2">
            <div class="">
              <div class="space-y-4">
                <!-- Condition -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="condition">
                      <span class="text-red-500 mr-1">*</span>Tình trạng sử dụng
                    </label>
                    <div class="w-full">
                      <Select
                        v-model="condition"
                        v-bind="conditionAttrs"
                        :options="GundamConditions"
                        optionLabel="label"
                        optionValue="value"
                        label-id="condition"
                        placeholder="Chọn tình trạng"
                        class="w-full rounded-sm"
                        :class="{ 'border-red-500': errors.condition }"
                        :style="errors.condition ? { backgroundColor: '#fffafa' } : {}"
                      />
                      <div class="h-5">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.condition ? 'visible' : 'hidden' }"
                        >
                          {{ errors.condition }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Condition Description (hiển thị khi condition là "open box" hoặc "used") -->
                <div v-if="condition === 'open box' || condition === 'used'">
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="conditionDescription">
                      <span class="text-red-500 mr-1">*</span>Mô tả tình trạng
                    </label>
                    <div class="w-full">
                      <Textarea
                        v-model="conditionDescription"
                        v-bind="conditionDescriptionAttrs"
                        id="conditionDescription"
                        rows="3"
                        class="rounded-sm w-full"
                        :class="{ 'border-red-500': errors.conditionDescription }"
                        :style="errors.conditionDescription ? { backgroundColor: '#fffafa' } : {}"
                        placeholder="Mô tả chi tiết tình trạng sản phẩm"
                      />
                      <div class="h-5 -mt-1">
                        <span
                          class="text-red-500 text-sm"
                          :style="{
                            visibility: errors.conditionDescription ? 'visible' : 'hidden',
                          }"
                        >
                          {{ errors.conditionDescription }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Model Description -->
                <div>
                  <div class="flex gap-4">
                    <label class="w-48 text-right mt-1" for="description">
                      <span class="text-red-500 mr-1">*</span>Mô tả mô hình
                    </label>
                    <div class="w-full">
                      <Textarea
                        v-model="description"
                        v-bind="descriptionAttrs"
                        id="description"
                        rows="5"
                        class="rounded-sm w-full"
                        :class="{ 'border-red-500': errors.description }"
                        :style="errors.description ? { backgroundColor: '#fffafa' } : {}"
                      />
                      <div class="h-5 -mt-1">
                        <span
                          class="text-red-500 text-sm"
                          :style="{ visibility: errors.description ? 'visible' : 'hidden' }"
                        >
                          {{ errors.description }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex pt-6 justify-between">
              <Button
                label="Quay lại"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback('1')"
              />
              <Button
                label="Kế tiếp"
                icon="pi pi-arrow-right"
                iconPos="right"
                @click="activateCallback('3')"
                :disabled="!isStepTwoValid"
              />
            </div>
          </StepPanel>

          <!-- Step 3: Images and Accessories -->
          <StepPanel v-slot="{ activateCallback }" value="3">
            <div class="space-y-4">
              <!-- Cover Image (Required) -->
              <div>
                <div class="flex gap-4">
                  <label class="w-48 text-right mt-1" for="coverImage">
                    <span class="text-red-500 mr-1">*</span>Ảnh bìa
                    <span class="text-xs text-gray-500 block">
                      ({{ coverImage ? '1/1' : '0/1' }})
                    </span>
                  </label>
                  <div class="w-full">
                    <div
                      class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                      @click="handleCoverImageClick"
                    >
                      <input
                        type="file"
                        ref="coverImageInput"
                        accept="image/*"
                        class="hidden"
                        @change="onCoverImageChange"
                      />
                      <div v-if="!coverImage">
                        <i class="pi pi-cloud-upload text-3xl text-gray-400"></i>
                        <p class="mt-2 text-sm text-gray-500">Nhấp để tải lên</p>
                        <p class="text-xs text-gray-400">PNG, JPG, JPEG (Tối đa 5MB)</p>
                      </div>
                      <div v-else class="relative">
                        <img :src="coverImagePreview" class="max-h-64 mx-auto" />
                        <Button
                          icon="pi pi-times"
                          class="absolute top-2 right-2 p-1"
                          severity="danger"
                          @click.stop="removeCoverImage"
                        />
                      </div>
                    </div>
                    <ul class="text-sm text-gray-500 mt-1 pl-4">
                      <li>
                        Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm, Danh sách sản
                        phẩm,... Việc sử dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm
                        của bạn
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Additional Images (1-4) -->
              <div>
                <div class="flex gap-4">
                  <label class="w-48 text-right mt-1" for="additionalImages">
                    <span class="text-red-500 mr-1">*</span>Ảnh phụ
                    <span class="text-xs text-gray-500 block">
                      ({{ additionalImages.length }}/4)
                    </span>
                  </label>
                  <div class="w-full">
                    <div
                      class="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer hover:bg-gray-50"
                      @click="handleAdditionalImagesClick"
                    >
                      <input
                        type="file"
                        ref="additionalImagesInput"
                        accept="image/*"
                        multiple
                        class="hidden"
                        @change="onAdditionalImagesChange"
                      />
                      <div v-if="additionalImages.length === 0">
                        <i class="pi pi-images text-3xl text-gray-400"></i>
                        <p class="mt-2 text-sm text-gray-500">Nhấp để tải lên</p>
                        <p class="text-xs text-gray-400">PNG, JPG, JPEG (Tối đa 5MB mỗi ảnh)</p>
                      </div>
                      <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div
                          v-for="(image, index) in additionalImagesPreview"
                          :key="index"
                          class="relative"
                        >
                          <img :src="image" class="h-32 w-full object-cover rounded" />
                          <Button
                            icon="pi pi-times"
                            class="absolute top-1 right-1 p-1"
                            severity="danger"
                            @click.stop="removeAdditionalImage(index)"
                          />
                        </div>
                      </div>
                    </div>
                    <ul class="text-sm text-gray-500 mt-1 pl-4">
                      <li>Cần ít nhất 1 ảnh phụ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Accessories (Optional) -->
              <div>
                <div class="flex gap-4">
                  <label class="w-48 text-right mt-1">
                    Phụ kiện
                    <span class="text-xs text-gray-500 block"> (Không bắt buộc) </span>
                  </label>

                  <div class="w-full">
                    <!-- Existing Accessories List -->
                    <div
                      v-for="(accessory, index) in fields"
                      :key="accessory.key"
                      class="rounded-md mb-3"
                    >
                      <!-- Header cho mỗi phụ kiện -->
                      <div class="rounded mb-2">
                        <div class="grid grid-cols-12 text-sm text-gray-500">
                          <div class="col-span-7">Tên phụ kiện</div>
                          <div class="col-span-4">Số lượng</div>
                          <div class="col-span-1 text-center"></div>
                        </div>
                      </div>

                      <!-- Nội dung cho mỗi phụ kiện -->
                      <div class="grid grid-cols-12 mb-2 items-center">
                        <div class="col-span-7 mr-2">
                          <InputText v-model="accessory.value.name" class="w-full" />
                          <!-- <ErrorMessage :name="`accessories[${index}].name`" /> -->
                        </div>
                        <div class="col-span-4">
                          <InputNumber
                            v-model="accessory.value.quantity"
                            :min="1"
                            show-buttons
                            :step="1"
                            class="w-full"
                          />
                          <!-- <ErrorMessage :name="`accessories[${index}].quantity`" /> -->
                        </div>
                        <div class="col-span-1 text-center">
                          <Button
                            icon="pi pi-trash"
                            severity="danger"
                            text
                            @click="remove(index)"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Add Accessory Button -->
                    <Button
                      label="Thêm phụ kiện"
                      icon="pi pi-plus"
                      @click="push({ name: '', quantity: null })"
                      class="mb-2"
                      severity="secondary"
                      outlined
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex pt-6 justify-between">
              <Button
                label="Quay lại"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activateCallback('2')"
              />
              <Button
                type="submit"
                label="Hoàn thành"
                icon="pi pi-check"
                iconPos="right"
                :loading="isSubmitting"
                :disabled="!isStepThreeValid || isSubmitting"
              />
            </div>
          </StepPanel>
        </form>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import axiosInstance from '@/config/axios'
import { ACCESS_TOKEN_KEY } from '@/constants'
import { GundamConditions } from '@/constants/gundam'
import { useAuthStore } from '@/stores/auth'
import type { GundamGrade } from '@/types/models'
import { toTypedSchema } from '@vee-validate/yup'
import { useCookies } from '@vueuse/integrations/useCookies.mjs'
import { useToast } from 'primevue'
import Button from 'primevue/button'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import Step from 'primevue/step'
import StepList from 'primevue/steplist'
import StepPanel from 'primevue/steppanel'
import StepPanels from 'primevue/steppanels'
import Stepper from 'primevue/stepper'
import Textarea from 'primevue/textarea'
import { useFieldArray, useForm } from 'vee-validate'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import * as yup from 'yup'

const authStore = useAuthStore()
const cookies = useCookies()
const toast = useToast()

const grades = ref<GundamGrade[]>()
const scales = ref<string[]>(['1/144', '1/100', '1/60', '1/48', '1/48'])

// Template refs cho file inputs
const coverImageInput = useTemplateRef<HTMLInputElement>('coverImageInput')
const additionalImagesInput = useTemplateRef<HTMLInputElement>('additionalImagesInput')

// Các state cho Step 3
const coverImage = ref<File | null>(null)
const coverImagePreview = ref('')
const additionalImages = ref<File[]>([])
const additionalImagesPreview = ref<string[]>([])

const formValidationSchema = yup.object({
  name: yup.string().required('Không được để trống ô').min(10, 'Vui lòng nhập ít nhất 10 kí tự'),
  gradeId: yup.number().required('Cần chọn một phân loại'),
  manufacturer: yup.string().required('Không được để trống ô'),
  scale: yup.string().required('Cần chọn một tỉ lệ'),
  weight: yup
    .number()
    .required('Không được để trống ô')
    .min(1, 'Vui lòng nhập vào giá trị giữa 0 và 1.000.000')
    .max(1000000, 'Vui lòng nhập vào giá trị giữa 0 và 1.000.000'),
  price: yup
    .number()
    .required('Không được để trống ô')
    .min(1000, 'Giá trị phải ít nhất 1.000')
    .max(120000000, 'Giá đã vượt quá giá trị tối đa 120.000.000'),
  condition: yup.string().required('Cần chọn tình trạng sử dụng'),
  conditionDescription: yup
    .string()
    .when('condition', {
      is: (value: string) => value === 'open box' || value === 'used',
      then: (schema) =>
        schema.required('Không được để trống ô').min(10, 'Mô tả tình trạng ít nhất 10 ký tự'),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(null),
  description: yup
    .string()
    .min(100, 'Mô tả mô hình của bạn quá ngắn. Vui lòng nhập ít nhất 100 kí tự.')
    .default(''),
  coverImage: yup.mixed().required('Ảnh bìa là bắt buộc'), // TODO:
  additionalImages: yup.array().min(1, 'Cần ít nhất 1 ảnh phụ').max(4, 'Tối đa 4 ảnh phụ'), // TODO:
  accessories: yup
    .array()
    .of(
      yup.object({
        name: yup.string().required('Không được để trống ô'),
        quantity: yup
          .number()
          .nullable()
          .min(1, 'Số lượng phải ít nhất là 1')
          .max(100, 'Số lượng phải không quá 100')
          .default(null),
      }),
    )
    .default([]),
})

const { defineField, errors, handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(formValidationSchema),
  validateOnMount: false,
})

const [name, nameAttrs] = defineField('name', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [grade, gradeAttrs] = defineField('gradeId', {
  validateOnBlur: false,
})
const [manufacturer, manufacturerAttrs] = defineField('manufacturer', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [scale, scaleAttrs] = defineField('scale', {
  validateOnBlur: false,
})
const [weight, weightAttrs] = defineField('weight', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [price, priceAttrs] = defineField('price', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [condition, conditionAttrs] = defineField('condition', {
  validateOnBlur: false,
})
const [conditionDescription, conditionDescriptionAttrs] = defineField('conditionDescription', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [description, descriptionAttrs] = defineField('description', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [coverImageField] = defineField('coverImage', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [additionalImagesField] = defineField('additionalImages', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const { remove, push, fields } = useFieldArray<{ name: string; quantity: number | null }>(
  'accessories',
)

const handleCoverImageClick = () => {
  if (coverImageInput.value) {
    coverImageInput.value.click()
  }
}

const handleAdditionalImagesClick = () => {
  if (additionalImagesInput.value) {
    additionalImagesInput.value.click()
  }
}

// Xử lý ảnh bìa
const onCoverImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const file = input.files[0]
  if (file.size > 5 * 1024 * 1024) {
    errors.value.coverImage = 'Kích thước ảnh không được vượt quá 5MB'
    return
  }

  coverImage.value = file
  coverImageField.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    coverImagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeCoverImage = () => {
  coverImage.value = null
  coverImageField.value = undefined
  coverImagePreview.value = ''
}

// Xử lý ảnh phụ
const onAdditionalImagesChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) return

  const files = Array.from(input.files)

  // Kiểm tra số lượng ảnh
  if (additionalImages.value.length + files.length > 4) {
    errors.value.additionalImages = 'Chỉ được tải lên tối đa 4 ảnh phụ'
    return
  }

  // Kiểm tra kích thước từng ảnh
  const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024)
  if (oversizedFiles.length > 0) {
    errors.value.additionalImages = 'Kích thước mỗi ảnh không được vượt quá 5MB'
    return
  }

  // Thêm ảnh mới vào danh sách
  files.forEach((file) => {
    additionalImages.value.push(file)
    additionalImagesField.value = additionalImages.value
    const reader = new FileReader()
    reader.onload = (e) => {
      additionalImagesPreview.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
}

const removeAdditionalImage = (index: number) => {
  additionalImages.value.splice(index, 1)
  additionalImagesPreview.value.splice(index, 1)
  additionalImagesField.value = additionalImages.value
}

const emit = defineEmits(['addedSuccessfully'])

const onSubmit = handleSubmit(async (values) => {
  try {
    // Tạo FormData object
    const formData = new FormData()

    // Append các trường dữ liệu cơ bản
    formData.append('name', values.name)
    formData.append('grade_id', values.gradeId.toString())
    formData.append('manufacturer', values.manufacturer)
    formData.append('scale', values.scale)
    formData.append('weight', values.weight.toString())
    formData.append('price', values.price.toString())
    formData.append('condition', values.condition)

    // Append mô tả tình trạng nếu có
    if (values.condition === 'open box' || values.condition === 'used') {
      formData.append('condition_description', values.conditionDescription.toString())
    }

    // Append mô tả mô hình
    formData.append('description', values.description)

    // Append ảnh bìa
    if (coverImage.value) {
      formData.append('primary_image', coverImage.value)
    }

    // Append các ảnh phụ
    additionalImages.value.forEach((image) => {
      formData.append('secondary_images', image)
    })

    // Append phụ kiện - gọi append() nhiều lần với cùng tên
    values.accessories.forEach((accessory) => {
      formData.append(
        'accessory',
        JSON.stringify({
          name: accessory.name,
          quantity: accessory.quantity,
        }),
      )
    })

    // Log FormData object để kiểm tra
    for (const pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1])
    }

    // Gọi API với Axios
    await axiosInstance.post(`/sellers/${authStore.user?.id}/gundams`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${cookies.get(ACCESS_TOKEN_KEY)}`,
      },
    })

    toast.add({
      severity: 'success',
      summary: 'Mô hình của bạn đã được đăng thành công',
      group: 'tc',
      life: 3000,
    })

    emit('addedSuccessfully')
  } catch (error) {
    // Xử lý lỗi
    console.error('Lỗi khi thêm mô hình:', error)

    // Có thể hiển thị thông báo lỗi cho người dùng ở đây
  }
})

const isStepOneValid = computed(() => {
  return (
    name.value &&
    !errors.value.name &&
    grade.value &&
    manufacturer.value &&
    !errors.value.manufacturer &&
    scale.value &&
    weight.value &&
    !errors.value.weight &&
    price.value &&
    !errors.value.price
  )
})

const isStepTwoValid = computed(() => {
  if (!condition.value || errors.value.condition) {
    return false
  }

  if (
    (condition.value === 'open box' || condition.value === 'used') &&
    (!conditionDescription.value || errors.value.conditionDescription)
  ) {
    return false
  }

  return description.value && !errors.value.description
})

const isStepThreeValid = computed(() => {
  return (
    coverImage.value &&
    additionalImages.value.length > 0 &&
    additionalImages.value.length <= 4 &&
    !errors.value.coverImage &&
    !errors.value.additionalImages &&
    fields.value.every((accessory) => accessory.value.name && accessory.value.quantity)
  )
})

onMounted(async () => {
  try {
    const response = await axiosInstance.get<GundamGrade[]>('/grades')
    grades.value = response.data
  } catch (error: any) {
    console.log('Error: ', error)
  }
})
</script>

<style scoped>
ul {
  list-style-type: disc; /* hoặc circle, square tùy theo nhu cầu */
}
</style>
