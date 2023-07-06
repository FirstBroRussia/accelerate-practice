import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { NotifyController } from './notify.controller';
import { NotifyService } from './notify.service';
import { notifyEnvValidateConfig } from '../assets/validate/comments-env-config.validate';
import { NotifyRepositoryModule } from './notify-repository/notify-repository.module';
import { NodemailerModule } from './nodemailer/nodemailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [resolve('./', 'apps', 'notify', 'env', 'development.env')],
      validate: notifyEnvValidateConfig,
    }),
    NotifyRepositoryModule,
    NodemailerModule,
  ],
  controllers: [NotifyController],
  providers: [NotifyService],
})
export class NotifyModule {}
