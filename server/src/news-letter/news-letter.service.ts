import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {NewsLetter} from "./entity/news-letter.entity";
import {NewsLetterCreateDto} from "./dto/news-letter-create.dto";
import {NewsLetterUpdateDto} from "./dto/news-letter-update.dto";

@Injectable()
export class NewsLetterService {

    constructor(@InjectRepository(NewsLetter) private newsLetterRepository: Repository<NewsLetter>) {
    }

    private relations(withRelations: boolean) {
        return withRelations ? ['subscriptions'] : []
    }

    async getAll(isAdmin: boolean = false) {
        return await this.newsLetterRepository.find({relations: this.relations(isAdmin)})
    }

    async getById(id: number, isAdmin: boolean = false) {
        return await this.newsLetterRepository.findOne(id, {relations: this.relations(isAdmin)})
    }

    async createNewsLetter(createData: NewsLetterCreateDto) {
        const instanceEntity = await this.newsLetterRepository.create(createData)
        return await this.newsLetterRepository.save(instanceEntity)
    }

    async updateNewsLetter(updateData: NewsLetterUpdateDto) {
        const newsLetter = await this.newsLetterRepository.findOne(updateData.id)
        if (newsLetter) {
            await this.newsLetterRepository.update(updateData.id, {...updateData})
            return this.getById(newsLetter.id, true)
        }
        throw new HttpException('Рассылка не найдена', HttpStatus.NOT_FOUND)
    }

    async deleteNewsLetter(id: number) {
        const newsLetter = await this.newsLetterRepository.findOne(id)
        if (newsLetter) {
            await this.newsLetterRepository.delete(id)
            return this.getAll(true)
        }
        throw new HttpException('Рассылка не найдена', HttpStatus.NOT_FOUND)
    }

}
