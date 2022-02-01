import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Express} from 'express'
import {BannerCreateDto} from "./dto/banner-create.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Banners} from "./entity/banners.entity";
import {FilesService} from "../files/files.service";
import {BannerUpdateDto} from "./dto/banner-update.dto";

@Injectable()
export class BannersService {

    constructor(@InjectRepository(Banners) private bannersRepository: Repository<Banners>,
                private readonly filesService: FilesService) {
    }

    async getAllBanners() {
        return await this.bannersRepository.find()
    }

    async getBanner(id: number) {
        return await this.bannersRepository.findOne(id)
    }

    async uploadBanner(data: BannerCreateDto, file: Express.Multer.File) {
        const position: string = data.homePage ? 'home' : 'catalog'
        const uploadData = await this.filesService
            .uploadDetailPhoto('banners', file.buffer, file.originalname, position)
        const instanceEntity = await this.bannersRepository.create({
            url: uploadData.Location, key: uploadData.Key, ...data
        })
        await this.bannersRepository.save(instanceEntity)
        return await this.getAllBanners()
    }

    async updateBanner(data: BannerUpdateDto) {
        const banner = await this.bannersRepository.findOne(data.id)
        if (banner) {
            await this.bannersRepository.update(data.id, {...data})
            return await this.getBanner(data.id)
        }
        throw new HttpException('Баннер не найден', HttpStatus.NOT_FOUND)
    }

    async removeBanner(id: number) {
        const banner = await this.bannersRepository.findOne(id)
        if (banner) {
            await this.filesService.deleteDetailPhoto(banner.key)
            await this.bannersRepository.delete(id)
            return await this.getAllBanners()
        }
        throw new HttpException('Баннер не найден', HttpStatus.NOT_FOUND)
    }


}
