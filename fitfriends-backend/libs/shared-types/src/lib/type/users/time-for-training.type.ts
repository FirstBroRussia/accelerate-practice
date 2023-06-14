import { TimeForTrainingEnum } from "@fitfriends-backend/shared-types";


export type TimeForTrainingType = typeof TimeForTrainingEnum[keyof typeof TimeForTrainingEnum];
