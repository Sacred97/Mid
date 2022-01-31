import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {Router} from "@angular/router";
import {AdminDetailsHidden} from "../../../interfaces/admin-details.interface";

@Component({
  selector: 'app-admin-detail',
  templateUrl: './admin-detail.component.html',
  styleUrls: ['./admin-detail.component.scss']
})
export class AdminDetailComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) {
  }

  details: AdminDetailsHidden[] = []

  ngOnInit(): void {
    this.adminService.getAllHidden()
      .then(data => {
        this.details = data
      }, error => {
        console.log(error);
      })
  }

}
