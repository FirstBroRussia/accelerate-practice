/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */


import express from 'express';

import { resolve } from 'path';

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { BffModule } from './app/bff.module';
import { ConfigService } from '@nestjs/config';
import { BffMicroserviceEnvInterface } from './assets/interface/bff-microservice-env.interface';
import { AllExceptionsFilter, BffMicroserviceConstant } from '@fitfriends-backend/shared-types';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BffModule);

  const config = app.get(ConfigService<BffMicroserviceEnvInterface>);
  const httpAdapter = app.get(HttpAdapterHost);

  app.use('/uploads', express.static(resolve('./', `${config.get('UPLOAD_FILES_DIR')}`)));

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  const port = config.get('PORT') || 3000;
  const host = config.get('HOST') || '127.0.0.1';

  await Promise.all([app.startAllMicroservices(), app.listen(port, host)]);

  Logger.log(
    `🚀 BFF microservice is running on: http://${host}:${port}/`
  );
}

bootstrap();
