import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-get-price-list-modal',
  templateUrl: './get-price-list-modal.component.html',
  styleUrls: ['./get-price-list-modal.component.scss']
})
export class GetPriceListModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>()

  isDropDown: boolean = false

  form!: FormGroup

  priceList: string[] = []

  chooseList: string[] = []

  submitted: boolean = false
  isSuccessful: boolean = false
  isFailed: boolean = false

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    const url = environment.apiUrl + 'price-list/get'
    this.http.get<string[]>(url, {withCredentials: true}).toPromise()
      .then((files: string[]) => {
        this.priceList = files
      }).catch((error: HttpErrorResponse) => {
        console.log(error);
        this.priceList = []
      })

    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.minLength(11), Validators.required]),
      price: new FormControl([], [Validators.required])
    })

  }

  selectList() {
    for (let item of this.form.controls['price'].value) {
      if (this.chooseList.includes(item)) continue;
      this.chooseList.push(item)
    }
    this.form.controls['price'].setValue(this.chooseList)
  }

  removeItem(idx: number) {
    this.chooseList.splice(idx, 1)
    this.form.controls['price'].setValue(this.chooseList)
  }

  priceOnSubmit() {
    this.submitted = true
    const data = {
      email: this.form.controls['email'].value,
      name: this.form.controls['name'].value,
      phone: this.form.controls['phone'].value,
      price: this.form.controls['price'].value
    }

    const url = environment.apiUrl + 'price-list/get'

    this.http.post(url, data, {withCredentials: true}).toPromise()
      .then((okStatus: any) => {
        console.log(okStatus);
      }).catch((error: HttpErrorResponse) => {
        console.log(error)
        this.submitted = false
        this.isFailed = true
        this.chooseList = []
        this.form.reset()
      }).finally(() => {
        this.submitted = false
        this.isSuccessful = true
        this.chooseList = []
        this.form.reset()
      })

  }

  retry() {
    this.submitted = false
    this.isFailed = false
    this.isSuccessful = false
  }
}
