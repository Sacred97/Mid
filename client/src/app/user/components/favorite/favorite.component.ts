import { Component, OnInit } from '@angular/core';
import {MarkerService} from "../../../shared/services-interfaces/marker-service/marker.service";
import {DetailInterface} from "../../../shared/services-interfaces/detail-service/detail.interface";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {DetailService} from "../../../shared/services-interfaces/detail-service/detail.service";
import {DetailIdInterface} from "../../../shared/services-interfaces/global-interfaces/detail-id.interface";
import {RecentlyViewedService} from "../../../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  constructor(public markerService: MarkerService, public cartService: ShoppingCartService,
              private detailService: DetailService, public viewedService: RecentlyViewedService) {
  }

  details: DetailInterface[] = []
  loading: boolean = true
  action: boolean = false

  defaultImage: string = '../../../../assets/catalog/not-have-photo.jpg'

  ngOnInit(): void {

    const ids: DetailIdInterface[] = this.markerService.getMarkStorage()
    if (!ids.length) return

    this.detailService.getByIds(ids)
      .then(data => {
        this.details = data
        this.cartService.recountQuantity(this.details)
      }, error => {
        console.log(error);
      })
      .finally(() => {
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
