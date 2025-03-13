// stores/subscriptionStore.ts
import { defineStore } from 'pinia'
import type { SellerSubscriptionDetails } from '@/types/models'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    subscriptionDetails: null as SellerSubscriptionDetails | null,
  }),
  actions: {
    setSubscriptionDetails(details: SellerSubscriptionDetails) {
      this.subscriptionDetails = details
    },
    increaseListingsUsed(value: number) {
      if (this.subscriptionDetails) {
        this.subscriptionDetails.listings_used += value
      }
    },
  },
})
