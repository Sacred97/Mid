import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-catalog-type',
  templateUrl: './catalog-type.component.html',
  styleUrls: ['./catalog-type.component.scss']
})
export class CatalogTypeComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.router.navigate(['/', 'catalog'])
  }

}
