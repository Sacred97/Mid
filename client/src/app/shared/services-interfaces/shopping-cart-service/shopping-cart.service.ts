import {Injectable} from '@angular/core';
import {UserService} from "../user-service/user.service";
import {ShoppingCartInterface} from "./shopping-cart.interface";
import {UserInterface} from "../user-service/user.interface";
import {GuestService} from "../guest-service/guest.service";
import {CartItemInfoInterface} from "../global-interfaces/cart-item-info.interface";
import {DetailInterface} from "../detail-service/detail.interface";
import {MarkerService} from "../marker-service/marker.service";
import {ProductAndQuantityInterface} from "../../interfaces/common/productAndQuantity.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Observable, of} from "rxjs";
import {_UserInterface} from "../../interfaces/user/user.interface";
import {TotalCostResponseInterface} from "../../interfaces/response/totalCostResponse.interface";
import {ShoppingCartOfUserInterface} from "../../interfaces/shoppingCart/shoppingCartOfUser.interface";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private userService: UserService, private guestService: GuestService,
              private markerService: MarkerService) {
  }

  itemsQuantity: number = 0
  totalCost: number = 0

  // Удалить после всех исправлений
  storage(): ShoppingCartInterface[]  {
    return !!localStorage.getItem('shopping_cart')
      ? JSON.parse(localStorage.getItem('shopping_cart')!) : []
  }

  addToGuestShoppingCart(items: ProductAndQuantityInterface): void {
    const data = this.getGuestShoppingCart()
    const candidate = this.getGuestShoppingCart().findIndex(i => i.detailId === items.detailId)
    if (candidate + 1) {
      data[candidate].quantity = items.quantity
    } else {
      data.push(items)
    }
    localStorage.setItem('shopping_cart', JSON.stringify(data))
  }

  setGuestShoppingCart(items: ProductAndQuantityInterface[]): void {
    localStorage.setItem('shopping_cart', JSON.stringify(items))
  }

  getGuestShoppingCart(): ProductAndQuantityInterface[] {
    const data = localStorage.getItem('shopping_cart')
    return data ? JSON.parse(data) : []
  }

  // Вынесено в utils/helpers.ts. Удалить после всех исправлений
  toCurrency(price: number) {
    return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(price)
  }

  // Вынесено в utils/helpers.ts. Удалить после всех исправлений
  toDate(date: string) {
    let correct = new Date(date)
    const options: Intl.DateTimeFormatOptions  = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }
    return correct.toLocaleString('ru', options)
  }

  check(id: string): boolean {
    const shoppingCart: ShoppingCartInterface[] = this.storage()
    const candidate = shoppingCart.find(i => i.id === id)
    return !!candidate
  }

  // На замену check()
  checkObs(productId:string): boolean {
    const user = this.userService.user
    let candidate
    if (user) {
      candidate = user.shoppingCart.cartItem.find(i => i.detail.id === productId)
    } else {
      candidate = this.getGuestShoppingCart().find(i => i.detailId === productId)
    }
    return !!candidate
  }

  async addItem(id: string, quantity: number = 1): Promise<void> {
    const shoppingCart: ShoppingCartInterface[] = this.storage()

    const duplicate = shoppingCart.find(i => i.id === id)
    if (!!duplicate) return

    let user: UserInterface | undefined = this.userService.user$.getValue()
    shoppingCart.push({id, quantity})
    if (!!user) {
      user.shoppingCart = await this.userService.addCartItem({detailId: id, quantity})
      this.recountTotalCostWithUser(user, shoppingCart)
    } else {
      await this.recountTotalCostWithGuest(shoppingCart)
    }
  }

  // На замену addItem()
  addItemObs(id: string, quantity: number = 1): Observable<null | ShoppingCartOfUserInterface | TotalCostResponseInterface> {
    if (this.checkObs(id)) return of(null)
    if (!!this.userService.user) {
      return this.changeQuantityItemUserObs(id, quantity, this.userService.user)
    } else {
      this.addToGuestShoppingCart({detailId: id, quantity: quantity})
      return this.recountTotalCostWithGuestObs()
    }
  }

  async increase(details: DetailInterface[], idx: number): Promise<void> {
    const prev: number = details[idx].quantity!
    details[idx].quantity = prev + 1
    if (this.check(details[idx].id)) {
      try {
        await this.changes(details[idx].id, details[idx].quantity!)
      } catch (error) {
        console.log(error)
        details[idx].quantity = prev
        return
      }
    }
    return
  }

  async decrease(details: DetailInterface[], idx: number) {
    if (!details[idx].quantity) {
      return
    }
    if (details[idx].quantity! <= 1) {
      details[idx].quantity = 1
      if (this.check(details[idx].id)) {
        try {
          await this.removeItem(details[idx].id)
        } catch (error) {
          console.log(error);
        }
        return
      }
      return
    }
    const prev: number = details[idx].quantity!
    details[idx].quantity = prev-1
    if (this.check(details[idx].id)) {
      try {
        await this.changes(details[idx].id, details[idx].quantity!)
      } catch (error) {
        console.log(error);
        details[idx].quantity = prev
      }
    }
    return
  }

  // На замену increase() decrease() changes()
  changeQuantityItemObs(details: DetailInterface[], idx: number, prevQuantity: number): Observable<ShoppingCartOfUserInterface | TotalCostResponseInterface | null> {
    if(!this.checkObs(details[idx].id)) return of(null)

    if (details[idx].quantity < 1) {
      details[idx].quantity = 1
      return this.removeItemObs(details[idx].id)
    }

    if (!!this.userService.user) {
      return this.changeQuantityItemUserObs(details[idx].id, details[idx].quantity, this.userService.user).pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          details[idx].quantity = prevQuantity
          return of(null)
        })
      )
    } else {
      this.addToGuestShoppingCart({detailId: details[idx].id, quantity: details[idx].quantity})
      return this.recountTotalCostWithGuestObs().pipe(
        catchError((error: HttpErrorResponse) => {
          console.log(error);
          details[idx].quantity = prevQuantity
          return of(null)
        })
      )
    }
  }

  async removeItem(id: string): Promise<void> {
    const user = this.userService.user$.getValue()
    let shoppingCart = this.storage()
    const idx: number = shoppingCart.findIndex(i => i.id === id)
    shoppingCart.splice(idx, 1)

    if (!!user) {
      const cartItem = user.shoppingCart.cartItem.find(i => i.detail.id === id)
      if (!cartItem) return
      user.shoppingCart = await this.userService.deleteCartItem(cartItem.id)
      this.recountTotalCostWithUser(user, shoppingCart)
    } else {
      await this.recountTotalCostWithGuest(shoppingCart)
    }
  }

  // На замену removeItem()
  removeItemObs(id: string): Observable<ShoppingCartOfUserInterface | TotalCostResponseInterface> {
    if (this.userService.user) {
      const product = this.userService.user.shoppingCart.cartItem.find(i => i.detail.id === id)
      if (!product) return of(this.userService.user.shoppingCart)
      return this.userService.deleteCartItemObs(product.id).pipe(
        tap(res => {
          this.userService.user!.shoppingCart = res
          this.totalCost = res.totalCost
          this.itemsQuantity = res.cartItem.length
        })
      )
    } else {
      const shoppingCart = this.getGuestShoppingCart()
      const idx: number = shoppingCart.findIndex(i => i.detailId === id)
      shoppingCart.splice(idx, 1)
      this.setGuestShoppingCart(shoppingCart)
      return this.recountTotalCostWithGuestObs()
    }
  }

  async changes(id: string, quantity: number): Promise<void> {
    const user = this.userService.user$.getValue()
    if (!!user) {
      await this.changeQuantityItemUser(id, quantity, user)
    } else {
      const shoppingCart: ShoppingCartInterface[] = this.storage().map(i => {
        if (i.id === id) i.quantity = quantity
        return {id: i.id, quantity: i.quantity}
      })
      await this.recountTotalCostWithGuest(shoppingCart)
    }
  }

  async recountTotalCostWithGuest(items: ShoppingCartInterface[]): Promise<void> {
    const cartItemsInfo: CartItemInfoInterface[] = items.map(i => ({detailId: i.id, quantity: i.quantity}))
    if (items.length) {
      this.totalCost = await this.guestService.recountTotalCost(cartItemsInfo).then(res => res.totalCost)
    } else {
      this.totalCost = 0
    }
    this.itemsQuantity = items.length
    localStorage.setItem('shopping_cart', JSON.stringify(items))
  }

  // На замену recountTotalCostWithGuest()
  recountTotalCostWithGuestObs(): Observable<TotalCostResponseInterface> {
    const items = this.getGuestShoppingCart()
    if (items.length > 0) {
      return this.guestService.recountTotalCostObs(items).pipe(
        tap(res => {
          this.totalCost = res.totalCost
          this.itemsQuantity = items.length
        }),
      )
    } else {
      this.totalCost = 0
      this.itemsQuantity = 0
      const data: TotalCostResponseInterface = {ids: [], totalCost: 0}
      return of(data)
    }
  }

  recountTotalCostWithUser(user: UserInterface, shoppingCart: ShoppingCartInterface[]) {
    this.totalCost = user.shoppingCart.totalCost
    this.itemsQuantity = user.shoppingCart.cartItem.length
    this.userService.user$.next(user)
    localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
  }

  async recountTotalCostWithUserAndUpdatedPrices(user: UserInterface) {
    user.shoppingCart = await this.userService.recountTotalCost()
    this.totalCost = user.shoppingCart.totalCost
    this.itemsQuantity = user.shoppingCart.cartItem.length
    const shoppingCart: ShoppingCartInterface[] = user.shoppingCart.cartItem.map(i => ({
      id: i.detail.id, quantity: i.quantity
    }))
    this.userService.user$.next(user)
    localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
  }

  // На замену recountTotalCostWithUserAndUpdatedPricesObs()
  recountTotalCostWithUserAndUpdatedPricesObs(user: _UserInterface): Observable<ShoppingCartOfUserInterface> {
    return this.userService.recountTotalCostObs().pipe(
      tap(res => {
        this.totalCost = res.totalCost
        this.itemsQuantity = res.cartItem.length
        user.shoppingCart = res
        this.userService.user = user
      })
    )
  }

  async changeQuantityItemUser(id: string, quantity: number, user: UserInterface): Promise<void> {
    user.shoppingCart = await this.userService.addCartItem({detailId: id, quantity})
    this.totalCost = user.shoppingCart.totalCost
    this.itemsQuantity = user.shoppingCart.cartItem.length
    const shoppingCart: ShoppingCartInterface[] = user.shoppingCart.cartItem
      .map(i => ({id: i.detail.id, quantity: i.quantity}))
    localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
    this.userService.user$.next(user)
  }

  // На замену changeQuantityItemUser()
  changeQuantityItemUserObs(id: string, quantity: number, user: _UserInterface): Observable<ShoppingCartOfUserInterface> {
    return this.userService.addCartItemObs({detailId: id, quantity: quantity}).pipe(
      tap(res => {
        user.shoppingCart = res
        this.totalCost = res.totalCost
        this.itemsQuantity = res.cartItem.length
      })
    )
  }

  recountQuantity(detail: DetailInterface | DetailInterface[]): void {
    const shoppingCart = this.storage()
    const markers = this.markerService.getMarkStorage()
    if (Array.isArray(detail)) {
      let successCheckQuantity: number = 0
      let successCheckMarker: number = 0
      for (let product of detail) {
        const maxRatio: number = Math.max(product.storageGarage2000, product.storageOrlovka, product.storageGES)
        product.quantityRatio = maxRatio >= 0 ? maxRatio > 9 ? maxRatio : 5 : 0
        product.quantity = 1

        if (successCheckQuantity < shoppingCart.length) {
          for (let cart of shoppingCart) {
            if (cart.id === product.id) {
              product.quantity = cart.quantity
              successCheckQuantity = successCheckQuantity + 1
              break;
            }
          }
        }

        if (successCheckMarker < markers.length) {
          for (let marker of markers) {
            if (marker.id === product.id) {
              product.marked = true
              successCheckMarker = successCheckMarker + 1
              break;
            }
          }
        }
      }

    } else {
      const maxRatio: number = Math.max(detail.storageGarage2000, detail.storageOrlovka, detail.storageGES)
      detail.quantityRatio = maxRatio >= 0 ? maxRatio >= 10 ? maxRatio : 5 : 0
      detail.quantity = 1
      const idx = shoppingCart.findIndex(i => i.id === detail.id)
      if (idx >= 0) detail.quantity = shoppingCart[idx].quantity
      if (!!markers.find(i => i.id === detail.id)) detail.marked = true
    }
  }

  // На замену recountQuantity()
  recountQuantityObs(product: DetailInterface | DetailInterface[]): void {
    const user = this.userService.user

    if (Array.isArray(product)) {
      if (user) {
        for (let pItem of product) {
          pItem.quantity = 1
          for (let uItem of user.shoppingCart.cartItem) {
            if (pItem.id === uItem.detail.id) {
              pItem.quantity = uItem.quantity
              break;
            }
          }
        }
        return;
      }
      for (let pItem of product) {
        pItem.quantity = 1
        for (let gItem of this.getGuestShoppingCart()) {
          if (pItem.id === gItem.detailId) {
            pItem.quantity = gItem.quantity
            break;
          }
        }
      }
      return;
    }

    product.quantity = 1
    if (user) {
      const candidate = user.shoppingCart.cartItem.find(i => i.detail.id === product.id)
      if (candidate) product.quantity = candidate.quantity
      return;
    }
    const candidate = this.getGuestShoppingCart().find(i => i.detailId)
    if (candidate) product.quantity = candidate.quantity
  }

}

