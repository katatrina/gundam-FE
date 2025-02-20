import type { UserAddress } from '@/types/models'

const maskPhoneNumber = (phoneNumber: string): string => {
  // Only show the last 3 digits of the phone number
  return phoneNumber.replace(/\d(?=\d{3})/g, '*')
}

const formatLocation = (address: UserAddress): string => {
  return `${address.ward_name}, ${address.district_name}, ${address.province_name}`
}

const formatFullLocation = (address: UserAddress): string => {
  return `${address.detail}, ${address.ward_name}, ${address.district_name}, ${address.province_name}`
}

export { maskPhoneNumber, formatLocation, formatFullLocation }
