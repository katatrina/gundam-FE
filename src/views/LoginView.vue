<template>
  <div class="w-full">
    <!-- Header with white background -->
    <header class="bg-white shadow-sm">
      <div class="mx-auto px-24 py-2">
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
              class="w-full mt-1 bg-gray-100 text-gray-800" required />
          </div>

          <Button label="Đăng Nhập" type="submit" class="w-full mb-1" :loading="loading" />

          <!-- hoặc -->
          <div class="flex items-center mb-1 justify-center">
            <!-- <Divider class="flex-1" /> -->
            <span class="mx-4 text-gray-500 italic">hoặc</span>
            <!-- <Divider class="flex-1" /> -->
          </div>

          <!-- Google Sign-In Button -->
          <div class="flex justify-center w-full">
            <GoogleSignInButton :client-id="googleClientId" theme="filled_blue" size="large" type="standard"
              @credential-response="onGoogleCredentialResponse" />
          </div>

          <div class="mt-4 text-center">
            <span class="text-sm font-light">Chưa có tài khoản? </span>
            <RouterLink to="#" class="text-emerald-500 hover:underline font-medium">
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
import loginBg from '@/assets/images/login-bg.jpg';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import { useToast } from 'primevue/usetoast';

import AppFooter from '@/components/AppFooter.vue';
import AppLogo from '@/components/AppLogo.vue';

import axios from '@/config/axios';
import { useCookies } from '@vueuse/integrations/useCookies';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { ACCESS_TOKEN_KEY } from '@/constants';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types/models';
import GoogleSignInButton from '@/components/GoogleSignInButton.vue';

interface LoginResponse {
  user: User
  access_token: string
  access_token_expires_at: string
}

const cookies = useCookies();
const toast = useToast();
const currentRoute = useRoute();
const router = useRouter();
const authStore = useAuthStore();

console.log("isAuthenticated in LoginView", authStore.isAuthenticated);

const loading = ref<boolean>(false);

const email = ref<string>("");
const password = ref<string>("");

const handleLogin = async () => {
  loading.value = true;

  // sleep for 500ms to show loading spinner
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const response = await axios.post<LoginResponse>('/auth/login', {
      email: email.value,
      password: password.value,
    });

    const { access_token, user } = response.data;

    // Save access token to cookies
    cookies.set(ACCESS_TOKEN_KEY, access_token, {
      expires: new Date(response.data.access_token_expires_at),
      sameSite: 'strict',
    });

    // Store user information in auth store
    authStore.setAuth(user);

    // Navigate to home page
    router.push('/');

    // Show success notification
    toast.add({
      severity: 'success',
      summary: "Đăng nhập thành công",
      // detail: `Chào mừng, ${response.data.user.email} 🤗`,
      life: 3000,
      group: 'br',
    });
  } catch (error: any) {
    const statusCode = error.response.status;
    if (statusCode === 401 || statusCode === 404) {
      toast.add({
        severity: 'error',
        summary: "Đăng nhập thất bại",
        detail: 'Thông tin đăng nhập không chính xác.',
        life: 3000,
        group: 'br',
      });
    } else {
      toast.add({
        severity: 'error',
        summary: "Đăng nhập không thành công",
        detail: 'Lỗi hệ thống, vui lòng thử lại sau.',
        life: 3000,
        group: 'br',
      });
    }
  } finally {
    loading.value = false;
  }
};

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

async function onGoogleCredentialResponse(token: string) {
  loading.value = true;

  // sleep for 500ms to show loading spinner
  // await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const response = await axios.post<LoginResponse>('/auth/google-login', {
      id_token: token,
    });

    const { access_token, user } = response.data;

    // Save access token to cookies
    cookies.set(ACCESS_TOKEN_KEY, access_token, {
      expires: new Date(response.data.access_token_expires_at),
      sameSite: 'strict',
    });

    // Store user information in auth store
    authStore.setAuth(user);

    // Navigate to the previous page or home page
    if (currentRoute.query.redirect) {
      router.push(currentRoute.query.redirect as string);
    } else {
      router.push('/');
    }

    // Show success notification
    toast.add({
      severity: 'success',
      summary: "Đăng nhập thành công",
      // detail: `Chào mừng, ${response.data.user.email} 🤗`,
      life: 3000,
      group: 'br',
    });
  } catch (error: any) {
    const statusCode = error.response.status;
    if (statusCode === 401 || statusCode === 404) {
      toast.add({
        severity: 'error',
        summary: "Đăng nhập thất bại",
        detail: 'Thông tin đăng nhập không chính xác.',
        life: 3000,
        group: 'br',
      });
    } else {
      toast.add({
        severity: 'error',
        summary: "Đăng nhập không thành công",
        detail: 'Lỗi hệ thống, vui lòng thử lại sau.',
        life: 3000,
        group: 'br',
      });
    }
  } finally {
    loading.value = false;
  }
}

</script>
