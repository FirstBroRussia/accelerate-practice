import * as fs from 'fs';

import { Request } from 'express';

import { isEmail, isEnum, isMongoId, validate } from 'class-validator';

import { BadRequestException, Body, Controller, ForbiddenException, Get, Logger, Param, Patch, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { fillDTOWithExcludeExtraneousValues, fillRDO } from '@fitfriends-backend/core';
import { CoachCreateUserDto, CoachCreateUserRdo, CoachUserRdo, FindUsersQuery, JwtRefreshTokenDto, JwtUserPayloadRdo, JwtValidationPipe, LoginUserDto, LoginUserRdo, MongoIdValidationPipe, StudentCreateUserDto, StudentCreateUserRdo, StudentUserRdo, TransformAndValidateDtoInterceptor, TransformAndValidateQueryInterceptor, UpdateCoachUserInfoDto, UpdateStudentUserInfoDto, UserRoleEnum } from '@fitfriends-backend/shared-types';

import { BffMicroserviceEnvInterface } from '../../assets/interface/bff-microservice-env.interface';
import { JwtMicroserviceClientService } from '../microservice-client/jwt-microservice-client/jwt-microservice-client.service';
import { CreateUserInterceptor } from '../../assets/interceptor/create-user.interceptor';
import { UsersMicroserviceClientService } from '../microservice-client/users-microservice-client/users-microservice-client.service';
import { JwtAuthGuard } from 'apps/bff/src/assets/guard/jwt-auth.guard';
import { CheckJwtAccessTokenInterceptor } from 'apps/bff/src/assets/interceptor/check-jwt-access-token.interceptor';
import { UpdateUserInterceptor } from 'apps/bff/src/assets/interceptor/update-user.interceptor';
import { join, resolve } from 'path';


@Controller('users')
export class UsersToBffController {
  private readonly logger = new Logger(UsersToBffController.name);

  constructor(
    private readonly config: ConfigService<BffMicroserviceEnvInterface>,
    private readonly usersMicroserviceClient: UsersMicroserviceClientService,
    private readonly jwtMicroserviceClient: JwtMicroserviceClientService,
  ) { }


  @Post('checkemail')
  public async checkEmail(@Body('email') email: string): Promise<boolean> {
    if (!isEmail(email)) {
      throw new BadRequestException(`Передан невалидный email: ${email}.`);
    }

    return await this.usersMicroserviceClient.checkEmail(email);
  }

  @Post('/register')
  @UseInterceptors(new CreateUserInterceptor([
    {
      fieldName: 'avatar',
      count: 1,
      limits: {
        extension: /^(jpg|png|jpeg)$/,
        fileSize: 1 * 1024 * 1024, // В мегабайтах
      },
    },
    {
      fieldName: 'certificates',
      count: 1,
      limits: {
        extension: /^pdf$/,
      },
    },
  ], new ConfigService, new UsersMicroserviceClientService(new ConfigService())))
  public async register(@Body() dto: StudentCreateUserDto | CoachCreateUserDto) {
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

    const response = await this.usersMicroserviceClient.registerUser(transformDto);

    const rdo = role === 'Student' ? fillRDO(StudentCreateUserRdo, response)
    : fillRDO(CoachCreateUserRdo, response);


    return rdo;

  }

  @Post('login')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(LoginUserDto))
  @UseInterceptors(CheckJwtAccessTokenInterceptor)
  public async login(@Body() dto: LoginUserDto): Promise<LoginUserRdo> {
    const jwtUserPayload = await this.usersMicroserviceClient.login(dto);

    const jwtTokens = await this.jwtMicroserviceClient.generateTokens(jwtUserPayload);

    return fillRDO(LoginUserRdo, jwtTokens);
  }

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  public async getUserInfo(@Param('userId', MongoIdValidationPipe) userId: string, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<StudentUserRdo | CoachUserRdo> {
    const { sub } = req.user;

    if (sub !== userId) {
      throw new ForbiddenException('Доступ запрещен');
    }

    const existUser = await this.usersMicroserviceClient.getUserInfo(userId);

    const rdo = existUser.role === 'Student' ? fillRDO(StudentUserRdo, existUser) : fillRDO(CoachUserRdo, existUser);


    return rdo;
  }

  @Patch('user/:userId')
  @UseInterceptors(new UpdateUserInterceptor([
    {
      fieldName: 'avatar',
      count: 1,
      limits: {
        extension: /^(jpg|png|jpeg)$/,
        fileSize: 1 * 1024 * 1024, // В мегабайтах
      },
    },
    {
      fieldName: 'certificates',
      count: 1,
      limits: {
        extension: /^pdf$/,
      },
    },
  ], new ConfigService))
  @UseGuards(JwtAuthGuard)
  public async updateUserInfo(@Param('userId', MongoIdValidationPipe) userId: string, @Body() dto: UpdateStudentUserInfoDto | UpdateCoachUserInfoDto, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<any> {
    const { sub, role } = req.user;

    if (sub !== userId) {
      throw new ForbiddenException('Доступ запрещен');
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

    transformDto['role'] = role;

    let oldAvatarPath = null;
    let oldCertificatesPath = null;

    if (role === 'Student' && dto.avatar) {
      const { avatar } = await this.usersMicroserviceClient.getUserInfo(userId);

      oldAvatarPath = avatar;
    } else if (role === 'Coach') {
      if (!dto.avatar && !(dto as UpdateCoachUserInfoDto).certificates) {
        return;
      }

      const { avatar, certificates } = await this.usersMicroserviceClient.getUserInfo(userId) as CoachUserRdo;

      oldAvatarPath = avatar;
      oldCertificatesPath = certificates;
    }

    const result = await this.usersMicroserviceClient.updateUserInfo(userId, transformDto);

    if (oldAvatarPath) {
      fs.rm(resolve(join('./', oldAvatarPath)), (err) => {
        if (err) {
          this.logger.error(err);
        }
      })
    }
    if (oldCertificatesPath) {
      fs.rm(resolve(join('./', oldCertificatesPath)), (err) => {
        if (err) {
          this.logger.error(err);
        }
      })
    }

    const rdo = role === 'Student' ? fillRDO(StudentUserRdo, result) : fillRDO(CoachUserRdo, result);


    return rdo;
  }

  @Post('logout')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(JwtRefreshTokenDto))
  public async logout(@Body() dto: JwtRefreshTokenDto): Promise<void> {
    return await this.jwtMicroserviceClient.logout(dto);
  }

  @Get('userslist')
  @UseInterceptors(new TransformAndValidateQueryInterceptor(FindUsersQuery))
  @UseGuards(JwtAuthGuard)
  // public async getUsersList(@Query() query: FindUsersQuery, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<any> {
    public async getUsersList(@Query() query: FindUsersQuery, @Req() req: Request & { user: JwtUserPayloadRdo }): Promise<(StudentUserRdo | CoachUserRdo)[]> {
    const { role } = req.user;

    if (role !== 'Student') {
      throw new ForbiddenException('Доступ запрещен, запросить данный список могут только обычные пользователи.');
    }

    const usersList = await this.usersMicroserviceClient.getUsersList(req.url);


    const rdo = query.role === 'Student' ? fillRDO(StudentUserRdo, usersList) : fillRDO(CoachUserRdo, usersList);


    return rdo as unknown as (StudentUserRdo | CoachUserRdo)[];
  }

}
