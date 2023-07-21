import {ItemOfShoppingCartInterface} from "./itemOfShoppingCart.interface";

export interface ShoppingCartOfUserInterface {
  id: number
  totalCost: number
  totalWeight: number
  cartItem: ItemOfShoppingCartInterface[]
}
