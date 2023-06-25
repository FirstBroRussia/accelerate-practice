import { TrainingsMicroserviceConstant, CreateTrainingDto, GenderType, SkillLevelType, TimeForTrainingType, TrainingType } from "@fitfriends-backend/shared-types";
import { Schema, SchemaFactory, Prop } from "@nestjs/mongoose";
import { TrainingInterface } from "libs/shared-types/src/lib/interface/cabinet/training.interface";
import { Document } from "mongoose";

export interface TrainingEntity extends Document { }

@Schema({
  collection: 'training',
  timestamps: true,
})
export class TrainingEntity implements TrainingInterface {
  @Prop({
    trim: true,
    required: true,
    unique: true,
  })
  name?: string;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  skillLevel?: SkillLevelType;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  trainingType?: TrainingType;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  timeForTraining?: TimeForTrainingType;

  @Prop({
    trim: true,
    required: true,
  })
  price?: number;

  @Prop({
    trim: true,
    required: true,
  })
  quantityOfCalories?: number;

  @Prop({
    trim: true,
    required: true,
  })
  description?: string;

  @Prop({
    trim: true,
    required: true,
    type: 'String',
  })
  gender?: GenderType;

  @Prop({
    trim: true,
    required: true,
  })
  videoOfTraining?: string;

  @Prop({
    trim: true,
    required: true,
  })
  rating?: number;

  @Prop({
    trim: true,
    required: true,
  })
  specialOffer?: boolean;

  @Prop({
    trim: true,
    required: true,
  })
  coachCreator?: string;


  public async fillObject(dto: CreateTrainingDto): Promise<this> {
    const { name, description, gender, price, quantityOfCalories, skillLevel, timeForTraining, trainingType, videoOfTraining, specialOffer, coachCreator } = dto;

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

    this.coachCreator = coachCreator;


    return this;
  }

}

export const TrainingEntitySchema = SchemaFactory.createForClass(TrainingEntity);
