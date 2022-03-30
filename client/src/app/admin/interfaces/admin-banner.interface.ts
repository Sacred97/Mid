export interface AdminBannerUpload {
  serialNumber: number
  homePage: boolean
  pageReference?: string
}

export interface AdminBannerUpdate {
  id: number
  serialNumber?: number
  pageReference?: string
}

export interface AdminBanner {
  id: number
  url: string
  serialNumber: number
  homePage: boolean
  pageReference?: string
}
