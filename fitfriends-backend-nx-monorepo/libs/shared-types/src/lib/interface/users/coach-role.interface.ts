import { SkillLevelType, TrainingType } from "@fitfriends-backend-nx-monorepo/shared-types";


export interface CoachRoleInterface {
  skillLevel?: SkillLevelType;

  trainingType?: TrainingType[];

  certificates?: string;

  awardsToCoach?: string;

  personalTraining?: boolean;
}
