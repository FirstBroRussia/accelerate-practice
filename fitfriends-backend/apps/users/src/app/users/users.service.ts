import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersMicroserviceEnvInterface } from '../../assets/interface/users-microservice-env.interface';
import { UsersRepositoryService } from '../users-repository/users-repository.service';
import { BaseUserEntity, CoachUserEntity, StudentUserEntity } from '../users-repository/entity/user.entity';
import { CoachCreateUserDto, FindUsersQuery, JwtUserPayloadDto, LoginUserDto, StudentCreateUserDto, UpdateCoachUserInfoDto, UpdateStudentUserInfoDto } from '@fitfriends-backend/shared-types';
import { compareHash } from '@fitfriends-backend/core';


@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor (
    private readonly config: ConfigService<UsersMicroserviceEnvInterface>,
    private readonly usersRepository: UsersRepositoryService,
  ) { }


  public async checkEmail(email: string): Promise<boolean> {
    const result = await this.usersRepository.findUserByEmail(email);

    return result ? true : false;
  }

  public async create(dto: StudentCreateUserDto | CoachCreateUserDto): Promise<StudentUserEntity | CoachUserEntity> {
    const { email } = dto;

    const existUser = await this.usersRepository.findUserByEmail(email);

    if (existUser) {
      throw new BadRequestException(`Пользователь с email: ${email} уже создан.`);
    }


    return await this.usersRepository.createUser(dto);
  }

  public async login(dto: LoginUserDto): Promise<JwtUserPayloadDto> {
    const { email, password } = dto;

    const existUser = await this.usersRepository.findUserByEmail(email);

    if (!existUser) {
      throw new BadRequestException(`Пользователя с email: ${email} не существует.`);
    }

    const isVerifyPassword = await compareHash(password, existUser.passwordHash);

    if (!isVerifyPassword) {
      throw new BadRequestException(`Неверный пароль.`);
    }

    const jwtUserPayload: JwtUserPayloadDto = {
      sub: existUser._id,
      email: existUser.email,
      role: existUser.role,
    };


    return jwtUserPayload;
  }

  public async find(email: string): Promise<BaseUserEntity | null> {
    const existUser = await this.usersRepository.findUserByEmail(email);

    if (!existUser) {
      throw new BadRequestException(`Данного пользователя с email: ${email} не найдено.`);
    }


    return existUser;
  }

  public async findById(id: string): Promise<BaseUserEntity | null> {
    const existUser = await this.usersRepository.findUserById(id);

    if (!existUser) {
      throw new BadRequestException(`Данного пользователя с ID: ${id} не найдено.`);
    }


    return existUser;
  }

  public async updateUserInfo(userId: string, dto: UpdateStudentUserInfoDto | UpdateCoachUserInfoDto): Promise<BaseUserEntity | null> {
    await this.findById(userId);

    return await this.usersRepository.updateUserData(userId, dto);
  }

  public async getUsersList(query: FindUsersQuery): Promise<BaseUserEntity[]> {
    return await this.usersRepository.findUsersByQueryParams(query);
  }


}
