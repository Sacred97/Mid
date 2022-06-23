import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {ResponseMessage} from "../global-interfaces/response.interface";
import {SupplierOfferInterface} from "./supplier-offer.interface";

@Injectable({
  providedIn: 'root'
})
export class MailActionService {

  constructor(private http: HttpClient) {
  }

  sendOfferSupplier(data: SupplierOfferInterface): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'mail/supplier'
    return this.http.post<ResponseMessage>(url, data, {withCredentials: true}).toPromise()
  }

}
