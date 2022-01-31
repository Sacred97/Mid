import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {GuestService} from "../services-interfaces/guest-service/guest.service";
import {ShoppingCartService} from "../services-interfaces/shopping-cart-service/shopping-cart.service";
import {CartItemInfoInterface} from "../services-interfaces/global-interfaces/cart-item-info.interface";

@Injectable({
  providedIn: 'root'
})
export class GuestCostGuard implements CanActivate {

  constructor(private router: Router, private guestService: GuestService,
              private cartService: ShoppingCartService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    const ids: CartItemInfoInterface[] = this.cartService.storage().map(i => ({detailId: i.id, quantity: i.quantity}))
    return this.guestService.recountTotalCost(ids)
      .then(res => {
        this.cartService.totalCost = res.totalCost
        if (res.totalCost <= 999) {
          this.router.navigate(['/', 'shopping-cart'])
          return false
        }
        return true
      }, error => {
        console.log(error);
        return false
      })

  }

}
