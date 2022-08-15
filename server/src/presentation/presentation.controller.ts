import {Controller, Get, Query, Res} from '@nestjs/common';
import {PresentationService} from "./presentation.service";
import {Response} from 'express'
import {createReadStream} from "fs";
import * as path from 'path'

@Controller('presentation')
export class PresentationController {

    constructor(private readonly presentationService: PresentationService) {
    }

    @Get('files')
    getFilesName() {
        return this.presentationService.returnFileName()
    }

    @Get('download')
    returnFile(@Res() response: Response, @Query('fileName') fileName: string) {
        const contentType = this.presentationService.contentTypeOfFile(fileName)
        const file = createReadStream(path.join(__dirname, 'files', fileName))
        const dispositionValue = 'attachment; filename=' + fileName
        response.setHeader('Content-Disposition', dispositionValue)
        response.setHeader('Content-Type', contentType)

        file.pipe(response)
    }

}
