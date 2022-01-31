import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PartsInterface} from "../../../../shared/services-interfaces/detail-service/parts.interface";
import {AdminCreateParts} from "../../../interfaces/admin-parts.interface";

@Component({
  selector: 'app-admin-parts',
  templateUrl: './admin-parts.component.html',
  styleUrls: ['./admin-parts.component.scss']
})
export class AdminPartsComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  parts: PartsInterface[] = []
  errorMessage: string = ''

  form: FormGroup = new FormGroup({
    parts: new FormControl('', [Validators.required])
  })
  action: boolean = false
  formError: string = ''

  ngOnInit(): void {

    this.adminService.getPartsList()
      .then(data => {
        if (!data.length) {
          this.errorMessage = 'Автозапчасти не найден'
          return
        }
        this.errorMessage = ''
        this.parts = this.sorting(data)
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message.toString()
      })

  }

  create() {
    this.action = true
    const data: AdminCreateParts = {autoPartsName: this.form.value.parts}
    this.adminService.createParts(data)
      .then(res => {
        this.parts = this.sorting(res)
        this.form.reset()
      }, error => {
        console.log(error);
        this.formError = error.error.message.toString()
      })
      .finally(() => {
        this.action = false
      })
  }

  private sorting(data: PartsInterface[]) {
    return data.sort((a, b) => {
      return a.id > b.id ? 1 : a.id === b.id ? 0 : -1
    }).reverse()
  }

}
