<!-- src/layouts/MainLayout.vue -->
<template>
  <div class="w-full">
    <header>
      <div class="mx-auto py-2 px-24">
        <!-- Main Header -->
        <nav class="flex items-center h-16 gap-4">
          <!-- Logo -->
          <div class="order-1 flex-none">
            <AppLogo />
          </div>

          <!-- Search Bar -->
          <div class="flex-initial order-2 w-2/4">
            <IconField class="flex-initial">
              <InputIcon class="pi pi-search" />
              <InputText placeholder="Bạn đang tìm kiếm mô hình gì?" v-model="q" class="w-full" />
            </IconField>
          </div>

          <!-- Flex Spacer -->
          <div class="flex-auto order-3">
          </div>

          <!-- Show a loading spinner when loading -->
          <div v-if="isLoadingAuth" class="flex items-center h-10 order-last">
            <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="8" fill="transparent"
              animationDuration="0.5s" aria-label="Custom ProgressSpinner" />
          </div>

          <!-- Show user avatar, notification, and cart when authenticated -->
          <div v-else-if="isAuthenticated" class="flex items-center h-10 space-x-16 ml-5 order-last">
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
            <NotificationBell />

            <!-- Avatar Dropdown Menu -->
            <AvatarDropdownMenu />
          </div>

          <!-- Show login and register buttons when not authenticated -->
          <div v-else class="flex items-center h-10 order-last">
            <RouterLink to="/login" class="hover:text-gray-600 font-medium text-emerald-500">Đăng Nhập</RouterLink>
            <div class="h-full">
              <Divider layout="vertical" type="solid" class="ml-2 mr-4" />
            </div>
            <Button label="Đăng Ký" raised />
          </div>
        </nav>

        <!-- Navigation Bar -->
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
    <main class="mx-auto py-8 px-24">
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
import NotificationBell from '@/components/NotificationBell.vue';

const authStore = useAuthStore();
const { isAuthenticated, isLoadingAuth } = storeToRefs(authStore);

console.log("isAuthenticated in MainLayout", isAuthenticated.value);

const q = ref('');

const cartItemsCount = ref(0);

const links = ref([
  { name: 'TRANG CHỦ', path: '/' },
  { name: 'CÁC CUỘC ĐẤU GIÁ', path: '/auctions' },
  { name: 'TẤT CẢ THỂ LOẠI', path: '/categories' },
  { name: 'TRAO ĐỔI GUNDAM', path: '/exchange' },
])

</script>

<style scoped></style>
