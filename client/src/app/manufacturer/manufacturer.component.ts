import { Component, OnInit } from '@angular/core';
import {
  LocationFilters,
  LocationInterface,
  LocationLetterInterface
} from "../shared/services-interfaces/global-interfaces/filter.interface";
import {CharCodeInterface} from "../shared/services-interfaces/global-interfaces/general.interfaces";
import {
  FilterManufacturerInterface,
  SearchManufacturerInterface
} from "../shared/services-interfaces/manufacturer-service/manufacturer-response.interfaces";
import {ManufacturerService} from "../shared/services-interfaces/manufacturer-service/manufacturer.service";

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.scss']
})
export class ManufacturerComponent implements OnInit {

  constructor(private manufacturerService: ManufacturerService) {
  }

  private CHAR_CODE_LATIN: CharCodeInterface = {
    start: 65, end: 90, exceptions: [88]
  }
  latin: LocationLetterInterface[] = new Array(
    this.CHAR_CODE_LATIN.end - this.CHAR_CODE_LATIN.start + 1
  )
    .fill('')
    .map((_, index) => {
      const code: number = this.CHAR_CODE_LATIN.start + index
      if (this.CHAR_CODE_LATIN.exceptions.includes(code)) return ''
      return String.fromCharCode(code)
    })
    .filter(char => !!char)
    .map(char => ({symbol: char, checked: false}))

  private CHAR_CODE_CYRILLIC: CharCodeInterface  = {
    start: 1040, end: 1071, exceptions: [1046, 1049, 1062, 1065, 1066, 1067, 1068, 1070]
  }
  cyrillic: LocationLetterInterface[] = new Array(
    this.CHAR_CODE_CYRILLIC.end - this.CHAR_CODE_CYRILLIC.start + 1
  )
    .fill('')
    .map((_, index) => {
      const code: number = this.CHAR_CODE_CYRILLIC.start + index
      if (this.CHAR_CODE_CYRILLIC.exceptions.includes(code)) return ''
      return String.fromCharCode(code)
    })
    .filter(char => !!char)
    .map(char => ({symbol: char, checked: false}))

  filter: LocationInterface = {region: 0, country: 0, letter: ''}

  region: LocationFilters[] = []
  country: LocationFilters[] = []

  searchList: SearchManufacturerInterface[] = []
  manufacturers: FilterManufacturerInterface[] = []
  errorMessage: string = ''

  max: boolean = false
  action: boolean = false
  total: number = 0
  page: number = 1

  ngOnInit(): void {
    this.request(this.filter, 0, 24)

    this.manufacturerService.getRegions()
      .then(data => {
        this.region = data.map(r => ({id: r.id, label: r.region}))
      })
  }

  private request(data: LocationInterface, offset: number, limit: number, getMore: boolean = false) {
    this.manufacturerService.getWithFilter(data, offset, limit)
      .then(data => {
        console.log(data.items)
        this.total = data.count
        this.max = this.page === Math.ceil(this.total / 24)
        if (getMore) {
          this.manufacturers = this.manufacturers.concat(data.items)
        } else {
          this.manufacturers = data.items
        }
      }, error => {
        console.log(error);
        this.manufacturers = []
        this.errorMessage = 'Что-то пошло не так, повторите попытку позже.'
      })
      .finally(() => {
        this.action = false
      })
  }

  getMoreManufacturer() {
    this.action = true
    this.page = this.page + 1
    const offset: number = (this.page * 24) - 24
    this.request(this.filter, offset, 24, true)
  }

  letterChange(writing: LocationLetterInterface[], idx: number) {
    this.latin.forEach(l => l.checked = false)
    this.cyrillic.forEach(l => l.checked = false)
    writing[idx].checked = true
    this.filter.letter = writing[idx].symbol
    this.request(this.filter, 0, 24)
  }

  removeLetter() {
    if (!this.filter.letter) return
    this.latin.forEach(l => l.checked = false)
    this.cyrillic.forEach(l => l.checked = false)
    this.filter.letter = ''
    this.page = 1
    this.request(this.filter, 0, 24)
  }

  chooseRegion(idx: number, event: Event): void {
    if (this.filter.region === this.region[idx].id) {
      this.filter.region = 0
      this.country = []
    } else {
      this.filter.region = this.region[idx].id
      this.manufacturerService.getCountries(this.filter.region)
        .then(data => {
          this.country = data.map(c => ({id: c.id, label: c.country}))
            .sort((a, b) => {
              return a.label > b.label ? 1 : a.label < b.label ? -1 : 0
            })
        }, error => {
          console.log(error);
          this.country = []
        })
    }
    this.filter.country = 0
    this.page = 1
    this.removeClass(event)
    this.request(this.filter, 0, 24)
  }

  chooseCountry(idx: number, event: Event): void {
    if (this.filter.country === this.country[idx].id) {
      this.filter.country = 0
    } else {
      this.filter.country = this.country[idx].id
    }
    this.removeClass(event)
    this.request(this.filter, 0, 24)
  }

  private removeClass(event: Event) {
    const $target = event.currentTarget as HTMLLIElement
    const $parent = $target.parentElement!.parentElement
    const arrow = $parent!.children.item(0)!
      .children.item($parent!.children.item(0)!.children.length - 1)
    arrow!.classList.remove('drop')
    const list = $parent!.children.item($parent!.children.length - 1)!
    list!.classList.remove('drop')
  }

  searchManufacturer(event: Event) {
    const $target = event.target as HTMLInputElement
    if (!$target.value.trim()) {
      this.searchList = []
      return
    }
    this.manufacturerService.search($target.value.trim())
      .then(data => {
        console.log(data);
        this.searchList = data
      }, error => {
        console.log(error);
      })
  }

  dropDown(event: Event) {
    const $target = event.currentTarget as HTMLButtonElement
    const arrow = $target.children.item($target.children.length - 1)
    const list = $target.parentElement!.children.item($target.parentElement!.children.length - 1)
    if (arrow!.classList.contains('drop')) {
      arrow!.classList.remove('drop')
      list!.classList.remove('drop')
    } else {
      arrow!.classList.add('drop')
      list!.classList.add('drop')
    }
  }

  getRegionLabel(): string {
    const r = this.region.find(i => i.id === this.filter.region)
    if (r) return r.label
    return 'Регион'
  }

  getCountryLabel(): string {
    const c = this.country.find(i => i.id === this.filter.country)
    if (c) return c.label
    return 'Страна / город'
  }

}
