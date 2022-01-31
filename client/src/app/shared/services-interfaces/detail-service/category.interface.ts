export interface CategoryInterface {
  id: string
  categoryName: string
  productGroup: ProductGroupInterface
}

export interface ProductGroupInterface {
  id: string
  productGroup: string
  category?: CategoryInterface
}
