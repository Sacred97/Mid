import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CartItemInfoInterface} from "../global-interfaces/cart-item-info.interface";
import {ResponseTotalCost} from "../global-interfaces/response.interface";
import {GuestMakeOrderInterface} from "./guest-order.interface";
import {OrderInterface} from "../global-interfaces/order.interface";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) {
  }

  private hostname: string = 'http://midkam.pro:3000/midkam_api/guest/'
  // private hostname: string = 'http://localhost:3000/midkam_api/guest/'

  recountTotalCost(data: CartItemInfoInterface[]): Promise<ResponseTotalCost> {
    return this.http.post<ResponseTotalCost>(this.hostname + 'recount',
      data, {withCredentials: true}).toPromise()
  }

  makeOrder(data: GuestMakeOrderInterface): Promise<OrderInterface> {
    return this.http.post<OrderInterface>(this.hostname+'order',
      data, {withCredentials: true}).toPromise()
  }

}
