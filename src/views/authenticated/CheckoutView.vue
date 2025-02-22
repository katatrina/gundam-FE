<template>
  <!-- Container with padding and max width -->
  <div>
    <!-- Two sections using flex -->
    <div class="flex flex-col md:flex-row gap-4">
      <!-- Section 1: Shipping Info - 70% width -->
      <div class="md:w-[70%] bg-white rounded-sm shadow-sm px-6 py-4">
        <!-- Header with flex layout -->
        <div class="flex justify-between items-center mb-3">
          <div class="flex items-center text-emerald-600">
            <i class="pi pi-map-marker mr-2"></i>
            <h2 class="text-lg font-semibold ">
              Địa Chỉ Nhận Hàng
            </h2>
          </div>
          <button v-if="selectedAddress" class="flex items-center cursor-pointer text-blue-500 whitespace-nowrap"
            @click="listAddressesDialogRef?.openDialog()">
            <i class="pi pi-pencil mr-2"></i>
            <div>Thay Đổi</div>
          </button>

          <button v-else class="flex items-center cursor-pointer text-blue-500 whitespace-nowrap"
            @click="addNewAddressDialogRef?.openDialog()">
            <i class="pi pi-pencil mr-2"></i>
            <span>Thêm Địa Chỉ Giao Hàng</span>
          </button>
        </div>

        <AddressDialog ref="addNewAddressDialogRef" :force-primary-address="userHasNoAddresses"
          @create-new-address="handleCreateNewAddress" mode="create" />
        <ListAddressesDialog ref="listAddressesDialogRef" @changeAddress="handleChangeAddress"
          :selectedAddress="selectedAddress" />

        <div v-if="userAddresses.length > 0">
          <!-- Thông tin của địa chỉ mặc định -->
          <div v-if="selectedAddress" class="flex items-center gap-5">
            <div class="font-semibold flex flex-row gap-2">
              <span>{{ selectedAddress.full_name }}</span>
              <span>{{ selectedAddress.phone_number }}</span>
            </div>
            <span>{{ formatFullLocation(selectedAddress) }}
              <Tag v-if="selectedAddress.is_primary" value="Mặc định" severity="info" class="ml-2" />
            </span>
          </div>
        </div>
        <span v-else class="text-red-500 text-sm">Vui lòng thêm địa chỉ giao hàng</span>
      </div>

      <!-- Section 2: Order Info - 30% width -->
      <div class="md:w-[30%] bg-white p-4 rounded-sm shadow-sm">
        <h2 class="text-2xl font-bold mb-6">ĐƠN HÀNG</h2>
        <!-- Content goes here -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AddressDialog from '@/components/account/AddressDialog.vue';
import ListAddressesDialog from '@/components/account/ListAddressesDialog.vue';
import axios from '@/config/axios';
import { useAuthStore } from '@/stores/auth';
import type { UserAddress } from '@/types/models';
import type { AddressRequest } from '@/types/request';
import { formatFullLocation } from '@/utils/user';
import { Tag } from 'primevue';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref } from 'vue';

const authStore = useAuthStore();
const toast = useToast();

// refs
const userAddresses = ref<UserAddress[]>([]);
const selectedAddress = ref<UserAddress | null>(null);
const addNewAddressDialogRef = ref();
const listAddressesDialogRef = ref();
const userHasNoAddresses = computed(() => userAddresses.value.length === 0)

const handleCreateNewAddress = async (data: AddressRequest) => {
  try {
    await axios.post(`/users/${authStore.user?.id}/addresses`, data);
    addNewAddressDialogRef?.value.closeDialog();
    fetchUserAddresses()
    toast.add({ severity: 'success', summary: 'Đã thêm địa chỉ mới', group: 'tc', life: 3000 });
  } catch (err: any) {
    console.log("Error creating address", err);
  }
};

const handleChangeAddress = (address: UserAddress) => {
  // Update the selected address
  selectedAddress.value = address;
};

async function fetchUserAddresses() {
  try {
    // Fetch user addresses
    const response = await axios.get<UserAddress[]>(`/users/${authStore.user?.id}/addresses`);
    userAddresses.value = response.data;
    selectedAddress.value = userAddresses.value.find((address) => address.is_primary) ?? null;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  fetchUserAddresses();
});
</script>

<style scoped></style>
