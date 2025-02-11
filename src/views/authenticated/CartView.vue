<!-- @/views/authenticated/CartView.vue -->
<template>
  <div class="">
    <div v-if="cartItemsCount" class="space-y-4">
      <!-- Header Section -->
      <div class="bg-white shadow-sm max-w-4xl mx-auto p-6 rounded-sm">
        <div class="grid grid-cols-12 gap-4 items-center">
          <div class="col-span-1 w-16">
            <!-- Top level select all (Header) -->
            <Checkbox v-model="selectAll" binary @update:modelValue="toggleSelectAll"
              class="flex items-center justify-center" />
          </div>
          <div class="col-span-5 text-gray-700 font-medium">Sản Phẩm</div>
          <div class="col-span-3 text-center text-gray-700 font-medium">Số Tiền</div>
          <div class="col-span-3 text-center text-gray-700 font-medium">Thao Tác</div>
        </div>
      </div>

      <!-- Cart Items Grouped by Seller -->
      <div v-for="(items, sellerId) in groupedCartItems" :key="sellerId"
        class="bg-white shadow-sm max-w-4xl mx-auto rounded-sm">
        <!-- Seller Information -->
        <div class="grid grid-cols-12 px-6 py-4 border-b border-gray-200 items-center">
          <div class="col-span-1 w-16">
            <!-- Seller level checkbox -->
            <Checkbox :modelValue="isSellerSelected(sellerId)" binary
              @update:modelValue="(value: boolean) => toggleSelectSeller(sellerId, value)"
              class="flex items-center justify-center" />
          </div>
          <div class="col-span-11 flex items-center space-x-3">
            <i class="pi pi-shop text-gray-600"></i>
            <span class="font-medium text-gray-800">{{ items[0].seller_name }}</span>
          </div>
        </div>

        <!-- Seller's Items -->
        <div class="divide-y divide-gray-200">
          <div v-for="item in items" :key="item.cart_item_id" class="grid grid-cols-12 px-6 py-4 items-center">
            <div class="col-span-1 w-16">
              <!-- Individual item checkbox -->
              <Checkbox v-model="selectedItems[item.cart_item_id]" binary @update:modelValue="updateSelections"
                class="flex items-center justify-center" />
            </div>
            <div class="col-span-5 flex space-x-4">
              <img :src="item.gundam_image_url" :alt="item.gundam_name" class="w-20 h-20 object-cover rounded-md">
              <div class="flex flex-col justify-center">
                <h3 class="font-medium text-gray-800">{{ item.gundam_name }}</h3>
              </div>
            </div>

            <div class="col-span-3 text-center font-medium text-emerald-600">
              {{ formatPrice(item.gundam_price) }}
            </div>

            <div class="col-span-3 flex justify-center">
              <button @click="removeFromCart(item.cart_item_id)" type="button"
                class="px-4 py-2 hover:text-emerald-600 flex items-center space-x-2">
                <span>Xóa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="bg-white rounded-sm shadow-sm max-w-4xl mx-auto p-6">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <div class="w-16">
              <Checkbox v-model="selectAll" binary @update:modelValue="toggleSelectAll"
                class="flex items-center justify-center" />
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-lg font-medium text-gray-700">
                Đã chọn ({{ selectedItemsCount }}) sản phẩm
              </span>
              <button @click="removeSelectedItems" :disabled="!hasSelectedItems" :class="[
                'px-4 py-2 rounded-sm text-gray-700 hover:text-red-600 disabled:text-gray-400 disabled:cursor-not-allowed',
                'flex items-center space-x-2'
              ]">
                <span>Xóa</span>
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-8">
            <div class="text-lg text-gray-700">
              Tổng thanh toán:
              <span class="text-xl font-semibold text-emerald-600 ml-2">
                {{ formatPrice(selectedTotalAmount) }}
              </span>
            </div>
            <button type="button" :disabled="!hasSelectedItems" :class="[
              'px-6 py-2.5 text-white rounded-sm flex items-center space-x-2',
              hasSelectedItems ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-400 cursor-not-allowed'
            ]">
              <span>Mua Hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty Cart -->
    <div v-else class="flex flex-col items-center py-16 bg-white rounded-sm shadow-md">
      <i class="pi pi-shopping-cart text-6xl text-gray-300 mb-4"></i>
      <span class="text-lg font-medium text-gray-600">Giỏ hàng trống</span>
      <router-link to="/products" style="padding: 12px 32px;" class="mt-6 bg-emerald-500 text-white rounded-sm hover:bg-emerald-600
   flex items-center space-x-2">
        <i class="pi pi-arrow-left"></i>
        <span>Tiếp Tục Mua Sắm</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { formatPrice } from '@/utils/common';
