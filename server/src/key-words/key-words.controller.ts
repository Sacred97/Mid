import {Body, CacheKey, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors} from '@nestjs/common';
import {KeyWordsService} from "./key-words.service";
import {FindOneParams} from "../utils/params/findOneParams";
import {KeyWordsCreateDto} from "./dto/key-words-create.dto";
import {KeyWordsUpdateDto} from "./dto/key-words-update.dto";
import {HttpCacheInterceptor} from "../redis-cache/http-cache.interceptor";
import {GET_KEY_WORDS_CACHE_KEY} from "../redis-cache/cacheKey.constant";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {AdminGuard} from "../auth/guards/admin.guard";

@Controller('key-words')
export class KeyWordsController {

    constructor(private readonly keyWordsService: KeyWordsService) {
    }

    @UseInterceptors(HttpCacheInterceptor)
    @CacheKey(GET_KEY_WORDS_CACHE_KEY)
    @Get()
    async getAllKeyWords() {
        return await this.keyWordsService.getAll()
    }

    @Get(':id')
    async getKeyWordById(@Param() {id}: FindOneParams) {
        return await this.keyWordsService.getById(+id)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Post()
    async keyWordCreate(@Body() data: KeyWordsCreateDto) {
        return await this.keyWordsService.createKeyWord(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Put()
    async keyWordUpdate(@Body() data: KeyWordsUpdateDto) {
        return await this.keyWordsService.updateKeyWord(data)
    }

    @UseGuards(JwtAuthGuard, AdminGuard)
    @Delete(':id')
    async keyWordDelete(@Param() {id}: FindOneParams) {
        return await this.keyWordsService.deleteKeyWord(+id)
    }

}
