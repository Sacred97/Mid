import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit, OnDestroy {
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
  }

  private unsub!: Subscription
  action: string = ''
  token: string = ''

  ngOnInit(): void {
    this.unsub = this.activatedRoute.queryParams.subscribe((params) => {
      this.action = params['mode']
      this.token = params['token']
      if (!this.action) this.router.navigate(['/'])
    })
  }

  ngOnDestroy(): void {
    this.unsub.unsubscribe()
  }

}
