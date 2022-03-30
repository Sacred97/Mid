import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-us',
  templateUrl: './us.component.html',
  styleUrls: ['./us.component.scss']
})
export class UsComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) {
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
  }

}
