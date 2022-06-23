import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import * as Joi from '@hapi/joi';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { DetailsModule } from './details/details.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulingModule } from './schedule/scheduling.module';
import { PriceListModule } from './price-list/price-list.module';
import { GuestModule } from './guest/guest.module';
import { OneCModule } from './one-c/one-c.module';
import { NewsLetterModule } from './news-letter/news-letter.module';
import { RegionModule } from './manufacturer/region/region.module';
import { CountryModule } from './manufacturer/country/country.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { ProductGroupModule } from './category/product-group/product-group.module';
import { CategoryModule } from './category/category.module';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { KeyWordsModule } from './key-words/key-words.module';
import { AutoPartsModule } from './auto-parts/auto-parts.module';
import { AutoApplicabilityModule } from './auto-applicability/auto-applicability.module';
import { BannersModule } from './banners/banners.module';
import { UsCertificateModule } from './us-certificate/us-certificate.module';
import { PresentationModule } from './presentation/presentation.module';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      PORT: Joi.number().required(),
      DB_HOST: Joi.string().required(),
      DB_PORTDB_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      PGADMIN_DEFAULT_EMAIL: Joi.string().required(),
      PGADMIN_DEFAULT_PASSWORD: Joi.string().required(),
      JWT_SECRET_KEY: Joi.string().required(),
      JWT_EXPIRATION_TIME: Joi.string().required(),
      JWT_REFRESH_SECRET_KEY: Joi.string().required(),
      JWT_REFRESH_EXPIRATION_TIME: Joi.string().required(),
      JWT_EMAIL_VERIFICATION_SECRET_KEY: Joi.string().required(),
      JWT_EMAIL_VERIFICATION_EXPIRATION_TIME: Joi.string().required(),
      JWT_RESTORE_SECRET_KEY: Joi.string().required(),
      JWT_RESTORE_EXPIRATION_TIME: Joi.string().required(),
      JWT_CHANGE_EMAIL_SECRET_KEY: Joi.string().required(),
      JWT_CHANGE_EMAIL_EXPIRATION_TIME: Joi.string().required(),
      REDIS_HOST: Joi.string().required(),
      REDIS_PORT: Joi.number().required(),
      EMAIL_SERVICE: Joi.string().required(),
      EMAIL_USER: Joi.string().required(),
      EMAIL_PASSWORD: Joi.string().required(),
      SELECTEL_REGION: Joi.string().required(),
      SELECTEL_ACCESS_KEY_ID: Joi.string().required(),
      SELECTEL_SECTET_KEY: Joi.string().required(),
      SELECTEL_BUSKET_NAME: Joi.string().required()
    })
  }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    FilesModule,
    DetailsModule,
    MailModule,
    ScheduleModule.forRoot(),
    SchedulingModule,
    PriceListModule,
    GuestModule,
    OneCModule,
    NewsLetterModule,
    RegionModule,
    CountryModule,
    ManufacturerModule,
    ProductGroupModule,
    CategoryModule,
    RedisCacheModule,
    KeyWordsModule,
    AutoPartsModule,
    AutoApplicabilityModule,
    BannersModule,
    UsCertificateModule,
    PresentationModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

