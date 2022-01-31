import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {AdminAttachCode, AdminNotBindingCodes} from "../../../interfaces/admin-additional-code.interface";

@Component({
  selector: 'app-admin-additional-code',
  templateUrl: './admin-additional-code.component.html',
  styleUrls: ['./admin-additional-code.component.scss']
})
export class AdminAdditionalCodeComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  additionalCodes: AdminNotBindingCodes[] = []
  loading: boolean = true
  action: boolean = false

  ngOnInit(): void {
    this.loading = false
    this.adminService.getNotAttachCodes()
      .then(data => {
        this.additionalCodes = data
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
    this.adminService.attachAdditionalCode(data)
      .then(() => {
        this.additionalCodes.splice(idx, 1)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

}
