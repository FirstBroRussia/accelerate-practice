import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';


import { CoachCreateUserDto, StudentCreateUserDto } from '@fitfriends-backend/shared-types';

import { FileInterceptor } from '@nestjs/platform-express';
import { BffService } from './bff.service';
import { ConfigService } from '@nestjs/config';
import { BffMicroserviceEnvInterface } from '../assets/interface/bff-microservice-env.interface';
import { AvatarImageMulterInterceptor } from '../assets/multer/avatar-image-multer.interceptor';
import { Request } from 'express';


@Controller('')
export class BffController {
  constructor(
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly bffService: BffService,
    ) { }

  @Post('/register')
  @UseInterceptors(new AvatarImageMulterInterceptor('avatar', new ConfigService))
  public async register(@Req() req: Request & { files: any }, @Body() dto: StudentCreateUserDto | CoachCreateUserDto) {
    console.log(req.files);

    return this.bffService.getData();
  }
}
