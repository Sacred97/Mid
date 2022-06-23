import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    const url = environment.apiUrl + 'auth/admin'
    return this.http.get<{status: boolean}>(url, {withCredentials: true}).toPromise()
      .then(status => {
        return status.status
      }, error => {
        console.log(error);
        this.router.navigate(['/'])
        return false
      })
  }

}
