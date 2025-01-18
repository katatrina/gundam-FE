export interface User {
  id: string
  name: string
  email: string
  email_verified: boolean
  phone_number: string | null
  phone_number_verified: boolean
  role: string
  picture: string | null
  created_at: string
}
