import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {AdminBannerUpdate, AdminBanner} from "../../../interfaces/admin-banner.interface";
import {FormControl, FormGroup} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-admin-banners-edit',
  templateUrl: './admin-banners-edit.component.html',
  styleUrls: ['./admin-banners-edit.component.scss']
})
export class AdminBannersEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  form: FormGroup = new FormGroup({
    serialNumber: new FormControl(null),
    pageReference: new FormControl(null)
  })

  banner: AdminBanner | null = null
  id: number = this.activatedRoute.snapshot.params['id']

  action: boolean = false
  errorUpdate: boolean = false
  updateSuccess: boolean = false

  errorMessage: string = ''
  errorDeleteMessage: string = ''

  ngOnInit(): void {

    this.adminService.getBanner(this.id)
      .then(data => {
        this.banner = data
        this.fillForm()
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.errorMessage = 'Произошла ошибка, повторите запрос позже'
      })

  }

  private fillForm() {
    if (!this.banner) return
    this.form.controls['serialNumber'].setValue(this.banner.serialNumber)
    this.form.controls['pageReference'].setValue(this.banner.pageReference)
  }

  updateBanner() {
    this.errorUpdate = false
    this.updateSuccess = false
    const data: AdminBannerUpdate = {
      id: +this.id,
      serialNumber: this.form.value.serialNumber,
      pageReference: this.form.value.pageReference
    }

    this.action = true
    this.adminService.updateBanner(data)
      .then(res => {
        this.updateSuccess = true
        this.banner = res
        this.action = false
        this.fillForm()
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.errorUpdate = true
        this.action = false
      })

  }

  remove() {
    this.action = true
    this.adminService.deleteBanner(this.id)
      .then(data => {
        this.router.navigate(['/', 'admin', 'banners'])
        this.action = false
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.action = false
        this.errorDeleteMessage = 'Произошла ошибка, повторите запрос позже.'
      })

  }

}
