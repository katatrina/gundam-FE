<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="w-full">
    <header class="">
      <div class="container mx-auto px-4 py-2">
        <nav class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <AppLogo />
          </div>

          <!-- Search Bar -->
          <div class="flex-1 mx-8">
            <div class="relative w-full">
              <IconField class="w-full">
                <InputIcon class="pi pi-search" />
                <InputText placeholder="Bạn đang tìm kiếm mô hình gì?" v-model="q" class="w-full" />
              </IconField>
            </div>
          </div>

          <!-- Auth Links -->
          <div class="flex items-center h-10">
            <RouterLink to="/login" class="hover:text-gray-600 font-medium text-emerald-500">Đăng Nhập</RouterLink>
            <div class="h-full">
              <Divider layout="vertical" type="solid" class="ml-2 mr-4" />
            </div>
            <Button label="Đăng Ký" raised />
          </div>
        </nav>

        <!-- Navigation Links -->
        <nav class="mt-4">
          <ul class="flex space-x-8 font-normal text-gray-500">
            <li v-for="link in links" :key="link.name">
              <RouterLink :to="link.path" class=" hover:text-emerald-500" activeClass="font-semibold text-emerald-500"
                exactActiveClass="font-semibold text-emerald-500">{{ link.name }}</RouterLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <Divider layout="horizontal" type="solid" class="mt-0" />

    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';

import { ref } from 'vue';
import AppFooter from '@/components/AppFooter.vue';
import AppLogo from '@/components/AppLogo.vue';

const q = ref('');

const links = ref([
  { name: 'TRANG CHỦ', path: '/' },
  { name: 'CÁC CUỘC ĐẤU GIÁ', path: '/auctions' },
  { name: 'TẤT CẢ THỂ LOẠI', path: '/categories' },
  { name: 'TRAO ĐỔI GUNDAM', path: '/exchange' },
])

</script>
