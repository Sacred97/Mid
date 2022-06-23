import { Component, OnInit } from '@angular/core';
import {EmployeesInterface} from "../../../shared/services-interfaces/global-interfaces/employees.interface";

declare let DG: any;

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  constructor() { }

  map: any

  modal: boolean = false

  employees: EmployeesInterface[] = [
    {name: 'Константин', phone: '+7 (8552) 928-111 (доб. 1203)', email: 'kostya@midkam.ru', post: 'Руководитель отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Тимур', phone: '+7 (8552) 928-111 (доб. 1201)', email: '1204@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Александр', phone: '+7 (8552) 928-111 (доб. 1202)', email: 'alex.b@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Эльмира', phone: '+7 (8552) 928-111 (доб. 1204)', email: 'elmira.a@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Ландыш', phone: '+7 (8552) 928-111 (доб. 1205)', email: 'landysh.t@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Амир', phone: '+7 (8552) 928-111 (доб. 1206)', email: 'amir.b@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Анжела', phone: '+7 (8552) 928-111 (доб. 1207)', email: 'anjela.m@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Дмитрий', phone: '+7 (8552) 928-111 (доб. 1208)', email: 'latuhin82@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Динара', phone: '+7 (8552) 928-111 (доб. 1210)', email: 'dinara.k@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Руслан', phone: '+7 (8552) 928-111 (доб. 1211)', email: 'ruslan.s@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Роман', phone: '+7 (8552) 928-111 (доб. 1212)', email: 'roman.z@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Эдуард', phone: '+7 (8552) 928-111 (доб. 1215)', email: 'edward@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Наталья', phone: '+7 (8552) 928-111 (доб. 1216)', email: 'nata@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
    {name: 'Рустем', phone: '+7 (8552) 928-111 (доб. 1217)', email: 'rustem76@midkam.ru', post: 'Менеджер отдела закупок запчастей к автомобилям КАМАЗ'},
  ]

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

  close() {
    this.modal = false
  }

}
