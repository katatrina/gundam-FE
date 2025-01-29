<template>
  <div>
    <ul>
      <li v-for="item in items" :key="item.label" class="hover:bg-gray-100 rounded-md flex">
        <RouterLink :to="item.to" class="flex items-center space-x-3 h-12 w-full"
          exactActiveClass="font-medium text-emerald-500">
          <i class="ml-2" :class="item.icon"></i>
          <span class="ml-2">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  { label: 'Hồ Sơ', to: '/account/profile', icon: 'pi pi-user' },
  { label: 'Địa Chỉ', to: '/account/address', icon: 'pi pi-address-book' },
  { label: 'Đơn Mua', to: '/account/orders/purchase', icon: 'pi pi-clipboard' },
]);
</script>

<style scoped></style>
