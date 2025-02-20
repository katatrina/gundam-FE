<template>
  <Dialog v-model:visible="showDialog" modal header="Địa chỉ mới" :style="{ width: '42rem' }" class="rounded-sm"
    :closable=false>
    <form @submit="onSubmit" class="mt-1 text-base space-y-6">
      <!-- Existing name and phone fields remain the same -->
      <div class="grid grid-cols-2 gap-3">
        <div>
          <FloatLabel variant="on">
            <InputText id="full_name" v-model="fullName" v-bind="fullNameAttrs" class="w-full rounded-sm" />
            <label for="full_name">Họ và tên</label>
          </FloatLabel>
          <div v-show="errors.fullName" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
            <p>{{ errors.fullName }}</p>
          </div>
        </div>

        <div>
          <FloatLabel variant="on">
            <InputText id="phone_number" v-model="phoneNumber" v-bind="phoneNumberAttrs" class="w-full rounded-sm" />
            <label for="phone_number">Số điện thoại</label>
          </FloatLabel>
          <div v-show="errors.phoneNumber" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
            <p>{{ errors.phoneNumber }}</p>
          </div>
        </div>
      </div>

      <!-- Updated Province/District/Ward section with validation -->
      <div class="grid grid-cols-3 gap-3">
        <div>
          <FloatLabel variant="on">
            <Select v-model="province" inputId="province" :options="provinces" optionLabel="ProvinceName"
              optionValue="ProvinceID" class="w-full rounded-sm" :loading="loadingProvinces"
              @change="handleProvinceChange" v-bind="provinceAttrs" />
            <label for="province">Tỉnh/Thành phố</label>
          </FloatLabel>
          <div v-show="errors.province" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
            <p>{{ errors.province }}</p>
          </div>
        </div>

        <div>
          <FloatLabel variant="on">
            <Select v-model="district" inputId="district" :options="districts" optionLabel="DistrictName"
              optionValue="DistrictID" class="w-full rounded-sm" :loading="loadingDistricts"
              @change="handleDistrictChange" :disabled="!province" v-bind="districtAttrs" />
            <label for="district">Quận/Huyện</label>
          </FloatLabel>
          <div v-show="errors.district" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
            <p>{{ errors.district }}</p>
          </div>
        </div>

        <div>
          <FloatLabel variant="on">
            <Select v-model="ward" inputId="ward" :options="wards" optionLabel="WardName" optionValue="WardCode"
              class="w-full rounded-sm" :loading="loadingWards" :disabled="!district" v-bind="wardAttrs" />
            <label for="ward">Phường/Xã</label>
          </FloatLabel>
          <div v-show="errors.ward" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
            <p>{{ errors.ward }}</p>
          </div>
        </div>
      </div>

      <!-- Rest of the template remains the same -->
      <div>
        <FloatLabel variant="on">
          <Textarea id="addressDetail" v-model="addressDetail" v-bind="addressDetailAttrs" rows="2" style="resize: none"
            class="w-full rounded-sm" />
          <label for="addressDetail">Địa chỉ cụ thể</label>
        </FloatLabel>
        <div v-show="errors.addressDetail" class="h-5 text-sm text-red-500 pl-1">
          <p>{{ errors.addressDetail }}</p>
        </div>
      </div>

      <div class="w-fit">
        <div class="flex items-center min-w-fit"
          :class="{ 'opacity-50': props.forcePrimaryAddress, 'cursor-not-allowed': props.forcePrimaryAddress, 'cursor-pointer': !props.forcePrimaryAddress }"
          v-tooltip.top="props.forcePrimaryAddress ? {
            value: 'Bạn không thể xoá nhãn Địa chỉ mặc định. Hãy đặt địa chỉ khác làm Địa chỉ mặc định của bạn nhé.',
            pt: {
              root: {
                style: { 'max-width': '170px', 'font-size': '0.875rem' }
              }
            },
          } : undefined">
          <Checkbox v-model="localIsPrimaryAddress" inputId="primaryAddress" binary
            :disabled="props.forcePrimaryAddress" class="w-6" />
          <label for="primaryAddress" class="text-gray-700 select-none whitespace-nowrap"
            :class="{ 'cursor-not-allowed': props.forcePrimaryAddress, 'cursor-pointer': !props.forcePrimaryAddress }">
            Đặt làm mặc định
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <Button label="Hủy" severity="secondary" @click="closeDialog" />
        <Button type="submit" label="Xác Nhận" severity="primary" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { AddressRequest } from '@/types/request';
import { toTypedSchema } from '@vee-validate/yup';
import axios from 'axios';
import { Button, Checkbox, Dialog, FloatLabel, InputText, Select, Textarea } from 'primevue';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import * as yup from 'yup';

// Constants remain the same
const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN_API;
const API_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data';

// Updated validation schema with province, district, and ward
const validationSchema = yup.object({
  fullName: yup.string()
    .trim()
    .required('Tên không được để trống')
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(100, 'Tên không được quá 100 ký tự')
    .matches(/^[\p{L} ]+$/u, 'Tên chỉ được chứa chữ cái và khoảng trắng'),
  phoneNumber: yup.string()
    .trim()
    .required('Nhập một số hợp lệ')
    .matches(/^(09|08|07|05|03)[0-9]{8}$/, 'Nhập một số hợp lệ'),
  addressDetail: yup.string()
    .trim()
    .required('Địa chỉ không được để trống')
    .min(5, 'Địa chỉ quá ngắn')
    .max(255, 'Địa chỉ không được quá 255 ký tự'),
  province: yup.number()
    .required('Vui lòng chọn Tỉnh/Thành phố'),
  district: yup.number()
    .required('Vui lòng chọn Quận/Huyện'),
  ward: yup.string()
    .required('Vui lòng chọn Phường/Xã')
});

