import { BadRequestException, Body, Controller, ForbiddenException, Get, Logger, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseCreateUserRdo, CoachCreateUserDto, CoachCreateUserRdo, CoachUserRdo, FindUsersQuery, JwtUserPayloadDto, LoginUserDto, LoginUserRdo, MongoIdValidationPipe, StudentCreateUserDto, StudentCreateUserRdo, StudentUserRdo, TransformAndValidateDtoInterceptor, TransformAndValidateQueryInterceptor, UpdateCoachUserInfoDto, UpdateStudentUserInfoDto, UserRoleEnum, UserRoleType } from '@fitfriends-backend/shared-types';
import { fillDTOWithExcludeExtraneousValues, fillRDO } from '@fitfriends-backend/core';

import { UsersService } from './users.service';

import { UsersMicroserviceEnvInterface } from '../../assets/interface/users-microservice-env.interface';
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
  // public async getUsersList(@Query() query: FindUsersQuery): Promise<(StudentUserRdo | CoachUserRdo)[]> {
  public async getUsersList(@Query() query: FindUsersQuery): Promise<any> {
    const usersList = await this.usersService.getUsersList(query);

    const rdo = query.role === 'Student' ? fillRDO(StudentUserRdo, usersList) : fillRDO(CoachUserRdo, usersList);


    return rdo as unknown as (StudentUserRdo | CoachUserRdo)[];
  }

}
