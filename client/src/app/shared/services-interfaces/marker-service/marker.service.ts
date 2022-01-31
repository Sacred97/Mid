import { Injectable } from '@angular/core';
import {DetailInterface} from "../detail-service/detail.interface";
import {DetailIdInterface} from "../global-interfaces/detail-id.interface";

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  constructor() {
  }

  getMarkStorage(): DetailIdInterface[] {
    return !!localStorage.getItem('markers') ? JSON.parse(localStorage.getItem('markers')!!) : []
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

}
