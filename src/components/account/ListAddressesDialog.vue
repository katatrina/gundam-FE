<template>
  <div v-if="showDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-sm w-full max-w-lg h-[600px] flex flex-col transform">
      <!-- Header -->
      <div class="px-4 py-3 flex justify-between items-center">
        <h3 class="text-lg font-semibold">Địa Chỉ Của Tôi</h3>
      </div>

      <!-- Divider -->
      <div class="h-[1px] bg-gray-200 w-full"></div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-5">
        <div class="flex flex-col">
          <div v-for="(address, index) in userAddresses" :key="address.id"
            :class="['flex items-start gap-3 py-3 pb-4', index !== userAddresses.length - 1 ? 'border-b' : '']">
            <RadioButton v-model="localSelectedAddress" :value="address" :name="'address_' + address.id" class="mt-1" />
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ address.full_name }}</span>
                  <span class="text-gray-600">{{ address.phone_number }}</span>
                </div>
                <button class="text-blue-500 no-underline">Cập nhật</button>
              </div>
              <p class="text-gray-600">{{ address.detail }}</p>
              <p class="text-gray-600">{{ formatLocation(address) }}</p>
              <div class="mt-2 flex gap-2 text-sm">
                <Tag v-if="address.is_primary" value="Mặc định" severity="info" />
                <Tag v-if="address.is_pickup_address" value="Địa chỉ lấy hàng" severity="warn" />
              </div>
            </div>
          </div>

          <Button class="flex items-center justify-center p-4 border border-dashed
                   border-gray-300 rounded-lg hover:border-gray-400" text>
            <i class="pi pi-plus"></i>
            <span>Thêm Địa Chỉ Mới</span>
          </Button>
        </div>
      </div>

      <!-- Footer -->
      <div class="px-4 py-3 bg-gray-50 flex justify-end gap-3 border-t">
        <Button label="Huỷ" severity="secondary" @click="closeDialog" />
        <Button label="Xác nhận" severity="primary" @click="confirmSelection" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import axios from '@/config/axios';
import { useAuthStore } from '@/stores/auth';
import type { UserAddress } from '@/types/models';
import { formatLocation } from '@/utils/user';
import { Button, RadioButton, Tag } from 'primevue';
import { ref } from 'vue';

const props = defineProps<{
  selectedAddress: UserAddress | null
}>();

const authStore = useAuthStore();

const userAddresses = ref<UserAddress[]>([]);
const showDialog = ref(false);
const localSelectedAddress = ref<UserAddress | null>(null);

const emit = defineEmits<{
  (e: 'changeAddress', address: UserAddress): void
}>();

const openDialog = async () => {
  showDialog.value = true;
  localSelectedAddress.value = props.selectedAddress; // Set initial value
  await fetchUserAddresses();
};

const closeDialog = () => {
  showDialog.value = false;
  localSelectedAddress.value = null;
};

const confirmSelection = () => {
  if (localSelectedAddress.value) {
    emit('changeAddress', localSelectedAddress.value);
  }
  showDialog.value = false;
};

async function fetchUserAddresses() {
  try {
    const response = await axios.get<UserAddress[]>(`/users/${authStore.user?.id}/addresses`);
    userAddresses.value = response.data;
  } catch (error) {
    console.error(error);
  }
}

defineExpose({
  openDialog,
  closeDialog
});
</script>

<style scoped>
/* Định nghĩa các class cho hiệu ứng transition */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
