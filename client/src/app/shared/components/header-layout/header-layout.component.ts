import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  HostListener, OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {DetailService} from "../../services-interfaces/detail-service/detail.service";
import {GuardsCheckStart, NavigationEnd, NavigationStart, ResolveStart, Router} from "@angular/router";
import {AuthModalComponent} from "../auth-modal/auth-modal.component";
import {RefDirective} from "../../directives/ref.directive";
import {UserService} from "../../services-interfaces/user-service/user.service";
import {CityModalComponent} from "../city-modal/city-modal.component";
import {GetPriceListModalComponent} from "../get-price-list-modal/get-price-list-modal.component";
import {SendPriceListModalComponent} from "../send-price-list-modal/send-price-list-modal.component";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {ShoppingCartService} from "../../services-interfaces/shopping-cart-service/shopping-cart.service";
import {MenuInterface} from "../../services-interfaces/global-interfaces/menu.interface";
import {DetailInterface} from "../../services-interfaces/detail-service/detail.interface";
import {Subscription} from "rxjs";
import {environment} from "../../../../environments/environment";
import {DaDataResponse} from "../../services-interfaces/global-interfaces/response.interface";
import {UserInterface} from "../../services-interfaces/user-service/user.interface";


@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss']
})
export class HeaderLayoutComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, private detailService: DetailService, private router: Router,
              private resolver: ComponentFactoryResolver, public userService: UserService,
              public shoppingCartService: ShoppingCartService, private http: HttpClient) {
  }

  // @ts-ignore
  @ViewChild(RefDirective) refDir: RefDirective
  @ViewChild('hiddenHeader') hiddenHeader?: ElementRef
  @ViewChild('mobile_menu_el') mobile_menu_el?: ElementRef

  @HostListener('window:scroll') onScroll() {
    if (!this.hiddenHeader) return
    if (window.pageYOffset > 300) {
      this.renderer.setStyle(this.hiddenHeader.nativeElement, 'top', '0px')
    } else {
      this.renderer.setStyle(this.hiddenHeader.nativeElement, 'top', '-180px')
      this.activeHiddenHeader = false
    }
  }

  active:boolean = false
  isDisabled: boolean = false
  activeHiddenHeader: boolean = false
  isDisabledHiddenHeader: boolean = false
  isViewOnGroup: boolean = true
  isMobile: boolean = window.innerWidth < 768

  searchingDetails: DetailInterface[] = []

  detailMenu: MenuInterface[] = [
    // {
    //   usability: 'Трактора и спецтехника',
    //   imgSrc: '../../../../assets/menu/TRAKTOR.svg'
    // },
    // {
    //   usability: 'Запчасти на двс CUMMINS',
    //   imgSrc: '../../../../assets/menu/DVS.svg'
    // },
    // {
    //   usability: 'Запчасти на КПП ZF',
    //   imgSrc: '../../../../assets/menu/KPP.svg'
    // },
    // {
    //   usability: 'Запчасти на мосты',
    //   imgSrc: '../../../../assets/menu/MOST.svg'
    // },
    // {
    //   usability: 'Метизы',
    //   imgSrc: '../../../../assets/menu/METIZ.svg'
    // },
    // {
    //   usability: 'Разное',
    //   imgSrc: '../../../../assets/menu/RAZNOE.svg'
    // },
    // {
    //   usability: 'Автохимия',
    //   imgSrc: '../../../../assets/menu/HIMIA.svg'
    // },
    // {
    //   usability: 'Автокомпоненты КМД',
    //   imgSrc: '../../../../assets/menu/KMD.svg'
    // }
  ]

  navigateSubscription: Subscription | null = null

  cityList: {city: string, cityTo: string, startLetter?: string}[] = [
    {city: 'А', cityTo: 'А', startLetter: 'А'},
    {city: 'Абакан', cityTo: 'Абакан'},
    {city: 'Адлер', cityTo: 'Адлер'},
    {city: 'Архангельск', cityTo: 'Архангельск'},
    {city: 'Астрахань', cityTo: 'Астрахань'},
    {city: 'Б', cityTo: 'Б', startLetter: 'Б'},
    {city: 'Балаково', cityTo: 'Балаково'},
    {city: 'Барнаул', cityTo: 'Барнаул'},
    {city: 'Белгород', cityTo: 'Белгород'},
    {city: 'Бийск', cityTo: 'Бийск'},
    {city: 'Благовещенск', cityTo: 'Благовещенск'},
    {city: 'Братск', cityTo: 'Братск'},
    {city: 'Брянск', cityTo: 'Брянск'},
    {city: 'Бугульма', cityTo: 'Бугульму'},
    {city: 'В', cityTo: 'Б', startLetter: 'В'},
    {city: 'Великие Луки', cityTo: 'Великие Луки'},
    {city: 'Великий Новгород', cityTo: 'Великий Новгород'},
    {city: 'Владивосток', cityTo: 'Владивосток'},
    {city: 'Владимир', cityTo: 'Владимир'},
    {city: 'Волгоград', cityTo: 'Волгоград'},
    {city: 'Волгодонск', cityTo: 'Волгодонск'},
    {city: 'Волжский', cityTo: 'Волжский'},
    {city: 'Вологда', cityTo: 'Вологду'},
    {city: 'Воронеж', cityTo: 'Воронеж'},
    {city: 'Д', cityTo: 'Д', startLetter: 'Д'},
    {city: 'Дзержинск', cityTo: 'Дзержинск'},
    {city: 'Димитровград', cityTo: 'Димитровград'},
    {city: 'Е', cityTo:'Е', startLetter: 'Е'},
    {city: 'Екатеринбург', cityTo: 'Екатеринбург'},
    {city: 'Ж', cityTo:'Ж', startLetter: 'Ж'},
    {city: 'Железнодорожный', cityTo: 'Железнодорожный'},
    {city: 'З', cityTo:'З', startLetter: 'З'},
    {city: 'Забайкальск', cityTo: 'Забайкальск'},
    {city: 'И', cityTo:'И', startLetter: 'И'},
    {city: 'Иваново', cityTo: 'Иваново'},
    {city: 'Ижевск', cityTo: 'Ижевск'},
    {city: 'Иркутск', cityTo: 'Иркутск'},
    {city: 'Й', cityTo:'Й', startLetter: 'Й'},
    {city: 'Йошкар-Ола', cityTo: 'Йошкар-Олу'},
    {city: 'К', cityTo:'К', startLetter: 'К'},
    {city: 'Казань', cityTo: 'Казань'},
    {city: 'Калининград', cityTo: 'Калининград'},
    {city: 'Калуга', cityTo: 'Калугу'},
    {city: 'Камышин', cityTo: 'Камышино'},
    {city: 'Кемерово', cityTo: 'Кемерово'},
    {city: 'Киров', cityTo: 'Киров'},
    {city: 'Коломна', cityTo: 'Коломну'},
    {city: 'Кострома', cityTo: 'Кострому'},
    {city: 'Котлас', cityTo: 'Котлас'},
    {city: 'Краснодар', cityTo: 'Краснодар'},
    {city: 'Красноярск', cityTo: 'Красноярск'},
    {city: 'Курган', cityTo: 'Курган'},
    {city: 'Курск', cityTo: 'Курск'},
    {city: 'Л', cityTo: 'Л', startLetter: 'Л'},
    {city: 'Липецк', cityTo: 'Липецк'},
    {city: 'М', cityTo: 'М', startLetter: 'М'},
    {city: 'Магнитогорск', cityTo: 'Магнитогорск'},
    {city: 'Миасс', cityTo: 'Миасс'},
    {city: 'Москва', cityTo: 'Москву'},
    {city: 'Мурманск', cityTo: 'Мурманск'},
    {city: 'Н', cityTo: 'Н', startLetter: 'Н'},
    {city: 'Набережные Челны', cityTo: 'Набережные Челны'},
    {city: 'Нижневартовск', cityTo: 'Нижневартовск'},
    {city: 'Нижний Новгород', cityTo: 'Нижний Новгород'},
    {city: 'Нижний Тагил', cityTo: 'Нижний Тагил'},
    {city: 'Новокузнецк', cityTo: 'Новокузнецк'},
    {city: 'Новомосковск', cityTo: 'Новомосковск'},
    {city: 'Новороссийск', cityTo: 'Новороссийск'},
    {city: 'Новосибирск', cityTo: 'Новосибирск'},
    {city: 'Ногинск', cityTo: 'Ногинск'},
    {city: 'О', cityTo: 'О', startLetter: 'О'},
    {city: 'Обнинск', cityTo: 'Обнинск'},
    {city: 'Омск', cityTo: 'Омск'},
    {city: 'Орел', cityTo: 'Орел'},
    {city: 'Оренбург', cityTo: 'Оренбург'},
    {city: 'Орск', cityTo: 'Орск'},
    {city: 'П', cityTo: 'П', startLetter: 'П'},
    {city: 'Пенза', cityTo: 'Пензу'},
    {city: 'Пермь', cityTo: 'Пермь'},
    {city: 'Петрозаводск', cityTo: 'Петрозаводск'},
    {city: 'Подольск', cityTo: 'Подольск'},
    {city: 'Псков', cityTo: 'Псков'},
    {city: 'Пушкино', cityTo: 'Пушкино'},
    {city: 'Р', cityTo: 'Р', startLetter: 'Р'},
    {city: 'Ростов-на-Дону', cityTo: 'Ростов-на-Дону'},
    {city: 'Рыбинск', cityTo: 'Рыбинск'},
    {city: 'Рязань', cityTo: 'Рязань'},
    {city: 'С', cityTo: 'С', startLetter: 'С'},
    {city: 'Самара', cityTo: 'Самару'},
    {city: 'Санкт-Петербург', cityTo: 'Санкт-Петербург'},
    {city: 'Саранск', cityTo: 'Саранск'},
    {city: 'Саратов', cityTo: 'Саратов'},
    {city: 'Северодвинск', cityTo: 'Северодвинск'},
    {city: 'Серпухов', cityTo: 'Серпухов'},
    {city: 'Смоленск', cityTo: 'Смоленск'},
    {city: 'Солнечногорск', cityTo: 'Солнечногорск'},
    {city: 'Сочи', cityTo: 'Сочи'},
    {city: 'Ставрополь', cityTo: 'Ставрополь'},
    {city: 'Старый Оскол', cityTo: 'Старый Оскол'},
    {city: 'Стерлитамак', cityTo: 'Стерлитамак'},
    {city: 'Сургут', cityTo: 'Сургут'},
    {city: 'Сызрань', cityTo: 'Сызрань'},
    {city: 'Сыктывкар', cityTo: 'Сыктывкар'},
    {city: 'Т', cityTo: 'Т', startLetter: 'Т'},
    {city: 'Тамбов', cityTo: 'Тамбов'},
    {city: 'Тверь', cityTo: 'Тверь'},
    {city: 'Тольятти', cityTo: 'Тольятти'},
    {city: 'Томилино', cityTo: 'Томилино'},
    {city: 'Томск', cityTo: 'Томск'},
    {city: 'Тула', cityTo: 'Тулу'},
    {city: 'Тюмень', cityTo: 'Тюмень'},
    {city: 'У', cityTo: 'У', startLetter: 'У'},
    {city: 'Улан-Удэ', cityTo: 'Улан-Удэ'},
    {city: 'Ульяновск', cityTo: 'Ульяновск'},
    {city: 'Уфа', cityTo: 'Уфу'},
    {city: 'Ухта', cityTo: 'Ухту'},
    {city: 'Х', cityTo: 'Х', startLetter: 'Х'},
    {city: 'Хабаровск', cityTo: 'Хабаровск'},
    {city: 'Ч', cityTo: 'Ч', startLetter: 'Ч'},
    {city: 'Чебоксары', cityTo: 'Чебоксары'},
    {city: 'Челябинск', cityTo: 'Челябинск'},
    {city: 'Череповец', cityTo: 'Череповец'},
    {city: 'Чита', cityTo: 'Читу'},
    {city: 'Э', cityTo: 'Э', startLetter: 'Э'},
    {city: 'Энгельс', cityTo: 'Энгельс'},
    {city: 'Я', cityTo: 'Я', startLetter: 'Я'},
    {city: 'Ярославль', cityTo: 'Ярославль'}
  ]

  user: UserInterface | undefined = undefined
  userSub$: Subscription | null = null

  async ngOnInit() {
    try {
      this.user = await this.userService.getUser()
      if (this.user) {
        this.shoppingCartService.totalCost = this.user.shoppingCart.totalCost
        this.shoppingCartService.itemsQuantity = this.user.shoppingCart.cartItem.length
      } else {
        await this.shoppingCartService.recountTotalCostWithGuest(this.shoppingCartService.storage())
      }
    } catch (error) {
      console.log(error);
    }

    this.navigateSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.active = false
        this.activeHiddenHeader = false
        this.searchingDetails = []
      }
    })

    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + environment.daDataConfig.apiKey
      }
      const body = {lat: latitude, lon: longitude}
      this.http.post<DaDataResponse>('https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address',
        JSON.stringify(body), {headers: headers}).toPromise()
        .then(response => {
          const city = response.suggestions[0].data.city
          const candidate = this.cityList.find(i => i.city.toLowerCase() === city.toLowerCase())
          if (candidate) {
            localStorage.setItem('city', JSON.stringify({city: candidate.city, cityTo: candidate.cityTo}))
          } else {
            localStorage.setItem('city', JSON.stringify({city: 'Набережные Челны', cityTo: 'Набережные Челны'}))
          }
        }, error => {
          console.log(error);
        })
    })

    this.userSub$ = this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user
      } else {
        this.user = undefined
      }
    })

  }

  ngOnDestroy(): void {
    this.navigateSubscription?.unsubscribe()
    this.userSub$?.unsubscribe()
  }

  goToStart() {
    window.scrollTo( {behavior: "smooth", top: 0})
  }

  dropDownMenu() {
    this.active = !this.active
    this.isDisabled = true
    setTimeout(() => {this.isDisabled=false}, 1000)
  }

  dropDownMenuHidden() {
    this.activeHiddenHeader = !this.activeHiddenHeader
    this.isDisabledHiddenHeader = true
    setTimeout(() => {this.isDisabledHiddenHeader = false}, 1000)
  }

  search(event: Event) {
    const query = (event.target as HTMLInputElement).value.trim()
    if (!!query) {
      this.detailService.search(query, 10, 0)
        .then(itemsAndCount => {
          this.searchingDetails = itemsAndCount.items
        }, (error: HttpErrorResponse) => {
          console.log(error);
        })
    } else {
      this.searchingDetails = []
    }
  }

  toSearch(event: Event) {
    const $parent = (event.currentTarget as HTMLButtonElement).parentElement
    if (!$parent) return
    const $target = $parent.querySelector('input')
    if (!$target) return;
    const searchValue = $target.value
    this.searchingDetails = []
    this.router.navigate(['/'], {skipLocationChange: true})
      .then(() => {
        this.router.navigate(['/', 'search'], {queryParams: {text: searchValue}})
      })
  }

  onSamePage(path: string[], state?: Object) {
    this.router.navigate(['/'], {skipLocationChange: true})
      .then(() => {
        this.router.navigate(path, {state: state})
      })
  }

  getCity(): string {
    const city: {city: string, cityTo: string} = localStorage.getItem('city')?
      JSON.parse(localStorage.getItem('city')!):{city: 'Выберите город', cityTo: 'Ваш город'}
    return city.city
  }

  //-----------------------------Модальные окна-------------------------------------------------------------------------

  showAuthModal() {
    const modalFactory = this.resolver.resolveComponentFactory(AuthModalComponent)
    this.refDir.containerRef.clear()
    const component = this.refDir.containerRef.createComponent(modalFactory)
    component.instance.close.subscribe(()=> {
      this.refDir.containerRef.clear()
    })
  }

  showCityModal() {
    const modalFactory = this.resolver.resolveComponentFactory(CityModalComponent)
    this.refDir.containerRef.clear()
    const component = this.refDir.containerRef.createComponent(modalFactory)
    component.instance.close.subscribe(() => {
      this.refDir.containerRef.clear()
    })
  }

  showGetPriceModal() {
    const modalFactory = this.resolver.resolveComponentFactory(GetPriceListModalComponent)
    this.refDir.containerRef.clear()
    const component = this.refDir.containerRef.createComponent(modalFactory)
    component.instance.close.subscribe(() => {
      this.refDir.containerRef.clear()
    })
  }

  showSendPriceModal() {
    const modalFactory = this.resolver.resolveComponentFactory(SendPriceListModalComponent)
    this.refDir.containerRef.clear()
    const component = this.refDir.containerRef.createComponent(modalFactory)
    component.instance.close.subscribe(() => {
      this.refDir.containerRef.clear()
    })
  }

  openCloseMobileMenu(open: boolean) {
    if (!this.mobile_menu_el) return
    const $target = this.mobile_menu_el.nativeElement as HTMLDivElement
    if (open) {
      $target.classList.add('mobile-menu-active')
      document.body.style.overflow = 'hidden'
    } else {
      $target.classList.remove('mobile-menu-active')
      document.body.style.overflow = 'unset'
    }

  }

  openSubMobileMenu(event: Event) {
    const $parent = (event.currentTarget as HTMLButtonElement).parentElement
    if (!$parent) return
    const $target = $parent.lastChild as HTMLDivElement
    if (!$target) return;
    $target.style.left = '0'
  }

  closeSubMobileMenu(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement
    if (!$target) return
    $target.style.left = '-100%'
  }

  toRouteFromMobileMenu(route: string[]) {
    const $target = this.mobile_menu_el?.nativeElement as HTMLDivElement
    if (!$target) return
    $target.classList.remove('mobile-menu-active')
    document.body.style.overflow = 'unset'
    this.router.navigate(route)
  }

  toCatalogFromMobileMenu(event: Event, state: Object) {
    const $child = (event.currentTarget as HTMLElement).parentElement?.parentElement
    if (!$child) return
    const $subTarget = $child.parentElement
    if (!$subTarget) return;

    const $target = this.mobile_menu_el?.nativeElement as HTMLDivElement
    if (!$target) return;

    this.onSamePage(['/', 'catalog'], state)

    $subTarget.style.left = '-100%'
    $target.classList.remove('mobile-menu-active')
    document.body.style.overflow = 'unset'
    this.onSamePage(['/', 'catalog'], state)
  }

}
