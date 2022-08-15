import {NgModule} from '@angular/core';
import {Data, PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HeaderLayoutComponent} from "./shared/components/header-layout/header-layout.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {CatalogComponent} from "./catalog/catalog.component";
import {DetailPageComponent} from "./catalog/components/detail-page/detail-page.component";
import {CatalogTypeComponent} from "./catalog/components/catalog-type/catalog-type.component";
import {CatalogPartsComponent} from "./catalog/components/catalog-parts/catalog-parts.component";
import {ActionComponent} from "./action/action.component";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {OrderGuestComponent} from "./order-guest/order-guest.component";
import {GuestGuard} from "./shared/guards/guest.guard";
import {ManufacturerComponent} from "./manufacturer/manufacturer.component";
import {ManufacturerEmptyComponent} from "./manufacturer/components/manufacturer-empty/manufacturer-empty.component";
import {ManufacturerPageComponent} from "./manufacturer/components/manufacturer-page/manufacturer-page.component";
import {AboutComponent} from "./about/about.component";
import {GeneralInfoComponent} from "./about/components/general-info/general-info.component";
import {OwnCertificatesComponent} from "./about/components/own-certificates/own-certificates.component";
import {PresentationComponent} from "./about/components/presentation/presentation.component";
import {VideoComponent} from "./about/components/video/video.component";
import {ContactsComponent} from "./contacts/contacts.component";
import {SellingComponent} from "./contacts/components/selling/selling.component";
import {PurchaseComponent} from "./contacts/components/purchase/purchase.component";
import {MarketingComponent} from "./contacts/components/marketing/marketing.component";
import {BookkeepingComponent} from "./contacts/components/bookkeeping/bookkeeping.component";
import {GuestCostGuard} from "./shared/guards/guest-cost.guard";
import {AdminLayoutComponent} from "./admin/admin-layout/admin-layout.component";
import {AdminHomeComponent} from "./admin/components/admin-home/admin-home.component";
import {AdminBannersComponent} from "./admin/components/banners/admin-banners/admin-banners.component";
import {AdminBannersEditComponent} from "./admin/components/banners/admin-banners-edit/admin-banners-edit.component";
import {AdminUsersListComponent} from "./admin/components/users/admin-users-list/admin-users-list.component";
import {AdminNewsLetterComponent} from "./admin/components/news-letter/admin-news-letter/admin-news-letter.component";
import {AdminNewsLetterEditComponent} from "./admin/components/news-letter/admin-news-letter-edit/admin-news-letter-edit.component";
import {AdminNewsLetterSubscribersComponent} from "./admin/components/news-letter/admin-news-letter-subscribers/admin-news-letter-subscribers.component";
import {AdminDetailComponent} from "./admin/components/detail/admin-detail/admin-detail.component";
import {AdminDetailEditComponent} from "./admin/components/detail/admin-detail-edit/admin-detail-edit.component";
import {AdminAdditionalCodeComponent} from "./admin/components/additional-code/admin-additional-code/admin-additional-code.component";
import {AdminAlternativeNameComponent} from "./admin/components/alternative-name/admin-alternative-name/admin-alternative-name.component";
import {AdminManufacturerComponent} from "./admin/components/manufacturer/admin-manufacturer/admin-manufacturer.component";
import {AdminManufacturerEditComponent} from "./admin/components/manufacturer/admin-manufacturer-edit/admin-manufacturer-edit.component";
import {AdminCountryComponent} from "./admin/components/country/admin-country/admin-country.component";
import {AdminCountryEditComponent} from "./admin/components/country/admin-country-edit/admin-country-edit.component";
import {AdminRegionComponent} from "./admin/components/region/admin-region/admin-region.component";
import {AdminRegionEditComponent} from "./admin/components/region/admin-region-edit/admin-region-edit.component";
import {AdminCategoryComponent} from "./admin/components/category/admin-category/admin-category.component";
import {AdminCategoryEditComponent} from "./admin/components/category/admin-category-edit/admin-category-edit.component";
import {AdminProductGroupComponent} from "./admin/components/product-group/admin-product-group/admin-product-group.component";
import {AdminProductGroupEditComponent} from "./admin/components/product-group/admin-product-group-edit/admin-product-group-edit.component";
import {AdminApplicabilityComponent} from "./admin/components/applicability/admin-applicability/admin-applicability.component";
import {AdminApplicabilityEditComponent} from "./admin/components/applicability/admin-applicability-edit/admin-applicability-edit.component";
import {AdminPartsComponent} from "./admin/components/parts/admin-parts/admin-parts.component";
import {AdminPartsEditComponent} from "./admin/components/parts/admin-parts-edit/admin-parts-edit.component";
import {AdminKeyWordsComponent} from "./admin/components/kew-words/admin-key-words/admin-key-words.component";
import {AdminKeyWordsEditComponent} from "./admin/components/kew-words/admin-key-words-edit/admin-key-words-edit.component";
import {AdminGuardGuard} from "./admin/guards/admin-guard.guard";
import {UserComponent} from "./user/user.component";
import {ProfileComponent} from "./user/components/profile/profile.component";
import {MyOrderComponent} from "./user/components/my-order/my-order.component";
import {FavoriteComponent} from "./user/components/favorite/favorite.component";
import {MyHistoryComponent} from "./user/components/my-history/my-history.component";
import {WaitingListComponent} from "./user/components/waiting-list/waiting-list.component";
import {SubscriptionsComponent} from "./user/components/subscriptions/subscriptions.component";
import {MyCompaniesComponent} from "./user/components/my-companies/my-companies.component";
import {AddressComponent} from "./user/components/address/address.component";
import {MyContactsComponent} from "./user/components/my-contacts/my-contacts.component";
import {CurrentOrderComponent} from "./user/components/current-order/current-order.component";
import {OrderUserComponent} from './order-user/order-user.component';
import {UserGuard} from './shared/guards/user.guard';
import {SearchPageComponent} from "./search-page/search-page.component";
import {AdminCertificateComponent} from "./admin/components/certificate/admin-certificate/admin-certificate.component";
import {AdminCertificateEditComponent} from "./admin/components/certificate/admin-certificate-edit/admin-certificate-edit.component";
import {LandingComponent} from "./landing/landing.component";
import {BuyerComponent} from "./buyer/buyer.component";
import {SiteHelpComponent} from "./buyer/components/site-help/site-help.component";
import {IndividualOrderComponent} from "./buyer/components/individual-order/individual-order.component";
import {DeliveryComponent} from "./buyer/components/delivery/delivery.component";
import {PaymentTermsComponent} from "./buyer/components/payment-terms/payment-terms.component";
import {GuaranteeComponent} from "./buyer/components/guarantee/guarantee.component";
import {OfferComponent} from "./buyer/components/offer/offer.component";
import {PrivacyPolicyComponent} from "./buyer/components/privacy-policy/privacy-policy.component";
import {ExportDepartamentComponent} from "./contacts/components/export-departament/export-departament.component";
import {SupplierComponent} from "./supplier/supplier.component";
import {FavoriteGuestComponent} from "./favorite-guest/favorite-guest.component";

