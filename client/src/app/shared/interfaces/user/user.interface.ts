import {ManagerOfUserInterface} from "./managerOfUser.interface";
import {CompanyOfUserInterface} from "./companyOfUser.interface";
import {AddressOfUserInterface} from "./addressOfUser.interface";
import {SubscriptionOfUserInterface} from "./subscriptionOfUser.interface";
import {RequestHistoryOfUserInterface} from "./requestHistoryOfUser.interface";
import {ShoppingCartOfUserInterface} from "../shoppingCart/shoppingCartOfUser.interface";
import {WaitingListOfUserInterface} from "./waitingListOfUser.interface";
import {OrderOfUserInterface} from "./orderOfUser.interface";

export interface _UserInterface {
  id: number
  email: string
  fullName: string
  phone: string
  additionalPhone: string | null

  manager: ManagerOfUserInterface[]
  company: CompanyOfUserInterface[]
  address: AddressOfUserInterface[]
  subscriptions: SubscriptionOfUserInterface[]
  requestHistory: RequestHistoryOfUserInterface[]

  shoppingCart: ShoppingCartOfUserInterface
  waitingList: WaitingListOfUserInterface

  order: OrderOfUserInterface[]
}
