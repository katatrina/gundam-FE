<template>
  <div>
    <!-- Search Box -->
    <div class="flex justify-end">
      <div class="w-2/5">
        <IconField class="">
          <InputIcon class="pi pi-search" />
          <InputText placeholder="Tìm kiếm theo tên gundam" v-model="q" class="w-full" />
        </IconField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconField, InputIcon, InputText } from 'primevue'
import { ref } from 'vue'

const q = ref('')
</script>

<style scoped></style>
