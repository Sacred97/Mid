import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AdminService} from "../../../services/admin.service";
import {
  CategoryInterface,
  ProductGroupInterface
} from "../../../../shared/services-interfaces/detail-service/category.interface";
import {AdminUpdateCategory} from "../../../interfaces/admin-category.interface";

@Component({
  selector: 'app-admin-category-edit',
  templateUrl: './admin-category-edit.component.html',
  styleUrls: ['./admin-category-edit.component.scss']
})
export class AdminCategoryEditComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router: Router,
              private adminService: AdminService) {
  }

  @ViewChild('list') listEl?: ElementRef

  //--------------------------------------------Форма взаимодействия----------------------------------------------------

  categoryForm: FormGroup = new FormGroup({
    category: new FormControl('', [Validators.required]),
    productGroup: new FormControl('', [Validators.required])
  })

  private fillForm() {
    this.categoryForm.controls['category'].setValue(this.category!.categoryName)
    this.categoryForm.controls['productGroup'].setValue(this.category!.productGroup.id)
  }

  getProductGroupName() {
    if (this.categoryForm.value.productGroup) {
      const candidate = this.productGroup.find(i => i.id === this.categoryForm.value.productGroup)
      return candidate ? candidate.productGroup : `${this.categoryForm.value.productGroup} (id)`
    }

    return 'Без привязки'
  }

  //------------------------------------------Инициализация компонента--------------------------------------------------

  category: CategoryInterface | null = null
  productGroup: ProductGroupInterface[] = []
  errorMessage: string = ''
  action: boolean = false
  id: string = this.activatedRoute.snapshot.params['id']

  ngOnInit(): void {

    this.adminService.getCategory(this.id)
      .then(data => {
        if (!data) {
          this.errorMessage = 'Категория не найдена'
          return
        }
        this.errorMessage = ''
        this.category = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.errorMessage = error.error.message
      })

    this.adminService.getProductGroupList()
      .then(data => {
        this.productGroup = data
      }, error => {
        console.log(error);
      })
  }

  //--------------------------------------------Обновление Категории----------------------------------------------------

  successful: boolean = false
  updateError: string = ''

  update() {
    this.action = true
    this.successful = false
    const data: AdminUpdateCategory = {
      id: this.id,
      categoryName: this.categoryForm.value.category,
      productGroupId: this.categoryForm.value.productGroup
    }
    this.adminService.updateCategory(data)
      .then(data => {
        this.successful = true
        this.category = data
        this.fillForm()
      }, error => {
        console.log(error);
        this.updateError = error.error.message
      })
      .finally(() => {
        this.action = false
      })
  }

  //---------------------------------------------Манипуляции с DOM------------------------------------------------------

  dropDown() {
    const $target = this.listEl!.nativeElement as HTMLUListElement
    if ($target.classList.contains('drop')) {
      $target.classList.remove('drop')
    } else {
      $target.classList.add('drop')
    }
  }

}
