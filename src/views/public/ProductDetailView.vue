<template>
  <!-- Product Detail View -->
  <div class="container mx-auto px-4">
    <div class="bg-white shadow-sm p-4 md:p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6">
        <!-- Gallery Section - Left side -->
        <div
          class="[&_.p-galleria]:border-0 [&_.p-galleria-thumbnail-wrapper]:bg-transparent [&_.p-galleria-thumbnail-container]:bg-transparent [&_.p-galleria-item-wrapper]:bg-transparent [&_.p-galleria]:rounded-none [&_.p-galleria-items-container]:ml-0 md:[&_.p-galleria-items-container]:ml-4 [&_.p-galleria-item]:!h-[300px] md:[&_.p-galleria-item]:!h-[450px] [&_.p-galleria-item-container]:!h-[300px] md:[&_.p-galleria-item-container]:!h-[450px] [&_.p-galleria-thumbnails]:justify-center md:[&_.p-galleria-thumbnails]:justify-start">
          <Galleria v-model:activeIndex="activeIndex" :value="images" :responsiveOptions="responsiveOptions"
            :numVisible="images.length" :showThumbnailNavigators="false" :showIndicators="false"
            :thumbnailsPosition="thumbnailPosition" class="max-h-[300px] md:max-h-[450px]"
            :verticalThumbnailViewPortHeight="'450px'">
            <template #item="slotProps">
              <div class="h-full flex items-center justify-center">
                <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt"
                  class="max-h-full max-w-full object-contain" />
              </div>
            </template>
            <template #thumbnail="slotProps">
              <div @mouseenter="onThumbnailHover($event, slotProps)" class=" justify-center cursor-pointer">
                <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt"
                  class="w-16 h-16 md:w-20 md:h-20 object-contain border-2 border-transparent transition-colors hover:border-emerald-600"
                  :class="{ 'border-emerald-600': activeIndex === getImageIndex(slotProps.item) }" />
              </div>
            </template>
          </Galleria>
        </div>

        <!-- Product Info - Right side -->
        <div class="space-y-4 md:space-y-6">
          <div class="space-y-2">
            <h1 class="text-2xl font-bold text-gray-900">{{ gundam.name }}</h1>
            <p class="text-2xl font-medium text-emerald-600">
              {{ formatPrice(gundam.price) }}
            </p>
          </div>

          <Divider />

          <!-- Basic information -->
          <div class="space-y-4">
            <div v-for="(item, index) in basicInfo" :key="index" class="relative pl-32">
              <div class="absolute left-0 text-gray-500 text-sm font-medium">{{ item.label }}</div>
              <div class="text-gray-900 text-sm flex items-center gap-2">
                {{ item.value }}
                <!-- Add icon and tooltip only if description exists -->
                <template v-if="item.description">
                  <i class="pi pi-info-circle text-gray-400" v-tooltip.right="{
                    value: `<ul class='list-disc pl-4 my-0'>${item.description.map(desc => `<li class='py-0'>${desc}</li>`).join('')}</ul>`,
                    pt: {
                      root: {
                        style: { 'max-width': '500px' }
                      }
                    },
                    escape: false,
                  }" /></template>
              </div>
            </div>
          </div>

          <!-- Add to Cart and Buy Now Buttons -->
          <div class="flex space-x-4 w-full">
            <button type="button" @click="addToCart" class="w-[240px] px-4  border-2  rounded-md bg-transparent text-emerald-500
           hover:border-emerald-500" :disabled="disableAddToCart" :class="{ 'cursor-not-allowed': disableAddToCart }">
              <i :class="disableAddToCart ? 'pi pi-check' : 'pi pi-shopping-cart'"></i>
              {{ disableAddToCart ? 'Đã Thêm Vào Giỏ Hàng' : 'Thêm Vào Giỏ Hàng' }}
            </button>
            <Button type="button" @click="onBuyNow" class="w-[240px] px-4">
              <i class="pi pi-credit-card" />
              Mua Ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Seller Info -->
  <div class="container mx-auto px-4 mt-4">
    <div class="bg-white shadow p-6">
      <!-- Shop Header and Metrics Container -->
      <div class="flex">
        <!-- Left Section: Avatar and Shop Info -->
        <div class="flex items-start gap-4">
          <!-- Shop Avatar -->
          <img :src="seller?.avatar_url ?? undefined" :alt="seller?.full_name"
            class="w-[88px] h-[88px] object-cover rounded-full" />

          <!-- Shop Info - Set height to match avatar -->
          <div class="h-[88px] flex flex-col justify-between">
            <!-- Shop Name -->
            <h2 class="text-lg">{{ seller?.full_name }}</h2>

            <!-- Online Status -->
            <span class="text-gray-500 text-sm -mt-2">Online 69 Phút Trước</span>

            <!-- Chat Button - More compact -->
            <Button type="button" severity="success" variant="outlined" class="px-6 w-fit rounded-sm" size="small"
              icon="pi pi-comments" label="Chat Ngay" />
          </div>
        </div>

        <!-- Divider -->
        <Divider layout="vertical" />

        <!-- Metrics Layout -->
        <div class="flex-1 flex items-center">
          <div class="max-w-md">
            <div class="flex flex-col space-y-4">
              <div class="flex items-baseline justify-between gap-4">
                <label class="text-gray-500 text-sm font-medium w-24 text-left">Đánh Giá</label>
                <span class="text-emerald-600 text-sm w-32 text-right">69%</span>
              </div>
              <div class="flex items-baseline justify-between gap-4">
                <label class="text-gray-500 text-sm font-medium w-24 text-left">Tham Gia</label>
                <span class="text-emerald-600 text-sm w-32 text-right">{{ sellerJoinedAt }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/config/axios'
import { GUNDAM_CONDITION_MAPPING } from '@/constants/gundam'
import type { CartItem, Gundam, User } from '@/types/models'
import { formatPrice } from '@/utils/common'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Button, Divider, Galleria } from 'primevue'
import { useToast } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart';

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()
const toast = useToast();

