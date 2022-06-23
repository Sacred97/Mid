import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CertificateInterface, CertificatesAndCountInterface} from "./certificate.interface";

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) {
  }

  getRandomCertificates(): Promise<CertificateInterface[]> {
    const url = environment.apiUrl + 'general-info-certificate-random'
    return this.http.get<CertificateInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getCertificatesWithQuantity(limit: number = 0, offset: number = 0): Promise<CertificatesAndCountInterface> {
    let url = environment.apiUrl + 'general-info-certificate-with-quantity?limit=' + limit + '&offset=' + offset
    return this.http.get<CertificatesAndCountInterface>(url, {withCredentials: true}).toPromise()
  }

}
