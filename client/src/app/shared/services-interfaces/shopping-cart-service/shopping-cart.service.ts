import {Injectable} from '@angular/core';
import {UserService} from "../user-service/user.service";
import {ShoppingCartInterface} from "./shopping-cart.interface";
import {UserInterface} from "../user-service/user.interface";
import {GuestService} from "../guest-service/guest.service";
import {CartItemInfoInterface} from "../global-interfaces/cart-item-info.interface";
import {DetailInterface} from "../detail-service/detail.interface";
import {MarkerService} from "../marker-service/marker.service";

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private userService: UserService, private guestService: GuestService,
              private markerService: MarkerService) {
  }

  itemsQuantity: number = 0
  totalCost: number = 0

  storage(): ShoppingCartInterface[]  {
    return !!localStorage.getItem('shopping_cart')
      ? JSON.parse(localStorage.getItem('shopping_cart')!) : []
  }

  toCurrency(price: number) {
    return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(price)
  }

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

  async changeQuantityItemUser(id: string, quantity: number, user: UserInterface): Promise<void> {
    user.shoppingCart = await this.userService.addCartItem({detailId: id, quantity})
    this.totalCost = user.shoppingCart.totalCost
    this.itemsQuantity = user.shoppingCart.cartItem.length
    const shoppingCart: ShoppingCartInterface[] = user.shoppingCart.cartItem
      .map(i => ({id: i.detail.id, quantity: i.quantity}))
    localStorage.setItem('shopping_cart', JSON.stringify(shoppingCart))
    this.userService.user$.next(user)
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

}

