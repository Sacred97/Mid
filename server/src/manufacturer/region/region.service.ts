import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Region} from "./region.entity";
import {Repository} from "typeorm";
import {RegionCreateDto} from "./dto/region-create.dto";
import {RegionUpdateDto} from "./dto/region-update.dto";
import {RedisCacheService} from "../../redis-cache/redis-cache.service";
import {GET_REGION_CACHE_KEY} from "../../redis-cache/cacheKey.constant";

@Injectable()
export class RegionService {

    constructor(@InjectRepository(Region) private regionRepository: Repository<Region>,
                private readonly redisCacheService: RedisCacheService
    ) {
    }

    private getRelations(relations: boolean): string[] {
        return relations?['country']:[]
    }

    async getAll() {
        return await this.regionRepository.find({relations: ['country']})
    }

    async getById(id: number, withRelations: boolean = false) {
        return await this.regionRepository.findOne(id, {relations: this.getRelations(withRelations)})
    }

    async getByName(regionName: string, withRelations: boolean = false) {
        return await this.regionRepository.findOne({relations: this.getRelations(withRelations),
            where: {shortName: regionName.toLowerCase()}})
    }

    async createRegion(createData: RegionCreateDto) {
        await this.redisCacheService.deleteCacheKey(GET_REGION_CACHE_KEY)
        const instanceEntity = await this.regionRepository.create({
            ...createData, shortName: createData.region.toLowerCase()
        })
        return await this.regionRepository.save(instanceEntity)
    }

    async updateRegion(updateData: RegionUpdateDto) {
        const region = await this.getById(updateData.id)
        if (region) {
            await this.redisCacheService.deleteCacheKey(GET_REGION_CACHE_KEY)
            await this.regionRepository.update(updateData.id, {
                ...updateData, shortName: updateData.region.toLowerCase()
            })
            return await this.getById(updateData.id, true)
        }
        throw new HttpException('Регион не найден', HttpStatus.NOT_FOUND)
    }

    async deleteRegion(id: number) {
        const region = await this.getById(id)
        if (region) {
            await this.regionRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_REGION_CACHE_KEY)
            return {message: 'Регион успешно удален'}
        }
        throw new HttpException('Регион не найден', HttpStatus.NOT_FOUND)
    }

}
