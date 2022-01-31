import { Component, OnInit } from '@angular/core';
import {AdminManufacturerWithoutCountry} from "../../../interfaces/admin-manufacturer.interface";
import {AdminService} from "../../../services/admin.service";

@Component({
  selector: 'app-admin-manufacturer',
  templateUrl: './admin-manufacturer.component.html',
  styleUrls: ['./admin-manufacturer.component.scss']
})
export class AdminManufacturerComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  manufacturer: AdminManufacturerWithoutCountry[] = []
  errorMessage: string = ''

  loading: boolean = true

  ngOnInit(): void {

    this.adminService.getManufacturerWithoutCountry()
      .then(data => {
        if (!data.length) {
          this.errorMessage = 'Производителей без привязки к стране / городу нет'
          return
        }
        this.errorMessage = ''
        this.manufacturer = data
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message
      })
      .finally(() => {
        this.loading = false
      })

  }

}
