<template>
  <!-- Header -->
  <div class="flex justify-between items-center">
    <div>
      <h1 class="text-xl font-semibold">Địa chỉ của tôi</h1>
    </div>

    <Button label="Thêm Địa Chỉ Mới" icon="pi pi-plus" class="px-3 py-1.5 rounded-sm text-sm"
      @click="openCreateDialog" />
  </div>

  <AddressDialog ref="addressDialogRef" :forcePrimaryAddress="userHasNoAddresses" :forcePickupAddress="false"
    @create-new-address="handleCreateNewAddress" @update-address="handleUpdateAddress" :mode="dialogMode" />

  <Divider />

  <!-- Addresses -->
  <div v-if="addresses.length" class="flex flex-col gap-y-2">
    <template v-for="(address, index) in addresses" :key="address.id">
      <div class="flex justify-between items-start">
        <div class="space-y-1">
          <div class="flex items-center">
            <p class="font-semibold">{{ address.full_name }}</p>
            <Divider layout="vertical" class="mx-2 h-6" />
            <p class="text-gray-600">{{ address.phone_number }}</p>
          </div>
          <p class="text-gray-600">{{ address.detail }}</p>
          <p class="text-gray-600">{{ formatLocation(address) }}</p>
          <div class="flex gap-x-2">
            <Tag v-if="address.is_primary" value="Mặc định" severity="info" />
            <Tag v-if="address.is_pickup_address" value="Địa chỉ lấy hàng" severity="warn" />
          </div>
        </div>

        <div class="flex flex-col items-end gap-y-2">
          <div class="flex">
            <button class="rounded-md px-3 py-1.5 text-blue-600 hover:text-blue-800 bg-transparent"
              @click="openEditDialog(address)">
              Cập Nhật
            </button>
            <button v-if="!address.is_primary && !address.is_pickup_address" @click="handleDeleteAddress(address.id)"
              class="rounded-md px-3 py-1.5 text-red-600 hover:text-red-800 bg-transparent">
              Xóa
            </button>
          </div>

          <Button label="Thiết lập mặc định" severity="secondary" class="rounded-sm" size="small" raised
            :disabled="address.is_primary" @click="handleChangePrimaryAddress(address.id)" />
        </div>
      </div>

      <!-- Chỉ thêm Divider nếu không phải địa chỉ cuối cùng -->
      <Divider v-if="index < addresses.length - 1" class="w-full" />
    </template>
  </div>

  <div v-else class="flex justify-center items-center h-40 text-gray-500">
    <p>Bạn chưa có địa chỉ nào.</p>
  </div>
</template>

<script setup lang="ts">
import AddressDialog from '@/components/account/AddressDialog.vue';
import axios from '@/config/axios';
import { useAuthStore } from '@/stores/auth';
import type { UserAddress } from '@/types/models';
import { formatLocation } from '@/utils/user';
import { Button, Divider, Tag } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const toast = useToast();
const authStore = useAuthStore();

const dialogMode = ref<'create' | 'update'>('create');

const addresses = ref<UserAddress[]>([]);
const addressDialogRef = ref();
const userHasNoAddresses = computed(() => addresses.value.length === 0);

const openCreateDialog = () => {
  dialogMode.value = 'create';
  addressDialogRef?.value.openDialog(null, 'create');
}

const openEditDialog = (address: UserAddress) => {
  dialogMode.value = 'update';
  addressDialogRef?.value.openDialog(address, 'update');
}

const fetchAddresses = async () => {
  try {
    const response = await axios.get<UserAddress[]>(`/users/${authStore.user?.id}/addresses`);
    addresses.value = response.data;
  } catch (err) {
    console.log('Error fetching addresses', err);
  }
};

const handleCreateNewAddress = async (data: UserAddress) => {
  try {
    await axios.post(`/users/${authStore.user?.id}/addresses`, data);
    addressDialogRef?.value.closeDialog();
    toast.add({ severity: 'success', summary: 'Đã thêm địa chỉ mới', group: 'tc', life: 3000 });
    fetchAddresses()
  } catch (err: any) {
    console.log("Error creating address", err);
  }
};

const handleUpdateAddress = async (address: UserAddress) => {
  try {
    await axios.put(`/users/${authStore.user?.id}/addresses/${address.id}`, address);
    addressDialogRef?.value.closeDialog();
    toast.add({ severity: 'success', summary: 'Đã cập nhật địa chỉ', group: 'tc', life: 3000 });
    fetchAddresses()
  } catch (err: any) {
    console.log("Error updating address", err);
  }
};

const handleChangePrimaryAddress = async (addressId: number) => {
  try {
    await axios.put(`/users/${authStore.user?.id}/addresses/${addressId}`, {
      is_primary: true
    });
    fetchAddresses();
  } catch (err: any) {
    console.log("Error changing primary address", err);
  }
};

const handleDeleteAddress = async (addressId: number) => {
  try {
    await axios.delete(`/users/${authStore.user?.id}/addresses/${addressId}`);
    fetchAddresses();
    toast.add({ severity: 'success', summary: 'Đã xóa địa chỉ', group: 'tc', life: 3000 });
  } catch (err: any) {
    console.log("Error deleting address", err);
  }
};

onMounted(fetchAddresses);
</script>
