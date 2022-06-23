import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ProductGroup} from "./product-group.entity";
import {Repository} from "typeorm";
import {ProductGroupDto} from "./dto/product-group.dto";
import {RedisCacheService} from "../../redis-cache/redis-cache.service";
import {GET_PRODUCT_GROUP_CACHE_KEY} from "../../redis-cache/cacheKey.constant";

@Injectable()
export class ProductGroupService {

    constructor(@InjectRepository(ProductGroup) private productGroupRepository: Repository<ProductGroup>,
                private readonly redisCacheService: RedisCacheService) {
    }

    private getRelations(relations: boolean) {
        return relations? ['category'] : []
    }

    async getAll() {
        return await this.productGroupRepository.find({relations: ['category']})
    }

    async getById(id: string, withRelations: boolean = false) {
        return await this.productGroupRepository.findOne(id, {relations: this.getRelations(withRelations)})
    }

    async createProductGroup(createData: ProductGroupDto) {
        const newProductGroup = await this.productGroupRepository.create({...createData})
        await this.redisCacheService.deleteCacheKey(GET_PRODUCT_GROUP_CACHE_KEY)
        return await this.productGroupRepository.save(newProductGroup)
    }

    async updateProductGroup(updateData: ProductGroupDto) {
        const productGroup = await this.getById(updateData.id)
        if (productGroup) {
            await this.productGroupRepository.update(updateData.id, {...updateData})
            await this.redisCacheService.deleteCacheKey(GET_PRODUCT_GROUP_CACHE_KEY)
            return await this.getById(updateData.id, true)
        }
        throw new HttpException('Группа товаров не найдена', HttpStatus.NOT_FOUND)
    }

    async deleteProductGroup(id: string) {
        const productGroup = await this.getById(id)
        if (productGroup) {
            await this.productGroupRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_PRODUCT_GROUP_CACHE_KEY)
            return await this.getAll()
        }
        throw new HttpException('Группа товаров не найдена', HttpStatus.NOT_FOUND)
    }

}
