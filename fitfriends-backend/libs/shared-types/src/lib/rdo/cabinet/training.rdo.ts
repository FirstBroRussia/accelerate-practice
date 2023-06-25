import { GenderType, SkillLevelType, TimeForTrainingType, TrainingType } from "@fitfriends-backend/shared-types";
import { TrainingInterface } from "../../interface/cabinet/training.interface";
import { Expose, Transform } from "class-transformer";


export class TrainingRdo implements TrainingInterface {
  @Expose()
  @Transform(({ value, obj }) => {
    try {
      return obj._id.toString();
    } catch {
      return value;
    }
  })
  id: string;

  @Expose()
  name: string;

  @Expose()
  skillLevel: SkillLevelType;

  @Expose()
  trainingType: TrainingType;

  @Expose()
  timeForTraining: TimeForTrainingType;

  @Expose()
  price: number;

  @Expose()
  quantityOfCalories: number;

  @Expose()
  description: string;

  @Expose()
  gender: GenderType;

  @Expose()
  videoOfTraining: string;

  @Expose()
  rating?: number;

  @Expose()
  specialOffer?: boolean;

  @Expose()
  coachCreator: string;

}
