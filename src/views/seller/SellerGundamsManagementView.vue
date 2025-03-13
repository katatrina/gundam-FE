<template>
  <div v-if="mode === 'list'">
    <DataTable
      :value="gundams"
      v-model:filters="filters"
      :globalFilterFields="['name']"
      :loading="loading"
      paginator
      removableSort
      :rows="5"
      tableStyle="min-width: 50rem"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between">
          <IconField class="w-2/5">
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Tìm kiếm theo tên mô hình"
              class="w-full"
            />
          </IconField>
          <Button size="small" class="rounded-sm" @click="mode = 'create'"
            ><i class="pi pi-plus"></i> THÊM MÔ HÌNH MỚI</Button
          >
        </div>
      </template>
      <template #empty>Không tìm thấy mô hình tương ứng.</template>
      <template #loading>Đang tải dữ liệu. Vui lòng chờ.</template>
      <template #paginatorstart>
        <Button type="button" icon="pi pi-refresh" text />
      </template>
      <template #paginatorend>
        <Button type="button" icon="pi pi-download" text />
      </template>
      <Column header="Ảnh">
        <template #body="slotProps">
          <img
            :src="slotProps.data.image_urls[0] || 'https://via.placeholder.com/64'"
            :alt="slotProps.data.image"
            class="rounded"
            style="width: 64px"
          />
        </template>
      </Column>
      <Column field="name" header="Tên mô hình" sortable style="">
        <template #body="slotProps">
          <div class="flex items -center">
            <span class="font-medium">{{ slotProps.data.name }}</span>
          </div>
        </template>
      </Column>
      <Column field="grade" header="Phân Loại" sortable style=""></Column>
      <Column field="scale" header="Tỉ Lệ" sortable style=""></Column>
      <Column field="manufacturer" header="Nhà Sản Xuất" sortable style=""></Column>
      <Column field="price" header="Giá" sortable style="">
        <template #body="slotProps">
          <span>{{ formatPrice(slotProps.data.price) }}</span>
        </template>
      </Column>
      <Column field="status" header="Trạng Thái" sortable>
        <template #body="slotProps">
          <div v-if="slotProps.data.status === 'available'" class="flex flex-col gap-2">
            <Button
              class="w-4/5 rounded-sm"
              size="small"
              severity="info"
              raised
              @click="handleSell(slotProps.data)"
              >Bán</Button
            >
            <Button
              class="w-4/5 rounded-sm"
              size="small"
              severity="warn"
              raised
              @click="handleAuction(slotProps.data)"
              >Đấu giá</Button
            >
          </div>
          <span
            v-else
            :class="{
              'text-green-500': slotProps.data.status === 'available',
              'text-yellow-500': slotProps.data.status === 'selling',
              'text-orange-500': slotProps.data.status === 'pending auction approval',
              'text-blue-500': slotProps.data.status === 'ongoing auction',
            }"
          >
            {{ getStatusText(slotProps.data.status) }}
          </span>
        </template>
      </Column>
    </DataTable>
  </div>
  <div v-else-if="mode === 'create'">
    <div class="py-4 p px-2">
      <div class="flex items-center w-full">
        <button @click="mode = 'list'" class="flex items-center hover:text-gray-500">
          <i class="pi pi-arrow-left mr-4" style="font-size: 1.25rem"></i>
        </button>
        <span class="text-xl font-bold">THÊM MÔ HÌNH MỚI</span>
      </div>
    </div>
    <SellerCreateGundamForm @addedSuccessfully="handleAddedSuccessfully" />
  </div>
</template>

<script setup lang="ts">
import SellerCreateGundamForm from '@/components/seller/SellerCreateGundamForm.vue'
import axios from '@/config/axios'
import { ACCESS_TOKEN_KEY } from '@/constants'
import { GundamStatuses } from '@/constants/gundam'
import { useAuthStore } from '@/stores/auth'
import { useSubscriptionStore } from '@/stores/subscription'
import type { Gundam } from '@/types/models'
import { formatPrice } from '@/utils/common'
import { FilterMatchMode } from '@primevue/core/api'
import { useCookies } from '@vueuse/integrations/useCookies.mjs'
import { Button, IconField, InputIcon, InputText, useToast } from 'primevue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { onMounted, ref } from 'vue'

const loading = ref(false)
const cookies = useCookies()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const toast = useToast()
const mode = ref('list')

const getStatusText = (value: string) => {
  return GundamStatuses.find((status) => status.value === value)?.label
}

const gundams = ref<Gundam[]>([])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

function handleAddedSuccessfully() {
  mode.value = 'list'
  fetchGundams()
}

async function fetchGundams() {
  try {
    const response = await axios.get<Gundam[]>(`sellers/${authStore.user?.id}/gundams`, {
      headers: { Authorization: `Bearer ${cookies.get(ACCESS_TOKEN_KEY)}` },
    })
    gundams.value = response.data
  } catch (error: any) {
    console.error('Error fetching gundams', error)
  }
}

const handleSell = async (data: any) => {
  try {
    await axios.patch(`sellers/${authStore.user?.id}/gundams/${data.id}/sell`, null, {
      headers: { Authorization: `Bearer ${cookies.get(ACCESS_TOKEN_KEY)}` },
    })

    subscriptionStore.increaseListingsUsed(1)

    toast.add({
      severity: 'success',
      summary: `Mô hình ${data.name} đã được đăng bán.`,
      group: 'tc',
      life: 3000,
    })

    fetchGundams()
  } catch (error) {
    console.error('Error selling gundam', error)
  }
}

const handleAuction = (data: any) => {
  // Logic đấu giá sản phẩm
  console.log('Đấu giá sản phẩm', data)
}

onMounted(async () => {
  loading.value = true
  await fetchGundams()
  loading.value = false
})
</script>

<style scoped></style>
