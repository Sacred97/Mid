import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {AutoApplicability} from "./auto-applicability.entity";
import {In, Repository} from "typeorm";
import {RedisCacheService} from "../redis-cache/redis-cache.service";
import {ApplicabilityCreateDto} from "./dto/applicability-create.dto";
import {GET_APPLICABILITY_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {ApplicabilityUpdateDto} from "./dto/applicability-update.dto";

@Injectable()
export class AutoApplicabilityService {

    constructor(@InjectRepository(AutoApplicability)
                private applicabilityRepository: Repository<AutoApplicability>,
                private readonly redisCacheService: RedisCacheService) {
    }

    async getFiltersAndCount() {
        return await this.applicabilityRepository
            .query('SELECT a_ap.id, a_ap."autoApplicabilityName" as label, COUNT(d."detailId") AS count_detail ' +
                'FROM auto_applicability a_ap ' +
                'LEFT JOIN detail_auto_applicability_auto_applicability d ON cast(d."autoApplicabilityId" as bigint) = a_ap.id ' +
                'LEFT JOIN detail dt ON dt."id" = d."detailId" WHERE dt."isHide" != true ' +
                'GROUP BY a_ap.id ORDER BY label'
            )
    }

    async getAll() {
        return await this.applicabilityRepository.find()
    }

    async getById(id: number) {
        return await this.applicabilityRepository.findOne(id)
    }

    async findMany(applicability: string[]) {
        applicability = applicability.map(item => item.toLowerCase())
        return await this.applicabilityRepository.find({where: {shortName: In(applicability)}})
    }

    async findByApplicability(applicability: string) {
        return await this.applicabilityRepository.find({where: {shortName: applicability}})
    }

    async createApplicability(createData: ApplicabilityCreateDto[]) {
        await this.redisCacheService.deleteCacheKey(GET_APPLICABILITY_CACHE_KEY)
        for (let data of createData) {
            let instanceEntity = await this.applicabilityRepository.create({
                ...data, shortName: data.autoApplicabilityName.toLowerCase()
            })
            await this.applicabilityRepository.save(instanceEntity)
        }
        return await this.getAll()
    }

    async updateApplicability(updateData: ApplicabilityUpdateDto) {
        const applicability = await this.getById(updateData.id)
        if (applicability) {
            if (applicability.autoApplicabilityName) {
                Object.assign(updateData, {shortName: updateData.autoApplicabilityName.toLowerCase()})
            }
            await this.redisCacheService.deleteCacheKey(GET_APPLICABILITY_CACHE_KEY)
            // const instanceEntity = await this.applicabilityRepository.create(updateData)
            // return await this.applicabilityRepository.save(instanceEntity)
            await this.applicabilityRepository.update(updateData.id, {...updateData})
            return await this.getById(updateData.id)
        }
        throw new HttpException('Автоприменяемость не найдена', HttpStatus.NOT_FOUND)
    }

    async deleteApplicability(id: number) {
        const applicability = await this.getById(id)
        if (applicability) {
            await this.applicabilityRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_APPLICABILITY_CACHE_KEY)
            return {message: `Автоприменяемость - ${applicability.autoApplicabilityName} удалена`}
        }
        throw new HttpException('Автоприменяемость не найдена', HttpStatus.NOT_FOUND)
    }

}
