import type { User } from '@/types/models'
import { defineStore } from 'pinia'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoadingAuth: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isLoadingAuth: false,
  }),

  actions: {
    setUser(user: User) {
      if (this.user && this.user.id === user.id) {
        // This check is a must
        this.user = user
      }
    },

    setUserAvatar(avatar: string) {
      if (this.user) {
        this.user.avatar_url = avatar
      }
    },

    setPhoneNumber(phoneNumber: string) {
      if (this.user) {
        this.user.phone_number = phoneNumber
      }
    },

    setAuth(user: User) {
      this.user = user
      this.isAuthenticated = true
    },

    clearAuth() {
      this.user = null
      this.isAuthenticated = false
    },

    setLoadingAuth(loading: boolean) {
      this.isLoadingAuth = loading
    },
  },
})
