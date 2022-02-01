import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {MailService} from "../mail/mail.service";
import {PriceListSendDto} from "./dto/price-list-send.dto";
import {Express} from "express";
import * as fs from 'fs'
import * as path from 'path'
import {PriceListGetDto} from "./dto/price-list-get.dto";


@Injectable()
export class PriceListService {

    constructor(private readonly mailService: MailService) {
    }

    async sendPriceList(data: PriceListSendDto, file?: Express.Multer.File) {
        if (!data.comment && !data.text && !file) {
            throw new HttpException('Вы не отправили данные о вашем прайс-листе', HttpStatus.BAD_REQUEST)
        }
        try {
            await this.mailService.sendPriceList(data, file)
        } catch (error) {
            console.log(error);
            throw new HttpException('Произошла ошибка, повторите попытку', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async getPriceListFilesName() {
        const p = path.join(__dirname, 'files')
        if (!fs.existsSync(p)) return []

        return fs.readdirSync(p)
    }

    async getPrices(data: PriceListGetDto) {
        const p = path.join(__dirname, 'files')

        const files: {path: string, filename: string}[] = data.list.map(file => {
            if ( fs.existsSync(path.join(p, file)) ) {
                return {path: path.join(p, file), filename: file}
            }
        })

        if ( (!files.length) || (files.length === 1 && !files[0]) ) {
            throw new HttpException('Файлы не найдены', HttpStatus.BAD_REQUEST)
        }

        try {
            await this.mailService.getPriceListFiles(data, files)
        } catch (error) {
            console.log(error);
            throw new HttpException('Произошла ошибка, повторите попытку', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}
