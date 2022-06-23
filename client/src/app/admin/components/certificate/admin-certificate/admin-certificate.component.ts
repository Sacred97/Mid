import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {CertificateInterface} from "../../../../shared/services-interfaces/certificate-service/certificate.interface";

@Component({
  selector: 'app-admin-certificate',
  templateUrl: './admin-certificate.component.html',
  styleUrls: ['./admin-certificate.component.scss']
})
export class AdminCertificateComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  load: boolean = true
  error: boolean = false
  certificates: CertificateInterface[] = []

  file: File | null = null

  form: FormGroup = new FormGroup({
    serialNumber: new FormControl(''),
    file: new FormControl(null, [Validators.required])
  })

  action: boolean = false
  uploadError: boolean = false
  uncorrectedFile: boolean = false

  ngOnInit(): void {

    this.adminService.getOwnCertificates()
      .then(data => {
        this.certificates = data
      }, error => {
        console.log(error)
        this.error = true
      })
      .finally(() => {
        this.load = false
      })

  }

  uploadCertificate() {
    this.uploadError = false
    if (!this.file) {
      this.reset()
      return
    }

    const formData = new FormData()
    const serialNumber = !!this.form.value.serialNumber ? this.form.value.serialNumber
      : this.getLastSerialNumberOfCertificate()

    formData.append('file', this.file)
    formData.append('serialNumber', serialNumber)

    this.action = true
    this.adminService.uploadOwnCertificate(formData)
      .then(data => {
        this.certificates = data
        this.reset()
        this.action = false
      }, (error: HttpErrorResponse) => {
        console.log(error)
        this.action = false
        this.uploadError = true
      })
  }

  private reset() {
    this.file = null
    this.form.reset()
  }

  //--------------------------------------------------------------------------------------------------------------------

  getLastSerialNumberOfCertificate() {
    let serialNumber = 0
    this.certificates.forEach(i => {
      if (i.serialNumber > serialNumber) serialNumber = i.serialNumber
    })

    return serialNumber + 1
  }

  fileChangeEvent(event: Event): void {
    const $target = event.target as HTMLInputElement
    if ($target.files && $target.files[0] &&
      ($target.files[0].type === "image/jpeg" || $target.files[0].type === "image/jpg"
        || $target.files[0].type === "image/png")
    ) {
      this.file = $target.files[0]
      this.uncorrectedFile = false
    } else {
      this.uncorrectedFile = true
      this.file = null
    }
  }


}
