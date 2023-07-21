import { Injectable } from '@angular/core';
import {DetailInterface} from "../detail-service/detail.interface";
import {DetailIdInterface} from "../global-interfaces/detail-id.interface";
import {_UserInterface} from "../../interfaces/user/user.interface";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  constructor() {
  }

  getMarkStorage(): DetailIdInterface[] {
    const data = localStorage.getItem('markers')
    return data ? JSON.parse(data) : []
  }

  markAndUnmark(details: DetailInterface | DetailInterface[], id: string, idx?: number): void {
    let action: boolean
    let markers = this.getMarkStorage()
    if (markers.length > 0) {
      const markerIdx: number = markers.findIndex(i => i.id === id)
      if (markerIdx >= 0) {
        markers.splice(markerIdx, 1)
        localStorage.setItem('markers', JSON.stringify(markers))
        action = false
      } else {
        markers.push({id: id})
        localStorage.setItem('markers', JSON.stringify(markers))
        action = true
      }
    } else {
      localStorage.setItem('markers', JSON.stringify([{id: id}] ))
      action = true
    }

    if (Array.isArray(details)) {
      details[idx!].marked = action
    } else {
      details.marked = action
    }
  }

  markSaved(product: DetailInterface | DetailInterface[]): void {
    if (Array.isArray(product)) {
      for (let pItem of product) {
        pItem.marked = false
        for (let mItem of this.getMarkStorage()) {
          if (pItem.id === mItem.id) {
            pItem.marked = true
            break;
          }
        }
      }
      return
    }

    product.marked = false
    const candidate = this.getMarkStorage().find(i => i.id === product.id)
    if (candidate) product.marked = true
    return;
  }

}
