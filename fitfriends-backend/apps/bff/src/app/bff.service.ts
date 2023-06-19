import { Injectable } from '@nestjs/common';

@Injectable()
export class BffService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
