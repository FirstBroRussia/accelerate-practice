import { Controller, Get } from '@nestjs/common';

import { CabinetService } from './cabinet.service';


@Controller()
export class CabinetController {
  constructor(private readonly cabinetService: CabinetService) {}

  @Get()
  getData() {
    return this.cabinetService.getData();
  }
}
