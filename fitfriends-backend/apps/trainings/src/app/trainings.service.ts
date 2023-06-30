import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { TrainingsRepositoryService } from './trainings-repository/trainings-repository.service';
import { CreateCoachTrainingDto, FindCoachTrainingsQuery, ONE_VALUE, UpdateCoachTrainingDto, UpdateRatingCoachTrainingDto, ZERO_VALUE } from '@fitfriends-backend/shared-types';
import { CoachTrainingEntity } from './trainings-repository/entity/training.entity';


@Injectable()
export class TrainingsService {
  private readonly logger = new Logger(TrainingsService.name);

  constructor (
    private readonly trainingsRepository: TrainingsRepositoryService,
  ) { }


  public async createCoachTraining(creatorUserId: string, dto: CreateCoachTrainingDto): Promise<CoachTrainingEntity> {
    return await this.trainingsRepository.create(creatorUserId, dto);
  }

  public async getTrainingById(trainingId: string): Promise<CoachTrainingEntity> {
    const result = await this.trainingsRepository.getById(trainingId);

    if (!result) {
      throw new BadRequestException(`Тренировки с данным ID: ${trainingId} не найдено.`);
    }


    return result;
  }

  public async updateTrainingById(trainingId: string, creatorUserId: string, dto: UpdateCoachTrainingDto): Promise<CoachTrainingEntity> {
    const existTraining = await this.trainingsRepository.getById(trainingId);

    if (!existTraining) {
      throw new BadRequestException(`Тренировки с данным ID: ${trainingId} не найдено.`);
    }

    if (existTraining.coachCreator !== creatorUserId) {
      throw new ForbiddenException('Доступ запрещен, вы не имеете права совершать данное действие.');
    }

    const result = await this.trainingsRepository.updateById(trainingId, dto);


    return result;
  }

  public async getTrainingListByTrainingIds(ids: string[]): Promise<CoachTrainingEntity[]> {
    return await this.trainingsRepository.getTrainingListByTrainingIds(ids);
  }

  public async getTrainingListByCreatorId(creatorUserId: string, query: FindCoachTrainingsQuery): Promise<CoachTrainingEntity[]> {
    return await this.trainingsRepository.getTrainingListByCreatorId(creatorUserId, query);
  }

  public async updateRatingById(trainingId: string, creatorUserId: string, dto: UpdateRatingCoachTrainingDto): Promise<CoachTrainingEntity> {
    const result = await this.trainingsRepository.getById(trainingId);

    if (!result) {
      throw new BadRequestException(`Тренировки с данным ID: ${trainingId} не найдено.`);
    }

    if (result.coachCreator !== creatorUserId) {
      throw new ForbiddenException('Доступ запрещен, вы не имеете права совершать данное действие.');
    }

    const { score } = dto;

    const { rating, ratingCount } = result;

    if (rating === ZERO_VALUE && ratingCount == ZERO_VALUE) {
      return await this.trainingsRepository.updateRating(trainingId, score);
    }

    const allScore = rating * ratingCount;
    const newRating = (allScore + score) / (ratingCount + 1);


    return await this.trainingsRepository.updateRating(trainingId, newRating);
  }

}
