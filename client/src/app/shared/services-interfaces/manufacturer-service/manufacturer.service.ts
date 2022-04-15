import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LocationInterface} from "../global-interfaces/filter.interface";
import {
  ManufacturerFilters,
  ManufacturersAndCount,
  SearchManufacturerInterface
} from "./manufacturer-response.interfaces";
import {Country, ManufacturerInterface, Region} from "../detail-service/manufacturer.interface";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  constructor(private http: HttpClient) {
  }

  search(query: string): Promise<SearchManufacturerInterface[]> {
    const url: string = environment.apiUrl + 'manufacturer_search' + '?search=' + query
    return this.http.get<SearchManufacturerInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getRandomManufacturer(): Promise<ManufacturerInterface[]> {
    const url: string = environment.apiUrl + 'random-manufacturer'
    return this.http.get<ManufacturerInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getWithFilter(data: LocationInterface, offset: number, limit: number): Promise<ManufacturersAndCount> {
    const url: string = environment.apiUrl + 'manufacturer_filter' + '?offset=' + offset + '&' + 'limit=' + limit
    return this.http.post<ManufacturersAndCount>(url, data, {withCredentials: true}).toPromise()
  }

  getRegions(): Promise<Region[]> {
    const url: string = environment.apiUrl + 'region'
    return this.http.get<Region[]>(url, {withCredentials: true}).toPromise()
  }

  getCountries(regionId: string | number): Promise<Country[]> {
    const url: string = environment.apiUrl + 'country/many' + '?id=' + regionId
    return this.http.get<Country[]>(url, {withCredentials: true}).toPromise()
  }

  getFilters(manufacturerId: string | number): Promise<ManufacturerFilters> {
    const url: string = environment.apiUrl + 'manufacturer_filter/' + manufacturerId
    return this.http.get<ManufacturerFilters>(url, {withCredentials: true}).toPromise()
  }

  getManufacturerById(id: number): Promise<ManufacturerInterface> {
    const url: string = environment.apiUrl + 'manufacturer/' + id
    return this.http.get<ManufacturerInterface>(url, {withCredentials: true}).toPromise()
  }


}
