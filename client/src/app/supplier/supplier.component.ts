import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {SupplierOfferInterface} from "../shared/services-interfaces/mail-action-service/supplier-offer.interface";
import {MailActionService} from "../shared/services-interfaces/mail-action-service/mail-action.service";

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  constructor(private mailActionService: MailActionService) { }

  action: boolean = false

  activity: string[] = ['Автозапчасти', 'Масло и автохимия', 'Шины и Диски', 'Аксессуары', 'Аккумуляторы',
    'Электрооборудование', 'Светотехника', 'Подшипники', 'Другое']

  form: FormGroup = new FormGroup({
    companyName: new FormControl('', [Validators.required]),
    inn: new FormControl(null, [Validators.required]),
    kpp: new FormControl(null, [Validators.required]),
    address: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    aboutCompany: new FormControl('', [Validators.required]),
    activity: new FormArray([], [Validators.required]),
    approval: new FormControl(false, [Validators.requiredTrue])
  })

  ngOnInit(): void {
  }

  checkboxChange(event: Event) {
    const $target = event.target as HTMLInputElement
    const formArray: FormArray = this.form.get('activity') as FormArray
    if ($target.checked) {
      formArray.push(new FormControl($target.value))
    } else {
      let i: number = 0
      formArray.controls.forEach(control => {
        if (control.value === $target.value) {
          formArray.removeAt(i)
          return
        }
        i++
      })
    }

  }

  submit() {

    const request: SupplierOfferInterface = {
      companyName: this.form.value.companyName,
      inn: this.form.value.inn,
      kpp: this.form.value.kpp,
      address: this.form.value.address,
      email: this.form.value.email,
      phone: this.form.value.phone,
      firstName: this.form.value.firstName,
      name: this.form.value.name,
      lastName: this.form.value.lastName,
      aboutCompany: this.form.value.aboutCompany,
      activity: this.form.value.activity.join(', ')
    }

    this.action = true

    this.mailActionService.sendOfferSupplier(request)
      .then(res => {
        this.action = false
        this.form.reset()
        console.log(res);
      }, error => {
        console.log(error);
        this.action = false
      })

  }

}