const aboutBreadcrumbs: Data = {
  title: 'Компания', breadcrumb: [
    {label: 'Главная', url: '/'},
    {label: 'Компания', url: ''},
  ]
}

function aboutCreateBreadcrumbs(label: string): Data {
  return {
    title: label, breadcrumb: [
      {label: 'Главная', url: '/'},
      {label: 'Компания', url: '/about'},
      {label: label, url: ''},
    ]
  }
}

const about: Routes = [
  {path: 'about', component: AboutComponent, data: aboutBreadcrumbs},
  {path: 'about/info', component: GeneralInfoComponent, data: aboutCreateBreadcrumbs('Общая информация')},
  {path: 'about/certificates', component: OwnCertificatesComponent, data: aboutCreateBreadcrumbs('Наши сертификаты')},
  {path: 'about/presentation', component: PresentationComponent, data: aboutCreateBreadcrumbs('Презентиация и брошюра')},
  {path: 'about/video', component: VideoComponent, data: aboutCreateBreadcrumbs('Видеоролик')},
]

const contacts: Routes = [
  {path: 'contacts', component: ContactsComponent, children: [
      {path: 'selling', component: SellingComponent},
      {path: 'purchase', component: PurchaseComponent},
      {path: 'export', component: ExportDepartamentComponent},
      {path: 'marketing', component: MarketingComponent},
      {path: 'bookkeeping', component: BookkeepingComponent},
    ]},
]

const buyerBreadcrumbs: Data = {
  title: 'Покупателю', breadcrumb: [
    {label: 'Главная', url: '/'},
    {label: 'Покупателю', url: ''},
  ]
}

