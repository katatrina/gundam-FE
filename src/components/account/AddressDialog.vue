<template>
  <Dialog v-model:visible="showDialog" modal :header="dialogTitle" :style="{ width: '42rem' }" class="rounded-sm"
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
          :class="{ 'opacity-50': props.forcePrimaryAddress || currentAddress?.is_primary, 'cursor-not-allowed': props.forcePrimaryAddress || currentAddress?.is_primary, 'cursor-pointer': !props.forcePrimaryAddress && !currentAddress?.is_primary }"
          v-tooltip.top="props.forcePrimaryAddress || currentAddress?.is_primary ? {
            value: 'Bạn không thể xoá nhãn Địa chỉ mặc định. Hãy đặt địa chỉ khác làm Địa chỉ mặc định của bạn nhé.',
            pt: {
              root: {
                style: { 'max-width': '170px', 'font-size': '0.875rem' }
              }
            },
          } : undefined">
          <Checkbox v-model="isPrimaryAddress" inputId="primaryAddress" binary
            :disabled="props.forcePrimaryAddress || currentAddress?.is_primary" class="w-6" />
          <label for="primaryAddress" class="text-gray-700 select-none whitespace-nowrap"
            :class="{ 'cursor-not-allowed': props.forcePrimaryAddress || currentAddress?.is_primary, 'cursor-pointer': !props.forcePrimaryAddress && !currentAddress?.is_primary }">
            Đặt làm mặc định
          </label>
        </div>
      </div>

      <!-- Sau div của isPrimaryAddress -->
      <div v-if="authStore.user?.role === 'seller' || forcePickupAddress === true" class="w-fit">
        <div class="flex items-center min-w-fit"
          :class="{ 'opacity-50': props.forcePickupAddress || currentAddress?.is_pickup_address, 'cursor-not-allowed': props.forcePickupAddress || currentAddress?.is_pickup_address, 'cursor-pointer': !props.forcePickupAddress && !currentAddress?.is_pickup_address }"
          v-tooltip.top="props.forcePickupAddress || currentAddress?.is_pickup_address ? {
            value: 'Bạn không thể xoá nhãn Địa chỉ lấy hàng. Hãy đặt địa chỉ khác làm Địa chỉ lấy hàng của bạn nhé.',
            pt: {
              root: {
                style: { 'max-width': '170px', 'font-size': '0.875rem' }
              }
            },
          } : undefined">
          <Checkbox v-model="isPickupAddress" inputId="pickupAddress" binary
            :disabled="props.forcePickupAddress || currentAddress?.is_pickup_address" class="w-6" />
          <label for="pickupAddress" class="text-gray-700 select-none whitespace-nowrap"
            :class="{ 'cursor-not-allowed': props.forcePickupAddress || currentAddress?.is_pickup_address, 'cursor-pointer': !props.forcePickupAddress && !currentAddress?.is_pickup_address }">
            Đặt làm địa chỉ lấy hàng
          </label>
        </div>
      </div>

      <div class="flex justify-end gap-3">
        <Button label="Hủy" severity="secondary" @click="closeDialog" />
        <Button type="submit" :label="submitButtonLabel" severity="primary" />
      </div>
    </form>
  </Dialog>
</template>

<script setup lang="ts">
import type { UserAddress } from '@/types/models';
import { toTypedSchema } from '@vee-validate/yup';
import axios from 'axios';
import { Button, Checkbox, Dialog, FloatLabel, InputText, Select, Textarea } from 'primevue';
import { useForm } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import * as yup from 'yup';
import { useAuthStore } from '@/stores/auth';

// Constants remain the same
const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN_API;
const API_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data';

const authStore = useAuthStore();

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

// Định nghĩa Props đơn giản hơn, không còn existingAddress
interface Props {
  forcePrimaryAddress?: boolean;
  forcePickupAddress?: boolean;
  mode: 'create' | 'update';
}

const props = withDefaults(defineProps<Props>(), {
  forcePrimaryAddress: false,
  forcePickupAddress: false,
  mode: 'create'
})

// Cập nhật tên và tiêu đề Dialog dựa vào mode
const dialogTitle = computed(() => dialogMode.value === 'create' ? 'Địa chỉ mới' : 'Cập nhật địa chỉ');

// Refs for data
const showDialog = ref(false);
const provinces = ref<Province[]>([]);
const districts = ref<District[]>([]);
const wards = ref<Ward[]>([]);
const localIsPrimaryAddress = ref(false);
const localIsPickupAddress = ref(false);

// Ref để lưu trữ địa chỉ hiện tại và chế độ làm việc
const currentAddress = ref<UserAddress | null>(null);
const dialogMode = ref<'create' | 'update'>(props.mode);

const isPrimaryAddress = computed({
  get: () => localIsPrimaryAddress.value,
  set: (newValue) => {
    if (!props.forcePrimaryAddress) {
      localIsPrimaryAddress.value = newValue;
    }
  }
});

