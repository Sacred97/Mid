import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  constructor(private userService: UserService) {
  }

  @Input() token?: string
  errorMessage: string = ''

  ngOnInit(): void {
    if (this.token) {
      this.userService.emailVerification(this.token)
        .catch((error: HttpErrorResponse) => {
          console.log(error)
          if (error.error.statusCode === 404) {
            this.errorMessage = error.error.message
            return
          }
          if (error.error.statusCode === 400) {
            this.errorMessage = error.error.message
            return;
          }
          if (error.error.statusCode === 500) {
            this.errorMessage = 'Время действия письма истекло'
            return;
          }
          this.errorMessage = 'Что-то пошло не так, повторите попытку позже.'
        })
    } else {
      this.errorMessage = 'Токен доступа отстутсвует'
    }
  }

}
