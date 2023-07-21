import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {NgDynamicBreadcrumbService} from "ng-dynamic-breadcrumb";
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {
  FilterLetter,
  FilterOptions,
  FilterRequest,
  FilterSelected
} from "../shared/services-interfaces/global-interfaces/filter.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {MarkerService} from "../shared/services-interfaces/marker-service/marker.service";
import {DetailInterface} from "../shared/services-interfaces/detail-service/detail.interface";
import {RecentlyViewedService} from "../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AdminBanner} from "../admin/interfaces/admin-banner.interface";
import {BannersService} from "../shared/services-interfaces/banners-service/banners.service";
import {Subscription} from "rxjs";
import {ShoppingCartOfUserInterface} from "../shared/interfaces/shoppingCart/shoppingCartOfUser.interface";
import {TotalCostResponseInterface} from "../shared/interfaces/response/totalCostResponse.interface";
import {errorHandler, toCurrency} from "../shared/utils/helpers";


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private bannersService: BannersService,
              private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService,
              private detailService: DetailService,
              private shoppingService: ShoppingCartService,
              private markerService: MarkerService,
              private recentlyViewedService: RecentlyViewedService,
              private cdr: ChangeDetectorRef) {
  }

  @ViewChild('nav_panel') asideRef?: ElementRef

  //-------------------------------------------------Слайдер------------------------------------------------------------

  banners: AdminBanner[] = []

  bannersConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": true,
    "infinite": true,
    "variableWidth": false,
    "autoplay": true,
    "autoplaySpeed": 10000
  }

  slickInit(event: any) {
    setTimeout(() => {
      event.slick.setPosition()
    }, 500)
  }

  // bannerMaxWidth: number = 996

  maxQuantityViewPages: number = window.innerWidth >= 450 ? 9 : 7

  //-------------------------------------------------Сортировка---------------------------------------------------------

  sortByLetter: boolean = true
  sortByPrice: boolean = false
  sortByASC: boolean = true

  sorting(letter: boolean, price: boolean) {
    this.sortByLetter = letter
    this.sortByPrice = price
    this.sortByASC = !this.sortByASC

    this.afterChanges()
  }

  private getSort(): string {
    return this.sortByLetter ? 'name' : 'price'
  }

  private getOrder(): 'ASC' | 'DESC' {
    return this.sortByASC ? 'ASC' : 'DESC'
  }

  //-----------------------------------------Сортировка по первой букве-------------------------------------------------

  private CHAR_CODE: { start: number, end: number, exceptions: number[] } = {
    start: 1040, end: 1071, exceptions: [1049, 1066, 1067, 1068]
  }

  private letter: string = ''

  letters: FilterLetter[] = new Array(this.CHAR_CODE.end - this.CHAR_CODE.start + 1)
    .fill('')
    .map((_, index) => {
      const code: number = this.CHAR_CODE.start + index
      if (this.CHAR_CODE.exceptions.includes(code)) return ''
      return String.fromCharCode(code)
    })
    .filter(char => !!char)
    .map(char => ({label: 'Начинается с: ' + char, checked: false}))

  chooseLetter(idx: number) {
    this.letters.forEach(l => l.checked = false)
    this.letters[idx].checked = true
    const selectedIdx = this.selectedFilters.findIndex(f => f.type === 'letters')
    if (selectedIdx >= 0) this.selectedFilters.splice(selectedIdx, 1)
    this.selectedFilters.push({type: 'letters', label: this.letters[idx].label, value: '-'})
    this.letter = this.letters[idx].label.charAt(this.letters[idx].label.length - 1)

    this.afterChanges()
  }

  //-----------------------------------------------Доп. фильтр----------------------------------------------------------

  additionalFilters: {[key: string]: {label: string, filterItems: FilterOptions[]}} = {
    additional: {label: 'Наличие товара', filterItems: [
        {id: 'availability', label: 'В наличии', checked: false, count_detail: ''},
        {id: 'recent', label: 'Рекомендуем', checked: false, count_detail: ''},
        {id: 'sale', label: 'Акции', checked: false, count_detail: ''},
        {id: 'popular', label: 'Новинки', checked: false, count_detail: ''},
      ]}
  }

  additionalFilterChanges(event: any) {

    if (event.filterList[event.index].checked) {
      event.filterList[event.index].checked = false
      const idx: number = this.selectedFilters.findIndex(f => f.type === event.filterList[event.index].id)
      if (idx >= 0) this.selectedFilters.splice(idx, 1)
    } else {
      event.filterList[event.index].checked = true
      this.selectedFilters.push({
        type: event.filterList[event.index].id,
        label: event.filterList[event.index].label,
        value: '-'})
    }

    this.afterChanges()
  }

  //-------------------------------------------------Фильтр-------------------------------------------------------------

  filters: {[key: string]: {label: string, filterItems: FilterOptions[]}} = {}

  selectedFilters: FilterSelected[] = []

  pushFilterToSelected(filter: FilterOptions[], idx: number, type: string): void {
    if (filter[idx].checked) {
      filter[idx].checked = false
      const selectedIdx = this.selectedFilters.findIndex(f => f.type === type && f.value === filter[idx].id)
      if (selectedIdx >= 0) this.selectedFilters.splice(selectedIdx, 1)
    } else {
      filter[idx].checked = true
      this.selectedFilters.push({type: type, label: filter[idx].label, value: filter[idx].id})
    }

    this.afterChanges()
  }

  filterChanges(event: any) {
    console.log(event);
    console.log(event.filterList)
    this.pushFilterToSelected(event.filterList, event.index, event.name)
  }

  removeFilter(idx: number) {
    const type: string = this.selectedFilters[idx].type
    const value: string | number = this.selectedFilters[idx].value

    switch (type) {
      case 'category': this.removeMainFilter(this.filters.category.filterItems, value)
        break;
      case 'parts': this.removeMainFilter(this.filters.parts.filterItems, value)
        break;
      case 'applicability': this.removeMainFilter(this.filters.applicability.filterItems, value)
        break;
      case 'manufacturer': this.removeMainFilter(this.filters.manufacturer.filterItems, value)
        break;
      case 'letters': this.letters.forEach(l => l.checked = false)
        this.letter = ''
        break;
    }

    this.selectedFilters.splice(idx, 1)
    this.afterChanges()
    this.router.navigate([], {relativeTo: this.activatedRoute, queryParamsHandling: null})
    this.cdr.detectChanges()
  }

  clearFilter() {

    this.additionalFilters.additional.filterItems = this.additionalFilters.additional.filterItems
      .map(i => ({...i, checked: false}))

    this.filters.manufacturer.filterItems = this.filters.manufacturer.filterItems.map(i => ({...i, checked: false}))
    this.filters.category.filterItems = this.filters.category.filterItems.map(i => ({...i, checked: false}))
    this.filters.parts.filterItems = this.filters.parts.filterItems.map(i => ({...i, checked: false}))
    this.filters.applicability.filterItems = this.filters.applicability.filterItems.map(i => ({...i, checked: false}))

    this.sortByLetter = true
    this.sortByPrice = false
    this.sortByASC = true

    this.letters.forEach(l => l.checked = false)
    this.letter = ''

    this.selectedFilters = []
    this.afterChanges()
    this.router.navigate([], {relativeTo: this.activatedRoute, queryParamsHandling: null})
    this.cdr.detectChanges()
  }

  afterChanges(): void {
    const page: number = 1
    const isMore: boolean = false
    const offset: number = 0
    if (this.selectedFilters.length) {
      this.getDetailWithFilterObs(page, isMore, offset)
    } else {
      this.getDetailWithoutFilterObs(page, isMore, offset)
    }

    window.scrollTo({behavior: "smooth", top: 300})
  }

  private removeMainFilter(filter: FilterOptions[], value: string | number) {
    const idx = filter.findIndex(i => i.id === value)
    filter[idx].checked = false
  }

  //-----------------------------------------------Поиск товара---------------------------------------------------------


  search(event: Event) {
    const query = (event.target as HTMLInputElement).value
    if (!query) return

    // Отключаем букву если она есть
    const letterCandidateIdx = this.letters.findIndex(i => i.checked = true)
    if (letterCandidateIdx >= 0) this.letters[letterCandidateIdx].checked = false
    // Чистим слово или букву, под типом letters может быть и Слово поиска (query)
    const selectedCandidateIdx = this.selectedFilters.findIndex(i => i.type === 'letters')
    if (selectedCandidateIdx >= 0) this.removeFilter(selectedCandidateIdx)

    this.selectedFilters.push({type: 'letters', label: 'Поиск: ' + query, value: '-'})
    this.letter = query
    this.router.navigate([], {
      relativeTo: this.activatedRoute, queryParams: null, queryParamsHandling: null
    }).then(() => {
      this.page = 1
      this.getDetailWithFilterObs(1, false, 0)
    })

  }

  //---------------------------------------------Запросы на сервер------------------------------------------------------
  details: DetailInterface[] = []
  total: number = 0
  offsetEnd: boolean = false
  page: number = this.activatedRoute.snapshot.queryParams['p'] ? +this.activatedRoute.snapshot.queryParams['p'] : 1
  errorMessage: string = ''
  defaultImage: string = '../../assets/catalog/not-have-photo.jpg'

  changePage(nextPage: number, onGetMore: boolean) {
    const offset: number = (nextPage * 20) - 20

    if (onGetMore) {
      if (this.selectedFilters.length > 0) {
        this.getDetailWithFilterObs(nextPage, onGetMore, offset)
      } else {
        this.getDetailWithoutFilterObs(nextPage, onGetMore, offset)
      }
      return
    }

    // this.router.navigate([], {
    //   relativeTo: this.activatedRoute,
    //   queryParams: {p: nextPage},
    //   queryParamsHandling: "merge"
    // }).then(() => {
    //   this.page = nextPage
    //   if (this.selectedFilters.length > 0) {
    //     this.getDetailWithFilter(nextPage, onGetMore, offset)
    //   } else {
    //     this.getDetailWithoutFilter(nextPage, onGetMore, offset)
    //   }
    // })

    this.page = nextPage
    if (this.selectedFilters.length > 0) {
      this.getDetailWithFilterObs(nextPage, onGetMore, offset)
    } else {
      this.getDetailWithoutFilterObs(nextPage, onGetMore, offset)
    }

  }

  choicePage(nextPage: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {p: nextPage},
      queryParamsHandling: "merge"
    })
  }

  getDetailWithFilterObs(page: number, onGetMore: boolean, offset: number) {
    const filter: FilterRequest[] = this.selectedFilters.map(f => ({type: f.type, value: f.value}))
    const availability = this.additionalFilters.additional.filterItems[0].checked!
    const recent = this.additionalFilters.additional.filterItems[1].checked!
    const sale = this.additionalFilters.additional.filterItems[2].checked!
    const popular = this.additionalFilters.additional.filterItems[3].checked!

    this.detailService.getWithFilterObs(filter, this.getSort(), this.getOrder(), availability, recent, sale, popular,
      this.letter, '', 20, offset
    ).subscribe(data => {
      this.setDataToComponent(data.items, data.count, page, onGetMore)
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.errorMessage = errorHandler(error)
      this.details = []
    })
  }

  getDetailWithoutFilterObs(page: number, onGetMore: boolean, offset: number) {
    this.detailService.getManyObs(this.getSort(), this.getOrder(), 20, offset)
      .subscribe(data => {
        this.setDataToComponent(data.items, data.count, page, onGetMore)
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.errorMessage = errorHandler(error)
        this.details = []
      })
  }

  private paramsChange(details: DetailInterface[], onGetMore: boolean) {
    if (onGetMore) {
      this.details = this.details.concat(details)
    } else {
      this.details = details
    }
    this.offsetEnd = Math.ceil(this.total / 20) === this.page
  }

  private setDataToComponent(product: DetailInterface[], count: number, page: number, onGetMore: boolean) {
    this.total = count
    this.page = page
    localStorage.setItem('page', page.toString())
    if (product.length) {
      this.paramsChange(product, onGetMore)
    } else {
      this.details = []
      this.errorMessage = 'Товар не найден'
    }
    this.cdr.markForCheck()
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  queryParamsCheck$: Subscription | undefined

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe(query => {
      if (query && query.p) this.changePage(query.p, false)
    })

    // this.bannerMaxWidth = (document.documentElement.clientWidth * 0.892) * 0.735
    const offset = (this.page * 20) - 20

    try {
      this.banners = await this.bannersService.getBannerForPage(false)
    } catch (error) {
      console.log(error);
    }

    try {
      const responseFilters = await this.detailService.getListFilters()

      this.filters = {
        category: {label: 'Категория товара', filterItems: responseFilters.category},
        parts: {label: 'Автомобильная группа', filterItems: responseFilters.autoParts},
        manufacturer: {label: 'Производитель', filterItems: responseFilters.manufacturer},
        applicability: {label: 'Применяемость', filterItems: responseFilters.autoApplicability},
      }

    } catch (error) {
      console.log(error);
    }

    if (history.state.quickFilter) {
      switch (history.state.quickFilter) {
        case 'recent':
          this.additionalFilterChanges(
            {filterList: this.additionalFilters.additional.filterItems, index: 1, name: 'additional'}
            )
          break;
        case 'popular':
          this.additionalFilterChanges(
            {filterList: this.additionalFilters.additional.filterItems, index: 3, name: 'additional'}
            )
          break;
        case 'sale':
          this.additionalFilterChanges(
            {filterList: this.additionalFilters.additional.filterItems, index: 2, name: 'additional'}
            )
          break;
      }
    }

    if (history.state.usability) {
      const usability: string = history.state.usability
      const usabilityArr: string[] = usability.split(';').map(i => i.trim())
      usabilityArr.forEach(i => {
        let idx = 0
        const candidate = this.filters.applicability.filterItems.find((item, index) => {
          if (item.label === i) {
            idx = index
            return true
          }
          return false
        })
        if (candidate) {
          this.filters.applicability.filterItems[idx].checked = true
          this.selectedFilters.push({type: 'applicability', value: candidate.id, label: candidate.label})
        }
      })
    }

    if (history.state.filter) {
      const filter: string = history.state.filter
      let idx = 0
      let candidate = this.filters.parts.filterItems.find((i, index) => {
        if (i.label === filter) {
          idx = index
          return true
        }
        return false
      })
      if (candidate) {
        this.filters.parts.filterItems[idx].checked = true
        this.selectedFilters.push({type: 'parts', value: candidate.id, label: candidate.label})
      } else {
        candidate = this.filters.category.filterItems.find((i, index) => {
          if (i.label === filter) {
            idx = index
            return true
          }
          return false
        })
        if (candidate) {
          this.filters.category.filterItems[idx].checked = true
          this.selectedFilters.push({type: 'category', value: candidate.id, label: candidate.label})
        }
      }
    }

    if (this.selectedFilters.length) {
      this.getDetailWithFilterObs(this.page, false, offset)
    } else {
      this.getDetailWithoutFilterObs(this.page, false, offset)
    }

    this.cdr.detectChanges()
  }

  //-------------------------------------------Уничтожение компонента---------------------------------------------------

  ngOnDestroy(): void {
    this.queryParamsCheck$?.unsubscribe()
  }

  //---------------------------------------------Действия с товаром-----------------------------------------------------

  action: boolean = false

  mark(id: string, idx: number) {
    this.markerService.markAndUnmark(this.details, id, idx)
    this.cdr.markForCheck()
  }

  manualInput(event: Event, id: string, idx: number) {
    const $target = event.target as HTMLInputElement
    let quantity = +$target.value
    if (quantity < 1) {
      $target.value = '1'
      quantity = 1
    }
    this.increaseDecrease(id, idx, quantity)
  }

  increaseDecrease(id: string, idx: number, quantity: number) {
    this.action = true
    const prev = this.details[idx].quantity
    this.details[idx].quantity = quantity
    if (this.shoppingService.checkObs(id)) {
      this.shoppingService.changeQuantityItemObs(this.details, idx, prev)
        .subscribe(res => {
          this.detectChangesAfterRequest()
        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.detectChangesAfterRequest()
        })
    } else {
      this.shoppingService.addItemObs(id, this.details[idx].quantity)
        .subscribe(res => {
          this.detectChangesAfterRequest()
        }, (error: HttpErrorResponse) => {
          console.log(error);
          this.detectChangesAfterRequest()
        })
    }

  }

  addProduct(id: string, idx: number) {
    this.action = true
    this.shoppingService.addItemObs(id, this.details[idx].quantity)
      .subscribe(res => {
        this.detectChangesAfterRequest()
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.detectChangesAfterRequest()
      })
  }

  private detectChangesAfterRequest() {
    this.action = false
    this.cdr.markForCheck()
  }

  toRecentlyViewed(productId: string) {
    this.recentlyViewedService.addToRecentlyViewed(productId)
  }

  //------------------------------------------Различные действия с DOM--------------------------------------------------

  displayMain: boolean = true
  searchFilterList: HTMLLIElement[] = []

  searchFilter(event: Event) {
    this.searchFilterList = []
    const query = (event.target as HTMLInputElement).value
    if (!query) return;
    const $aside = this.asideRef?.nativeElement as HTMLDivElement
    const $list = $aside.querySelectorAll('li[data-filter]')
    $list.forEach(el => {

      const li = el as HTMLLIElement
      const dataset = li.dataset.filter
      const matching: boolean = dataset!.toLowerCase().includes(query.toLowerCase())
      if (!matching) return
      this.searchFilterList.push(li)
    })
    console.log(this.searchFilterList);
  }

  toFilter($el: HTMLLIElement) {
    const $list = $el.parentElement
    if (!$list) return
    const $parent = $list.parentElement
    if (!$parent) return;
    const $button = $parent.querySelector('button')
    if (!$button) return;

    if (!$list.classList.contains('drop')) $list.classList.add('drop')
    if (!$button.classList.contains('drop')) $button.classList.add('drop')
    setTimeout(() => {
      $el.scrollIntoView({behavior: "smooth", block: "center"})
      $el.classList.add('helper')
      setTimeout(() => {
        $el.classList.remove('helper')
      }, 5000)
    }, 500)

  }

  dropFilter(event: Event) {
    const $target = this.asideRef?.nativeElement as HTMLDivElement
    console.log($target.style.maxHeight);
    if ($target.style.maxHeight == '370px') {
      $target.style.maxHeight = '0px'
    } else {
      $target.style.maxHeight = '370px'
    }
  }

  getFilterKey(filter: {[key: string]: {label: string, filterItems: FilterOptions[]}}) {
    return Object.keys(filter)
  }

  getCurrency(value: number) {
    return toCurrency(value)
  }

  isCheck(productId: string) {
    return this.shoppingService.checkObs(productId)
  }

}
