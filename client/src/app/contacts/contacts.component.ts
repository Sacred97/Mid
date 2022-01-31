import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    // let url = this.router.url.split('/')
    // if (!url[0]) url.splice(0, 1)
    // console.log(url)
    // if (url.length === 1) {
    //   this.router.navigate(['/contacts/selling'])
    // }
  }

}
