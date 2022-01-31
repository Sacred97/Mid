import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import { Region} from "../../../../shared/services-interfaces/detail-service/manufacturer.interface";
import {AdminUpdateRegion} from "../../../interfaces/admin-region.interface";

@Component({
  selector: 'app-admin-region-edit',
  templateUrl: './admin-region-edit.component.html',
  styleUrls: ['./admin-region-edit.component.scss']
})
export class AdminRegionEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  @ViewChild('modal') modalEl?: ElementRef

  //--------------------------------------------Форма взаимодействия----------------------------------------------------

  regionForm: FormGroup = new FormGroup({
    region: new FormControl('', [Validators.required])
  })

  private fillForm() {
    this.regionForm.controls['region'].setValue(this.region!.region)
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  region: Region | null = null
  errorMessage: string = ''
  action: boolean = false
  id: number = +this.activatedRoute.snapshot.params['id']

  ngOnInit(): void {

    this.adminService.getRegion(this.id)
      .then(data => {
        if (!data) {
          this.errorMessage = 'Регион не найден'
          return
        }
        this.errorMessage = ''
        this.region = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message
      })
  }

  //-----------------------------------------Обновление Страны / города-------------------------------------------------

  successful: boolean = false
  updateError: string = ''

  update() {
    this.action = true
    this.successful = false
    const data: AdminUpdateRegion = {id: this.id, region: this.regionForm.value.region}
    this.adminService.updateRegion(data)
      .then(data => {
        this.successful = true
        this.region = data
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
    this.adminService.deleteRegion(this.id)
      .then(res => {
        console.log(res);
        this.cancel()
        this.router.navigate(['/', 'admin', 'region'])
      }, error => {
        console.log(error);
        this.removeError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  //---------------------------------------------Манипуляции с DOM------------------------------------------------------

  confirmation() {
    (this.modalEl!.nativeElement as HTMLDivElement).style.display = 'flex'
  }

  cancel() {
    (this.modalEl!.nativeElement as HTMLDivElement).style.display = 'none'
  }

}
