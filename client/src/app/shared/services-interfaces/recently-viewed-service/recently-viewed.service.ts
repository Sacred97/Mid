import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DetailInterface} from "../detail-service/detail.interface";
import {DetailIdInterface} from "../global-interfaces/detail-id.interface";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {

  constructor(private http: HttpClient) {
  }

  getViewedStorage(): DetailIdInterface[] {
    return !!localStorage.getItem('recently_viewed') ? JSON.parse(localStorage.getItem('recently_viewed')!)
      : []
  }

  getRecentlyViewedDetails(): Promise<DetailInterface[]> {
    const url = environment.apiUrl + 'details/random'
    const viewed = this.getViewedStorage()
    return this.http.post<DetailInterface[]>(url, viewed, {withCredentials: true}).toPromise()
  }


  addToRecentlyViewed(id: string) {
    let viewed = this.getViewedStorage()
    if (viewed.length > 0) {
      let idx: number = viewed.findIndex(i => i.id === id)
      if (idx >= 0) {
        viewed.splice(idx, 1)
        viewed.unshift({id})
      } else {
        if (viewed.length >= 10) {
          viewed.splice(9, 1)
          viewed.unshift({id})
        } else {
          viewed.unshift({id})
        }
      }
    } else {
      viewed.unshift({id})
    }
    localStorage.setItem('recently_viewed', JSON.stringify(viewed))
  }

}
