import { SkillLevelType, TimeForTrainingType, TrainingType } from "@fitfriends-backend-nx-monorepo/shared-types";


export interface StudentRoleInterface {
  skillLevel?: SkillLevelType;

  trainingType?: TrainingType[];

  timeForTraining?: TimeForTrainingType;

  allCaloriesToReset?: number;

  caloriesToResetInDay?: number;

  trainingIsReady?: boolean;
}
