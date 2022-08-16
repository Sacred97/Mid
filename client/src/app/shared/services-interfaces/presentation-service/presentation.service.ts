import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PresentationService {

  constructor(private http: HttpClient) {
  }

  getFilesName(): Promise<string[]> {
    const url = environment.apiUrl + 'presentation/files'
    return this.http.get<string[]>(url, {withCredentials: true}).toPromise()
  }

  download(fileName: string) {
    const url = environment.apiUrl + 'presentation/download/' + fileName
    return this.http.get(url, {withCredentials: true, responseType: "text"})
  }

}
