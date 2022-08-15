import { Component, OnInit } from '@angular/core';

declare let DG: any;

@Component({
  selector: 'app-bookkeeping',
  templateUrl: './bookkeeping.component.html',
  styleUrls: ['./bookkeeping.component.scss']
})
export class BookkeepingComponent implements OnInit {

  constructor() { }

  map: any

  ngOnInit(): void {

    if (window.innerWidth > 768) {
      DG.then(() => {
        this.map = DG.map('gis', {
          center: [55.69, 52.32],
          zoom: 12,
          fullscreenControl: false
        })
        DG.marker([55.714089, 52.390465]).addTo(this.map).bindLabel('ул. Центральная 186', {static: true})
      })
    }

  }

}
