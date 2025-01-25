<script setup lang="ts">
import { onMounted, ref } from 'vue';

declare global {
  interface Window {
    google?: any;
  }
}

// Define props and emits
const props = defineProps<{
  clientId: string;
  theme?: 'outline' | 'filled_blue';
  size?: 'large' | 'medium' | 'small';
  type?: 'standard' | 'icon';
}>();

const emit = defineEmits<{
  (event: 'credentialResponse', token: string): void;
}>();

const isLoaded = ref(false);
const buttonContainer = ref<HTMLDivElement | null>(null);

// Function to handle credential response
function handleCredentialResponse(response: any) {
  emit('credentialResponse', response.credential);
}

// Function to initialize Google Sign-In
function initializeGoogleSignIn() {
  window.google?.accounts.id.initialize({
    client_id: props.clientId,
    callback: handleCredentialResponse,
  });

  // Render the Google Sign-In button
  if (buttonContainer.value) {
    window.google?.accounts.id.renderButton(
      buttonContainer.value,
      {
        theme: props.theme || 'filled_blue',
        size: props.size || 'large',
        type: props.type || 'standard'
      }
    );
  }

  isLoaded.value = true;
}

// Load Google Sign-In script and initialize
onMounted(() => {
  if (!window.google || !window.google.accounts) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => initializeGoogleSignIn();
    document.body.appendChild(script);
  } else {
    initializeGoogleSignIn();
  }
});
</script>

<template>
  <div ref="buttonContainer"></div>
</template>
