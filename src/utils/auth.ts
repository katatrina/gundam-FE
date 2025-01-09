import { useCookies } from '@vueuse/integrations/useCookies'
import { useAuthStore } from '@/stores/auth'
import axios from '@/config/axios'
import type { User } from '@/types/models'

export async function verifyAccessToken() {
  const cookies = useCookies()
  const authStore = useAuthStore()

  try {
    authStore.setLoadingAuth(true)

    // Sleep for 1 second to show the loading spinner
    // await new Promise((resolve) => setTimeout(resolve, 500))

    // Get the token from cookies
    const token: string = cookies.get('access_token')

    if (!token) {
      authStore.clearUser()
      return
    }

    // Make an API call to verify the token
    const response = await axios.post<User>('/tokens/verify', { access_token: token })

    // Token is valid, you can store user data if needed
    authStore.setUser(response.data)
  } catch (error: any) {
    console.error('Token verification failed:', error)

    cookies.remove('access_token')
    authStore.clearUser()
  } finally {
    authStore.setLoadingAuth(false)
  }
}
