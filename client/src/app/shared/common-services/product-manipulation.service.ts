import { Injectable } from '@angular/core';
import {HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProductManipulationService {

  constructor() {
  }

  // async increase(id: string, idx: number) {
  //   this.action = true
  //   if (this.shoppingService.check(id)) {
  //     await this.shoppingService.increase(this.details, idx)
  //     this.action = false
  //   } else {
  //     try {
  //       await this.shoppingService.addItem(id, this.details[idx].quantity)
  //       await this.shoppingService.increase(this.details, idx)
  //     } catch (error) {
  //       console.log(error);
  //     }
  //     this.action = false
  //   }
  // }
  //
  // async decrease(id: string, idx: number) {
  //   this.action = true
  //   await this.shoppingService.decrease(this.details, idx)
  //   this.action = false
  // }
  //
  // manualInput(event: Event, id: string, idx: number) {
  //   const $target = event.target as HTMLInputElement
  //   if (+$target.value < 1) {
  //     $target.value = '1'
  //   }
  //   this.details[idx].quantity = +$target.value
  //   if (this.shoppingService.check(id)) {
  //     this.action = true
  //     this.shoppingService.changes(id, +$target.value)
  //       .catch(error => {
  //         console.log(error);
  //         $target.value = '1'
  //         this.details[idx].quantity = 1
  //       })
  //       .finally(() => {
  //         this.action = false
  //       })
  //   }
  // }
  //
  // addProduct(id: string, idx: number) {
  //   this.action = true
  //   this.shoppingService.addItem(id, this.details[idx].quantity)
  //     .catch((error: HttpErrorResponse) => {
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       this.action = false
  //     })
  // }


}
