import * as fs from 'fs';
import { join, resolve } from 'path';

import { Request } from 'express';

import { CreateCoachTrainingDto, JwtUserPayloadRdo, CoachTrainingRdo, TransformAndValidateDtoInterceptor, UserRoleEnum, MongoIdValidationPipe, UpdateCoachTrainingDto, FindCoachTrainingsQuery, TransformAndValidateQueryInterceptor, UpdateRatingCoachTrainingDto, GetFriendsListQuery, CreateOrderDto, StudentOrderInfoRdo, GetDocumentQuery, GetTrainingListByTrainingIdsDto, CoachOrderInfoRdo, RequestTrainingRdo, FriendUserInfoRdo, UpdateStatusRequestTrainingDto, BalanceRdo, CreateCommentDto, CreateCommentForCommentsMicroserviceDto, CommentRdo, NotifyMessageEnum, CreateNotifyForNotifyMicroservice, NotifyRdo } from '@fitfriends-backend/shared-types';
import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, Logger, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { CommentsMicroserviceClientService } from '../microservice-client/comments-microservice-client/comments-microservice-client.service';
import { NotifyMicroserviceClientService } from '../microservice-client/notify-microservice-client/notify-microservice-client.service';
import { RpcException } from '@nestjs/microservices';


@Controller('cabinet')
export class CabinetToBffController {
  private readonly logger = new Logger(CabinetToBffController.name);

