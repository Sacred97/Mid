export interface OrderOneCInterface {

    details: OrderItemsOneCInterface[]
    orderNumber: string
    orderCost: number
    orderWeight: number
    comment: string
    inn: string

}

export interface OrderItemsOneCInterface {
    id: string
    price: number
    quantity: number
}
