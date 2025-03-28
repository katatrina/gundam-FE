import db from '@/config/firebase'
import { useAuthStore } from '@/stores/auth'
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
  writeBatch,
} from 'firebase/firestore'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  read: boolean
  created_at: Timestamp
}

export function useNotifications(maxNotifications = 5) {
  const authStore = useAuthStore()
  const toast = useToast()
  const userID = authStore.user?.id

  const notifications = ref<Notification[]>([])
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const isInitialLoad = ref(true)

  const unreadCount = computed(() =>
    notifications.value.reduce((count, notification) => (notification.read ? count : count + 1), 0),
  )

  const setupNotificationsListener = () => {
    if (!userID) return null

    isLoading.value = true

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('user_id', '==', userID),
      orderBy('created_at', 'desc'),
      limit(maxNotifications),
    )

    return onSnapshot(
      notificationsQuery,
      (snapshot) => {
        notifications.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notification[]

        isLoading.value = false

        // Only show toast for new notifications after initial load
        if (!isInitialLoad.value) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added' && !change.doc.metadata.hasPendingWrites) {
              const newNotification = change.doc.data() as Notification
              toast.add({
                severity: 'info',
                summary: newNotification.title,
                detail: newNotification.message,
                life: 15000,
                group: 'tr',
              })
            }
          })
        }

        // Set initial load to false after first snapshot
        isInitialLoad.value = false
      },
      (err) => {
        console.error('Error in notifications listener:', err)
        error.value = err
        isLoading.value = false
      },
    )
  }

  const markAllAsRead = async () => {
    if (!userID) return

    const unreadNotifications = notifications.value.filter((n) => !n.read)
    if (unreadNotifications.length === 0) return

    const batch = writeBatch(db)

    try {
      unreadNotifications.forEach((notification) => {
        const notificationRef = doc(db, 'notifications', notification.id)
        batch.update(notificationRef, { read: true })
      })

      await batch.commit()
    } catch (err) {
      console.error('Error marking notifications as read:', err)
      error.value = err as Error
      throw err
    }
  }

  onMounted(() => {
    const unsubscribe = setupNotificationsListener()
    if (unsubscribe) {
      onUnmounted(unsubscribe)
    }
  })

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAllAsRead,
  }
}
