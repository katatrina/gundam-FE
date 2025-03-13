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
  full_name: string
  phone_number: string
  province_name: string
  district_name: string
  ghn_district_id: number
  ward_name: string
  ghn_ward_code: string
  detail: string
  is_primary: boolean
  is_pickup_address: boolean
}

export interface GundamGrade {
  id: number
  name: string
  display_name: string
  slug: string
}

export type GundamCondition = 'new' | 'open box' | 'used'

export interface Gundam {
  id: number
  owner_id: string
  name: string
  slug: string
  grade: string
  condition: GundamCondition
  condition_description: string | null
  manufacturer: string
  scale: string
  description: string
  price: number
  image_urls: string[]
  status: string
  created_at: string
  updated_at: string
}

export interface GundamAccessory {
  id: number
  gundam_id: number
  name: string
  quantity: number
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

export interface SellerSubscriptionDetails {
  id: number
  plan_id: number
  plan_name: string
  seller_id: string
  max_listings: number | null
  listings_used: number
  max_open_auctions: number | null
  open_auctions_used: number
  is_active: boolean
  is_unlimited: boolean
  price: number
  end_date: string | null
}
