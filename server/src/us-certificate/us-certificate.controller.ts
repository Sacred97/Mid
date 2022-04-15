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
import {UsCertificateService} from "./us-certificate.service";
import {Express} from 'express'
import {FindOneParams} from "../utils/params/findOneParams";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {CertificateDto} from "./dto/certificate.dto";
import {CertificateUpdateDto} from "./dto/certificate-update.dto";
import {FileInterceptor} from "@nestjs/platform-express";


@Controller()
export class UsCertificateController {

    constructor(private readonly usCertificateService: UsCertificateService) {
    }

    @Get('us-certificate-random')
    async getRandomCertificates() {
        return await this.usCertificateService.getRandomCertificates()
    }

    @Get('us-certificate')
    async getCertificates() {
        return await this.usCertificateService.getAllCertificate()
    }

    @Get('us-certificate/:id')
    async getCertificate(@Param() {id}: FindOneParams) {
        return await this.usCertificateService.getCertificate(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('us-certificate')
    async uploadCertificate(@Body() data: CertificateDto, @UploadedFile() file: Express.Multer.File) {
        return await this.usCertificateService.uploadCertificate(data, file)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put('us-certificate')
    async updateCertificate(@Body() data: CertificateUpdateDto) {
        return await this.usCertificateService.updateCertificate(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('us-certificate/:id')
    async deleteCertificate(@Param() {id}: FindOneParams) {
        return await this.usCertificateService.removeCertificate(+id)
    }

}
