import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {Country} from "../../../../shared/services-interfaces/detail-service/manufacturer.interface";

@Component({
  selector: 'app-admin-country',
  templateUrl: './admin-country.component.html',
  styleUrls: ['./admin-country.component.scss']
})
export class AdminCountryComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  country: Country[] = []
  errorMessage: string = ''

  ngOnInit(): void {

    this.adminService.getCountryList()
      .then(data => {
        if (!data.length) {
          this.errorMessage = 'Страны / города не найдены'
          return
        }
        this.errorMessage = ''
        this.country = data
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message.toString()
      })


  }

}
