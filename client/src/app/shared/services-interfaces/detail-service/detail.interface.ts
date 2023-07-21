import {ManufacturerInterface} from "./manufacturer.interface";
import {CategoryInterface} from "./category.interface";
import {PartsInterface} from "./parts.interface";
import {ApplicabilityInterface} from "./applicability.interface";
import {KeyWordsInterface} from "./key-words.interface";

export interface DetailInterface {
  id: string
  productCode: string
  name: string
  vendorCode: string
  price: number
  storageGES: number
  storageOrlovka: number
  storageGarage2000: number
  description: string | null
  weight: number
  unit: string | null
  isNewDetail: boolean
  isSale: boolean
  saleText: string | null
  isPopular: boolean
  popularText: string | null
  isHide: boolean

  alternativeName: AlternativeNameInterface[] // Can be empty []
  additionalVendorCode: AdditionalVendorCodeInterface[] // Can be empty []
  photoDetail: PhotoDetailInterface[] // Can be empty []

  manufacturer: ManufacturerInterface | null
  category: CategoryInterface

  autoParts: PartsInterface[] // Can be empty []
  autoApplicability: ApplicabilityInterface[] // Can be empty []
  keyWords: KeyWordsInterface[] // Can be empty []

  // quantityRatio?: number
  // quantity?: number
  quantityRatio: number
  quantity: number
  marked?: boolean
}

export interface CountAndDetailsInterface {
  items: DetailInterface[],
  count: number
}

export interface AlternativeNameInterface {
  id: number
  alternativeName: string
  shortName: string
}

export interface AdditionalVendorCodeInterface {
  id: number
  additionalCode: string
  shortName: string
}

export interface PhotoDetailInterface {
  id: number
  url: string
  isMain: boolean
}

export interface PackageDetailsForHomPage {
  new: DetailInterface[]
  recent: DetailInterface[]
  sale: DetailInterface[]
}
