import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config';
import * as express from 'express'
import { runInCluster } from './utils/runInCluster';
import * as fs from 'fs'
import * as path from 'path'

async function bootstrap() {
  const ssl = fs.readFileSync(path.join(__dirname, 'ssl', 'midkam.pro.crt'))
  const sslKey = fs.readFileSync(path.join(__dirname, 'ssl', 'midkam.pro.key'))
  const app = await NestFactory.create(AppModule, {
    cors: { credentials: true, origin: true},
    httpsOptions: {cert: ssl, key: sslKey}
  });
  app.use(cookieParser())
  app.use(express.urlencoded({extended: true, limit: '2048mb'}))
  app.use(express.json({limit: '2048mb'}))
  app.useGlobalPipes(new ValidationPipe({transform: true}))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.setGlobalPrefix('midkam_api')

  const configService = app.get(ConfigService)

  await app.listen(process.env.PORT || 3000);
}
runInCluster(bootstrap)
