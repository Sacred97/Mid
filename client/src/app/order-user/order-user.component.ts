import { Component, ComponentFactoryResolver, OnInit, Renderer2 } from '@angular/core';
import { DaDataService } from '../shared/services-interfaces/da-data-service/daData.service';
import { DetailService } from '../shared/services-interfaces/detail-service/detail.service';
import { ShoppingCartService } from '../shared/services-interfaces/shopping-cart-service/shopping-cart.service';
import { UserService } from '../shared/services-interfaces/user-service/user.service';
import {
  UserInterface
} from "../shared/services-interfaces/user-service/user.interface";
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

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

  user: UserInterface | null = null

  form: FormGroup = new FormGroup({
    contact: new FormControl(),
    customer: new FormControl(),
    payment: new FormControl(),
    address: new FormControl()
  })

  action: boolean = false
  makingOrder: boolean = false

  orderNumber: string = ''
  orderSuccess: boolean = false
  orderWarning: boolean = false
  orderError: boolean = false

  prevCost: number = 0

  ngOnInit(): void {
    this.userService.getProfile()
      .then(data => {
        this.user = data
      }, error => {
        console.log(error)
        this.router.navigate(['/'])
      })
  }

  orderDataAssembly() {

  }

  getPickUpAddress(place: string) {
    let address: string = ''
    switch (place) {
      case 'Сидоровка':
        address = 'РФ, Республика Татарстан, г. Набережные Челны, пр. Казанский, дом 123 (трасса М-7 Волга, направление Уфа-Казань, 1046 километр)'
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

  }

}