function buyerChildrenBreadcrumbs(title: string): Data {
  return {
    title: title, breadcrumb: [
      {label: 'Главная', url: '/'},
      {label: 'Покупателю', url: '/buyer'},
      {label: title, url: ''}
    ]
  }
}

const buyer: Routes = [
  {path: 'buyer', component: BuyerComponent, data: buyerBreadcrumbs},
  {path: 'buyer/site-help', component: SiteHelpComponent, data: buyerChildrenBreadcrumbs('Помощь по сайту')},
  {path: 'buyer/individual-order', component: IndividualOrderComponent, data: buyerChildrenBreadcrumbs('Индивидуальный заказ')},
  {path: 'buyer/delivery', component: DeliveryComponent, data: buyerChildrenBreadcrumbs('Доставка')},
  {path: 'buyer/payment', component: PaymentTermsComponent, data: buyerChildrenBreadcrumbs('Условия оплаты')},
  {path: 'buyer/guarantee', component: GuaranteeComponent, data: buyerChildrenBreadcrumbs('Гарантия и возврат')},
  {path: 'buyer/offer', component: OfferComponent, data: buyerChildrenBreadcrumbs('Договор оферты')},
  {path: 'buyer/privacy-policy', component: PrivacyPolicyComponent, data: buyerChildrenBreadcrumbs('Политика конфиденциальности')},
]

const userBreadcrumbsData: Data = {
  title: 'Личный кабинет', breadcrumb: [
    {label: 'Главная', url: '/'},
    {label: 'Личный кабинет', url: ''}
  ]
}

const userOrderBreadcrumbs: Data = {
  title: 'Заказ', breadcrumb: [
    {label: 'Главная', url: '/'},
    {label: 'Личный кабинет', url: '/user'},
    {label: 'Мои заказы', url: '/user/my-orders'},
  ]
}

const userProfile: Routes = [
  {path: 'user', component: UserComponent, data: userBreadcrumbsData, canActivate: [UserGuard],
    children: [
      {path: 'profile', component: ProfileComponent, data: userBreadcrumbsData},
      {path: 'my-orders', component: MyOrderComponent, data: userBreadcrumbsData},
      {path: 'my-favorites', component: FavoriteComponent, data: userBreadcrumbsData},
      {path: 'my-history', component: MyHistoryComponent, data: userBreadcrumbsData},
      {path: 'my-waiting-list', component: WaitingListComponent, data: userBreadcrumbsData},
      {path: 'my-subscriptions', component: SubscriptionsComponent, data: userBreadcrumbsData},
      {path: 'my-companies', component: MyCompaniesComponent, data: userBreadcrumbsData},
      {path: 'my-addresses', component: AddressComponent, data: userBreadcrumbsData},
      {path: 'my-contacts', component: MyContactsComponent, data: userBreadcrumbsData},
    ]
  },
  {path: 'user/my-orders/:id', component: CurrentOrderComponent, data: userOrderBreadcrumbs, canActivate: [UserGuard]}
]

const admin: Routes = [
  {
    path: 'admin', component: AdminLayoutComponent, canActivate: [AdminGuardGuard], children: [
      {path: '', component: AdminHomeComponent},
      {path: 'banners', component: AdminBannersComponent},
      {path: 'banners/:id', component: AdminBannersEditComponent},
      {path: 'certificate', component: AdminCertificateComponent},
      {path: 'certificate/:id', component: AdminCertificateEditComponent},
      {path: 'users', component: AdminUsersListComponent},
      {path: 'news-letter', component: AdminNewsLetterComponent},
      {path: 'news-letter/:id', component: AdminNewsLetterEditComponent},
      {path: 'news-letter-subscribers', component: AdminNewsLetterSubscribersComponent},
      {path: 'detail', component: AdminDetailComponent},
      {path: 'detail/:id', component: AdminDetailEditComponent},
      {path: 'additional-code', component: AdminAdditionalCodeComponent},
      {path: 'alternative-name', component: AdminAlternativeNameComponent},
      {path: 'manufacturer', component: AdminManufacturerComponent},
      {path: 'manufacturer/:id', component: AdminManufacturerEditComponent},
      {path: 'country', component: AdminCountryComponent},
      {path: 'country/:id', component: AdminCountryEditComponent},
      {path: 'region', component: AdminRegionComponent},
      {path: 'region/:id', component: AdminRegionEditComponent},
      {path: 'category', component: AdminCategoryComponent},
      {path: 'category/:id', component: AdminCategoryEditComponent},
      {path: 'product-group', component: AdminProductGroupComponent},
      {path: 'product-group/:id', component: AdminProductGroupEditComponent},
      {path: 'applicability', component: AdminApplicabilityComponent},
      {path: 'applicability/:id', component: AdminApplicabilityEditComponent},
      {path: 'parts', component: AdminPartsComponent},
      {path: 'parts/:id', component: AdminPartsEditComponent},
      {path: 'key-words', component: AdminKeyWordsComponent},
      {path: 'key-words/:id', component: AdminKeyWordsEditComponent}
    ]
  }
]

