<script setup lang="ts">
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { ref } from 'vue';

const input = ref('');

</script>

<template>
  <main>
    <h1>Home</h1>
    <InputText v-model="input" />
    <p>{{ input }}</p>
    <Button label="Click me" />
  </main>
</template>
