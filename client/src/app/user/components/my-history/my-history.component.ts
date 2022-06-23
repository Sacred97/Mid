import { Component, OnInit } from '@angular/core';
import {
  RequestHistoryUserInterface,
  UserInterface
} from "../../../shared/services-interfaces/user-service/user.interface";
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {DetailService} from "../../../shared/services-interfaces/detail-service/detail.service";
import {DetailInterface} from "../../../shared/services-interfaces/detail-service/detail.interface";
import {DetailIdInterface} from "../../../shared/services-interfaces/global-interfaces/detail-id.interface";
import {RecentlyViewedService} from "../../../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MarkerService} from "../../../shared/services-interfaces/marker-service/marker.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.scss']
})
export class MyHistoryComponent implements OnInit {

  constructor(private userService: UserService, private detailService: DetailService, private router: Router,
              public cartService: ShoppingCartService, private viewedService: RecentlyViewedService,
              private markerService: MarkerService) {
  }

  defaultImage: string = '../../../../assets/catalog/not-have-photo.jpg'

  user: UserInterface | undefined = this.userService.user$.getValue()
  detailsInRequestHistory: DetailInterface[] = []
  details: DetailInterface[] = []

  action: boolean = false
  maxView: boolean = false

  async ngOnInit() {
    if (!this.user) {
      this.router.navigate(['/'])
      return
    }
    this.user.requestHistory = this.user.requestHistory.reverse()
    const detailsId: DetailIdInterface[] = this.user.requestHistory
      .filter(i => !!i.detailCart)
      .map(i => ({id: i.detailCart!}))

    try {
      this.detailsInRequestHistory = await this.detailService.getByIds(detailsId)
    } catch (error) {
      console.log(error);
    }

    try {
      this.details = await this.viewedService.getRecentlyViewedDetails()
      this.cartService.recountQuantity(this.details)
    } catch (error) {
      console.log(error);
    }

  }

  //--------------------------------------------------------------------------------------------------------------------

  mark(id: string, idx: number) {
    this.markerService.markAndUnmark(this.details, id, idx)
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

  //--------------------------------------------------------------------------------------------------------------------

  getCurrentDay() {
    const date = new Date()
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
  }

  getDay(time: string) {
    const date = new Date(time)
    return date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()
  }

  getTime(time: string) {
    const date = new Date(time)
    const hours = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
    const minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
    return hours + ':' + minutes
  }

  getDetailName(detailId: string) {
    let detail = this.detailsInRequestHistory.find(i => i.id === detailId)
    if (detail) return detail.name
    return 'Код товара: ' + detailId
  }

  getRequestHistory(requestHistory: RequestHistoryUserInterface[]) {
    if (requestHistory.length < 3) return requestHistory
    if (this.maxView) return requestHistory
    return [requestHistory[0], requestHistory[1]]
  }

  dropDownHistory(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement)
    const $parent = $target.parentElement
    if (!$parent) return;
    if (this.maxView) {
      $parent.classList.remove('drop')
      setTimeout(() => {
        this.maxView = !this.maxView
      }, 1400)
    } else {
      $parent.classList.add('drop')
      this.maxView = !this.maxView
    }
  }

}
