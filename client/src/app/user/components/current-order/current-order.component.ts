import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {OrderInterface} from "../../../shared/services-interfaces/global-interfaces/order.interface";
import {DetailInterface} from "../../../shared/services-interfaces/detail-service/detail.interface";
import {DetailService} from "../../../shared/services-interfaces/detail-service/detail.service";
import {DetailIdInterface} from "../../../shared/services-interfaces/global-interfaces/detail-id.interface";
import {UserInterface} from "../../../shared/services-interfaces/user-service/user.interface";

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.scss']
})
export class CurrentOrderComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private detailService: DetailService, private userService: UserService,
              public cartService: ShoppingCartService) {
  }

  user: UserInterface | undefined = this.userService.user$.getValue()
  order: OrderInterface | null | undefined = null
  error: boolean = false
  id: number = +this.activatedRoute.snapshot.params['id']
  details: DetailInterface[] = []
  defaultImg: string = '../../../../assets/catalog/not-have-photo.jpg'



  async ngOnInit() {
    if (!this.user) {
      this.router.navigate(['/'])
      return
    }

    // this.order = this.user.order.find(i => i.id === this.id)
    // if (!this.order) {
    //   this.error = true
    //   return
    // }

    try {
      this.order = await this.userService.getUserOrder(this.id)
      const ids: DetailIdInterface[] = this.order.orderItem.map(i => ({id: i.detailId}))
      this.detailService.getByIds(ids)
        .then(data => {
          this.details = data
        }, error => {
          console.log(error);
        })
    } catch (e) {
      console.log(e);
      this.error = true
    }

  }

  getPhotoDetail(detailId: string): string {
    if (!this.details.length) return this.defaultImg
    const detail = this.details.find(i => i.id === detailId)
    if (!detail) return this.defaultImg
    if (!detail.photoDetail.length) return this.defaultImg
    return detail.photoDetail[0].url
  }

}
