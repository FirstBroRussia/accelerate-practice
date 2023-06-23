import { resolve } from 'path';

import { Module } from '@nestjs/common';

import { BffController } from './bff.controller';
import { BffService } from './bff.service';
import { ConfigModule } from '@nestjs/config';
import { bffEnvValidateConfig } from '../assets/validate/bff-env-config.validate';
import { CreateUserInterceptor } from '../assets/interceptor/create-user.interceptor';
import { JwtMicroserviceClientModule } from './microservice-client/jwt-microservice-client/jwt-microservice-client.module';
import { UsersToBffController } from './controller/users/users-to-bff.controller';
import { UsersMicroserviceClientModule } from './microservice-client/users-microservice-client/users-microservice-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [resolve('./', 'apps', 'bff', 'env', 'development.env')],
      validate: bffEnvValidateConfig,
    }),
    UsersMicroserviceClientModule,
    JwtMicroserviceClientModule,
  ],
  controllers: [BffController, UsersToBffController],
  providers: [BffService, CreateUserInterceptor],
})
export class BffModule {}
