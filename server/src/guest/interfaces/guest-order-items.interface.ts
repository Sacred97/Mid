export interface GuestOrderItemsInterface {
    productName: string,
    vendorCode: string,
    manufacturer?: string,
    price: number,
    quantity: number,
    totalCost: number,
    totalWeight: number,
    detailId: string,
}
