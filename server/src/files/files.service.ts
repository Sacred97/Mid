import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {S3} from 'aws-sdk'
import * as fs from 'fs'

@Injectable()
export class FilesService {

  constructor(private readonly configService: ConfigService) {
  }

  async uploadDetailPhoto(directory: string, dataBuffer: Buffer, fileName: string, objectId:string) {
    const s3 = new S3()
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Body: dataBuffer,
      Key: `${directory}/${objectId}/${fileName}`,
      ACL: "public-read-write"
    }).promise()
    return uploadResult
  }

  async deleteDetailPhoto(keyFile: string) {
    const s3 = new S3()
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: keyFile,
    }).promise().catch((error) => {
      throw new HttpException(error.JSON.stringify(), HttpStatus.FORBIDDEN)
    })
  }

  async getFile(buffer: Buffer) {

    const pathFile: string = __dirname + '/document/price.xlsx'
    const pathDir: string = __dirname + '/document'

    const isAvailable: boolean = fs.existsSync(pathFile)

    if (isAvailable) {
      fs.rmSync(pathDir)
    }

    fs.mkdirSync(pathDir)

    fs.writeFile(pathFile, buffer, (error) => {
      if (error) {
        console.log(error)
        throw error
      }
      console.log('Файл успешно сохранен')
    })

  }


}
