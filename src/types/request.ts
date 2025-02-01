// Request payload type for creating/updating address
export interface AddressRequest {
  receiver_name: string
  receiver_phone_number: string
  province_name: string
  district_name: string
  ward_name: string
  detail: string
  is_primary: boolean
}
