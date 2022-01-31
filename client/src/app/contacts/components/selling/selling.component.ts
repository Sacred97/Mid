import { Component, OnInit } from '@angular/core';

declare let DG: any;

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss']
})
export class SellingComponent implements OnInit {

  constructor() { }

  map: any

  ngOnInit(): void {

    DG.then(() => {
      this.map = DG.map('gis', {
        center: [55.69, 52.32],
        zoom: 12,
        fullscreenControl: false
      })
      DG.marker([55.665978, 52.312732]).addTo(this.map).bindLabel('пр. Казанский 123', {static: true})
      DG.marker([55.689741, 52.361843]).addTo(this.map).bindLabel('ПГО Гараж-2000, бокс 4/2!', {static: true})
      DG.marker([55.714089, 52.390465]).addTo(this.map).bindLabel('ул. Центральная 186', {static: true})
    })

  }

  dropdown(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement!
    if ($target.classList.contains('drop')) {
      $target.classList.remove('drop')
    } else {
      $target.classList.add('drop')
    }
  }

}
