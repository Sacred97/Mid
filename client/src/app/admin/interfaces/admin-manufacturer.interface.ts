export interface AdminManufacturerUpdate {
  id: number
  nameCompany?: string
  description?: string
  countryId?: number
}

export interface AdminManufacturerWithoutCountry {
  id: number
  nameCompany: string
  logoCompanyUrl: string | null
}
