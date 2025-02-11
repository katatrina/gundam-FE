<template>
  <!-- Cart Icon -->
  <div v-tooltip.bottom="{
    value: 'Giỏ hàng',
    pt: {
      root: ['text-sm']
    }
  }" class="cursor-pointer rounded-full relative hover:bg-gray-300 w-12 h-12 flex items-center justify-center">

    <OverlayBadge v-if="cartStore.cartItemsCount" :value="cartStore.cartItemsCount" severity="danger" size="small">
      <i class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
    </OverlayBadge>

    <i v-else class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
  </div>
</template>

<script setup lang="ts">
import OverlayBadge from 'primevue/overlaybadge';
import { onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import axios from '@/config/axios';
import type { CartItem } from '@/types/models';

const cartStore = useCartStore();

// Gọi API riêng để lấy giỏ hàng và cập nhật cartStore
const fetchCartItems = async () => {
  try {
    const response = await axios.get<CartItem[]>("/cart/items");
    cartStore.cartItems = response.data; // Cập nhật cartStore sau khi API thành công
    console.log("Giỏ hàng:", cartStore.cartItems);
  } catch (error) {
    console.error("Lỗi khi tải giỏ hàng:", error);
  }
};

onMounted(() => {
  fetchCartItems(); // Gọi API khi component được mount
});
</script>

<style scoped></style>
