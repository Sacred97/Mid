export interface MenuInterface {
  usability: string
  detailByGroup: string[]
  imgSrc: string
  productGroup: ProductGroup[]
}

export interface ProductGroup {
  productName: string
  category: string[]
}
