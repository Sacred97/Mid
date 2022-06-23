import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {AutoParts} from "./auto-parts.entity";
import {In, Repository} from "typeorm";
import {RedisCacheService} from "../redis-cache/redis-cache.service";
import {PartsCreateDto} from "./dto/parts-create.dto";
import {PartsUpdateDto} from "./dto/parts-update.dto";
import {GET_PARTS_CACHE_KEY} from "../redis-cache/cacheKey.constant";

@Injectable()
export class AutoPartsService {

    constructor(@InjectRepository(AutoParts) private autoPartsRepository: Repository<AutoParts>,
                private readonly redisCacheService: RedisCacheService) {
    }

    async getPartsAsFilterAndCount() {
        return await this.autoPartsRepository.query(
            'SELECT a_p.id, a_p."autoPartsName" as label, COUNT(d."detailId") AS count_detail ' +
            'FROM auto_parts a_p ' +
            'LEFT JOIN detail_auto_parts_auto_parts d ON cast(d."autoPartsId" as bigint) = a_p.id ' +
            'LEFT JOIN detail dt ON dt."id" = d."detailId" WHERE dt."isHide" != true ' +
            'GROUP BY a_p.id ORDER BY label'
        )
    }

    async getAll() {
        return await this.autoPartsRepository.find()
    }

    async getById(id: number) {
        return await this.autoPartsRepository.findOne(id)
    }

    async findMany(autoParts: string[]) {
        autoParts = autoParts.map(parts => parts.toLowerCase())
        return await this.autoPartsRepository.find({where: {shortName: In(autoParts)}})
    }

    async createParts(createData: PartsCreateDto[]) {
        await this.redisCacheService.deleteCacheKey(GET_PARTS_CACHE_KEY)
        for (let data of createData) {
            let instanceEntity = await this.autoPartsRepository.create({
                ...data,
                shortName: data.autoPartsName.toLowerCase()
            })
            await this.autoPartsRepository.save(instanceEntity)
        }
        return await this.getAll()
    }

    async updateParts(updateData: PartsUpdateDto) {
        const parts = await this.getById(updateData.id)
        if (parts) {
            Object.assign(updateData, {shortName: updateData.autoPartsName.toLowerCase()})
            await this.redisCacheService.deleteCacheKey(GET_PARTS_CACHE_KEY)
            await this.autoPartsRepository.update(updateData.id, {...updateData})
            return await this.getById(updateData.id)
        }
        throw new HttpException('Автозапчасть не найдена', HttpStatus.NOT_FOUND)
    }

    async deleteParts(id: number) {
        const parts = await this.autoPartsRepository.findOne(id)
        if (parts) {
            await this.autoPartsRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_PARTS_CACHE_KEY)
            return {message: `Автозапчасть - ${parts.autoPartsName} удалена`}
        }
        throw new HttpException('Автозапчасть не найдена', HttpStatus.NOT_FOUND)
    }

}
