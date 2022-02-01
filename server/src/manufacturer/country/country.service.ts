import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Country} from "./country.entity";
import {Repository} from "typeorm";
import {CountryCreateDto} from "./dto/country-create.dto";
import {CountryUpdateDto} from "./dto/country-update.dto";
import {RegionService} from "../region/region.service";
import {RedisCacheService} from "../../redis-cache/redis-cache.service";
import {GET_COUNTRY_CACHE_KEY} from "../../redis-cache/cacheKey.constant";

@Injectable()
export class CountryService {

    constructor(@InjectRepository(Country) private countryRepository: Repository<Country>,
                private readonly regionService: RegionService,
                private readonly redisCacheService: RedisCacheService) {
    }

    private getRelations(relations: boolean): string[] {
        return relations ? ['manufacturer', 'region'] : []
    }

    async getByRegion(regionId: number) {
        return await this.countryRepository.find({
            relations: ['region'],
            where: {region: {id: regionId}}
        })
    }

    async getAll() {
        return await this.countryRepository.find({relations: ['manufacturer', 'region']})
            .then(countries => {
                return countries.sort((a, b) => a.country.localeCompare(b.country))
            })
    }

    async getById(id: number, withRelations: boolean = false) {
        return await this.countryRepository.findOne(id, {relations: this.getRelations(withRelations)})
    }

    async getByName(country: string, withRelations: boolean = false) {
        return await this.countryRepository.findOne({relations: this.getRelations(withRelations),
            where: {shortName: country.toLowerCase()}})
    }

    async createCountry(createData: CountryCreateDto) {
        await this.redisCacheService.deleteCacheKey(GET_COUNTRY_CACHE_KEY)
        let region = await this.regionService.getByName(createData.regionName)
        if (!region) {
            region = await this.regionService.createRegion({region: createData.regionName})
        }
        const instanceEntity = await this.countryRepository.create({
            country: createData.country,
            shortName: createData.country.toLowerCase(),
            region: region
        })
        return await this.countryRepository.save(instanceEntity)
    }

    async updateCountry(updateData: CountryUpdateDto) {
        const country = await this.getById(updateData.id)
        if (country) {
            if (updateData.country) Object.assign(updateData, {shortName: updateData.country.toLowerCase()})
            if (updateData.regionId) {
                let region = await this.regionService.getById(updateData.regionId)
                if (region) Object.assign(updateData, {region: region})
                delete updateData.regionId
            }
            await this.redisCacheService.deleteCacheKey(GET_COUNTRY_CACHE_KEY)
            await this.countryRepository.update(updateData.id, {...updateData})
            return await this.getById(updateData.id, true)
        }
        throw new HttpException('Страна/Город/Область не найдена', HttpStatus.NOT_FOUND)
    }

    async deleteCountry(id: number) {
        const country = await this.getById(id)
        if (country) {
            await this.countryRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_COUNTRY_CACHE_KEY)
            return {message: 'Страна / город успешно удалена'}
        }
        throw new HttpException('Страна/Город/Область не найдена', HttpStatus.NOT_FOUND)
    }

}
