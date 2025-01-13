<template>
  <div class="relative"> <!-- Add a container with relative positioning -->
    <!-- Notification Bell Icon with Badge -->
    <div v-tooltip.bottom="{
      value: 'Thông báo',
      pt: {
        root: [
          'text-sm',
        ]
      }
    }" class="cursor-pointer rounded-full hover:bg-gray-300 w-12 h-12 flex items-center justify-center"
      @click="onClickBellIcon">
      <OverlayBadge v-if="unreadCount" :value="unreadCount" severity="danger" size="small">
        <i class="pi pi-bell" style="font-size: 1.5rem"></i>
      </OverlayBadge>
      <i v-else class="pi pi-bell" style="font-size: 1.5rem"></i>
    </div>

    <!-- Notifications List -->
    <Popover ref="popover">
      <div class="w-[300px]">
        <!-- Header -->
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-semibold">Thông báo</h3>
          <RouterLink to="#" class="text-sm text-blue-500 hover:underline">Xem tất cả</RouterLink>
        </div>

        <!-- Notifications List -->
        <ScrollPanel style="width: 100%; height: 400px">
          <div v-if="notifications.length > 0" class="bg-emerald-50">
            <div v-for="notification in notifications" :key="notification.id"
              class="p-2 border-b last:border-b-0 cursor-pointer hover:bg-gray-50">
              <div class="flex items-start gap-3">
                <div class="flex-1">
                  <p class="font-medium">{{ notification.title }}</p>
                  <p class="text-sm text-gray-600">{{ notification.message }}</p>
                  <p class="text-xs text-gray-400 mt-1 break-words">
                    {{ formatTimestamp(notification.timestamp) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-gray-500 py-4">
            Không có thông báo mới
          </div>
        </ScrollPanel>
      </div>
    </Popover>
  </div>
</template>

<style scoped lang="scss">
.my-popover {
  .p-popover {
    // margin-top: 0.5rem;
    // min-width: 350px;

    // Adjust arrow position
    // &:before,
    // &:after {
    //   right: auto !important;
    //   left: 1rem !important;
    // }
  }
}
</style>

<script setup lang="ts">
import db from '@/config/firebase';
import { useAuthStore } from '@/stores/auth';
import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, Timestamp, where, writeBatch } from "firebase/firestore";
import OverlayBadge from 'primevue/overlaybadge';
import Popover from 'primevue/popover';
import ScrollPanel from 'primevue/scrollpanel';
// import Panel from 'primevue/panel';
import formatTimestamp from '@/utils/time';
import { useToast } from 'primevue/usetoast';

import { computed, onMounted, onUnmounted, ref } from "vue";

interface Notification {
  id: string;
  userID: string;
  title: string;
  message: string;
  timestamp: Timestamp;
  read: boolean;
}

const authStore = useAuthStore();
const toast = useToast();
const userID = authStore.user?.id

const popover = ref();
const notifications = ref<Notification[]>([]);

// Computed for unread count (optimized)
const unreadCount = computed(() => notifications.value.filter(notification => !notification.read).length);

// Fetch notifications from Firestore (optimize by letting snapshot handle fetching)
const fetchNotifications = async () => {
  try {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userID', '==', String(userID)),
      orderBy('timestamp', 'desc'),
      limit(5) // Limit to 5 latest notifications
    );
    const snapshot = await getDocs(notificationsQuery);

    notifications.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Notification[];
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
};



// Mark all notifications as read in Firestore (only if there are unread ones)
const markAllAsRead = async () => {
  const unreadNotifications = notifications.value.filter(notification => !notification.read);

  if (unreadNotifications.length === 0) return; // Skip batch update if no unread notifications

  try {
    const batch = writeBatch(db);
    unreadNotifications.forEach(notification => {
      const notificationRef = doc(db, 'notifications', notification.id);
      batch.update(notificationRef, { read: true });
    });

    await batch.commit(); // Commit the batch update

    // Update the local state to reflect the change
    unreadNotifications.forEach(notification => {
      notification.read = true;
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
  }
};

// Handle click on bell icon to toggle the popover and mark notifications as read
const onClickBellIcon = async (event: any) => {
  popover.value.toggle(event);
  await markAllAsRead(); // Mark all notifications as read
}

// Real-time listener for new notifications
const listenForNewNotifications = () => {
  let isInitialSnapshot = true;

  try {
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userID", "==", String(userID)),
      orderBy("timestamp", "desc"),
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      if (isInitialSnapshot) {
        isInitialSnapshot = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newNotification = change.doc.data() as Notification;
          console.log("New notification:", newNotification);

          // Toast the new added notification
          toast.add({
            severity: "info",
            summary: newNotification.title,
            detail: newNotification.message,
            life: 10000,
          });

          // Add the new notification to the local state
          notifications.value.unshift({
            ...newNotification,
            id: change.doc.id,
          });
        }
      });
    });

    onUnmounted(() => {
      unsubscribe();
    });
  } catch (error) {
    console.error("Error listening for new notifications:", error);
  }
};

// Initialize on component mount (removes fetchNotifications if real-time is enough)
onMounted(() => {
  fetchNotifications(); // Fetch notifications from Firestore
  listenForNewNotifications();  // Listening for notifications via real-time updates
});
</script>
