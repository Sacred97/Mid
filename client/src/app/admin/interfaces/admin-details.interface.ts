import {ManufacturerInterface} from "../../shared/services-interfaces/detail-service/manufacturer.interface";

export interface AdminDetailUpdate {
  id: string
  productCode: string
  name: string
  vendorCode: string
  price: number
  description: string | null
  weight: number
  unit: string
  isNewDetail: boolean
  isSale: boolean
  saleText: string | null
  isPopular: boolean
  popularText: string | null
  isHide: boolean
  manufacturerId: number | null
  categoryId: string
  autoParts: {id: number}[]
  autoApplicability: {id: number}[]
  keyWords: {id: number}[]
}

export interface AdminVendorCodeCreate {
  additionalCode: string
  detailId: string
}

export interface AdminVendorCodeUpdate {
  id: number
  additionalCode?: string
  detailId?: string
}

export interface AdminAlternativeNameCreate {
  alternativeName: string
  detailId: string
}

export interface AdminAlternativeNameUpdate {
  id: number
  alternativeName?: string
  detailId?: string
}

export interface AdminPhotoUpload {
  isMain: boolean
  detailId: string
}

export interface AdminPhotoUpdate {
  id: number
  detailId: string
}

export interface AdminDetailsHidden {
  id: string
  name: string
  vendorCode: string
  productCode: string
  manufacturer: null | ManufacturerInterface
}
