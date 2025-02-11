export interface User {
  id: string
  full_name: string
  email: string
  email_verified: boolean
  phone_number: string | null
  phone_number_verified: boolean
  role: string
  avatar_url: string | null
  created_at: string
}

export interface UserAddress {
  id: number
  user_id: string
  receiver_name: string
  receiver_phone_number: string
  province_name: string
  district_name: string
  ward_name: string
  detail: string
  is_primary: boolean
}

export interface GundamGrade {
  id: number
  name: string
  display_name: string
  slug: string
}

export type GundamCondition = 'mint' | 'near mint' | 'good' | 'moderate wear' | 'heavily damaged'

export interface Gundam {
  id: number
  owner_id: string
  name: string
  slug: string
  grade: string
  condition: GundamCondition
  manufacturer: string
  scale: string
  description: string
  price: number
  image_urls: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface CartItem {
  cart_item_id: string
  gundam_id: number
  gundam_name: string
  gundam_price: number
  gundam_image_url: string
  seller_id: string
  seller_name: string
  seller_avatar_url: string
}
