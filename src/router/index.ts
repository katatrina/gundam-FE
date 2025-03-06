import { MemberRole, SellerRole } from '@/constants/roles'
import AccountLayout from '@/layouts/AccountLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import MinimalLayout from '@/layouts/MinimalLayout.vue'
import SellerLayout from '@/layouts/SellerLayout.vue'
import { useAuthStore } from '@/stores/auth'
import AccountAddressesView from '@/views/authenticated/AccountAddressView.vue'
import AccountProfileView from '@/views/authenticated/AccountProfileView.vue'
import PurchaseOrdersView from '@/views/authenticated/AccountPurchaseOrdersView.vue'
import BecomeSellerView from '@/views/authenticated/BecomeSellerView.vue'
import CartView from '@/views/authenticated/CartView.vue'
import CheckoutView from '@/views/authenticated/CheckoutView.vue'
import LoginView from '@/views/authentication/LoginView.vue'
import AuctionView from '@/views/public/AuctionView.vue'
import ExchangeView from '@/views/public/ExchangeView.vue'
import HomeView from '@/views/public/HomeView.vue'
import NotFoundView from '@/views/public/NotFoundView.vue'
import ProductDetailView from '@/views/public/ProductDetailView.vue'
import ProductsListView from '@/views/public/ProductsListView.vue'
import SellerDashboardView from '@/views/seller/SellerDashboardView.vue'
import SellerGundamsManagementView from '@/views/seller/SellerGundamsManagementView.vue'
import SellerSaleOrdersManagementView from '@/views/seller/SellerSaleOrdersManagementView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login', // Đặt các routes cụ thể lên trước
    name: 'login',
    component: LoginView,
  },
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
        path: '/checkout',
        name: 'checkout',
        component: CheckoutView,
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
      {
        path: 'seller',
        component: SellerLayout,
        redirect: { name: 'seller-dashboard' },
        children: [
          {
            path: 'dashboard',
            name: 'seller-dashboard',
            component: SellerDashboardView,
          },
          {
            path: 'gundam/list',
            name: 'seller-gundams',
            component: SellerGundamsManagementView,
            meta: { requiresSellerRole: true },
          },
          {
            path: 'sale/order',
            name: 'seller-sale-orders',
            component: SellerSaleOrdersManagementView,
          },
        ],
      },
    ],
  },
  {
    path: '/become-seller',
    name: 'become-seller',
    component: BecomeSellerView,
    meta: {
      requiresAuth: true,
      requiresMemberRole: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    component: MinimalLayout,
    redirect: { name: 'not-found' },
    children: [
      {
        path: '',
        name: 'not-found',
        component: NotFoundView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()

  if (to.name === 'login' && authStore.isAuthenticated) {
    // Authenticated user trying to access login page
    next({ name: 'home' })
  } else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Unauthenticated user trying to access protected route
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.requiresMemberRole && authStore.user?.role !== MemberRole) {
    // Kiểm tra nếu route chỉ yêu cầu role member
    next({ name: 'not-found' })
  } else if (to.meta.requiresSellerRole && authStore.user?.role !== SellerRole) {
    // Kiểm tra nếu route chỉ yêu cầu role seller
    next({ name: 'not-found' })
  } else next()
})

export default router
