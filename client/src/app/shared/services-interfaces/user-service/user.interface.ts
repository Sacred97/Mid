import {RequisitesRequestInterface} from "../global-interfaces/requisites.interface";

export interface NewUserInterface {
  email: string
  password: string
  fullName: string
  phone: string
}

export interface UserInterface {
  id: number
  email: string
  fullName: string
  phone: string
  additionalPhone: string | null

  manager: ManagerInterface[]
  company: CompanyUserInterface[]
  address: AddressUserInterface[]
  subscriptions: SubscriptionUserInterface[]
  requestHistory: RequestHistoryUserInterface[]

  shoppingCart: ShoppingCartUserInterface
  waitingList: WaitingListInterface

  order: UserOrdersInterface[]
}

export interface ManagerInterface {
  id: number
  email: string
  fullName: string
  phone: string
  additionalPhone: string | null
}

export interface CompanyUserInterface {
  id: number
  opf: string
  companyName: string
  inn: string
  kpp: string
  address: string
}

export interface AddressUserInterface {
  id: number
  deliveryMethod: string
  deliveryAddress: string
  transportCompany: string | null
  addressName: string
  isMain: boolean
}

export interface SubscriptionUserInterface {
  id: number
  email: string
  newsLetter: NewsLetter
  notice: string
}

export interface RequestHistoryUserInterface {
  id: number
  requestDate: string
  result: number
  requestString: string
  detailCart: string | null
}

export interface NewsLetter {
  id: number
  name: string
}

export interface ShoppingCartUserInterface {
  id: number
  totalCost: number
  totalWeight: number
  cartItem: CartItemInterface[]
}

export interface CartItemInterface {
  id: number
  quantity: number
  price: number
  finalPrice: number
  weight: number
  finalWeight: number
  timeAdd: string
  detail: {id: string}
}

export interface WaitingListInterface {
  id: number
  emails: string
  waitingItem: WaitingItemInterface[]
}

export interface WaitingItemInterface {
  id: number
  detail: {id: string}
}

export interface UserOrdersInterface {
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
  orderItem: UserOrderItems[]
}

export interface UserOrderItems {
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

export interface WaitingListDetailId {
  detailId: string
}

export interface UpdateUser {
  fullName: string
  email: string
  phone: string
  additionalPhone: string
}

export interface UserManagerCreate {
  email: string
  fullName: string
  phone: string
  additionalPhone?: string
}

export interface UserManagerUpdate {
  id: number
  email?: string
  fullName?: string
  phone?: string
  additionalPhone?: string
}

export interface UserAddressCreate {
  isMain: boolean
  addressName: string
  deliveryMethod: string
  deliveryAddress: string
  transportCompany?: string
}

export interface UserAddressUpdate {
  id: number
  isMain?: boolean
  addressName?: string
  deliveryMethod?: string
  deliveryAddress?: string
  transportCompany?: string
}

export interface UserCompanyCreate {
  opf: string
  companyName: string
  inn: string
  kpp: string
  address: string
}

export interface UserCompanyUpdate {
  id: number
  opf?: string
  companyName?: string
  inn?: string
  kpp?: string
  address?: string
}

export interface UserSubscriptionCreate {
  email: string
  newsLetterId: number
  notice?: string
}

export interface UserSubscriptionUpdate {
  id: number
  email?: string
  newsLetterId?: number
  notice?: string
}


export interface UserMakeOrder {
  fullName: string
  phone: string
  email: string
  additionalPhone?: string
  customer: string
  requisites?: RequisitesRequestInterface
  payment: string
  delivery: string
  address: string
}

export interface AddRequestHistoryUser {
  result: number
  requestString: string
}

export interface UpdateRequestHistoryUser {
  id: number
  detailCart: string
}
