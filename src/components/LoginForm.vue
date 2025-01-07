<template>
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-bold text-center mb-6">Đăng Nhập</h2>
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label for="email" class="block text-sm font-medium mb-1">Địa chỉ Email</label>
        <InputText id="email" v-model="email" type="email" placeholder="Email" class="w-full" />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium mb-1">Mật Khẩu</label>
        <Password v-model="password" id="password" feedback="false" placeholder="Mật Khẩu" class="w-full" />
      </div>
      <PrimeButton label="Đăng Nhập" class="w-full bg-blue-600 text-white font-bold py-2" />
      <p class="text-center text-sm text-gray-500 my-4">hoặc</p>
      <PrimeButton icon="pi pi-google" label="Đăng nhập bằng Google" class="w-full bg-red-600 text-white font-bold py-2" />
    </form>
    <p class="text-center text-sm mt-6">
      Chưa có tài khoản?
      <router-link to="/register" class="text-blue-600 hover:underline">Đăng Ký</router-link>
    </p>
  </div>
</template>

<script lang="ts">
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import PrimeButton from "primevue/button";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      console.log("Logging in with", this.email, this.password);
    },
  },
  components: {
    InputText,
    Password,
    PrimeButton,
  },
};
</script>

<style scoped></style>
