import * as fs from 'fs';
import { join, resolve } from 'path';

import { Request } from 'express';

import { CreateCoachTrainingDto, JwtUserPayloadRdo, CoachTrainingRdo, TransformAndValidateDtoInterceptor, UserRoleEnum, MongoIdValidationPipe, UpdateCoachTrainingDto, FindCoachTrainingsQuery, TransformAndValidateQueryInterceptor, UpdateRatingCoachTrainingDto } from '@fitfriends-backend/shared-types';
import { Body, Controller, Get, HttpCode, Logger, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckAuthUserRoleGuard } from 'apps/bff/src/assets/guard/check-auth-user-role.guard';
import { JwtAuthGuard } from 'apps/bff/src/assets/guard/jwt-auth.guard';
import { CreateCoachTrainingInterceptor } from 'apps/bff/src/assets/interceptor/create-coach-training.interceptor';
import { BffMicroserviceEnvInterface } from 'apps/bff/src/assets/interface/bff-microservice-env.interface';
import { TrainingsMicroserviceClientService } from '../microservice-client/trainings-microservice-client/trainings-microservice-client.service';
import { fillRDO } from '@fitfriends-backend/core';
import { HttpStatusCode } from 'axios';


@Controller('cabinet')
export class CabinetToBffController {
  private readonly logger = new Logger(CabinetToBffController.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly trainingsMicroserviceClient: TrainingsMicroserviceClientService,
  ) { }


  // TRAININGS

  @Post('trainings')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateCoachTrainingDto))
  @UseInterceptors(new CreateCoachTrainingInterceptor([
    {
      fieldName: 'videoOfTraining',
      count: 1,
      limits: {
        extension: /^(mov|avi|mp4|qt)$/,
      },
    },
  ], new ConfigService))
  @UseGuards(new CheckAuthUserRoleGuard(UserRoleEnum.Coach))
  @UseGuards(JwtAuthGuard)
  public async createCoachTraining(@Req() req: Request & { user: JwtUserPayloadRdo }, @Body() dto: CreateCoachTrainingDto): Promise<CoachTrainingRdo> {
    const creatorUserId = req.user.sub;

    const result = await this.trainingsMicroserviceClient.createTraining(creatorUserId, dto);


    return fillRDO(CoachTrainingRdo, result);
  }

  @Get('trainings/:trainingId')
  @UseGuards(JwtAuthGuard)
  public async getTrainingById(@Param('trainingId', MongoIdValidationPipe) trainingId: string): Promise<CoachTrainingRdo> {
    const result = await this.trainingsMicroserviceClient.getTrainingById(trainingId);


    return fillRDO(CoachTrainingRdo, result);
  }

  @Patch('trainings/:trainingId/')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(UpdateCoachTrainingDto, {
    isControllerUpdateMethod: true,
  }))
  @UseInterceptors(new CreateCoachTrainingInterceptor([
    {
      fieldName: 'videoOfTraining',
      count: 1,
      limits: {
        extension: /^(mov|avi|mp4|qt)$/,
      },
    },
  ], new ConfigService))
  @UseGuards(new CheckAuthUserRoleGuard(UserRoleEnum.Coach))
  @UseGuards(JwtAuthGuard)
  public async updateTrainingById(@Param('trainingId', MongoIdValidationPipe) trainingId: string, @Body() dto: UpdateCoachTrainingDto, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<any> {
    let oldVideoOfTrainigPath = null;

    if (dto.videoOfTraining) {
      const { videoOfTraining } = await this.trainingsMicroserviceClient.getTrainingById(trainingId);

      oldVideoOfTrainigPath = videoOfTraining;
    }

    const creatorUserId = req.user.sub;

    const result = await this.trainingsMicroserviceClient.updateTraining(trainingId, creatorUserId, dto);

    if (oldVideoOfTrainigPath) {
      fs.rm(resolve(resolve(join('./', oldVideoOfTrainigPath))), (err) => {
        if (err) {
          this.logger.error(err);
        }
      });
    }


    return fillRDO(CoachTrainingRdo, result);
  }

  @Get('trainings')
  @UseInterceptors(new TransformAndValidateQueryInterceptor(FindCoachTrainingsQuery))
  @UseGuards(new CheckAuthUserRoleGuard(UserRoleEnum.Coach))
  @UseGuards(JwtAuthGuard)
  public async getTrainingsList(@Query() query: FindCoachTrainingsQuery, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<CoachTrainingRdo[]> {
    const creatorUserId = req.user.sub;

    const result = await this.trainingsMicroserviceClient.getTrainingList(creatorUserId, query);


    return fillRDO(CoachTrainingRdo, result) as unknown as CoachTrainingRdo[];
  }

  @Post('updaterating/:trainingId')
  @HttpCode(HttpStatusCode.Ok)
  @UseInterceptors(new TransformAndValidateDtoInterceptor(UpdateRatingCoachTrainingDto))
  @UseGuards(new CheckAuthUserRoleGuard(UserRoleEnum.Coach))
  @UseGuards(JwtAuthGuard)
  public async updateRating(@Param('trainingId', MongoIdValidationPipe) trainingId: string, @Body() dto: UpdateRatingCoachTrainingDto, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<void> {
    const creatorUserId = req.user.sub;

    await this.trainingsMicroserviceClient.updateRating(trainingId, creatorUserId, dto);
  }

  // ---------------------------



}
