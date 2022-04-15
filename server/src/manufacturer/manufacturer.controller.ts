import {
    Body, CacheKey,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UploadedFiles, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ManufacturerService} from "./manufacturer.service";
import {FindOneParams} from "../utils/params/findOneParams";
import {ManufacturerCreateDto} from "./dto/manufacturer-create.dto";
import {ManufacturerUpdateDto} from "./dto/manufacturer-update.dto";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";
import {Express} from 'express'
import {PhotoCertificateDto} from "./dto/photo-certificate.dto";
import {HttpCacheInterceptor} from "../redis-cache/http-cache.interceptor";
import {GET_MANUFACTURER_CACHE_KEY, GET_MANUFACTURER_FILTERS_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {ManufacturerFilterDto} from "./dto/manufacturer-filter.dto";
import {TakeSkipParams} from "../utils/params/take-skip.params";

@Controller()
export class ManufacturerController {

    constructor(private readonly manufacturerService: ManufacturerService) {
    }

    //-----------------------------------------Поиск по производителям--------------------------------------------------
    @Get('manufacturer_search')
    async manufacturerSearch(@Query('search') search: string) {
        return await this.manufacturerService.searchManufacturer(search.trim())
    }

    //-----------------------------------------Фильтры по производителю-------------------------------------------------

    @Post('manufacturer_filter')
    async manufacturerFilter(@Body() data: ManufacturerFilterDto, @Query() {limit, offset}: TakeSkipParams) {
        return await this.manufacturerService.filterManufacturer(data, offset, limit)
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_MANUFACTURER_FILTERS_CACHE_KEY)
    @Get('manufacturer_filter/:id')
    async manufacturerFiltersAndCount(@Param() {id}: FindOneParams) {
        return await this.manufacturerService.getFiltersByManufacturer(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Get('manufacturer-without-country')
    async withoutCountry() {
        return await this.manufacturerService.getAllWithoutCountry()
    }

    //------------------------------------------------------------------------------------------------------------------

    @Get('random-manufacturer')
    async getRandomManufacturer() {
        return await this.manufacturerService.getRandomManufacturer()
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_MANUFACTURER_CACHE_KEY)
    @Get('manufacturer')
    async getLimitManufacturers(@Query() {offset, limit}: TakeSkipParams) {
        return this.manufacturerService.getAllWithLimit(offset, limit)
    }

    @Get('manufacturer/:id')
    async getManufacturerById(@Param() {id}: FindOneParams) {
       return await this.manufacturerService.getById(+id, true)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post('manufacturer')
    async manufacturerCreate(@Body() data: ManufacturerCreateDto) {
        return await this.manufacturerService.createManufacturer(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Put('manufacturer')
    async manufacturerUpdate(@Body() data: ManufacturerUpdateDto, @UploadedFile() file?: Express.Multer.File) {
        return await this.manufacturerService.updateManufacturer(data, file)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('manufacturer/:id')
    async manufacturerDelete(@Param() {id}: FindOneParams) {
        return await this.manufacturerService.deleteManufacturer(+id)
    }

    //---------------------------------API сертификатов производителя(PhotoCertificate)-------------------------------------------

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FilesInterceptor('files'))
    @Post('certificate')
    async photoCertificateCreate(@Body() data: PhotoCertificateDto, @UploadedFiles() files: Express.Multer.File[]) {
        return await this.manufacturerService.uploadCertificate(data, files)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('certificate/:id')
    async photoCertificateDelete(@Param() {id}: FindOneParams) {
        return await this.manufacturerService.deleteCertificate(+id)
    }

}
