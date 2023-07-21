import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  AddRequestHistoryUser,
  AddressUserInterface, ChangeUserPassword, CompanyUserInterface,
  ManagerInterface, NewsLetter,
  NewUserInterface, RequestHistoryUserInterface,
  ShoppingCartUserInterface, SubscriptionUserInterface, UpdateRequestHistoryUser,
  UpdateUser,
  UserAddressCreate,
  UserAddressUpdate,
  UserCompanyCreate,
  UserCompanyUpdate,
  UserInterface, UserMakeOrder,
  UserManagerCreate,
  UserManagerUpdate, UserSubscriptionCreate, UserSubscriptionUpdate,
  WaitingListDetailId,
  WaitingListInterface
} from "./user.interface";
import {BehaviorSubject, Observable} from "rxjs";
import {ResponseMessage} from "../global-interfaces/response.interface";
import {CartItemInfoInterface} from "../global-interfaces/cart-item-info.interface";
import {ShoppingCartInterface} from "../shopping-cart-service/shopping-cart.interface";
import {environment} from "../../../../environments/environment";
import {DetailInterface} from "../detail-service/detail.interface";
import {OrderInterface} from "../global-interfaces/order.interface";
import {_UserInterface} from "../../interfaces/user/user.interface";
import {ProductAndQuantityInterface} from "../../interfaces/common/productAndQuantity.interface";
import {ShoppingCartOfUserInterface} from "../../interfaces/shoppingCart/shoppingCartOfUser.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  user$: BehaviorSubject<UserInterface | undefined> = new BehaviorSubject<UserInterface | undefined>(undefined)
  user: _UserInterface | undefined = undefined

  async getUser(): Promise<UserInterface | undefined> {
    try {
      const url: string = environment.apiUrl + 'users/profile'
      const user = await this.http.get<UserInterface>(url, {withCredentials: true}).toPromise()
      const shoppingCart = (await this.getShoppingCart()).cartItem.map(i => ({
        id: i.detail.id, quantity: i.quantity
      }))
      localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
      this.user$.next(user)
      return user
    } catch (error) {
      console.log(error)
      this.user$.next(undefined)
      return undefined
    }
  }

  getUserObs(): Observable<_UserInterface> {
    const url: string = environment.apiUrl + 'users/profile'
    return this.http.get<_UserInterface>(url, {withCredentials: true})
  }

  //--------------------------------------------------------------------------------------------------------------------

  getProfile(): Promise<UserInterface> {
    const url: string = environment.apiUrl + 'users/profile'
    return this.http.get<UserInterface>(url, {withCredentials: true}).toPromise()
  }

  updateProfile(data: UpdateUser): Promise<UserInterface> {
    const url: string = environment.apiUrl + 'users/profile'
    return this.http.put<UserInterface>(url, data, {withCredentials: true}).toPromise()
  }

  changeUserPassword(data: ChangeUserPassword): Promise<UserInterface> {
    const url = environment.apiUrl + 'users/change-password'
    return this.http.post<UserInterface>(url, data, {withCredentials: true}).toPromise()
  }

  //---------------------------------------------Аутентификация---------------------------------------------------------

  registration(newUser: NewUserInterface): Promise<any> {
    const url = environment.apiUrl + 'auth/registration'
    return this.http.post(url, newUser, {withCredentials: true}).toPromise()
  }

  restorePassword(email: string): Promise<void> {
    const url = environment.apiUrl + 'auth/password/restore'
    return this.http.post<void>(url, {email: email}, {withCredentials: true}).toPromise()
  }

  changePassword(token: string, password: string): Promise<ResponseMessage> {
    const url = environment.apiUrl + 'auth/password/change'
    return this.http.post<ResponseMessage>(url, {token: token, password: password}, {withCredentials: true}).toPromise()
  }

  login(email: string, password: string): Promise<UserInterface> {
    const url = environment.apiUrl + 'auth/login'
    const user = {email: email, password: password}
    return this.http.post<UserInterface>(url, user, {withCredentials: true}).toPromise()
  }

  loginObs(email: string, password: string): Observable<_UserInterface> {
    const url = environment.apiUrl + 'auth/login'
    const user = {email: email, password: password}
    return this.http.post<_UserInterface>(url, user, {withCredentials: true})
  }

  logout(): Promise<void> {
    const url = environment.apiUrl + 'auth/logout'
    return this.http.post<void>(url, {void: 'void'}, {withCredentials: true}).toPromise()
  }

  emailVerification(token: string): Promise<ResponseMessage> {
    const url = environment.apiUrl + 'auth/verification/verify'
    return this.http.post<ResponseMessage>(url, {token: token}, {withCredentials: true}).toPromise()
  }

  resendLetter(email: string): Promise<ResponseMessage> {
    const url = environment.apiUrl + 'auth/verification/re-check'
    return this.http.post<ResponseMessage>(url, {email: email}, {withCredentials: true}).toPromise()
  }

  //------------------------------------------------Корзина пользователя------------------------------------------------

  getShoppingCart() {
    const url = environment.apiUrl + 'users/shoppingCart'
    return this.http.get<ShoppingCartUserInterface>(url, {withCredentials: true}).toPromise()
  }

  addCartItem(data: CartItemInfoInterface | CartItemInfoInterface[]): Promise<ShoppingCartUserInterface> {
    const url = environment.apiUrl + 'users/shoppingCart'
    return this.http.post<ShoppingCartUserInterface>(url, data, {withCredentials: true}).toPromise()
  }

  addCartItemObs(data: ProductAndQuantityInterface | ProductAndQuantityInterface[]): Observable<ShoppingCartOfUserInterface> {
    const url = environment.apiUrl + 'users/shoppingCart'
    return this.http.post<ShoppingCartOfUserInterface>(url, data, {withCredentials: true})
  }

  deleteCartItem(id: number): Promise<ShoppingCartUserInterface> {
    const url = environment.apiUrl + 'users/shoppingCart/' + id
    return this.http.delete<ShoppingCartUserInterface>(url, {withCredentials: true}).toPromise()
  }

  deleteCartItemObs(id: number): Observable<ShoppingCartOfUserInterface> {
    const url = environment.apiUrl + 'users/shoppingCart/' + id
    return this.http.delete<ShoppingCartOfUserInterface>(url, {withCredentials: true})
  }

  recountTotalCost(): Promise<ShoppingCartUserInterface> {
    const url = environment.apiUrl + 'users/shoppingCart'
    return this.http.put<ShoppingCartUserInterface>(url, {void: 'void'}, {withCredentials: true}).toPromise()
  }

  recountTotalCostObs(): Observable<ShoppingCartOfUserInterface> {
    const url = environment.apiUrl + 'users/shoppingCart'
    return this.http.put<ShoppingCartOfUserInterface>(url, {void: 'void'}, {withCredentials: true})
  }

  cleanShoppingCart(): Promise<ShoppingCartUserInterface> {
    const url = environment.apiUrl + 'users/shoppingCartClean'
    return this.http.post<ShoppingCartUserInterface>(url, {void: 'void'}, {withCredentials: true}).toPromise()
  }

  //--------------------------------------

  getDetailsFromWaitingList() {
    const url = environment.apiUrl + 'users/waiting-list-details'
    return this.http.get<DetailInterface[]>(url, {withCredentials: true}).toPromise()
  }

  addToWaitingList(data: WaitingListDetailId): Promise<WaitingListInterface> {
    const url = environment.apiUrl + 'users/waiting'
    return this.http.post<WaitingListInterface>(url, data, {withCredentials: true}).toPromise()
  }

  getWaitingList(): Promise<WaitingListInterface> {
    const url = environment.apiUrl + 'users/waiting'
    return this.http.post<WaitingListInterface>(url, {withCredentials: true}).toPromise()
  }

  deleteFromWaitingList(waitingItemId: number): Promise<WaitingListInterface> {
    const url = environment.apiUrl + 'users/waiting/' + waitingItemId
    return this.http.delete<WaitingListInterface>(url, {withCredentials: true}).toPromise()
  }

  //--------------------------------------------------Оформить заказ----------------------------------------------------

  makeOrder(data: UserMakeOrder): Promise<UserInterface> {
    const url = environment.apiUrl + 'users/order'
    return this.http.post<UserInterface>(url, data, {withCredentials: true}).toPromise()
  }

  //-----------------------------------------------Контакты пользователя------------------------------------------------

  getAllUserManager(): Promise<ManagerInterface[]> {
    const url = environment.apiUrl + 'users/manager'
    return this.http.get<ManagerInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getManager(id: number): Promise<ManagerInterface> {
    const url = environment.apiUrl + 'users/manager/' + id
    return this.http.get<ManagerInterface>(url, {withCredentials: true}).toPromise()
  }

  addManager(data: UserManagerCreate): Promise<ManagerInterface[]> {
    const url = environment.apiUrl + 'users/manager'
    return this.http.post<ManagerInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateManager(data: UserManagerUpdate): Promise<ManagerInterface[]> {
    const url = environment.apiUrl + 'users/manager'
    return this.http.put<ManagerInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  deleteManager(id: number): Promise<ManagerInterface[]> {
    const url = environment.apiUrl + 'users/manager/' + id
    return this.http.delete<ManagerInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //-------------------------------------------------Адреса пользователя------------------------------------------------

  getAllUserAddresses(): Promise<AddressUserInterface[]> {
    const url = environment.apiUrl + 'users/address'
    return this.http.get<AddressUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getAddress(id: number): Promise<AddressUserInterface> {
    const url = environment.apiUrl + 'users/address/' + id
    return this.http.get<AddressUserInterface>(url, {withCredentials: true}).toPromise()
  }

  addAddress(data: UserAddressCreate): Promise<AddressUserInterface[]> {
    const url = environment.apiUrl + 'users/address'
    return this.http.post<AddressUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateAddress(data: UserAddressUpdate): Promise<AddressUserInterface[]> {
    const url = environment.apiUrl + 'users/address'
    return this.http.put<AddressUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  deleteAddress(id: number): Promise<AddressUserInterface[]> {
    const url = environment.apiUrl + 'users/address/' + id
    return this.http.delete<AddressUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //-----------------------------------------------Организации пользователя---------------------------------------------

  getAllUserCompanies(): Promise<CompanyUserInterface[]> {
    const url = environment.apiUrl + 'users/company'
    return this.http.get<CompanyUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getCompany(id: number): Promise<CompanyUserInterface> {
    const url = environment.apiUrl + 'users/company/' + id
    return this.http.get<CompanyUserInterface>(url, {withCredentials: true}).toPromise()
  }

  addCompany(data: UserCompanyCreate): Promise<CompanyUserInterface[]> {
    const url = environment.apiUrl + 'users/company'
    return this.http.post<CompanyUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateCompany(data: UserCompanyUpdate): Promise<CompanyUserInterface[]> {
    const url = environment.apiUrl + 'users/company'
    return this.http.put<CompanyUserInterface[]>(url, data,{withCredentials: true}).toPromise()
  }

  deleteCompany(id: number): Promise<CompanyUserInterface[]> {
    const url = environment.apiUrl + 'users/company/' + id
    return this.http.delete<CompanyUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //-------------------------------------------------Подписки пользователя----------------------------------------------

  getAllUserSubscriptions(): Promise<SubscriptionUserInterface[]> {
    const url = environment.apiUrl + 'users/subscription'
    return this.http.get<SubscriptionUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getSubscription(id: number): Promise<SubscriptionUserInterface> {
    const url = environment.apiUrl + 'users/subscription/' + id
    return this.http.get<SubscriptionUserInterface>(url, {withCredentials: true}).toPromise()
  }

  addSubscription(data: UserSubscriptionCreate): Promise<SubscriptionUserInterface[]> {
    const url = environment.apiUrl + 'users/subscription'
    return this.http.post<SubscriptionUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateSubscription(data: UserSubscriptionUpdate): Promise<SubscriptionUserInterface[]> {
    const url = environment.apiUrl + 'users/subscription'
    return this.http.put<SubscriptionUserInterface[]>(url, data,{withCredentials: true}).toPromise()
  }

  deleteSubscription(id: number): Promise<SubscriptionUserInterface[]> {
    const url = environment.apiUrl + 'users/subscription/' + id
    return this.http.delete<SubscriptionUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //--------------------------------------------------------Рассылка----------------------------------------------------

  getAllNewsLetter(): Promise<NewsLetter[]> {
    const url = environment.apiUrl + 'news-letter'
    return this.http.get<NewsLetter[]>(url, {withCredentials: true}).toPromise()
  }

  //-----------------------------------------------------Лист ожидания--------------------------------------------------

  changeEmailNotification(email: string): Promise<WaitingListInterface> {
    const url = environment.apiUrl + 'users/waiting'
    return this.http.put<WaitingListInterface>(url, {emails: email}, {withCredentials: true}).toPromise()
  }

  removeItemFromWaitingList(id: number): Promise<WaitingListInterface> {
    const url = environment.apiUrl + 'users/waiting/' + id
    return this.http.delete<WaitingListInterface>(url, {withCredentials: true}).toPromise()
  }

  //----------------------------------------------------История поиска--------------------------------------------------

  getRequestHistory() {
    const url = environment.apiUrl + 'users/history'
    return this.http.get<RequestHistoryUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getRequestHistoryObs() {
    const url = environment.apiUrl + 'users/history'
    return this.http.get<RequestHistoryUserInterface[]>(url, {withCredentials: true})
  }

  addRequestHistory(data: AddRequestHistoryUser): Observable<RequestHistoryUserInterface[]> {
    const url = environment.apiUrl + 'users/history'
    return this.http.post<RequestHistoryUserInterface[]>(url, data, {withCredentials: true})
  }

  updateRequestHistory(data: UpdateRequestHistoryUser): Observable<RequestHistoryUserInterface[]> {
    const url = environment.apiUrl + 'users/history'
    return this.http.put<RequestHistoryUserInterface[]>(url, data, {withCredentials: true})
  }

  deleteRequestHistory(id: number): Observable<RequestHistoryUserInterface[]> {
    const url = environment.apiUrl + 'users/history/' + id
    return this.http.delete<RequestHistoryUserInterface[]>(url, {withCredentials: true})
  }

  //-----------------------------------------------Заказы---------------------------------------------------------------

  getAllUserOrders() {
    const url = environment.apiUrl + 'users/order'
    return this.http.get<OrderInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getUserOrder(id: number) {
    const url = environment.apiUrl + 'users/order/' + id
    return this.http.get<OrderInterface>(url, {withCredentials: true}).toPromise()
  }


}
