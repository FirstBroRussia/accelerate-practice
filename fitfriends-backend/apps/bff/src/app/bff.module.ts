import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { BffController } from './bff.controller';
import { BffService } from './bff.service';
import { bffEnvValidateConfig } from '../assets/validate/bff-env-config.validate';
import { CreateUserInterceptor } from '../assets/interceptor/create-user.interceptor';
import { JwtMicroserviceClientModule } from './microservice-client/jwt-microservice-client/jwt-microservice-client.module';
import { UsersToBffController } from './controller/users-to-bff.controller';
import { UsersMicroserviceClientModule } from './microservice-client/users-microservice-client/users-microservice-client.module';
import { TrainingsMicroserviceClientModule } from './microservice-client/trainings-microservice-client/trainings-microservice-client.module';
import { CabinetToBffController } from './controller/cabinet-to-bff.controller';
import { OrdersMicroserviceClientModule } from './microservice-client/orders-microservice-client/orders-microservice-client.module';

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
    TrainingsMicroserviceClientModule,
    OrdersMicroserviceClientModule,
  ],
  controllers: [BffController, UsersToBffController, CabinetToBffController],
  providers: [BffService, CreateUserInterceptor],
})
export class BffModule {}
