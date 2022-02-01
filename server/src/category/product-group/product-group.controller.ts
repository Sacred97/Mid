import {Body, CacheKey, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors} from '@nestjs/common';
import {FindOneParams} from "../../utils/params/findOneParams";
import {ProductGroupService} from "./product-group.service";
import {ProductGroupCreateDto} from "./dto/product-group-create.dto";
import {ProductGroupUpdateDto} from "./dto/product-group-update.dto";
import {GET_PRODUCT_GROUP_CACHE_KEY} from "../../redis-cache/cacheKey.constant";
import {HttpCacheInterceptor} from "../../redis-cache/http-cache.interceptor";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../../auth/guards/admin.guard";

@Controller('product-group')
export class ProductGroupController {

    constructor(private readonly productGroupService: ProductGroupService) {
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_PRODUCT_GROUP_CACHE_KEY)
    @Get()
    async getAllProductGroup() {
        return await this.productGroupService.getAll()
    }

    @Get(':id')
    async getProductGroupById(@Param() {id}: FindOneParams){
        return await this.productGroupService.getById(id, true)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async productGroupCreate(@Body() data: ProductGroupCreateDto) {
        return await this.productGroupService.createProductGroup(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async productGroupUpdate(@Body() data: ProductGroupUpdateDto) {
        return await this.productGroupService.updateProductGroup(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async productGroupDelete(@Param() {id}: FindOneParams) {
        return await this.productGroupService.deleteProductGroup(id)
    }

}
