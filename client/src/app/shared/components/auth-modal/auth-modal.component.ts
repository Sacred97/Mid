import {
  Component,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {UserService} from "../../services-interfaces/user-service/user.service";
import {HttpErrorResponse} from "@angular/common/http";
import {NewUserInterface} from "../../services-interfaces/user-service/user.interface";
import {Router} from "@angular/router";
import {ShoppingCartService} from "../../services-interfaces/shopping-cart-service/shopping-cart.service";
import {CartItemInfoInterface} from "../../services-interfaces/global-interfaces/cart-item-info.interface";
import {ShoppingCartInterface} from "../../services-interfaces/shopping-cart-service/shopping-cart.interface";

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent implements OnInit {

  constructor(private router: Router, private formBuilder: FormBuilder,
              private userService: UserService, private shoppingCartService: ShoppingCartService) {
  }

  @Output() close = new EventEmitter<void>()

  forgotPasswordAction: boolean = false
  restoreForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required])
  })
  notice: boolean = false
  errorRestore: string = ''

  signIn: boolean = true
  formLogin: FormGroup = new FormGroup({
    email: new FormControl(localStorage.getItem('email'), [Validators.email, Validators.required]),
    //Пароль убрать потом, для быстрого входа указал
    password: new FormControl('123456', [Validators.required, Validators.minLength(6)]),
    isSave: new FormControl(!!localStorage.getItem('email'))
  })
  errorLogin: string = ''

  registrationAction: boolean = false
  formRegistration: FormGroup = this.formBuilder.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    phone: ['+7', [Validators.maxLength(12), Validators.minLength(12), Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    checkbox: [false, [Validators.requiredTrue]]
  }, {validators: this.matchConfirmPassword()})
  errorRegistration: string = ''

  submitted: boolean = false

  ngOnInit(): void {
  }

  matchConfirmPassword() {
    return (control: AbstractControl): ValidationErrors | null => {
      const passwordControl = control.get('password')
      const confirmPasswordControl = control.get('confirmPassword')
      if (passwordControl === null && confirmPasswordControl === null) {
        return null
      }
      if (confirmPasswordControl?.errors && !confirmPasswordControl.errors.mismatch) {
        return null
      }
      if (passwordControl?.value !== confirmPasswordControl?.value) {
        confirmPasswordControl?.setErrors({mismatch: true})
        return ({mismatch: true})
      } else {
        confirmPasswordControl?.setErrors(null)
        return null
      }
    }
  }

  registrationUser() {
    this.submitted = true

    const newUser: NewUserInterface = {
      fullName: this.formRegistration.value.fullName,
      email: this.formRegistration.value.email.trim().toLowerCase(),
      phone: this.formRegistration.value.phone,
      password: this.formRegistration.value.password
    }

    this.userService.registration(newUser)
      .then((data) => {
        console.log(data);
        this.registrationAction = true
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
        if (error.error.statusCode === 409) {
          this.errorRegistration = 'Такой пользователь уже зарегестрирован.'
          return
        }
        this.errorRegistration = 'Что-то пошло не так. Попробуйте еще раз'
      })
      .finally(() => {
        this.submitted = false
      })
  }

  login() {
    this.submitted = true

    const user = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password,
      isSave: this.formLogin.value.isSave
    }

    this.userService.login(user.email, user.password).then(userCredential => {

      if (user.isSave) {
        localStorage.setItem('email', user.email)
      } else {
        localStorage.removeItem('email')
      }

      const shoppingCart = this.shoppingCartService.storage()
      if (!!shoppingCart && shoppingCart.length>0) {
        const cartInfo: CartItemInfoInterface[]  = shoppingCart.map(i => ({
          detailId: i.id, quantity: i.quantity
        }))
        this.userService.addCartItem(cartInfo).then(shoppingCartUpdated => {
          userCredential.shoppingCart = shoppingCartUpdated
          const newLocalShoppingCart: ShoppingCartInterface[] = shoppingCartUpdated.cartItem.map(i => ({
            id: i.detail.id, quantity: i.quantity
          }))
          localStorage.setItem('shopping_cart', JSON.stringify(newLocalShoppingCart))
          this.shoppingCartService.totalCost = userCredential.shoppingCart.totalCost
          this.shoppingCartService.itemsQuantity = userCredential.shoppingCart.cartItem.length
          this.userService.user$.next(userCredential)
        })
      } else {
        const userShoppingCart: ShoppingCartInterface[] = userCredential.shoppingCart.cartItem.map(i => ({
          id: i.detail.id, quantity: i.quantity
        }))
        localStorage.setItem('shopping_cart', JSON.stringify(userShoppingCart))
        this.shoppingCartService.totalCost = userCredential.shoppingCart.totalCost
        this.shoppingCartService.itemsQuantity = userCredential.shoppingCart.cartItem.length
        this.userService.user$.next(userCredential)
      }
      this.close.emit()
      this.router.navigate(['/'])
    }).catch((error: HttpErrorResponse) => {
      console.log(error);
      this.userService.user$.next(undefined)
      if (error.error.statusCode === 400) {
        this.errorLogin = error.error.message
      }
      if (error.error.statusCode === 403) {
        this.errorLogin = error.error.message
      }
    }).finally(() => {
      this.submitted = false
    })

  }

  restorePassword() {
    this.submitted = true
    const email: string = this.restoreForm.value.email.trim().toLowerCase()
    this.userService.restorePassword(email)
      .then(() => {
        this.notice = true
        this.errorRestore = ''
      }, error => {
        console.log(error);
        if (error.error.statusCode === 404) {
          this.errorRestore = 'Пользователь не найден'
          return
        }
        this.errorRestore = 'Что-то произошло не так, повторите попытку позже'
      })
      .finally(() => {
        this.submitted = false
      })
  }

}
