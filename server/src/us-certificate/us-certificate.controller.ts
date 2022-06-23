import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put, Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {UsCertificateService} from "./us-certificate.service";
import {Express} from 'express'
import {FindOneParams} from "../utils/params/findOneParams";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {CertificateDto} from "./dto/certificate.dto";
import {CertificateUpdateDto} from "./dto/certificate-update.dto";
import {FileInterceptor} from "@nestjs/platform-express";
import {TakeSkipParams} from "../utils/params/take-skip.params";


@Controller()
export class UsCertificateController {

    constructor(private readonly usCertificateService: UsCertificateService) {
    }

    @Get('general-info-certificate-random')
    async getRandomCertificates() {
        return await this.usCertificateService.getRandomCertificates()
    }

    @Get('general-info-certificate-with-quantity')
    async GetCertificatesWithQuantity(@Query() {limit, offset}: TakeSkipParams) {
        return await this.usCertificateService.getCertificatesWithQuantity(limit, offset)
    }

    @Get('general-info-certificate')
    async getCertificates() {
        return await this.usCertificateService.getAllCertificate()
    }

    @Get('general-info-certificate/:id')
    async getCertificate(@Param() {id}: FindOneParams) {
        return await this.usCertificateService.getCertificate(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('general-info-certificate')
    async uploadCertificate(@Body() data: CertificateDto, @UploadedFile() file: Express.Multer.File) {
        return await this.usCertificateService.uploadCertificate(data, file)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('general-info-certificate')
    async updateCertificate(@Body() data: CertificateUpdateDto) {
        return await this.usCertificateService.updateCertificate(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('general-info-certificate/:id')
    async deleteCertificate(@Param() {id}: FindOneParams) {
        return await this.usCertificateService.removeCertificate(+id)
    }

}