const supplierBreadcrumbs: Data = {
  title: 'Партнерам', breadcrumb: [
    {label: 'Главная', url: '/'},
    {label: 'Партнерам', url: ''}
  ]
}

const routes: Routes = [
  ...admin,
  {
    path: 'landing', component: LandingComponent
  },
  {
    path: '', component: HeaderLayoutComponent, children: [
      {path: '', component: HomePageComponent},
      ...about,
      ...contacts,
      ...buyer,
      ...userProfile,
      {
        path: 'supplier', component: SupplierComponent, data: supplierBreadcrumbs},
      {path: 'favorite', component: FavoriteGuestComponent},
      {path: 'catalog', component: CatalogComponent},
      {
        path: 'type', component: CatalogTypeComponent, data: {
          title: 'Каталог по виду товара', breadcrumb: [
            {label: 'Главная', url: '/'},
            {label: 'Каталог товаров', url: '/catalog'},
            {label: 'Каталог по виду товара', url: ''}
          ]
        }
      },
      {
        path: 'parts', component: CatalogPartsComponent, data: {
          title: 'Автозапчасти', breadcrumb: [
            {label: 'Главная', url: '/'},
            {label: 'Каталог товаров', url: '/catalog'},
            {label: 'Автозапчасти', url: ''}
          ]
        }
      },
      {
        path: 'catalog/:id', component: DetailPageComponent, data: {
          title: 'catalog', breadcrumb: [
            {label: 'Главная', url: '/'},
            {label: 'Каталог товаров', url: '/catalog'},
            {label: '{{dynamicText}}', url: ''}
          ]
        }
      },
      {path: 'shopping-cart', component: ShoppingCartComponent},
      {
        path: 'shopping-cart/order', component: OrderGuestComponent, canActivate: [GuestGuard, GuestCostGuard],
        data: {
          title: 'Оформление заказа', breadcrumb: [
            {label: 'Главная', url: '/'},
            {label: 'Корзина', url: '/shopping-cart'},
            {label: 'Оформление заказа', url: ''},
          ]
        }
      },
      {
        path: 'shopping-cart/order-user', component: OrderUserComponent, canActivate: [UserGuard],
        data: {
          title: 'Оформление заказа', breadcrumb: [
            {label: 'Главная', url: '/'},
            {label: 'Личный кабинет', url: ''},
          ]
        }
      },
      {
        path: 'manufacturer', component: ManufacturerEmptyComponent, children: [
          {
            path: '', component: ManufacturerComponent, data: {
              title: 'Производители', breadcrumb: [
                {label: 'Главная', url: '/'},
                {label: 'Производители', url: ''}
              ]
            }
          },
          {
            path: ':id', component: ManufacturerPageComponent, data: {
              title: 'Производитель', breadcrumb: [
                {label: 'Главная', url: '/'},
                {label: 'Производители', url: '/manufacturer'},
                {label: '{{dynamicText}}', url: ''}
              ]
            }
          },
          {
            path: ':manufacturerId/:id', component: DetailPageComponent, data: {
              title: 'Производитель', breadcrumb: [
                {label: 'Главная', url: '/'},
                {label: 'Производители', url: '/manufacturer'},
                {label: '{{customText}}', url: '/manufacturer/:manufacturerId'},
                {label: '{{dynamicText}}', url: ''}
              ]
            }
          }
        ]
      },
      {path: 'action', component: ActionComponent},
      {path: 'search', component: SearchPageComponent},
      {path: '**', redirectTo: '/'}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules, onSameUrlNavigation: "reload", scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
