import { GenderType, SkillLevelType, TimeForTrainingType, TrainingType } from "@fitfriends-backend/shared-types";


export interface CoachTrainingInterface {
  name?: string;

  skillLevel?: SkillLevelType;

  trainingType?: TrainingType;

  timeForTraining?: TimeForTrainingType;

  price?: number;

  quantityOfCalories?: number;

  description?: string;

  gender?: GenderType;

  videoOfTraining?: string;

  rating?: number;

  coachCreator?: string;

  specialOffer?: boolean;
}
