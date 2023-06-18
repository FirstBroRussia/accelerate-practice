import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersMicroserviceEnvInterface } from '../../assets/interface/users-microservice-env.interface';
import { UsersRepositoryService } from '../users-repository/users-repository.service';
import { CoachCreateUserDto, StudentCreateUserDto } from '../../assets/dto/create-user.dto';
import { CoachUserEntity, StudentUserEntity } from '../users-repository/entity/user.entity';


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

  public async find(email: string) {
    return await this.usersRepository.findUserByEmail(email);
  }


}
