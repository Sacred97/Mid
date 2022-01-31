import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  chooseId(event: Event, route: string[]) {
    const $target = event.currentTarget as HTMLButtonElement
    const $parent = $target.parentElement
    if (!$parent) return
    const $input = $parent.querySelector('input')
    if (!$input) return;
    const id = $input.value
    if (id) route.push(id)
    this.router.navigate(route)

  }

}
