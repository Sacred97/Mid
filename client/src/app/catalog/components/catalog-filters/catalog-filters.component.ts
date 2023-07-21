import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges
} from '@angular/core';
import {FilterOptions} from "../../../shared/services-interfaces/global-interfaces/filter.interface";

@Component({
  selector: 'app-catalog-filters',
  templateUrl: './catalog-filters.component.html',
  styleUrls: ['./catalog-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogFiltersComponent implements OnInit {

  constructor() { }

  @Input() filterList: FilterOptions[] = []
  @Input() nameFilter: string = ''
  @Input() label: string = ''
  @Input() isShowLine: boolean = false
  @Output() choiceFilter = new EventEmitter()

  isShowed: boolean = false

  ngOnInit(): void {

  }

  selectFilter(filterList: FilterOptions[], idx: number) {
    this.choiceFilter.emit({filterList: filterList, index: idx, name: this.nameFilter})
  }

}
