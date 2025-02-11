<!-- @/views/authenticated/CartView.vue -->
<template>
  <div class="">
    <div v-if="cartItemsCount" class="space-y-4">
      <!-- Header Section -->
      <div class="bg-white shadow-sm max-w-4xl mx-auto p-6 rounded-sm">
        <div class="grid grid-cols-8 gap-4">
          <div class="col-span-4 text-gray-700 font-medium">Sản Phẩm</div>
          <div class="col-span-2 text-center text-gray-700 font-medium">Số Tiền</div>
          <div class="col-span-2 text-center text-gray-700 font-medium">Thao Tác</div>
        </div>
      </div>

      <!-- Cart Items Section -->
      <div class="bg-white shadow-sm max-w-4xl mx-auto rounded-sm">
        <div class="divide-y divide-gray-200">
          <div v-for="item in cartItems" :key="item.cart_item_id" class="grid grid-cols-8 gap-4 p-6 items-center">
            <!-- Product Info -->
            <div class="col-span-4 flex space-x-4">
              <img :src="item.gundam_image_url" :alt="item.gundam_name"
                class="w-20 h-20 object-cover rounded-md border border-gray-200">
              <div class="flex flex-col justify-center">
                <h3 class="font-medium text-gray-800">{{ item.gundam_name }}</h3>
              </div>
            </div>

            <!-- Price -->
            <div class="col-span-2 text-center font-medium text-emerald-600">
              {{ item.gundam_price.toLocaleString() }}đ
            </div>

            <!-- Actions -->
            <div class="col-span-2 flex justify-center">
              <button @click="removeFromCart(item.cart_item_id)" type="button"
                class="px-4 py-2 text-red-500 hover:text-red-600 transition-colors flex items-center space-x-2">
                <i class="pi pi-trash"></i>
                <span>Xóa khỏi giỏ hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="bg-white rounded-sm shadow-sm max-w-4xl mx-auto p-6">
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium text-gray-700">Tổng tiền:</span>
          <span class="text-xl font-semibold text-emerald-600">
            {{ totalAmount.toLocaleString() }}đ
          </span>
        </div>
        <div class="mt-6 flex justify-end">
          <button type="button" class="px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600
                   transition-colors duration-200 flex items-center space-x-2">
            <i class="pi pi-check"></i>
            <span>Thanh Toán</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="flex flex-col items-center py-16 bg-white rounded-lg shadow-md">
      <i class="pi pi-shopping-cart text-6xl text-gray-300 mb-4"></i>
      <span class="text-lg font-medium text-gray-600">Giỏ hàng trống</span>
      <router-link to="/products" class="mt-6 px-6 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600
               transition-colors duration-200 flex items-center space-x-2">
        <i class="pi pi-arrow-left"></i>
        <span>Tiếp Tục Mua Sắm</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartItemsCount = computed(() => cartStore.cartItemsCount);
const totalAmount = computed(() => cartStore.totalPrice);

const removeFromCart = async (cart_item_id: string) => {
  cartStore.removeFromCart(cart_item_id);
};
</script>
