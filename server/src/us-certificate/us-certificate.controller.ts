import {Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseGuards} from '@nestjs/common';
import {UsCertificateService} from "./us-certificate.service";
import {Express} from 'express'
import {FindOneParams} from "../utils/params/findOneParams";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {CertificateCreateDto} from "./dto/certificate-create.dto";
import {CertificateUpdateDto} from "./dto/certificate-update.dto";


@Controller('us-certificate')
export class UsCertificateController {

    constructor(private readonly usCertificateService: UsCertificateService) {
    }

    @Get()
    async getCertificates() {

    }

    @Get(':id')
    async getCertificate(@Param() {id}: FindOneParams) {

    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async uploadCertificate(@Body() data: CertificateCreateDto, @UploadedFile() file: Express.Multer.File) {

    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async updateCertificate(@Body() data: CertificateUpdateDto) {

    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('id')
    async deleteCertificate(@Param() {id}: FindOneParams) {

    }

}
