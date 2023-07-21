import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {Router} from "@angular/router";
import {
  ChangeUserPassword,
  UpdateUser,
  UserInterface
} from "../../../shared/services-interfaces/user-service/user.interface";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private userService: UserService, private router: Router,
              private shoppingCartService: ShoppingCartService) {
  }

  form: FormGroup = new FormGroup({
    fullName: new FormControl({disabled: true, value: ''}, [Validators.required]),
    email: new FormControl({disabled: true, value: ''}, [Validators.required, Validators.email]),
    phone: new FormControl({disabled: true, value: ''}, [Validators.required, Validators.minLength(11)]),
    additionalPhone: new FormControl({disabled: true, value: ''}, []),
  })
  formError: boolean = false

  user: UserInterface | undefined = this.userService.user$.getValue()
  action: boolean = false
  isChange: boolean = false

  passwordModal: boolean = false
  passwordForm: FormGroup = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })
  passwordModalError: string = ''
  passwordSuccess: boolean = false

  ngOnInit(): void {
    if (!this.user) {
      this.router.navigate(['/'])
      return
    }
    this.fillForm()
  }

  private fillForm() {
    if (!this.user) return
    this.form.controls['fullName'].setValue(this.user.fullName)
    this.form.controls['email'].setValue(this.user.email)
    this.form.controls['phone'].setValue(this.user.phone)
    this.form.controls['additionalPhone'].setValue(this.user.additionalPhone)
  }

  update() {
    this.action = true
    const updateData: UpdateUser = {
      fullName: this.form.value.fullName,
      email: this.form.value.email,
      phone: this.form.value.phone,
      additionalPhone: this.form.value.additionalPhone
    }
    this.userService.updateProfile(updateData)
      .then(data => {
        this.user = {...this.user, ...data}
        this.updateStart()
        this.userService.user$.next(this.user)
      }, error => {
        console.log(error);
        this.formError = true
      })
      .finally(() => {
        this.action = false
      })
  }

  updateStart() {
    this.isChange = !this.isChange
    this.formError = false
    if (this.isChange) {
      this.form.controls['fullName'].enable()
      this.form.controls['email'].enable()
      this.form.controls['phone'].enable()
      this.form.controls['additionalPhone'].enable()
    } else {
      this.fillForm()
      this.form.controls['fullName'].disable()
      this.form.controls['email'].disable()
      this.form.controls['phone'].disable()
      this.form.controls['additionalPhone'].disable()
    }
  }

  changePassword() {
    const data: ChangeUserPassword = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
    }
    this.passwordSuccess = false
    this.passwordModalError = ''

    this.action = true
    this.userService.changeUserPassword(data)
      .then(res => {
        this.action = false
        this.user = res
        this.userService.user$.next(this.user)
        this.passwordForm.reset()
        this.passwordModalError = ''
        this.passwordSuccess = true
      }, (error: HttpErrorResponse) => {
        console.log(error);
        this.action = false
        this.passwordSuccess = false
        if (error.error.statusCode === 403) {
          this.passwordModalError = 'Старый пароль не верный'
          return
        }
        this.passwordModalError = 'Что-то произошло не так, повторите попытку позже'
      })


  }

  logout() {
    this.action = true
    this.userService.logout()
      .then(() => {
        localStorage.setItem('shopping_cart', JSON.stringify([]))
        this.userService.user$.next(undefined)
        this.userService.user = undefined
        this.shoppingCartService.totalCost = 0
        this.shoppingCartService.itemsQuantity = 0
        this.router.navigate(['/'])
      }, error => {
        console.log(error)
      })
      .finally(() => {
        this.action = false
      })
  }

  closeModal() {
    this.passwordModalError = ''
    this.passwordSuccess = false
    this.passwordForm.reset()
    this.passwordModal = false
  }

  openClosePassword(event: Event, type: string) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement
    if (!$target) return
    const $input = $target.querySelector('input')
    if (!$input) return
    $input.type = type
  }

}
