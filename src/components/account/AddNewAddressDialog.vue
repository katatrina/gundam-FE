<template>
  <div>
    <Dialog v-model:visible="showDialog" modal header="Địa chỉ mới" :style="{ width: '42rem' }" class="rounded-sm">
      <form @submit="onSubmit" class="mt-1 text-base space-y-6">
        <!-- Họ tên & Số điện thoại -->
        <div class="grid grid-cols-2 gap-3">
          <div>
            <FloatLabel variant="on">
              <InputText id="receiver_name" v-model="fullName" v-bind="fullNameAttrs" class="w-full rounded-sm" />
              <label for="receiver_name">Họ và tên</label>
            </FloatLabel>
            <div v-show="errors.fullName" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
              <p>{{ errors.fullName }}</p>
            </div>
          </div>

          <div>
            <FloatLabel variant="on">
              <InputText id="receiver_phone_number" v-model="phoneNumber" v-bind="phoneNumberAttrs"
                class="w-full rounded-sm" />
              <label for="receiver_phone_number">Số điện thoại</label>
            </FloatLabel>
            <div v-show="errors.phoneNumber" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
              <p>{{ errors.phoneNumber }}</p>
            </div>
          </div>
        </div>

        <!-- Địa chỉ (Tỉnh, Quận, Phường) -->
        <div class="grid grid-cols-3 gap-3">
          <FloatLabel variant="on">
            <Select v-model="selectedProvince" inputId="province" :options="provinces" optionLabel="ProvinceName"
              optionValue="ProvinceID" class="w-full rounded-sm" :loading="loadingProvinces"
              @change="handleProvinceChange" />
            <label for="province">Tỉnh/Thành phố</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <Select v-model="selectedDistrict" inputId="district" :options="districts" optionLabel="DistrictName"
              optionValue="DistrictID" class="w-full rounded-sm" :loading="loadingDistricts"
              @change="handleDistrictChange" :disabled="!selectedProvince" />
            <label for="district">Quận/Huyện</label>
          </FloatLabel>

          <FloatLabel variant="on">
            <Select v-model="selectedWard" inputId="ward" :options="wards" optionLabel="WardName" optionValue="WardCode"
              class="w-full rounded-sm" :loading="loadingWards" :disabled="!selectedDistrict" />
            <label for="ward">Phường/Xã</label>
          </FloatLabel>
        </div>

        <!-- Địa chỉ cụ thể -->
        <div>
          <FloatLabel variant="on">
            <Textarea id="addressDetail" v-model="addressDetail" v-bind="addressDetailAttrs" rows="2"
              style="resize: none" class="w-full rounded-sm" />
            <label for="addressDetail">Địa chỉ cụ thể</label>
          </FloatLabel>
          <div v-show="errors.addressDetail" class="h-5 text-sm text-red-500 pl-1 pt-0.5">
            <p>{{ errors.addressDetail }}</p>
          </div>
        </div>

        <!-- Checkbox Đặt làm mặc định -->
        <div class="flex items-center">
          <Checkbox v-model="isPrimaryAddress" inputId="primaryAddress" class="mr-2" binary />
          <label for="primaryAddress" class="text-gray-700 cursor-pointer select-none">Đặt làm mặc định</label>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end gap-3">
          <Button label="Hủy" severity="secondary" @click="closeDialog" />
          <Button type="submit" label="Xác Nhận" severity="primary" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/yup';
import axios from 'axios';
import { Button, Checkbox, Dialog, FloatLabel, InputText, Select, Textarea } from 'primevue';
import { useForm } from 'vee-validate';
import { onMounted, ref } from 'vue';
import * as yup from 'yup';

// import from env file
const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN_API;
const API_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data';

const showDialog = ref(false);
const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const loadingProvinces = ref(false);
const loadingDistricts = ref(false);
const loadingWards = ref(false);

// Form validation schema
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
});

const { defineField, handleSubmit, resetForm, errors } = useForm({
  validationSchema: toTypedSchema(validationSchema),
});

const [fullName, fullNameAttrs] = defineField('fullName');
const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber');
const [addressDetail, addressDetailAttrs] = defineField('addressDetail');

const selectedProvince = ref();
const selectedDistrict = ref();
const selectedWard = ref();
const isPrimaryAddress = ref(false);

// API calls
const fetchProvinces = async () => {
  try {
    loadingProvinces.value = true;
    const response = await axios.get(`${API_URL}/province`, {
      headers: {
        'Content-Type': 'application/json',
        'Token': GHN_TOKEN
      }
    });

    // Chuyển đổi dữ liệu từ object sang array và sắp xếp theo bảng chữ cái tiếng Việt
    if (response.data.code === 200 && response.data.data) {
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      provinces.value = data.sort((a: any, b: any) => a.ProvinceName.localeCompare(b.ProvinceName, 'vi'));
    }
  } catch (error) {
    console.error('Error fetching provinces:', error);
  } finally {
    loadingProvinces.value = false;
  }
};

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

// Event handlers
const handleProvinceChange = (event: any) => {
  selectedDistrict.value = null;
  selectedWard.value = null;
  districts.value = [];
  wards.value = [];

  if (event.value) {
    fetchDistricts(event.value);
  }
};

const handleDistrictChange = (event: any) => {
  selectedWard.value = null;
  wards.value = [];

  if (event.value) {
    fetchWards(event.value);
  }
};

const openDialog = () => {
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  resetForm();
  selectedProvince.value = null;
  selectedDistrict.value = null;
  selectedWard.value = null;
  isPrimaryAddress.value = false;
};

const onSubmit = handleSubmit((values: any) => {
  // Handle form submission
  console.log('Form submitted:', {
    ...values,
    province: selectedProvince.value,
    district: selectedDistrict.value,
    ward: selectedWard.value,
    isPrimaryAddress: isPrimaryAddress.value
  });
  closeDialog();
});

// Fetch provinces on component mount
onMounted(() => {
  fetchProvinces();
});

defineExpose({
  openDialog
});
</script>

<style scoped>
.p-error {
  color: red;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>
