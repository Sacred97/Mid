import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {
  UserInterface
} from "../../../shared/services-interfaces/user-service/user.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {DetailInterface} from "../../../shared/services-interfaces/detail-service/detail.interface";
import {MarkerService} from "../../../shared/services-interfaces/marker-service/marker.service";
import {ShoppingCartService} from "../../../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {DetailService} from "../../../shared/services-interfaces/detail-service/detail.service";
import {RecentlyViewedService} from "../../../shared/services-interfaces/recently-viewed-service/recently-viewed.service";
import {DetailIdInterface} from "../../../shared/services-interfaces/global-interfaces/detail-id.interface";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.scss']
})
export class WaitingListComponent implements OnInit {

  constructor(private userService: UserService, public markerService: MarkerService,
              public cartService: ShoppingCartService, private detailService: DetailService,
              public viewedService: RecentlyViewedService) {
  }

  user: UserInterface | null = null
  details: DetailInterface[] = []
  error: boolean = false
  loading: boolean = true
  action: boolean = false
  defaultImage: string = '../../../../assets/catalog/not-have-photo.jpg'

  formAdd: FormGroup = new FormGroup({
    profile: new FormControl('', [Validators.required]),
  })
  formAddError: boolean = false

  async ngOnInit() {
    try {
      this.user = await this.userService.getProfile()

      if (this.user.waitingList.emails === this.user.email) {
        this.formAdd.controls['profile'].setValue('Основной профиль')
      } else {
        const managerProfile = this.user.manager.find(m => m.email === this.user!.waitingList.emails)
        if (managerProfile) {
          this.formAdd.controls['profile'].setValue(managerProfile.fullName)
        } else {
          this.formAdd.controls['profile'].setValue('Неизвестно')
        }
      }

      const ids: DetailIdInterface[] = this.user.waitingList.waitingItem.map(i => ({id: i.detail.id}))
      this.details = await this.detailService.getByIds(ids)
      this.cartService.recountQuantity(this.details)
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false
    }

  }

  dropdown(event: Event) {
    const $target = (event.currentTarget as HTMLButtonElement).parentElement!
    if ($target.classList.contains('drop')) {
      $target.classList.remove('drop')
    } else {
      $target.classList.add('drop')
    }
  }

  upList(event: Event) {
    const $target = (event.currentTarget as HTMLLabelElement).parentElement!.parentElement!.parentElement!
    $target.classList.remove('drop')
  }

  getEmail(): string {
    if (!this.user) return ''
    const profile = this.formAdd.value.profile
    if (profile === 'Основной профиль') return this.user.email
    const candidate = this.user.manager.find(m => m.fullName === profile)
    if (candidate) return candidate.email
    return ''
  }

  changeRecipient() {
    const email: string = this.getEmail()
    if (!email) return;
    this.action = true

    this.userService.changeEmailNotification(email)
      .then(data => {
        this.user!.waitingList = data
        this.formAdd.reset()
        if (this.user!.waitingList.emails === this.user!.email) {
          this.formAdd.controls['profile'].setValue('Основной профиль')
        } else {
          const profileManager = this.user!.manager.find(m => m.email === this.user!.waitingList.emails)
          if (profileManager) this.formAdd.controls['profile'].setValue(profileManager.fullName)
        }
      }, error => {
        this.formAddError = true
        console.log(error);
      })
      .finally(() => this.action = false)


  }

  async increase(id: string, idx: number) {
    this.action = true
    await this.cartService.increase(this.details, idx)
    this.action = false
  }

  async decrease(id: string, idx: number) {
    this.action = true
    await this.cartService.decrease(this.details, idx)
    this.action = false
  }

  manualInput(event: Event, id: string, idx: number) {
    const $target = event.target as HTMLInputElement
    if (+$target.value < 1) {
      $target.value = '1'
    }
    this.details[idx].quantity = +$target.value
    if (this.cartService.check(id)) {
      this.action = true
      this.cartService.changes(id, +$target.value)
        .catch(error => {
          console.log(error);
          $target.value = '1'
          this.details[idx].quantity = 1
        })
        .finally(() => {
          this.action = false
        })
    }
  }


  addProduct(id: string, idx: number) {
    this.action = true
    this.cartService.addItem(id, this.details[idx].quantity)
      .catch((error: HttpErrorResponse) => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  removeFromWaitingList(detailId: string, idx: number) {
    const waitingListCard = this.user!.waitingList.waitingItem.find(i => i.detail.id === detailId)
    if (waitingListCard) {
      this.action = true
      this.userService.removeItemFromWaitingList(waitingListCard.id)
        .then(data => {
          this.user!.waitingList = data
          this.details.splice(idx, 1)
          this.userService.user$.next(this.user!)
        }, error => {
          console.log(error);
        })
        .finally(() => {
          this.action = false
        })
    }
  }

}
