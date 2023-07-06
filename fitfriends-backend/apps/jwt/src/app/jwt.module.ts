import { resolve } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { JwtController } from './jwt.controller';
import { JwtService } from './jwt.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { jwtEnvValidateConfig } from '../assets/validate/jwt-env-config.validate';
import { JwtRepositoryModule } from './jwt-repository/jwt-repository.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [resolve('./', 'apps', 'jwt', 'env', 'development.env')],
      validate: jwtEnvValidateConfig,
    }),
    JwtRepositoryModule,
  ],
  controllers: [JwtController],
  providers: [JwtService],
})
export class JwtModule {}
