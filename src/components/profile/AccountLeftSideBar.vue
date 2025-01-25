<template>
  <div>
    <ul>
      <li v-for="item in items" :key="item.label" class="p-2 hover:bg-gray-100 rounded-md">
        <RouterLink :to="item.to" class="flex items-center space-x-3 " exactActiveClass="font-medium text-emerald-500">
          <i :class="item.icon"></i>
          <span class="">{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const items = ref([
  { label: 'Tài Khoản', to: '/account/profile', icon: 'pi pi-user' },
  { label: 'Thông Báo', to: '/account/notifications', icon: 'pi pi-bell' },
]);
</script>

<style scoped></style>
