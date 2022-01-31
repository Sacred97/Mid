import {Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {
  FilterOptions, FilterSelected, FilterRequest,
  FilterLetter
} from "../../../shared/services-interfaces/global-interfaces/filter.interface";
import {ManufacturerService} from "../../../shared/services-interfaces/manufacturer-service/manufacturer.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DetailInterface} from "../../../shared/services-interfaces/detail-service/detail.interface";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {ManufacturerInterface} from "../../../shared/services-interfaces/detail-service/manufacturer.interface";
import {NgDynamicBreadcrumbService} from "ng-dynamic-breadcrumb";
import {DetailService} from "../../../shared/services-interfaces/detail-service/detail.service";
import {RecentlyViewedService} from "../../../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MarkerService} from "../../../shared/services-interfaces/marker-service/marker.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-manufacturer-page',
  templateUrl: './manufacturer-page.component.html',
  styleUrls: ['./manufacturer-page.component.scss']
})
export class ManufacturerPageComponent implements OnInit {

  constructor(private manufacturerService: ManufacturerService, private detailService: DetailService,
              public shoppingService: ShoppingCartService, public viewedService: RecentlyViewedService,
              public markerService: MarkerService, private breadcrumb: NgDynamicBreadcrumbService,
              private activatedRoute: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {
  }

  @ViewChild('modalInfo') $info?: ElementRef
  @ViewChild('modalImage') $img?: ElementRef

  //--------------------------------------------------Слайдеры----------------------------------------------------------

  certificates = [
    '../../../../assets/manufacturer/default-manufacturer.jpg',
    '../../../../assets/manufacturer/default-manufacturer.jpg',
    '../../../../assets/manufacturer/default-manufacturer.jpg',
    '../../../../assets/manufacturer/default-manufacturer.jpg'
  ]

  banners = [
    '../../../assets/catalog/banner.jpg',
    '../../../assets/catalog/banner.jpg',
    '../../../assets/catalog/banner.jpg',
    '../../../assets/catalog/banner.jpg'
  ]

  certificateConfig = {
    "slidesToShow": 1,
    "dots": false,
    "arrows": true,
    "infinite": true,
    "centerMode": false,
    "variableWidth": false,
    "autoplay": false
  }

  bannersConfig = {
    "slidesToShow": 1,
    "dots": true,
    "arrows": true,
    "infinite": true,
    "centerMode": false,
    "variableWidth": false,
    "autoplay": false
  }

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

  //-------------------------------------------------Доп. фильтры-------------------------------------------------------

  availability: boolean = false
  recent: boolean = false
  sale: boolean = false
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

  //---------------------------------------------------Фильтры----------------------------------------------------------

  category: FilterOptions[] = []
  applicability: FilterOptions[] = []
  parts: FilterOptions[] = []

  selectedFilters: FilterSelected[] = []

  changesFilter(filter: FilterOptions[], idx: number, type: string) {
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
  }

  clearFilter() {
    this.availability = false
    this.recent = false
    this.sale = false
    this.popular = false

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
  }

  private removeMainFilter(filter: FilterOptions[], value: string | number) {
    const idx = filter.findIndex(i => i.id === value)
    filter[idx].checked = false
  }

  //------------------------------------------------Поиск товара--------------------------------------------------------

  searchList: DetailInterface[] = []

  search(event: Event) {
    this.searchList = []
    const query = (event.target as HTMLInputElement).value
    const filter: FilterRequest[] = this.assembleFilter()
    this.detailService.getWithFilter(
      filter, this.getSort(), this.getOrder(),
      this.availability, this.recent, this.sale, this.popular,
      query, '', 10, 0
    ).then(data => {
      this.searchList = data.items
    }, error => {
      console.log(error);
      this.searchList = []
    })
  }

  //----------------------------------------------Запросы на сервер-----------------------------------------------------

  details: DetailInterface[] = []
  total: number = 0
  offsetEnd: boolean = false
  page = 1
  errorMessage: string = ''
  defaultImage: string = '../../assets/catalog/not-have-photo.jpg'

  private afterChanges() {
    this.getDetails(1, false, 0)
    window.scrollTo({behavior: "smooth", top: 300})
  }

  nextDetails(nextPage: number, onGetMore: boolean) {
    const offset: number = (nextPage * 20) - 20
    this.getDetails(nextPage, onGetMore, offset)
    if (!onGetMore) window.scrollTo({behavior: "smooth", top: 300})
  }

  private getDetails(page: number, onGetMore: boolean, offset: number) {
    const filter: FilterRequest[] = this.assembleFilter()
    this.detailService.getWithFilter(
      filter, this.getSort(), this.getOrder(),
      this.availability, this.recent, this.sale, this.popular,
      this.letter, '', 20, offset
    )
      .then(data => {
        this.total = data.count
        this.page = page
        localStorage.setItem('m_page', page.toString())
        if (data.items.length) {
          this.paramsChange(data.items, onGetMore)
        } else {
          this.details = []
          this.errorMessage = 'Товар не найден'
        }
      }, error => {
        console.log(error);
        this.errorMessage = 'Произошла ошибка, повторите попытку позже.'
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

  private assembleFilter(): FilterRequest[] {
    const filter: FilterRequest[] = this.selectedFilters.map(f => ({type: f.type, value: f.value}))
    filter.push({type: 'manufacturer', value: this.manufacturerId})
    return filter
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  manufacturer: ManufacturerInterface | null = null
  manufacturerId: number = 0

  ngOnInit(): void {
    this.manufacturerId = +this.activatedRoute.snapshot.params['id']

    this.manufacturerService.getFilters(this.manufacturerId)
      .then(data => {
        this.category = data.category
        this.applicability = data.autoApplicability
        this.parts = data.autoParts
      }, error => {
        console.log(error);
      })

    this.manufacturerService.getManufacturerById(this.manufacturerId)
      .then(data => {
        this.breadcrumb.updateBreadcrumbLabels({dynamicText: data.nameCompany})
        this.manufacturer = data
      }, error => {
        console.log(error);
        console.log('Произошла ошибка, вас отправило назад')
        this.router.navigate(['/', 'manufacturer'])
      })

    this.page = Number(localStorage.getItem('m_page')) || 1
    const offset = (this.page * 20) - 20
    this.getDetails(this.page, false, offset)

  }

  //---------------------------------------------Действия с товаром-----------------------------------------------------

  action: boolean = false

  async increase(id: string, idx: number) {
    this.action = true
    await this.shoppingService.increase(this.details, idx)
    this.action = false
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

  mark(id: string, idx: number) {
    this.markerService.markAndUnmark(this.details, id, idx)
  }

  //------------------------------------------Различные действия с DOM--------------------------------------------------

  displayMain: boolean = true

  manufacturerInfoModal() {
    if (!this.manufacturer) return
    const $modal = this.$info?.nativeElement as HTMLDivElement
    $modal.style.display = 'flex'
  }

  openCertificate(event: Event) {
    const $target = event.target as HTMLElement
    if ($target.tagName.toLowerCase() !== 'img') return
    const src = ($target as HTMLImageElement).src
    const $modal = this.$img?.nativeElement as HTMLDivElement
    $modal.style.display = 'flex'
    const $modalImg = $modal.querySelector("img")
    $modalImg ? $modalImg.src = src : false;
  }

  closeModal(event: Event) {
    const $target = event.target as HTMLDivElement
    const $parent = $target.parentElement
    if (!$parent) return
    $parent.style.display = 'none'
  }

  dropList(event: Event) {
    const $target = event.currentTarget as HTMLButtonElement
    const $parent = $target.parentElement
    if (!$parent) return
    const $list = $parent.children.item($parent.children.length - 1)
    const $button = $parent.children.item(0)
    if (!$list || !$button) return;
    this.classAction($list)
    this.classAction($button)
  }

  private classAction(el: Element): void {
    if (el.classList.contains('drop')) {
      el.classList.remove('drop')
    } else {
      el.classList.add('drop')
    }
  }

  sanitize(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html)
  }

}
