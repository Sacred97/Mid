import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {AdminSubscribers} from "../../../interfaces/admin-news-letter.interface";

@Component({
  selector: 'app-admin-news-letter-subscribers',
  templateUrl: './admin-news-letter-subscribers.component.html',
  styleUrls: ['./admin-news-letter-subscribers.component.scss']
})
export class AdminNewsLetterSubscribersComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  subscribers: AdminSubscribers[] = []
  action: boolean = false

  ngOnInit(): void {
    this.adminService.getAllSubscribers()
      .then(data => {
        this.subscribers = data.reverse()
      }, error => {
        console.log(error);
      })
  }

  remove(subId: number) {
    this.action = true
    this.adminService.deleteSubscribers(subId)
      .then(data => {
        this.subscribers = data.reverse()
      }, error => {
        console.log(error)
      })
      .finally(() => {
        this.action = false
      })
  }

}
