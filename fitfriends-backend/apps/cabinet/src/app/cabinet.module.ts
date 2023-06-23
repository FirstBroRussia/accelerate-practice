import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CabinetController } from './cabinet.controller';
import { CabinetService } from './cabinet.service';
import { StudentCabinetRepositoryModule } from './student-cabinet-repository/student-cabinet-repository.module';
import { CoachCabinetRepositoryModule } from './coach-cabinet-repository/coach-cabinet-repository.module';
import { resolve } from 'path';
import { cabinetEnvValidateConfig } from '../assets/validate/bff-env-config.validate';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [resolve('./', 'apps', 'cabinet', 'env', 'development.env')],
      validate: cabinetEnvValidateConfig,
    }),
    StudentCabinetRepositoryModule,
    CoachCabinetRepositoryModule],
  controllers: [CabinetController],
  providers: [CabinetService],
})
export class CabinetModule {}
