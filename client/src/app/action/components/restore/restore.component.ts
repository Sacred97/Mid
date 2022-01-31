import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators
} from "@angular/forms";

@Component({
  selector: 'app-restore',
  templateUrl: './restore.component.html',
  styleUrls: ['./restore.component.scss']
})
export class RestoreComponent implements OnInit {

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
  }

  @ViewChild('pass') $password?: ElementRef

  @Input() token?: string
  errorMessage: string = ''
  error: string = ''
  action: boolean = false
  successfulMessage: string = ''

  form: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required]],
    repassword: ['', [Validators.required]]
  }, {validators: this.matching()})

  ngOnInit(): void {
    if (!this.token) this.errorMessage = 'Токен доступа отстутсвует'
  }

  matching() {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')
      const repassword = control.get('repassword')
      if (repassword === null && password === null) {
        return null
      }
      if (repassword?.value !== password?.value) {
        repassword?.setErrors({mismatch: 'Пароли не совпадают'})
        return ({mismatch: 'Пароли не совпадают'})
      } else {
        repassword?.setErrors(null)
        return null
      }
    }

  }

  changePassword() {
    this.action = true
    const password: string = this.form.controls['password'].value
    this.userService.changePassword(this.token!, password)
      .then(message => {
        this.successfulMessage = message.message
      }, error => {
        console.log(error);
        this.error = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  disclose() {
    let password = this.$password?.nativeElement as HTMLInputElement
    const type: string = password.type
    switch (type) {
      case 'password':
        password.type = 'text'
        break;
      case 'text':
        password.type = 'password'
        break;
    }
  }

}
