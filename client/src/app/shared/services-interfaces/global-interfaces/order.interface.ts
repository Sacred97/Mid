export interface OrderInterface {
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
  orderItem: OrderItem[]
}

export interface OrderItem {
  id: number
  productName: string
  vendorCode: string
  manufacturer: string | null
  price: number
  quantity: number
  totalCost: number
  totalWeight: number
  detailId: string
}
