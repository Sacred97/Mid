import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {DetailService} from "../../../shared/services-interfaces/detail-service/detail.service";
import {NgDynamicBreadcrumbService} from "ng-dynamic-breadcrumb";
import {DetailInterface} from "../../../shared/services-interfaces/detail-service/detail.interface";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {RecentlyViewedService} from "../../../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {MarkerService} from "../../../shared/services-interfaces/marker-service/marker.service";
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private detailService: DetailService, private breadcrumbService: NgDynamicBreadcrumbService,
              public shoppingCartService: ShoppingCartService, public markerService: MarkerService,
              public viewedService: RecentlyViewedService, public userService: UserService) {
  }

  //-------------------------------------------------Слайдеры-----------------------------------------------------------

  detailSlideConfigMain = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "fade": true,
    "arrows": true,
    "autoplay": false,
    "infinite": false,
    "asNavFor": '.detail-cart-page-syncing-slider'
  };

  detailSlideConfigSyncing = {
    "slidesToShow": 4,
    "dots": false,
    "arrows": false,
    "autoplay": false,
    "infinite": false,
    "centerMode": false,
    "focusOnSelect": true,
    "asNavFor": '.detail-cart-page-main-slider',
    "variableWidth": true
  }

  detailsListSliderConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": false,
    "infinite": false,
    "variableWidth": true,
    "autoplay": true
  }

  defaultImg: string = '../../../../assets/general-icon/no-photo.jpg'

  //------------------------------------------Инициализация компонента--------------------------------------------------

  detail!: DetailInterface
  detailsByManufacturer: DetailInterface[] = []
  recentlyViewed: DetailInterface[] = []

  slideWidth: number = 0
  routeReady: boolean = false
  routeError: string = ''

  ngOnInit(): void {
    //-----------------------------------------Ширина слайдера товаров--------------------------------------------------

    if (window.innerWidth <= 1024) {
      this.slideWidth = Math.round(((window.innerWidth) * 0.892) / 3)
      if (window.innerWidth <= 614) {
        this.slideWidth = Math.round((window.innerWidth) * 0.892)
      }
    } else {
      this.slideWidth = Math.round(((window.innerWidth - 17) * 0.892) / 4)
    }

    //----------------------------------------------Получить товар------------------------------------------------------

    const id: string = this.activatedRoute.snapshot.params['id']
    this.detailService.getById(id).then(async (detail) => {
      if (!detail) return

      this.shoppingCartService.recountQuantity(detail)
      this.detail = detail

      if (!!detail.manufacturer) {
        try {
          this.detailsByManufacturer = await this.detailService.getRandomByManufacturer(detail.manufacturer.id)
          this.shoppingCartService.recountQuantity(this.detailsByManufacturer)
        } catch (error) {
          console.log(error);
          this.detailsByManufacturer = []
        }
      }

      this.routeReady = true
      window.scrollTo({behavior: "auto", top: 100})

      //-----------------------------------------Обновление быстрой навигации-------------------------------------------

      const manufacturerId = this.activatedRoute.snapshot.params['manufacturerId']

      if (manufacturerId) {
        const urls = [
          {label: 'Главная', url: '/'},
          {label: 'Производители', url: '/manufacturer'},
          {label: detail.manufacturer!.nameCompany, url: `/manufacturer/${manufacturerId}`},
          {label: detail.name, url: ''}
        ]
        this.breadcrumbService.updateBreadcrumb(urls)
        this.breadcrumbService.updateBreadcrumbLabels({
          customText: detail.manufacturer!.nameCompany, dynamicText: detail.name
        })
      } else {
        const urls = [
          {label: 'Главная', url: '/'},
          {label: 'Каталог', url: '/catalog'},
          {label: detail.name, url: ''}
        ]
        this.breadcrumbService.updateBreadcrumb(urls)
        this.breadcrumbService.updateBreadcrumbLabels({dynamicText: detail.name})
      }

    }, error => {
      console.log(error);
      this.routeError = 'Не удалось получить данные о товаре. Повторите попытку позже.'
      this.breadcrumbService.updateBreadcrumbLabels({dynamicText: 'Товар', customText: 'Производитель'})
    })

    //------------------------------------------Получить список товаров-------------------------------------------------

    this.viewedService.getRecentlyViewedDetails().then(details => {
      this.shoppingCartService.recountQuantity(details)
      this.recentlyViewed = details
    }, error => {
      console.log(error);
      this.recentlyViewed = []
    })

  }

  //---------------------------------------------Действия с товаром-----------------------------------------------------



  markBySingle() {
    this.markerService.markAndUnmark(this.detail, this.detail.id)
    const idxM: number = this.detailsByManufacturer.findIndex(i => i.id === this.detail.id)
    if (idxM >= 0) this.detailsByManufacturer[idxM].marked = this.detail.marked
    const idxRV: number = this.recentlyViewed.findIndex(i => i.id === this.detail.id)
    if (idxRV >= 0) this.recentlyViewed[idxRV].marked = this.detail.marked
  }

  markByArray(actionSubject: DetailInterface[], idx: number, dependedSubject: DetailInterface[]) {
    this.markerService.markAndUnmark(actionSubject, actionSubject[idx].id, idx)
    if (this.detail.id === actionSubject[idx].id) this.detail.marked = actionSubject[idx].marked
    const dependedIdx: number = dependedSubject.findIndex(i => i.id === actionSubject[idx].id)
    if (dependedIdx >= 0) dependedSubject[dependedIdx].marked = actionSubject[idx].marked
  }

  increaseByArray(actionSubject: DetailInterface[], idx: number, dependedSubject: DetailInterface[]) {
    this.shoppingCartService.increase(actionSubject, idx)
      .then(() => {
        this.recountAllQuantityByArray(actionSubject, idx, dependedSubject)
      }, error => {
        console.log(error);
      })
  }

  decreaseByArray(actionSubject: DetailInterface[], idx: number, dependedSubject: DetailInterface[]) {
    this.shoppingCartService.decrease(actionSubject, idx)
      .then(() => {
        this.recountAllQuantityByArray(actionSubject, idx, dependedSubject)
      }, error => {
        console.log(error);
      })
  }

  private recountAllQuantityByArray(actionSubject: DetailInterface[], idx: number, dependedSubject: DetailInterface[]) {
    const dependedIdx: number = dependedSubject.findIndex(i => i.id === actionSubject[idx].id)
    if (dependedIdx >= 0) dependedSubject[dependedIdx].quantity = actionSubject[idx].quantity
    if (this.detail.id === actionSubject[idx].id) this.detail.quantity = actionSubject[idx].quantity
  }

  increaseBySingle(): void {
    this.action = true
    const prev: number = this.detail.quantity || 1
    this.detail.quantity = prev + 1
    const check: boolean = this.shoppingCartService.check(this.detail.id)
    if (check) {
      this.changesInShoppingCartBySingle(prev)
      return;
    }
    this.recountAllProductsArray()
    this.action = false
  }

  private changesInShoppingCartBySingle(prev: number) {
    this.shoppingCartService.changes(this.detail.id, this.detail.quantity!)
      .catch(error => {
        console.log(error);
        this.detail.quantity = prev
      })
      .finally(() => {
        this.recountAllProductsArray()
        this.action = false
      })
  }

  decreaseBySingle(): void {
    this.action = true
    const prev: number = this.detail.quantity || 1
    const check: boolean = this.shoppingCartService.check(this.detail.id)

    if (this.detail.quantity! <= 1) {
      this.detail.quantity = 1
      if (check) {
        this.shoppingCartService.removeItem(this.detail.id)
          .catch(error => {
            console.log(error);
            this.detail.quantity = prev
          })
          .finally(() => {
            this.action = false
          })
        return;
      }
      this.action = false
      return
    }
    this.detail.quantity = this.detail.quantity! - 1
    if (check) {
      this.changesInShoppingCartBySingle(prev)
      return;
    }
    this.recountAllProductsArray()
    this.action = false
  }

  manualInputByArray(event: Event, actionSubject: DetailInterface[], idx: number, dependedSubject: DetailInterface[]) {
    let $target = event.target as HTMLInputElement
    if (+$target.value < 1) {
      $target.value = '1'
    }
    actionSubject[idx].quantity = +$target.value
    const dependedIdx: number = dependedSubject.findIndex(i => i.id === actionSubject[idx].id)
    if (dependedIdx >= 0) dependedSubject[dependedIdx].quantity = +$target.value
    if (actionSubject[idx].id === this.detail.id) this.detail.quantity = +$target.value
    if (this.shoppingCartService.check(actionSubject[idx].id)) {
      this.shoppingCartService.changes(actionSubject[idx].id, +$target.value)
        .catch((error) => {
          console.log(error);
          $target.value = '1'
          this.detail.quantity = 1
          this.recountAllProductsArray()
        })
    }
  }

  manualInputBySingle(event: Event) {
    this.action = true
    let $target = event.target as HTMLInputElement
    if (+$target.value < 1) {
      $target.value = '1'
    }
    this.detail.quantity = +$target.value
    if (this.shoppingCartService.check(this.detail.id)) {
      this.shoppingCartService.changes(this.detail.id, this.detail.quantity)
        .catch((error) => {
          console.log(error);
          $target.value = '1'
          this.detail.quantity = 1
        })
        .finally(() => {
          this.recountAllProductsArray()
          this.action = false
        })
      return;
    }
    this.recountAllProductsArray()
    this.action = false
  }

  addByArray(idx: number, details: DetailInterface[]) {
    details[idx].quantity = 1
    if (details[idx].id === this.detail.id) this.detail.quantity = 1
    this.shoppingCartService.addItem(details[idx].id, details[idx].quantity)
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.recountAllProductsArray()
      })
  }

  addBySingle() {
    this.action = true
    this.shoppingCartService.addItem(this.detail.id, this.detail.quantity)
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.recountAllProductsArray()
        this.action = false
      })
  }

  private recountAllProductsArray() {
    const idx = this.detailsByManufacturer.findIndex(item => item.id === this.detail.id)
    if (idx >= 0) this.detailsByManufacturer[idx].quantity = this.detail.quantity
    const idxWatched = this.recentlyViewed.findIndex(item => item.id === this.detail.id)
    if (idxWatched >= 0) this.recentlyViewed[idxWatched].quantity = this.detail.quantity
  }

  //------------------------------------------Различные действия с DOM--------------------------------------------------

  action: boolean = false

  description: boolean = true
  applicability: boolean = false
  certificate: boolean = false
  delivery: boolean = false
  payment: boolean = false

  dellinModal: boolean = false
  pekModal: boolean = false
  baikalModal: boolean = false
  iframeLoad: boolean = false

  notification: boolean = false
  notificationLoad: boolean = false
  notificationError: string = ''

  navigateToDetail(id: string) {
    this.router.navigate(['/'], {skipLocationChange: true})
      .then(() => {
        this.router.navigate(['/', 'catalog', id], {replaceUrl: true}).then(() => {
          this.viewedService.addToRecentlyViewed(id)
        })
      })
  }

  textInfoView(variable: 'description' | 'applicability' | 'certificate' | 'delivery' | 'payment') {
    this.description = false
    this.applicability = false
    this.certificate = false
    this.delivery = false
    this.payment = false

    this[variable] = true
  }

  closeModal() {
    this.iframeLoad = false
    this.dellinModal = false
    this.baikalModal = false
    this.pekModal = false
    this.notification = false
    this.notificationError = ''
  }

  getCityTo(): string {
    const city: { city: string, cityTo: string } = localStorage.getItem('city') ?
      JSON.parse(localStorage.getItem('city')!) : {city: 'Выберите город', cityTo: 'Ваш город'}
    return city.cityTo
  }

  subscribeOnDetail() {
    this.notification = true
    this.notificationLoad = true
    let user = this.userService.user$.getValue()
    if (!user) return
    this.action = true
    this.userService.addToWaitingList({detailId: this.detail.id})
      .then(data => {
        user!.waitingList = data
        this.userService.user$.next(user)
      }, error => {
        console.log(error);
        this.notificationError = 'Что-то пошло не так. Повторите попытку похжу'
      })
      .finally(() => {
        this.notificationLoad = false
        this.action = false
      })
  }

  unsubscribeOnDetail() {
    let user = this.userService.user$.getValue()
    if (!user) return;
    const item = user.waitingList.waitingItem.find(i => i.detail.id === this.detail.id)
    if (!item) return
    this.action = true
    this.userService.deleteFromWaitingList(item.id)
      .then(data => {
        user!.waitingList = data
      }, error => {
        console.log(error)
      })
      .finally(() => {
        this.action = false
      })
  }

  isSubscribing(): boolean {
    const user = this.userService.user$.getValue()
    if (!user) return false
    const item = user.waitingList.waitingItem.find(i => i.detail.id === this.detail.id)
    return !!item
  }

}
