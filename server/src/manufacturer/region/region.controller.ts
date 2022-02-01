import {
    Body, CacheKey,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import {RegionService} from "./region.service";
import {FindOneParams} from "../../utils/params/findOneParams";
import {RegionUpdateDto} from "./dto/region-update.dto";
import {RegionCreateDto} from "./dto/region-create.dto";
import {GET_REGION_CACHE_KEY} from "../../redis-cache/cacheKey.constant";
import {HttpCacheInterceptor} from "../../redis-cache/http-cache.interceptor";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../../auth/guards/admin.guard";

@Controller('region')
export class RegionController {

    constructor(private readonly regionService: RegionService) {
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_REGION_CACHE_KEY)
    @Get()
    async getAllRegion() {
        return await this.regionService.getAll()
    }

    @Get(':id')
    async getRegionById(@Param() {id}: FindOneParams) {
        return await this.regionService.getById(+id, true)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async regionCreate(@Body() data: RegionCreateDto) {
        return await this.regionService.createRegion(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async regionUpdate(@Body() data: RegionUpdateDto) {
        return await this.regionService.updateRegion(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async regionDelete(@Param() {id}: FindOneParams) {
        return await this.regionService.deleteRegion(+id)
    }

}
