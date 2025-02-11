<template>
  <div>
    <div class="">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left Section - Filter Side Bar -->
        <div class="w-full md:w-1/4">
          <div class="mb-6">
            <h3 class="text-base font-medium mb-3">Thể Loại</h3>
            <div v-for="grade in gundamGrades" :key="grade.id" class="mb-2">
              <div @click="toggleGrade(grade.slug)" class="flex items-center cursor-pointer"
                :id="'grade-' + grade.slug">
                <RadioButton v-model="selectedGradeSlug" :value="grade.slug" name="grade" />
                <label :for="'grade-' + grade.slug" class="ml-2 cursor-pointer select-none">
                  {{ grade.display_name }}
                </label>
              </div>
            </div>
            <Divider />
          </div>
        </div>

        <!-- Right Section - Product List -->
        <div class="w-full md:w-3/4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Gundam Cards -->
            <div v-for="gundam in gundams" :key="gundam.id" class="bg-white rounded-sm overflow-hidden cursor-pointer flex flex-col
             border border-transparent
             transform transition-all ease-in-out
             hover:-translate-y-0.5 hover:shadow-xl hover:border-emerald-500"
              @click="navigateToProductDetail(gundam.slug)">
              <img :src="gundam.image_urls[0]" :alt="gundam.name" class="w-full h-48 object-cover" />
              <div class="p-4 flex flex-col flex-1">
                <h3 class="text-medium font-medium mb-2 line-clamp-2 min-h-[3.5rem]">
                  {{ gundam.name }}
                </h3>
                <div class="flex justify-between items-center mt-auto">
                  <span class="text-medium text-emerald-600">{{ formatPrice(gundam.price) }}</span>
                </div>
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
import type { Gundam, GundamGrade } from '@/types/models'
import { formatPrice } from '@/utils/common'
// import { getGundamPrimaryImage } from '@/utils/image'
import { Divider, RadioButton } from 'primevue'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const currentRoute = useRoute()
const router = useRouter()

const gundamGrades = ref<GundamGrade[]>([])
const gundams = ref<Gundam[]>([])
const selectedGradeSlug = ref<string | null>(null)

const toggleGrade = (gradeSlug: string) => {
  if (selectedGradeSlug.value === gradeSlug) {
    selectedGradeSlug.value = null
  } else {
    selectedGradeSlug.value = gradeSlug
  }

  updateQueryFilters()
}

const updateQueryFilters = () => {
  const query = { ...currentRoute.query }

  if (selectedGradeSlug.value) {
    query.grade = selectedGradeSlug.value
  } else {
    delete query.grade
  }

  router.push({ query })
}


// Watch selectedGradeSlug for data fetching
watch(
  selectedGradeSlug,
  () => {
    fetchGundams()
  }
)

const fetchGundamGrades = async () => {
  try {
    const response = await axios.get<GundamGrade[]>("/grades")
    gundamGrades.value = response.data
  } catch (err) {
    console.error('Error fetching grades:', err)
  }
}

const navigateToProductDetail = (slug: string) => {
  try {
    router.push({ name: 'product-detail', params: { slug } })
  } catch (error) {
    console.log('Error navigating to product detail:', error);
  }
}

const fetchGundams = async () => {
  try {
    // Always use selectedGradeSlug for filtering
    const params = selectedGradeSlug.value ? { grade: selectedGradeSlug.value } : {}
    const response = await axios.get<Gundam[]>('/gundams', { params })
    console.log('response', response.data);

    // Check if response.data.gundams exists
    if (response.data) {
      gundams.value = response.data
    } else {
      console.error('Unexpected API response structure:', response.data)
    }

  } catch (err) {
    console.error('Error fetching gundams:', err)
  }
}

onMounted(() => {
  fetchGundamGrades()
  // Set initial selectedGradeSlug from URL
  // Initial data fetch will be triggered by the watch on selectedGradeSlug
  selectedGradeSlug.value = (currentRoute.query.grade as string) || null

  // Fetch gundams on initial load
  fetchGundams()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
}
</style>
