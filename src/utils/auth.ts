import axios from '@/config/axios'
import { ACCESS_TOKEN_KEY } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/models'
import { useCookies } from '@vueuse/integrations/useCookies'

export async function verifyAccessToken(access_token: string) {
  const cookies = useCookies()
  const authStore = useAuthStore()

  try {
    authStore.setLoadingAuth(true)

    // Sleep for 1 second to show the loading spinner
    // await new Promise((resolve) => setTimeout(resolve, 500))

    // Make an API call to verify the token
    const response = await axios.post<User>('/tokens/verify', { access_token })

    // Token is valid, store the user data
    authStore.setAuth(response.data)

    return true
  } catch (error: any) {
    console.error('Token verification failed:', error)

    cookies.remove(ACCESS_TOKEN_KEY)
    authStore.clearAuth()
  } finally {
    authStore.setLoadingAuth(false)
  }
}
