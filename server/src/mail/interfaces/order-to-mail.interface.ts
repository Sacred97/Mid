export interface OrderToMailInterface {
    orderNumber: string
    totalCost: string
    totalWeight: string
    fullName: string
    email: string
    phone: string
    additionalPhone?: string
    customer: string
    paymentMethod: string
    deliveryMethod: string
    deliveryAddress: string
    orderItem: OrderItemToMailInterface[]
}

export interface OrderItemToMailInterface {
    index: number
    photoUrl?: string
    productName: string
    vendorCode: string
    price: string
    quantity: number
    finalPrice: string
    finalWeight: string
    detailId: string
}
