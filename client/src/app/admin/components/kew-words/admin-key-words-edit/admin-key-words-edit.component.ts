import {Component, OnInit, } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {KeyWordsInterface} from "../../../../shared/services-interfaces/detail-service/key-words.interface";
import {AdminUpdateKeyWords} from "../../../interfaces/admin-key-words.interface";

@Component({
  selector: 'app-admin-key-words-edit',
  templateUrl: './admin-key-words-edit.component.html',
  styleUrls: ['./admin-key-words-edit.component.scss']
})
export class AdminKeyWordsEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  //--------------------------------------------Форма взаимодействия----------------------------------------------------

  form: FormGroup = new FormGroup({
    keyWord: new FormControl('', [Validators.required])
  })

  private fillForm() {
    this.form.controls['keyWord'].setValue(this.keyWord!.keyWord)
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  keyWord: KeyWordsInterface | null = null
  errorMessage: string = ''
  action: boolean = false
  id: number = +this.activatedRoute.snapshot.params['id']

  ngOnInit(): void {

    this.adminService.getKeyWord(this.id)
      .then(data => {
        if (!data) {
          this.errorMessage = 'Ключевое слово / тэг не найден'
          return
        }
        this.errorMessage = ''
        this.keyWord = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message
      })
  }

  //--------------------------------------------------Обновление--------------------------------------------------------

  successful: boolean = false
  updateError: string = ''

  update() {
    this.action = true
    this.successful = false
    const data: AdminUpdateKeyWords = {
      id: +this.id,
      keyWord: this.form.value.keyWord
    }

    this.adminService.updateKeyWord(data)
      .then(data => {
        this.successful = true
        this.keyWord = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.updateError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  //-------------------------------------------------Удаление-----------------------------------------------------------

  removeError: string = ''

  remove() {
    this.action = true
    this.adminService.deleteKeyWord(this.id)
      .then(res => {
        this.router.navigate(['/', 'admin', 'key-words'])
      }, error => {
        console.log(error);
        this.removeError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

}
