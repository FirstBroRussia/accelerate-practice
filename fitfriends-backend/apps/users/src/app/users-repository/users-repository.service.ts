import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseUserEntity, CoachUserEntity, StudentUserEntity } from './entity/user.entity';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { CoachCreateUserDto, DEFAULT_PAGINATION_LIMIT, FindUsersQuery, GetFriendsListQuery, RequestTrainingStatusType, StudentCreateUserDto, UpdateCoachUserInfoDto, UpdateStudentUserInfoDto } from '@fitfriends-backend/shared-types';
import { RequestTrainingEntity } from './entity/request-training.entity';

@Injectable()
export class UsersRepositoryService {
  private readonly logger = new Logger(UsersRepositoryService.name);

  constructor (
    @InjectModel(BaseUserEntity.name) private readonly usersModel: Model<BaseUserEntity>,
    @InjectModel(StudentUserEntity.name) private readonly studentUserModel: Model<StudentUserEntity>,
    @InjectModel(CoachUserEntity.name) private readonly coachUserModel: Model<CoachUserEntity>,
    @InjectModel(RequestTrainingEntity.name) private readonly requestTrainingModel: Model<RequestTrainingEntity>,
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

  public async getUsersListByIds(ids: string[]): Promise<BaseUserEntity[]> {
    return await this.usersModel.find({
      _id: { $in: ids },
    }).exec();
  }

  public async checkFriendUserByFriendsList(id: string, friendId: string): Promise<BaseUserEntity | null> {
    return await this.usersModel.findOne({
      _id: id,
      friends: { $elemMatch: { $eq: friendId, } },
    });
  }

  public async addFriend(id: string, friendId: string): Promise<BaseUserEntity | null> {
    return await this.usersModel.findByIdAndUpdate(id, {
      $push: { friends: friendId, },
    },
    { new: true, }
    );
  }

  public async removeFriend(id: string, friendId: string): Promise<BaseUserEntity | null> {
    return await this.usersModel.findByIdAndUpdate(id, {
      $pull: { friends: friendId, },
    },
    { new: true, }
    );
  }

  public async getFriendsList(id: string, query: GetFriendsListQuery): Promise<BaseUserEntity | null> {
    const { page, sort } = query;

    const options: QueryOptions<BaseUserEntity> = {
      skip: DEFAULT_PAGINATION_LIMIT * (page - 1),
      limit: DEFAULT_PAGINATION_LIMIT,
      sort: { createdAt: sort === 'desc' ? -1 : 1 },
    };

    return await this.usersModel.findById(id, {
      friends: 1,
    }, options).exec();
  }

  public async createRequestTraining(creatorUserId: string, targetUserId: string): Promise<RequestTrainingEntity> {
    const newRequestTrainingObj = new RequestTrainingEntity().fillObject(creatorUserId, targetUserId);

    return await this.requestTrainingModel.create(newRequestTrainingObj);
  }

  public async updateRequestTrainingStatus(id: string, status: RequestTrainingStatusType): Promise<RequestTrainingEntity> {
    return await this.requestTrainingModel.findByIdAndUpdate(id, {
      $set: {
        status: status,
        statusChangeDate: new Date().toISOString(),
      },
    }, { new: true, });
  }

  public async getRequestTrainingDocumentByCreatorUserIdAndTargetUserId(creatorUserId: string, targetUserId: string): Promise<RequestTrainingEntity | null> {
    return await this.requestTrainingModel.findOne({
      creatorUserId: creatorUserId,
      targetUserId: targetUserId,
    });
  }

  public async getRequestTrainingDocumentByIdAndTargetUserId(id: string, targetUserId: string): Promise<RequestTrainingEntity | null> {
    return await this.requestTrainingModel.findOne({
      _id: id,
      targetUserId: targetUserId,
    });
  }

  public async getRequestTrainingDocumentById(id: string): Promise<RequestTrainingEntity | null> {
    return await this.requestTrainingModel.findById(id);
  }

  public async updateStatusRequestTrainingDocumentByIdAndTargetUserId(id: string, targetUserId: string, status: Omit<RequestTrainingStatusType, "Waiting">): Promise<RequestTrainingEntity | null> {
    return await this.requestTrainingModel.findOneAndUpdate({
      _id: id,
      targetUserId: targetUserId,
    }, {
      $set: { status: status },
    }, { new: true, });
  }

  public async getRequestTrainingFriendList(creatorUserId: string, friendIds: string[]): Promise<RequestTrainingEntity[]> {
    return await this.requestTrainingModel.find({
      creatorUserId: { $in: friendIds, },
      targetUserId: creatorUserId,
    });

  }

}
