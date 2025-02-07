<template>
  <div class="container mx-auto px-4">
    <div class="bg-white shadow-lg p-4 md:p-6">
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
              {{ formatPrice(gundam?.price) }}
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
            <Button type="button" @click="addToCart" class="w-[240px] px-4  border-gray-300 bg-transparent text-emerald-500
           hover:border-emerald-500
           outline outline-1 outline-transparent
           hover:outline-emerald-500">
              <i class="pi pi-shopping-cart" />
              Thêm Vào Giỏ Hàng
            </Button>
            <Button type="button" @click="onBuyNow" class="w-[240px] px-4">
              <i class="pi pi-credit-card" />
              Mua Ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from '@/config/axios'
import type { GundamDetail } from '@/types/models'
import { formatPrice } from '@/utils/common'
import { GUNDAM_CONDITION_MAPPING } from '@/constants/gundam'
import { Button, Galleria, Divider } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import router from '@/router'

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

const basicInfo = computed(() => [
  {
    label: 'Loại',
    value: gundam.value.gundam_grade?.display_name
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
    loading.value = true
    const response = await axios.get<GundamDetail>(`/gundams/${props.slug}`)
    gundam.value = response.data
    console.log('Gundam:', gundam.value);

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

const onBuyNow = async () => {
  if (!gundam.value) return

  try {
    loading.value = true
    await axios.post('/cart/add', {
      gundam_id: gundam.value.id
    })
    // Redirect to cart page
    router.push('/cart')
  } catch (error) {
    console.error('Error adding to cart:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchGundamDetail)
</script>
