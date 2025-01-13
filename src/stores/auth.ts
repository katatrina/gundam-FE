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
