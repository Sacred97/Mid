import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {KeyWords} from "./key-words.entity";
import {In, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {RedisCacheService} from "../redis-cache/redis-cache.service";
import {KeyWordsUpdateDto} from "./dto/key-words-update.dto";
import {KeyWordsCreateDto} from "./dto/key-words-create.dto";
import {GET_KEY_WORDS_CACHE_KEY} from "../redis-cache/cacheKey.constant";

@Injectable()
export class KeyWordsService {

    constructor(@InjectRepository(KeyWords) private keyWordsRepository: Repository<KeyWords>,
                private readonly redisCacheService: RedisCacheService) {
    }

    async getAll(offset: number = 0, limit: number = 0) {
        const [items, count] = await this.keyWordsRepository.findAndCount({
            skip: offset, take: limit, order: {id: "ASC"}
        })
        return {items, count}
    }

    async getById(id: number) {
        return await this.keyWordsRepository.findOne(id)
    }

    async findByKeyWord(keyWord: string) {
        return await this.keyWordsRepository.findOne({where: {shortName: keyWord.toLowerCase()}})
    }

    async findMany(keyWords: string[]) {
        keyWords = keyWords.map(word => word.toLowerCase())
        return await this.keyWordsRepository.find({where: {shortName: In(keyWords)}})
    }

    async createKeyWord(createData: KeyWordsCreateDto) {
        await this.redisCacheService.deleteCacheKey(GET_KEY_WORDS_CACHE_KEY)
        const instanceEntity = await this.keyWordsRepository.create({
            ...createData,
            shortName: createData.keyWord.toLowerCase()
        })
        return await this.keyWordsRepository.save(instanceEntity)
    }

    async updateKeyWord(updateData: KeyWordsUpdateDto) {
        const keyWord = await this.getById(updateData.id)
        if (keyWord) {
            if (updateData.keyWord) {
                Object.assign(updateData, {shortName: updateData.keyWord.toLowerCase()})
            }
            await this.redisCacheService.deleteCacheKey(GET_KEY_WORDS_CACHE_KEY)
            const instanceEntity = await this.keyWordsRepository.create(updateData)
            return await this.keyWordsRepository.save(instanceEntity)
        }
        throw new HttpException('Тэг / ключевое слово не найдено', HttpStatus.NOT_FOUND)
    }

    async deleteKeyWord(id: number) {
        const keyWord = await this.getById(id)
        if (keyWord) {
            await this.keyWordsRepository.delete(id)
            await this.redisCacheService.deleteCacheKey(GET_KEY_WORDS_CACHE_KEY)
            return {message: `Тэг / ключевое слово - ${keyWord.keyWord} удалено`}
        }
        throw new HttpException('Тэг / ключевое слово не найдено', HttpStatus.NOT_FOUND)
    }

}
