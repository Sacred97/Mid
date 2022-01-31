import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {
  AddressUserInterface,
  UserAddressCreate,
  UserAddressUpdate
} from "../../../shared/services-interfaces/user-service/user.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

declare let DG: any;

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  address: AddressUserInterface[] = []
  error: boolean = false
  loading: boolean = true
  transportCompanies: string[] = ['ПЭК', 'Деловые Линии', 'Байкал Сервис', 'Энергия', 'КИТ', 'СДЭК', 'Другая']

  unsub: Subscription[] = []

  ngOnInit(): void {
    this.userService.getAllUserAddresses()
      .then(data => {
        this.address = this.sortAddresses(data)
      }, error => {
        console.log(error);
        this.error = true
      })
      .finally(() => this.loading = false)


    this.formOpen()

    DG.then(() => {
      this.map = DG.map('map_container', {
        center: [55.685, 52.378],
        zoom: 12,
        fullscreenControl: false
      })
      DG.marker([55.665978, 52.312732]).addTo(this.map).bindLabel('пр. Казанский 123', {static: true})
      DG.marker([55.689741, 52.361843]).addTo(this.map).bindLabel('ПГО Гараж-2000, бокс 4/2!', {static: true})
      DG.marker([55.714089, 52.390465]).addTo(this.map).bindLabel('ул. Центральная 186', {static: true})
    })

  }

  formVisible: boolean = false

  formAdd: FormGroup = new FormGroup({
    delivery: new FormControl('', [Validators.required]),
    isMain: new FormControl(false, [])
  })
  formAddError: boolean = false

  map: any
  mapVisible: boolean = false

  transportSub$: Subscription | null = null

  action: boolean = false

  formOpen() {
    this.formAdd.controls['isMain'].setValue(false)
    return this.formAdd.controls['delivery'].valueChanges.subscribe(value => {
      if (this.formAdd.controls['pickup']) this.formAdd.removeControl('pickup')
      if (this.formAdd.controls['addressName']) this.formAdd.removeControl('addressName')
      if (this.formAdd.controls['transport']) this.formAdd.removeControl('transport')
      if (this.formAdd.controls['another']) this.formAdd.removeControl('another')
      if (this.formAdd.controls['city']) this.formAdd.removeControl('city')
      if (this.formAdd.controls['street']) this.formAdd.removeControl('street')
      if (this.formAdd.controls['building']) this.formAdd.removeControl('building')
      if (this.formAdd.controls['office']) this.formAdd.removeControl('office')
      if (this.formAdd.controls['place']) this.formAdd.removeControl('place')
      this.transportSub$?.unsubscribe()

      if (value === 'pickup') {
        this.mapVisible = true
        this.formAdd.addControl('pickup', new FormControl('Сидоровка', [Validators.required]))
      } else {
        this.mapVisible = false
        this.formAdd.addControl('transport', new FormControl('ПЭК', [Validators.required]))
        this.formAdd.addControl('addressName', new FormControl('', []))
        this.transportSub$ = this.formAdd.controls['transport'].valueChanges.subscribe(value => {
          if (value === 'Другая') {
            this.formAdd.addControl('another', new FormControl('', Validators.required))
          } else {
            this.formAdd.removeControl('another')
          }
        })

        switch (value) {
          case 'home':
            this.formAdd.addControl('city', new FormControl('', Validators.required))
            this.formAdd.addControl('street', new FormControl('', Validators.required))
            this.formAdd.addControl('building', new FormControl('', Validators.required))
            this.formAdd.addControl('office', new FormControl('', Validators.required))
            break;
          case 'city':
            this.formAdd.addControl('place', new FormControl('', Validators.required))
            break;
        }
      }
    })

  }

  dropdown(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement!
    if ($target.classList.contains('drop')) {
      $target.classList.remove('drop')
    } else {
      $target.classList.add('drop')
    }
  }

  showHide() {
    this.mapVisible = false
    if (this.formVisible) {
      this.formVisible = false
      this.unsub.forEach(s => s.unsubscribe())
      this.transportSub$?.unsubscribe()
      this.formAdd.reset()
    } else {
      this.formVisible = true
      let unsub = this.formOpen()
      this.unsub = [...this.unsub, unsub]
    }
  }

  upList(event: Event) {
    const $target = (event.currentTarget as HTMLLabelElement).parentElement!.parentElement!.parentElement!
    $target.classList.remove('drop')
  }

  private sortAddresses(addresses: AddressUserInterface[]): AddressUserInterface[] {
    addresses.sort((a, b) => a.id > b.id ? 1 : a.id === b.id ? 0 : -1)
    addresses.sort((a, b) => {
      return a.isMain === b.isMain ? 0 : a.isMain ? -1 : 1
    })
    return addresses
  }

  prepareToUpdateAddress(id: number) {
    this.action = true
    this.modalWindow = true
    this.userService.getAddress(id)
      .then(data => {
        this.addressModal = data
        this.modalForm.controls['delivery'].setValue(data.deliveryMethod)
        this.modalForm.controls['isMain'].setValue(data.isMain)
        if (data.deliveryMethod === 'Самовывоз') {
          this.modalForm.addControl('pickup', new FormControl(data.deliveryAddress, [Validators.required]))
        } else {
          const candidate: string | undefined = this.transportCompanies.find(i => i.includes(data.transportCompany!))
          if (candidate) {
            this.modalForm.addControl('transport', new FormControl(candidate, [Validators.required]))
          } else {
            this.modalForm.addControl('transport', new FormControl('Другая', [Validators.required]))
            this.modalForm.addControl('another', new FormControl(data.transportCompany, [Validators.required]))
          }
          this.modalTransportSub$ = this.modalForm.controls['transport'].valueChanges.subscribe(value => {
            if (value === 'Другая') {
              this.modalForm.addControl('another', new FormControl('', Validators.required))
            } else {
              this.modalForm.removeControl('another')
            }
          })

          if (data.deliveryMethod === 'Транспортной компанией «до терминала»') {
            this.modalForm.addControl('place', new FormControl(data.deliveryAddress, [Validators.required]))
          } else {
            this.modalForm.addControl('home', new FormControl(data.deliveryAddress, [Validators.required]))
          }

          this.modalForm.addControl('addressName', new FormControl(data.addressName, [Validators.required]))

        }
      }, error => {
        console.log(error);
        this.modalError = true
      })
      .finally(() => {
        this.action = false
      })
  }

  removeAddress(id: number) {
    this.action = true
    this.userService.deleteAddress(id)
      .then(data => {
        this.address = this.sortAddresses(data)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  createAddress() {
    this.action = true

    let data: UserAddressCreate = {
      addressName: "",
      isMain: this.formAdd.value.isMain,
      deliveryAddress: "",
      deliveryMethod: this.formAdd.value.delivery
    }

    if (data.deliveryMethod === 'pickup') {
      data.deliveryMethod = 'Самовывоз'
      data.deliveryAddress = this.formAdd.value.pickup
      data.addressName = 'Самовывоз ' + this.formAdd.value.pickup
    } else {

      if (this.formAdd.value.transport === 'Другая') {
        data.transportCompany = this.formAdd.value.another.trim()
      } else {
        data.transportCompany = this.formAdd.value.transport
      }

      if (data.deliveryMethod === 'home') {
        data.deliveryMethod = 'Транспортной компанией «до двери»'
        data.deliveryAddress = this.formAdd.value.city.trim() + ' ' + this.formAdd.value.street.trim() + ' ' +
          this.formAdd.value.building.trim() + ' ' + this.formAdd.value.office.trim()
      } else {
        data.deliveryMethod = 'Транспортной компанией «до терминала»'
        data.deliveryAddress = this.formAdd.value.place.trim()
      }

      if (!!this.formAdd.value.addressName.trim()) {
        data.addressName = this.formAdd.value.addressName.trim()
      } else {
        let onlyDefault = this.address.filter(i => i.addressName.includes('Адрес'))
        if (onlyDefault.length) {
          const arrayNumber = onlyDefault.map(i => +i.addressName.charAt(i.addressName.length - 1))
          const max = Math.max(...arrayNumber)
          data.addressName = 'Адрес ' + (max + 1)
        } else {
          data.addressName = 'Адрес 1'
        }
      }

    }

    this.userService.addAddress(data)
      .then(res => {
        this.formAddError = false
        this.showHide()
        this.address = this.sortAddresses(res)
      }, error => {
        console.log(error);
        this.formAddError = true
      })
      .finally(() => {
        this.action = false
      })

  }

  //------------------------------------------------Модальное окно------------------------------------------------------

  modalWindow: boolean = false

  addressModal: AddressUserInterface | null = null
  modalError: boolean = false
  modalForm: FormGroup = new FormGroup({
    delivery: new FormControl('', [Validators.required]),
    isMain: new FormControl(false, [])
  })
  updateError: boolean = false
  modalTransportSub$: Subscription | null = null

  updateAddress() {
    if (!this.addressModal) return
    this.action = true
    let data: UserAddressUpdate

    if (this.addressModal.deliveryMethod === 'Самовывоз') {
      data = {
        id: this.addressModal.id,
        deliveryMethod: this.addressModal.deliveryMethod,
        deliveryAddress: this.modalForm.value.pickup,
        isMain: this.modalForm.value.isMain,
        addressName: 'Самовывоз ' + this.modalForm.value.pickup
      }
    } else {
      data = {
        id: this.addressModal.id,
        deliveryMethod: this.addressModal.deliveryMethod,
        isMain: this.modalForm.value.isMain,
        addressName: this.modalForm.value.addressName.trim()
      }

      if (this.modalForm.value.transport === 'Другая') {
        data.transportCompany = this.modalForm.value.another.trim()
      } else {
        data.transportCompany = this.modalForm.value.transport
      }

      if (this.modalForm.controls['place']) {
        data.deliveryAddress = this.modalForm.value.place.trim()
      } else {
        data.deliveryAddress = this.modalForm.value.home.trim()
      }
    }
    this.userService.updateAddress(data)
      .then(res => {
        this.action = false
        this.address = this.sortAddresses(res)
        this.closeModal()
      }, error => {
        this.action = false
        console.log(error);
        this.updateError = true
      })
  }

  closeModal() {
    if (this.action) return
    this.modalForm.reset()
    this.modalError = false
    this.addressModal = null
    this.updateError = false

    this.transportSub$?.unsubscribe()
    if (this.modalForm.controls['pickup']) this.modalForm.removeControl('pickup')
    if (this.modalForm.controls['addressName']) this.modalForm.removeControl('addressName')
    if (this.modalForm.controls['transport']) this.modalForm.removeControl('transport')
    if (this.modalForm.controls['another']) this.modalForm.removeControl('another')
    if (this.modalForm.controls['place']) this.modalForm.removeControl('place')
    if (this.modalForm.controls['home']) this.modalForm.removeControl('home')
    if (this.modalForm.controls['city']) this.modalForm.removeControl('city')
    if (this.modalForm.controls['street']) this.modalForm.removeControl('street')
    if (this.modalForm.controls['building']) this.modalForm.removeControl('building')
    if (this.modalForm.controls['office']) this.modalForm.removeControl('office')

    this.modalWindow = false
  }

}
