<template>
  <div class="flex justify-center">
    <Stepper value="1" class="basis-[50rem]" linear>
      <StepList>
        <Step value="1">Thông tin cơ bản</Step>
        <Step value="2">Tình trạng và mô tả</Step>
        <Step value="3">Phụ kiện và hình ảnh</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="">
            <form class="space-y-6">
              <!-- Model name -->
              <div class="h-[44px]">
                <div class="flex gap-4">
                  <label class="w-32 text-right mt-1" for="name"
                    ><span class="text-red-500 mr-1">*</span>Tên mô hình</label
                  >
                  <InputText
                    type="text"
                    v-model="name"
                    v-bind="nameAttrs"
                    id="name"
                    class="rounded-sm w-2/4"
                    :class="{ 'border-red-500': errors.name }"
                    :style="errors.name ? { backgroundColor: '#fffafa' } : {}"
                    placeholder="Tên mô hình + Series + Edition"
                  />
                </div>
                <div v-show="errors.name" class="flex">
                  <div class="w-36"></div>
                  <span class="text-red-500 text-sm">{{ errors.name }}</span>
                </div>
              </div>

              <!-- Grade -->
              <div class="h-[44px]">
                <div class="flex gap-4">
                  <label class="w-32 text-right mt-1" for="grade"
                    ><span class="text-red-500 mr-1">*</span>Phân loại</label
                  >
                  <Select
                    v-model="grade"
                    v-bind="gradeAttrs"
                    :options="grades"
                    optionLabel="display_name"
                    option-value="id"
                    label-id="grade"
                    placeholder="Chọn phân loại"
                    class="w-2/4 rounded-sm"
                    :class="{ 'border-red-500': errors.grade }"
                    :style="errors.grade ? { backgroundColor: '#fffafa' } : {}"
                  />
                </div>
                <div v-show="errors.grade" class="flex">
                  <div class="w-36"></div>
                  <span class="text-red-500 text-sm">{{ errors.grade }}</span>
                </div>
              </div>

              <!-- Manufacturer -->
              <div class="h-[44px]">
                <div class="flex gap-4">
                  <label class="w-32 text-right mt-1" for="manufacturer"
                    ><span class="text-red-500 mr-1">*</span>Thương hiệu</label
                  >
                  <InputText
                    type="text"
                    v-model="manufacturer"
                    v-bind="manufacturerAttrs"
                    id="manufacturer"
                    class="rounded-sm w-2/4"
                    placeholder="Nhập vào"
                    :class="{ 'border-red-500': errors.manufacturer }"
                    :style="errors.manufacturer ? { backgroundColor: '#fffafa' } : {}"
                  />
                </div>
                <div v-show="errors.manufacturer" class="flex">
                  <div class="w-36"></div>
                  <span class="text-red-500 text-sm">{{ errors.manufacturer }}</span>
                </div>
              </div>

              <!-- Scale -->
              <div class="h-[44px]">
                <div class="flex gap-4">
                  <label class="w-32 text-right mt-1" for="scale"
                    ><span class="text-red-500 mr-1">*</span>Tỉ lệ</label
                  >
                  <Select
                    v-model="scale"
                    v-bind="scaleAttrs"
                    :options="scales"
                    placeholder="Chọn tỉ lệ"
                    class="w-2/4 rounded-sm"
                  />
                </div>
                <div v-show="errors.scale" class="flex">
                  <div class="w-36"></div>
                  <span class="text-red-500 text-sm">{{ errors.scale }}</span>
                </div>
              </div>

              <!-- Weight -->
              <div class="h-[44px]">
                <div class="flex gap-4">
                  <label class="w-32 text-right mt-1" for="weight"
                    ><span class="text-red-500 mr-1">*</span>Cân nặng</label
                  >
                  <InputGroup class="w-2/4">
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
                </div>
                <div v-show="errors.weight" class="flex">
                  <div class="w-36"></div>
                  <span class="text-red-500 text-sm">{{ errors.weight }}</span>
                </div>
              </div>

              <!-- Price -->
              <div class="h-[44px]">
                <div class="flex gap-4">
                  <label class="w-32 text-right mt-1" for="price"
                    ><span class="text-red-500 mr-1">*</span>Giá</label
                  >
                  <InputGroup class="w-2/4">
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
                </div>
                <div v-show="errors.price" class="flex">
                  <div class="w-36"></div>
                  <span class="text-red-500 text-sm">{{ errors.price }}</span>
                </div>
              </div>
            </form>
          </div>

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

        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="flex flex-col h-48">
            <div class="">Content II</div>
          </div>
          <div class="flex pt-6 justify-between">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('1')"
            />
            <Button
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="activateCallback('3')"
            />
          </div>
        </StepPanel>

        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="flex flex-col h-48">
            <div>Content III</div>
          </div>
          <div class="pt-6">
            <Button
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="activateCallback('2')"
            />
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Step from 'primevue/step'
import StepList from 'primevue/steplist'
import StepPanel from 'primevue/steppanel'
import StepPanels from 'primevue/steppanels'
import Stepper from 'primevue/stepper'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, onMounted, ref } from 'vue'
import type { GundamGrade } from '@/types/models'
import axiosInstance from '@/config/axios'

const scales = ref<string[]>(['1/144', '1/100', '1/60', '1/48', '1/48'])

const formValidationSchema = yup.object({
  name: yup.string().required('Không được để trống ô').min(10, 'Vui lòng nhập ít nhất 10 kí tự'),
  grade: yup.number().required('Cần chọn một phân loại'),
  manufacturer: yup.string().required('Không được để trống ô'),
  scale: yup.string().required('Cần chọn một tỉ lệ'),
  weight: yup
    .number()
    .required('Không được để trống ô')
    .moreThan(0, 'Vui lòng nhập vào giá trị giữa 0 và 1.000.000')
    .max(1000000, 'Vui lòng nhập vào giá trị giữa 0 và 1.000.000'),
  price: yup
    .number()
    .required('Không được để trống ô')
    .min(1000, 'Giá trị phải ít nhất 1.000')
    .max(120000000, 'Giá đã vượt quá giá trị tối đa 120.000.000'),
})

const { defineField, errors, values } = useForm({
  validationSchema: toTypedSchema(formValidationSchema),
})

const [name, nameAttrs] = defineField('name', {
  validateOnInput: true,
  validateOnBlur: false,
  validateOnChange: true,
})
const [grade, gradeAttrs] = defineField('grade', {
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

const grades = ref<GundamGrade[]>()

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

onMounted(async () => {
  try {
    const response = await axiosInstance.get<GundamGrade[]>('/grades')
    grades.value = response.data
  } catch (error: any) {
    console.log('Error: ', error)
  }
})
</script>

<style scoped></style>
