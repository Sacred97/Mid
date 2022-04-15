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

@Controller()
export class BannersController {

    constructor(private readonly bannersService: BannersService) {
    }

    @Get('home-page')
    async getHomePageBanners() {
        return await this.bannersService.getPageBanners(true)
    }

    @Get('catalog-page')
    async getCatalogPageBanners() {
        return await this.bannersService.getPageBanners(false)
    }

    @Get('banners')
    async getBanners() {
        return await this.bannersService.getAllBanners()
    }

    @Get('banners/:id')
    async getBanner(@Param() {id}: FindOneParams) {
        return await this.bannersService.getBanner(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('banners')
    async uploadBanner(@Body() data: BannerCreateDto, @UploadedFile() file: Express.Multer.File) {
        return await this.bannersService.uploadBanner(data, file)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('banners')
    async updateBanner(@Body() data: BannerUpdateDto) {
        return await this.bannersService.updateBanner(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('banners/:id')
    async removeBanner(@Param() {id}: FindOneParams) {
        return await this.bannersService.removeBanner(+id)
    }

}
