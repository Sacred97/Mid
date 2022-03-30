import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {
  }

  private hostname: string = 'http://midkam.pro:3000/midkam_api/'
  // private hostname: string = 'http://localhost:3000/midkam_api/'

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url = this.hostname + 'auth/admin'
    return this.http.get<any>(url, {withCredentials: true}).toPromise()
      .then(status => {
        return status.status
      }, error => {
        console.log(error);
        this.router.navigate(['/'])
        return false
      })
  }

}
