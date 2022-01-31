import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {Router} from "@angular/router";
import {UpdateUser, UserInterface} from "../../../shared/services-interfaces/user-service/user.interface";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";

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

  user: UserInterface | null = null
  action: boolean = false
  isChange: boolean = false

  passwordModal: boolean = false

  ngOnInit(): void {
    this.userService.getProfile()
      .then(user => {
        this.user = user
        this.fillForm()
      }, error => {
        console.log(error);
        this.router.navigate(['/'])
      })
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

  }

  logout() {
    this.action = true
    this.userService.logout()
      .then(() => {
        localStorage.setItem('shopping_cart', JSON.stringify([]))
        this.userService.user$.next(undefined)
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

}
