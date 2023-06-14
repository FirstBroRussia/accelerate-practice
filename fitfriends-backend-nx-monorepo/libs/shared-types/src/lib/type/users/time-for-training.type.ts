import { TimeForTrainingEnum } from "@fitfriends-backend-nx-monorepo/shared-types";


export type TimeForTrainingType = typeof TimeForTrainingEnum[keyof typeof TimeForTrainingEnum];
