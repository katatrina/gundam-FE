<template>
  <div class="relative inline-block">
    <div class="flex flex-col items-end " @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
      <!-- Avatar -->
      <div class="cursor-pointer hover:bg-gray-100 p-2">
        <Avatar icon="pi pi-user" size="large" shape="circle" />
      </div>

      <!-- Invisible bridge -->
      <div class="absolute h-2 w-full bottom-0 transform translate-y-full"></div>

      <!-- Dropdown Menu -->
      <transition name="fade">
        <div v-if="showDropdown"
          class="absolute top-full mt-1 right-2 w-48 bg-white rounded-md shadow-lg ring-2 ring-black ring-opacity-20 z-50">
          <!-- Added top-full to position it below the avatar -->
          <ul class="py-2">
            <li v-for="item in menuItems" :key="item.label"
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
import Avatar from 'primevue/avatar';
import { useToast } from 'primevue/usetoast';
import { ref } from "vue";
import { useRouter } from "vue-router";

const showDropdown = ref(false);
const authStore = useAuthStore();
const cookies = useCookies();
const toast = useToast();

const menuItems = ref([
  { label: "Profile", path: "/profile", icon: "pi pi-user" },
  { label: "Settings", path: "/settings", icon: "pi pi-cog" },
  { label: "Log Out", path: "/logout", icon: "pi pi-sign-out" },
]);

const router = useRouter();

const navigateTo = (path: any) => {
  router.push(path);
};

// Handle item click (including logout)
const handleItemClick = (item: { label: string, path: string }) => {
  if (item.label === "Log Out") {
    // Sleep for 500ms to show loading spinner
    setTimeout(() => {
      authStore.clearAuth();
      cookies.remove(ACCESS_TOKEN_KEY);
      toast.add({ severity: 'success', summary: 'Đăng xuất thành công', life: 3000, group: 'br' });
    }, 500);

  } else {
    navigateTo(item.path);
  }
};

</script>

<style>
/* Add fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
