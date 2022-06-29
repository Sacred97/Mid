import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DetailService} from "../shared/services-interfaces/detail-service/detail.service";
import {UserService} from "../shared/services-interfaces/user-service/user.service";
import {ShoppingCartService} from "../shared/services-interfaces/shopping-cart-service/shopping-cart.service";
import {ManufacturerService} from "../shared/services-interfaces/manufacturer-service/manufacturer.service";
import {DetailInterface} from "../shared/services-interfaces/detail-service/detail.interface";
import {ManufacturerInterface} from "../shared/services-interfaces/detail-service/manufacturer.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {AdminBanner} from "../admin/interfaces/admin-banner.interface";
import {BannersService} from "../shared/services-interfaces/banners-service/banners.service";
import {CertificateInterface} from "../shared/services-interfaces/certificate-service/certificate.interface";
import {CertificateService} from "../shared/services-interfaces/certificate-service/certificate.service";
import {MarkerService} from "../shared/services-interfaces/marker-service/marker.service";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  constructor(private detailService: DetailService, private userService: UserService,
              private bannersService: BannersService, private certificateService: CertificateService,
              private markerService: MarkerService,
              private manufacturerService: ManufacturerService, public cartService: ShoppingCartService) {
  }

  @ViewChild('modalImage', {static: true}) $modalEl?: ElementRef

  //------------------------------------------------Статичные данные----------------------------------------------------

  bannersSliderConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": window.innerWidth >= 768,
    "infinite": true,
    "centerMode": true,
    "variableWidth": true,
    "autoplay": true,
    "autoplaySpeed": 10000
  };

  detailsSliderConfig = {
    "slidesToShow": window.innerWidth >= 768 ? 4 : 1,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": false,
    "infinite": false,
    "variableWidth": true,
    "centerMode": window.innerWidth < 768,
    "autoplay": true,
    "autoplaySpeed": 10000
  }

  manufacturersSliderConfig = {
    "slidesToShow": 1,
    "slidesToScroll": 1,
    "rows" : window.innerWidth >= 768 ? 5 : 2,
    "slidesPerRow": 1,
    "dots": true,
    "arrows": false,
    "infinite": true,
    "variableWidth": true,
    "autoplay": true,
    "autoplaySpeed": 10000
  }

  certificatesSliderConfig = {
    "slidesToShow": window.innerWidth >= 768 ? 4 : 1,
    "slidesToScroll": 1,
    "dots": true,
    "arrows": false,
    "infinite": false,
    "variableWidth": true,
    "autoplay": true,
    "autoplaySpeed": 10000
  }

  defaultImage: string = "../../assets/catalog/not-have-photo.jpg"

  //----------------------------------------------------Основное--------------------------------------------------------

  banners: AdminBanner[] = []
  detailsPopular: DetailInterface[] = []
  detailsNew: DetailInterface[] = []
  detailsSale: DetailInterface[] = []
  manufacturers: ManufacturerInterface[] = []
  certificates: CertificateInterface[] = []

  isMobile: boolean = window.innerWidth < 768
  mobileMainBannerWidth = window.innerWidth * 0.93 - 20

  action: boolean = false

  modal: boolean = false

  slideWidth: number = 0
  slideManufacturer: number = 0
  slideCertificate: number = 0

  async ngOnInit() {
    if (window.innerWidth >= 1615) {
      this.slideWidth = Math.round(1440 / 4)
      this.slideManufacturer = Math.round(1440 / 5)
    } else if (window.innerWidth < 1615 && window.innerWidth > 1024) {
      this.slideWidth = Math.round(((window.innerWidth - 20) * 0.892) / 4)
      this.slideManufacturer = Math.round(((window.innerWidth - 20) * 0.892) / 5)
    } else if (window.innerWidth <= 1024 && window.innerWidth >= 768) {

    } else {
      this.slideManufacturer = Math.round((window.innerWidth * 0.93) / 3)
      this.slideCertificate = Math.round((window.innerWidth * 0.93) / 4)
    }

    // if (window.innerWidth <= 1024) {
    //   this.slideWidth = Math.round(((window.innerWidth) * 0.892) / 3)
    //   if (window.innerWidth <= 614) {
    //     this.slideWidth = Math.round((window.innerWidth) * 0.892)
    //   }
    // } else {
    //   this.slideWidth = Math.round(((window.innerWidth - 17) * 0.892) / 4)
    // }

    try {
      this.banners = await this.bannersService.getBannerForPage(true)
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await this.detailService.getRandomDetailsForHomePage()
      this.detailsNew = response.new
      this.detailsPopular = response.recent
      this.detailsSale = response.sale
      this.cartService.recountQuantity(response.new)
      this.cartService.recountQuantity(response.recent)
      this.cartService.recountQuantity(response.sale)
    } catch (error) {
      console.log(error);
    }

    try {
      this.manufacturers = await this.manufacturerService.getRandomManufacturer()
    } catch (error) {
      console.log(error);
    }

    try {
      this.certificates = await this.certificateService.getRandomCertificates()
    } catch (error) {
      console.log(error);
    }

  }

  slickInit(event: any) {
    setTimeout(() => {
      event.slick.setPosition()
    }, 500)
  }

  openCertificate(event: Event) {
    const src = (event.target as HTMLImageElement).src
    const $target = this.$modalEl?.nativeElement as HTMLImageElement
    $target.src = src
    this.modal = true
  }

  //-----------------------------------------Манипуляция с кнопками слайдера--------------------------------------------

  first: boolean = true
  second: boolean = false
  third: boolean = false
  fourth: boolean = false
  fifth: boolean = false

  addClassToggled(number: "first" | "second" | "third" | "fourth" | "fifth") {
    this.first = false
    this.second = false
    this.third = false
    this.fourth = false
    this.fifth = false

    this[number] = true
  }

  //---------------------------------------------Действия с товаром-----------------------------------------------------

  async increase(details: DetailInterface[], id: string, idx: number) {
    this.action = true
    if (this.cartService.check(id)) {
      await this.cartService.increase(details, idx)
      this.action = false
    } else {
      try {
        await this.cartService.addItem(id, details[idx].quantity)
        await this.cartService.increase(details, idx)
      } catch (error) {
        console.log(error);
      }
      this.action = false
    }
  }

  async decrease(details: DetailInterface[], id: string, idx: number) {
    this.action = true
    await this.cartService.decrease(details, idx)
    this.action = false
  }

  manualInput(event: Event, details: DetailInterface[], id: string, idx: number) {
    const $target = event.target as HTMLInputElement
    if (+$target.value < 1) {
      $target.value = '1'
    }
    details[idx].quantity = +$target.value
    if (this.cartService.check(id)) {
      this.action = true
      this.cartService.changes(id, +$target.value)
        .catch(error => {
          console.log(error);
          $target.value = '1'
          details[idx].quantity = 1
        })
        .finally(() => {
          this.action = false
        })
    }
  }


  addProduct(details: DetailInterface[], id: string, idx: number) {
    this.action = true
    this.cartService.addItem(id, details[idx].quantity)
      .catch((error: HttpErrorResponse) => {
        console.log(error);
      })
      .finally(() => {
        this.action = false
      })
  }

  mark(details: DetailInterface[], id: string, idx: number) {
    this.markerService.markAndUnmark(details, id, idx)
  }


}
