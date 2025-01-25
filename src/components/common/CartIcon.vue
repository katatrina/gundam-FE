<template>
  <!-- Cart Icon -->
  <div v-tooltip.bottom="{
    value: 'Giỏ hàng',
    pt: {
      root: [
        'text-sm',
      ]
    }
  }" class=" cursor-pointer rounded-full relative hover:bg-gray-300 w-12 h-12 flex items-center
              justify-center">
    <OverlayBadge v-if="cartItemsCount" :value="cartItemsCount" severity="danger" size="small">
      <i class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
    </OverlayBadge>
    <i v-else class="pi pi-shopping-cart" style="font-size: 1.5rem"></i>
  </div>
</template>

<script setup lang="ts">
import OverlayBadge from 'primevue/overlaybadge';
import { ref } from 'vue';

const cartItemsCount = ref(0);
</script>

<style scoped></style>
