import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser'
import { ConfigService } from '@nestjs/config';
import * as express from 'express'
import { runInCluster } from './utils/runInCluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: { credentials: true, origin: true}});
  app.use(cookieParser())
  // app.use(bodyParser.urlencoded({limit: '2048MB', extended: true}))
  // app.use(bodyParser.json({limit: '2048MB'}))
  app.use(express.urlencoded({extended: true, limit: '2048mb'}))
  app.use(express.json({limit: '2048mb'}))
  app.useGlobalPipes(new ValidationPipe({transform: true}))
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  app.setGlobalPrefix('midkam_api')

  const configService = app.get(ConfigService)

  await app.listen(process.env.PORT || 3000);
}
runInCluster(bootstrap)
