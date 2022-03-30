import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminBanner } from 'src/app/admin/interfaces/admin-banner.interface';
import { AdminService } from 'src/app/admin/services/admin.service';
import {ImageCroppedEvent, LoadedImage} from "ngx-image-cropper";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-admin-banners',
  templateUrl: './admin-banners.component.html',
  styleUrls: ['./admin-banners.component.scss']
})
export class AdminBannersComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  @ViewChild('preview') $preview?: ElementRef

  load: boolean = true
  error: boolean = false
  banners: AdminBanner[] = []

  file: File | null = null

  form: FormGroup = new FormGroup({
    serialNumber: new FormControl(''),
    pageReference: new FormControl(''),
    homePage: new FormControl(false),
    file: new FormControl(null, [Validators.required])
  })

  action: boolean = false
  uploadError: boolean = false

  ngOnInit(): void {

    this.adminService.getBannerList()
      .then(data => {
        this.banners = data
      }, error => {
        console.log(error)
        this.error = true
      })
      .finally(() => {
        this.load = false
      })
  }

  uploadBanner() {

    if (!this.file) {
      this.reset()
      return
    }

    const formData = new FormData()
    const serialNumber = !!this.form.value.serialNumber ? this.form.value.serialNumber
      : this.getLastSerialNumberBanners(this.form.value.homePage)

    formData.append('file', this.file)
    formData.append('serialNumber', serialNumber)
    formData.append('homePage', this.form.value.homePage)
    if (!!this.form.value.pageReference) formData.append('pageReference', this.form.value.pageReference)

    this.action = true
    this.adminService.uploadBanner(formData)
      .then(data => {
        this.banners = data
        this.reset()
        this.action = false
      }, (error: HttpErrorResponse) => {
        console.log(error)
        this.action = false
      })
  }

  private reset() {
    this.aspectRatio = 16 / 3
    this.croppedImage = ''
    this.imageChangedEvent = ''
    this.uncorrectedFile = true
    this.file = null
    this.form.reset()
    this.form.controls['homePage'].setValue(false)
  }

  //--------------------------------------------------------------------------------------------------------------------

  getLastSerialNumberBanners(main: boolean) {

    const result = this.banners.filter(i => i.homePage === main)
    let serialNumber = 0
    result.forEach(i => {
      if (i.serialNumber > serialNumber) serialNumber = i.serialNumber
    })

    return serialNumber + 1
  }

  //---------------------------------Image Cropper Функции--------------------------------------------------------------

  imageChangedEvent: any = '';
  croppedImage: any = '';
  aspectRatio: number = 16 / 3
  uncorrectedFile: boolean = true

  bannerStatusChange(event: Event) {
    const $target = event.currentTarget as HTMLInputElement
    $target.checked ? this.aspectRatio = 16 / 9 : this.aspectRatio = 16 / 3
  }

  fileChangeEvent(event: Event): void {
    const $target = event.target as HTMLInputElement
    if ($target.files && $target.files[0] &&
      ($target.files[0].type === "image/jpeg" || $target.files[0].type === "image/jpg"
        || $target.files[0].type === "image/png")
    ) {
      this.imageChangedEvent = event;
      this.uncorrectedFile = false
    } else {
      this.croppedImage = ''
      this.imageChangedEvent = ''
      this.uncorrectedFile = true
      this.file = null
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;

    if (!!event.base64) {
      const originalName: string = 'Banner ' + (this.form.value.homePage ? 'Main ' : 'Catalog ')
        + this.getLastSerialNumberBanners(this.form.value.homePage) + '.jpeg'
      const type: string = "image/jpeg"
      this.file = this.base64ToFile(event.base64, originalName, type)
    }
  }

  imageLoaded(image: LoadedImage) {
  }

  cropperReady() {
  }

  loadImageFailed() {
  }

  private base64ToFile(base64: string, fileName: string, type: string) {
    base64 = base64.replace(/^data:image\/jpeg;base64,/, "")
    const byteString = window.atob(base64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: type });
    return new File([blob], fileName, { type: type });
  }

}
