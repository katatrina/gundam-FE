<template>
  <div>
    <div class="container mx-auto">
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
            <div v-for="gundam in gundams" :key="gundam.id"
              class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <!-- <img :src="gundam.image" :alt="gundam.name" class="w-full h-48 object-cover" /> -->
              <div class="p-4">
                <h3 class="text-lg font-semibold mb-2">{{ gundam.name }}</h3>
                <p class="text-gray-600 mb-2">{{ gundam.description }}</p>
                <div class="flex justify-between items-center">
                  <span class="text-lg font-bold text-blue-600">${{ gundam.price }}</span>
                  <Button icon="pi pi-shopping-cart" class="p-button-rounded p-button-outlined" />
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
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Gundam, GundamGrade } from '@/types/models'
import axios from '@/config/axios'
import { RadioButton, Button, Divider } from 'primevue'

const currentRoute = useRoute()
const router = useRouter()

const gundamGrades = ref<GundamGrade[]>([])
const gundams = ref<Gundam[]>([])

const selectedGradeSlug = ref<string | null>(null)

const toggleGrade = (gradeSlug: string) => {
  // If the clicked grade is already selected, deselect it
  if (selectedGradeSlug.value === gradeSlug) {
    selectedGradeSlug.value = null
  } else {
    selectedGradeSlug.value = gradeSlug
  }

  updateQueryFilters()
}

// Update the URL query parameters based on the selected filters
const updateQueryFilters = () => {
  const query = {
    ...currentRoute.query, // Preserve other existing query parameters
    grade: selectedGradeSlug.value
  }

  // Only update route, let "watcher" handle the data fetching
  router.push({ query: query })
}

// Watch for changes in the URL query parameter 'grade' (triggered by router.push() or browser navigation)
// This watcher ensures the component stays synchronized with the URL and handles navigation properly
watch(
  // First argument: Reactive source to watch - monitors the 'grade' query parameter in the URL
  () => currentRoute.query.grade,

  // Second argument: Callback function that executes when the watched value changes
  // newGradeSlug: The new value of the grade parameter from the URL
  (newGradeSlug) => {
    // Check if there's a valid grade parameter in the URL
    if (newGradeSlug && newGradeSlug !== '') {
      // Update the local state to reflect the URL parameter
      selectedGradeSlug.value = newGradeSlug as string

      // Fetch Gundam models filtered by the selected grade
      fetchGundams(newGradeSlug as string)
      return
    }

    // If no grade parameter exists or it's empty:
    // Reset the selected grade to null
    selectedGradeSlug.value = null
    // Fetch all Gundam models without grade filtering
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

/**
 * Fetches Gundam models from the API with optional grade filtering
 * @param gradeSlug - Optional parameter for filtering Gundams by grade (e.g., 'hg', 'mg', 'rg')
 */
const fetchGundams = async (gradeSlug?: string) => {
  try {
    // Build query parameters object for axios request
    // If gradeSlug exists and isn't empty, include it in params
    // Otherwise use empty object to fetch all Gundams without filtering
    const params = gradeSlug && gradeSlug !== '' ? { grade: gradeSlug } : {}

    // Make GET request to the API with optional filter parameters
    // Generic type Gundam[] ensures type safety for the response data
    const response = await axios.get<Gundam[]>('/gundams', { params })

    // Update the reactive ref with the fetched data
    // This will trigger a re-render of components using this data
    gundams.value = response.data

  } catch (err) {
    // Log any errors that occur during the fetch operation
    // In a production app, you might want to handle this error more gracefully
    console.error('Error fetching gundams:', err)
  }
}

// This hook runs once when the component is first mounted to the DOM
// Triggered by a full page refresh or typing the URL directly in the browser and press Enter
onMounted(() => {
  // First, fetch all available Gundam grades for the filter sidebar
  fetchGundamGrades()

  // Get the 'grade' parameter from current URL if it exists
  const currentGradeSlug = currentRoute.query.grade as string

  // Check if there's a valid grade parameter in the URL
  if (currentGradeSlug && currentGradeSlug !== '') {
    // If grade parameter exists, fetch Gundams filtered by this grade
    fetchGundams(currentGradeSlug)
  } else {
    // If no grade parameter in URL, fetch all Gundams without filtering
    // This ensures we always have initial data to display
    fetchGundams()
  }
})
</script>

<style scoped></style>
