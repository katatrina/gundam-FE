<!-- src/layouts/MinimalLayout.vue -->
<template>
  <!--  Main Content - NotFound -->
  <div class="flex flex-col items-center justify-center mt-24">
    <div class="text-center p-8 max-w-md bg-white rounded-lg shadow-lg">
      <i class="pi pi-exclamation-circle text-6xl text-amber-500 mb-4"></i>
      <h1 class="text-3xl font-bold text-gray-800 mb-4">Trang không tìm thấy</h1>
      <p class="text-gray-600 mb-6">Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <router-link
        to="/"
        style="padding: 12px 32px"
        class="inline-block mt-2 bg-emerald-500 text-white rounded-sm hover:bg-emerald-600 items-center"
      >
        <span>Quay lại trang chủ</span>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
