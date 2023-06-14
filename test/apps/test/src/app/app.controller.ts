import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

import { Aaa } from '@test/shared-type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    console.log(Aaa.AAA);

  }

  @Get()
  getData() {
    return this.appService.getData();
  }
}
