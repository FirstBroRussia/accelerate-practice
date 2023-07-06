import { RequestTrainingEnum } from "@fitfriends-backend/shared-types";


export type RequestTrainingType = typeof RequestTrainingEnum[keyof typeof RequestTrainingEnum];
