import {Component, OnInit} from '@angular/core';
import {UserService} from "../shared/services-interfaces/user-service/user.service";
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DetailInterface} from "../shared/services-interfaces/detail-service/detail.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {
  AddRequestHistoryUser,
  UpdateRequestHistoryUser,
  UserInterface
} from "../shared/services-interfaces/user-service/user.interface";

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private userService: UserService, private detailService: DetailService,
              public cartService: ShoppingCartService) {
  }

  user: UserInterface | undefined = undefined

  details: DetailInterface[] = []
  loading: boolean = true

  maxQuantityPages: number = window.innerWidth >= 420 ? 9 : 6

  totalQuantity: number = 0
  page: number = 1
  querySearch: string = this.activatedRoute.snapshot.queryParams['text']

  action: boolean = false

  async ngOnInit() {

    try {
      this.user = await this.userService.getProfile()
    } catch (error) {
      console.log(error);
    }

    try {
      const response = await this.detailService.search(this.querySearch, 20, 0)
      this.loading = false
      this.details = response.items
      this.totalQuantity = response.count
    } catch (error) {
      console.log(error);
    }

    if (this.user) {
      try {
        const data: AddRequestHistoryUser = {requestString: this.querySearch, result: this.totalQuantity}
        this.user.requestHistory = await this.userService.addRequestHistory(data)
        this.userService.user$.next(this.user)
      } catch (error) {
        console.log(error);
      }
    }

  }

  nextPackage(pageNumber: number) {
    const offset = (pageNumber * 20) - 20
    const prevPage = this.page
    this.page = pageNumber
    this.detailService.search(this.querySearch, 20, offset)
      .then(data => {
        this.loading = false
        this.details = data.items
        this.totalQuantity = data.count
        window.scrollTo({behavior: "smooth", top: 300})
      }, (error : HttpErrorResponse) => {
        console.log(error);
        this.page = prevPage
      })
  }

  async toDetailCart(detailCart: string) {
    if (this.user) {
      try {
        const requestHistory = this.user.requestHistory[this.user.requestHistory.length - 1]
        const data: UpdateRequestHistoryUser = {id: requestHistory.id, detailCart: detailCart}
        this.user.requestHistory = await this.userService.updateRequestHistory(data)
        this.userService.user$.next(this.user)
        this.router.navigate(['/', 'catalog', detailCart])
      } catch (error) {
        console.log(error);
        this.router.navigate(['/', 'catalog', detailCart])
      }
    } else {
      this.router.navigate(['/', 'catalog', detailCart])
    }
  }

}
