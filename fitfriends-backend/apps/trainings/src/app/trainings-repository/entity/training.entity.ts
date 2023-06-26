import { TrainingsMicroserviceConstant, CreateCoachTrainingDto, GenderType, SkillLevelType, TimeForTrainingType, TrainingType, CoachTrainingInterface, ZERO_VALUE } from "@fitfriends-backend/shared-types";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface CoachTrainingEntity extends Document { }


@Schema({
  collection: 'training',
  timestamps: true,
})
export class CoachTrainingEntity implements CoachTrainingInterface {
  @Prop({
    trim: true,
    required: true,
    unique: true,
  })
  name: string;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  skillLevel: SkillLevelType;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  trainingType: TrainingType;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  timeForTraining: TimeForTrainingType;

  @Prop({
    trim: true,
    required: true,
  })
  price: number;

  @Prop({
    trim: true,
    required: true,
  })
  quantityOfCalories: number;

  @Prop({
    trim: true,
    required: true,
  })
  description: string;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  gender: GenderType;

  @Prop({
    trim: true,
    required: true,
  })
  videoOfTraining: string;

  @Prop({
    trim: true,
    required: true,
  })
  rating: number;

  @Prop({
    trim: true,
    required: true,
  })
  ratingCount: number;

  @Prop({
    trim: true,
    required: true,
  })
  specialOffer: boolean;

  @Prop({
    trim: true,
    required: true,
    index: true,
  })
  coachCreator: string;


  public fillObject(creatorCoachUserId: string, dto: CreateCoachTrainingDto): this {
    const { name, description, gender, price, quantityOfCalories, skillLevel, timeForTraining, trainingType, videoOfTraining, specialOffer } = dto;

    this.name = name;
    this.description = description;
    this.gender = gender;
    this.price = price;
    this.quantityOfCalories = quantityOfCalories;
    this.skillLevel = skillLevel;
    this.timeForTraining;
    this.timeForTraining = timeForTraining;
    this.trainingType = trainingType;
    this.videoOfTraining = videoOfTraining;
    this.specialOffer = specialOffer;

    this.rating = TrainingsMicroserviceConstant.TRAINING_RATING_DEFAULT_COUNT;
    this.ratingCount = ZERO_VALUE;

    this.coachCreator = creatorCoachUserId;


    return this;
  }

}

export const TrainingEntitySchema = SchemaFactory.createForClass(CoachTrainingEntity);
