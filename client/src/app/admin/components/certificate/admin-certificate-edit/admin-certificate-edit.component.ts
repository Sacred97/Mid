import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {CertificateInterface} from "../../../../shared/services-interfaces/certificate-service/certificate.interface";
import {AdminOwnCertificateInterface} from "../../../interfaces/admin-own-certificate.interface";

@Component({
  selector: 'app-admin-certificate-edit',
  templateUrl: './admin-certificate-edit.component.html',
  styleUrls: ['./admin-certificate-edit.component.scss']
})
export class AdminCertificateEditComponent implements OnInit {


  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  form: FormGroup = new FormGroup({
    serialNumber: new FormControl(null, [Validators.required])
  })

  certificate: CertificateInterface | null = null
  id: number = this.activatedRoute.snapshot.params['id']

  action: boolean = false
  errorUpdate: boolean = false
  updateSuccess: boolean = false

  errorMessage: string = ''
  errorDeleteMessage: string = ''

  loading: boolean = true

  ngOnInit(): void {

    this.adminService.getOwnCertificate(this.id)
      .then(data => {
        this.certificate = data
        this.fillForm()
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.errorMessage = 'Произошла ошибка, повторите запрос позже'
      })
      .finally(() => this.loading = false)

  }

  private fillForm() {
    if (!this.certificate) return
    this.form.controls['serialNumber'].setValue(this.certificate.serialNumber)
  }

  update() {
    this.errorUpdate = false
    this.updateSuccess = false

    const data: AdminOwnCertificateInterface = {
      id: +this.id,
      serialNumber: this.form.value.serialNumber
    }
    this.action = true
    this.adminService.updateOwnCertificate(data)
      .then(res => {
        this.updateSuccess = true
        this.certificate = res
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
    this.adminService.deleteOwnCertificate(this.id)
      .then(data => {
        this.router.navigate(['/', 'admin', 'certificate'])
        this.action = false
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.action = false
        this.errorDeleteMessage = 'Произошла ошибка, повторите запрос позже.'
      })

  }

}
