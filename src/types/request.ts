// Request payload type for creating/updating address
export interface AddressRequest {
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
