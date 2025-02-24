<!-- src/layouts/MinimalLayout.vue -->
<template>
  <div class="w-full">
    <header class="bg-white shadow-sm">
      <div class="mx-auto py-2 px-4">
        <!-- Minimal Header -->
        <nav class="flex items-center h-16">
          <!-- Logo and Title in one container -->
          <div class="flex items-center">
            <!-- Logo -->
            <RouterLink to="/" class="flex items-center focus:outline-none">
              <img src="/web-icon.png" alt="Mecha World" class="h-10 w-10">
              <span class="ml-1 mr-4 text-xl font-medium text-emerald-500">Mecha World</span>
            </RouterLink>
            <!-- Page Title -->
            <span class="text-2xl">Đăng ký trở thành Người bán</span>
          </div>

          <!-- Flex Spacer -->
          <div class="flex-auto"></div>

          <!-- Auth Section -->
          <div class="flex items-center">
            <!-- Show a loading spinner when loading -->
            <div v-if="isLoadingAuth">
              <ProgressSpinner style="width: 30px; height: 30px" strokeWidth="8" fill="transparent"
                animationDuration="0.5s" aria-label="Custom ProgressSpinner" />
            </div>

            <!-- Show only avatar dropdown when authenticated -->
            <div v-else-if="isAuthenticated">
              <AvatarDropdownMenu />
            </div>

            <!-- Show login and register buttons when not authenticated -->
            <div v-else class="flex items-center">
              <RouterLink to="/login" class="hover:text-gray-600 font-medium text-emerald-500">
                Đăng Nhập
              </RouterLink>
              <Divider layout="vertical" type="solid" class="mx-4 h-full" />
              <Button label="Đăng Ký" raised />
            </div>
          </div>
        </nav>
      </div>
    </header>

    <Divider layout="horizontal" type="solid" class="mt-0" />

    <!--  Main Content -->
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';

import AvatarDropdownMenu from '@/components/common/AvatarDropdownMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAuthenticated, isLoadingAuth } = storeToRefs(authStore);
</script>

<style scoped></style>
