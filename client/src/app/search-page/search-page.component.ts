import {Component, OnInit} from '@angular/core';
import {UserService} from "../shared/services-interfaces/user-service/user.service";
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DetailInterface} from "../shared/services-interfaces/detail-service/detail.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {
  AddRequestHistoryUser, RequestHistoryUserInterface,
  UpdateRequestHistoryUser,
  UserInterface
} from "../shared/services-interfaces/user-service/user.interface";
import {mergeMap, switchMap, tap} from "rxjs/operators";
import {of} from "rxjs";

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

  user = this.userService.user$.getValue()
  requestHistory: RequestHistoryUserInterface[] = []

  details: DetailInterface[] = []
  loading: boolean = true

  maxQuantityPages: number = window.innerWidth >= 420 ? 9 : 6

  totalQuantity: number = 0
  page: number = 1
  querySearch: string = this.activatedRoute.snapshot.queryParams['text']

  action: boolean = false

  ngOnInit() {

    this.detailService.search(this.querySearch, 20, 0)
      .pipe(
        switchMap(res => {
          this.details = res.items
          this.totalQuantity = res.count
          if (this.user) {
            return this.userService.getRequestHistoryObs()
          }
          return of(null)
        }),
        switchMap(res => {
          // тут не важно пустой массив или нет, у пользователя может быть его история поиска чистая,
          // самое главное проверить ответ не null ли, если null то пользователя нет
          if (res) {
            this.requestHistory = res
            return this.userService.addRequestHistory({requestString: this.querySearch, result: this.totalQuantity})
          }
          return of(null)
        })
      ).subscribe((res) => {
        this.loading = false
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.loading = false
      }, () => {})

  }

  nextPackage(pageNumber: number) {
    const offset = (pageNumber * 20) - 20
    const prevPage = this.page
    this.page = pageNumber
    this.detailService.search(this.querySearch, 20, offset)
      .subscribe(data => {
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

      const request = this.requestHistory[this.requestHistory.length - 1]
      const data: UpdateRequestHistoryUser = {id: request.id, detailCart: detailCart}
      this.userService.updateRequestHistory(data)
        .subscribe(res => {
          this.requestHistory = res
          this.router.navigate(['/', 'catalog', detailCart])
        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.router.navigate(['/', 'catalog', detailCart])
        })
    } else {
      this.router.navigate(['/', 'catalog', detailCart])
    }
  }

}
