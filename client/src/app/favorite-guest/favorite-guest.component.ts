import { Component, OnInit } from '@angular/core';
import {UserService} from "../shared/services-interfaces/user-service/user.service";
import {RecentlyViewedService} from "../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {MarkerService} from "../shared/services-interfaces/marker-service/marker.service";
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {DetailInterface} from "../shared/services-interfaces/detail-service/detail.interface";
import {Router} from "@angular/router";
import {DetailIdInterface} from "../shared/services-interfaces/global-interfaces/detail-id.interface";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-favorite-guest',
  templateUrl: './favorite-guest.component.html',
  styleUrls: ['./favorite-guest.component.scss']
})
export class FavoriteGuestComponent implements OnInit {

  constructor(private userService: UserService, public viewedService: RecentlyViewedService,
              public markerService: MarkerService, private detailService: DetailService,
              public cartService:ShoppingCartService, private router: Router) {
  }

  details: DetailInterface[] = []
  loading: boolean = true
  action: boolean = false

  defaultImage: string = '../../../../assets/catalog/not-have-photo.jpg'

  ngOnInit(): void {
    const user = this.userService.user$.getValue()
    if (user) {
      this.router.navigate(['/', 'user', 'my-favorites'])
      return
    }

    const ids: DetailIdInterface[] = this.markerService.getMarkStorage()
    if (!ids.length) return;

    this.detailService.getByIds(ids)
      .then(data => {
        this.details = data
        this.cartService.recountQuantity(this.details)
        this.loading = false
      }, error => {
        console.log(error);
        this.loading = false
      })

  }

  async increase(id: string, idx: number) {
    this.action = true
    await this.cartService.increase(this.details, idx)
    this.action = false
  }

  async decrease(id: string, idx: number) {
    this.action = true
    await this.cartService.decrease(this.details, idx)
    this.action = false
  }

  manualInput(event: Event, id: string, idx: number) {
    const $target = event.target as HTMLInputElement
    if (+$target.value < 1) {
      $target.value = '1'
    }
    this.details[idx].quantity = +$target.value
    if (this.cartService.check(id)) {
      this.action = true
      this.cartService.changes(id, +$target.value)
        .catch(error => {
          console.log(error);
          $target.value = '1'
          this.details[idx].quantity = 1
        })
        .finally(() => {
          this.action = false
        })
    }
  }


  addProduct(id: string, idx: number) {
    this.action = true
    this.cartService.addItem(id, this.details[idx].quantity)
      .catch((error: HttpErrorResponse) => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  removeFromFavorite(index: number) {
    this.markerService.markAndUnmark(this.details, this.details[index].id, index)
    this.details.splice(index, 1)
  }

}
