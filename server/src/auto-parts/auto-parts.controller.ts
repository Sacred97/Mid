import {
    Body, CacheKey,
    Controller,
    Delete,
    Get,
    Param, ParseArrayPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AutoPartsService} from "./auto-parts.service";
import {PartsCreateDto} from "./dto/parts-create.dto";
import {PartsUpdateDto} from "./dto/parts-update.dto";
import {FindOneParams} from "../utils/params/findOneParams";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {TransformToArrayInterceptor} from "../interceptors/transform-to-array.interceptor";
import {HttpCacheInterceptor} from "../redis-cache/http-cache.interceptor";
import {GET_PARTS_CACHE_KEY} from "../redis-cache/cacheKey.constant";

@Controller('auto-parts')
export class AutoPartsController {

    constructor(private readonly autoPartsService: AutoPartsService) {
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_PARTS_CACHE_KEY)
    @Get()
    async getAllAutoParts() {
        return await this.autoPartsService.getAll()
    }

    @Get(':id')
    async getAutoPartsById(@Param() {id}: FindOneParams) {
        return await this.autoPartsService.getById(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(TransformToArrayInterceptor)
    @Post()
    async autoPartsCreate(@Body(new ParseArrayPipe({items: PartsCreateDto})) data: PartsCreateDto[]) {
        return await this.autoPartsService.createParts(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async autoPartsUpdate(@Body() data: PartsUpdateDto) {
        return await this.autoPartsService.updateParts(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async autoPartsDelete(@Param() {id}: FindOneParams) {
        return await this.autoPartsService.deleteParts(+id)
    }

}