const isPickupAddress = computed({
  get: () => localIsPickupAddress.value,
  set: (newValue) => {
    if (!props.forcePickupAddress) {
      localIsPickupAddress.value = newValue;
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

/**
 * Mở dialog với address cụ thể
 * @param address địa chỉ cần chỉnh sửa (nếu ở chế độ update)
 * @param mode chế độ 'create' hoặc 'update'
 */
const openDialog = async (address?: UserAddress, mode: 'create' | 'update' = 'create') => {
  // Reset form và cập nhật các giá trị
  resetForm();
  resetAddressData();

  // Cập nhật mode và address hiện tại
  dialogMode.value = mode;
  currentAddress.value = address || null;

  // Mở dialog
  showDialog.value = true;

  // Xử lý địa chỉ mặc định
  localIsPrimaryAddress.value = props.forcePrimaryAddress || (address?.is_primary || false);
  localIsPickupAddress.value = props.forcePickupAddress || (address?.is_pickup_address || false);

  // Nếu đang ở chế độ update và có địa chỉ, điền dữ liệu
  if (mode === 'update' && address) {
    // Điền thông tin cơ bản
    fullName.value = address.full_name || '';
    phoneNumber.value = address.phone_number || '';
    addressDetail.value = address.detail || '';

    try {
      // Tải dữ liệu tỉnh/thành phố
      await fetchProvinces();

      // Tìm và chọn tỉnh/thành phố
      const provinceObj = provinces.value.find(p =>
        p.ProvinceName.trim() === address.province_name?.trim()
      );

      if (provinceObj) {
        province.value = provinceObj.ProvinceID;

        // Tải quận/huyện sau khi đã chọn tỉnh/thành phố
        await fetchDistricts(provinceObj.ProvinceID);

        // Tìm và chọn quận/huyện
        const districtObj = districts.value.find(d =>
          (d.DistrictID === address.ghn_district_id) ||
          (d.DistrictName.trim() === address.district_name?.trim())
        );


        if (districtObj) {
          district.value = districtObj.DistrictID;

          // Tải phường/xã sau khi đã chọn quận/huyện
          await fetchWards(districtObj.DistrictID);

          // Tìm và chọn phường/xã
          const wardObj = wards.value.find(w =>
            (w.WardCode === address.ghn_ward_code) ||
            (w.WardName.trim() === address.ward_name?.trim())
          );

          if (wardObj) {
            ward.value = wardObj.WardCode;
          } else {
            console.warn('No matching ward found');
          }
        } else {
          console.warn('No matching district found');
        }
      } else {
        console.warn('No matching province found');
      }
    } catch (error) {
      console.error('Error filling address details:', error);
    }
  }
};


// Reset dữ liệu địa chỉ
const resetAddressData = () => {
  province.value = undefined;
  district.value = undefined;
  ward.value = undefined;
  districts.value = [];
  wards.value = [];
  localIsPrimaryAddress.value = false;
  localIsPickupAddress.value = false;
  currentAddress.value = null;
};

// Đóng dialog
const closeDialog = () => {
  showDialog.value = false;
  resetForm();
  resetAddressData();
};

// Cập nhật phương thức emit
const emit = defineEmits<{
  (e: 'create-new-address', value: UserAddress): void;
  (e: 'update-address', value: UserAddress): void;
}>();

const onSubmit = handleSubmit(async (values) => {
  try {
    // Get the selected province, district, ward names
    const selectedProvince = provinces.value.find(p => p.ProvinceID === values.province);
    const selectedDistrict = districts.value.find(d => d.DistrictID === values.district);
    const selectedWard = wards.value.find(w => w.WardCode === values.ward);

    // Construct the submission data
    const submissionData: UserAddress = {
      id: currentAddress.value?.id || 0,
      user_id: currentAddress.value?.user_id || '',
      full_name: values.fullName,
      phone_number: values.phoneNumber,
      province_name: selectedProvince?.ProvinceName || '',
      district_name: selectedDistrict?.DistrictName || '',
      ghn_district_id: selectedDistrict?.DistrictID || 0,
      ward_name: selectedWard?.WardName || '',
      ghn_ward_code: selectedWard?.WardCode || '',
      detail: values.addressDetail,
      is_primary: localIsPrimaryAddress.value,
      is_pickup_address: localIsPickupAddress.value
    };

    // Nếu đang ở chế độ update, thêm id từ địa chỉ hiện tại
    if (dialogMode.value === 'update' && currentAddress.value?.id) {
      (submissionData as any).id = currentAddress.value.id;
    }

    // Emit sự kiện phù hợp dựa vào mode
    if (dialogMode.value === 'create') {
      emit('create-new-address', submissionData);
    } else {
      emit('update-address', submissionData);
    }
  } catch (error) {
    console.error(`Error ${dialogMode.value === 'create' ? 'creating' : 'updating'} address:`, error);
  }
}, (errors) => {
  // You can handle validation errors here, maybe scroll to the first error
  const firstError = Object.keys(errors)[0];
  const errorElement = document.querySelector(`[id="${firstError}"]`);
  errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Cập nhật nút submit dựa vào dialogMode
const submitButtonLabel = computed(() => dialogMode.value === 'create' ? 'Xác Nhận' : 'Cập Nhật');

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
