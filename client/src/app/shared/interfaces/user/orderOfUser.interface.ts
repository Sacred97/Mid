export interface OrderOfUserInterface {
  id: number
  orderDate: string
  orderNumber: string
  orderCost: number
  orderWeight: number
  contactFullName: string
  contactEmail: string
  contactPhone: string
  contactAdditionalPhone: string | null
  customer: string
  company: string | null
  inn: string | null
  kpp: string | null
  companyAddress: string | null
  paymentMethod: string
  deliveryMethod: string
  deliveryAddress: string
  orderItem: ItemOfOrderInterface[]
}

export interface ItemOfOrderInterface {
  id: number
  productName: string
  vendorCode: string
  manufacturer: string
  price: number
  quantity: number
  totalCost: number
  totalWeight: number
  detailId: string
}
