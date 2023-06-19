import { BadRequestException, Body, Controller, Logger, Post, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseCreateUserRdo, CoachCreateUserDto, CoachCreateUserRdo, LoginUserDto, StudentCreateUserDto, StudentCreateUserRdo, TransformAndValidateDtoInterceptor, UserRoleEnum } from '@fitfriends-backend/shared-types';
import { fillDTOWithExcludeExtraneousValues, fillRDO } from '@fitfriends-backend/core';

import { UsersService } from './users.service';

import { UsersMicroserviceEnvInterface } from '../../assets/interface/users-microservice-env.interface';
import { isEnum, validate } from 'class-validator';


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

    const result = await this.usersService.createUser(transformDto);

    const rdo = role === 'Student' ? fillRDO(StudentCreateUserRdo, result)
    : fillRDO(CoachCreateUserRdo, result);


    return rdo;
  }

  @Post('login')
  @UseInterceptors(new TransformAndValidateDtoInterceptor(LoginUserDto))
  public async login(@Body() dto: LoginUserDto): Promise<any> {
    const result = await this.usersService.login(dto);


    return result;
  }

  // @Post('/find')
  // public async find(@Body('email') email: string) {
  //   return await this.usersService.find(email);
  // }


}
