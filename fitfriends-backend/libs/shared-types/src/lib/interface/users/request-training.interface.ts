import { RequestTrainingStatusType } from "@fitfriends-backend/shared-types";


export interface RequestTrainingInterface {
  creatorUserId?: string;

  targetUserId?: string;

  status?: RequestTrainingStatusType;

  createdAt?: string;

  updatedAt?: string;
}
