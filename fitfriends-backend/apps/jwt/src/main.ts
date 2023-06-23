/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { JwtModule } from './app/jwt.module';
import { ConfigService } from '@nestjs/config';
import { JwtMicroserviceEnvInterface } from './assets/interface/jwt-microservice-env.interface';

import { AllExceptionsFilter } from '@fitfriends-backend/shared-types';


async function bootstrap() {
  const app = await NestFactory.create(JwtModule);

  const config = app.get(ConfigService<JwtMicroserviceEnvInterface>);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  const port = config.get('PORT') || 3000;
  const host = config.get('HOST') || '127.0.0.1';


  await app.listen(port, host);
  Logger.log(
    `🚀 Jwt microservice is running on: http://localhost:${port}/`
  );
}

bootstrap();
