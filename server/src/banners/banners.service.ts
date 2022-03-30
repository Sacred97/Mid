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
        const banners = await this.bannersRepository.find()
        return banners.sort((a, b) => {
            if (a.homePage > b.homePage) {
                return -1
            } else if (a.homePage === b.homePage) {
                if (a.serialNumber > b.serialNumber) {
                    return 1
                } else if (a.serialNumber === b.serialNumber) {
                    return 0
                } else {
                    return -1
                }
            } else {
                return 1
            }
        })
    }

    async getBanner(id: number) {
        return await this.bannersRepository.findOne(id)
    }

    async uploadBanner(data: BannerCreateDto, file: Express.Multer.File) {
        let banners = (await this.bannersRepository.find({where: {homePage: data.homePage}}))
            .filter(i => i.serialNumber >= data.serialNumber)
        const directory: string = data.homePage ? 'home' : 'catalog'
        const uploadData = await this.filesService
            .uploadSelectel(file.buffer, 'banners', directory, file.originalname)
        const instanceEntity = await this.bannersRepository.create({
            url: uploadData.Location, key: uploadData.Key, ...data
        })
        for (let b of banners) {
            await this.bannersRepository.update(b.id, {serialNumber: b.serialNumber + 1})
        }
        await this.bannersRepository.save(instanceEntity)
        return await this.getAllBanners()
    }

    async updateBanner(data: BannerUpdateDto) {
        const banner = await this.bannersRepository.findOne(data.id)
        let banners = (await this.bannersRepository.find({where: {homePage: banner.homePage}}))
        if (banner) {
            if (!data.serialNumber) {
                let lastNumber = 0
                banners.forEach(i => {
                    if (i.serialNumber >= lastNumber) lastNumber = i.serialNumber
                })
                await this.bannersRepository.update(data.id, {...data, serialNumber: lastNumber + 1})
                return await this.getBanner(data.id)
            }
            if (banners.find(i => i.serialNumber === data.serialNumber)) {
                if (banner.id === data.id) {
                    await this.bannersRepository.update(data.id, {...data})
                    return await this.getBanner(data.id)
                }
                banners = banners.filter(i => i.serialNumber >= data.serialNumber)
                for (let b of banners) {
                    await this.bannersRepository.update(b.id, {serialNumber: b.serialNumber + 1})
                }
                await this.bannersRepository.update(data.id, {...data})
                return await this.getBanner(data.id)
            }
            await this.bannersRepository.update(data.id, {...data})
            return await this.getBanner(data.id)
        }
        throw new HttpException('Баннер не найден', HttpStatus.NOT_FOUND)
    }

    async removeBanner(id: number) {
        const banner = await this.bannersRepository.findOne(id)
        if (banner) {
            await this.filesService.removeSelectel(banner.key)
            await this.bannersRepository.delete(id)
            return await this.getAllBanners()
        }
        throw new HttpException('Баннер не найден', HttpStatus.NOT_FOUND)
    }


}
