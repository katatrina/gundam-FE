import type { CartItem } from '@/types/models'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Danh sách sản phẩm trong giỏ hàng
  const cartItems = ref<CartItem[]>([])

  // Số lượng sản phẩm trong giỏ hàng
  const cartItemsCount = computed(() => cartItems.value.length)

  // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
  const isInCart = (gundam_id: number) =>
    cartItems.value.some((item) => item.gundam_id === gundam_id)

  // Thêm sản phẩm vào giỏ hàng (chỉ thêm nếu chưa có)
  const addToCart = (item: CartItem) => {
    if (!isInCart(item.gundam_id)) {
      cartItems.value.push(item)
    }
  }

  // Xóa sản phẩm khỏi giỏ hàng theo `cart_item_id`
  const removeFromCart = (cart_item_id: string) => {
    cartItems.value = cartItems.value.filter((item) => item.cart_item_id !== cart_item_id)
  }

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    cartItems.value = []
  }

  return {
    cartItems,
    cartItemsCount,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
  }
})
