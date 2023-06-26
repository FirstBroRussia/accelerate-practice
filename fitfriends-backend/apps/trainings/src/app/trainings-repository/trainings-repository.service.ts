import { BadRequestException, Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { CoachTrainingEntity } from './entity/training.entity';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCoachTrainingDto, DEFAULT_PAGINATION_LIMIT, FindCoachTrainingsQuery, UpdateCoachTrainingDto, UpdateRatingCoachTrainingDto } from '@fitfriends-backend/shared-types';
import { getTimeForTraining } from '@fitfriends-backend/core';


@Injectable()
export class TrainingsRepositoryService {
  private readonly logger = new Logger(TrainingsRepositoryService.name);

  constructor (
    @InjectModel(CoachTrainingEntity.name) private readonly coachTrainingModel: Model<CoachTrainingEntity>,
  ) { }

  public async create(creatorUserId: string, dto: CreateCoachTrainingDto): Promise<CoachTrainingEntity> {
    const newCoachTrainingObj = new CoachTrainingEntity().fillObject(creatorUserId, dto);

    const newCoachTraining = await this.coachTrainingModel.create(newCoachTrainingObj)
      .catch((err) => {
        console.error(err);

        if (err instanceof Error && err.name === 'MongoServerError' && (err as Error & { [value: string]: any }).code === 11000) {
          const error = err as Error & { [value: string]: any };

          if ((error.keyValue as Object).hasOwnProperty('name')) {
            throw new BadRequestException(`Тренировка с названием: "${error.keyValue.name}" уже создана, измените название`);
          }

          throw new BadRequestException(`Вот вам дубликаты полей уникальных значений: ${Object.keys(error.keyValue).join(',\n')}.`);
        }

        throw new InternalServerErrorException('Ошибка при создании записи в БД. Повторите еще раз');
      });

    this.logger.log('Новая тренировка от тренера создана.');


    return newCoachTraining as CoachTrainingEntity;
  }

  public async getById(trainingId: string): Promise<CoachTrainingEntity | null> {
    return await this.coachTrainingModel.findById(trainingId);
  }

  public async updateById(trainingId: string, dto: UpdateCoachTrainingDto): Promise<CoachTrainingEntity | null> {
    return await this.coachTrainingModel.findByIdAndUpdate(trainingId, {
      $set: dto,
    }, {
      new: true,
    });
  }

  public async getTrainingListByCreatorId(creatorUserId: string, query: FindCoachTrainingsQuery): Promise<CoachTrainingEntity[]> {
    const { minPrice, maxPrice, minCalories, maxCalories, minRating, maxRating, duration, page, sort } = query;

    const filter: FilterQuery<CoachTrainingEntity> = {
      coachCreator: creatorUserId,
    };

    if (minPrice && maxPrice) {
      filter['price'] = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice) {
      filter['price'] = { $gte: minPrice };
    } else if (maxPrice) {
      filter['price'] = { $lte: maxPrice };
    }

    if (minCalories && maxCalories) {
      filter['quantityOfCalories'] = { $gte: minCalories, $lte: maxCalories };
    } else if (minCalories) {
      filter['quantityOfCalories'] = { $gte: minCalories };
    } else if (maxCalories) {
      filter['quantityOfCalories'] = { $lte: maxCalories };
    }

    if (minRating && maxRating) {
      filter['rating'] = { $gte: minRating, $lte: maxRating };
    } else if (minRating) {
      filter['rating'] = { $gte: minRating };
    } else if (maxRating) {
      filter['rating'] = { $lte: maxRating };
    }

    if (duration) {
      filter['timeForTraining'] = getTimeForTraining(duration);
    }

    const options: QueryOptions<CoachTrainingEntity> = {
      skip: DEFAULT_PAGINATION_LIMIT * (page - 1),
      limit: DEFAULT_PAGINATION_LIMIT,
      sort: { createdAt: sort === 'desc' ? -1 : 1 },
    };


    return await this.coachTrainingModel.find(filter, null, options);
  }

  public async updateRating(trainingId: string, rating: number): Promise<CoachTrainingEntity> {
    return await this.coachTrainingModel.findByIdAndUpdate(trainingId, {
      $set: {
        rating: rating,
      },
      $inc: {
        ratingCount: 1,
      },
    });
  }

}
