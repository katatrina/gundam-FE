import axios from 'axios'
import { useCookies } from '@vueuse/integrations/useCookies'
import { ACCESS_TOKEN_KEY } from '@/constants'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

const cookies = useCookies()

// Interceptor để chỉ thêm JWT cho API giỏ hàng
axiosInstance.interceptors.request.use((config) => {
  if (config.url?.startsWith('/cart')) {
    const access_token = cookies.get(ACCESS_TOKEN_KEY)
    config.headers.Authorization = `Bearer ${access_token}`
  }
  return config
})

export default axiosInstance
