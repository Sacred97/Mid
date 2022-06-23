import { Component, OnInit } from '@angular/core';
import {NgDynamicBreadcrumbService} from "ng-dynamic-breadcrumb";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  constructor(private breadcrumbService: NgDynamicBreadcrumbService) { }

  ngOnInit(): void {
  }

}
