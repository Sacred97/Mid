import { Component, OnInit } from '@angular/core';
import {EmployeesInterface} from "../../../shared/services-interfaces/global-interfaces/employees.interface";

declare let DG: any;

@Component({
  selector: 'app-selling',
  templateUrl: './selling.component.html',
  styleUrls: ['./selling.component.scss']
})
export class SellingComponent implements OnInit {

  constructor() { }

  map: any

  modal: boolean = false

  employees: EmployeesInterface[] = []

  employeesContact_1: EmployeesInterface[] = [
    {name: 'Динар', phone: '+7 (8552) 927-111 (доб. 1101)', email: 'dinar.m@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Анна', phone: '+7 (8552) 927-111 (доб. 1102)', email: 'anna.k@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Татьяна', phone: '+7 (8552) 927-111 (доб. 1104)', email: 'tatyana.s@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Вадим', phone: '+7 (8552) 927-111 (доб. 1106)', email: 'vadim.p@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Наталья', phone: '+7 (8552) 927-111 (доб. 1107)', email: 'natalya.sh@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Луиза', phone: '+7 (8552) 927-111 (доб. 1110)', email: 'luiza@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Айгуль', phone: '+7 (8552) 927-111 (доб. 1112)', email: 'aigul.m@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'}
  ]
  employeesContact_2: EmployeesInterface[] = [
    {name: 'Ярослав', phone: '+7 (8552) 928-030 (доб. 1401)', email: '89297218444@mail.ru', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'},
    {name: 'Руслан', phone: '+7 (8552) 928-030 (доб. 1403)', email: '9053749818@mail.ru', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'},
    {name: 'Ирина', phone: '+7 (8552) 928-030 (доб. 1404)', email: 'irina-avto669@mail.ru', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'}
  ]
  employeesContact_3: EmployeesInterface[] = [
    {name: 'Ильнар', phone: '+7 (8552) 70-70-67 (доб. 1501)', email: 'gaz@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям ГАЗ, ПАЗ, УАЗ'},
    {name: 'Ильхам', phone: '+7 (8552) 70-70-67 (доб. 1502)', email: 'gaz@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям ГАЗ, ПАЗ, УАЗ'}
  ]
  employeesContact_4: EmployeesInterface[] = [
    {name: 'Алексей', phone: '+7 (8552) 70-71-01 (доб. 1911)', email: 'mdm@midkam.ru', post: 'Менеджер отдела продаж запчастей к европейским автомобилям'},
    {name: 'Фарит', phone: '+7 (8552) 70-71-01 (доб. 1912)', email: 'mdm@midkam.ru', post: 'Менеджер отдела продаж запчастей к европейским автомобилям'}
  ]
  employeesContact_5: EmployeesInterface[] = [
    {name: 'Анна', phone: '+7 (8552) 917-111 (доб. 2111)', email: 'midkam@yandex.ru', post: 'Руководитель отдела продаж'},
    {name: 'Надежда', phone: '+7 (8552) 917-111 (доб. 2112)', email: 'nadejda@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Лидия', phone: '+7 (8552) 917-111 (доб. 2113)', email: 'lida@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Светлана', phone: '+7 (8552) 917-111 (доб. 2114)', email: 'svetlanaleon70@mail.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Альфия', phone: '+7 (8552) 917-111 (доб. 2115)', email: 'alfiya_galimova@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'}
  ]
  employeesContact_6: EmployeesInterface[] = [
    {name: 'Анастасия', phone: '+7 (8552) 32-20-59 (доб.2232)', email: '', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'},
    {name: 'Альбина', phone: '+7 (8552) 32-20-59 (доб.2235)', email: '', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'},
    {name: 'Рустам', phone: '+7 (8552) 32-20-59 (доб.2251)', email: '', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'},
    {name: 'Андрей', phone: '+7 (8552) 32-20-59 (доб.2252)', email: '', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'},
    {name: 'Екатерина', phone: '+7 (8552) 32-20-59 (доб.2253)', email: '', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'},
    {name: 'Алексей', phone: '+7 (8552) 32-20-59 (доб.2254)', email: '', post: 'Менеджер отдела продаж запчастей к автомобилям МАЗ'}
  ]
  employeesContact_7: EmployeesInterface[] = [
    {name: 'Дмитрий', phone: '+7 (8552) 918-111 (доб. 3101)', email: 'dimas@midkam.ru', post: 'Руководитель отдела продаж'},
    {name: 'Эльвира', phone: '+7 (8552) 918-111 (доб. 3121)', email: 'elvira@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Наталья', phone: '+7 (8552) 918-111 (доб. 3122)', email: 'natalya_s@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Рамис', phone: '+7 (8552) 918-111 (доб. 3123)', email: 'ramis@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'},
    {name: 'Ильгиз', phone: '+7 (8552) 918-111 (доб. 3124)', email: 'ilgiz.h@midkam.ru', post: 'Менеджер отдела продаж запчастей к автомобилям КАМАЗ'}
  ]

  ngOnInit(): void {

    if (window.innerWidth > 768) {
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

  }

  dropdown(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement!
    if ($target.classList.contains('drop')) {
      $target.classList.remove('drop')
    } else {
      $target.classList.add('drop')
    }
  }

  openEmployee(employees: EmployeesInterface[]) {
    this.modal = true
    this.employees = employees
  }

  close() {
    this.modal = false
    this.employees = []
  }

}

