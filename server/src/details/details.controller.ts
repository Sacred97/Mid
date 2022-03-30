import {
  Body, CacheKey, CacheTTL,
  Controller,
  Delete,
  Get, HttpCode,
  Param, ParseArrayPipe, Patch,
  Post,
  Put, Query, Req, UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {Express} from 'express'
import {HttpCacheInterceptor} from "../redis-cache/http-cache.interceptor";
import {GET_DETAILS_CACHE_KEY, GET_FILTERS_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {TransformToArrayInterceptor} from "../interceptors/transform-to-array.interceptor";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {OneCGuard} from "../one-c/one-c.guard";
import {DetailsService} from './details.service';
import {FilterParams} from '../utils/params/filter-params';
import {GetDetailParams} from "../utils/params/get-detail-params";
import {SearchParams} from "../utils/params/search-params";
import {FindOneParams} from '../utils/params/findOneParams';
import {FilterDto} from './dto/filter.dto';
import {DetailCreateDto} from './dto/detail-create.dto';
import {DetailUpdateDto} from './dto/detail-update.dto';
import {DetailPatchDto} from "./dto/detail-patch.dto";
import {DetailIdDto} from "../shared-dto/detail-id.dto";
import {AdditionalCodeUpdateDto} from "./dto/additional-code-update.dto";
import {AdditionalCodeCreateDto} from "./dto/additional-code-create.dto";
import {AlternativeNameCreateDto} from "./dto/alternative-name-create.dto";
import {AlternativeNameUpdateDto} from "./dto/alternative-name-update.dto";
import {DetailPhotoUpdateDto} from "./dto/detail-photo-update.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {DetailPhotoCreateDto} from "./dto/detail-photo-create.dto";
import {RequestWithUser} from "../auth/interfaces/request-with-user.interface";
import {OptionalJwtAuthGuard} from "../auth/guards/optional-jwt-auth.guard";

@Controller('details')
export class DetailsController {

  constructor(private readonly detailsService: DetailsService) {
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin-details')
  async getAllHiddenDetailsWithAdmin() {
    return await this.detailsService.getAllHiddenDetails()
  }

  //---------------------------------------------------------Фильтр------------------------------------------------------------------

  @HttpCode(200)
  @Post('filter')
  async getDetailWithFilter(@Body() filter: FilterDto[], @Query() {
    sort, order, availability, recent, sale, popular, letter, word, limit, offset
  }: FilterParams) {
    return await this.detailsService.getDetailsWithFilter(filter, sort, order, availability, recent, sale, popular,
        letter, word, limit, offset)
  }

  @UseInterceptors(HttpCacheInterceptor)
  @CacheKey(GET_FILTERS_CACHE_KEY)
  @Get('filter')
  async getFilters() {
    return await this.detailsService.getFiltersWithCount()
  }

  //---------------------------------------------------Случайные товары-------------------------------------------------------------

  // Случайные товары по производителю
  @Get('random')
  async getRandomLimitedDetailsByManufacturer(@Query('id') id: string) {
    return await this.detailsService.getRandomDetailsByManufacturer(+id)
  }

  // Случайные товары из недавно просмотренных
  @Post('random')
  async getDetailsByIds(@Body(new ParseArrayPipe({items: DetailIdDto})) ids: DetailIdDto[]) {
    return await this.detailsService.getDetailsByIds(ids)
  }

  //---------------------------------------------------------Поиск------------------------------------------------------------------

  @Get('search')
  async detailSearch(@Query() {search, limit, offset}: SearchParams) {
    return await this.detailsService.getSearchedDetail(search, limit, offset)
  }

  //---------------------------------------------------------CRUD Деталей(Detail)---------------------------------------------------

  // @UseInterceptors(HttpCacheInterceptor)
  // @CacheKey(GET_DETAILS_CACHE_KEY)
  // @CacheTTL(300)
  @Get('detail')
  async getAllDetails(@Query() {sortBy, orderBy, limit, offset}: GetDetailParams) {
    return await this.detailsService.getAllDetail(sortBy, orderBy, limit, offset)
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('detail/:id')
  async getDetailById(@Param() {id}: FindOneParams, @Req() request: RequestWithUser) {
    if (request.user) {
      return await this.detailsService.getDetailById(id, request.user.isAdmin)
    }
    return await this.detailsService.getDetailById(id, false)
  }

  @UseGuards(OneCGuard)
  @UseInterceptors(TransformToArrayInterceptor)
  @Post('detail')
  async createDetail(@Body(new ParseArrayPipe({items: DetailCreateDto})) data: DetailCreateDto[]) {
    const result = []
    for (let detail of data) {
      let created = await this.detailsService.createDetail(detail)
      result.push(created)
    }
    const message = `Получено всего: ${data.length}, Загруженно: ${result.length}, 
    Пропущено: ${data.length - result.length}`
    console.log(message)
    // this.logLargeArray(result)
    return {statusCode: 201}
  }

  private logLargeArray(array: any[]) {
    let length = Math.ceil(array.length/100)
    for (let i = 0; i < length; i++) {
      console.log(array.splice(0, 100))
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('detail')
  async updateDetail(@Body() data: DetailUpdateDto) {
    return await this.detailsService.updateDetail(data)
  }

  @UseGuards(OneCGuard)
  @UseInterceptors(TransformToArrayInterceptor)
  @Patch('detail')
  async detailFastUpdate(@Body(new ParseArrayPipe({items: DetailPatchDto})) data: DetailPatchDto[]) {
    const result = []
    for (let detail of data) {
      let updated = await this.detailsService.fastUpdateDetail(detail)
      if (updated) {
        result.push(updated)
      }
    }
    const message = `Получено всего: ${data.length}, Загружено: ${result.length}, 
      Пропущено: ${data.length - result.length}`
    console.log(message)
    return {statusCode: 200}
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('detail/:id')
  async deleteDetail(@Param() {id}: FindOneParams) {
    return this.detailsService.deleteDetail(id)
  }

  //------------------------------------------------ CRUD Фото Деталей (Photo Detail) ----------------------------------------

  @Get('photo_detail')
  async getAllPhoto() {
    return await this.detailsService.getAllPhotoDetails()
  }

  @Get('photo_detail/:id')
  async getPhotoById(@Param() {id}: FindOneParams) {
    return await this.detailsService.getPhotoDetailById(+id)
  }

  @Post('photo_detail')
  async createPhotoDetail(@Body() data: any | any[]) {
    if (Array.isArray(data)) {
      let result = []
      let quantityGot: number = 0
      for await (let photo of data) {
        let uploaded = await this.detailsService.uploadPhotoDetail(photo)
        quantityGot = quantityGot + (Object.keys(photo).length - 1)
        if (uploaded && uploaded.length > 0) {
          result = result.concat(uploaded)
        }
      }
      const message = `Получен: Массив Фото, Кол-во полученных: ${quantityGot}, 
        Кол-во загруженных: ${result.length}, Пропущенно: ${quantityGot - result.length}, 
        Загружено: ${result}`
      console.log(message)
      return {statusCode: 200}
    }
    const photo = await this.detailsService.uploadPhotoDetail(data)
    const quantity = Object.keys(data).length - 1
    const message = `Получен: 1 Объект, Кол-во фото: ${quantity}, Загружено: ${photo}, 
      загружено все: 
      ${photo 
        ? quantity === photo.length 
            ? 'Да' 
            : 'Не загружено: ' + (quantity - photo.length) 
        : 'Товар для фото не найден'}`
    console.log(message)
    return {statusCode: 200}
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('admin-photo-detail')
  async adminUploadPhotoDetail(@Body() data: DetailPhotoCreateDto, @UploadedFile() file: Express.Multer.File) {
    return await this.detailsService.adminUploadPhotoDetail(data, file)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch('admin-photo-detail')
  async adminUpdatePhotoDetail(@Body() data: DetailPhotoUpdateDto) {
    return await this.detailsService.adminUpdatePhotoDetail(data)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('photo_detail/:id')
  async deletePhotoDetail(@Param() {id}: FindOneParams) {
    return await this.detailsService.deletePhotoDetail(+id)
  }

  //---------------------------------------------CRUD Доп. Артикула----------------------------------------------------------------

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin-additional-vendor-code')
  async getNotBindingCodes() {
    return await this.detailsService.getNotBindingCodes()
  }

  @Get('additional_vendor')
  async getAllAdditionalVendor() {
    return await this.detailsService.getAllAdditionalVendorCode()
  }

  @Get('additional_vendor/:id')
  async getAdditionalVendorCode(@Param() {id}: FindOneParams) {
    return await this.detailsService.getAdditionalVendorCodeById(+id)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('additional_vendor')
  async createAdditionalVendorCode(@Body() data: AdditionalCodeCreateDto) {
    return await this.detailsService.createAdditionalVendorCode(data)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('additional_vendor')
  async updateAdditionalVendorCode(@Body() data: AdditionalCodeUpdateDto) {
    return await this.detailsService.updateAdditionalVendorCode(data)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('additional_vendor/:id')
  async deleteAdditionalVendorCode(@Param() {id}: FindOneParams) {
    return await this.detailsService.deleteAdditionalVendorCode(+id)
  }

  //---------------------------------------------CRUD Доп. Наименования----------------------------------------------------------------

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin-alternative-name')
  async getNotBindingNames() {
    return await this.detailsService.getNotBindingNames()
  }

  @Get('alternative_name')
  async getAllAlternativeName() {
    return await this.detailsService.getAllAlternativeName()
  }

  @Get('alternative_name/:id')
  async getAlternativeNameById(@Param() {id}: FindOneParams) {
    return await this.detailsService.getAlternativeNameById(+id)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post('alternative_name')
  async createAlternativeName(@Body() data: AlternativeNameCreateDto) {
    return await this.detailsService.createAlternativeName(data)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put('alternative_name')
  async updateAlternativeName(@Body() data: AlternativeNameUpdateDto) {
    return await this.detailsService.updateAlternativeName(data)
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete('alternative_name/:id')
  async deleteAlternativeName(@Param() {id}: FindOneParams) {
    return await this.detailsService.deleteAlternativeName(+id)
  }

}
