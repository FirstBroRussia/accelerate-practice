import { Injectable } from '@nestjs/common';

@Injectable()
export class TrainingsService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
