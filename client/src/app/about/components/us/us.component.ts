import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import tinymce from "tinymce";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-us',
  templateUrl: './us.component.html',
  styleUrls: ['./us.component.scss']
})
export class UsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer, private http: HttpClient) {
    sanitizer.bypassSecurityTrustHtml(this.output)
    sanitizer.bypassSecurityTrustResourceUrl(this.output)
    sanitizer.bypassSecurityTrustScript(this.output)
    sanitizer.bypassSecurityTrustStyle(this.output)
    sanitizer.bypassSecurityTrustUrl(this.output)
  }

  form: FormGroup = new FormGroup({
    content: new FormControl('', [])
  })

  output: any

  ngOnInit(): void {
  }

  sbm() {
    const post = '<div class="posts">' + this.form.value.content + '</div>'
    const url: string = 'http://localhost:3000/midkam_api/banners'
  }

}
