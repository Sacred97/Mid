import {Body, CacheKey, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors} from '@nestjs/common';
import {CategoryService} from "./category.service";
import {FindOneParams} from "../utils/params/findOneParams";
import {CategoryCreateDto} from "./dto/category-create.dto";
import {CategoryUpdateDto} from "./dto/category-update.dto";
import {HttpCacheInterceptor} from "../redis-cache/http-cache.interceptor";
import {GET_CATEGORY_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {getCategoryParams} from "../utils/params/get-category-params";

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_CATEGORY_CACHE_KEY)
    @Get()
    async getAllCategories() {
        return await this.categoryService.getAll()
    }

    @Get(':id')
    async getCategoryById(@Param() {id}: getCategoryParams) {
        return await this.categoryService.getById(id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async categoryCreate(@Body() data: CategoryCreateDto) {
        return await this.categoryService.createCategory(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async categoryUpdate(@Body() data: CategoryUpdateDto) {
        return await this.categoryService.updateCategory(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async categoryDelete(@Param() {id}: FindOneParams) {
        return await this.categoryService.deleteCategory(id)
    }

}
