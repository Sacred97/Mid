import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {ApplicabilityInterface} from "../../../../shared/services-interfaces/detail-service/applicability.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminCreateApplicability} from "../../../interfaces/admin-applicability.interface";

@Component({
  selector: 'app-admin-applicability',
  templateUrl: './admin-applicability.component.html',
  styleUrls: ['./admin-applicability.component.scss']
})
export class AdminApplicabilityComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  applicability: ApplicabilityInterface[] = []
  errorMessage: string = ''

  form: FormGroup = new FormGroup({
    applicability: new FormControl('', [Validators.required])
  })
  action: boolean = false
  formError: string = ''

  ngOnInit(): void {

    this.adminService.getApplicabilityList()
      .then(data => {
        if (!data.length) {
          this.errorMessage = 'Список применяемости не найден'
          return
        }
        this.errorMessage = ''
        this.applicability = this.sorting(data)
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message.toString()
      })


  }

  create() {
    this.action = true
    const data: AdminCreateApplicability = {autoApplicabilityName: this.form.value.applicability}
    this.adminService.createApplicability(data)
      .then(res => {
        this.applicability = this.sorting(res)
        this.form.reset()
      }, error => {
        console.log(error);
        this.formError = error.error.message.toString()
      })
      .finally(() => {
        this.action = false
      })
  }

  private sorting(data: ApplicabilityInterface[]) {
    return data.sort((a, b) => {
      return a.id > b.id ? 1 : a.id === b.id ? 0 : -1
    }).reverse()
  }

}