// Initialize form with VeeValidate
const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(validationSchema),
  initialValues: {
    fullName: '',
    phoneNumber: '',
    addressDetail: '',
    province: undefined,
    district: undefined,
    ward: undefined
  }
});

// Define all form fields
const [fullName, fullNameAttrs] = defineField('fullName');
const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber');
const [addressDetail, addressDetailAttrs] = defineField('addressDetail');
const [province, provinceAttrs] = defineField('province', {
  validateOnBlur: false,
});
const [district, districtAttrs] = defineField('district', {
  validateOnBlur: false,
});
const [ward, wardAttrs] = defineField('ward', {
  validateOnBlur: false,
});

// Props definition
interface Props {
  forcePrimaryAddress?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  forcePrimaryAddress: false
})

// Refs for data
const showDialog = ref(false);
const provinces = ref<Province[]>([]);
const districts = ref<District[]>([]);
const wards = ref<Ward[]>([]);
// Add a local ref for the checkbox state
const localIsPrimaryAddress = ref(props.forcePrimaryAddress);

// Create a computed property that depends on both the local state and props
const isPrimaryAddress = computed({
  get: () => props.forcePrimaryAddress || localIsPrimaryAddress.value,
  set: (value) => {
    if (!props.forcePrimaryAddress) {
      localIsPrimaryAddress.value = value;
    }
  }
});

const loadingProvinces = ref(false);
const loadingDistricts = ref(false);
const loadingWards = ref(false);

interface Province {
  ProvinceID: number;
  ProvinceName: string;
}

interface District {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: string;
  DistrictID: number;
  WardName: string;
}

// API calls remain the same
const fetchProvinces = async () => {
  try {
    loadingProvinces.value = true;
    const response = await axios.get(`${API_URL}/province`, {
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN
      }
    });

    if (response.data.code === 200 && response.data.data) {
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      provinces.value = data.sort((a: any, b: any) =>
        a.ProvinceName.localeCompare(b.ProvinceName, 'vi')
      );
    }
  } catch (error) {
    console.error('Error fetching provinces:', error);
  } finally {
    loadingProvinces.value = false;
  }
};

// Updated handlers for select changes
const handleProvinceChange = async (event: any) => {
  district.value = undefined;
  ward.value = undefined;
  districts.value = [];
  wards.value = [];

  if (event.value) {
    await fetchDistricts(event.value);
  }
};

const handleDistrictChange = async (event: any) => {
  ward.value = undefined;
  wards.value = [];

  if (event.value) {
    await fetchWards(event.value);
  }
};

// Rest of the API calls remain the same
const fetchDistricts = async (provinceId: number) => {
  try {
    loadingDistricts.value = true;
    const response = await axios.post(`${API_URL}/district`, {
      province_id: provinceId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN
      }
    });

    if (response.data.code === 200 && Array.isArray(response.data.data)) {
      districts.value = response.data.data.sort((a: any, b: any) =>
        a.DistrictName.localeCompare(b.DistrictName, 'vi-VN')
      );
    }
  } catch (error) {
    console.error('Error fetching districts:', error);
    districts.value = [];
  } finally {
    loadingDistricts.value = false;
  }
};

const fetchWards = async (districtId: number) => {
  try {
    loadingWards.value = true;
    const response = await axios.post(`${API_URL}/ward?district_id`, {
      district_id: districtId
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN
      }
    });

    if (response.data.code === 200 && Array.isArray(response.data.data)) {
      wards.value = response.data.data.sort((a: any, b: any) =>
        a.WardName.localeCompare(b.WardName, 'vi-VN')
      );
    }
  } catch (error) {
    console.error('Error fetching wards:', error);
  } finally {
    loadingWards.value = false;
  }
};

// Dialog handlers
const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  resetForm();
  districts.value = [];
  wards.value = [];
  localIsPrimaryAddress.value = isPrimaryAddress.value;
};

const emit = defineEmits<{
  (e: 'createNewAddress', value: AddressRequest): void
}>()

const onSubmit = handleSubmit(async (values) => {
  try {
    // Get the selected province, district, ward names
    const selectedProvince = provinces.value.find(p => p.ProvinceID === values.province);
    const selectedDistrict = districts.value.find(d => d.DistrictID === values.district);
    const selectedWard = wards.value.find(w => w.WardCode === values.ward);

    // Construct the submission data
    const submissionData: AddressRequest = {
      full_name: values.fullName,
      phone_number: values.phoneNumber,
      province_name: selectedProvince?.ProvinceName || '',
      district_name: selectedDistrict?.DistrictName || '',
      ghn_district_id: selectedDistrict?.DistrictID || 0,
      ward_name: selectedWard?.WardName || '',
      ghn_ward_code: selectedWard?.WardCode || '',
      detail: values.addressDetail,
      is_primary: isPrimaryAddress.value,
      is_pickup_address: false
    };

    // Parent component will handle the submission and close the dialog
    emit('createNewAddress', submissionData);
  } catch (error) {
    console.error('Error submitting form:', error);
  }
}, (errors) => {
  // You can handle validation errors here, maybe scroll to the first error
  const firstError = Object.keys(errors)[0];
  const errorElement = document.querySelector(`[id="${firstError}"]`);
  errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Fetch provinces on mount
onMounted(() => {
  fetchProvinces();
});

defineExpose({
  openDialog,
  closeDialog
});
</script>

<style scoped></style>
