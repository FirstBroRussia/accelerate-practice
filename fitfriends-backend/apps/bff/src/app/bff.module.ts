import { resolve } from 'path';

import { Module } from '@nestjs/common';

import { BffController } from './bff.controller';
import { BffService } from './bff.service';
import { ConfigModule } from '@nestjs/config';
import { bffEnvValidateConfig } from '../assets/validate/bff-env-config.validate';
import { UsersMicroserviceClientModule } from './users-microservice-client/users-microservice-client.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [resolve('./', 'apps', 'bff', 'env', 'development.env')],
      validate: bffEnvValidateConfig,
    }),
    UsersMicroserviceClientModule,
  ],
  controllers: [BffController],
  providers: [BffService],
})
export class BffModule {}
