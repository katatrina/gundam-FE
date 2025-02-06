<template>
  <div class="container mx-auto px-4">
    <div class="bg-white shadow-lg p-4 md:p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
        <!-- Gallery Section - Left side -->
        <div
          class="[&_.p-galleria]:border-0 [&_.p-galleria-thumbnail-wrapper]:bg-transparent [&_.p-galleria-thumbnail-container]:bg-transparent [&_.p-galleria-item-wrapper]:bg-transparent [&_.p-galleria]:rounded-none [&_.p-galleria-items-container]:ml-0 md:[&_.p-galleria-items-container]:ml-4 [&_.p-galleria-item]:!h-[300px] md:[&_.p-galleria-item]:!h-[450px] [&_.p-galleria-item-container]:!h-[300px] md:[&_.p-galleria-item-container]:!h-[450px] [&_.p-galleria-thumbnails]:justify-center md:[&_.p-galleria-thumbnails]:justify-start">
          <Galleria v-model:activeIndex="activeIndex" :value="images" :responsiveOptions="responsiveOptions"
            :numVisible="images.length" :showThumbnailNavigators="false" :showIndicators="false"
            :thumbnailsPosition="thumbnailPosition" class="max-h-[300px] md:max-h-[450px]"
            :verticalThumbnailViewPortHeight="isMobile ? '100px' : '450px'">
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
          <!-- Basic Info -->
          <div class="space-y-2">
            <h1 class="text-xl md:text-2xl font-bold text-gray-900">{{ gundam.name }}</h1>
            <p class="text-2xl md:text-3xl font-bold text-blue-600">
              {{ formatPrice(gundam?.price) }}
            </p>
          </div>

          <!-- Product Description -->
          <div class="prose prose-sm max-w-none border-t pt-4 md:pt-6">
            <h3 class="text-base md:text-lg font-medium text-gray-900">Mô tả sản phẩm</h3>
            <p>{{ gundam.description }}</p>
          </div>

          <!-- Add to Cart Button -->
          <Button @click="addToCart" :loading="loading" class="w-full">
            <i class="pi pi-shopping-cart mr-2" />
            Thêm vào giỏ hàng
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/config/axios'
import type { GundamDetail } from '@/types/models'
import { formatPrice } from '@/utils/common'
import { Button, Galleria } from 'primevue'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

// State
const gundam = ref<GundamDetail>({} as GundamDetail)
const loading = ref(false)
const images = ref<Array<{ itemImageSrc: string, thumbnailImageSrc: string, alt: string }>>([])
const activeIndex = ref(0)
const thumbnailPosition = ref<'bottom' | 'top' | 'left' | 'right'>('left')

// Computed
const isMobile = computed(() => window.innerWidth < 768)

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

// Update thumbnail position on window resize
const updateLayout = () => {
  thumbnailPosition.value = window.innerWidth < 575 ? 'bottom' : 'left'
}

// Watch for window resize
onMounted(() => {
  window.addEventListener('resize', updateLayout)
  updateLayout() // Initial check
})

const getImageIndex = (item: any) => images.value.findIndex(img => img === item)

const onThumbnailHover = (_event: MouseEvent, slotProps: any) => {
  activeIndex.value = getImageIndex(slotProps.item)
}

// Methods
const fetchGundamDetail = async () => {
  try {
    loading.value = true
    const response = await axios.get<GundamDetail>(`/gundams/${props.slug}`)
    gundam.value = response.data

    images.value = gundam.value.images.map(img => ({
      itemImageSrc: img.url,
      thumbnailImageSrc: img.url,
      alt: gundam.value?.name || 'Gundam image'
    }))
  } catch (error) {
    console.error('Error fetching gundam details:', error)
  } finally {
    loading.value = false
  }
}

const addToCart = async () => {
  if (!gundam.value) return

  try {
    loading.value = true
    await axios.post('/cart/add', {
      gundam_id: gundam.value.id
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(fetchGundamDetail)
</script>
