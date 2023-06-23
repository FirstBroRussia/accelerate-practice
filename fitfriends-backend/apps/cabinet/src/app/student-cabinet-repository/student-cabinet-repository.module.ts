import { Module } from '@nestjs/common';
import { StudentCabinetRepositoryService } from './student-cabinet-repository.service';

@Module({
  providers: [StudentCabinetRepositoryService],
})
export class StudentCabinetRepositoryModule {}
