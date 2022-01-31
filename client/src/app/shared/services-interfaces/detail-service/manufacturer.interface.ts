export interface ManufacturerInterface {
  id: number
  nameCompany: string
  shortName: string
  description: string | null
  logoCompanyUrl: string | null
  photoCertificate: PhotoCertificateInterface[] // Can be empty []
  country: Country
}

export interface PhotoCertificateInterface {
  id: number
  certificatePhotoUrl: string
}

export interface Country {
  id: number
  country: string
  shortName: string
  region: Region
}

export interface Region {
  id: number
  region: string
  shortName: string
  country?: Country[]
}
