import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BannerTest } from 'src/app/admin/interfaces/admin-banner.interface';
import { AdminService } from 'src/app/admin/services/admin.service';

@Component({
  selector: 'app-admin-banners',
  templateUrl: './admin-banners.component.html',
  styleUrls: ['./admin-banners.component.scss']
})
export class AdminBannersComponent implements OnInit {

  constructor(private adminService: AdminService) { 
  }

  load: boolean = true
  error: boolean = false
  banners: BannerTest[] = []

  file: File | null = null
  fileError: boolean = false

  form: FormGroup = new FormGroup({
    serialNumber: new FormControl(''),
    homePage: new FormControl(false),
    pageReference: new FormControl('')
  })

  action: boolean = false


  ngOnInit(): void {

    this.adminService.getBannerList()
      .then(data => {
        this.banners = data
      }, error => {
        console.log(error)
        error = true
      })
      .finally(() => {
        this.load = false
      })
  }

  selectFile(event: Event) {
    const target = event.target as HTMLInputElement
    target.files && target.files.length > 0 ? this.file = target.files[0] : this.file = null
  }

  uploadBanner() {

    if (!this.file) {
      this.fileError = true
      return
    }
    this.fileError = false
    const formData = new FormData()
    
    if (!!this.form.value.serialNumber) formData.append('serialNumber', this.form.value.serialNumber)
    if (!!this.form.value.pageReference) formData.append('pageReference', this.form.value.pageReference)
    formData.append('homePage', this.form.value.homePage)

    this.action = true
    this.adminService.uploadBanner(formData)
      .then(data => {
        this.banners = data
        let max = 0
        data.forEach(i => {
          if (i.serialNumber > max) max = i.serialNumber
        })
      }, error => {
        console.log(error)
      }).finally(() => {
        this.action = false
      })
  }

}
