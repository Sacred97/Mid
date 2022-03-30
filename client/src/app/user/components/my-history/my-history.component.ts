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

@Component({
  selector: 'app-my-history',
  templateUrl: './my-history.component.html',
  styleUrls: ['./my-history.component.scss']
})
export class MyHistoryComponent implements OnInit {

  constructor(private userService: UserService, private detailService: DetailService,
              public cartService: ShoppingCartService) { }

  user: UserInterface | null = null
  detailsInRequestHistory: DetailInterface[] = []
  details: DetailInterface[] = []

  action: boolean = false
  maxView: boolean = false

  async ngOnInit() {

    try {
      this.user = await this.userService.getProfile()
      this.user.requestHistory = this.user.requestHistory.reverse()
      const detailsId: DetailIdInterface[] = this.user.requestHistory
        .filter(i => !!i.detailCart)
        .map(i => ({id: i.detailCart!}))
      this.detailsInRequestHistory = await this.detailService.getByIds(detailsId)
    } catch (error) {
      console.log(error);
    }



  }

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
    const $target = event.currentTarget as HTMLButtonElement
    const $list = $target.parentElement
    if (!$list) return;
    if (this.maxView) {
      $list.classList.remove('drop')
      setTimeout(() => {
        this.maxView = !this.maxView
      }, 1400)
    } else {
      $list.classList.add('drop')
      this.maxView = !this.maxView
    }
  }

}
