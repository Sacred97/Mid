import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.http.get<any>('http://localhost:3000/midkam_api/auth/admin',
      {withCredentials: true})
      .toPromise()
      .then(status => {
        return status.status
      }, error => {
        console.log(error);
        this.router.navigate(['/'])
        return false
      })
  }

}
