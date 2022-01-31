import { Component, OnInit } from '@angular/core';
import {AdminService} from "../../../services/admin.service";
import {AdminUsers} from "../../../interfaces/admin-users.interface";

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.scss']
})
export class AdminUsersListComponent implements OnInit {

  constructor(private adminService: AdminService) { }

  usersList: AdminUsers[] = []
  usersListClone: AdminUsers[] = []
  total: number = 0
  totalSafe: number = 0
  page: number = 1

  loading: boolean = false
  action: boolean = false

  ngOnInit(): void {

    this.getUsers(this.page)

  }

  private getUsers(offset: number) {
    this.loading = true
    this.adminService.getUsers(0)
      .then(data => {
        this.usersList = data.users
        this.usersListClone = JSON.parse(JSON.stringify(this.usersList))
        this.total = this.totalSafe = data.count
      }, error => {
        console.log(error);
        this.usersList = []
        this.usersListClone = []
        this.total = this.totalSafe = 0
        this.page = 1
      })
      .finally(() => {
        this.loading = false
      })
  }

  changePage(page: number) {
    this.page = page
    const offset = (this.page * 20) - 20
    this.getUsers(offset)
  }

  searchUser(event: Event) {
    const query = (event.target as HTMLInputElement).value
    if (!query) {
      this.usersList = JSON.parse(JSON.stringify(this.usersListClone))
      this.total = this.totalSafe
      return
    }
    this.adminService.getUsers(0, query)
      .then(data => {
        this.usersList = data.users
        this.total = data.count
      }, error => {
        console.log(error);
        this.usersList = JSON.parse(JSON.stringify(this.usersListClone))
        this.total = this.totalSafe
      })
  }

  removeUser(id: number, idx: number) {
    this.action = true
    this.adminService.deleteUser(id)
      .then(message => {
        console.log(message.message);
        this.usersList.splice(1, idx)
        this.usersListClone = JSON.parse(JSON.stringify(this.usersList))
        this.totalSafe = this.total = this.total - 1
      }, error => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

}
