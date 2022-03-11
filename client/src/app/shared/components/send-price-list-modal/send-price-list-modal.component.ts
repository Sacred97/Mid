import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-send-price-list-modal',
  templateUrl: './send-price-list-modal.component.html',
  styleUrls: ['./send-price-list-modal.component.scss']
})
export class SendPriceListModalComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<void>()

  form!: FormGroup

  phone$!: Subscription
  email$!: Subscription
  submitted: boolean = false
  isSuccessful: boolean = false
  isFailed: boolean = false
  file: File | null = null

  constructor(private http: HttpClient) {
   
  }

  hostname: string = 'http://localhost:3000/midkam_api/price-list/send'

  ngOnInit(): void {
    this.form = new  FormGroup({
      name: new FormControl('', [Validators.required]),
      file: new FormControl('', []),
      text: new FormControl('', []),
      comment: new FormControl('', []),
      isRecall: new FormControl(false, []),
      isSendToMail: new FormControl(false, [])
    }, [this.atLeastOneValidator, this.atLeastOneValidatorOfCheckBox])

     this.phone$ = this.form.controls['isRecall'].valueChanges.subscribe(value => {
       if (value) {
         this.form.addControl('phone', new FormControl('', [Validators.required,
           Validators.minLength(11)]))
       } else {
         !!this.form.controls['phone']?this.form.controls['phone'].setValue(''):null
         this.form.removeControl('phone')
       }

    })

    this.email$ = this.form.controls['isSendToMail'].valueChanges.subscribe(value => {

      if (value) {
        this.form.addControl('email', new FormControl('', [Validators.required, Validators.email]))
      } else {
        !!this.form.controls['email']?this.form.controls['email'].setValue(''):null
        this.form.removeControl('email')
      }

    })

  }

  // @ts-ignore
  public atLeastOneValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const file = control.controls['file'].value
    const text = control.controls['text'].value
    const comment = control.controls['comment'].value

    if (!file && !text && !comment) {
      return {
        atLeastOneRequired: {
          text: 'Загрузите файл, либо заполните специальное поле или комментарий'
        }
      }
    } else {
      return null
    }
  }

  // @ts-ignore
  atLeastOneValidatorOfCheckBox: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const isRecall: boolean = control.controls['isRecall'].value
    const isSendToMail: boolean = control.controls['isSendToMail'].value

    if (!isRecall && !isSendToMail) {
      return {
        atLeastOneValidatorOfCheckBox: {
          text: 'Один из видов обратной связи должен быть выбран'
        }
      }
    } else {
      return null
    }
  }

  selectFile(event: Event) {
    const el = event.target as HTMLInputElement
    el.files && el.files.length>0?this.file = el.files[0]:this.file = null
  }


  ngOnDestroy(): void {
    this.phone$.unsubscribe()
    this.email$.unsubscribe()
  }

  sendPriceData() {
    this.submitted = true

    const formData = new FormData()
    formData.append('name', this.form.value.name)
    this.form.value.file && this.file?formData.append('file', this.file):null
    this.form.value.text?formData.append('text', this.form.value.text):null
    this.form.value.comment?formData.append('comment', this.form.value.comment):null
    this.form.value.isRecall?formData.append('phone', this.form.value.phone):null
    this.form.value.isSendToMail?formData.append('email', this.form.value.email):null

    this.http.post(this.hostname, formData).toPromise().then((res:any) => {
      console.log(res);
    }).catch((error: HttpErrorResponse) => {
      console.log(error);
      this.submitted = false
      this.isFailed = true
    }).finally(() => {
      this.file = null
      this.submitted = false
      this.isSuccessful = true
      this.form.reset()
    })
  }

}
