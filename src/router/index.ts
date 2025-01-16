import MainLayout from '@/layouts/MainLayout.vue'
import AuctionView from '@/views/AuctionView.vue'
import CategoriesView from '@/views/CategoriesView.vue'
import ExchangeView from '@/views/ExchangeView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AccountLayout from '@/layouts/AccountLayout.vue'
import AccountProfileView from '@/views/AccountProfileView.vue'
import AccountNotificationsView from '@/views/AccountNotificationsView.vue'

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
      {
        path: 'account',
        component: AccountLayout,
        redirect: { name: 'account-profile' },
        children: [
          {
            path: 'profile',
            name: 'account-profile',
            component: AccountProfileView,
          },
          {
            path: 'notifications',
            name: 'account-notifications',
            component: AccountNotificationsView,
          },
        ],
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'home' })
  } else next()
})

export default router