  constructor (
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly usersMicroserviceClient: UsersMicroserviceClientService,
    private readonly trainingsMicroserviceClient: TrainingsMicroserviceClientService,
    private readonly ordersMicroserviceClient: OrdersMicroserviceClientService,
    private readonly commentsMicroserviceClient: CommentsMicroserviceClientService,
    private readonly notifyMicroserviceClient: NotifyMicroserviceClientService,
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

  // ---------------------------

  // FRIENDS


  @Get('friends/addfriend/:friendUserId')
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(JwtAuthGuard)
  public async addFriend(@Param('friendUserId', MongoIdValidationPipe) friendUserId: string, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<void> {
    const creatorUserId = req.user.sub;

    await this.usersMicroserviceClient.addFriend(friendUserId, creatorUserId);

    const friendUserInfo = await this.usersMicroserviceClient.getUserInfo(friendUserId);

    const dtoForNotifyMicroservice: CreateNotifyForNotifyMicroservice = {
      creatorUserId: creatorUserId,
      targetUserId: friendUserId,
      userEmail: friendUserInfo.email,
      message: NotifyMessageEnum.AddFriend,
    };

    this.notifyMicroserviceClient.addFriendEvent(dtoForNotifyMicroservice)
      .catch((err: RpcException) => {
        throw new BadRequestException(err.message);
      });
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
  public async getFriendsList(@Query() query: GetFriendsListQuery, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<FriendUserInfoRdo[]> {
    const creatorUserId = req.user.sub;

    const friendsUserList = await this.usersMicroserviceClient.getFriendsList(creatorUserId, query);


    return fillRDO(FriendUserInfoRdo, friendsUserList) as unknown as FriendUserInfoRdo[];
  }

  @Get('friends/requesttraining/create/:targetUserId')
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(JwtAuthGuard)
  public async createRequestTraining(@Param('targetUserId', MongoIdValidationPipe) targetUserId: string, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<void> {
    const { sub, role } = req.user;

    if (role === 'Coach') {
      throw new BadRequestException('Пользователь с ролью "Тренер" не может сам лично создавать заявки на персональные тренировки.');
    }

    const targetUserInfo = await this.usersMicroserviceClient.getUserInfo(targetUserId);

    const result = await this.usersMicroserviceClient.createRequestTraining(sub, targetUserId);

    if (targetUserInfo.role === 'Student') {
      const dtoForNotifyMicroservice: CreateNotifyForNotifyMicroservice = {
        creatorUserId: sub,
        targetUserId: targetUserId,
        userEmail: targetUserInfo.email,
        message: NotifyMessageEnum.RequestTrainingToStudentUser,
      };

      this.notifyMicroserviceClient.requestTrainingToStudentUserEvent(dtoForNotifyMicroservice)
        .catch((err: RpcException) => {
          throw new BadRequestException(err.message);
        });
    } else {
      const dtoForNotifyMicroservice: CreateNotifyForNotifyMicroservice = {
        creatorUserId: sub,
        targetUserId: targetUserId,
        userEmail: targetUserInfo.email,
        message: NotifyMessageEnum.RequestCoachTraining,
      };

      this.notifyMicroserviceClient.requestCoachTrainingEvent(dtoForNotifyMicroservice)
        .catch((err: RpcException) => {
          throw new BadRequestException(err.message);
        });
    }
  }

  @Get('friends/requesttraining/updatestatus/:requestId')
  @HttpCode(HttpStatusCode.Ok)
  @UseInterceptors(new TransformAndValidateDtoInterceptor(UpdateStatusRequestTrainingDto))
  @UseGuards(JwtAuthGuard)
  public async updateStatusRequestTraining(@Param('requestId', MongoIdValidationPipe) requestId: string, @Req() req: Request & { user: JwtUserPayloadRdo }, @Body() dto: UpdateStatusRequestTrainingDto): Promise<void> {
    const { sub } = req.user;

    await this.usersMicroserviceClient.updateStatusRequestTraining(requestId, sub, dto);
  }

  // --------------------------

  // ORDERS

  @Post('orders')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateOrderDto))
  @UseGuards(JwtAuthGuard)
  public async createOrder(@Body() dto: CreateOrderDto, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<void> {
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


    await this.ordersMicroserviceClient.createOrder(creatorUserId, coachCreator, dto);
  }

  @Get('orders')
  @UseInterceptors(new TransformAndValidateQueryInterceptor(GetDocumentQuery))
  @UseGuards(JwtAuthGuard)
  public async getOrders(@Req() req: Request & { user: JwtUserPayloadRdo }, @Query() query: GetDocumentQuery): Promise<(StudentOrderInfoRdo | CoachOrderInfoRdo)[]> {
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

  // ----------------------

  // BALANCE

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  public async getBalance(@Req() req: Request & { user: JwtUserPayloadRdo }): Promise<BalanceRdo[]> {
    const { sub, role } = req.user;

    if (role !== 'Student') {
      throw new ForbiddenException('Доступ запрещен.');
    }

    const { productIds, products } = await this.ordersMicroserviceClient.getBalance(sub);

    const trainingList = await this.trainingsMicroserviceClient.getTrainingListByTrainingIds({ ids: productIds });


    const balanceList = products.map(item => {
      for (const trainingItem of trainingList) {
        if (trainingItem.id === item.productId) {
          return {
            ...item,
            productInfo: trainingItem,
          };
        }
      }
    });


    return fillRDO(BalanceRdo, balanceList) as unknown as BalanceRdo[];
  }

  // ---------------------

  // COMMENT

  @Post('comments')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(CreateCommentDto))
  @UseGuards(JwtAuthGuard)
  public async createComment(@Body() dto: CreateCommentDto, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<CommentRdo> {
    const { sub, role } = req.user;

    if (role === 'Coach') {
      throw new BadRequestException('Тренер не имеет права оставлять комментарии.');
    }

    const { orderId, description, score } = dto;

    const order = await this.ordersMicroserviceClient.getOrderByIdAndCreatorUserId(orderId, sub);

    const dtoForCommentsMicroservice: CreateCommentForCommentsMicroserviceDto = {
      creatorUserId: sub,
      trainingId: order.productId,
      orderId: orderId,
      description: description,
      score: score,
    };

    const result = await this.commentsMicroserviceClient.createComment(dtoForCommentsMicroservice);

    await this.trainingsMicroserviceClient.updateRating(order.productId, { score: score });

    const userInfo = await this.usersMicroserviceClient.getUserInfo(result.creatorUserId);

    const transformResult = {
      ...result,
      userInfo: userInfo,
    };


    return fillRDO(CommentRdo, transformResult);
  }

  @Post('comments/:trainingId')
  @UseInterceptors(new TransformAndValidateQueryInterceptor(GetDocumentQuery))
  @UseGuards(JwtAuthGuard)
  public async findComments(@Param('trainingId', MongoIdValidationPipe) trainingId: string, @Query() query: GetDocumentQuery): Promise<CommentRdo[]> {
    const { comments, creatorUserIds } = await this.commentsMicroserviceClient.findCommentsByTrainingId(trainingId, query);

    const userList = await this.usersMicroserviceClient.getUserList({ userIds: creatorUserIds });

    const transformCommentsList = comments.map(item => {
      for (const user of userList) {
        if (user.id === item.creatorUserId) {
          return {
            ...item,
            userInfo: user,
          };
        }
      }
    });


    return fillRDO(CommentRdo, transformCommentsList) as unknown as CommentRdo[];
  }

  // ------------------

  // NOTIFY

  @Get('notify')
  @UseGuards(JwtAuthGuard)
  public async getNotify(@Req() req: Request & { user: JwtUserPayloadRdo }): Promise<NotifyRdo[]> {
    const creatorUserId = req.user.sub;

    const result = await this.notifyMicroserviceClient.getNotify(creatorUserId)
      .catch((err: RpcException) => {
        throw new BadRequestException(err.message.toString());
    });

    const { creatorUserIds, notifications } = result;

    const userList = await this.usersMicroserviceClient.getUserList({ userIds: creatorUserIds });

    const transformNotifications = notifications.map(item => {
      for (const userInfo of userList) {
        if (item.creatorUserId === userInfo.id) {
          return {
            ...item,
            userInfo: userInfo,
          };
        }
      }
    });


    return fillRDO(NotifyRdo, transformNotifications) as unknown as NotifyRdo[];
  }

  @Delete('notify/:notifyId')
  @HttpCode(HttpStatusCode.Ok)
  @UseGuards(JwtAuthGuard)
  public async deleteNotify(@Param('notifyId', MongoIdValidationPipe) notifyId: string, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<void> {
    const creatorUserId = req.user.sub;

    await this.notifyMicroserviceClient.removeNotify(notifyId, creatorUserId)
      .catch((err: RpcException) => {
        throw new BadRequestException(err.message.toString());
    });
  }

}
