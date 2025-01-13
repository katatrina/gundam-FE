// main.ts
import 'primeicons/primeicons.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useCookies } from '@vueuse/integrations/useCookies'

import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'

import App from '@/App.vue'
import router from '@/router'
import { verifyAccessToken } from '@/utils/auth'
import { ACCESS_TOKEN_KEY } from '@/constants'

const boot = async () => {
  const app = createApp(App)
  const pinia = createPinia()

  // Configure PrimeVue
  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        cssLayer: {
          name: 'primevue',
          order: 'tailwind-base, primevue, tailwind-utilities',
        },
      },
    },
  })

  app.use(ToastService)
  app.directive('tooltip', Tooltip)

  // Install Pinia first
  app.use(pinia)

  // Verify token on initial load
  const cookies = useCookies()
  const access_token = cookies.get(ACCESS_TOKEN_KEY)
  if (access_token) {
    await verifyAccessToken(access_token)
  }

  // Install router after auth check
  app.use(router)

  // Mount app
  app.mount('#app')
}

// Start the application
boot().catch((error) => {
  console.error('Failed to boot application:', error)
  // You might want to show a fatal error UI here
})
