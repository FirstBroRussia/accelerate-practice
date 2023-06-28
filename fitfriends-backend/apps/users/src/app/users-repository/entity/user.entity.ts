import { Document } from "mongoose";

import { BackgroundImageForUsercardType, CoachCreateUserDto, CoachRoleInterface, GenderType, LocationMetroType, SkillLevelType, StudentCreateUserDto, StudentRoleInterface, TimeForTrainingType, TrainingType, UserInterface, UserRoleType, } from '@fitfriends-backend/shared-types';
import { generateHash } from "@fitfriends-backend/core";

import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";


// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BaseUserEntity extends Document { }

@Schema({
  collection: 'users',
  timestamps: true,
})
export class BaseUserEntity implements UserInterface {
  @Prop({
    required: true,
    trim: true,
  })
  public name: string;

  @Prop({
    required: true,
    trim: true,
    unique: true,
  })
  public email: string;

  @Prop({
    trim: true,
  })
  public avatar: string;

  @Prop({
    required: true,
    trim: true,
  })
  passwordHash: string;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  gender: GenderType;

  @Prop({
    trim: true,
  })
  dateOfBirth: string;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  role: UserRoleType;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  location: LocationMetroType;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  imageForSite: BackgroundImageForUsercardType;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  skillLevel?: SkillLevelType;

  @Prop({
    required: true,
    trim: true,
    type: 'Mixed',

  })
  trainingType?: TrainingType[];


  @Prop({
    required: true,
    type: Array,
    default: [],
  })
  friends: string[];

}

export const UserEntitySchema = SchemaFactory.createForClass(BaseUserEntity);





@Schema({
  collection: 'users',
  timestamps: true,
})
export class StudentUserEntity extends BaseUserEntity implements StudentRoleInterface {
  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  timeForTraining: TimeForTrainingType;

  @Prop({
    required: true,
    trim: true,
    type: 'number',
  })
  allCaloriesToReset: number;

  @Prop({
    required: true,
    trim: true,
    type: 'number',
  })
  caloriesToResetInDay: number;

  @Prop({
    required: true,
    trim: true,
    type: 'Boolean',
  })
  trainingIsReady: boolean;


  public async fillObject(dto: StudentCreateUserDto): Promise<this> {
    const { name, email, password, gender, role, dateOfBirth, description, location, avatar, imageForSite, skillLevel, trainingType, timeForTraining, allCaloriesToReset, caloriesToResetInDay, trainingIsReady } = dto;

    this.name = name;
    this.email = email;
    this.passwordHash = await generateHash(password);
    this.gender = gender;
    this.role = role;
    this.dateOfBirth = dateOfBirth;
    this.description = description;
    this.location = location;
    this.avatar = avatar;
    this.imageForSite = imageForSite;

    this.skillLevel = skillLevel;
    this.trainingType = trainingType;

    this.timeForTraining = timeForTraining;
    this.allCaloriesToReset = allCaloriesToReset;
    this.caloriesToResetInDay = caloriesToResetInDay;
    this.trainingIsReady = trainingIsReady;


    return this;
  }

}


export const StudentUserEntitySchema = SchemaFactory.createForClass(StudentUserEntity);



@Schema({
  collection: 'users',
  timestamps: true,
})
export class CoachUserEntity extends BaseUserEntity implements CoachRoleInterface {
  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  certificates: string;

  @Prop({
    required: true,
    trim: true,
    type: 'string',
  })
  awardsToCoach: string;

  @Prop({
    required: true,
    trim: true,
    type: 'Boolean',
  })
  personalTraining: boolean;


  public async fillObject(dto: CoachCreateUserDto): Promise<this> {
    const { name, email, password, gender, role, dateOfBirth, description, location, avatar, imageForSite, skillLevel, trainingType, certificates, awardsToCoach, personalTraining } = dto;

    this.name = name;
    this.email = email;
    this.passwordHash = await generateHash(password);
    this.gender = gender;
    this.role = role;
    this.dateOfBirth = dateOfBirth;
    this.description = description;
    this.location = location;
    this.avatar = avatar;
    this.imageForSite = imageForSite;

    this.skillLevel = skillLevel;
    this.trainingType = trainingType;

    this.certificates = certificates;
    this.awardsToCoach = awardsToCoach;
    this.personalTraining = personalTraining;


    return this;
  }

}

export const CoachUserEntitySchema = SchemaFactory.createForClass(CoachUserEntity);

