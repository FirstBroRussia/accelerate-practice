import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';


import { GenderEnum } from '@fitfriends-backend-nx-monorepo/shared-types';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log(GenderEnum.Woman);
  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
