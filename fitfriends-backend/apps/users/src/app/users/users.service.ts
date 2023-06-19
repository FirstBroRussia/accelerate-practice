import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersMicroserviceEnvInterface } from '../../assets/interface/users-microservice-env.interface';
import { UsersRepositoryService } from '../users-repository/users-repository.service';
import { CoachCreateUserDto, StudentCreateUserDto } from '../../assets/dto/create-user.dto';
import { CoachUserEntity, StudentUserEntity } from '../users-repository/entity/user.entity';
import { LoginUserDto } from '@fitfriends-backend/shared-types';
import { verifyPasswordHash } from '@fitfriends-backend/core';


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

  public async createUser(dto: StudentCreateUserDto | CoachCreateUserDto): Promise<StudentUserEntity | CoachUserEntity> {
    const { email } = dto;

    const existUser = await this.usersRepository.findUserByEmail(email);

    if (existUser) {
      throw new BadRequestException(`Пользователь с email: ${email} уже создан.`);
    }


    return await this.usersRepository.createUser(dto);
  }

  public async login(dto: LoginUserDto): Promise<any> {
    const { email, password } = dto;

    const existUser = await this.usersRepository.findUserByEmail(email);

    if (!existUser) {
      throw new BadRequestException(`Пользователя с email: ${email} не существует.`);
    }

    const isVerifyPassword = await verifyPasswordHash(password, existUser.passwordHash);

    if (!isVerifyPassword) {
      throw new BadRequestException(`Неверный пароль.`);
    }

    /////////////////////////
    // Создание JWT токенов и внесение записей в БД
    //////////////////


    return true;
  }

  public async find(email: string) {
    return await this.usersRepository.findUserByEmail(email);
  }


}
