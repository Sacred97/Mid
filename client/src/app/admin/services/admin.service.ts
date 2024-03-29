import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AdminUsersAndCount} from "../interfaces/admin-users.interface";
import {ResponseMessage} from "../../shared/services-interfaces/global-interfaces/response.interface";
import {AdminNewsLetter, AdminSubscribers, AdminUpdateNewsLetter} from "../interfaces/admin-news-letter.interface";
import {
  AdditionalVendorCodeInterface, AlternativeNameInterface,
  DetailInterface, PhotoDetailInterface
} from "../../shared/services-interfaces/detail-service/detail.interface";
import {
  AdminAlternativeNameCreate, AdminAlternativeNameUpdate, AdminDetailsHidden,
  AdminDetailUpdate, AdminPhotoUpdate, AdminPhotoUpload,
  AdminVendorCodeCreate,
  AdminVendorCodeUpdate
} from "../interfaces/admin-details.interface";
import {AdminAttachCode, AdminNotBindingCodes} from "../interfaces/admin-additional-code.interface";
import {AdminNotBindingNames} from "../interfaces/admin-alternative-name.interface";
import {
  Country,
  ManufacturerInterface,
  Region
} from "../../shared/services-interfaces/detail-service/manufacturer.interface";
import {AdminManufacturerUpdate, AdminManufacturerWithoutCountry} from "../interfaces/admin-manufacturer.interface";
import {AdminUpdateCountry} from "../interfaces/admin-country.interface";
import {AdminUpdateRegion} from "../interfaces/admin-region.interface";
import {
  CategoryInterface,
  ProductGroupInterface
} from "../../shared/services-interfaces/detail-service/category.interface";
import {AdminUpdateProductGroup} from "../interfaces/admin-product-group.interface";
import {AdminUpdateCategory} from "../interfaces/admin-category.interface";
import {ApplicabilityInterface} from "../../shared/services-interfaces/detail-service/applicability.interface";
import {AdminCreateApplicability, AdminUpdateApplicability} from "../interfaces/admin-applicability.interface";
import {PartsInterface} from "../../shared/services-interfaces/detail-service/parts.interface";
import {KeyWordsInterface} from "../../shared/services-interfaces/detail-service/key-words.interface";
import {AdminGetKeyWords, AdminUpdateKeyWords} from "../interfaces/admin-key-words.interface";
import {AdminCreateParts, AdminUpdateParts} from "../interfaces/admin-parts.interface";
import { AdminBannerUpdate, AdminBanner } from '../interfaces/admin-banner.interface';
import {environment} from "../../../environments/environment";
import {CertificateInterface} from "../../shared/services-interfaces/certificate-service/certificate.interface";
import {AdminOwnCertificateInterface} from "../interfaces/admin-own-certificate.interface";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {
  }

  getUsers(offset: number, query?: string): Promise<AdminUsersAndCount> {
    let url= environment.apiUrl + 'users/list' + '?offset=' + offset
    if (query) url = url + '&email=' + query
    return this.http.get<AdminUsersAndCount>(url, {withCredentials: true}).toPromise()
  }

  deleteUser(id: number): Promise<ResponseMessage> {
    const url = environment.apiUrl + 'users/list/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  //--------------------------------------Рассылки----------------------------------------------------------------------

  getOneNewsLetter(id: number): Promise<AdminNewsLetter> {
    const url = environment.apiUrl + 'news-letter/' + id
    return this.http.get<AdminNewsLetter>(url, {withCredentials: true}).toPromise()
  }

  getNewsLetter(): Promise<AdminNewsLetter[]> {
    const url = environment.apiUrl + 'news-letter'
    return this.http.get<AdminNewsLetter[]>(url, {withCredentials: true}).toPromise()
      .then((data) => data.sort((a, b) =>
        a.id > b.id ? 1 : a.id === b.id ? 0 : -1))
  }

  async createNewsLetter(newsLetterName: string): Promise<AdminNewsLetter[]> {
    const url = environment.apiUrl + 'news-letter'
    try {
      await this.http.post(url, {name: newsLetterName}, {withCredentials: true}).toPromise()
      return await this.getNewsLetter()
    } catch (error) {
      console.log(error)
      return []
    }
  }

  updateNewsLetter(data: AdminUpdateNewsLetter): Promise<AdminNewsLetter> {
    const url = environment.apiUrl + 'news-letter'
    return this.http.put<AdminNewsLetter>(url, data, {withCredentials: true}).toPromise()
  }

  deleteNewsLetter(id: number): Promise<AdminNewsLetter[]> {
    const url = environment.apiUrl + 'news-letter/' + id
    return this.http.delete<AdminNewsLetter[]>(url, {withCredentials: true}).toPromise()
      .then((data) => data.sort((a, b) =>
        a.id > b.id ? 1 : a.id === b.id ? 0 : -1))
  }

  getAllSubscribers(): Promise<AdminSubscribers[]> {
    const url = environment.apiUrl + 'users/admin-subscription'
    return this.http.get<AdminSubscribers[]>(url, {withCredentials: true}).toPromise()
      .then(data => data.sort((a, b) =>
        a.id > b.id ? 1 : a.id === b.id ? 0 : -1))
  }

  deleteSubscribers(id: number): Promise<AdminSubscribers[]> {
    const url = environment.apiUrl + 'users/admin-subscription/' + id
    return this.http.delete<AdminSubscribers[]>(url, {withCredentials: true}).toPromise()
      .then(data => data.sort((a, b) =>
        a.id > b.id ? 1 : a.id === b.id ? 0 : -1))
  }

  //--------------------------------------Товар-------------------------------------------------------------------------

  getAllHidden(): Promise<AdminDetailsHidden[]> {
    const url: string = environment.apiUrl + 'details/admin-details'
    return this.http.get<AdminDetailsHidden[]>(url, {withCredentials: true}).toPromise()
  }

  getDetail(id: string): Promise<DetailInterface> {
    const url: string = environment.apiUrl + 'details/detail/' + id
    return this.http.get<DetailInterface>(url, {withCredentials: true}).toPromise()
  }

  updateDetail(data: AdminDetailUpdate): Promise<DetailInterface> {
    const url: string = environment.apiUrl + 'details/detail'
    return this.http.put<DetailInterface>(url, data, {withCredentials: true}).toPromise()
  }

  createVendorCode(data: AdminVendorCodeCreate): Promise<AdditionalVendorCodeInterface> {
    const url: string = environment.apiUrl + 'details/additional_vendor'
    return this.http.post<AdditionalVendorCodeInterface>(url, data, {withCredentials: true}).toPromise()
  }

  updateVendorCode(data: AdminVendorCodeUpdate): Promise<AdditionalVendorCodeInterface> {
    const url: string = environment.apiUrl + 'details/additional_vendor'
    return this.http.put<AdditionalVendorCodeInterface>(url, data, {withCredentials: true}).toPromise()
  }

  deleteVendorCode(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'details/additional_vendor/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  createAlternativeName(data: AdminAlternativeNameCreate): Promise<AlternativeNameInterface> {
    const url: string = environment.apiUrl + 'details/alternative_name/'
    return this.http.post<AlternativeNameInterface>(url, data,{withCredentials: true}).toPromise()
  }

  updateAlternativeName(data: AdminAlternativeNameUpdate): Promise<AlternativeNameInterface> {
    const url: string = environment.apiUrl + 'details/alternative_name/'
    return this.http.put<AlternativeNameInterface>(url, data,{withCredentials: true}).toPromise()
  }

  deleteAlternativeName(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'details/alternative_name/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  uploadPhoto(file: File, data: AdminPhotoUpload): Promise<PhotoDetailInterface[]> {
    const url: string = environment.apiUrl + 'details/admin-photo-detail'
    let formData = new FormData()
    formData.append('file', file)
    formData.append('isMain', `${data.isMain}`)
    formData.append('detailId', data.detailId)
    return this.http.post<PhotoDetailInterface[]>(url, formData,
      {withCredentials: true, reportProgress: true}).toPromise()
  }

  changeMainPhoto(data: AdminPhotoUpdate): Promise<PhotoDetailInterface> {
    const url: string = environment.apiUrl + 'details/admin-photo-detail'
    return this.http.patch<PhotoDetailInterface>(url, data, {withCredentials: true}).toPromise()
  }

  deletePhoto(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'details/photo_detail/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  //---------------------------------------------Доп. артикул-----------------------------------------------------------

  getNotAttachCodes(): Promise<AdminNotBindingCodes[]> {
    const url: string = environment.apiUrl + 'details/admin-additional-vendor-code'
    return this.http.get<AdminNotBindingCodes[]>(url, {withCredentials: true}).toPromise()
  }

  attachAdditionalCode(data: AdminAttachCode): Promise<void> {
    const url: string = environment.apiUrl + 'details/additional_vendor'
    return this.http.put<void>(url, data, {withCredentials: true}).toPromise()
  }

  //------------------------------------------Альт. наименование--------------------------------------------------------

  getNotAttachNames(): Promise<AdminNotBindingNames[]> {
    const url: string = environment.apiUrl + 'details/admin-alternative-name'
    return this.http.get<AdminNotBindingNames[]>(url, {withCredentials: true}).toPromise()
  }

  attachAdditionalNames(data: AdminAttachCode): Promise<void> {
    const url: string = environment.apiUrl + 'details/alternative_name'
    return this.http.put<void>(url, data, {withCredentials: true}).toPromise()
  }

  //---------------------------------------------Производитель----------------------------------------------------------

  getManufacturerWithoutCountry(): Promise<AdminManufacturerWithoutCountry[]> {
    const url: string = environment.apiUrl + 'manufacturer-without-country'
    return this.http.get<AdminManufacturerWithoutCountry[]>(url, {withCredentials: true}).toPromise()
  }

  getManufacturer(id: number): Promise<ManufacturerInterface> {
    const url: string = environment.apiUrl + 'manufacturer/' + id
    return this.http.get<ManufacturerInterface>(url, {withCredentials: true}).toPromise()
  }

  updateManufacturer(data: AdminManufacturerUpdate, file?: File) {
    const url: string = environment.apiUrl + 'manufacturer'

    if (file) {
      let formData = new FormData()
      formData.append('id', data.id.toString())
      formData.append('file', file)
      return this.http.put<ManufacturerInterface>(url, formData, {withCredentials: true}).toPromise()
    }

    return this.http.put<ManufacturerInterface>(url, data, {withCredentials: true}).toPromise()
  }

  uploadManufacturerCertificate(manufacturerId: number, files: FileList,
                                data: {lowResolution: boolean, relations: number}): Promise<ManufacturerInterface> {
    const url: string = environment.apiUrl + 'certificate'
    let formData = new FormData()
    formData.append('manufacturerId', manufacturerId.toString())
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i])
    }
    formData.append('lowResolution', data.lowResolution.toString())
    formData.append('relations', data.relations.toString())
    return this.http.post<ManufacturerInterface>(url, formData, {withCredentials: true}).toPromise()
  }

  deleteCertificate(id: number): Promise<ManufacturerInterface> {
    const url: string = environment.apiUrl + 'certificate/' + id
    return this.http.delete<ManufacturerInterface>(url, {withCredentials: true}).toPromise()
  }

  //---------------------------------------------Страна / город---------------------------------------------------------

  getCountryList(): Promise<Country[]> {
    const url: string = environment.apiUrl + 'country'
    return this.http.get<Country[]>(url, {withCredentials: true}).toPromise()
  }

  getCountry(id: number): Promise<Country> {
    const url: string = environment.apiUrl + 'country/one/' + id
    return this.http.get<Country>(url, {withCredentials: true}).toPromise()
  }

  updateCountry(data: AdminUpdateCountry): Promise<Country> {
    const url: string = environment.apiUrl + 'country'
    return this.http.put<Country>(url, data,{withCredentials: true}).toPromise()
  }

  deleteCountry(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'country/one/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  //--------------------------------------------------Регион------------------------------------------------------------

  getRegionList(): Promise<Region[]> {
    const url: string = environment.apiUrl + 'region'
    return this.http.get<Region[]>(url, {withCredentials: true}).toPromise()
  }

  getRegion(id: number): Promise<Region> {
    const url: string = environment.apiUrl + 'region/' + id
    return this.http.get<Region>(url, {withCredentials: true}).toPromise()
  }

  updateRegion(data: AdminUpdateRegion): Promise<Region> {
    const url: string = environment.apiUrl + 'region'
    return this.http.put<Region>(url, data,  {withCredentials: true}).toPromise()
  }

  deleteRegion(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'region/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  //------------------------------------------------Категория-----------------------------------------------------------

  getCategoryList(): Promise<CategoryInterface[]> {
    const url: string = environment.apiUrl + 'category'
    return this.http.get<CategoryInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getCategory(id: string): Promise<CategoryInterface> {
    const url: string = environment.apiUrl + 'category/' + id
    return this.http.get<CategoryInterface>(url, {withCredentials: true}).toPromise()
  }

  updateCategory(data: AdminUpdateCategory): Promise<CategoryInterface> {
    const url: string = environment.apiUrl + 'category'
    return this.http.put<CategoryInterface>(url, data,{withCredentials: true}).toPromise()
  }

  //----------------------------------------------Группа товаров--------------------------------------------------------

  getProductGroupList(): Promise<ProductGroupInterface[]> {
    const url: string = environment.apiUrl + 'product-group'
    return this.http.get<ProductGroupInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getProductGroup(id: string): Promise<ProductGroupInterface> {
    const url: string = environment.apiUrl + 'product-group/' + id
    return this.http.get<ProductGroupInterface>(url, {withCredentials: true}).toPromise()
  }

  updateProductGroup(data: AdminUpdateProductGroup): Promise<ProductGroupInterface> {
    const url: string = environment.apiUrl + 'product-group'
    return this.http.put<ProductGroupInterface>(url, data, {withCredentials: true}).toPromise()
  }

  //----------------------------------------------Применяемость---------------------------------------------------------

  getApplicabilityList(): Promise<ApplicabilityInterface[]> {
    const url: string = environment.apiUrl + 'auto-applicability'
    return this.http.get<ApplicabilityInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getApplicability(id: number): Promise<ApplicabilityInterface> {
    const url: string = environment.apiUrl + 'auto-applicability/' + id
    return this.http.get<ApplicabilityInterface>(url, {withCredentials: true}).toPromise()
  }

  createApplicability(data: AdminCreateApplicability): Promise<ApplicabilityInterface[]> {
    const url: string = environment.apiUrl + 'auto-applicability'
    return this.http.post<ApplicabilityInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateApplicability(data: AdminUpdateApplicability): Promise<ApplicabilityInterface> {
    const url: string = environment.apiUrl + 'auto-applicability'
    return this.http.put<ApplicabilityInterface>(url, data, {withCredentials: true}).toPromise()
  }

  deleteApplicability(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'auto-applicability/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  //-----------------------------------------------Автозапчасти---------------------------------------------------------

  getPartsList(): Promise<PartsInterface[]> {
    const url: string = environment.apiUrl + 'auto-parts'
    return this.http.get<PartsInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getParts(id: number): Promise<PartsInterface> {
    const url: string = environment.apiUrl + 'auto-parts/' + id
    return this.http.get<PartsInterface>(url, {withCredentials: true}).toPromise()
  }

  createParts(data: AdminCreateParts): Promise<PartsInterface[]> {
    const url: string = environment.apiUrl + 'auto-parts'
    return this.http.post<PartsInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateParts(data: AdminUpdateParts): Promise<PartsInterface> {
    const url: string = environment.apiUrl + 'auto-parts'
    return this.http.put<PartsInterface>(url, data, {withCredentials: true}).toPromise()
  }

  deleteParts(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'auto-parts/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  //----------------------------------------------Ключевые слова--------------------------------------------------------

  getKeyWordsList(offset: number = 0, limit: number = 0): Promise<AdminGetKeyWords> {
    const url: string = environment.apiUrl + 'key-words?offset=' + offset + '&limit=' + limit
    return this.http.get<AdminGetKeyWords>(url, {withCredentials: true}).toPromise()
  }

  getKeyWord(id: number): Promise<KeyWordsInterface> {
    const url: string = environment.apiUrl + 'key-words/' + id
    return this.http.get<KeyWordsInterface>(url, {withCredentials: true}).toPromise()
  }

  updateKeyWord(data: AdminUpdateKeyWords): Promise<KeyWordsInterface> {
    const url: string = environment.apiUrl + 'key-words'
    return this.http.put<KeyWordsInterface>(url, data, {withCredentials: true}).toPromise()
  }

  deleteKeyWord(id: number): Promise<ResponseMessage> {
    const url: string = environment.apiUrl + 'key-words/' + id
    return this.http.delete<ResponseMessage>(url, {withCredentials: true}).toPromise()
  }

  //--------------------------------------------------Баннеры-----------------------------------------------------------

  getBannerList(): Promise<AdminBanner[]> {
    const url: string = environment.apiUrl + 'banners'
    return this.http.get<AdminBanner[]>(url, {withCredentials: true}).toPromise()
  }

  getBanner(id: number): Promise<AdminBanner> {
    const url: string = environment.apiUrl + 'banners/' + id
    return this.http.get<AdminBanner>(url, {withCredentials: true}).toPromise()
  }

  uploadBanner(data: FormData): Promise<AdminBanner[]> {
    const url: string = environment.apiUrl + 'banners'
    return this.http.post<AdminBanner[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateBanner(data: AdminBannerUpdate): Promise<AdminBanner> {
    const url: string = environment.apiUrl + 'banners'
    return this.http.put<AdminBanner>(url, data, {withCredentials: true}).toPromise()
  }

  deleteBanner(id: number): Promise<AdminBanner[]> {
    const url: string = environment.apiUrl + 'banners/' + id
    return this.http.delete<AdminBanner[]>(url, {withCredentials: true}).toPromise()
  }

  //--------------------------------------------------------------------------------------------------------------------

  getOwnCertificates(): Promise<CertificateInterface[]> {
    const url: string = environment.apiUrl + 'general-info-certificate'
    return this.http.get<CertificateInterface[]>(url, {withCredentials: true}).toPromise()
  }

  getOwnCertificate(id: number): Promise<CertificateInterface> {
    const url: string = environment.apiUrl + 'general-info-certificate/' + id
    return this.http.get<CertificateInterface>(url, {withCredentials: true}).toPromise()
  }

  uploadOwnCertificate(data: FormData): Promise<CertificateInterface[]> {
    const url: string = environment.apiUrl + 'general-info-certificate'
    return this.http.post<CertificateInterface[]>(url, data, {withCredentials: true}).toPromise()
  }

  updateOwnCertificate(data: AdminOwnCertificateInterface): Promise<CertificateInterface> {
    const url: string = environment.apiUrl + 'general-info-certificate'
    return this.http.put<CertificateInterface>(url, data, {withCredentials: true}).toPromise()
  }

  deleteOwnCertificate(id: number): Promise<CertificateInterface[]> {
    const url: string = environment.apiUrl + 'general-info-certificate/' + id
    return this.http.delete<CertificateInterface[]>(url, {withCredentials: true}).toPromise()
  }

}
