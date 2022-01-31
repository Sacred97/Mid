import {Country, PhotoCertificateInterface} from "../detail-service/manufacturer.interface";
import {FilterOptions} from "../global-interfaces/filter.interface";

export interface ManufacturersAndCount {
  items: FilterManufacturerInterface[]
  count: number
}

export interface FilterManufacturerInterface {
  id: number
  nameCompany: string
  shortName: string
  description: string | null
  logoCompanyUrl: string | null
  country: Country
}

export interface SearchManufacturerInterface {
  id: number
  nameCompany: string
  shortName: string
  description: string | null
  logoCompanyUrl: string | null
  photoCertificate: PhotoCertificateInterface[] // Can be empty []
}

export interface ManufacturerFilters {
  category: FilterOptions[]
  autoParts: FilterOptions[]
  autoApplicability: FilterOptions[]
}
