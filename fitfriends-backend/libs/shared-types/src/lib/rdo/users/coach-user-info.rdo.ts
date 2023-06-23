import { Expose, Transform } from "class-transformer";
import { CoachCreateUserRdo } from "./create-user.rdo";
import { BackgroundImageForUsercardType, GenderType, LocationMetroType, SkillLevelType, TrainingType, UserRoleType } from "@fitfriends-backend/shared-types";


export class CoachUserRdo implements CoachCreateUserRdo {
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
  certificates: string;

  @Expose()
  awardsToCoach: string;

  @Expose()
  personalTraining: boolean;

}
