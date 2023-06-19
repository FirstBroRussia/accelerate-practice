import { resolve } from 'path';

import { Module } from '@nestjs/common';

import { BffController } from './bff.controller';
import { BffService } from './bff.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { bffEnvValidateConfig } from '../assets/validate/bff-env-config.validate';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BffMicroserviceEnvInterface } from '../assets/interface/bff-microservice-env.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: [
        resolve('./', 'apps', 'bff', 'env', 'development.env'),
      ],
      validate: bffEnvValidateConfig,
    }),
    ServeStaticModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<BffMicroserviceEnvInterface>) => ([
        {
          rootPath: resolve('./', `${config.get('UPLOAD_FILES_DIR')}`),
          serveRoot: '/upload',
        },
      ]),
    }),
  ],
  controllers: [BffController],
  providers: [BffService],
})
export class BffModule {}
