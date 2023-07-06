import { BadRequestException, Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseCreateUserRdo, CoachCreateUserDto, CoachCreateUserRdo, CoachUserRdo, FindUsersQuery, FriendUserInfoRdo, GetFriendsListQuery, GetUserListDto, JwtUserPayloadDto, LoginUserDto, LoginUserRdo, MongoIdValidationPipe, RequestTrainingRdo, StudentCreateUserDto, StudentCreateUserRdo, StudentUserRdo, TransformAndValidateDtoInterceptor, TransformAndValidateQueryInterceptor, UpdateCoachUserInfoDto, UpdateStatusRequestTrainingDto, UpdateStudentUserInfoDto, UserRoleEnum, UserRoleType } from '@fitfriends-backend/shared-types';
import { fillDTOWithExcludeExtraneousValues, fillRDO } from '@fitfriends-backend/core';

import { UsersService } from './users.service';

import { UsersMicroserviceEnvInterface } from '../assets/interface/users-microservice-env.interface';
import { isEnum, isMongoId, validate } from 'class-validator';


@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor (
    private readonly config: ConfigService<UsersMicroserviceEnvInterface>,
    private readonly usersService: UsersService,
  ) { }


  @Post('/checkemail')
  public async checkEmail(@Body('email') email: string): Promise<boolean> {
    const result = await this.usersService.checkEmail(email);

    if (result) {
      throw new BadRequestException(`Пользователь с email: ${email} уже создан.`);
    }

    return true;
  }

  @Post('/register')
  public async createUser(@Body() dto: StudentCreateUserDto & CoachCreateUserDto): Promise<BaseCreateUserRdo> {
    const { role } = dto;

    if (!isEnum(role, UserRoleEnum)) {
      throw new BadRequestException('Невалидные данные, в том числе поле "role"');
    }

    const transformDto = role === 'Student' ? fillDTOWithExcludeExtraneousValues(StudentCreateUserDto, dto)
      : fillDTOWithExcludeExtraneousValues(CoachCreateUserDto, dto);

    const errors = await validate(transformDto);

    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    const result = await this.usersService.create(transformDto);

    const rdo = role === 'Student' ? fillRDO(StudentCreateUserRdo, result)
    : fillRDO(CoachCreateUserRdo, result);


    return rdo;
  }

  @Post('login')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(LoginUserDto))
  public async login(@Body() dto: LoginUserDto): Promise<JwtUserPayloadDto> {
    const result = await this.usersService.login(dto);


    return fillRDO(JwtUserPayloadDto, result);
  }

  @Get('user/:userId')
  public async getUserById(@Param('userId', MongoIdValidationPipe) userId: string): Promise<StudentUserRdo | CoachUserRdo> {
    if (!isMongoId(userId)) {
      throw new BadRequestException(`${userId} не является валидным ID пользователя.`);
    }

    const user = await this.usersService.findById(userId);

    const rdo = user.role === 'Student' ? fillRDO(StudentUserRdo, user) : fillRDO(CoachUserRdo, user);


    return rdo;
  }

  @Patch('/user/:userId')
  public async updateUserInfo(@Param('userId', MongoIdValidationPipe) userId: string, @Body() dto: (UpdateStudentUserInfoDto | UpdateCoachUserInfoDto) & { role: UserRoleType }): Promise<any> {
    const { role } = dto;

    if (!isEnum(role, UserRoleEnum)) {
      throw new BadRequestException('Невалидные данные, в том числе поле "role"');
    }

    const transformDto = role === 'Student' ? fillDTOWithExcludeExtraneousValues(UpdateStudentUserInfoDto, dto)
      : fillDTOWithExcludeExtraneousValues(UpdateCoachUserInfoDto, dto);


    const errors = await validate(transformDto, {
      skipMissingProperties: true,
      skipUndefinedProperties: true,
      skipNullProperties: true,
    });

    if (errors.length > 0) {
      throw new BadRequestException(errors.toString());
    }

    const result = await this.usersService.updateUserInfo(userId, transformDto);

    const rdo = role === 'Student' ? fillRDO(StudentUserRdo, result)
    : fillRDO(CoachUserRdo, result);


    return rdo;
  }

  @Get('userslist')
  @UseInterceptors(new TransformAndValidateQueryInterceptor(FindUsersQuery))
  public async getUsersList(@Query() query: FindUsersQuery): Promise<(StudentUserRdo | CoachUserRdo)[]> {
    const usersList = await this.usersService.getUsersList(query);

    const rdo = query.role === 'Student' ? fillRDO(StudentUserRdo, usersList) : fillRDO(CoachUserRdo, usersList);


    return rdo as unknown as (StudentUserRdo | CoachUserRdo)[];
  }

  @Get('addfriend/:friendUserId/:creatorUserId')
  @HttpCode(HttpStatus.OK)
  public async addFriend(@Param('friendUserId', MongoIdValidationPipe) friendUserId: string, @Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string): Promise<void> {
    await this.usersService.addFriend(creatorUserId, friendUserId);
  }

  @Get('removefriend/:friendUserId/:creatorUserId')
  @HttpCode(HttpStatus.OK)
  public async removeFriend(@Param('friendUserId', MongoIdValidationPipe) friendUserId: string, @Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string): Promise<void> {
    await this.usersService.removeFriend(creatorUserId, friendUserId);
  }

  @Post('friendslist/:creatorUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(GetFriendsListQuery, {
    isQueryDto: true,
  }))
  public async getFriendsList(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Body() dto: GetFriendsListQuery): Promise<FriendUserInfoRdo[]> {
    const { friends } = await this.usersService.getFriendsList(creatorUserId, dto);

    const friendList = await this.usersService.getUsersListByIds(friends);

    const requestTrainingFriendList = await this.usersService.getRequestTrainingFriendList(creatorUserId, friends);

    const transformFriendList = friendList.map(item => {
      for (const requestTrainingFriendItem of requestTrainingFriendList) {
        if (requestTrainingFriendItem.creatorUserId === item._id.toString()) {
          return {
            ...item.toObject(),
            requestTrainingInfo: requestTrainingFriendItem,
          };
        }
      }

      return {
        ...item.toObject(),
        requestTrainingInfo: {},
      };
    });


    return fillRDO(FriendUserInfoRdo, transformFriendList) as unknown as FriendUserInfoRdo[];
  }

  @Get('requesttraining/create/:creatorUserId/:targetUserId')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(GetFriendsListQuery))
  public async createRequestTraining(@Param('creatorUserId', MongoIdValidationPipe) creatorUserId: string, @Param('targetUserId', MongoIdValidationPipe) targetUserId: string): Promise<RequestTrainingRdo> {
    const result = await this.usersService.createRequestTraining(creatorUserId, targetUserId);


    return fillRDO(RequestTrainingRdo, result);
  }

  @Post('requesttraining/updatestatus/:requestId/:targetUserId')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(new TransformAndValidateDtoInterceptor(UpdateStatusRequestTrainingDto))
  public async updateStatusRequestTraining(@Param('requestId', MongoIdValidationPipe) requestId: string, @Param('targetUserId', MongoIdValidationPipe) targetUserId: string, @Body() dto: UpdateStatusRequestTrainingDto): Promise<void> {
    await this.usersService.updateStatusRequestTraining(requestId, targetUserId, dto);
  }

  @Post('userlist')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(GetUserListDto))
  public async getUserList(@Body() dto: GetUserListDto): Promise<StudentUserRdo[]> {
    const { userIds } = dto;

    const result = await this.usersService.getUsersListByIds(userIds);


    return fillRDO(StudentUserRdo, result) as unknown as StudentUserRdo[];
  }

}
