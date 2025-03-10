<template>
  <div>
    <div class="">
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
            <Button size="small" class="rounded-sm">+ THÊM MÔ HÌNH MỚI</Button>
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
              :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.images[0]}`"
              :alt="slotProps.data.image"
              class="rounded"
              style="width: 64px"
            />
          </template>
        </Column>
        <Column field="name" header="Tên" sortable style=""></Column>
        <Column field="grade" header="Phân Loại" sortable style=""></Column>
        <Column field="Scale" header="Tỉ Lệ" sortable style=""></Column>
        <Column field="manufacturer" header="Nhà Sản Xuất" sortable style=""></Column>
        <Column field="price" header="Giá" sortable style=""></Column>
        <Column field="status" header="Trạng Thái" sortable style=""></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/config/axios'
import type { Gundam } from '@/types/models'
import { FilterMatchMode } from '@primevue/core/api'
import { useAuthStore } from '@/stores/auth'
import { useCookies } from '@vueuse/integrations/useCookies.mjs'
import { Button, IconField, InputIcon, InputText } from 'primevue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { onMounted, ref } from 'vue'
import { ACCESS_TOKEN_KEY } from '@/constants'

const loading = ref(false)
const cookies = useCookies()
const authStore = useAuthStore()

const gundams = ref<Gundam[]>([])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

onMounted(async () => {
  try {
    const response = await axios.get<Gundam[]>(`sellers/${authStore.user?.id}/gundams`, {
      headers: { Authorization: `Bearer ${cookies.get(ACCESS_TOKEN_KEY)}` },
    })
    gundams.value = response.data
  } catch (error: any) {
    console.error('Error fetching gundams', error)
  }
})
</script>

<style scoped></style>
