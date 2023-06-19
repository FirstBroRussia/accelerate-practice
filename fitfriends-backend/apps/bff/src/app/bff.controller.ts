import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';


import { CoachCreateUserDto, StudentCreateUserDto } from '@fitfriends-backend/shared-types';

import { BffService } from './bff.service';
import { ConfigService } from '@nestjs/config';
import { BffMicroserviceEnvInterface } from '../assets/interface/bff-microservice-env.interface';
import { CreateUserUploadFilesInterceptor } from '../assets/multer/create-user-upload-files.interceptor';
import { Request } from 'express';


@Controller('')
export class BffController {
  constructor(
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly bffService: BffService,
    ) { }

  @Post('/register')
  @UseInterceptors(new CreateUserUploadFilesInterceptor([
    {
      fieldName: 'avatar',
      count: 1,
      limits: {
        extension: /^(jpg|png|jpeg)$/,
        fileSize: 1 * 1024 * 1024, // В мегабайтах
      },
    },
    {
      fieldName: 'certificates',
      count: 1,
      limits: {
        extension: /^pdf$/,
      },
    },
  ], new ConfigService))
  public async register(@Req() req: Request & { files: any }, @Body() dto: StudentCreateUserDto | CoachCreateUserDto) {
    console.log(req.files);

    return this.bffService.getData();
  }
}
