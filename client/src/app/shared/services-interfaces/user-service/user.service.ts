import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  AddressUserInterface, CompanyUserInterface,
  ManagerInterface, NewsLetter,
  NewUserInterface,
  ShoppingCartUserInterface, SubscriptionUserInterface,
  UpdateUser,
  UserAddressCreate,
  UserAddressUpdate,
  UserCompanyCreate,
  UserCompanyUpdate,
  UserInterface,
  UserManagerCreate,
  UserManagerUpdate, UserSubscriptionCreate, UserSubscriptionUpdate,
  WaitingListDetailId,
  WaitingListInterface
} from "./user.interface";
import {BehaviorSubject} from "rxjs";
import {ResponseMessage} from "../global-interfaces/response.interface";
import {CartItemInfoInterface} from "../global-interfaces/cart-item-info.interface";
import {ShoppingCartInterface} from "../shopping-cart-service/shopping-cart.interface";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  private hostname: string = 'http://'+location.hostname+':3000/midkam_api/'

  user$: BehaviorSubject<UserInterface | undefined> = new BehaviorSubject<UserInterface | undefined>(undefined)

  async refreshToken(): Promise<boolean> {
    try {
      await this.http.get('http://localhost:3000/midkam_api/auth/refresh', {withCredentials: true})
        .toPromise()
      const user = await this.http.get<UserInterface>(`http://localhost:3000/midkam_api/users/profile`,
        {withCredentials: true}).toPromise()
      const shoppingCart: ShoppingCartInterface[] = user.shoppingCart.cartItem.map(i => ({
        id: i.detail.id, quantity: i.quantity
      }))
      localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
      this.user$.next(user)
      return true
    } catch (e) {
      console.log(e)
      this.user$.next(undefined)
      return false
    }
  }

  //--------------------------------------------------------------------------------------------------------------------

  getProfile(): Promise<UserInterface> {
    const url: string = this.hostname + 'users/profile'
    return this.http.get<UserInterface>(url, {withCredentials: true}).toPromise()
  }

  updateProfile(data: UpdateUser): Promise<UserInterface> {
    const url: string = this.hostname + 'users/profile'
    return this.http.put<UserInterface>(url, data, {withCredentials: true}).toPromise()
  }

  //---------------------------------------------Аутентификация---------------------------------------------------------

  registration(newUser: NewUserInterface): Promise<any> {
    return this.http.post('http://midkam.pro:3000/midkam_api/auth/registration',
      newUser, {withCredentials: true}).toPromise()
  }

  restorePassword(email: string): Promise<void> {
    return this.http.post<void>('http://midkam.pro:3000/midkam_api/auth/password/restore',
      {email: email}, {withCredentials: true}).toPromise()
  }

  changePassword(token: string, password: string): Promise<ResponseMessage> {
    return this.http.post<ResponseMessage>('http://midkam.pro:3000/midkam_api/auth/password/change',
      {token: token, password: password}, {withCredentials: true}).toPromise()
  }

  login(email: string, password: string): Promise<UserInterface> {
    const user = {email: email, password: password}
    return this.http.post<UserInterface>('http://midkam.pro:3000/midkam_api/auth/login',
      user, {withCredentials: true}).toPromise()
  }

  logout(): Promise<void> {
    return this.http.post<void>('http://midkam.pro:3000/midkam_api/auth/logout',
      {void: 'void'}, {withCredentials: true}).toPromise()
  }

  emailVerification(token: string): Promise<ResponseMessage> {
    return this.http.post<ResponseMessage>('http://midkam.pro:3000/midkam_api/auth/verification/verify',
      {token: token}, {withCredentials: true}).toPromise()
  }

  resendLetter(email: string): Promise<ResponseMessage> {
    return this.http.post<ResponseMessage>('http://midkam.pro:3000/midkam_api/auth/verification/verify',
      {email: email}, {withCredentials: true}).toPromise()
  }

  //------------------------------------------------Корзина пользователя------------------------------------------------

  addCartItem(data: CartItemInfoInterface | CartItemInfoInterface[]): Promise<ShoppingCartUserInterface> {
    return this.http.post<ShoppingCartUserInterface>('http://midkam.pro:3000/midkam_api/users/shoppingCart',
      data, {withCredentials: true}).toPromise()
  }

  deleteCartItem(id: number): Promise<ShoppingCartUserInterface> {
    return this.http.delete<ShoppingCartUserInterface>(`http://midkam.pro:3000/midkam_api/users/shoppingCart/${id}`,
      {withCredentials: true}).toPromise()
  }

  recountTotalCost(): Promise<ShoppingCartUserInterface> {
    return this.http.put<ShoppingCartUserInterface>('http://midkam.pro:3000/midkam_api/users/shoppingCart',
      {void: 'void'}, {withCredentials: true}).toPromise()
  }

  cleanShoppingCart(): Promise<ShoppingCartUserInterface> {
    return this.http.post<ShoppingCartUserInterface>('http://midkam.pro:3000/midkam_api/users/shoppingCartClean',
      {void: 'void'}, {withCredentials: true}).toPromise()
  }

  addToWaitingList(data: WaitingListDetailId): Promise<WaitingListInterface> {
    return this.http.post<WaitingListInterface>('http://midkam.pro:3000/midkam_api/users/waiting',
      data, {withCredentials: true}).toPromise()
  }

  deleteFromWaitingList(waitingItemId: number): Promise<WaitingListInterface> {
    return this.http.delete<WaitingListInterface>('http://midkam.pro:3000/midkam_api/users/waiting/' + waitingItemId,
      {withCredentials: true}).toPromise()
  }

  //-----------------------------------------------Контакты пользователя------------------------------------------------

  getAllUserManager(): Promise<ManagerInterface[]> {
    const url = this.hostname + 'users/manager'
    return this.http.get<ManagerInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getManager(id: number): Promise<ManagerInterface> {
    const url = this.hostname + 'users/manager/' + id
    return this.http.get<ManagerInterface>(url, {withCredentials: true}).toPromise()
  }

  addManager(data: UserManagerCreate): Promise<ManagerInterface[]> {
    const url = this.hostname + 'users/manager'
    return this.http.post<ManagerInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateManager(data: UserManagerUpdate): Promise<ManagerInterface[]> {
    const url = this.hostname + 'users/manager'
    return this.http.put<ManagerInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  deleteManager(id: number): Promise<ManagerInterface[]> {
    const url = this.hostname + 'users/manager/' + id
    return this.http.delete<ManagerInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //-------------------------------------------------Адреса пользователя------------------------------------------------

  getAllUserAddresses(): Promise<AddressUserInterface[]> {
    const url = this.hostname + 'users/address'
    return this.http.get<AddressUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getAddress(id: number): Promise<AddressUserInterface> {
    const url = this.hostname + 'users/address/' + id
    return this.http.get<AddressUserInterface>(url, {withCredentials: true}).toPromise()
  }

  addAddress(data: UserAddressCreate): Promise<AddressUserInterface[]> {
    const url = this.hostname + 'users/address'
    return this.http.post<AddressUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateAddress(data: UserAddressUpdate): Promise<AddressUserInterface[]> {
    const url = this.hostname + 'users/address'
    return this.http.put<AddressUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  deleteAddress(id: number): Promise<AddressUserInterface[]> {
    const url = this.hostname + 'users/address/' + id
    return this.http.delete<AddressUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //-----------------------------------------------Организации пользователя---------------------------------------------

  getAllUserCompanies(): Promise<CompanyUserInterface[]> {
    const url = this.hostname + 'users/company'
    return this.http.get<CompanyUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getCompany(id: number): Promise<CompanyUserInterface> {
    const url = this.hostname + 'users/company/' + id
    return this.http.get<CompanyUserInterface>(url, {withCredentials: true}).toPromise()
  }

  addCompany(data: UserCompanyCreate): Promise<CompanyUserInterface[]> {
    const url = this.hostname + 'users/company'
    return this.http.post<CompanyUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateCompany(data: UserCompanyUpdate): Promise<CompanyUserInterface[]> {
    const url = this.hostname + 'users/company'
    return this.http.put<CompanyUserInterface[]>(url, data,{withCredentials: true}).toPromise()
  }

  deleteCompany(id: number): Promise<CompanyUserInterface[]> {
    const url = this.hostname + 'users/company/' + id
    return this.http.delete<CompanyUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //-------------------------------------------------Подписки пользователя----------------------------------------------

  getAllUserSubscriptions(): Promise<SubscriptionUserInterface[]> {
    const url = this.hostname + 'users/subscription'
    return this.http.get<SubscriptionUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getSubscription(id: number): Promise<SubscriptionUserInterface> {
    const url = this.hostname + 'users/subscription/' + id
    return this.http.get<SubscriptionUserInterface>(url, {withCredentials: true}).toPromise()
  }

  addSubscription(data: UserSubscriptionCreate): Promise<SubscriptionUserInterface[]> {
    const url = this.hostname + 'users/subscription'
    return this.http.post<SubscriptionUserInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateSubscription(data: UserSubscriptionUpdate): Promise<SubscriptionUserInterface[]> {
    const url = this.hostname + 'users/subscription'
    return this.http.put<SubscriptionUserInterface[]>(url, data,{withCredentials: true}).toPromise()
  }

  deleteSubscription(id: number): Promise<SubscriptionUserInterface[]> {
    const url = this.hostname + 'users/subscription/' + id
    return this.http.delete<SubscriptionUserInterface[]>(url, {withCredentials: true}).toPromise()
  }

  //--------------------------------------------------------Рассылка----------------------------------------------------

  getAllNewsLetter(): Promise<NewsLetter[]> {
    const url = this.hostname + 'news-letter'
    return this.http.get<NewsLetter[]>(url, {withCredentials: true}).toPromise()
  }

  //-----------------------------------------------------Лист ожидания--------------------------------------------------

  changeEmailNotification(email: string): Promise<WaitingListInterface> {
    const url = this.hostname + 'users/waiting'
    return this.http.put<WaitingListInterface>(url, {emails: email}, {withCredentials: true}).toPromise()
  }

  removeItemFromWaitingList(id: number): Promise<WaitingListInterface> {
    const url = this.hostname + 'users/waiting/' + id
    return this.http.delete<WaitingListInterface>(url, {withCredentials: true}).toPromise()
  }


}
