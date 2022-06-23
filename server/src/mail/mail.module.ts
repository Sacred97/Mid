import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './mail.controller';

@Module({
  imports: [MailerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => ({
      transport: {
        host: configService.get('EMAIL_SERVICE'),
        port: 465,
        secure: true,
        auth: {
          user: configService.get('EMAIL_USER'),
          pass: configService.get('EMAIL_PASSWORD')
        }
      },
      defaults: {
        from: `"No Reply Midkam.ru" ${configService.get('MAIL_FROM')}`,
      },
      template: {
        dir: __dirname + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  })],
  exports: [MailService],
  providers: [MailService],
  controllers: [MailController]
})
export class MailModule {}
