import {Component, OnDestroy, OnInit} from '@angular/core';
import {MarkerService} from "../shared/services-interfaces/marker-service/marker.service";
import {UserService} from "../shared/services-interfaces/user-service/user.service";
import {UserInterface} from "../shared/services-interfaces/user-service/user.interface";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  constructor(public markerService: MarkerService, private userService: UserService) {
  }

  user: UserInterface | undefined = undefined
  sub: Subscription | null = null

  ngOnInit(): void {
    this.sub = this.userService.user$.subscribe(user => {
      this.user = user
    }, error => {
      console.log(error);
    })

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe()
  }

}
