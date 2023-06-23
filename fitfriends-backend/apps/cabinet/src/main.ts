/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { CabinetModule } from './app/cabinet.module';
import { ConfigService } from '@nestjs/config';
import { CabinetMicroserviceEnvInterface } from './assets/interface/cabinet-microservice-env.interface';

import { AllExceptionsFilter } from '@fitfriends-backend/shared-types';

async function bootstrap() {
  const app = await NestFactory.create(CabinetModule);

  const config = app.get(ConfigService<CabinetMicroserviceEnvInterface>);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const port = config.get('PORT') || 3000;
  const host = config.get('HOST') || '127.0.0.1';

  await app.listen(port, host);
  Logger.log(
    `🚀 Cabinet microservice is running on: http://${host}:${port}/`
  );
}

bootstrap();
