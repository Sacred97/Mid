import { Component, OnInit } from '@angular/core';

declare let DG: any;

@Component({
  selector: 'app-export-departament',
  templateUrl: './export-departament.component.html',
  styleUrls: ['./export-departament.component.scss']
})
export class ExportDepartamentComponent implements OnInit {

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
    })
  }

}
