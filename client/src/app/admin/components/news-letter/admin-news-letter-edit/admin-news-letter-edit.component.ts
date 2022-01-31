import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AdminService} from "../../../services/admin.service";
import {AdminNewsLetter, AdminUpdateNewsLetter} from "../../../interfaces/admin-news-letter.interface";

@Component({
  selector: 'app-admin-news-letter-edit',
  templateUrl: './admin-news-letter-edit.component.html',
  styleUrls: ['./admin-news-letter-edit.component.scss']
})
export class AdminNewsLetterEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminService) {
  }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required])
  })
  newsLetter: AdminNewsLetter | null = null
  action: boolean = false
  errorMessage: string = ''

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params['id']
    if (!id) return
    this.adminService.getOneNewsLetter(+id)
      .then(data => {
        this.newsLetter = data
        this.form.controls['name'].setValue(data.name)
      }, error => {
        this.errorMessage = error.error.messages.toString()
      })
  }

  update() {
    this.action = true

    const data: AdminUpdateNewsLetter = {
      id: +this.activatedRoute.snapshot.params['id'],
      name: this.form.value.name
    }

    this.adminService.updateNewsLetter(data)
      .then(res => {
        this.newsLetter = res
        this.errorMessage = ''
      }, error => {
        this.errorMessage = error.error.messages.toString()
      })
      .finally(() => {
        this.action = false
      })

  }

}
