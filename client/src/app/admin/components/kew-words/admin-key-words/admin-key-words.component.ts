import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {KeyWordsInterface} from "../../../../shared/services-interfaces/detail-service/key-words.interface";

@Component({
  selector: 'app-admin-key-words',
  templateUrl: './admin-key-words.component.html',
  styleUrls: ['./admin-key-words.component.scss']
})
export class AdminKeyWordsComponent implements OnInit {

  constructor(private adminService: AdminService) {
  }

  keyWords: KeyWordsInterface[] = []
  errorMessage: string = ''
  action: boolean = false
  page: number = 1
  totalItems: number = 0

  ngOnInit(): void {

    this.adminService.getKeyWordsList(0, 20)
      .then(data => {
        if (!data.items.length) {
          this.errorMessage = 'Список ключевых слов / тэгов не найден'
          return
        }
        this.errorMessage = ''
        this.totalItems = data.count
        this.keyWords = data.items
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message.toString()
      })

  }

  changePage(nextPage: number) {
    const offset = (20 * nextPage) - 20
    this.page = nextPage
    this.adminService.getKeyWordsList(offset, 20)
      .then(data => {
        this.totalItems = data.count
        this.keyWords = data.items
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message.toString()
      })
  }

}
