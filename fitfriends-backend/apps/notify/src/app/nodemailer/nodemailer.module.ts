import { Module } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { NotifyMicroserviceEnvInterface } from '../../assets/interface/notify-microservice-env.interface';


@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<NotifyMicroserviceEnvInterface>) => ({
        transport: {
          host: config.get<string>("MAIL_SMTP_HOST"),
          port: config.get<number>("MAIL_SMTP_PORT"),
          ignoreTLS: true,
          secure: false,
        },
        defaults: {
          from: config.get<string>("MAIL_FROM"),
        },
      }),
    }),
  ],
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
