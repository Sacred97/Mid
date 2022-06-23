import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Certificate} from "./entity/certificate.entity";
import {Repository} from "typeorm";
import {FilesService} from "../files/files.service";
import {Express} from 'express'
import {CertificateDto} from "./dto/certificate.dto";
import {CertificateUpdateDto} from "./dto/certificate-update.dto";

@Injectable()
export class UsCertificateService {

    constructor(@InjectRepository(Certificate) private certificateRepository: Repository<Certificate>,
                private readonly filesService: FilesService) {
    }

    async getCertificatesWithQuantity(limit: number = 0, offset: number = 0) {
        const [certificates, count] = await this.certificateRepository.findAndCount({
            take: limit,
            skip: offset
        })
        certificates.sort((a, b) => {
            if (a.serialNumber > b.serialNumber) {
                return 1
            } else if (a.serialNumber === b.serialNumber) {
                return 0
            } else {
                return -1
            }
        })
        return {certificates, count}
    }

    async getAllCertificate(limit: number = 0, offset: number = 0) {
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

    async getRandomCertificates() {
        const count = await this.certificateRepository.count()
        const offset = count <= 20 ? 0 : Math.round(Math.random() * (count - 20))
        return await this.certificateRepository.find({
            skip: offset,
            take: 20
        })
    }

    async getCertificate(id: number) {
        return await this.certificateRepository.findOne(id)
    }

    async uploadCertificate(data: CertificateDto, file: Express.Multer.File) {
        const certificates = (await this.certificateRepository.find())
            .filter(i => i.serialNumber >= data.serialNumber)
        const filename = file.originalname + Date.now()
        const uploadData = await this.filesService.uploadSelectel(file.buffer, 'general-info-certificate',
            'certificate', filename)
        const instanceEntity = await this.certificateRepository.create({
            ...data,
            url: uploadData.Location,
            key: uploadData.Key
        })
        for (let c of certificates) {
            await this.certificateRepository.update(c.id, {serialNumber: c.serialNumber + 1})
        }
        await this.certificateRepository.save(instanceEntity)
        return await this.getAllCertificate()
    }

    async updateCertificate(data: CertificateUpdateDto) {
        const certificate = await this.getCertificate(data.id)
        if (certificate) {
            await this.certificateRepository.update(data.id, {serialNumber: data.serialNumber})
            return await this.getCertificate(data.id)
        }
        throw new HttpException('Сертификат не найден', HttpStatus.NOT_FOUND)
    }

    async removeCertificate(id: number) {
        const certificate = await this.getCertificate(id)
        if (certificate) {
            await this.filesService.removeSelectel(certificate.key)
            await this.certificateRepository.delete(id)
            return await this.getAllCertificate()
        }
        throw new HttpException('Сертификат не найден', HttpStatus.NOT_FOUND)
    }

}
