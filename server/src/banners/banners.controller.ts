import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {BannersService} from "./banners.service";
import {BannerCreateDto} from "./dto/banner-create.dto";
import {FindOneParams} from "../utils/params/findOneParams";
import {BannerUpdateDto} from "./dto/banner-update.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {Express} from 'express'
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";

@Controller('banners')
export class BannersController {

    constructor(private readonly bannersService: BannersService) {
    }

    @Get()
    async getBanners() {
        return await this.bannersService.getAllBanners()
    }

    @Get(':id')
    async getBanner(@Param() {id}: FindOneParams) {
        return await this.bannersService.getBanner(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    async uploadBanner(@Body() data: BannerCreateDto, @UploadedFile() file: Express.Multer.File) {
        return await this.bannersService.uploadBanner(data, file)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async updateBanner(@Body() data: BannerUpdateDto) {
        return await this.bannersService.updateBanner(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async removeBanner(@Param() {id}: FindOneParams) {
        return await this.bannersService.removeBanner(+id)
    }

}
