import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  constructor() { }

  iframeLoad: boolean = false
  dellinModal: boolean = false
  baikalModal: boolean = false
  pekModal: boolean = false

  ngOnInit(): void {
  }

  closeModal() {
    this.iframeLoad = false
    this.dellinModal = false
    this.baikalModal = false
    this.pekModal = false
  }

}
