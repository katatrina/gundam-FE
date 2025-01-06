<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="w-full">
    <header class="header">
      <div class="container mx-auto px-4 py-2">
        <nav class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <RouterLink to="/" class="flex items-center">
              <img src="https://images-na.ssl-images-amazon.com/images/I/61wswIFrQPL.jpg" alt="ComZone" class="h-8">
              <span class="ml-2 text-xl font-bold">Mecha World</span>
            </RouterLink>
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
            <RouterLink to="/login" class="hover:text-gray-600 font-medium">Đăng Nhập</RouterLink>
            <div class="h-full">
              <Divider layout="vertical" type="solid" class="ml-2 mr-4" />
            </div>
            <Button label="Đăng Ký" raised />
          </div>
        </nav>

        <!-- Navigation Links -->
        <nav class="mt-4">
          <ul class="flex space-x-8 font-semibold">
            <li>
              <RouterLink to="/" class=" hover:text-gray-600">TRANG CHỦ</RouterLink>
            </li>
            <li>
              <RouterLink to="/auctions" class="hover:text-gray-600">CÁC CUỘC ĐẤU GIÁ</RouterLink>
            </li>
            <li>
              <RouterLink to="/categories" class="hover:text-gray-600">TẤT CẢ THỂ LOẠI</RouterLink>
            </li>
            <li>
              <RouterLink to="/exchange" class="hover:text-gray-600">TRAO ĐỔI TRUYỆN</RouterLink>
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
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';

import { ref } from 'vue';

const q = ref('');

</script>
