import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {Country, Region} from "../../../../shared/services-interfaces/detail-service/manufacturer.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminUpdateCountry} from "../../../interfaces/admin-country.interface";

@Component({
  selector: 'app-admin-country-edit',
  templateUrl: './admin-country-edit.component.html',
  styleUrls: ['./admin-country-edit.component.scss']
})
export class AdminCountryEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  @ViewChild('list') listEl?: ElementRef
  @ViewChild('modal') modalEl?: ElementRef

  //--------------------------------------------Форма взаимодействия----------------------------------------------------

  countryForm: FormGroup = new FormGroup({
    country: new FormControl('', [Validators.required]),
    region: new FormControl('', [Validators.required])
  })

  private fillForm() {
    this.countryForm.controls['country'].setValue(this.country!.country)
    if (this.country!.region) this.countryForm.controls['region'].setValue(this.country!.region.id)
  }

  getRegionName() {
    if (this.countryForm.value.region) {
      const region = this.region.find(i => i.id === this.countryForm.value.region)
      return region ? region.region : `${this.countryForm.value.region} (id)`
    }

    return 'Без привязки'
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  country: Country | null = null
  region: Region[] = []
  errorMessage: string = ''
  action: boolean = false
  id: number = +this.activatedRoute.snapshot.params['id']

  ngOnInit(): void {

    this.adminService.getCountry(this.id)
      .then(data => {
        if (!data) {
          this.errorMessage = 'Страна / город не найдено'
          return
        }
        this.errorMessage = ''
        this.country = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message
      })

    this.adminService.getRegionList()
      .then(data => {
        this.region = data
      }, error => {
        console.log(error);
      })
  }

  //-----------------------------------------Обновление Страны / города-------------------------------------------------

  successful: boolean = false
  updateError: string = ''

  update() {
    this.action = true
    this.successful = false
    const data: AdminUpdateCountry = {
      id: this.id,
      country: this.countryForm.value.country,
      regionId: this.countryForm.value.region
    }
    this.adminService.updateCountry(data)
      .then(data => {
        this.successful = true
        this.country = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.updateError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  //-------------------------------------------------Удаление-----------------------------------------------------------

  removeError: string = ''

  remove() {
    this.action = true
    this.adminService.deleteCountry(this.id)
      .then(res => {
        console.log(res);
        this.cancel()
        this.router.navigate(['/', 'admin', 'country'])
      }, error => {
        console.log(error);
        this.removeError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  //---------------------------------------------Манипуляции с DOM------------------------------------------------------

  dropDown() {
    const $target = this.listEl!.nativeElement as HTMLUListElement
    if ($target.classList.contains('drop')) {
      $target.classList.remove('drop')
    } else {
      $target.classList.add('drop')
    }
  }

  confirmation() {
    (this.modalEl!.nativeElement as HTMLDivElement).style.display = 'flex'
  }

  cancel() {
    (this.modalEl!.nativeElement as HTMLDivElement).style.display = 'none'
  }

}
