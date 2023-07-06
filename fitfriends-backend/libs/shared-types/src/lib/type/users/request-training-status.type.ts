import { RequestTrainingStatusEnum } from "@fitfriends-backend/shared-types";


export type RequestTrainingStatusType = typeof RequestTrainingStatusEnum[keyof typeof RequestTrainingStatusEnum];
