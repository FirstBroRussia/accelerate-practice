import { Expose, Transform } from "class-transformer";
import { BackgroundImageForUsercardType } from "../../type/users/background-image-for-usercard.type";
import { GenderType } from "../../type/users/gender.type";
import { LocationMetroType } from "../../type/users/location-metro.type";
import { SkillLevelType } from "../../type/users/skill-level.type";
import { TimeForTrainingType } from "../../type/users/time-for-training.type";
import { TrainingType } from "../../type/users/training-type.type";
import { UserRoleType } from "../../type/users/user-role.type";
import { StudentCreateUserRdo } from "./create-user.rdo";


export class StudentUserRdo implements StudentCreateUserRdo {
  @Expose()
  @Transform(({ value, obj }) => {
    if (!obj._id && value) {
      return value;
    } else {
      return obj._id.toString();
    }
  })
  id: string;

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

  @Expose()
  timeForTraining: TimeForTrainingType;

  @Expose()
  allCaloriesToReset: number;

  @Expose()
  caloriesToResetInDay: number;

  @Expose()
  trainingIsReady: boolean;

}
