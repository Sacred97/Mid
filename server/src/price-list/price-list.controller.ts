import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post, Req,
    UploadedFile, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor} from "@nestjs/platform-express";
import {PriceListSendDto} from "./dto/price-list-send.dto";
import {Express} from 'express'
import {PriceListService} from "./price-list.service";
import {PriceListGetDto} from "./dto/price-list-get.dto";
import {PriceListUploadDto} from "./dto/price-list-upload.dto";
import {OneCGuard} from "../one-c/one-c.guard";

@Controller('price-list')
export class PriceListController {

    constructor(private readonly priceListService: PriceListService) {
    }

    @HttpCode(200)
    @Post('send')
    @UseInterceptors(FileInterceptor('file'))
    async sendPriceList(@Body() data: PriceListSendDto, @UploadedFile() file: Express.Multer.File) {
        await this.priceListService.sendPriceList(data, file)
        return {message: 'Прайс успешно отправлен'}
    }

    @HttpCode(200)
    @Post('get')
    async getPriceList(@Body() data: PriceListGetDto) {
        await this.priceListService.getPrices(data)
        return {message: "Письмо отправлено!"}
    }

    @Get('get')
    async getFilesName() {
        return await this.priceListService.getPriceListFilesName()
    }

    @UseGuards(OneCGuard)
    @Post('upload')
    async uploadFile(@Body() data: PriceListUploadDto) {
        return await this.priceListService.uploadToServerFiles(data)
    }

}
