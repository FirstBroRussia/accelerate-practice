/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { TrainingsModule } from './app/trainings.module';

import { AllExceptionsFilter } from '@fitfriends-backend/shared-types';
import { ConfigService } from '@nestjs/config';
import { TrainingsMicroserviceEnvInterface } from './assets/interface/trainings-microservice-env.interface';


async function bootstrap() {
  const app = await NestFactory.create(TrainingsModule);


  const config = app.get(ConfigService<TrainingsMicroserviceEnvInterface>);
  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const port = config.get('PORT') || 3000;
  const host = config.get('HOST') || '127.0.0.1';

  await app.listen(port, host);
  Logger.log(
    `🚀 Trainings microservice is running on: http://${host}:${port}/`
  );
}

bootstrap();
