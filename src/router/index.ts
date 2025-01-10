import MainLayout from '@/layouts/MainLayout.vue'
import AuctionView from '@/views/AuctionView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
      },
      {
        path: 'auctions',
        name: 'auctions',
        component: AuctionView,
      },
      {
        path: 'categories',
        name: 'categories',
        component: CategoriesView,
      },
      {
        path: 'exchange',
        name: 'exchange',
        component: ExchangeView,
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach(async (to, from, next) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const authStore = useAuthStore()
  const { isAuthenticated } = storeToRefs(authStore)

  if (isAuthenticated.value === false && ['login'].includes(to.name as string)) {
    next({ name: 'home' })
  } else next()
})

export default router
