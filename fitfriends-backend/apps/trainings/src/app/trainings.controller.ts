import { Body, Controller, Get, Logger, Param, Patch, Post, Query } from '@nestjs/common';

import { TrainingsService } from './trainings.service';
import { CreateTrainingDto, MongoIdValidationPipe, UpdateTrainingDto } from '@fitfriends-backend/shared-types';


@Controller()
export class TrainingsController {
  private readonly logger = new Logger(TrainingsController.name);

  constructor(private readonly trainingsService: TrainingsService) { }

  @Post('/:creatorUserId')
  public async createTraining(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Body() dto: CreateTrainingDto) {
    return this.trainingsService.getData();
  }

  @Get('/:trainingId')
  public async getTraining(@Param('trainingId', MongoIdValidationPipe) trainingId: string) {
    return this.trainingsService.getData();
  }

  @Patch('/:trainingId')
  public async updateTraining(@Param('trainingId', MongoIdValidationPipe) trainingId: string, @Body() dto: UpdateTrainingDto) {
    return this.trainingsService.getData();
  }

  @Get('/')
  public async getTrainingList(@Query() query: any) {
    return this.trainingsService.getData();

  }

}