import axios from '@/config/axios';
import Checkbox from 'primevue/checkbox';

const cartStore = useCartStore();

const cartItems = computed(() => cartStore.cartItems);
const cartItemsCount = computed(() => cartStore.cartItemsCount);

// Selected items state
const selectedItems = ref<Record<string, boolean>>({});
const selectAll = ref(false);

// Count of selected items
const selectedItemsCount = computed(() => {
  return Object.values(selectedItems.value).filter(Boolean).length;
});

// Group cart items by seller id
const groupedCartItems = computed(() => {
  return cartItems.value.reduce((acc, item) => {
    if (!acc[item.seller_id]) {
      acc[item.seller_id] = [];
    }
    acc[item.seller_id].push(item);
    return acc;
  }, {} as Record<string, typeof cartItems.value>);
});

// Check if all items from a seller are selected
const isSellerSelected = (sellerId: string) => {
  const sellerItems = groupedCartItems.value[sellerId];
  return sellerItems.every(item => selectedItems.value[item.cart_item_id]);
};

// Calculate total amount of selected items
const selectedTotalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => {
    if (selectedItems.value[item.cart_item_id]) {
      return total + item.gundam_price;
    }
    return total;
  }, 0);
});

// Check if any items are selected
const hasSelectedItems = computed(() => {
  return Object.values(selectedItems.value).some(value => value);
});

// Toggle all items
const toggleSelectAll = (value: boolean) => {
  // No need to set selectAll.value since v-model handles it

  // Update all items directly
  Object.keys(selectedItems.value).forEach(itemId => {
    selectedItems.value[itemId] = value;
  });
};

// Toggle all items from a seller
const toggleSelectSeller = (sellerId: string, value: boolean) => {
  const sellerItems = groupedCartItems.value[sellerId];
  sellerItems.forEach(item => {
    selectedItems.value[item.cart_item_id] = value;
  });
  updateSelections();
};

// Update selections (called when individual items are toggled)
const updateSelections = () => {
  // Check if all items are selected
  const allSelected = cartItems.value.length > 0 &&
    cartItems.value.every(item => selectedItems.value[item.cart_item_id]);

  // Update selectAll state
  selectAll.value = allSelected;
};

// Watch for changes in cartItems to initialize selectedItems
watch(cartItems, (newItems) => {
  // Initialize new items with false
  newItems.forEach(item => {
    if (!(item.cart_item_id in selectedItems.value)) {
      selectedItems.value[item.cart_item_id] = false;
    }
  });
  // Clean up removed items
  Object.keys(selectedItems.value).forEach(id => {
    if (!newItems.some(item => item.cart_item_id === id)) {
      delete selectedItems.value[id];
    }
  });
}, { immediate: true });

const removeFromCart = async (cart_item_id: string) => {
  try {
    const response = await axios.delete(`/cart/items/${cart_item_id}`);
    console.log("Đã xóa sản phẩm khỏi giỏ hàng:", response.data);
    cartStore.removeFromCart(cart_item_id);
    // Remove the item from selected items if it was selected
    delete selectedItems.value[cart_item_id];
    // Update selections after removal
    updateSelections();
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
  }
};

const removeSelectedItems = async () => {
  try {
    // Get all selected item IDs
    const selectedItemIds = Object.entries(selectedItems.value)
      .filter(([, isSelected]) => isSelected)
      .map(([id]) => id);

    if (selectedItemIds.length === 0) return;

    // Call API to delete all selected items
    const response = await axios.delete('/cart/items/batch', {
      data: { itemIds: selectedItemIds }
    });

    console.log("Đã xóa các sản phẩm đã chọn:", response.data);

    // Remove items from cart store
    selectedItemIds.forEach(id => {
      cartStore.removeFromCart(id);
      delete selectedItems.value[id];
    });

    // Update selections after removal
    updateSelections();
  } catch (error) {
    console.error("Lỗi khi xóa các sản phẩm đã chọn:", error);
  }
};
</script>
