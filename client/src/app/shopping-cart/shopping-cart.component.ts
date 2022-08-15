import {Component, OnInit} from '@angular/core';
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {UserService} from "../shared/services-interfaces/user-service/user.service";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {DetailInterface} from "../shared/services-interfaces/detail-service/detail.interface";
import {DetailIdInterface} from "../shared/services-interfaces/global-interfaces/detail-id.interface";
import {Router} from "@angular/router";
import {RecentlyViewedService} from "../shared/services-interfaces/recently-viewed-service/recently-viewed.service";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  constructor(private router: Router, private detailService: DetailService,
              public cartService: ShoppingCartService, public viewedService: RecentlyViewedService,
              public userService: UserService) {
  }

  //------------------------------------------------Сортировка (User)---------------------------------------------------

  sortByName: boolean = true
  sortByASC: boolean = true
  sortByDate: boolean = false

  sorting(name: boolean, date: boolean) {
    this.sortByName = name
    this.sortByDate = date
    this.sortByASC = !this.sortByASC

    if (this.sortByName) {
      this.details = this.details.sort((a, b) => a.name.localeCompare(b.name))
      if (!this.sortByASC) this.details = this.details.reverse()
    } else {
      let user = this.userService.user$.getValue()
      if (!user) return
      user.shoppingCart.cartItem = user.shoppingCart.cartItem.sort((a, b) => {
        let timeA = new Date(a.timeAdd).getTime()
        let timeB = new Date(b.timeAdd).getTime()
        return timeA > timeB ? 1 : timeA === timeB ? 0 : -1
      })
      if (!this.sortByASC) user.shoppingCart.cartItem = user.shoppingCart.cartItem.reverse()
      const res: DetailInterface[] = []
      user.shoppingCart.cartItem.forEach(i => {
        let item = this.details.find(d => d.id === i.detail.id)
        if (item) res.push(item)
      })
      this.details = res
    }

  }

  //--------------------------------------------Инициализация компонента------------------------------------------------

  details: DetailInterface[] = []
  totalWeight: number = 0
  errorMessage: string = ''

  async ngOnInit() {

    try {
      let user = this.userService.user$.getValue()
      if (user) {
        await this.cartService.recountTotalCostWithUserAndUpdatedPrices(user)
      } else {
        user = await this.userService.getUser()
        if (user) {
          await this.cartService.recountTotalCostWithUserAndUpdatedPrices(user)
        } else {
          await this.cartService.recountTotalCostWithGuest(this.cartService.storage())
        }
      }

      const ids: DetailIdInterface[] = this.cartService.storage().map(i => ({id: i.id}))

      const data = await this.detailService.getByIds(ids)
      if (!data.length) {
        this.errorMessage = 'Корзина пуста'
        return
      }
      this.cartService.recountQuantity(data)
      this.details = data.sort((a, b) => a.name.localeCompare(b.name))
      this.recountTotalWeight(data)
    } catch (error) {
      console.log(error);
      this.errorMessage = 'Что-то пошло не так. Повторите попытку позже'
      return
    }

  }

  //-----------------------------------------------Действия с товаром---------------------------------------------------
  action: boolean = false

  clearModal: boolean = false
  removeModal: boolean = false
  onRemove: {id: string, idx: number} | null = null
  modalError: string = ''

  increase(idx: number){
    this.action = true
    this.details[idx].quantity = this.details[idx].quantity! + 1
    this.cartService.changes(this.details[idx].id, this.details[idx].quantity!)
      .then(() => {
        this.recountTotalWeight(this.details)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  decrease(idx: number) {
    this.action = true
    if (this.details[idx].quantity! <= 1) {
      this.action = false
      return
    }
    this.details[idx].quantity = this.details[idx].quantity! - 1
    this.cartService.changes(this.details[idx].id, this.details[idx].quantity!)
      .then(() => {
        this.recountTotalWeight(this.details)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  manualInput(event: Event, idx: number) {
    this.action = true
    let $target = (event.target as HTMLInputElement)
    if (+$target.value < 1) {
      $target.value = '1'
    }
    this.details[idx].quantity = +$target.value
    this.cartService.changes(this.details[idx].id, +$target.value)
      .then(() => {
        this.recountTotalWeight(this.details)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  prepareOnRemove(id: string, idx: number) {
    this.removeModal = true
    this.onRemove = {id: id, idx: idx}
  }

  async removeItem() {
    if (!this.onRemove) return
    this.action = true
    try {
      await this.cartService.removeItem(this.onRemove.id)
    } catch (error) {
      console.log(error)
      this.action = false
      this.modalError = 'Что-то пошло не так. Повтортие попытку позже.'
      return
    }
    this.details.splice(this.onRemove.idx, 1)
    if (this.details.length < 1) this.errorMessage = 'Корзина пуста'
    this.removeModal = false
    this.action = false
    this.onRemove = null
    this.recountTotalWeight(this.details)
  }

  cancel() {
    this.onRemove = null
    this.removeModal = false
  }

  async clearShoppingCart() {
    this.action = true
    let user =  this.userService.user$.getValue()

    if (!!user) {
      try {
        user.shoppingCart = await this.userService.cleanShoppingCart()
        this.userService.user$.next(user)
      } catch (error) {
        console.log(error);
        this.modalError = 'Что-то пошло не так. Повтортие попытку позже.'
        this.action = false
        return
      }
    }

    this.cartService.totalCost = 0
    this.cartService.itemsQuantity = 0
    this.totalWeight = 0
    this.details = []
    localStorage.removeItem('shopping_cart')
    this.errorMessage = 'Корзина пуста'
    this.action = false
    this.clearModal = false
  }

  recountTotalWeight(details: DetailInterface[]) {
    this.totalWeight = +details.reduce((total, i) => {
      total = total + (i.weight * i.quantity!)
      return total
    }, 0).toFixed(3)
  }

  //-------------------------------------------------Действия с DOM-----------------------------------------------------

  modalErrorClose() {
    this.modalError = ''
    this.clearModal = false
    this.removeModal = false
    this.onRemove = null
  }

  makeOrder() {
    const user = this.userService.user$.getValue()
    if (!!user) {
      this.router.navigate(['/', 'shopping-cart', 'order-user'])
    } else {
      this.router.navigate(['/', 'shopping-cart', 'order'])
    }
  }

}
