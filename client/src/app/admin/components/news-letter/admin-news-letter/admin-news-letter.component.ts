import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminNewsLetter} from "../../../interfaces/admin-news-letter.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-news-letter',
  templateUrl: './admin-news-letter.component.html',
  styleUrls: ['./admin-news-letter.component.scss']
})
export class AdminNewsLetterComponent implements OnInit {

  constructor(private router: Router, private adminService: AdminService) {
  }

  newsLetter: AdminNewsLetter[] = []

  errorMessage: string = ''
  loading: boolean = false
  action: boolean = false

  form: FormGroup = new FormGroup({
    letter: new FormControl('', [Validators.required])
  })

  ngOnInit(): void {
    this.getNewsLetter()
  }

  getNewsLetter() {
    this.loading = true

    this.adminService.getNewsLetter()
      .then(data => {
        this.newsLetter = data
      }, error => {
        console.log(error);
        this.newsLetter = []
        this.errorMessage = error.error.messages.toString()
      })
      .finally(() => {
        this.loading = false
      })

  }

  createNewsLetter() {
    this.action = true
    const name: string = this.form.value.letter
    this.adminService.createNewsLetter(name)
      .then(data => {
        this.newsLetter = data
        this.form.reset()
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  update(id: number) {
    this.router.navigate(['/', 'admin', 'news-letter', id])
  }

  remove(id: number) {
    this.action = true
    this.adminService.deleteNewsLetter(id)
      .then(data => {
        this.newsLetter = data
      }, error => {
        console.log(error);
        this.newsLetter = []
        this.errorMessage = error.error.messages.toString()
      })
      .finally(() => {
        this.action = false
      })
  }

}
