import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Certificate} from "./entity/certificate.entity";
import {Repository} from "typeorm";
import {FilesService} from "../files/files.service";
import {Express} from 'express'
import {CertificateCreateDto} from "./dto/certificate-create.dto";
import {CertificateUpdateDto} from "./dto/certificate-update.dto";

@Injectable()
export class UsCertificateService {

    constructor(@InjectRepository(Certificate) private certificateRepository: Repository<Certificate>,
                private readonly filesService: FilesService) {
    }

    async getAllCertificate() {
        const certificates = await this.certificateRepository.find()
        return certificates.sort((a, b) => {
            if (a.serialNumber > b.serialNumber) {
                return 1
            } else if (a.serialNumber === b.serialNumber) {
                return 0
            } else {
                return -1
            }
        })
    }

    async getCertificate(id: number) {
        return await this.certificateRepository.findOne(id)
    }

    async uploadCertificate(data: CertificateCreateDto, file: Express.Multer.File) {

    }

    async updateCertificate(data: CertificateUpdateDto) {

    }

    async removeCertificate(id: number) {
        const certificate = await this.getCertificate(id)
        if (certificate) {
            await this.filesService.removeSelectel(certificate.key)
            return await this.getAllCertificate()
        }
        throw new HttpException('Сертификат не найден', HttpStatus.NOT_FOUND)
    }

}
