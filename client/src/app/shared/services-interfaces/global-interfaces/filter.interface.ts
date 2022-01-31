export interface Filters {
  autoApplicability: FilterOptions[]
  autoParts: FilterOptions[]
  manufacturer: FilterOptions[]
  category: FilterOptions[]
}

export interface FilterOptions {
  id: string
  label: string
  count_detail: string
  checked?: boolean
}

export interface FilterRequest {
  type: string
  value: string | number
}

export interface FilterSelected {
  type: string
  label: string
  value : string | number
}

export interface FilterLetter {
  label: string
  checked: boolean
}

export interface LocationInterface {
  region: number
  country: number
  letter: string
}

export interface LocationFilters {
  id: number
  label: string
}

export interface LocationLetterInterface {
  symbol: string,
  checked: boolean
}
