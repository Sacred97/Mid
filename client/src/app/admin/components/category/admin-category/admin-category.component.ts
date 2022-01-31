import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {CategoryInterface} from "../../../../shared/services-interfaces/detail-service/category.interface";

@Component({
  selector: 'app-admin-category',
  templateUrl: './admin-category.component.html',
  styleUrls: ['./admin-category.component.scss']
})
export class AdminCategoryComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  category: CategoryInterface[] = []
  errorMessage: string = ''

  ngOnInit(): void {

    this.adminService.getCategoryList()
      .then(data => {
        if (!data.length) {
          this.errorMessage = 'Категории не найдены'
          return
        }
        this.errorMessage = ''
        this.category = data
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message.toString()
      })


  }

}
