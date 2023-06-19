import { BackgroundImageForUsercardType, GenderType, LocationMetroType, SkillLevelType, TimeForTrainingType, TrainingType, UserInterface, UserRoleType } from "@fitfriends-backend/shared-types";
import { Expose } from "class-transformer";


export class BaseCreateUserRdo implements UserInterface {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  gender: GenderType;

  @Expose()
  role: UserRoleType;

  @Expose()
  dateOfBirth: string;

  @Expose()
  description: string;

  @Expose()
  location: LocationMetroType;

  @Expose()
  avatar: string;

  @Expose()
  imageForSite: BackgroundImageForUsercardType;

  @Expose()
  skillLevel: SkillLevelType;

  @Expose()
  trainingType: TrainingType[];

  @Expose()
  createdAt: string;

}

export class StudentCreateUserRdo extends BaseCreateUserRdo {
  @Expose()
  public timeForTraining: TimeForTrainingType;

  @Expose()
  public allCaloriesToReset: number;

  @Expose()
  public caloriesToResetInDay: number;

  @Expose()
  public trainingIsReady: boolean;
}

export class CoachCreateUserRdo extends BaseCreateUserRdo {
  @Expose()
  certificates: string;

  @Expose()
  awardsToCoach: string;

  @Expose()
  personalTraining: boolean;
}
