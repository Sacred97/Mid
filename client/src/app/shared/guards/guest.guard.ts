import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {UserService} from "../services-interfaces/user-service/user.service";
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return this.userService.refreshToken().then((state) => {
      if (state) {
        this.router.navigate(['/'])
        return false
      } else {
        return true
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
      return true
    })

  }

}
