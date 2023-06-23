import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseUserEntity, CoachUserEntity, StudentUserEntity } from './entity/user.entity';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { UsersMicroserviceEnvInterface } from '../../assets/interface/users-microservice-env.interface';
import { CoachCreateUserDto, CoachRoleInterface, DEFAULT_PAGINATION_LIMIT, FindUsersQuery, StudentCreateUserDto, StudentRoleInterface, UpdateCoachUserInfoDto, UpdateStudentUserInfoDto } from '@fitfriends-backend/shared-types';

@Injectable()
export class UsersRepositoryService {
  private readonly logger = new Logger(UsersRepositoryService.name);

  constructor (
    private readonly config: ConfigService<UsersMicroserviceEnvInterface>,
    @InjectModel(BaseUserEntity.name) private readonly usersModel: Model<BaseUserEntity>,
    @InjectModel(StudentUserEntity.name) private readonly studentUserModel: Model<StudentUserEntity>,
    @InjectModel(CoachUserEntity.name) private readonly coachUserModel: Model<CoachUserEntity>,
  ) { }


  public async createUser(dto: StudentCreateUserDto | CoachCreateUserDto): Promise<StudentUserEntity | CoachUserEntity> {
    const { role } = dto;

    let newUserObj: StudentUserEntity | CoachUserEntity;
    let newUser:  StudentUserEntity | CoachUserEntity;

    if (role === 'Student') {
      newUserObj = await new StudentUserEntity().fillObject(dto as StudentCreateUserDto);
      newUser = await this.studentUserModel.create(newUserObj);
    } else if (role === 'Coach') {
      newUserObj = await new CoachUserEntity().fillObject(dto as CoachCreateUserDto);
      newUser = await this.coachUserModel.create(newUserObj);
    }


    this.logger.log(`Новый пользователь с email: ${newUser.email} и ролью: ${newUser.role} создан.`);


    return newUser;
  }


  public async findUserById(id: string): Promise<BaseUserEntity | null> {
    return await this.usersModel.findById(id);
  }

  public async findUserByEmail(email: string): Promise<BaseUserEntity | null> {
    return await this.usersModel.findOne({
      email: email,
    });
  }

  public async updateUserData(id: string, dto: UpdateStudentUserInfoDto | UpdateCoachUserInfoDto): Promise<BaseUserEntity> {
    const user = await this.usersModel.findByIdAndUpdate(id, {
      $set: dto,
    }, {
      new: true,
    });

    if (!user) {
      throw new BadRequestException(`Пользователя с данным ID: ${id} не существует.`);
    }

    this.logger.log(`Обновлены данные пользователя с email: ${user.email}`);


    return user;
  }

  public async findUsersByQueryParams(query: FindUsersQuery): Promise<BaseUserEntity[]> {
    const { role, location, skillLevel, trainingType, page, sort, } = query;

    console.log(query);

    const filter: FilterQuery<BaseUserEntity> = {};

    if (role) {
      filter['role'] = role;
    }
    if (location) {
      filter['location'] = location;
    }
    if (skillLevel) {
      filter['skillLevel'] = skillLevel;
    }
    if (trainingType) {
      filter['trainingType'] = trainingType;
    }


    const options: QueryOptions<BaseUserEntity> = {
      skip: DEFAULT_PAGINATION_LIMIT * (page - 1),
      limit: DEFAULT_PAGINATION_LIMIT,
      sort: { createdAt: sort === 'desc' ? -1 : 1 },
    };

    const users = await this.usersModel.find(filter, null, options).exec();


    return users;
  }

}
