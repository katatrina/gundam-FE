import 'primeicons/primeicons.css'
import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice';

import App from './App.vue'
import router from './router'

const app = createApp(App)
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
app.use(ToastService);

app.use(createPinia())
app.use(router)

app.mount('#app')
