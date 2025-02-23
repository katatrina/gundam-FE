<template>
  <div class="relative inline-block">
    <div class="flex flex-col items-end " @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
      <!-- Avatar -->
      <div class="cursor-pointer hover:bg-gray-100 p-2">
        <img v-if="user?.avatar_url" :src="user.avatar_url" alt="avatar" class="w-12 h-12 rounded-full"
          referrerpolicy="no-referrer" />
        <img v-else src="@/assets/images/default-avatar.png" alt="avatar" class="w-12 h-12" />
      </div>

      <!-- Invisible bridge -->
      <div class="absolute h-2 w-full bottom-0 transform translate-y-full"></div>

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div v-if="showDropdown"
          class="absolute top-full mt-1 right-2 w-48 bg-white rounded-md shadow-lg ring-2 ring-black ring-opacity-10 z-50">
          <ul class="">
            <!-- Tách riêng item đầu tiên với style đặc biệt -->
            <li
              class="rounded-t-md px-4 py-3 hover:bg-emerald-100 cursor-pointer text-emerald-600 font-medium text-sm flex items-center gap-2 border-b border-gray-100"
              @click="handleItemClick(menuItems[0])">
              <i :class="menuItems[0].icon"></i>
              {{ menuItems[0].label }}
            </li>
            <!-- Các items còn lại giữ nguyên style -->
            <li v-for="item in menuItems.slice(1)" :key="item.label"
              :class="{ 'rounded-b-md': item === menuItems[menuItems.length - 1] }"
              class="px-4 py-2 hover:bg-emerald-200 cursor-pointer text-gray-700 text-sm flex items-center gap-2"
              @click="handleItemClick(item)">
              <i :class="item.icon"></i>
              {{ item.label }}
            </li>
          </ul>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ACCESS_TOKEN_KEY } from '@/constants';
import { useAuthStore } from '@/stores/auth';
import { useCookies } from '@vueuse/integrations/useCookies';
import { storeToRefs } from 'pinia';
import { useToast } from 'primevue/usetoast';
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const showDropdown = ref(false);
const authStore = useAuthStore();
const cookies = useCookies();
const toast = useToast();

const { user } = storeToRefs(authStore);

const menuItems = ref([
  { label: "Trở Thành Người Bán", path: "/become-seller", icon: "pi pi-user-plus" },
  { label: "Tài Khoản", path: "/account/profile", icon: "pi pi-user" },
  { label: "Đơn Mua", path: "/account/orders/purchase", icon: "pi pi-clipboard" },
  { label: "Đăng Xuất", path: "/logout", icon: "pi pi-sign-out" },
]);

const currentRoute = useRoute();
const router = useRouter();

const navigateTo = (path: any) => {
  router.push(path);
};

// Handle item click (including logout)
const handleItemClick = (item: { label: string, path: string }) => {
  if (item.label === "Đăng Xuất") {
    // Sleep for 500ms to show loading spinner
    setTimeout(() => {
      authStore.clearAuth();

      cookies.remove(ACCESS_TOKEN_KEY, {
        path: "/",
      });

      // Redirect to login page if the current route requires authentication
      if (currentRoute.meta.requiresAuth) {
        router.push("/login");
      }

      toast.add({ severity: 'success', summary: 'Đăng xuất thành công', life: 3000, group: 'br' });
    }, 500);
  } else {
    navigateTo(item.path);
  }
};

</script>

<style></style>
