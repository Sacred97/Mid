import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../../shared/services-interfaces/user-service/user.service";
import {
  ManagerInterface,
  UserInterface,
  UserManagerCreate, UserManagerUpdate
} from "../../../shared/services-interfaces/user-service/user.interface";

@Component({
  selector: 'app-my-contacts',
  templateUrl: './my-contacts.component.html',
  styleUrls: ['./my-contacts.component.scss']
})
export class MyContactsComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) {
  }

  action: boolean = false

  formAdd: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    additionalPhone: new FormControl('', []),
  })
  formError: boolean = false

  formVisible: boolean = false

  user: UserInterface | null = null

  ngOnInit(): void {
    this.userService.getProfile()
      .then(data => {
        this.user = data
      }, error => {
        console.log(error);
        this.router.navigate(['/'])
      })
  }

  addNewContact() {
    this.action = true
    let createData: UserManagerCreate = {
      fullName: this.formAdd.value.fullName.trim(),
      phone: this.formAdd.value.phone.trim(),
      email: this.formAdd.value.email.trim()
    }
    if (this.formAdd.value.additionalPhone.trim()) {
      createData.additionalPhone = this.formAdd.value.additionalPhone.trim()
    }
    this.userService.addManager(createData)
      .then(data => {
        this.user!.manager = data
        this.formError = false
        this.formAdd.reset()
        this.formVisible = false
      }, error => {
        console.log(error);
        this.formError = true
      })
      .finally(() => {
        this.action = false
      })
  }

  removeManager(id: number) {
    this.action = true
    this.userService.deleteManager(id)
      .then(data => {
        this.user!.manager = data
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  modalWindow: boolean = false
  formUpdate: FormGroup = new FormGroup({
    id: new FormControl(''),
    fullName: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(11)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    additionalPhone: new FormControl('', []),
  })
  formUpdateError: boolean = false

  manager: ManagerInterface | null = null
  modalError: boolean = false

  closeModal() {
    if (this.action) return
    this.formUpdate.reset()
    this.modalError = false
    this.manager = null
    this.modalWindow = false
  }

  private modalFormFill(data: ManagerInterface) {
    this.formUpdate.controls['id'].setValue(data.id)
    this.formUpdate.controls['fullName'].setValue(data.fullName)
    this.formUpdate.controls['phone'].setValue(data.phone)
    this.formUpdate.controls['email'].setValue(data.email)
    if (data.additionalPhone) this.formUpdate.controls['additionalPhone'].setValue(data.additionalPhone)
  }

  prepareToUpdateManager(id: number) {
    this.action = true
    this.modalWindow = true
    this.userService.getManager(id)
      .then(data => {
        this.manager = data
        this.modalFormFill(data)
      }, error => {
        console.log(error);
        this.modalError = true
      })
      .finally(() => {
        this.action = false
      })
  }

  updateManager() {
    this.action = true
    let updateData: UserManagerUpdate = {
      id: this.formUpdate.value.id,
      fullName: this.formUpdate.value.fullName.trim(),
      phone: this.formUpdate.value.phone.trim(),
      email: this.formUpdate.value.email.trim()
    }
    if (this.formUpdate.value.additionalPhone.trim()) {
      updateData.additionalPhone = this.formUpdate.value.additionalPhone.trim()
    }

    this.userService.updateManager(updateData)
      .then(data => {
        this.user!.manager = data
        this.action = false
        this.closeModal()
      }, error => {
        this.action = false
        console.log(error);
        this.modalError = true
      })

  }

}
