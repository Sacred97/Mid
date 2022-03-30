import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {S3} from 'aws-sdk'
import * as fs from 'fs'

@Injectable()
export class FilesService {

  constructor(private readonly configService: ConfigService) {
  }

  // async uploadDetailPhoto(directory: string, dataBuffer: Buffer, fileName: string, objectId:string) {
  //   const s3 = new S3()
  //   const uploadResult = await s3.upload({
  //     Bucket: this.configService.get('AWS_BUCKET_NAME'),
  //     Body: dataBuffer,
  //     Key: `${directory}/${objectId}/${fileName}`,
  //     ACL: "public-read-write"
  //   }).promise()
  //   return uploadResult
  // }

  // async deleteDetailPhoto(keyFile: string) {
  //   const s3 = new S3()
  //   await s3.deleteObject({
  //     Bucket: this.configService.get('AWS_BUCKET_NAME'),
  //     Key: keyFile,
  //   }).promise().catch((error) => {
  //     throw new HttpException(error.JSON.stringify(), HttpStatus.FORBIDDEN)
  //   })
  // }

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

  //---------------Пробуем с Selectel компанией

  createS3(): S3 {
    return new S3({
      accessKeyId: this.configService.get('SELECTEL_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('SELECTEL_SECTET_KEY'),
      endpoint: "https://s3.storage.selcloud.ru",
      s3ForcePathStyle: true,
      region: this.configService.get('SELECTEL_REGION'),
      apiVersion: "latest"
    })
  }

  async uploadSelectel(buffer: Buffer, directory: string, objectId:string, fileName: string) {
    const s3 = this.createS3()
    return await s3.upload({
      Bucket: this.configService.get('SELECTEL_BUSKET_NAME'),
      Body: buffer,
      Key: `${directory}/${objectId}/${fileName}`
    }).promise().then(result => {
      let urlToArray = result.Location.split('/')
      urlToArray[2] = '706622.selcdn.ru'
      result.Location = urlToArray.join('/')
      return result
    })
  }

  async removeSelectel(key: string) {
    const s3 = this.createS3()
    await s3.deleteObject({
      Bucket: this.configService.get('SELECTEL_BUSKET_NAME'),
      Key: key,
    }).promise().catch((error) => {
      throw new HttpException(error.JSON.stringify(), HttpStatus.FORBIDDEN)
    })

  }

}
