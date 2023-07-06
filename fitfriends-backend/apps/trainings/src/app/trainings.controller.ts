import { Body, Controller, Get, Logger, Param, Patch, Post, UseInterceptors } from '@nestjs/common';

import { TrainingsService } from './trainings.service';
import { CoachTrainingRdo, CreateCoachTrainingDto, FindCoachTrainingsQuery, GetTrainingListByTrainingIdsDto, MongoIdValidationPipe, TransformAndValidateDtoInterceptor, UpdateCoachTrainingDto, UpdateRatingCoachTrainingDto } from '@fitfriends-backend/shared-types';
import { fillRDO } from '@fitfriends-backend/core';


@Controller('trainings')
export class TrainingsController {
  private readonly logger = new Logger(TrainingsController.name);

  constructor(
    private readonly trainingsService: TrainingsService,
    ) { }


  @Post('/:creatorUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateCoachTrainingDto))
  public async createTraining(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Body() dto: CreateCoachTrainingDto): Promise<CoachTrainingRdo> {
    const result = await this.trainingsService.createCoachTraining(creatorUserId, dto);


    return fillRDO(CoachTrainingRdo, result);
  }

  @Get('/:trainingId')
  public async getTraining(@Param('trainingId', MongoIdValidationPipe) trainingId: string): Promise<CoachTrainingRdo> {
    const result = await this.trainingsService.getTrainingById(trainingId);


    return fillRDO(CoachTrainingRdo, result);
  }

  @Patch('/:trainingId/:creatorUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(UpdateCoachTrainingDto, {
    isControllerUpdateMethod: true,
  }))
  public async updateTraining(@Param('trainingId', MongoIdValidationPipe) trainingId: string, @Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Body() dto: UpdateCoachTrainingDto) {
    const result = await this.trainingsService.updateTrainingById(trainingId, creatorUserId, dto);


    return fillRDO(CoachTrainingRdo, result);
  }

  @Post('/list/trainingsids')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(GetTrainingListByTrainingIdsDto))
  public async getTrainingListByTrainingIds(@Body() dto: GetTrainingListByTrainingIdsDto): Promise<any> {
    const { ids } = dto;

    const result = await this.trainingsService.getTrainingListByTrainingIds(ids);


    return fillRDO(CoachTrainingRdo, result) as unknown as CoachTrainingRdo[];
  }

  @Post('/list/:creatorUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(FindCoachTrainingsQuery, {
    isQueryDto: true,
  }))
  public async getTrainingListByCreatorUserId(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Body() dto: FindCoachTrainingsQuery): Promise<CoachTrainingRdo[]> {
    const result = await this.trainingsService.getTrainingListByCreatorId(creatorUserId, dto);


    return fillRDO(CoachTrainingRdo, result) as unknown as CoachTrainingRdo[];
  }

  @Post('updaterating/:trainingId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(UpdateRatingCoachTrainingDto))
  public async updateRating(@Param('trainingId', MongoIdValidationPipe) trainingId: string, @Body() dto: UpdateRatingCoachTrainingDto): Promise<void> {
    await this.trainingsService.updateRatingById(trainingId, dto);
  }

}
