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
