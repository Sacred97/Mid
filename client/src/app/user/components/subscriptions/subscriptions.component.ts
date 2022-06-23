import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {
  NewsLetter,
  SubscriptionUserInterface,
  UserInterface, UserSubscriptionCreate, UserSubscriptionUpdate
} from "../../../shared/services-interfaces/user-service/user.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {
  }

  subscriptions: SubscriptionUserInterface[] = []
  newsLetter: NewsLetter[] = []
  user: UserInterface | undefined = this.userService.user$.getValue()
  error: boolean = false
  loading: boolean = true
  action: boolean = false

  formAdd: FormGroup = new FormGroup({
    profile: new FormControl('', [Validators.required]),
    newsLetter: new FormControl('', [Validators.required]),
    notice: new FormControl()
  })
  formVisible: boolean = false
  formAddError: boolean = false

  async ngOnInit() {
    if (!this.user) {
      this.router.navigate(['/'])
      return
    }

    try {
      this.subscriptions = this.sortSubs(await this.userService.getAllUserSubscriptions())
      this.newsLetter = await this.userService.getAllNewsLetter()
    } catch (e) {
      console.log(e);
      this.error = true
    }

    this.loading = false

  }

  getProfileName(email: string): string {
    if (!this.user) return ''
    if (this.user.email === email) return 'Основной профиль'
    const candidate = this.user.manager.find(m => m.email === email)
    if (!candidate) return ''
    return candidate.fullName
  }

  getEmail(): string {
    if (!this.user) return ''
    const profile = this.formAdd.value.profile
    if (profile === 'Основной профиль') return this.user.email
    const candidate = this.user.manager.find(m => m.fullName === profile)
    if (candidate) return candidate.email
    return ''
  }

  getNameNewsLetter() {
    const id = this.formAdd.value.newsLetter
    const candidate = this.newsLetter.find(nl => nl.id === id)
    if (candidate) {
      return candidate.name
    } else {
      return '-'
    }
  }

  showHideForm() {
    if (this.formVisible) {
      this.formVisible = false
      this.formAdd.reset()
    } else {
      this.formVisible = true
      this.formAdd.controls['profile'].setValue('Основной профиль')
    }
  }

  prepareToUpdateSubscription(id: number) {
    this.action = true
    this.modalWindow = true
    this.userService.getSubscription(id)
      .then(data => {
        this.subModal = data
        this.modalForm.controls['profile'].setValue(this.getNameProfile(data.email))
        this.modalForm.controls['newsLetter'].setValue(data.newsLetter.id)
        this.modalForm.controls['notice'].setValue(data.notice)
      }, error => {
        console.log(error);
        this.modalError = true
      })
      .finally(() => {
        this.action = false
      })
  }

  removeSubscription(id: number) {
    this.action = true
    this.userService.deleteSubscription(id)
      .then(data => {
        this.subscriptions = data
        this.user!.subscriptions = data
        this.userService.user$.next(this.user)
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  createSubscription() {
    this.action = true

    const email: string = this.getEmail()
    if (!email) {
      this.action = false
      return
    }

    let data: UserSubscriptionCreate = {email: email, newsLetterId: this.formAdd.value.newsLetter}
    if (this.formAdd.value.notice) data.notice = this.formAdd.value.notice

    this.userService.addSubscription(data)
      .then(res => {
        this.subscriptions = this.sortSubs(res)
        this.user!.subscriptions = this.sortSubs(res)
        this.userService.user$.next(this.user)
        this.showHideForm()
      }, error => {
        console.log(error);
        this.formAddError = true
      })
      .finally(() => {
        this.action = false
      })
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

  //--------------------------------------------------------------------------------------------------------------------

  modalWindow: boolean = false

  subModal: SubscriptionUserInterface | null = null
  modalError: boolean = false
  modalForm: FormGroup = new FormGroup({
    profile: new FormControl('', [Validators.required]),
    newsLetter: new FormControl('', [Validators.required]),
    notice: new FormControl()
  })
  updateError: boolean = false

  closeModal() {
    if (this.action) return
    this.modalForm.reset()
    this.subModal = null
    this.modalError = false
    this.updateError = false
    this.modalWindow = false
  }

  updateSub() {
    if (!this.subModal) return
    const email: string = this.getEmailModal()
    if (!email) return

    this.action = true


    let data: UserSubscriptionUpdate = {
      id: this.subModal.id,
      email: email,
      newsLetterId: this.modalForm.value.newsLetter,
      notice: this.modalForm.value.notice
    }

    this.userService.updateSubscription(data)
      .then(res => {
        this.action = false
        this.subscriptions = this.sortSubs(res)
        this.user!.subscriptions = this.sortSubs(res)
        this.userService.user$.next(this.user)
        this.closeModal()
      }, error => {
        console.log(error);
        this.action = false
        this.updateError = true
      })

  }

  getNameProfile(email: string): string {
    if (!this.user) return ''
    if (this.user.email === email) return 'Основной профиль'
    const candidate = this.user.manager.find(m => m.email === email)
    if (candidate) return candidate.fullName
    return ''
  }

  getEmailModal(): string {
    if (!this.user) return ''
    const profile = this.modalForm.value.profile
    if (profile === 'Основной профиль') return this.user.email
    const candidate = this.user.manager.find(m => m.fullName === profile)
    if (candidate) return candidate.email
    return ''
  }

  getNameNewsLetterModal() {
    const id = this.modalForm.value.newsLetter
    const candidate = this.newsLetter.find(nl => nl.id === id)
    if (candidate) {
      return candidate.name
    } else {
      return '-'
    }
  }

  private sortSubs(subs: SubscriptionUserInterface[]): SubscriptionUserInterface[] {
    subs.sort((a, b) => {
      return a > b ? 1 : a === b ? 0 : -1
    })
    return subs
  }

}
