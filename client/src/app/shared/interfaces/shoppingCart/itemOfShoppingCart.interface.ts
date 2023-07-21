export interface ItemOfShoppingCartInterface {
  id: number
  quantity: number
  price: number
  finalPrice: number
  weight: number
  finalWeight: number
  timeAdd: string
  detail: {id: string}
}
