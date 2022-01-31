import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {AdminService} from "../../../services/admin.service";
import {DetailInterface} from "../../../../shared/services-interfaces/detail-service/detail.interface";
import {Subscription} from "rxjs";
import {
  AdminAlternativeNameCreate,
  AdminAlternativeNameUpdate,
  AdminDetailUpdate, AdminPhotoUpdate,
  AdminPhotoUpload,
  AdminVendorCodeCreate,
  AdminVendorCodeUpdate
} from "../../../interfaces/admin-details.interface";

@Component({
  selector: 'app-admin-detail-edit',
  templateUrl: './admin-detail-edit.component.html',
  styleUrls: ['./admin-detail-edit.component.scss']
})
export class AdminDetailEditComponent implements OnInit, OnDestroy {

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService) {
  }

  //-------------------------------------------Форма Товара (Основная)--------------------------------------------------

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    vendor: new FormControl('', [Validators.required]),
    price: new FormControl(null, [Validators.required]),
    weight: new FormControl(null, [Validators.required]),
    description: new FormControl('', []),
    unit: new FormControl('', [Validators.required]),
    isSale: new FormControl(false, []),
    isPopular: new FormControl(false, []),
    isNewDetail: new FormControl(false, []),
    isHide: new FormControl(false, []),
    manufacturerId: new FormControl(null, []),
    categoryId: new FormControl('', [Validators.required]),
    autoParts: new FormControl('', []),
    autoApplicability: new FormControl('', []),
    keyWords: new FormControl('', [])
  }, {validators: this.priceValidator()})

  updateDetail() {
    this.action = true

    const data: AdminDetailUpdate = {
      id: this.id,
      name: this.form.value.name,
      productCode: this.form.value.code,
      vendorCode: this.form.value.vendor,
      price: this.form.value.price,
      weight: this.form.value.weight,
      unit: this.form.value.unit,
      description: this.form.value.description,
      isSale: this.form.value.isSale,
      saleText: this.form.value.saleText,
      isPopular: this.form.value.isPopular,
      popularText: this.form.value.popularText,
      isNewDetail: this.form.value.isNewDetail,
      isHide: this.form.value.isHide,
      manufacturerId: this.form.value.manufacturerId,
      categoryId: this.form.value.categoryId,
      autoParts: this.form.value.autoParts ? this.toArray(this.form.value.autoParts) : [],
      autoApplicability: this.form.value.autoApplicability ? this.toArray(this.form.value.autoApplicability) : [],
      keyWords: this.form.value.keyWords ? this.toArray(this.form.value.keyWords) : []
    }

    this.adminService.updateDetail(data)
      .then(data => {
        this.detail = data
        this.fillForm()
        this.errorMessage = ''
      }, error => {
        this.errorMessage = error.error.messages.toString()
      })
      .finally(() => {
        this.action = false
      })

  }

  //------------------------------------------Инициализация Компонента--------------------------------------------------

  private id: string = ''
  detail: DetailInterface | null = null
  errorMessage: string = ''
  action: boolean = false
  subs: Subscription[] = []

  async ngOnInit() {
    this.id = this.activatedRoute.snapshot.params['id']
    try {
      this.detail = await this.adminService.getDetail(this.id)
      if (!this.detail) return
      this.detailAdditionalCodeSorting()
      this.detailAlternativeNameSorting()

      const sub1 = this.form.controls['isSale'].valueChanges.subscribe(v => {
        if (v) {
          this.form.addControl('saleText', new FormControl('', []))
        } else {
          this.form.removeControl('saleText')
        }
      })
      const sub2 = this.form.controls['isPopular'].valueChanges.subscribe(v => {
        if (v) {
          this.form.addControl('popularText', new FormControl('', []))
        } else {
          this.form.removeControl('popularText')
        }
      })

      this.fillForm()
      this.subs = [sub1, sub2]

    } catch (error) {
      console.log(error);
      this.detail = null
    }

  }

  //-------------------------------------------------Валидаторы---------------------------------------------------------

  private priceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const price = control.get('price')
      if (price === null) {
        return null
      }

      if (price.value <= 0) {
        price.setErrors({uncorrected: true})
        return {uncorrected: true}
      } else {
        price.setErrors(null)
        return null
      }
    }
  }

  //--------------------------------------------------Утилиты-----------------------------------------------------------

  private fillForm() {
    if (!this.detail) return
    this.form.controls['name'].setValue(this.detail.name)
    this.form.controls['code'].setValue(this.detail.productCode)
    this.form.controls['vendor'].setValue(this.detail.vendorCode)
    this.form.controls['price'].setValue(this.detail.price)
    this.form.controls['weight'].setValue(this.detail.weight)
    this.form.controls['description'].setValue(this.detail.description)
    this.form.controls['unit'].setValue(this.detail.unit)
    this.form.controls['isSale'].setValue(this.detail.isSale)
    this.form.controls['isPopular'].setValue(this.detail.isPopular)
    this.form.controls['isNewDetail'].setValue(this.detail.isNewDetail)
    this.form.controls['isHide'].setValue(this.detail.isHide)
    this.detail.manufacturer ?
      this.form.controls['manufacturerId'].setValue(this.detail.manufacturer.id)
      : this.form.controls['manufacturerId'].setValue(null)
    this.form.controls['categoryId'].setValue(this.detail.category.id)
    this.form.controls['autoParts'].setValue(this.detail.autoParts.map(i => i.id).join(','))
    this.form.controls['autoApplicability'].setValue(this.detail.autoApplicability.map(i => i.id).join(','))
    this.form.controls['keyWords'].setValue(this.detail.keyWords.map(i => i.id).join(','))

    if (this.form.controls['saleText']) this.form.controls['saleText'].setValue(this.detail.saleText)
    if (this.form.controls['popularText']) this.form.controls['popularText'].setValue(this.detail.popularText)
  }

  private toArray(data: string): {id: number}[] {
    return data.split(',').map(i => ({id: Number(i.trim())}))
  }

  private detailAdditionalCodeSorting() {
    if (!this.detail) return
    this.detail.additionalVendorCode.sort((a,b) => {
      return a.id > b.id ? 1 : a.id === b.id ? 0 : -1
    })
  }

  private detailAlternativeNameSorting() {
    if (!this.detail) return
    this.detail.alternativeName.sort((a,b) => {
      return a.id > b.id ? 1 : a.id === b.id ? 0 : -1
    })
  }

  //----------------------------------------------Манипуляция с DOM-----------------------------------------------------

  private getInputElement(event: Event): HTMLInputElement {
    const $parent = (event.currentTarget as HTMLButtonElement).parentElement
    if (!$parent) throw new Error('DOM element Error')
    const $target = $parent.querySelector('input')
    if (!$target) throw new Error('DOM element Error')
    return $target
  }

  //---------------------------------------------Форма Доп. Артикула----------------------------------------------------

  additionalCodeForm: FormGroup = new FormGroup({
    vendorCode: new FormControl('', [Validators.required])
  })
  additionalCodeFormError: string = ''

  createAdditionalCode() {
    this.action = true
    const data: AdminVendorCodeCreate = {additionalCode: this.additionalCodeForm.value.vendorCode, detailId: this.id}
    this.adminService.createVendorCode(data)
      .then(data => {
        this.detail!.additionalVendorCode.push(data)
        this.detailAdditionalCodeSorting()
        this.additionalCodeForm.reset()
      }, error => {
        console.log(error);
        this.additionalCodeFormError = error.error.messages.toString()
      })
      .finally(() => {
        this.action = false
      })
  }

  updateAdditionalCode(event: Event, id: number, idx: number) {
    this.action = true
    const $el = this.getInputElement(event)
    const additionalCode = $el.value
    if (!additionalCode) {
      console.log('Поле не должно быть пустым')
      this.action = false
      throw new Error('Поле пустое')
    }
    const data: AdminVendorCodeUpdate = {id: id, additionalCode: additionalCode}
    this.adminService.updateVendorCode(data)
      .then(vendorCode => {
        this.detail!.additionalVendorCode[idx] = vendorCode
      }, error => {
        console.log(error);
        $el.value = this.detail!.additionalVendorCode[idx].additionalCode
      })
      .finally(() => {
        this.action = false
      })

  }

  removeAdditionalCode(id: number, idx: number) {
    this.action = true
    this.adminService.deleteVendorCode(id)
      .then(res => {
        console.log(res.message);
        this.detail!.additionalVendorCode.splice(idx, 1)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  //------------------------------------------Форма Альт. Наименования--------------------------------------------------

  alternativeNameForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  })
  alternativeNameFormError: string = ''

  createAlternativeName() {
    this.action = true
    const data: AdminAlternativeNameCreate = {alternativeName: this.alternativeNameForm.value.name,detailId: this.id}
    this.adminService.createAlternativeName(data)
      .then(name => {
        this.detail!.alternativeName.push(name)
        this.detailAlternativeNameSorting()
        this.alternativeNameForm.reset()
      }, error => {
        console.log(error);
        this.alternativeNameFormError = error.error.messages.toString()
      })
      .finally(() => {
        this.action = false
      })
  }

  updateAlternativeName(event: Event, id: number, idx: number) {
    this.action = true
    const $el = this.getInputElement(event)
    const alt = $el.value
    if (!alt) {
      console.log('Поле не должно быть пустым')
      this.action = false
      throw new Error('Поле пустое')
    }

    const data: AdminAlternativeNameUpdate = {id: id, alternativeName: alt}

    this.adminService.updateAlternativeName(data)
      .then(vendorCode => {
        this.detail!.alternativeName[idx] = vendorCode
      }, error => {
        console.log(error);
        $el.value = this.detail!.alternativeName[idx].alternativeName
      })
      .finally(() => {
        this.action = false
      })

  }

  removeAlternativeName(id: number, idx: number) {
    this.action = true
    this.adminService.deleteAlternativeName(id)
      .then(res => {
        console.log(res.message);
        this.detail!.alternativeName.splice(idx, 1)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  //------------------------------------------Форма Изображений Товара--------------------------------------------------

  file: File | null = null
  mainPhoto: boolean = false
  uploadError: string = ''

  selectFile(event: Event) {
    const select = (event.target as HTMLInputElement).files
    this.mainPhoto = false
    if (!select) {
      this.file = null
      return;
    }
    this.file = select[0]
  }

  fileTypeMainChange(event: Event) {
    this.mainPhoto = (event.currentTarget as HTMLInputElement).checked
  }

  uploadPhoto() {
    if (!this.file) return
    this.action = true
    const data: AdminPhotoUpload = {
      isMain: this.mainPhoto,
      detailId: this.id
    }
    console.log(data);

    this.adminService.uploadPhoto(this.file, data)
      .then(data => {
        this.detail!.photoDetail = data
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  updatePhoto(id: number, idx: number) {
    this.action = true
    const data: AdminPhotoUpdate = {id: id, detailId: this.id}
    this.adminService.changeMainPhoto(data)
      .then(res => {
        let main = this.detail!.photoDetail.find(i => i.isMain)
        if (main) main.isMain = false
        this.detail!.photoDetail[idx].isMain = true
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  removePhoto(id: number, idx: number) {
    this.action = true
    this.adminService.deletePhoto(id)
      .then(res => {
        console.log(res);
        this.detail!.photoDetail.splice(idx, 1)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  //---------------------------------------------Удаление Компонента----------------------------------------------------

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe())
  }

}
