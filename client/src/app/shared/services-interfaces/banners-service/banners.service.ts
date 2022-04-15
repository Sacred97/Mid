import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AdminBanner} from "../../../admin/interfaces/admin-banner.interface";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BannersService {

  constructor(private http: HttpClient) {
  }

  getBannerForPage(homePage: boolean): Promise<AdminBanner[]> {
    const url = homePage ? environment.apiUrl + 'home-page' : environment.apiUrl + 'catalog-page'
    return this.http.get<AdminBanner[]>(url, {withCredentials: true}).toPromise()
  }

}
