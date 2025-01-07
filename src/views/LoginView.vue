<template>
  <div class="w-full">
    <!-- Header with white background -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-2">
        <nav class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <AppLogo />
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex justify-center items-center h-[calc(100vh-150px)]">
      <!-- Background Image Behind the Form -->
      <div class="absolute inset-0 z-0"
        :style="{ backgroundImage: `url(${loginBg})`, backgroundSize: 'cover', backgroundPosition: 'center', height: 'calc(100vh - 150px)' }">
      </div>

      <!-- White Login Form Container -->
      <div class="relative w-full max-w-sm bg-white p-6 shadow-lg rounded z-10">
        <h1 class="text-2xl font-bold mb-6 text-center">Đăng Nhập</h1>
        <form @submit.prevent="handleLogin">
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700">Địa chỉ Email</label>
            <InputText id="email" v-model="email" type="email" placeholder="Nhập email của bạn"
              class="w-full mt-1 bg-gray-100 text-gray-800" />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <InputText id="password" v-model="password" type="password" placeholder="Nhập mật khẩu"
              class="w-full mt-1 bg-gray-100 text-gray-800" />
          </div>

          <Button label="Đăng Nhập" type="submit" class="w-full mb-1" />

          <!-- hoặc -->
          <div class="flex items-center mb-1">
            <Divider class="flex-1" />
            <span class="mx-4 text-gray-500 italic">hoặc</span>
            <Divider class="flex-1" />
          </div>

          <Button
            class="w-full bg-white border border-gray-300 text-black py-2 rounded-md flex items-center justify-center hover:bg-gray-100 transition duration-300"><svg
              width="20px" height="20px" viewBox="0 0 32 32" data-name="Layer 1" class="mr-2" id="Layer_1"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
                fill="#00ac47"></path>
              <path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
                fill="#4285f4"></path>
              <path
                d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
                fill="#ffba00"></path>
              <polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"></polygon>
              <path
                d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
                fill="#ea4435"></path>
              <polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"></polygon>
              <path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4"></path>
            </svg>Đăng nhập bằng Google</Button>

          <div class="mt-4 text-center">
            <span class="text-sm font-light">Chưa có tài khoản? </span>
            <RouterLink to="/register" class="text-emerald-500 hover:underline font-medium">
              Đăng Ký
            </RouterLink>
          </div>
        </form>
      </div>
    </main>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

// Import the background image
import loginBg from '@/assets/images/login-bg.jpg';
import AppFooter from '@/components/AppFooter.vue';
import AppLogo from '@/components/AppLogo.vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
  // Handle login logic here
  console.log('Email:', email.value, 'Password:', password.value);
};
</script>