// State
const gundam = ref<Gundam>({} as Gundam)
const seller = ref<User>({} as User)
const sellerJoinedAt = computed(() => {
  try {
    if (!seller.value?.created_at) return ''

    // Ensure we have a valid date string before parsing
    const date = new Date(seller.value.created_at)
    if (isNaN(date.getTime())) return ''

    return formatDistanceToNow(date, {
      locale: vi,
      addSuffix: true
    })
  } catch (error) {
    console.error('Error formatting seller join date:', error)
    return ''
  }
})
const images = ref<Array<{ itemImageSrc: string, thumbnailImageSrc: string, alt: string }>>([])
const activeIndex = ref(0)
const thumbnailPosition = ref<'bottom' | 'top' | 'left' | 'right'>('left')
// disableAddToCart computed property to disable add to cart button if this gundam is already in cart
const disableAddToCart = computed(() => cartStore.isInCart(gundam.value.id))

const basicInfo = computed(() => [
  {
    label: 'Loại',
    value: gundam.value.grade
  },
  {
    label: 'Tỷ Lệ',
    value: gundam.value.scale
  },
  {
    label: 'Nhà Sản Xuất',
    value: gundam.value.manufacturer
  },
  {
    label: 'Tình Trạng',
    value: gundam.value.condition ? GUNDAM_CONDITION_MAPPING[gundam.value.condition].label : '',
    description: gundam.value.condition ? GUNDAM_CONDITION_MAPPING[gundam.value.condition].description : []
  }
])

// Responsive options for Galleria
const responsiveOptions = ref([
  {
    breakpoint: '1300px',
    numVisible: 4
  },
  {
    breakpoint: '768px',
    numVisible: 3,
  },
  {
    breakpoint: '575px',
    numVisible: 3,
    thumbnailsPosition: 'bottom'
  }
])

const getImageIndex = (item: any) => images.value.findIndex(img => img === item)

const onThumbnailHover = (_event: MouseEvent, slotProps: any) => {
  activeIndex.value = getImageIndex(slotProps.item)
}

// Methods
const fetchGundamDetail = async () => {
  try {

    const response = await axios.get<Gundam>(`/gundams/${props.slug}`)
    gundam.value = response.data

    // Only proceed with images if gundam.value.images exists
    if (gundam.value.image_urls) {
      images.value = gundam.value.image_urls.map((val: string) => ({
        itemImageSrc: val,
        thumbnailImageSrc: val,
        alt: gundam.value?.name || 'Gundam image'
      }))
    } else {
      console.warn('No images found in gundam data');
    }
  } catch (error) {
    console.error('Error fetching gundam details:', error)
  }
}

const fetchSellerDetails = async () => {
  try {
    const response = await axios.get<User>(`/sellers/${gundam.value.owner_id}`)
    seller.value = response.data
  } catch (error) {
    console.error('Error fetching seller details:', error)
  }
}

const addToCart = async () => {
  if (!authStore.isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return router.push({ name: 'login', query: { redirect: route.fullPath } })
  }

  try {
    const response = await axios.post<CartItem>('/cart/items', {
      gundam_id: gundam.value.id
    })
    cartStore.addToCart(response.data)
    toast.add({
      severity: 'success',
      summary: 'Sản phẩm đã được thêm vào Giỏ Hàng',
      life: 3000,
      group: 'tc'
    })

    console.log('Added to cart:', response.data)
  } catch (error) {
    console.error('Error adding to cart:', error)
  }
}

const onBuyNow = async () => {
  // Implement buy now functionality
}

onMounted(async () => {
  await fetchGundamDetail()

  // Fetch seller details
  await fetchSellerDetails()
});
</script>
