import { Component, OnInit } from '@angular/core';
import {AdminAttachCode, AdminNotBindingCodes} from "../../../interfaces/admin-additional-code.interface";
import {AdminService} from "../../../services/admin.service";
import {AdminNotBindingNames} from "../../../interfaces/admin-alternative-name.interface";

@Component({
  selector: 'app-admin-alternative-name',
  templateUrl: './admin-alternative-name.component.html',
  styleUrls: ['./admin-alternative-name.component.scss']
})
export class AdminAlternativeNameComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  alternativeNames: AdminNotBindingNames[] = []
  loading: boolean = true
  action: boolean = false

  ngOnInit(): void {
    this.loading = false
    this.adminService.getNotAttachNames()
      .then(data => {
        this.alternativeNames = data
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false
      })
  }

  attach(event: Event, id: number, idx: number) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement!.querySelector('input')!
    const detailId: string = $target.value
    if (!detailId) return
    this.action = true
    const data: AdminAttachCode = {id: id, detailId: detailId}
    this.adminService.attachAdditionalNames(data)
      .then(() => {
        this.alternativeNames.splice(idx, 1)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

}
