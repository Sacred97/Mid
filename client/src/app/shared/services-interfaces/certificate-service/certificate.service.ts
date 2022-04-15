import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {CertificateInterface} from "./certificate.interface";

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) {
  }

  getRandomCertificates(): Promise<CertificateInterface[]> {
    const url = environment.apiUrl + 'us-certificate-random'
    return this.http.get<CertificateInterface[]>(url, {withCredentials: true}).toPromise()
  }

}
