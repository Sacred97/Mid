import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services-interfaces/user-service/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    return this.userService.refreshToken().then((state) => {
      if (state) {
        return true
      } else {
        this.router.navigate(['/'])
        return false
      }
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.router.navigate(['/'])
      return false
    })

  }
  
}
