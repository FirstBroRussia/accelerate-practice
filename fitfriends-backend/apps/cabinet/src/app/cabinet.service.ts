import { Injectable } from '@nestjs/common';


@Injectable()
export class CabinetService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
