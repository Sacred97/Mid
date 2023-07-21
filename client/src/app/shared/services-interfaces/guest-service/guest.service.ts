import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CartItemInfoInterface} from "../global-interfaces/cart-item-info.interface";
import {ResponseTotalCost} from "../global-interfaces/response.interface";
import {GuestMakeOrderInterface} from "./guest-order.interface";
import {OrderInterface} from "../global-interfaces/order.interface";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {TotalCostResponseInterface} from "../../interfaces/response/totalCostResponse.interface";
import {ProductAndQuantityInterface} from "../../interfaces/common/productAndQuantity.interface";

@Injectable({
  providedIn: 'root'
})
export class GuestService {

  constructor(private http: HttpClient) {
  }

  private hostname: string = environment.apiUrl + 'guest/'

  recountTotalCost(data: CartItemInfoInterface[]): Promise<ResponseTotalCost> {
    return this.http.post<ResponseTotalCost>(this.hostname + 'recount',
      data, {withCredentials: true}).toPromise()
  }

  recountTotalCostObs(data: ProductAndQuantityInterface[]): Observable<TotalCostResponseInterface> {
    return this.http.post<TotalCostResponseInterface>(this.hostname + 'recount',
      data, {withCredentials: true})
  }

  makeOrder(data: GuestMakeOrderInterface): Promise<OrderInterface> {
    return this.http.post<OrderInterface>(this.hostname  +'order',
      data, {withCredentials: true}).toPromise()
  }

}
