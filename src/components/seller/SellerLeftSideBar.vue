<template>
  <div>
    <ul>
      <li v-for="item in items" :key="item.label" class="hover:bg-gray-100 rounded-md flex">
        <RouterLink
          :to="item.to"
          class="flex items-center space-x-3 h-12 w-full"
          exactActiveClass="font-medium text-emerald-500"
        >
          <i class="ml-2" :class="item.icon"></i>
          <span class="ml-2">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  { label: 'Quản Lý Shop', to: '/seller/dashboard', icon: 'pi pi-shop' },
  { label: 'Quản Lý Gundam', to: '/seller/gundam/list', icon: 'pi pi-prime' },
  { label: 'Quản Lý Đơn Hàng', to: '/seller/sale/order', icon: 'pi pi-box' },
])
</script>

<style scoped></style>
