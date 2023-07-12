import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('DB_HOST'),
      port: configService.get('DB_PORTDB_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
      //ssl: {rejectUnauthorized: false},
      entities: [
        __dirname + '/../**/*.entity{.ts,.js}'
      ],
      synchronize: true,
      // retryAttempts: 10000, Может поможет от отвалов сервера
      // keepConnectionAlive: true, Может поможет от отвалов сервера
    })
  })]
})
export class DatabaseModule {}
