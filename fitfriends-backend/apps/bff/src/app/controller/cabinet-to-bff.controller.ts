import * as fs from 'fs';
import { join, resolve } from 'path';

import { Request, query } from 'express';

import { CreateCoachTrainingDto, JwtUserPayloadRdo, CoachTrainingRdo, TransformAndValidateDtoInterceptor, UserRoleEnum, MongoIdValidationPipe, UpdateCoachTrainingDto, FindCoachTrainingsQuery, TransformAndValidateQueryInterceptor, UpdateRatingCoachTrainingDto, GetFriendsListQuery, CreateOrderDto, StudentOrderInfoRdo, GetOrdersQuery, GetTrainingListByTrainingIdsDto, CoachOrderInfoRdo } from '@fitfriends-backend/shared-types';
import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, InternalServerErrorException, Logger, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheckAuthUserRoleGuard } from 'apps/bff/src/assets/guard/check-auth-user-role.guard';
import { JwtAuthGuard } from 'apps/bff/src/assets/guard/jwt-auth.guard';
import { CreateCoachTrainingInterceptor } from 'apps/bff/src/assets/interceptor/create-coach-training.interceptor';
import { BffMicroserviceEnvInterface } from 'apps/bff/src/assets/interface/bff-microservice-env.interface';
import { TrainingsMicroserviceClientService } from '../microservice-client/trainings-microservice-client/trainings-microservice-client.service';
import { fillRDO } from '@fitfriends-backend/core';
import { HttpStatusCode } from 'axios';
import { UsersMicroserviceClientService } from '../microservice-client/users-microservice-client/users-microservice-client.service';
import { OrdersMicroserviceClientService } from '../microservice-client/orders-microservice-client/orders-microservice-client.service';


@Controller('cabinet')
export class CabinetToBffController {
  private readonly logger = new Logger(CabinetToBffController.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly usersMicroserviceClient: UsersMicroserviceClientService,
    private readonly trainingsMicroserviceClient: TrainingsMicroserviceClientService,
    private readonly ordersMicroserviceClient: OrdersMicroserviceClientService,
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

    const result = await this.trainingsMicroserviceClient.getTrainingListByCreatorUserId(creatorUserId, query);


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

  // FRIENDS


  @Get('friends/addfriend/:friendUserId')
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(JwtAuthGuard)
  public async addFriend(@Param('friendUserId', MongoIdValidationPipe) friendUserId: string, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<void> {
    const creatorUserId = req.user.sub;

    await this.usersMicroserviceClient.addFriend(friendUserId, creatorUserId);
  }

  @Get('friends/removefriend/:friendUserId')
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(JwtAuthGuard)
  public async removeFriend(@Param('friendUserId', MongoIdValidationPipe) friendUserId: string, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<void> {
    const creatorUserId = req.user.sub;

    await this.usersMicroserviceClient.removeFriend(friendUserId, creatorUserId);
  }

  @Get('friends/list')
  @UseInterceptors(new TransformAndValidateQueryInterceptor(GetFriendsListQuery))
  @UseGuards(JwtAuthGuard)
  // public async getFriendsList(@Req() req: Request & { user: JwtUserPayloadRdo }): Promise<StudentUserRdo | CoachUserRdo> {
  public async getFriendsList(@Query() query: GetFriendsListQuery, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<any> {
    const creatorUserId = req.user.sub;

    const friendsUserList = await this.usersMicroserviceClient.getFriendsList(creatorUserId, query);

    console.log(friendsUserList);

    // Тут еще нужно получить данные о совместных/персональных тренировках и присоединить их к соответствующим пользователям

  }

  // --------------------------

  // ORDERS

  @Post('orders')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateOrderDto))
  @UseGuards(JwtAuthGuard)
  public async createOrder(@Body() dto: CreateOrderDto, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<StudentOrderInfoRdo> {
    if (req.user.role === 'Coach') {
      throw new ForbiddenException('Доступ запрещен. Пользователь с ролью "Тренер" не имеет права делать заказ.');
    }

    const creatorUserId = req.user.sub;

    const { productId, productPrice, quantity, orderAmount } = dto;

    const { price, coachCreator } = await this.trainingsMicroserviceClient.getTrainingById(productId);

    if (productPrice !== price) {
      throw new BadRequestException('Указана неверная сумма стоимости продукта.');
    }

    if (productPrice * quantity !== orderAmount) {
      throw new BadRequestException('Указана некорректная общая сумма заказа.');
    }


    const result = await this.ordersMicroserviceClient.createOrder(creatorUserId, coachCreator, dto);


    return fillRDO(StudentOrderInfoRdo, result);
  }

  @Get('orders')
  @UseInterceptors(new TransformAndValidateQueryInterceptor(GetOrdersQuery))
  @UseGuards(JwtAuthGuard)
  public async getOrders(@Req() req: Request & { user: JwtUserPayloadRdo }, @Query() query: GetOrdersQuery): Promise<(StudentOrderInfoRdo | CoachOrderInfoRdo)[]> {
    const { sub, role } = req.user;

    query['role'] = role;

    const result = await this.ordersMicroserviceClient.getOrders(sub, query);

    const getTrainingListByTrainingIdsDto: GetTrainingListByTrainingIdsDto = {
      ids: [],
    };

    result.forEach(item => {
      getTrainingListByTrainingIdsDto?.['ids'].push(item.productId);
    });

    const trainingsList = await this.trainingsMicroserviceClient.getTrainingListByTrainingIds(getTrainingListByTrainingIdsDto);

    result.map(item => {
      for (const trainingItem of trainingsList) {
        if (item.productId !== trainingItem.id) {
          continue;
        }

        item['product'] = trainingItem;

        break;
      }

      return item;
    });

    const rdo = role === 'Student' ? fillRDO(StudentOrderInfoRdo, result) : fillRDO(CoachOrderInfoRdo, result);


    return rdo as unknown as (StudentOrderInfoRdo | CoachOrderInfoRdo)[];
  }

}
