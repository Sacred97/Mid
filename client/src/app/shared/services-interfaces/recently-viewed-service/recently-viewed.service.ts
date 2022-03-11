import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DetailInterface} from "../detail-service/detail.interface";
import {DetailIdInterface} from "../global-interfaces/detail-id.interface";

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {

  constructor(private http: HttpClient) {
  }

  private hostname: string = 'http://localhost:3000/midkam_api/'
  // private hostname: string = 'http://midkam.pro:3000/midkam_api/'

  getViewedStorage(): DetailIdInterface[] {
    return !!localStorage.getItem('recently_viewed') ? JSON.parse(localStorage.getItem('recently_viewed')!)
      : []
  }

  getRecentlyViewedDetails(): Promise<DetailInterface[]> {
    const url = this.hostname + 'details/random'
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
