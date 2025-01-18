<template>
  <div class="relative select-none" v-on-click-outside="closeNotification">
    <!-- Notification Bell Icon with Badge -->
    <div v-tooltip.bottom="{
      value: 'Thông báo',
      pt: {
        root: ['text-sm']
      }
    }" class="cursor-pointer rounded-full hover:bg-gray-300 w-12 h-12 flex items-center justify-center"
      @click="onClickBellIcon">
      <OverlayBadge v-if="unreadCount" :value="unreadCount" severity="danger" size="small">
        <i class="pi pi-bell" style="font-size: 1.5rem"></i>
      </OverlayBadge>
      <i v-else class="pi pi-bell" style="font-size: 1.5rem"></i>
    </div>

    <!-- Notifications List -->
    <div v-if="isPopoverVisible"
      class="absolute bg-white shadow-lg rounded-lg  w-[330px] z-10 bottom-auto top-full -left-60 border-2 border-gray-200 ">

      <!-- Header -->
      <div class="flex justify-between items-center px-2 py-4 border-gray-200">
        <h3 class="text-lg font-bold">Thông báo</h3>
        <RouterLink to="#" class="text-base text-blue-500 hover:underline">
          Xem tất cả
        </RouterLink>
      </div>

      <!-- Notifications List  -->
      <div class="bg-white h-[445px] overflow-y-hidden rounded-lg">
        <div v-if="notifications.length > 0" class="bg-emerald-50">
          <div v-for="(notification, index) in notifications" :key="notification.id" :class="[
            'p-2 cursor-pointer hover:bg-gray-50',
            { 'border-b border-gray-200': index !== notifications.length - 1 }
          ]">
            <div class="flex items-start gap-3">
              <div class="flex-1">
                <p class="font-semibold">{{ notification.title }}</p>
                <p class="text-medium text-gray-600">{{ notification.message }}</p>
                <p class="text-sm text-gray-400 mt-1 break-words">
                  {{ formatTimestamp(notification.timestamp) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-4 select-text">
          Không có thông báo mới
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications';
import formatTimestamp from '@/utils/time';
import { vOnClickOutside } from '@vueuse/components';
import OverlayBadge from 'primevue/overlaybadge';

import { ref } from "vue";

const {
  notifications,
  unreadCount,
  // error,
  markAllAsRead
} = useNotifications();


const isPopoverVisible = ref(false);

// Handle click on bell icon to toggle the popover and mark notifications as read
const onClickBellIcon = async () => {
  isPopoverVisible.value = !isPopoverVisible.value;
  if (isPopoverVisible.value) {
    await markAllAsRead();
  }
};

function closeNotification() {
  isPopoverVisible.value = false;
}

</script>
