import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { TrainingsController } from './trainings.controller';
import { TrainingsService } from './trainings.service';
import { trainingsEnvValidateConfig } from '../assets/validate/trainings-env-config.validate';
import { TrainingsRepositoryModule } from './trainings-repository/trainings-repository.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [resolve('./', 'apps', 'trainings', 'env', 'development.env')],
      validate: trainingsEnvValidateConfig,
    }),
    TrainingsRepositoryModule,
  ],
  controllers: [TrainingsController],
  providers: [TrainingsService],
})
export class TrainingsModule {}
