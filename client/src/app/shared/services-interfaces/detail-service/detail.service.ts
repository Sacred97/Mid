import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Filters, FilterRequest} from "../global-interfaces/filter.interface";
import {CountAndDetailsInterface, DetailInterface} from "./detail.interface";
import {DetailIdInterface} from "../global-interfaces/detail-id.interface";

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  constructor( private http: HttpClient) {
  }

  private hostname: string = 'http://'+location.hostname+':3000/midkam_api/details/'

  search(query: string, limit?: number, offset?: number): Promise<CountAndDetailsInterface> {
    const url: string = this.hostname + 'search?' +
      'search=' + query + '&' +
      'limit=' + limit + '&' +
      'offset=' + offset
    return this.http.get<CountAndDetailsInterface>(url,{withCredentials: true}).toPromise()
  }

  getMany(sort: string, order: string, limit: number, offset: number): Promise<CountAndDetailsInterface> {
    const url: string = this.hostname + 'detail?' +
      'sortBy=' + sort + '&' +
      'orderBy=' + order + '&' +
      'limit=' + limit + '&' +
      'offset=' + offset
    return this.http.get<CountAndDetailsInterface>(url,{withCredentials: true}).toPromise()
  }

  getWithFilter(filter: FilterRequest[], sort: string, order: "ASC" | "DESC",
                       availability: boolean, recent: boolean, sale: boolean, popular: boolean,
                       letter: string = '', word: string = '', limit: number = 10, offset: number = 0)
    :Promise<CountAndDetailsInterface> {
    const url: string = this.hostname + 'filter?' +
      'sort=' + sort + '&' +
      'order=' + order + '&' +
      'availability=' + availability + '&' +
      'recent=' + recent + '&' +
      'sale=' + sale + '&' +
      'popular=' + popular + '&' +
      'letter=' + letter + '&' +
      'word=' + word + '&' +
      'limit=' + limit + '&' +
      'offset=' + offset
    return this.http.post<CountAndDetailsInterface>(url, filter, {withCredentials: true}).toPromise()
  }

  getListFilters(): Promise<Filters> {
    const url: string = this.hostname + 'filter'
    return this.http.get<Filters>(url, {withCredentials: true}).toPromise()
  }

  getById(id:string): Promise<DetailInterface> {
    const url: string = this.hostname + 'detail/' + id
    return this.http.get<DetailInterface>(url,{withCredentials: true}).toPromise()
  }

  getRandomByManufacturer(id: number): Promise<DetailInterface[]> {
    const url: string = this.hostname + 'random?' +
      'id=' + id
    return this.http.get<DetailInterface[]>(url,{withCredentials: true}).toPromise()
  }

  getByIds(ids: DetailIdInterface[]): Promise<DetailInterface[]> {
    const url: string = this.hostname + 'random'
    return this.http.post<DetailInterface[]>(url, ids,{withCredentials: true}).toPromise()
  }

}
