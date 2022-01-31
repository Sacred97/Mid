import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {DaDataResponse} from "../global-interfaces/response.interface";

@Injectable({
  providedIn: 'root'
})

export class DaDataService {

  constructor(private http: HttpClient) {
  }

  private headers = new HttpHeaders()
    .set('Authorization', 'Token ' + environment.daDataConfig.apiKey)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')

  getDaDataAddress(query: string): Promise<DaDataResponse> {
    // return this.http.post<{suggestions: any[]}>(environment.daDataConfig.addressUrl,
    //   {query: query, from_bound: {value: "city"}, to_bound: {value:"city"}, locations: [{city_type_full: "город"}]},
    //   {headers: this.headers}).toPromise()

    return this.http.post<{suggestions: any[]}>(environment.daDataConfig.addressUrl,
      {query: query}, {headers: this.headers}).toPromise()
  }

  getDaDataCompany(query: string): Promise<DaDataResponse> {
    return this.http.post<{suggestions: any[]}>(environment.daDataConfig.companyUrl,
      {query: query}, {headers: this.headers}).toPromise()
  }

}
