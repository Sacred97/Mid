import { Component, OnInit } from '@angular/core';
import {CertificateInterface} from "../../../shared/services-interfaces/certificate-service/certificate.interface";
import {CertificateService} from "../../../shared/services-interfaces/certificate-service/certificate.service";

@Component({
  selector: 'app-own-certificates',
  templateUrl: './own-certificates.component.html',
  styleUrls: ['./own-certificates.component.scss']
})
export class OwnCertificatesComponent implements OnInit {

  constructor(private certificateService: CertificateService) { }

  certificates: CertificateInterface[] = []
  totalCount: number = 0
  action: boolean = true
  page: number = 1
  end: boolean = false

  modal: boolean = false

  src: string = ''

  ngOnInit(): void {
    this.certificateService.getCertificatesWithQuantity(12, 0)
      .then(data => {
        this.certificates = data.certificates
        this.totalCount = data.count
        this.action = false
        this.end = Math.ceil(this.totalCount / 12) === this.page
      }, error => {
        console.log(error);
        this.action = false
      })
  }

  getMore(page: number) {
    this.page = page
    const offset = (page * 12) - 12
    this.certificateService.getCertificatesWithQuantity(12, offset)
      .then(data => {
        this.certificates = this.certificates.concat(data.certificates)
        this.action = false
        this.end = Math.ceil(this.totalCount / 2) === this.page
      }, error => {
        console.log(error);
        this.action = false
      })
  }

  zoom(event: Event) {
    const $target = (event.currentTarget as HTMLDivElement)
    const $imgTarget = $target.querySelector('img')
    if (!$imgTarget) return
    this.modal = true
    this.src = $imgTarget.src
  }

  close() {
    this.src = ''
    this.modal = false
  }

}
