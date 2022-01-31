import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PartsInterface} from "../../../../shared/services-interfaces/detail-service/parts.interface";
import {AdminUpdateParts} from "../../../interfaces/admin-parts.interface";

@Component({
  selector: 'app-admin-parts-edit',
  templateUrl: './admin-parts-edit.component.html',
  styleUrls: ['./admin-parts-edit.component.scss']
})
export class AdminPartsEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  @ViewChild('modal') modalEl?: ElementRef

  //--------------------------------------------Форма взаимодействия----------------------------------------------------

  partsForm: FormGroup = new FormGroup({
    parts: new FormControl('', [Validators.required])
  })

  private fillForm() {
    this.partsForm.controls['parts'].setValue(this.parts!.autoPartsName)
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  parts: PartsInterface | null = null
  errorMessage: string = ''
  action: boolean = false
  id: number = +this.activatedRoute.snapshot.params['id']

  ngOnInit(): void {

    this.adminService.getParts(this.id)
      .then(data => {
        if (!data) {
          this.errorMessage = 'Автозапчасть не найдена'
          return
        }
        this.errorMessage = ''
        this.parts = data
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
    const data: AdminUpdateParts = {
      id: +this.id,
      autoPartsName: this.partsForm.value.parts
    }
    console.log(data);
    this.adminService.updateParts(data)
      .then(data => {
        this.successful = true
        this.parts = data
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
    this.adminService.deleteParts(this.id)
      .then(res => {
        console.log(res);
        this.cancel()
        this.router.navigate(['/', 'admin', 'parts'])
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
