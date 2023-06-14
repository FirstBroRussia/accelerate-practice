import { TrainingTypeEnum } from "@fitfriends-backend-nx-monorepo/shared-types";


export type TrainingType = typeof TrainingTypeEnum[keyof typeof TrainingTypeEnum];
