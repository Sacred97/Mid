import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgDynamicBreadcrumbService} from "ng-dynamic-breadcrumb";
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {
  FilterOptions,
  FilterRequest, FilterLetter, FilterSelected
} from "../shared/services-interfaces/global-interfaces/filter.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {MarkerService} from "../shared/services-interfaces/marker-service/marker.service";
import {DetailInterface} from "../shared/services-interfaces/detail-service/detail.interface";
import {RecentlyViewedService} from "../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminBanner} from "../admin/interfaces/admin-banner.interface";
import {BannersService} from "../shared/services-interfaces/banners-service/banners.service";


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit, OnDestroy {
  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private bannersService: BannersService,
              private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService,
              private detailService: DetailService,
              public shoppingService: ShoppingCartService,
              public markerService: MarkerService,
              public recentlyViewedService: RecentlyViewedService) {
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
    "variableWidth": true,
    "autoplay": true,
    "autoplaySpeed": 10000
  }

  slickInit(event: any) {
    setTimeout(() => {
      event.slick.setPosition()
    }, 500)
  }

  bannerMaxWidth: number = 996


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

  availability: boolean = false
  recent: boolean = false
  sale: boolean= false
  popular: boolean = false

  additionalFilterChange(variable: 'availability' | 'recent' | 'sale' | 'popular', label: string) {
    if (this[variable]) {
      this[variable] = false
      const idx: number = this.selectedFilters.findIndex(f => f.type === variable)
      if (idx >= 0) this.selectedFilters.splice(idx, 1)
    } else {
      this[variable] = true
      this.selectedFilters.push({type: variable, label: label, value: '-'})
    }

    this.afterChanges()
  }

  //-------------------------------------------------Фильтр-------------------------------------------------------------

  applicability: FilterOptions[] = []
  manufacturer: FilterOptions[] = []
  category: FilterOptions[] = []
  parts: FilterOptions[] = []

  selectedFilters: FilterSelected[] = []

  changesFilter(filter: FilterOptions[], idx: number, type: string): void {
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

  removeFilter(idx: number) {
    const type: string = this.selectedFilters[idx].type
    const value: string | number = this.selectedFilters[idx].value

    switch (type) {
      case 'category': this.removeMainFilter(this.category, value)
        break;
      case 'parts': this.removeMainFilter(this.parts, value)
        break;
      case 'applicability': this.removeMainFilter(this.applicability, value)
        break;
      case 'manufacturer': this.removeMainFilter(this.manufacturer, value)
        break;
      case 'letters': this.letters.forEach(l => l.checked = false)
        this.letter = ''
        break;
      case 'availability': this.availability = false
        break;
      case 'recent': this.recent = false
        break;
      case 'sale': this.sale = false
        break;
      case 'popular': this.popular = false
        break;
    }

    this.selectedFilters.splice(idx, 1)
    this.afterChanges()
    this.router.navigate([], {relativeTo: this.activatedRoute, queryParamsHandling: null})
  }

  clearFilter() {
    this.availability = false
    this.recent = false
    this.sale = false
    this.popular = false

    this.manufacturer.forEach(m => m.checked = false)
    this.category.forEach(c => c.checked = false)
    this.parts.forEach(p => p.checked = false)
    this.applicability.forEach(a => a.checked = false)

    this.sortByLetter = true
    this.sortByPrice = false
    this.sortByASC = true

    this.letters.forEach(l => l.checked = false)
    this.letter = ''

    this.selectedFilters = []
    this.afterChanges()
    this.router.navigate([], {relativeTo: this.activatedRoute, queryParamsHandling: null})
  }

  afterChanges(): void {
    const page: number = 1
    const isMore: boolean = false
    const offset: number = 0
    if (this.selectedFilters.length) {
      this.getDetailWithFilter(page, isMore, offset)
    } else {
      this.getDetailWithoutFilter(page, isMore, offset)
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
      this.getDetailWithFilter(1, false, 0)
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
        this.getDetailWithFilter(nextPage, onGetMore, offset)
      } else {
        this.getDetailWithoutFilter(nextPage, onGetMore, offset)
      }
      return
    }

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {p: nextPage},
      queryParamsHandling: "merge"
    }).then(() => {
      this.page = nextPage
      if (this.selectedFilters.length > 0) {
        this.getDetailWithFilter(nextPage, onGetMore, offset)
      } else {
        this.getDetailWithoutFilter(nextPage, onGetMore, offset)
      }
    })

  }

  getDetailWithFilter(page: number, onGetMore: boolean, offset: number) {
    const filter: FilterRequest[] = this.selectedFilters.map(f => ({type: f.type, value: f.value}))

    this.detailService.getWithFilter(filter, this.getSort(), this.getOrder(),
      this.availability, this.recent, this.sale, this.popular,
      this.letter , '', 20, offset
    )
      .then(data => {
        this.total = data.count
        this.page = page
        localStorage.setItem('page', page.toString())
        if (data.items.length) {
          this.paramsChange(data.items, onGetMore)
        } else {
          this.details = []
          this.errorMessage = 'Товар не найден'
        }
      }, (error: HttpErrorResponse) => {
        this.catalogErrorHandler(error)
      })
  }

  getDetailWithoutFilter(page: number, onGetMore: boolean, offset: number) {
    this.detailService.getMany(this.getSort(), this.getOrder(), 20, offset)
      .then(data => {
        this.total = data.count
        this.page = page
        localStorage.setItem('page', page.toString())
        if (data.items.length) {
          this.paramsChange(data.items, onGetMore)
        } else {
          this.details = []
          this.errorMessage = 'Товар не найден'
        }
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.catalogErrorHandler(error)
      })
  }

  private paramsChange(details: DetailInterface[], onGetMore: boolean) {
    this.shoppingService.recountQuantity(details)
    if (onGetMore) {
      this.details = this.details.concat(details)
    } else {
      this.details = details
    }
    this.offsetEnd = Math.ceil(this.total / 20) === this.page
  }

  private catalogErrorHandler(error: HttpErrorResponse) {
    if (error.error.statusCode === 500) {
      this.errorMessage = 'Соединение с сервером было разорвано, проверьте соединение с интернетом'
    } else {
      this.errorMessage = 'Произошла какая-то ошибка, повторите действие заново. ' +
        'Если ошибка повторилась, просьба сообщить нам, мы устраним ее как можно скорее.'
    }
    this.details = []
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  async ngOnInit() {
    this.bannerMaxWidth = (document.documentElement.clientWidth * 0.892) * 0.735
    const offset = (this.page * 20) - 20

    try {
      this.banners = await this.bannersService.getBannerForPage(false)
    } catch (error) {
      console.log(error);
    }

    try {
      const responseFilters = await this.detailService.getListFilters()
      this.category = responseFilters.category
      this.manufacturer = responseFilters.manufacturer
      this.parts = responseFilters.autoParts
      this.applicability = responseFilters.autoApplicability
    } catch (error) {
      console.log(error);
    }

    if (history.state.quickFilter) {
      switch (history.state.quickFilter) {
        case 'recent':
          this.additionalFilterChange("recent", 'Рекомендуемые')
          break;
        case 'popular':
          this.additionalFilterChange("popular", 'Новинки')
          break;
        case 'sale':
          this.additionalFilterChange("sale", 'По акции')
          break;
      }
    }

    if (history.state.usability) {
      const usability: string = history.state.usability
      const usabilityArr: string[] = usability.split(';').map(i => i.trim())
      usabilityArr.forEach(i => {
        let idx = 0
        const candidate = this.applicability.find((item, index) => {
          if (item.label === i) {
            idx = index
            return true
          }
          return false
        })
        if (candidate) {
          this.applicability[idx].checked = true
          this.selectedFilters.push({type: 'applicability', value: candidate.id, label: candidate.label})
        }
      })
    }

    if (history.state.filter) {
      const filter: string = history.state.filter
      let idx = 0
      let candidate = this.parts.find((i, index) => {
        if (i.label === filter) {
          idx = index
          return true
        }
        return false
      })
      if (candidate) {
        this.parts[idx].checked = true
        this.selectedFilters.push({type: 'parts', value: candidate.id, label: candidate.label})
      } else {
        candidate = this.category.find((i, index) => {
          if (i.label === filter) {
            idx = index
            return true
          }
          return false
        })
        if (candidate) {
          this.category[idx].checked = true
          this.selectedFilters.push({type: 'category', value: candidate.id, label: candidate.label})
        }
      }
    }

    if (this.selectedFilters.length) {
      this.getDetailWithFilter(this.page, false, offset)
    } else {
      this.getDetailWithoutFilter(this.page, false, offset)
    }

  }

  //-------------------------------------------Уничтожение компонента---------------------------------------------------

  ngOnDestroy(): void {
  }

  //---------------------------------------------Действия с товаром-----------------------------------------------------

  action: boolean = false

  mark(id: string, idx: number) {
    this.markerService.markAndUnmark(this.details, id, idx)
  }

  async increase(id: string, idx: number) {
    this.action = true
    if (this.shoppingService.check(id)) {
      await this.shoppingService.increase(this.details, idx)
      this.action = false
    } else {
      try {
        await this.shoppingService.addItem(id, this.details[idx].quantity)
        await this.shoppingService.increase(this.details, idx)
      } catch (error) {
        console.log(error);
      }
      this.action = false
    }
  }

  async decrease(id: string, idx: number) {
    this.action = true
    await this.shoppingService.decrease(this.details, idx)
    this.action = false
  }

  manualInput(event: Event, id: string, idx: number) {
    const $target = event.target as HTMLInputElement
    if (+$target.value < 1) {
      $target.value = '1'
    }
    this.details[idx].quantity = +$target.value
    if (this.shoppingService.check(id)) {
      this.action = true
      this.shoppingService.changes(id, +$target.value)
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
    this.shoppingService.addItem(id, this.details[idx].quantity)
      .catch((error: HttpErrorResponse) => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  //------------------------------------------Различные действия с DOM--------------------------------------------------

  displayMain: boolean = true
  searchFilterList: HTMLLIElement[] = []

  dropList(event: Event) {
    const $target = event.currentTarget as HTMLButtonElement
    const $parent = $target.parentElement
    if (!$parent) return
    const $list = $parent.querySelector('ul')
    if (!$list) return;
    this.classAction($list)
    this.classAction($target)
  }

  private classAction(el: Element): void {
    if (el.classList.contains('drop')) {
      el.classList.remove('drop')
    } else {
      el.classList.add('drop')
    }
  }

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

}
