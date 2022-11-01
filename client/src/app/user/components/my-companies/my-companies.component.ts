import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {
  CompanyUserInterface,
  UserCompanyCreate, UserCompanyUpdate,
  UserInterface
} from "../../../shared/services-interfaces/user-service/user.interface";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {DaDataService} from "../../../shared/services-interfaces/da-data-service/daData.service";
import {RequisitesInterface} from "../../../shared/services-interfaces/global-interfaces/requisites.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-my-companies',
  templateUrl: './my-companies.component.html',
  styleUrls: ['./my-companies.component.scss']
})
export class MyCompaniesComponent implements OnInit {

  constructor(private router: Router, private userService: UserService,
              private daDataService: DaDataService) {
  }

  user: UserInterface | undefined = this.userService.user$.getValue()
  loading: boolean = true
  error: boolean = false
  action: boolean = false

  formAdd: FormGroup = new FormGroup({
    nothing: new FormControl(false, [])
  })
  formVisible: boolean = false
  formAddError: boolean = false

  nothing$: Subscription | null = null
  selectedCompany: RequisitesInterface | null = null
  companyList: RequisitesInterface[] = []
  addressList: string[] = []

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigate(['/'])
      return
    }
    this.loading = false
  }

  showHideForm() {
    if (this.formVisible) {
      this.formVisible = false
      if (this.formAdd.controls['opf']) this.formAdd.removeControl('opf')
      if (this.formAdd.controls['name']) this.formAdd.removeControl('name')
      if (this.formAdd.controls['inn']) this.formAdd.removeControl('inn')
      if (this.formAdd.controls['kpp']) this.formAdd.removeControl('kpp')
      if (this.formAdd.controls['address']) this.formAdd.removeControl('address')
      this.formAdd.clearValidators()
      this.selectedCompany = null
      this.addressList = []
      this.nothing$?.unsubscribe()
      this.formAdd.reset()
    } else {
      this.formVisible = true
      this.nothing$ = this.formAdd.controls['nothing'].valueChanges.subscribe(v => {
        if (v) {
          this.formAdd.addControl('opf', new FormControl('', [Validators.required]))
          this.formAdd.addControl('name', new FormControl('', [Validators.required]))
          this.formAdd.addControl('inn', new FormControl('', [Validators.required]))
          this.formAdd.addControl('kpp', new FormControl('', []))
          this.formAdd.addControl('address', new FormControl('', [Validators.required]))
          this.formAdd.setValidators([this.validatorINN()])
          this.selectedCompany = null
        } else {
          this.formAdd.removeControl('opf')
          this.formAdd.removeControl('name')
          this.formAdd.removeControl('inn')
          this.formAdd.removeControl('kpp')
          this.formAdd.removeControl('address')
          this.formAdd.clearValidators()
          this.addressList = []
        }
      })
    }

  }

  actOfReconciliation(company: CompanyUserInterface) {
    this.forCompany = company
    this.modalAct = true
  }

  prepareToUpdateCompany(id: number) {
    this.action = true
    this.modalWindow = true
    this.userService.getCompany(id)
      .then(data => {
        this.companyModal = data
        this.modalForm.controls['opf'].setValue(data.opf)
        this.modalForm.controls['name'].setValue(data.companyName)
        this.modalForm.controls['inn'].setValue(data.inn)
        this.modalForm.controls['kpp'].setValue(data.kpp)
        this.modalForm.controls['address'].setValue(data.address)
      }, error => {
        this.modalError = true
        console.log(error)
      })
      .finally(() => {
        this.action = false
      })
  }

  removeCompany(id: number) {
    this.action = true
    this.userService.deleteCompany(id)
      .then(data => {
        this.user!.company = data
        this.userService.user$.next(this.user)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  chooseCompany(requisites: RequisitesInterface) {
    if (this.formAdd.controls['nothing'].value) this.formAdd.controls['nothing'].setValue(false)
    this.selectedCompany = requisites
    this.companyList = []
  }

  chooseAddressCompany(address: string) {
    this.formAdd.controls['address'].setValue(address)
    this.addressList = []
  }

  createCompany() {
    this.action = true
    let data: UserCompanyCreate
    if (this.selectedCompany) {
      data = {
        companyName: this.selectedCompany.name,
        opf: this.selectedCompany.opf,
        inn: this.selectedCompany.inn,
        kpp: this.selectedCompany.kpp ? this.selectedCompany.kpp : 'Отсутствует',
        address: this.selectedCompany.address
      }
    } else {
      data = {
        companyName: this.formAdd.value.name,
        opf: this.formAdd.value.opf,
        inn: this.formAdd.value.inn,
        kpp: this.formAdd.value.kpp ? this.formAdd.value.kpp : 'Отсутствует',
        address: this.formAdd.value.address
      }
    }

    this.userService.addCompany(data)
      .then(res => {
        this.formAddError = false
        this.user!.company = res
        this.userService.user$.next(this.user)
        this.showHideForm()
      }, error => {
        console.log(error);
        this.formAddError = true
      })
      .finally(() => {
        this.action = false
      })
  }

  //---------------------------------------------Кастомные валидаторы---------------------------------------------------

  private validatorINN() {
    return (control: AbstractControl): ValidationErrors | null => {
      const innControl = control.get('inn')
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

  searchCompany(event: Event): void {
    this.selectedCompany = null
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

  searchAddress(event: Event) {
    const query = (event.target as HTMLInputElement).value
    if (!query) {
      this.addressList = []
      return
    }

    this.daDataService.getDaDataAddress(query)
      .then(res => {
        this.addressList = res.suggestions.map(v => v.value)
      }, error => {
        console.log(error);
        this.addressList = []
      })
  }

  modalWindow: boolean = false
  companyModal: CompanyUserInterface | null = null
  modalError: boolean = false

  closeModal() {
    if (this.action) return
    this.modalForm.reset()
    this.modalError = false
    this.companyModal = null
    this.updateError = false
    this.addressListModal = []
    this.modalWindow = false
  }

  modalForm: FormGroup = new FormGroup({
    opf: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    inn: new FormControl('', [Validators.required]),
    kpp: new FormControl('', []),
    address: new FormControl('', [Validators.required])
  }, {validators: [this.validatorINN()]})
  updateError: boolean = false
  addressListModal: string[] = []

  searchAddressModal(event: Event) {
    const query = (event.target as HTMLInputElement).value
    if (!query) {
      this.addressListModal = []
      return
    }

    this.daDataService.getDaDataAddress(query)
      .then(res => {
        this.addressListModal = res.suggestions.map(v => v.value)
      }, error => {
        console.log(error);
        this.addressListModal = []
      })
  }

  chooseAddressCompanyModal(address: string) {
    this.modalForm.controls['address'].setValue(address)
    this.addressListModal = []
  }

  updateCompany() {
    this.action = true
    const data: UserCompanyUpdate = {
      id: this.companyModal!.id,
      opf: this.modalForm.value.opf,
      companyName: this.modalForm.value.name,
      inn: this.modalForm.value.inn,
      kpp: this.modalForm.value.kpp ? this.modalForm.value.kpp : 'Отсутствует',
      address: this.modalForm.value.address
    }

    this.userService.updateCompany(data)
      .then(res => {
        this.action = false
        this.user!.company = res
        this.userService.user$.next(this.user)
        this.closeModal()
      }, error => {
        this.action = false
        console.log(error);
        this.updateError = true
      })
  }

  //--------------------------------------------------------------------------------------------------------------------

  modalAct: boolean = false
  forCompany: CompanyUserInterface | null = null
  actForm: FormGroup = new FormGroup({
    start: new FormControl('', [Validators.required]),
    end: new FormControl('', [Validators.required])
  })
  actFormError: boolean = false

  closeModalAct() {
    if (this.action) return
    this.actForm.reset()
    this.actFormError = false
    this.forCompany = null
    this.modalAct = false
  }

  getAct() {
    const data = {
      start: this.actForm.value.start,
      end: this.actForm.value.end
    }
    console.log(data)
  }


}
