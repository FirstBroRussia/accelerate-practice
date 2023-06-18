import { resolve } from 'path';

import { Module } from '@nestjs/common';

import { UsersRepositoryModule } from './users-repository/users-repository.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { ConfigModule } from '@nestjs/config';
import { usersEnvValidateConfig } from '../assets/validate/users-env-config.validate';


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
