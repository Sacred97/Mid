import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Category} from "./category.entity";
import {ProductGroupService} from "./product-group/product-group.service";
import {CategoryUpdateDto} from "./dto/category-update.dto";
import {CategoryCreateDto} from "./dto/category-create.dto";
import {RedisCacheService} from "../redis-cache/redis-cache.service";
import {GET_CATEGORY_CACHE_KEY} from "../redis-cache/cacheKey.constant";

@Injectable()
export class CategoryService {

    constructor(@InjectRepository(Category) private categoryRepository: Repository<Category>,
                private readonly productGroupService: ProductGroupService,
                private readonly redisCacheService: RedisCacheService) {
    }

    async getAll() {
        return await this.categoryRepository.find()
    }

    async getById(id: string) {
        return await this.categoryRepository.findOne(id)
    }

    async getCategoriesAsFilterAndCount() {
        const query: string = 'SELECT c.id, c."categoryName" as label, COUNT(d."categoryId") AS count_detail ' +
            'FROM category c LEFT JOIN detail d ON d."categoryId" = c.id ' +
            'WHERE d."isHide" != true ' +
            'GROUP BY c.id ORDER BY label'
        return await this.categoryRepository.query(query)
    }

    async createCategory(createData: CategoryCreateDto) {
        let productGroup = await this.productGroupService.getById(createData.productGroupId)
        if (!productGroup) {
            productGroup = await this.productGroupService.getById('404')
        }
        const newCategory = await this.categoryRepository.create({...createData, productGroup: productGroup})
        await this.redisCacheService.deleteCacheKey(GET_CATEGORY_CACHE_KEY)
        return await this.categoryRepository.save(newCategory)
    }

    async updateCategory(updateData: CategoryUpdateDto) {
        const category = await this.getById(updateData.id)
        if (category) {
            if (updateData.productGroupId) {
                const productGroup = await this.productGroupService.getById(updateData.productGroupId)
                if (productGroup) Object.assign(updateData, {productGroup: productGroup})
                delete updateData.productGroupId
            }
            await this.categoryRepository.update(updateData.id, {...updateData})
            await this.redisCacheService.deleteCacheKey(GET_CATEGORY_CACHE_KEY)
            return await this.getById(updateData.id)
        }
        throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
    }

    async deleteCategory(id: string) {
        const category = await this.getById(id)
        if (category) {
            await this.categoryRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_CATEGORY_CACHE_KEY)
            return this.getAll()
        }
        throw new HttpException('Категория не найдена', HttpStatus.NOT_FOUND)
    }

}
