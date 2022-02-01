import {
    Body,
    CacheKey,
    Controller,
    Delete,
    Get,
    Param, ParseArrayPipe,
    Post,
    Put,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AutoApplicabilityService} from "./auto-applicability.service";
import {HttpCacheInterceptor} from "../redis-cache/http-cache.interceptor";
import {GET_APPLICABILITY_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {FindOneParams} from "../utils/params/findOneParams";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";
import {TransformToArrayInterceptor} from "../interceptors/transform-to-array.interceptor";
import {ApplicabilityCreateDto} from "./dto/applicability-create.dto";
import {ApplicabilityUpdateDto} from "./dto/applicability-update.dto";

@Controller('auto-applicability')
export class AutoApplicabilityController {

    constructor(private readonly applicabilityService: AutoApplicabilityService) {
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_APPLICABILITY_CACHE_KEY)
    @Get()
    async getAllAutoApplicability() {
        return await this.applicabilityService.getAll()
    }

    @Get(':id')
    async getAutoApplicabilityById(@Param() {id}: FindOneParams) {
        return await this.applicabilityService.getById(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @UseInterceptors(TransformToArrayInterceptor)
    @Post()
    async autoApplicabilityCreate(@Body(new ParseArrayPipe({items: ApplicabilityCreateDto}))
                                          data: ApplicabilityCreateDto[]) {
        return await this.applicabilityService.createApplicability(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async autoApplicabilityUpdate(@Body() data: ApplicabilityUpdateDto) {
        return  await this.applicabilityService.updateApplicability(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async autoApplicabilityDelete(@Param() {id}: FindOneParams) {
        return await this.applicabilityService.deleteApplicability(+id)
    }

}
