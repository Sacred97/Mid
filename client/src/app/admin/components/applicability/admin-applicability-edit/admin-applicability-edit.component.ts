import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ApplicabilityInterface} from "../../../../shared/services-interfaces/detail-service/applicability.interface";
import {AdminUpdateApplicability} from "../../../interfaces/admin-applicability.interface";

@Component({
  selector: 'app-admin-applicability-edit',
  templateUrl: './admin-applicability-edit.component.html',
  styleUrls: ['./admin-applicability-edit.component.scss']
})
export class AdminApplicabilityEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  @ViewChild('modal') modalEl?: ElementRef

  //--------------------------------------------Форма взаимодействия----------------------------------------------------

  applicabilityForm: FormGroup = new FormGroup({
    applicability: new FormControl('', [Validators.required])
  })

  private fillForm() {
    this.applicabilityForm.controls['applicability'].setValue(this.applicability!.autoApplicabilityName)
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  applicability: ApplicabilityInterface | null = null
  errorMessage: string = ''
  action: boolean = false
  id: number = +this.activatedRoute.snapshot.params['id']

  ngOnInit(): void {

    this.adminService.getApplicability(this.id)
      .then(data => {
        if (!data) {
          this.errorMessage = 'Применяемость не найдена'
          return
        }
        this.errorMessage = ''
        this.applicability = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message
      })
  }

  //-------------------------------------------------Обновление---------------------------------------------------------

  successful: boolean = false
  updateError: string = ''

  update() {
    this.action = true
    this.successful = false
    const data: AdminUpdateApplicability = {
      id: +this.id,
      autoApplicabilityName: this.applicabilityForm.value.applicability
    }
    console.log(data);
    this.adminService.updateApplicability(data)
      .then(data => {
        this.successful = true
        this.applicability = data
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
    this.adminService.deleteApplicability(this.id)
      .then(res => {
        console.log(res);
        this.cancel()
        this.router.navigate(['/', 'admin', 'applicability'])
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
