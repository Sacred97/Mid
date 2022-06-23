import { Component, ComponentFactoryResolver, OnInit, Renderer2 } from '@angular/core';
import { DaDataService } from '../shared/services-interfaces/da-data-service/daData.service';
import { DetailService } from '../shared/services-interfaces/detail-service/detail.service';
import { ShoppingCartService } from '../shared/services-interfaces/shopping-cart-service/shopping-cart.service';
import { UserService } from '../shared/services-interfaces/user-service/user.service';
import {
  UserInterface, UserMakeOrder
} from "../shared/services-interfaces/user-service/user.interface";
import { Router } from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-order-user',
  templateUrl: './order-user.component.html',
  styleUrls: ['./order-user.component.scss']
})
export class OrderUserComponent implements OnInit {

  constructor(private renderer: Renderer2, private resolver: ComponentFactoryResolver,
    private daDataService: DaDataService, private detailService: DetailService, private userService: UserService,
    public cartService: ShoppingCartService, private router: Router) {

    }

  quantityDetails: number = this.cartService.storage().length
  totalWeight: number = 0

  user: UserInterface | undefined = this.userService.user$.getValue()

  form: FormGroup = new FormGroup({
    contact: new FormControl(null,  [Validators.required]),
    customer: new FormControl(null,  [Validators.required]),
    payment: new FormControl(null,  [Validators.required]),
    address: new FormControl(null,  [Validators.required])
  })

  action: boolean = false
  makingOrder: boolean = false

  orderNumber: string = ''
  orderSuccess: boolean = false
  orderWarning: boolean = false
  orderError: boolean = false

  prevCost: number = 0

  ngOnInit(): void {
    if (this.user) {
      this.totalWeight = this.user.shoppingCart.totalWeight
    } else {
      this.router.navigate(['/'])
    }
  }

  async orderDataAssembly() {
    if (!this.user) return
    this.action = true
    this.makingOrder = true

    let data: UserMakeOrder = {
      fullName: "", email: "", phone: "",
      customer: "",
      payment: this.form.value.payment,
      delivery: "",
      address: ""
    }

    if (this.form.value.contact === -1) {
      data.fullName = this.user.fullName
      data.email = this.user.email
      data.phone = this.user.phone
      if (this.user.additionalPhone) data.additionalPhone = this.user.additionalPhone
    } else {
      const manager = this.user.manager[this.form.value.contact]
      data.fullName = manager.fullName
      data.email = manager.email
      data.phone = manager.phone
      if (manager.additionalPhone) data.additionalPhone = manager.additionalPhone
    }

    if (this.form.value.customer === -1) {
      data.customer = 'Физ.лицо'
    } else {
      data.customer = 'Юр.лицо'
      const company = this.user.company[this.form.value.customer]
      data.requisites = {
        company: company.opf + ' ' + company.companyName,
        inn: company.inn,
        kpp: company.kpp,
        companyAddress: company.address
      }
    }

    const address = this.user.address[this.form.value.address]
    if (address.deliveryMethod === 'Самовывоз') {
      data.delivery = address.deliveryMethod
      data.address = address.deliveryAddress + ' | ' + this.getPickUpAddress(address.deliveryAddress)
    } else {
      data.delivery = address.deliveryMethod + ' ' + address.transportCompany
      data.address = address.deliveryAddress
    }

    try {
      const recount = await this.userService.recountTotalCost()
      if (recount.totalCost !== this.user.shoppingCart.totalCost) {
        this.prevCost = this.user.shoppingCart.totalCost
        this.user.shoppingCart = {...recount}
        this.orderWarning = true
        this.action = false
        return
      }

      this.user = await this.userService.makeOrder(data)
      this.userService.user$.next(this.user)
      this.action = false
      this.orderSuccess = true
      this.orderNumber = this.user.order[this.user.order.length - 1].orderNumber
      this.cartService.totalCost = 0
      this.cartService.itemsQuantity = 0
      localStorage.setItem('shopping_cart', '[]')

    } catch (error) {
      console.log(error);
      this.orderError = true
      this.action = false
      return
    }

  }

  getPickUpAddress(place: string) {
    let address: string = ''
    switch (place) {
      case 'Сидоровка':
        address = 'РФ, Республика Татарстан, г. Набережные Челны, пр. Казанский, дом 123 ' +
          '(трасса М-7 Волга, направление Уфа-Казань, 1046 километр)'
        break;
      case 'Орловка':
        address = 'РФ, Республика Татарстан, г. Набережные Челны, ул. Орловская, дом 186 (ул. Центральная, дом 186)'
        break;
      case 'Гараж-2000':
        address = 'РФ, Республика Татарстан, г. Набережные Челны, пр. Казанский, 224/4 блок 4'
        break;
    }

    return address
  }

  close() {
    this.orderError = false
    this.makingOrder = false
  }

}
