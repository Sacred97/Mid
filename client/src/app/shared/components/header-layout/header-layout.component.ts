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
import {HttpErrorResponse} from "@angular/common/http";
import {ShoppingCartService} from "../../services-interfaces/shopping-cart-service/shopping-cart.service";
import {MenuInterface} from "../../services-interfaces/global-interfaces/menu.interface";
import {DetailInterface} from "../../services-interfaces/detail-service/detail.interface";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-header-layout',
  templateUrl: './header-layout.component.html',
  styleUrls: ['./header-layout.component.scss']
})
export class HeaderLayoutComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, private detailService: DetailService, private router: Router,
              private resolver: ComponentFactoryResolver, public userService: UserService,
              public shoppingCartService: ShoppingCartService) {
  }

  // @ts-ignore
  @ViewChild(RefDirective) refDir: RefDirective
  // @ts-ignore
  @ViewChild('hiddenHeader') hiddenHeader: ElementRef

  @HostListener('window:scroll') onScroll() {
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
  isSearch: boolean = false

  position: DetailInterface[] = []

  detailMenu: MenuInterface[] = [
    {usability: 'Запчасти на а/м КАМАЗ', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/KAMAZ.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Валы вторичные', category: ['Валы вторичные']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']},
        {productName: 'Индуктора', category: ['Индуктора']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']},
        {productName: 'Шестерни', category: ['Шестерни']},
        {productName: 'Ящики', category: ['Ящики']}
      ]
    },
    {usability: 'Запчасти на а/м МАЗ', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/MAZ.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']},
        {productName: 'Шестерни', category: ['Шестерни']},
        {productName: 'Ящики', category: ['Ящики']}
      ]
    },
    {usability: 'Запчасти на а/м ГАЗ, ПАЗ, УАЗ', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/GAZ.svg', productGroup: [
        {productName: 'Валы вторичные', category: ['Валы вторичные']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']},
        {productName: 'Индуктора', category: ['Индуктора']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
        {productName: 'Ящики', category: ['Ящики']}
      ]
    },
    {usability: 'Прицепы и полуприцепы', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/PRIZEP.svg', productGroup: [
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
      ]
    },
    {usability: 'Запчасти на а/м КРАЗ', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/KRAZ_URAL.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Валы вторичные', category: ['Валы вторичные']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']},
        {productName: 'Индуктора', category: ['Индуктора']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
      ]
    },
    {usability: 'Запчасти на а/м УРАЛ', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/KRAZ_URAL.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Валы вторичные', category: ['Валы вторичные']}
      ]
    },
    {usability: 'Запчасти на а/м ЗИЛ', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/ZIL.svg', productGroup: [
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']}
      ]
    },
    {usability: 'Трактора и спецтехника', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/TRAKTOR.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']}
      ]
    },
    {usability: 'Запчасти на двс CUMMINS', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/DVS.svg', productGroup: [
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Валы вторичные', category: ['Валы вторичные']},
        {productName: 'Индуктора', category: ['Индуктора']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']},
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']}
      ]
    },
    {usability: 'Запчасти на КПП ZF', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/KPP.svg', productGroup: [
        {productName: 'Валы вторичные', category: ['Валы вторичные']},
        {productName: 'Шестерни', category: ['Шестерни']}
      ]
    },
    {usability: 'Запчасти на а/м ВАЗ', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/VAZ.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Индуктора', category: ['Индуктора']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']}
      ]
    },
    {usability: 'Запчасти на мосты', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/MOST.svg', productGroup: [
        {productName: 'Валы вторичные', category: ['Валы вторичные']},
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']}
      ]
    },
    {usability: 'Метизы', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/METIZ.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Индуктора', category: ['Индуктора']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']}
      ]
    },
    {usability: 'Разное', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/RAZNOE.svg', productGroup: [
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']},
        {productName: 'Шестерни', category: ['Шестерни']},
        {productName: 'Ящики', category: ['Ящики']}
      ]
    },
    {usability: 'Автохимия', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/HIMIA.svg', productGroup: [
        {productName: 'Авмтомасла, автохимия, чистящие средства', category: ['Авмтомасла', 'Автохимия', 'Чистящие средства']},
      ]
    },
    {usability: 'Автокомпоненты КМД', detailByGroup: ['10 Двигатели', '11 Система питания двигателя', '28 Рама', '30 Ось передняя, задняя для переднеприводных'], imgSrc: '../../../../assets/menu/KMD.svg', productGroup: [
        {productName: 'Автокамеры, аккумуляторы', category: ['Автокамеры', 'Аккумуляторы']},
        {productName: 'Баки топлвиные, барабаны', category: ['Баки топлвиные', 'Барабаны']},
        {productName: 'Валы вторичные', category: ['Валы вторичные']},
        {productName: 'Втулки, гайковерты, болты, гайки', category: ['Втулки', 'Гайковерты', 'Болты', 'Гайки']},
        {productName: 'Индуктора', category: ['Индуктора']},
        {productName: 'Лампочки, фары, фонари', category: ['Лампочки', 'Фары', 'Фонари']},
        {productName: 'Шатуны, шайбы, шкворни', category: ['Шатуны', 'Шайбы', 'Шкворни']},
        {productName: 'Шестерни', category: ['Шестерни']},
        {productName: 'Ящики', category: ['Ящики']}
      ]
    }
  ]

  navigateSubscription: Subscription | null = null

  async ngOnInit() {
    try {
      await this.userService.refreshToken()
    } catch (e) {
      console.log(e);
    }
    try {
      const user = this.userService.user$.getValue()
      if (!!user) {
        this.shoppingCartService.totalCost = user?.shoppingCart.totalCost!
        this.shoppingCartService.itemsQuantity = user?.shoppingCart.cartItem.length!
      } else {
        await this.shoppingCartService.recountTotalCostWithGuest(this.shoppingCartService.storage())
      }
    } catch (e) {
      console.log(e);
    }

    this.userService.user$.subscribe(credentials => {
      // MAGIC
    })

    this.navigateSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.active = false
        this.activeHiddenHeader = false
      }
    })

  }

  goToStart() {
    window.scrollTo( {behavior: "smooth", top: 0})
  }

  addClassActive() {
    this.active = !this.active
    this.isDisabled = true
    setTimeout(() => {this.isDisabled=false}, 1000)
  }

  addClassActiveHiddenHeader() {
    this.activeHiddenHeader = !this.activeHiddenHeader
    this.isDisabledHiddenHeader = true
    setTimeout(() => {this.isDisabledHiddenHeader = false}, 1000)
  }

  search(event: Event) {
    const query: string = (event.target as HTMLInputElement).value.trim()
    if (!!query) {
      this.detailService.search(query, 10, 0)
        .then(itemsAndCount => {
          this.position = itemsAndCount.items
          this.isSearch = true
        }, (error: HttpErrorResponse) => {
          console.log(error);
        })
    } else {
      this.position = []
      this.isSearch = false
    }
  }

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

  getCity(): string {
    const city: {city: string, cityTo: string} = localStorage.getItem('city')?
      JSON.parse(localStorage.getItem('city')!):{city: 'Выберите город', cityTo: 'Ваш город'}
    return city.city
  }

  openDetail() {
    //пока так
    this.position = []
  }

  // logout() {
  //   this.userService.logout().then(() => {
  //     localStorage.setItem('shopping_cart', JSON.stringify([]))
  //     this.userService.user$.next(undefined)
  //     this.shoppingCartService.totalCost = 0
  //     this.shoppingCartService.itemsQuantity = 0
  //     this.router.navigate(['/'])
  //   }, (error: HttpErrorResponse) => {
  //     console.log(error);
  //   })
  // }

  toSearch(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement!.querySelector('input')!
    const searchValue = $target.value
    this.position = []
    this.isSearch = false
    this.router.navigate(['/'], {skipLocationChange: true})
      .then(() => {
        this.router.navigate(['/', 'search'], {queryParams: {text: searchValue}})
      })
  }

  navigateToCatalogForFilter(filter: string) {
    this.router.navigate(['/'], {skipLocationChange: true})
      .then(() => {
        this.router.navigate(['/', 'catalog'], {state: {filter: filter}})
      })
  }

  ngOnDestroy(): void {
    this.navigateSubscription?.unsubscribe()
  }

}
