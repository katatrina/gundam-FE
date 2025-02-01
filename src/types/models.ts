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
