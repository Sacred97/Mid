import {
    Body,
    CacheKey,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {CountryService} from "./country.service";
import {FindOneParams} from "../../utils/params/findOneParams";
import {CountryCreateDto} from "./dto/country-create.dto";
import {CountryUpdateDto} from "./dto/country-update.dto";
import {HttpCacheInterceptor} from "../../redis-cache/http-cache.interceptor";
import {GET_COUNTRY_CACHE_KEY} from "../../redis-cache/cacheKey.constant";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../../auth/guards/admin.guard";

@Controller('country')
export class CountryController {

    constructor(private readonly countryService: CountryService) {
    }

    @Get('many')
    async getCountryByRegion(@Query('id') id: string) {
        return await this.countryService.getByRegion(+id)
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_COUNTRY_CACHE_KEY)
    @Get()
    async getAllCountry() {
        return await this.countryService.getAll()
    }

    @Get('one/:id')
    async getCountryById(@Param() {id}: FindOneParams) {
        return await this.countryService.getById(+id, true)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async countryCreate(@Body() data: CountryCreateDto) {
        return await this.countryService.createCountry(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async countryUpdate(@Body() data: CountryUpdateDto) {
        return await this.countryService.updateCountry(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete('one/:id')
    async countryDelete(@Param() {id}: FindOneParams) {
        return await this.countryService.deleteCountry(+id)
    }

}
