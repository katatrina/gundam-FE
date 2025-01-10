<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="w-full">
    <header>
      <div class="mx-auto container py-2">
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

          <!-- Show a loading spinner when loading -->
          <div v-if="loadingAuth" class="flex items-center h-10">
            <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="8" fill="transparent"
              animationDuration="0.5s" aria-label="Custom ProgressSpinner" />
          </div>

          <!-- Show user avatar, notification, and cart when authenticated -->
          <div v-else-if="isAuthenticated" class="flex items-center h-10 space-x-16 ml-5">
            <!-- Cart Icon -->
            <div v-tooltip.bottom="{
              value: 'Giỏ hàng',
              pt: {
                root: [
                  'text-sm',
                ]
              }
            }" class=" cursor-pointer rounded-full relative hover:bg-gray-300 w-14 h-14 flex items-center
              justify-center">
              <OverlayBadge v-if="cartItemsCount" :value="cartItemsCount" severity="danger" size="small">
                <i class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
              </OverlayBadge>
              <i v-else class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
            </div>

            <!-- Notification Icon -->
            <div v-tooltip.bottom="{
              value: 'Thông báo',
              pt: {
                root: [
                  'text-sm',
                ]
              }
            }"
              class="cursor-pointer rounded-full relative hover:bg-gray-300 w-12 h-12 flex items-center justify-center">
              <OverlayBadge v-if="notificationsCount" :value="notificationsCount" severity="danger" size="small">
                <i class="pi pi-bell" style="font-size: 1.5rem"></i>
              </OverlayBadge>
              <i v-else class="pi pi-bell" style="font-size: 1.5rem"></i>
            </div>

            <!-- Avatar Dropdown Menu -->
            <AvatarDropdownMenu />
          </div>

          <!-- Show login and register buttons when not authenticated -->
          <div v-else class="flex items-center h-10">
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

    <!--  Main Content -->
    <main class="container mx-auto px-4 py-8">
      <RouterView />
    </main>
  </div>
  <AppFooter />
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import ProgressSpinner from 'primevue/progressspinner';

import AppFooter from '@/components/AppFooter.vue';
import AppLogo from '@/components/AppLogo.vue';
import AvatarDropdownMenu from '@/components/AvatarDropdownMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import OverlayBadge from 'primevue/overlaybadge';
import { ref } from 'vue';

const authStore = useAuthStore();
const { isAuthenticated, loadingAuth } = storeToRefs(authStore);

const q = ref('');

const cartItemsCount = ref(0);
const notificationsCount = ref(1);

const links = ref([
  { name: 'TRANG CHỦ', path: '/' },
  { name: 'CÁC CUỘC ĐẤU GIÁ', path: '/auctions' },
  { name: 'TẤT CẢ THỂ LOẠI', path: '/categories' },
  { name: 'TRAO ĐỔI GUNDAM', path: '/exchange' },
])

</script>
