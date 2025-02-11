import MainLayout from '@/layouts/MainLayout.vue'
import AuctionView from '@/views/public/AuctionView.vue'
import ProductsListView from '@/views/public/ProductsListView.vue'
import ExchangeView from '@/views/public/ExchangeView.vue'
import HomeView from '@/views/public/HomeView.vue'
import LoginView from '@/views/authentication/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AccountLayout from '@/layouts/AccountLayout.vue'
import AccountProfileView from '@/views/authenticated/AccountProfileView.vue'
import AccountAddressesView from '@/views/authenticated/AccountAddressView.vue'
import PurchaseOrdersView from '@/views/authenticated/AccountPurchaseOrdersView.vue'
import ProductDetailView from '@/views/public/ProductDetailView.vue'
import CartView from '@/views/authenticated/CartView.vue'

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
        path: 'products',
        name: 'products',
        component: ProductsListView,
      },
      {
        path: 'product/:slug',
        name: 'product-detail',
        component: ProductDetailView,
        props: true,
      },
      {
        path: 'exchange',
        name: 'exchange',
        component: ExchangeView,
      },
      {
        path: 'cart',
        name: 'cart',
        component: CartView,
        meta: { requiresAuth: true },
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
            meta: { requiresAuth: true },
          },
          {
            path: 'address',
            name: 'account-address',
            component: AccountAddressesView,
            meta: { requiresAuth: true },
          },
          {
            path: 'orders/purchase',
            name: 'account-orders-purchase',
            component: PurchaseOrdersView,
            meta: { requiresAuth: true },
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
    // Authenticated user trying to access login page
    next({ name: 'home' })
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Unauthenticated user trying to access protected route
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else next()
})

export default router
