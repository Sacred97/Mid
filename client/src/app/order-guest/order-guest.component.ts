import {Component, ComponentFactoryResolver, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DaDataService} from "../shared/services-interfaces/da-data-service/daData.service";
import {Subscription} from "rxjs";
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {GuestService} from "../shared/services-interfaces/guest-service/guest.service";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {DetailIdInterface} from "../shared/services-interfaces/global-interfaces/detail-id.interface";
import {
  RequisitesInterface,
  RequisitesRequestInterface
} from "../shared/services-interfaces/global-interfaces/requisites.interface";
import {GuestMakeOrderInterface} from "../shared/services-interfaces/guest-service/guest-order.interface";
import {RefDirective} from "../shared/directives/ref.directive";
import {AuthModalComponent} from "../shared/components/auth-modal/auth-modal.component";
import {CartItemInfoInterface} from "../shared/services-interfaces/global-interfaces/cart-item-info.interface";


declare let DG: any;

@Component({
  selector: 'app-order-guest',
  templateUrl: './order-guest.component.html',
  styleUrls: ['./order-guest.component.scss']
})
export class OrderGuestComponent implements OnInit, OnDestroy {

  constructor(private renderer: Renderer2, private resolver: ComponentFactoryResolver,
              private daDataService: DaDataService, private detailService: DetailService,
              public guestService: GuestService, public cartService: ShoppingCartService) {
  }

  @ViewChild(RefDirective) refDir!: RefDirective

  //-----------------------------------------------Запросы на сервер----------------------------------------------------

  quantityDetails: number = this.cartService.storage().length
  totalWeight: number = 0

  //--------------------------------------Инициализация и удаление компонента-------------------------------------------

  //---Переменные для 2ГИС карты---
  map: any
  mapVisible: boolean = false
  //-------------------------------

  transport$: Subscription | null = null
  unsubs: Subscription[] = []

  form: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    additional: new FormControl('', []),
    customer: new FormControl('', [Validators.required]),
    new: new FormControl('', []),
    payment: new FormControl('', [Validators.required]),
    delivery: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    const ids: DetailIdInterface[] = this.cartService.storage().map(i => ({id: i.id}))

    this.detailService.getByIds(ids)
      .then(details => {
        this.cartService.recountQuantity(details)
        details.forEach(i => {
          let weightPosition: number = i.weight * i.quantity!
          this.totalWeight = this.totalWeight + weightPosition
        })
      }, error => {
        console.log(error);
      })

    const unsub1 = this.form.controls['customer'].valueChanges.subscribe((value) => {
      if (value === 'Физ.лицо') {
        this.form.controls['new'].setValue(false)
      }
    })

    const unsub2 = this.form.controls['new'].valueChanges.subscribe(confirmation => {
      if (confirmation) {
        this.form.addControl('companyOPF', new FormControl('', [Validators.required]))
        this.form.addControl('companyName', new FormControl('', [Validators.required]))
        this.form.addControl('companyINN', new FormControl('', []))
        this.form.addControl('companyKPP', new FormControl('', []))
        this.form.addControl('companyAddress', new FormControl('', [Validators.required]))
        this.form.setValidators([this.validatorINN()])
        this.companyData = null
      } else {
        this.form.removeControl('companyOPF')
        this.form.removeControl('companyName')
        this.form.removeControl('companyINN')
        this.form.removeControl('companyKPP')
        this.form.removeControl('companyAddress')
        this.form.clearValidators()
      }
    })

    const unsub3 = this.form.controls['delivery'].valueChanges.subscribe((value) => {
      if (!!this.form.controls['point']) {
        this.form.removeControl('point')
      } else {
        this.form.removeControl('transport')
        if (!!this.form.controls['another']) this.form.removeControl('another')
        if (!!this.form.controls['place']) this.form.removeControl('place')
        if (!!this.form.controls['city']) this.form.removeControl('city')
        if (!!this.form.controls['street']) this.form.removeControl('street')
        if (!!this.form.controls['building']) this.form.removeControl('building')
        if (!!this.form.controls['office']) this.form.removeControl('office')
        if (!!this.transport$) this.transport$.unsubscribe()
      }

      if (value === 'pickup') {
        this.mapVisible = true
        this.form.addControl('point', new FormControl('', Validators.required))
      } else {
        this.mapVisible = false
        this.form.addControl('transport', new FormControl('', Validators.required))

        this.transport$ = this.form.controls['transport'].valueChanges.subscribe((value) => {
          if (value === 'Другое') {
            this.form.addControl('another', new FormControl('', Validators.required))
          } else {
            if (!!this.form.controls['another']) this.form.removeControl('another')
          }
        })

        switch (value) {
          case 'home':
            this.form.addControl('city', new FormControl('', Validators.required))
            this.form.addControl('street', new FormControl('', Validators.required))
            this.form.addControl('building', new FormControl('', Validators.required))
            this.form.addControl('office', new FormControl('', Validators.required))
            break;
          case 'city':
            this.form.addControl('place', new FormControl('', Validators.required))
            break;
        }
      }
    })

