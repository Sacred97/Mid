import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Filters, FilterRequest} from "../global-interfaces/filter.interface";
import {CountAndDetailsInterface, DetailInterface, PackageDetailsForHomPage} from "./detail.interface";
import {DetailIdInterface} from "../global-interfaces/detail-id.interface";
import {environment} from "../../../../environments/environment";
import {map} from "rxjs/operators";
import {maxRatio} from "../../utils/helpers";
import {Observable} from "rxjs";
import {ShoppingCartService} from "../shopping-cart-service/shopping-cart.service";
import {MarkerService} from "../marker-service/marker.service";

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  constructor(
    private http: HttpClient, private shoppingCartService: ShoppingCartService,
    private markerService: MarkerService
    ) {}

  private hostname: string = environment.apiUrl + 'details/'

  search(query: string, limit?: number, offset?: number): Observable<CountAndDetailsInterface> {
    const url: string = this.hostname + 'search?' +
      'search=' + query + '&' +
      'limit=' + limit + '&' +
      'offset=' + offset
    return this.http.get<CountAndDetailsInterface>(url,{withCredentials: true})
  }

  getMany(sort: string, order: string, limit: number, offset: number): Promise<CountAndDetailsInterface> {
    const url: string = this.hostname + 'detail?' +
      'sortBy=' + sort + '&' +
      'orderBy=' + order + '&' +
      'limit=' + limit + '&' +
      'offset=' + offset
    return this.http.get<CountAndDetailsInterface>(url,{withCredentials: true}).toPromise()
  }

  // На замену getManyObs()
  getManyObs(sort: string, order: string, limit: number, offset: number): Observable<CountAndDetailsInterface> {
    const url: string = this.hostname + 'detail?' +
      'sortBy=' + sort + '&' +
      'orderBy=' + order + '&' +
      'limit=' + limit + '&' +
      'offset=' + offset
    return this.http.get<CountAndDetailsInterface>(url,{withCredentials: true}).pipe(
      map(res => {
        res.items = this.rewriteQuantityAndMarks(res.items)
        return res
      })
    )
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

  // На замену getWithFilter()
  getWithFilterObs(filter: FilterRequest[], sort: string, order: "ASC" | "DESC",
                availability: boolean, recent: boolean, sale: boolean, popular: boolean,
                letter: string = '', word: string = '', limit: number = 10, offset: number = 0)
    :Observable<CountAndDetailsInterface> {
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
    return this.http.post<CountAndDetailsInterface>(url, filter, {withCredentials: true}).pipe(
      map(res => {
        res.items = this.rewriteQuantityAndMarks(res.items)
        return res
      })
    )
  }

  getListFilters(): Promise<Filters> {
    const url: string = this.hostname + 'filter'
    return this.http.get<Filters>(url, {withCredentials: true}).toPromise()
  }

  getRandomDetailsForHomePage(): Promise<PackageDetailsForHomPage> {
    const url: string = this.hostname + 'random-new-sale-recent'
    return this.http.get<PackageDetailsForHomPage>(url, {withCredentials: true}).toPromise()
  }

  getById(id:string): Observable<DetailInterface> {
    const url: string = this.hostname + 'detail/' + id
    return this.http.get<DetailInterface>(url,{withCredentials: true}).pipe(
        map(res => this.rewriteQuantityAndMarks(res))
      )
  }

  getRandomByManufacturer(id: number): Promise<DetailInterface[]> {
    const url: string = this.hostname + 'random?' +
      'id=' + id
    return this.http.get<DetailInterface[]>(url,{withCredentials: true}).toPromise()
  }

  // На замену getRandomByManufacturer()
  getRandomByManufacturerObs(id: number): Observable<DetailInterface[]> {
    const url: string = this.hostname + 'random?id=' + id
    return this.http.get<DetailInterface[]>(url,{withCredentials: true}).pipe(
      map(res => this.rewriteQuantityAndMarks(res))
    )
  }

  getByIds(ids: DetailIdInterface[], simple: boolean = false): Promise<DetailInterface[]> {
    const url: string = this.hostname + 'random?simple=' + simple
    return this.http.post<DetailInterface[]>(url, ids,{withCredentials: true}).toPromise()
  }

  // На замену getByIds()
  getByIdsObs(ids: DetailIdInterface[], simple: boolean = false): Observable<DetailInterface[]> {
    const url: string = this.hostname + 'random?simple=' + simple
    return this.http.post<DetailInterface[]>(url, ids,{withCredentials: true}).pipe(
      map(res => this.rewriteQuantityAndMarks(res))
    )
  }

  private rewriteQuantityAndMarks(product: DetailInterface): DetailInterface;
  private rewriteQuantityAndMarks(product: DetailInterface[]): DetailInterface[];
  private rewriteQuantityAndMarks(product: DetailInterface | DetailInterface[]): DetailInterface | DetailInterface[] {
    this.shoppingCartService.recountQuantityObs(product)
    this.markerService.markSaved(product)
    return product
  }

}
