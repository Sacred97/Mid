import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilterOptions} from "../../../shared/services-interfaces/global-interfaces/filter.interface";

@Component({
  selector: 'app-catalog-filters',
  templateUrl: './catalog-filters.component.html',
  styleUrls: ['./catalog-filters.component.scss']
})
export class CatalogFiltersComponent implements OnInit {

  constructor() { }

  @Input() filterList: FilterOptions[] = []
  @Input() nameFilter: string = ''
  @Output() choiceFilter = new EventEmitter()

  ngOnInit(): void {
  }

  selectFilter(filterList: FilterOptions[], idx: number) {
    this.choiceFilter.emit({filterList: filterList, index: idx, name: this.nameFilter})
  }


  private classAction(el: Element): void {
    if (el.classList.contains('drop')) {
      el.classList.remove('drop')
    } else {
      el.classList.add('drop')
    }
  }

  dropList(event: Event) {
    const $target = event.currentTarget as HTMLButtonElement
    const $parent = $target.parentElement
    if (!$parent) return
    const $list = $parent.querySelector('ul')
    if (!$list) return;
    this.classAction($list)
    this.classAction($target)
  }

}
