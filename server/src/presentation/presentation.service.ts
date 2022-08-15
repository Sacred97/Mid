import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class PresentationService {

    constructor() {
    }

    checkFolder(folderName: string): boolean {
        const p = path.join(__dirname, folderName)
        try {
            return fs.existsSync(p)
        } catch (error) {
            console.log(error);
            return false
        }
    }

    createFolder(folderName: string) {
        const p = path.join(__dirname, folderName)
        try {
            fs.mkdirSync(p)
        } catch (error) {
            console.log(error);
        }
    }

    returnFileName() {
        const p = path.join(__dirname, 'files')
        if (!fs.existsSync(p)) return []
        return fs.readdirSync(p)
    }

    contentTypeOfFile(fileName: string) {
        const p = path.join(__dirname, 'files', fileName)
        if (!fs.existsSync(p)) throw new HttpException('Файл не найден', HttpStatus.NOT_FOUND)
        const extension = fileName.split('.')[1]
        let contentType: string = 'application/msword'
        switch (extension) {
            case 'pptx':
                contentType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                break;
            case 'pdf':
                contentType = 'application/pdf'
        }
        return contentType
    }





}
