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

export interface Gundam {
  id: number
  owner_id: string
  name: string
  grade_id: number
  condition: string
  manufacturer: string
  scale: string
  description: string
  price: number
  images: GundamImage[]
  status: string
  created_at: string
  updated_at: string
}

export interface GundamImage {
  id: number
  gundam_id: number
  url: string
  is_primary: boolean
}
