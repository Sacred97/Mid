import {Component, ElementRef, OnInit, SecurityContext, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {
  Country,
  ManufacturerInterface,
} from "../../../../shared/services-interfaces/detail-service/manufacturer.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminManufacturerUpdate} from "../../../interfaces/admin-manufacturer.interface";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-manufacturer-edit',
  templateUrl: './admin-manufacturer-edit.component.html',
  styleUrls: ['./admin-manufacturer-edit.component.scss']
})
export class AdminManufacturerEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService, private sanitizer: DomSanitizer) {
  }

  @ViewChild('logoEl') inputLogoEl?: ElementRef
  @ViewChild('certificateEl') inputCertificateEl?: ElementRef
  @ViewChild('modal') modalEl?: ElementRef

  //----------------------------------------------------Основная форма--------------------------------------------------

  manufacturer: ManufacturerInterface | null = null
  country: Country[] = []
  countryId: number = 0

  manufacturerForm: FormGroup = new FormGroup({
    nameCompany: new FormControl('', [Validators.required]),
    description: new FormControl('', []),
    country: new FormControl('', [Validators.required])
  })
  manufacturerFormError: string = ''
  manufacturerFormSuccess: boolean = false

  chooseCountry(event: Event, id: number, country: string) {
    this.countryId = id
    this.manufacturerForm.controls['country'].setValue(country)

    const $target = event.currentTarget as HTMLLIElement
    const $parent = $target.parentElement!
    const selected = $parent.querySelector('.selected-country')
    if (selected) selected.classList.remove('selected-country')
    $parent.classList.remove('drop')
    $target.classList.add('selected-country')
  }

  update() {
    this.manufacturerFormSuccess = false
    this.action = true

    let htmlToString = this.sanitizer.sanitize(SecurityContext.STYLE, this.manufacturerForm.value.description)

    const data: AdminManufacturerUpdate = {
      id: this.id,
      nameCompany: this.manufacturerForm.value.nameCompany,
      description: htmlToString || undefined,
      countryId: this.countryId
    }

    this.adminService.updateManufacturer(data)
      .then(res => {
        this.manufacturerFormError = ''
        this.manufacturerFormSuccess = true
        this.manufacturer = res
        this.fillForm()
      }, error => {
        console.log(error);
        this.manufacturerFormError = error.error.message
      })
      .finally(() => {
        this.action = false
      })

  }

  private fillForm() {
    if (!this.manufacturer) return
    this.manufacturerForm.controls['nameCompany'].setValue(this.manufacturer.nameCompany)
    this.manufacturerForm.controls['description'].setValue(this.manufacturer.description)
    if (this.manufacturer.country) {
      this.manufacturerForm.controls['country'].setValue(this.manufacturer.country.country)
      this.countryId = this.manufacturer.country.id
    }
  }

  //-----------------------------------------------Инициализация компонента---------------------------------------------

  id: number = +this.activatedRoute.snapshot.params['id']
  loading: boolean = true
  errorMessage: string = ''

  ngOnInit(): void {
    if (!this.id) return
    this.adminService.getManufacturer(this.id)
      .then(data => {
        this.manufacturer = data
        this.fillForm()
        this.loading = false
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message
      })

    this.adminService.getCountryList()
      .then(data => {
        this.country = data
      }, error => {
        console.log(error);
      })
  }

  //---------------------------------------------------DOM манипуляции--------------------------------------------------

  action: boolean = false

  dropDown(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement!.querySelector("ul")
    if (!$target) return
    if ($target.classList.contains('drop')) {
      $target.classList.remove('drop')
    } else {
      $target.classList.add('drop')
    }
  }

  openCertificate(event: Event) {
    const src = (event.currentTarget as HTMLDivElement).querySelector('img')!.src
    const $modal = this.modalEl?.nativeElement as HTMLDivElement
    $modal.style.display = 'flex'
    const $image = $modal.querySelector('img')!
    $image.src = src
  }

  close(event: Event) {
    (event.currentTarget as HTMLDivElement).style.display = 'none'
  }

  //----------------------------------------------------Форма логотипа--------------------------------------------------

  file: File | null = null
  logoError: string = ''

  selectLogo(event: Event) {
    const select = (event.target as HTMLInputElement).files
    if (!select) {
      this.file = null
      return;
    }
    this.file = select[0]
  }

  uploadLogo() {
    if (!this.file) return
    this.action = true
    const data: AdminManufacturerUpdate = {id: this.id}
    this.adminService.updateManufacturer(data, this.file)
      .then(data => {
        this.manufacturer!.logoCompanyUrl = data.logoCompanyUrl
        this.logoError = ''
        this.file = null
        const $target = (this.inputLogoEl!.nativeElement as HTMLInputElement)
        $target.value = ''
        $target.files = null
      }, error => {
        console.log(error);
        this.logoError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  //--------------------------------------------------Форма сертификатов------------------------------------------------

  certificatesFiles: FileList | null = null
  certificateError: string = ''

  selectCertificates(event: Event) {
    const files = (event.target as HTMLInputElement).files
    if (!files || !files.length) {
      this.certificatesFiles = null
      return;
    }
    this.certificatesFiles = files
  }

  uploadCertificate() {
    if (!this.certificatesFiles || !this.certificatesFiles.length) return
    this.action = true

    this.adminService.uploadManufacturerCertificate(this.id, this.certificatesFiles)
      .then(data => {
        this.manufacturer!.photoCertificate = data.photoCertificate
        this.certificateError = ''
        this.certificatesFiles = null
        const $target = (this.inputCertificateEl!.nativeElement as HTMLInputElement)
        $target.value = ''
        $target.files = null
      }, error => {
        console.log(error);
        this.certificateError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  removeCertificate(id: number) {
    this.action = true
    this.adminService.deleteCertificate(id)
      .then(data => {
        this.manufacturer!.photoCertificate = data.photoCertificate
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  //-------------------------------------------------Удаление компонента------------------------------------------------

}
