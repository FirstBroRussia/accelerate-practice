import { resolve } from 'path';

import { Module } from '@nestjs/common';

import { UsersRepositoryModule } from './users-repository/users-repository.module';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { usersEnvValidateConfig } from '../assets/validate/users-env-config.validate';
import { UsersService } from './users.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        resolve('./', 'apps', 'users', 'env', 'development.env'),
      ],
      validate: usersEnvValidateConfig,
    }),
    UsersRepositoryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class AppModule {}
