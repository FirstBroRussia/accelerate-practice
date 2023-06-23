import { Module } from '@nestjs/common';
import { CoachCabinetRepositoryService } from './coach-cabinet-repository.service';

@Module({
  providers: [CoachCabinetRepositoryService],
})
export class CoachCabinetRepositoryModule {}
