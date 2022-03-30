import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {CommonModule} from "@angular/common";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderLayoutComponent } from './shared/components/header-layout/header-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import {SlickCarouselModule} from "ngx-slick-carousel";
import { DelayedInputDirective } from './shared/directives/delayed-input.directive';
import {HttpClientModule} from "@angular/common/http";
import { CatalogComponent } from './catalog/catalog.component';
import {NgDynamicBreadcrumbModule} from "ng-dynamic-breadcrumb";
import {NgxPaginationModule} from "ngx-pagination";
import { DetailPageComponent } from './catalog/components/detail-page/detail-page.component';
import { CatalogTypeComponent } from './catalog/components/catalog-type/catalog-type.component';
import { CatalogPartsComponent } from './catalog/components/catalog-parts/catalog-parts.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { AuthModalComponent } from './shared/components/auth-modal/auth-modal.component';
import {RefDirective} from "./shared/directives/ref.directive";
import { ActionComponent } from './action/action.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CityModalComponent } from './shared/components/city-modal/city-modal.component';
import { GetPriceListModalComponent } from './shared/components/get-price-list-modal/get-price-list-modal.component';
import { SendPriceListModalComponent } from './shared/components/send-price-list-modal/send-price-list-modal.component';
import { OrderGuestComponent } from './order-guest/order-guest.component';
import { RestoreComponent } from './action/components/restore/restore.component';
import { ChangeComponent } from './action/components/change/change.component';
import { VerificationComponent } from './action/components/verification/verification.component';
import { ManufacturerComponent } from './manufacturer/manufacturer.component';
import { ManufacturerEmptyComponent } from './manufacturer/components/manufacturer-empty/manufacturer-empty.component';
import { ManufacturerPageComponent } from './manufacturer/components/manufacturer-page/manufacturer-page.component';
import { AboutComponent } from './about/about.component';
import { UsComponent } from './about/components/us/us.component';
import { HistoryComponent } from './about/components/history/history.component';
import { PresentationComponent } from './about/components/presentation/presentation.component';
import { VideoComponent } from './about/components/video/video.component';
import { ContactsComponent } from './contacts/contacts.component';
import { SellingComponent } from './contacts/components/selling/selling.component';
import { PurchaseComponent } from './contacts/components/purchase/purchase.component';
import { MarketingComponent } from './contacts/components/marketing/marketing.component';
import { BookkeepingComponent } from './contacts/components/bookkeeping/bookkeeping.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './admin/components/admin-home/admin-home.component';
import { AdminBannersComponent } from './admin/components/banners/admin-banners/admin-banners.component';
import { AdminBannersEditComponent } from './admin/components/banners/admin-banners-edit/admin-banners-edit.component';
import { AdminUsersListComponent } from './admin/components/users/admin-users-list/admin-users-list.component';
import { AdminNewsLetterComponent } from './admin/components/news-letter/admin-news-letter/admin-news-letter.component';
import { AdminNewsLetterEditComponent } from './admin/components/news-letter/admin-news-letter-edit/admin-news-letter-edit.component';
import { AdminNewsLetterSubscribersComponent } from './admin/components/news-letter/admin-news-letter-subscribers/admin-news-letter-subscribers.component';
import { AdminDetailComponent } from './admin/components/detail/admin-detail/admin-detail.component';
import { AdminDetailEditComponent } from './admin/components/detail/admin-detail-edit/admin-detail-edit.component';
import { AdminAdditionalCodeComponent } from './admin/components/additional-code/admin-additional-code/admin-additional-code.component';
import { AdminAlternativeNameComponent } from './admin/components/alternative-name/admin-alternative-name/admin-alternative-name.component';
import { AdminManufacturerComponent } from './admin/components/manufacturer/admin-manufacturer/admin-manufacturer.component';
import { AdminManufacturerEditComponent } from './admin/components/manufacturer/admin-manufacturer-edit/admin-manufacturer-edit.component';
import { AdminCountryComponent } from './admin/components/country/admin-country/admin-country.component';
import { AdminCountryEditComponent } from './admin/components/country/admin-country-edit/admin-country-edit.component';
import { AdminRegionComponent } from './admin/components/region/admin-region/admin-region.component';
import { AdminRegionEditComponent } from './admin/components/region/admin-region-edit/admin-region-edit.component';
import { AdminCategoryComponent } from './admin/components/category/admin-category/admin-category.component';
import { AdminCategoryEditComponent } from './admin/components/category/admin-category-edit/admin-category-edit.component';
import { AdminProductGroupComponent } from './admin/components/product-group/admin-product-group/admin-product-group.component';
import { AdminProductGroupEditComponent } from './admin/components/product-group/admin-product-group-edit/admin-product-group-edit.component';
import { AdminApplicabilityComponent } from './admin/components/applicability/admin-applicability/admin-applicability.component';
import { AdminApplicabilityEditComponent } from './admin/components/applicability/admin-applicability-edit/admin-applicability-edit.component';
import { AdminPartsComponent } from './admin/components/parts/admin-parts/admin-parts.component';
import { AdminPartsEditComponent } from './admin/components/parts/admin-parts-edit/admin-parts-edit.component';
import { AdminKeyWordsComponent } from './admin/components/kew-words/admin-key-words/admin-key-words.component';
import { AdminKeyWordsEditComponent } from './admin/components/kew-words/admin-key-words-edit/admin-key-words-edit.component';
import { UserComponent } from './user/user.component';
import { ProfileComponent } from './user/components/profile/profile.component';
import { MyOrderComponent } from './user/components/my-order/my-order.component';
import { FavoriteComponent } from './user/components/favorite/favorite.component';
import { MyHistoryComponent } from './user/components/my-history/my-history.component';
import { WaitingListComponent } from './user/components/waiting-list/waiting-list.component';
import { SubscriptionsComponent } from './user/components/subscriptions/subscriptions.component';
import { MyCompaniesComponent } from './user/components/my-companies/my-companies.component';
import { AddressComponent } from './user/components/address/address.component';
import { MyContactsComponent } from './user/components/my-contacts/my-contacts.component';
import { CurrentOrderComponent } from './user/components/current-order/current-order.component';
import {EditorModule} from "@tinymce/tinymce-angular";
import { OrderUserComponent } from './order-user/order-user.component';
import {ImageCropperModule} from "ngx-image-cropper";
import { SearchPageComponent } from './search-page/search-page.component';
import { AdminCertificateEditComponent } from './admin/components/certificate/admin-certificate-edit/admin-certificate-edit.component';
import { AdminCertificateComponent } from './admin/components/certificate/admin-certificate/admin-certificate.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderLayoutComponent,
    HomePageComponent,
    DelayedInputDirective,
    CatalogComponent,
    DetailPageComponent,
    CatalogTypeComponent,
    CatalogPartsComponent,
    AuthModalComponent,
    RefDirective,
    ActionComponent,
    ShoppingCartComponent,
    CityModalComponent,
    GetPriceListModalComponent,
    SendPriceListModalComponent,
    OrderGuestComponent,
    RestoreComponent,
    ChangeComponent,
    VerificationComponent,
    ManufacturerComponent,
    ManufacturerEmptyComponent,
    ManufacturerPageComponent,
    AboutComponent,
    UsComponent,
    HistoryComponent,
    PresentationComponent,
    VideoComponent,
    ContactsComponent,
    SellingComponent,
    PurchaseComponent,
    MarketingComponent,
    BookkeepingComponent,
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminBannersComponent,
    AdminBannersEditComponent,
    AdminUsersListComponent,
    AdminNewsLetterComponent,
    AdminNewsLetterEditComponent,
    AdminNewsLetterSubscribersComponent,
    AdminDetailComponent,
    AdminDetailEditComponent,
    AdminAdditionalCodeComponent,
    AdminAlternativeNameComponent,
    AdminManufacturerComponent,
    AdminManufacturerEditComponent,
    AdminCountryComponent,
    AdminCountryEditComponent,
    AdminRegionComponent,
    AdminRegionEditComponent,
    AdminCategoryComponent,
    AdminCategoryEditComponent,
    AdminProductGroupComponent,
    AdminProductGroupEditComponent,
    AdminApplicabilityComponent,
    AdminApplicabilityEditComponent,
    AdminPartsComponent,
    AdminPartsEditComponent,
    AdminKeyWordsComponent,
    AdminKeyWordsEditComponent,
    UserComponent,
    ProfileComponent,
    MyOrderComponent,
    FavoriteComponent,
    MyHistoryComponent,
    WaitingListComponent,
    SubscriptionsComponent,
    MyCompaniesComponent,
    AddressComponent,
    MyContactsComponent,
    CurrentOrderComponent,
    OrderUserComponent,
    SearchPageComponent,
    AdminCertificateEditComponent,
    AdminCertificateComponent,
  ],
    imports: [
      BrowserModule,
      CommonModule,
      AppRoutingModule,
      SlickCarouselModule,
      HttpClientModule,
      NgDynamicBreadcrumbModule,
      NgxPaginationModule,
      FormsModule,
      ReactiveFormsModule,
      EditorModule,
      ImageCropperModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
