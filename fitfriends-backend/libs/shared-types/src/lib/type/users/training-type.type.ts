import { TrainingTypeEnum } from "@fitfriends-backend/shared-types";


export type TrainingType = typeof TrainingTypeEnum[keyof typeof TrainingTypeEnum];
