import {RequisitesRequestInterface} from "../global-interfaces/requisites.interface";
import {CartItemInfoInterface} from "../global-interfaces/cart-item-info.interface";

export interface GuestMakeOrderInterface {
  order: CartItemInfoInterface[]
  fullName: string
  email: string
  phone: string
  additionalPhone?: string
  customer: string
  requisites?: RequisitesRequestInterface
  payment: string
  delivery: string
  address: string
}
