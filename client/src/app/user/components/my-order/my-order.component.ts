import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {Router} from "@angular/router";
import {OrderInterface} from "../../../shared/services-interfaces/global-interfaces/order.interface";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {CartItemInfoInterface} from "../../../shared/services-interfaces/global-interfaces/cart-item-info.interface";

@Component({
  selector: 'app-my-order',
  templateUrl: './my-order.component.html',
  styleUrls: ['./my-order.component.scss']
})
export class MyOrderComponent implements OnInit {

  constructor(private userService: UserService, private router: Router,
              public cartService: ShoppingCartService) {
  }

  orders: OrderInterface[] = []
  loading: boolean = true
  error: boolean = false
  repeatOrderModal: boolean = false
  toRepeatOrder: OrderInterface | null = null

  ngOnInit(): void {

    if (!this.userService.user$.getValue()) this.router.navigate(['/'])

    this.userService.getAllUserOrders()
      .then(res => {
        this.orders = res
        this.loading = false
      }, error => {
        console.log(error);
        this.error = true
      })

  }

  prepareRepeatOrder(order: OrderInterface) {
    this.toRepeatOrder = order
    this.repeatOrderModal = true
  }

  async repeatOrder() {
    if (!this.toRepeatOrder) return
    try {
      await this.userService.cleanShoppingCart()
      const carts: CartItemInfoInterface[] = this.toRepeatOrder.orderItem
        .map(i => ({detailId: i.detailId, quantity: i.quantity}))
      await this.userService.addCartItem(carts)
      this.router.navigate(['/', 'shopping-cart'])
    } catch (error) {
      console.log(error);
    }

  }

  close() {
    this.toRepeatOrder = null
    this.repeatOrderModal = false
  }

}