    //-------------------------------------------Загружаем 2ГИС карту---------------------------------------------------
    DG.then(() => {
      this.map = DG.map('map_container', {
        center: [55.69, 52.32],
        zoom: 11,
        fullscreenControl: false
      })
      DG.marker([55.665978, 52.312732]).addTo(this.map).bindLabel('пр. Казанский 123', {static: true})
      DG.marker([55.689741, 52.361843]).addTo(this.map).bindLabel('ПГО Гараж-2000, бокс 4/2!', {static: true})
      DG.marker([55.714089, 52.390465]).addTo(this.map).bindLabel('ул. Центральная 186', {static: true})
    })
    //------------------------------------------------------------------------------------------------------------------

    this.unsubs = [unsub1, unsub2, unsub3]
  }

  ngOnDestroy(): void {
    if (!!this.map) {
      DG.then(() => {
        this.map.remove()
        this.map = null
      })
    }
    this.unsubs.forEach(s => s.unsubscribe())
    if (!!this.transport$) this.transport$.unsubscribe()
  }

  //---------------------------------------------Кастомные валидаторы---------------------------------------------------

  validatorINN() {
    return (control: AbstractControl): ValidationErrors | null => {
      const innControl = control.get('companyINN')
      if (innControl === null) {
        return null
      }

      if (innControl.value) {
        if (innControl.value.toString().length === 10 || innControl.value.toString().length === 12) {
          innControl?.setErrors(null)
          return null
        } else {
          innControl?.setErrors({uncorrected: true})
          return ({uncorrected: true})
        }
      } else {
        innControl?.setErrors({uncorrected: true})
        return ({uncorrected: true})
      }
    }
  }

  //------------------------------------------------Поиск в DaData------------------------------------------------------

  companyData: RequisitesInterface | null = null
  companyList: RequisitesInterface[] = []

  searchCompanyInDaData(event: Event): void {
    this.companyData = null
    const query = (event.target as HTMLInputElement).value
    if (!query) return

    this.daDataService.getDaDataCompany(query).then(response => {
      this.companyList = response.suggestions.map(d => ({
        opf: d.data.opf.short,
        name: d.data.name.full,
        inn: d.data.inn,
        address: d.data.address.value,
        kpp: d.data.kpp ? d.data.kpp : 'Отсутствует'
      }))
    }, error => {
      console.log(error);
    })
  }

  //-----------------------------------------------Манипуляции с DOM----------------------------------------------------

  action: boolean = false
  continue: boolean = false
  forbid: boolean = false
  success: boolean = false
  warning: boolean = false

  chooseCompany(requisites: RequisitesInterface) {
    if (this.form.controls['new'].value) this.form.controls['new'].setValue(false)
    this.companyData = requisites
    this.companyList = []
  }

  registrationStart() {
    this.continue = false
    const modalFactory = this.resolver.resolveComponentFactory(AuthModalComponent)
    this.refDir.containerRef.clear()
    const component = this.refDir.containerRef.createComponent(modalFactory)
    component.instance.close.subscribe(()=> {
      this.refDir.containerRef.clear()
    })
    component.instance.signIn = false
  }

  close() {
    if (this.forbid) return
    this.continue = false
  }

  closeError() {
    this.forbid = false
    this.continue = false
    this.errorMessage = ''
  }

  //-------------------------------------------------Создать заказ------------------------------------------------------

  orderData: GuestMakeOrderInterface | null = null
  orderNumber: string | null = null
  prevCost: number = 0
  errorMessage: string = ''

  orderDataAssembly() {
    const customer = this.form.controls['customer'].value.trim()

    let requisites: RequisitesRequestInterface | null = null
    if (customer === 'Юр.лицо') {
      if (this.form.controls['new'].value) {
        requisites = {
          company: this.form.controls['companyOPF'].value.trim() + ' ' + this.form.controls['companyName'].value.trim(),
          inn: this.form.controls['companyINN'].value.toString().trim(),
          kpp: this.form.controls['companyKPP'].value ? this.form.controls['companyKPP'].value.toString().trim() : 'Отсутствует',
          companyAddress: this.form.controls['companyAddress'].value.trim()
        }
      } else {
        requisites = {
          company: this.companyData!.opf + ' ' + this.companyData!.name,
          inn: this.companyData!.inn,
          kpp: this.companyData!.kpp,
          companyAddress: this.companyData!.address
        }
      }
    }

    let delivery = this.form.controls['delivery'].value
    const transportCompany: string | null = !!this.form.controls['transport']
      ? !!this.form.controls['another']
        ? this.form.controls['another'].value.trim()
        : this.form.controls['transport'].value
      : null

    let address: string

    if (delivery === 'pickup') {
      delivery = 'Самовывоз'
      address = this.form.controls['point'].value
      switch (address) {
        case 'Сидоровка':
          address = address + ', г. Набережные Челны, пр. Казанский 123'
          break;
        case 'Орловка':
          address = address + ', г. Набережные Челны, ул. Орловская (Центральная) 186'
          break;
        case 'Гараж-2000':
          address = address + ', г. Набережные Челны, пр. Казанский 224/4 блок 4'
          break;
      }
    } else {
      if (delivery === 'home') {
        delivery = 'Транспортной компанией "до двери"'
        address = this.form.controls['city'].value.trim() + ', ' + this.form.controls['street'].value.trim() + ' ' +
          this.form.controls['building'].value.trim() + ', ' + this.form.controls['office'].value.trim()
      } else {
        delivery = 'Транспортной компанией "до терминала"'
        address = this.form.controls['place'].value.trim()
      }
    }

    this.orderData = {
      order: this.cartService.storage().map(i => ({detailId: i.id, quantity: i.quantity})),
      fullName: this.form.controls['fullName'].value.trim(),
      phone: this.form.controls['phone'].value.trim(),
      email: this.form.controls['email'].value.trim().toLowerCase(),
      customer: this.form.controls['customer'].value.trim(),
      payment: this.form.controls['payment'].value.trim(),
      delivery: delivery + (transportCompany ? '; ' + transportCompany : ''),
      address: address,
    }

    if (!!this.form.controls['additional'].value.trim()) {
      this.orderData.additionalPhone = this.form.controls['additional'].value.trim()
    }
    if (!!requisites) this.orderData.requisites = requisites

    this.continue = true
  }

  async makeOrder() {
    this.forbid = true
    this.action = true

    const cartInfo: CartItemInfoInterface[] = this.cartService.storage()
      .map(i => ({detailId: i.id, quantity: i.quantity}))
    try {
      this.prevCost = this.cartService.totalCost
      this.cartService.totalCost = await this.guestService.recountTotalCost(cartInfo).then(data => data.totalCost)

      if (this.cartService.totalCost !== this.prevCost) {
        this.warning = true
        this.action = false
        return
      }
    } catch (error) {
      console.log(error);
      this.action = false
      this.errorMessage = 'Что-то пошло не так, повторите попытку позже.'
      return
    }

    try {
      const orderInfo = await this.guestService.makeOrder(this.orderData!)
      this.success = true
      this.orderNumber = orderInfo.orderNumber
      this.action = false
      this.cartService.totalCost = 0
      this.cartService.itemsQuantity = 0
      localStorage.setItem('shopping_cart', '[]')
    } catch (error) {
      console.log(error);
      this.action = false
      if (error.error.statusCode === 403) {
        this.errorMessage = `Минимальная сумма заказа ${this.cartService.toCurrency(1000)}, ` +
          `сумма заказа на данный момент ${this.cartService.toCurrency(this.cartService.totalCost)}`
      } else {
        this.errorMessage = 'Что-то пошло не так, повторите попытку позже.'
      }
      return
    }
  }


  //--------------------------------------------------------------------------------------------------------------------
}
