import {HttpModule, MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from '../users/users.module';
import {LocalStrategy} from './strategy/local.strategy';
import {PassportModule} from '@nestjs/passport';
import {ConfigModule} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {JwtAuthStrategy} from './strategy/jwt-auth.strategy';
import {JwtRefreshStrategy} from './strategy/jwt-refresh.strategy';
import {RefreshMiddleware} from './refresh.middleware';
import {MailModule} from '../mail/mail.module';

@Module({
  imports: [ HttpModule, UsersModule, PassportModule, ConfigModule, JwtModule.register({}),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAuthStrategy, JwtRefreshStrategy]
})
export class AuthModule implements NestModule{
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(RefreshMiddleware)
      .forRoutes(
          'auth/email/change', 'auth/logout', 'auth/admin',
          'users',
          'news-letter',
          'one-c',
          'key-words',
          'auto-parts',
          'auto-applicability',
          'manufacturer',
          'certificate',
          'country',
          'region',
          'category',
          'product-group',
          'details'
      )
  }
}
