import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {Country, Region} from "../../../../shared/services-interfaces/detail-service/manufacturer.interface";

@Component({
  selector: 'app-admin-region',
  templateUrl: './admin-region.component.html',
  styleUrls: ['./admin-region.component.scss']
})
export class AdminRegionComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  region: Region[] = []
  errorMessage: string = ''

  ngOnInit(): void {

    this.adminService.getRegionList()
      .then(data => {
        if (!data.length) {
          this.errorMessage = 'Регионы не найдены'
          return
        }
        this.errorMessage = ''
        this.region = data
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message.toString()
      })


  }

}
